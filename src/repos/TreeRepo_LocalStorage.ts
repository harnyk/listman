import { TreeItemWithChildren } from '../entities/TreeItemWithChildren';
import { TreeItem } from '../entities/TreeItem';
import { v4 } from 'uuid';
import { TreeRepoInterface } from './TreeRepoInterface';
import { TreeItemWithOptionalAutoFields } from '../entities/TreeItemWithOptionalID';

const storageVersion = 1;
const appDomain = 'org.harnyk.listman';
const collectionName = 'items';

function idToKey(id: string) {
    return `${appDomain}.${storageVersion}.${collectionName}.${id}`;
}

const hierarchyKey = `${appDomain}.${storageVersion}.hierarchy`;

type HierarchyCache = {
    $root: string[];
    [key: string]: string[];
};

export class TreeRepo_LocalStorage implements TreeRepoInterface {
    clear(): Promise<void> {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)!;
            if (key.startsWith(appDomain)) {
                localStorage.removeItem(key);
            }
        }
        return Promise.resolve();
    }

    async putItem(item: TreeItemWithOptionalAutoFields): Promise<TreeItem> {
        const id = item.id ?? v4();
        const createdAt = item.createdAt ?? new Date();
        const fullItem: TreeItem = { ...item, id, createdAt };

        localStorage.setItem(idToKey(id), JSON.stringify(fullItem));

        await this.#updateHierarchy(id, null, fullItem.parentId);

        return fullItem;
    }

    async deleteItem(id: string) {
        localStorage.removeItem(idToKey(id));
    }

    async setItemChecked(id: string, checked: boolean) {
        const item = await this.getItem(id);
        if (!item) {
            return;
        }
        item.checked = checked;
        await this.putItem(item);
    }

    async setItemTitle(id: string, title: string) {
        const item = await this.getItem(id);
        if (!item) {
            return;
        }
        item.title = title;
        await this.putItem(item);
    }

    async getItem(id: string): Promise<TreeItem | null> {
        const itemRaw = localStorage.getItem(idToKey(id));
        if (!itemRaw) {
            return null;
        }
        return JSON.parse(itemRaw);
    }

    async getItemsByIds(ids: string[]): Promise<(TreeItem | null)[]> {
        return Promise.all(ids.map((id) => this.getItem(id)));
    }

    async getRootItems(): Promise<TreeItem[]> {
        const hierarchy = await this.#getHierarchy();
        const ids = hierarchy.$root;
        return (await this.getItemsByIds(ids)).filter(
            (item): item is TreeItem => !!item
        );
    }

    async getTreeRecursively(itemId: string): Promise<TreeItemWithChildren[]> {
        const hierarchy = await this.#getHierarchy();
        const ids = hierarchy[itemId] || [];
        const items = await this.getItemsByIds(ids);

        const itemsWithChildren: TreeItemWithChildren[] = [];

        for (const item of items) {
            if (item) {
                itemsWithChildren.push(item);
                itemsWithChildren.push(
                    ...(await this.getTreeRecursively(item.id!))
                );
            }
        }

        return itemsWithChildren;
    }

    async #getHierarchy(): Promise<HierarchyCache> {
        const hierarchyRaw = localStorage.getItem(hierarchyKey);
        if (!hierarchyRaw) {
            return {
                $root: [],
            };
        }
        return JSON.parse(hierarchyRaw);
    }

    async getChildrenIds(parentId: string): Promise<string[]> {
        const hierarchy = await this.#getHierarchy();
        return hierarchy[parentId] || [];
    }

    async #updateHierarchy(
        itemId: string,
        prevParentId: string | null,
        newParentId: string | null,
        deleteItem = false
    ) {
        const hierarchy = await this.#getHierarchy();

        if (prevParentId) {
            hierarchy[prevParentId] = hierarchy[prevParentId].filter(
                (id) => id !== itemId
            );
        } else {
            hierarchy.$root = hierarchy.$root.filter((id) => id !== itemId);
        }

        if (!deleteItem) {
            if (newParentId) {
                if (!hierarchy[newParentId]) {
                    hierarchy[newParentId] = [];
                }
                hierarchy[newParentId] = [
                    ...new Set([...hierarchy[newParentId], itemId]),
                ];
            } else {
                hierarchy.$root = [...new Set([...hierarchy.$root, itemId])];
            }
        }

        localStorage.setItem(hierarchyKey, JSON.stringify(hierarchy));
    }
}
