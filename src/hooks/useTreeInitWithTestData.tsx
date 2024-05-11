import { useSWRConfig } from 'swr';
import { useTreeRepo } from './useTreeRepo';

export const useTreeInitWithTestData = () => {
    const repo = useTreeRepo();

    const initWithTestData = async () => {
        await repo.clear();
        const list1 = await repo.putItem({
            parentId: null,
            title: 'My List',
            checked: false,
        });

        await repo.putItem({
            parentId: list1.id,
            title: 'My Task',
            checked: false,
        });

        await repo.putItem({
            parentId: list1.id,
            title: 'My Task 2',
            checked: false,
        });

        const list2 = await repo.putItem({
            parentId: null,
            title: 'My List 2',
            checked: false,
        });

        await repo.putItem({
            parentId: list2.id,
            title: 'My Task 3',
            checked: false,
        });

        await repo.putItem({
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
