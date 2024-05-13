import { TreeItemForCreation } from '../entities/TreeItemForCreation';
import { TreeItemWithChildren } from '../entities/TreeItemWithChildren';
import { TreeItem } from '../entities/TreeItem';

export interface TreeRepoInterface {
    getItem(
        id: string,
        recursively: true
    ): Promise<TreeItemWithChildren | null>;
    getItem(id: string, recursively?: false): Promise<TreeItem | null>;
    getItem(
        id: string,
        recursively?: boolean
    ): Promise<TreeItem | TreeItemWithChildren | null>;

    getRootItems(): Promise<TreeItem[]>;

    createItem(item: TreeItemForCreation): Promise<TreeItem>;
    deleteItem(id: string): Promise<void>;

    setItemChecked(id: string, checked: boolean): Promise<void>;
    setItemTitle(id: string, title: string): Promise<void>;

    clear(): Promise<void>;
}
