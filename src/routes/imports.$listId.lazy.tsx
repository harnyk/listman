import { createLazyFileRoute } from '@tanstack/react-router';
import { ImportedListView } from '../components/importedlist/ImportedListView';
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

    return <ImportedListView list={list} />;
}
