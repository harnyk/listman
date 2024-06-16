import { useSWRConfig } from 'swr';
import { useDependencies } from './useDependencies';
import { swrKeyTreeRoots } from './swr/keys';

export const useTreeInitWithTestData = () => {
    const { treeRepo } = useDependencies();

    const initWithTestData = async () => {
        await treeRepo.clear();
        const list1 = await treeRepo.createItem({
            parentId: null,
            title: 'My List',
            checked: false,
        });

        await treeRepo.createItem({
            parentId: list1.id,
            title: 'My Task',
            checked: false,
        });

        await treeRepo.createItem({
            parentId: list1.id,
            title: 'My Task 2',
            checked: false,
        });

        const list2 = await treeRepo.createItem({
            parentId: null,
            title: 'My List 2',
            checked: false,
        });

        await treeRepo.createItem({
            parentId: list2.id,
            title: 'My Task 3',
            checked: false,
        });

        const task4 = await treeRepo.createItem({
            parentId: list2.id,
            title: 'My Task 4',
            checked: false,
        });

        await treeRepo.createItem({
            parentId: task4.id,
            title: 'My Task 5',
            checked: false,
        });
    };

    const { mutate } = useSWRConfig();

    return async () => {
        await initWithTestData();
        mutate(swrKeyTreeRoots());
    };
};
