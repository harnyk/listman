import { createLazyFileRoute } from '@tanstack/react-router';
import { ImportedListItemView } from '../components/ImportedListItemView';
import { useImportedList } from '../hooks/useImportedList';

export const Route = createLazyFileRoute('/imports/$listId')({
    component: ImportedListPage,
});

function ImportedListPage() {
    const { listId } = Route.useParams();
    const { data: list } = useImportedList(listId);
    if (!list) {
        return null;
    }

    return (
        <div>
            <h1>{list.Title}</h1>
            <p>Created: {list.CreatedAt}</p>
            <ul>
                {list.Items.map((item, index) => (
                    <ImportedListItemView key={index} item={item} />
                ))}
            </ul>
        </div>
    );
}
