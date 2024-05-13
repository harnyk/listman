import { TreeItem } from './TreeItem';

export type TreeItemForCreation = Omit<
    TreeItem,
    'id' | 'createdAt' | 'childrenIds'
>;
