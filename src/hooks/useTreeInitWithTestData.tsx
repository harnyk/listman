import { useSWRConfig } from 'swr';
import { useTreeRepo } from './useTreeRepo';

export const useTreeInitWithTestData = () => {
    const repo = useTreeRepo();

    const initWithTestData = async () => {
        await repo.clear();
        const list1 = await repo.createItem({
            parentId: null,
            title: 'My List',
            checked: false,
        });

        await repo.createItem({
            parentId: list1.id,
            title: 'My Task',
            checked: false,
        });

        await repo.createItem({
            parentId: list1.id,
            title: 'My Task 2',
            checked: false,
        });

        const list2 = await repo.createItem({
            parentId: null,
            title: 'My List 2',
            checked: false,
        });

        await repo.createItem({
            parentId: list2.id,
            title: 'My Task 3',
            checked: false,
        });

        await repo.createItem({
            parentId: list2.id,
            title: 'My Task 4',
            checked: false,
        });
    };

    const { mutate } = useSWRConfig();

    return async () => {
        await initWithTestData();
        mutate('tree/roots');
    };
};
