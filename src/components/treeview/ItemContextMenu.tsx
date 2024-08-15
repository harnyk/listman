import { FC, useCallback, useState } from 'react';
import { FaTrash, FaCheck, FaStop, FaPlus } from 'react-icons/fa6';
import { ContextMenu, useContextMenu } from './ContextMenu';
import classes from './ItemContextMenu.module.css';

interface ItemMenuProps {
    itemId: string;
    onRemove?: (itemId: string) => void;
    onCreateSubItem?: (parentItemId: string) => void;
}

const ItemMenu: FC<ItemMenuProps> = ({ itemId, onRemove, onCreateSubItem }) => {
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

    const contextApi = useContextMenu();

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

    const handleCreateSubItem = useCallback(() => {
        onCreateSubItem?.(itemId);
        contextApi.close();
    }, [onCreateSubItem, itemId, contextApi]);

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

            <div className={classes.menuSeparator} />
            <div className={classes.menuItem} onClick={handleCreateSubItem}>
                <FaPlus />
                Create sub-item
            </div>
        </div>
    );
};

export const ItemContextMenu: FC<ItemMenuProps> = (props) => {
    return <ContextMenu>{() => <ItemMenu {...props} />}</ContextMenu>;
};
