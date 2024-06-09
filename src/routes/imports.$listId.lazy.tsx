import { createLazyFileRoute } from '@tanstack/react-router';
import { ImportedListItemView } from '../components/ImportedListItemView';
import { useImportedList } from '../hooks/useImportedList';

export const Route = createLazyFileRoute('/imports/$listId')({
    component: ImportedListPage,
});

function ImportedListPage() {
    const { listId } = Route.useParams();
    const { data } = useImportedList(listId);
    if (!data) {
        return null;
    }

    return (
        <div>
            <p>List Created: {data.CreatedAt}</p>
            <ul>
                {data.Items.map((item, index) => (
                    <ImportedListItemView key={index} item={item} />
                ))}
            </ul>
        </div>
    );
}
