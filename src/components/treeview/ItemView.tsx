import { TreeItemWithChildren } from '../../entities/TreeItemWithChildren';
import { ItemCheckbox } from './ItemCheckbox';
import { ItemTitle } from './ItemTitle';
import { ItemContextMenu } from './ItemContextMenu';

interface ItemViewProps {
    item: TreeItemWithChildren;
    variant: 'header' | 'item';
    onCheckChange?: (id: string, checked: boolean) => void;
    onTitleChange?: (id: string, title: string) => void;
    onRemove?: (id: string) => void;
}

export const ItemView = ({
    item,
    variant,
    onCheckChange,
    onTitleChange,
    onRemove,
}: ItemViewProps) => {
    return (
        <>
            {variant === 'header' && (
                <h1>
                    <ItemContextMenu itemId={item.id} onRemove={onRemove} />
                    <ItemCheckbox item={item} onChange={onCheckChange} />
                    <ItemTitle item={item} onTitleChange={onTitleChange} />
                </h1>
            )}
            {variant === 'item' && (
                <li>
                    <ItemContextMenu itemId={item.id} onRemove={onRemove} />
                    <ItemCheckbox item={item} onChange={onCheckChange} />
                    <ItemTitle item={item} onTitleChange={onTitleChange} />
                </li>
            )}
            <ul>
                {(item.children ?? []).map((item) => (
                    <ItemView
                        key={item.id}
                        item={item}
                        variant="item"
                        onCheckChange={onCheckChange}
                        onTitleChange={onTitleChange}
                        onRemove={onRemove}
                    />
                ))}
            </ul>
        </>
    );
};
