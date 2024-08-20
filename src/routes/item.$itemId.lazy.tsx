import { createLazyFileRoute } from '@tanstack/react-router';
import { useCallback } from 'react';
import { ItemView } from '../components/treeview/ItemView';
import { useTreeItem } from '../hooks/useTreeItem';

export const Route = createLazyFileRoute('/item/$itemId')({
    component: ItemPage,
});

function ItemPage() {
    const { itemId } = Route.useParams();
    const { data, setChecked, setTitle, remove, createSubItem } =
        useTreeItem(itemId);

    const handleCheckedChange = useCallback(
        (id: string, checked: boolean) => {
            setChecked(id, checked);
        },
        [setChecked]
    );

    const handleTitleChange = useCallback(
        (id: string, title: string) => {
            setTitle(id, title);
        },
        [setTitle]
    );

    const handleRemove = useCallback(
        (id: string) => {
            remove(id);
        },
        [remove]
    );

    const handleCreateSubItem = useCallback(
        (parentItemId: string) => {
            createSubItem(parentItemId);
        },
        [createSubItem]
    );

    return (
        <div>
            <div>
                {data && (
                    <ItemView
                        variant="header"
                        item={data}
                        onCheckChange={handleCheckedChange}
                        onTitleChange={handleTitleChange}
                        onRemove={handleRemove}
                        onCreateSubItem={handleCreateSubItem}
                    />
                )}
            </div>
        </div>
    );
}
