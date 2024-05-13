import { TreeItemWithChildren } from '../entities/TreeItemWithChildren';
import { TreeItem } from '../entities/TreeItem';
import { v4 } from 'uuid';
import { TreeRepoInterface } from './TreeRepoInterface';
import { TreeItemForCreation } from '../entities/TreeItemForCreation';

const storageVersion = 1;
const appDomain = 'org.harnyk.listman';
const collectionName = 'items';
const rootId = '$root';

function idToKey(id: string) {
    return `${appDomain}.${storageVersion}.${collectionName}.${id}`;
}

export class TreeRepo_LocalStorage implements TreeRepoInterface {
    async getItem(id: string, recursively = false): Promise<TreeItem | null> {
        if (recursively) {
            return this.#getItemRecursively(id);
        }

        const itemRaw = localStorage.getItem(idToKey(id));
        if (!itemRaw) {
            return null;
        }
        return JSON.parse(itemRaw);
    }

    async getRootItems(): Promise<TreeItem[]> {
        const root = await this.#ensureRootItem();
        const childIds = root.childrenIds;

        const items = await this.#getItemsByIds(childIds);

        return items.filter((item): item is TreeItem => !!item);
    }

    async createItem(item: TreeItemForCreation): Promise<TreeItem> {
        const id = v4();
        const createdAt = new Date();
        const childrenIds: string[] = [];
        const parentId = item.parentId ?? rootId;
        const fullItem: TreeItem = {
            ...item,
            id,
            createdAt,
            childrenIds,
            parentId,
        };

        const existingItem = await this.getItem(id);
        if (existingItem) {
            throw new Error(`Item with id ${id} already exists`);
        }

        await this.#persist(fullItem);

        await this.#addChildId(fullItem.parentId, id);

        return fullItem;
    }

    async deleteItem(id: string): Promise<void> {
        const item = await this.getItem(id);
        if (!item) {
            return;
        }

        const childIds = item.childrenIds;
        for (const childId of childIds) {
            await this.deleteItem(childId);
        }

        await this.#removeChildId(item.parentId, id);
        localStorage.removeItem(idToKey(id));
    }

    async setItemChecked(id: string, checked: boolean) {
        const item = await this.getItem(id);
        if (!item) {
            return;
        }
        item.checked = checked;
        await this.#persist(item);
    }

    async setItemTitle(id: string, title: string) {
        const item = await this.getItem(id);
        if (!item) {
            return;
        }
        item.title = title;
        await this.#persist(item);
    }

    async clear(): Promise<void> {
        return this.deleteItem(rootId);
    }

    async #ensureRootItem(): Promise<TreeItem> {
        let item = await this.getItem(rootId);
        if (!item) {
            const createdAt = new Date();
            item = {
                id: rootId,
                parentId: null,
                title: 'Lists',
                createdAt,
                checked: false,
                childrenIds: [],
            };
            await this.#persist(item);
        }

        return item;
    }

    async #persist(item: TreeItem): Promise<void> {
        localStorage.setItem(idToKey(item.id), JSON.stringify(item));
    }

    async #addChildId(parentId: string | null, childId: string) {
        await this.#ensureRootItem();

        if (!parentId) {
            return;
        }
        const parent = await this.getItem(parentId);
        if (!parent) {
            return;
        }
        const childrenIdsSet = new Set(parent.childrenIds);
        childrenIdsSet.add(childId);
        parent.childrenIds = [...childrenIdsSet];

        await this.#persist(parent);
    }

    async #removeChildId(parentId: string | null, childId: string) {
        if (!parentId) {
            return;
        }
        const parent = await this.getItem(parentId);
        if (!parent) {
            return;
        }
        const childrenIdsSet = new Set(parent.childrenIds);
        childrenIdsSet.delete(childId);
        parent.childrenIds = [...childrenIdsSet];

        await this.#persist(parent);
    }

    async #getItemsByIds(ids: string[]): Promise<(TreeItem | null)[]> {
        return Promise.all(ids.map((id) => this.getItem(id)));
    }

    async #getItemRecursively(
        itemId: string
    ): Promise<TreeItemWithChildren | null> {
        const item = await this.getItem(itemId);
        if (!item) {
            return null;
        }

        const children: TreeItemWithChildren[] = [];

        for (const childId of item.childrenIds) {
            const child = await this.#getItemRecursively(childId);
            if (child) {
                children.push(child);
            }
        }

        return { ...item, children };
    }
}
