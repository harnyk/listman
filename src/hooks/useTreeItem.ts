import useSwr from 'swr';
import { TreeItemWithChildren } from '../entities/TreeItemWithChildren';
import { useDependencies } from './useDependencies';

export const useTreeItem = (id: string) => {
    const { treeRepo } = useDependencies();
    const fetcher = async (): Promise<TreeItemWithChildren | null> => {
        const item = await treeRepo.getItem(id, true);
        if (!item) {
            return null;
        }
        return item;
    };

    const result = useSwr(`tree/item/${id}`, fetcher);

    return {
        ...result,
        setChecked: async (id: string, checked: boolean) => {
            await treeRepo.setItemChecked(id, checked);
            result.mutate();
        },
        setTitle: async (id: string, title: string) => {
            await treeRepo.setItemTitle(id, title);
            result.mutate();
        },
        remove: async (id: string) => {
            await treeRepo.deleteItem(id);
            result.mutate();
        },
    };
};
