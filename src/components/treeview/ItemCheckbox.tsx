import { useCallback } from 'react';
import { TreeItemWithChildren } from '../../entities/TreeItemWithChildren';

export const ItemCheckbox = ({
    item,
    onChange,
}: {
    item: Pick<TreeItemWithChildren, 'checked' | 'id'>;
    onChange?: (id: string, checked: boolean) => void;
}) => {
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(item.id, e.target.checked);
        },
        [item.id, onChange]
    );

    return (
        <input
            type="checkbox"
            id={item.id}
            checked={item.checked}
            onChange={handleChange}
        />
    );
};
