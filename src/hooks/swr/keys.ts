import { Key } from 'swr';

export const swrKeyTreeRoots = () => 'tree-roots';

export const swrKeyTreeIdByImportedListId = (importedListId: string): Key => [
    'tree-id-by-imported-list-id',
    importedListId,
];

export const swrKeyImportedList = (id: string): Key => ['imported-list', id];

export const swrKeyTreeItem = (id: string): Key => ['tree-item', id];
