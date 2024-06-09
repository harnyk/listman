import useSwr from 'swr';
import { useDependencies } from './useDependencies';

export const useTreeRoots = () => {
    const { treeRepo } = useDependencies();
    const fetcher = async () => {
        return await treeRepo.getRootItems();
    };

    return useSwr('tree/roots', fetcher);
};
