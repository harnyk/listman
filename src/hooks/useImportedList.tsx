import useSWR from 'swr';
import { useDependencies } from './useDependencies';

export function useImportedList(id: string) {
    const { importedListRepo } = useDependencies();
    const fetcher = async () => {
        return await importedListRepo.getList(id);
    };

    return useSWR(`imports/${id}`, fetcher);
}
