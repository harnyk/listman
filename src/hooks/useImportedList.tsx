import useSWR from 'swr';
import { useDependencies } from './useDependencies';
import { swrKeyImportedList } from './swr/keys';

export function useImportedList(id: string) {
    const { importedListRepo } = useDependencies();
    const fetcher = async () => {
        return await importedListRepo.getList(id);
    };

    return useSWR(swrKeyImportedList(id), fetcher);
}
