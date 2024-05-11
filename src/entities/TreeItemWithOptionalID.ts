import { TreeItem } from './TreeItem';

export type TreeItemWithOptionalAutoFields = Omit<
    TreeItem,
    'id' | 'createdAt'
> & {
    id?: string;
    createdAt?: Date;
};
