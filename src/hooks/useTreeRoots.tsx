import useSwr from 'swr';
import { useTreeRepo } from './useTreeRepo';

export const useTreeRoots = () => {
    const repo = useTreeRepo();
    const fetcher = async () => {
        return await repo.getRootItems();
    };

    return useSwr('tree/roots', fetcher);
};
