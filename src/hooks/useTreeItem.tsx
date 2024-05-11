import useSwr from 'swr';
import { TreeItemWithChildren } from '../entities/TreeItemWithChildren';
import { useTreeRepo } from './useTreeRepo';

export const useTreeItem = (id: string) => {
    const repo = useTreeRepo();
    const fetcher = async (): Promise<TreeItemWithChildren | null> => {
        const item = await repo.getItem(id);
        if (!item) {
            return null;
        }
        const children = await repo.getTreeRecursively(id);
        return { ...item, children };
    };

    const result = useSwr(`tree/item/${id}`, fetcher);

    return {
        ...result,
        setChecked: async (id: string, checked: boolean) => {
            await repo.setItemChecked(id, checked);
            result.mutate();
        },
        setTitle: async (id: string, title: string) => {
            await repo.setItemTitle(id, title);
            result.mutate();
        },
    };
};
