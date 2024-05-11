import { createFileRoute } from '@tanstack/react-router';
import { useTreeItem } from '../hooks/useTreeItem';
import { ItemView } from '../treeview/ItemView';
import { useCallback } from 'react';

export const Route = createFileRoute('/item/$itemId')({
    component: ItemPage,
});

function ItemPage() {
    const { itemId } = Route.useParams();
    const { data, setChecked, setTitle } = useTreeItem(itemId);

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

    return (
        <div>
            <div>
                {data && (
                    <ItemView
                        variant="header"
                        item={data}
                        onCheckChange={handleCheckedChange}
                        onTitleChange={handleTitleChange}
                    />
                )}
            </div>
        </div>
    );
}
