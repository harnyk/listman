import { TreeItemWithOptionalAutoFields } from '../entities/TreeItemWithOptionalID';
import { TreeItemWithChildren } from '../entities/TreeItemWithChildren';
import { TreeItem } from '../entities/TreeItem';

export interface TreeRepoInterface {
    getRootItems(): Promise<TreeItem[]>;
    getTreeRecursively(id: string): Promise<TreeItemWithChildren[]>;
    getItemsByIds(ids: string[]): Promise<(TreeItem | null)[]>;
    getItem(id: string): Promise<TreeItem | null>;
    putItem(item: TreeItemWithOptionalAutoFields): Promise<TreeItem>;
    deleteItem(id: string): Promise<void>;
    setItemChecked(id: string, checked: boolean): Promise<void>;
    setItemTitle(id: string, title: string): Promise<void>;
    getChildrenIds(parentId: string): Promise<string[]>;
    clear(): Promise<void>;
}
