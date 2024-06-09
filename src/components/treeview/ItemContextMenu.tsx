import { FC, useCallback, useState } from 'react';
import { FaTrash, FaCheck, FaStop } from 'react-icons/fa6';
import { ContextMenu } from './ContextMenu';
import classes from './ItemContextMenu.module.css';

interface ItemMenuProps {
    itemId: string;
    onRemove?: (itemId: string) => void;
}

const ItemMenu: FC<ItemMenuProps> = ({ itemId, onRemove }) => {
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

    const handleRemove = useCallback(
        () => setIsConfirmationOpen(true),
        [setIsConfirmationOpen]
    );

    const handleRemoveYes = useCallback(() => {
        setIsConfirmationOpen(false);
        onRemove?.(itemId);
    }, [setIsConfirmationOpen, onRemove, itemId]);

    const handleRemoveNo = useCallback(() => {
        setIsConfirmationOpen(false);
    }, [setIsConfirmationOpen]);

    return (
        <div>
            <div className={classes.menuItem} onClick={handleRemove}>
                <FaTrash />
                Remove
            </div>
            {isConfirmationOpen && (
                <>
                    <div className={classes.menuItem} onClick={handleRemoveYes}>
                        <FaCheck />
                        Yes
                    </div>
                    <div className={classes.menuItem} onClick={handleRemoveNo}>
                        <FaStop />
                        No
                    </div>
                </>
            )}
        </div>
    );
};

export const ItemContextMenu: FC<ItemMenuProps> = (props) => {
    return <ContextMenu>{() => <ItemMenu {...props} />}</ContextMenu>;
};
