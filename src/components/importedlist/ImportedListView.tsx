import { Link, useRouter } from '@tanstack/react-router';
import clsx from 'clsx';
import { FC, useCallback, useEffect, useState } from 'react';
import { ImportedList } from '../../entities/ImportedList';
import { useCheckout } from '../../hooks/useCheckout';
import { useTreeIdByImportedListId } from '../../hooks/useTreeIdByImportedListId';
import { ImportedListItemView } from './ImportedListItemView';
import cx from './ImportedListView.module.css';

interface ImportedListViewProps {
    list: ImportedList;
}

export const ImportedListView: FC<ImportedListViewProps> = ({ list }) => {
    const checkoutService = useCheckout();

    const [checkingOut, setCheckingOut] = useState(false);

    const { data: existingTreeId, mutate } = useTreeIdByImportedListId(list.ID);

    const handleCheckoutClick = useCallback(async () => {
        setCheckingOut(true);
        try {
            const treeId = await checkoutService.checkOut(list.ID);
            console.log(treeId);
            mutate();
        } finally {
            setCheckingOut(false);
        }
    }, [checkoutService, list.ID, mutate]);

    const { navigate } = useRouter();
    useEffect(() => {
        if (existingTreeId) {
            navigate({
                to: '/item/$itemId',
                params: { itemId: existingTreeId },
            });
        }
    }, [existingTreeId, navigate]);

    return (
        <div>
            <h1>{list.Title}</h1>
            <p>Created: {list.CreatedAt}</p>
            <ul>
                {list.Items.map((item, index) => (
                    <ImportedListItemView key={index} item={item} />
                ))}
            </ul>

            {existingTreeId ? (
                <div>
                    <Link
                        to={'/item/$itemId'}
                        params={{ itemId: existingTreeId }}
                    >
                        Go to list
                    </Link>
                </div>
            ) : (
                <div>
                    <button
                        onClick={handleCheckoutClick}
                        className={clsx(
                            cx.ctaButton,
                            checkingOut && cx.loading
                        )}
                        disabled={checkingOut}
                    >
                        {checkingOut ? 'Loading...' : 'Use this list'}
                    </button>
                    <p>
                        The list will be created on your device and you will be
                        able to edit it later.
                    </p>
                </div>
            )}
        </div>
    );
};
