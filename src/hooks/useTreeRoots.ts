import useSwr from 'swr';
import { useDependencies } from './useDependencies';
import { swrKeyTreeRoots } from './swr/keys';

export const useTreeRoots = () => {
    const { treeRepo } = useDependencies();
    const fetcher = async () => {
        return await treeRepo.getRootItems();
    };

    return useSwr(swrKeyTreeRoots(), fetcher);
};
