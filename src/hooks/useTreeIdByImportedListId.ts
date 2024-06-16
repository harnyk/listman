import useSWR from 'swr';
import { useDependencies } from './useDependencies';
import { swrKeyTreeIdByImportedListId } from './swr/keys';

export function useTreeIdByImportedListId(importedListId: string) {
    const { checkoutMetadataRepo } = useDependencies();
    return useSWR(
        swrKeyTreeIdByImportedListId(importedListId),
        async () => {
            const treeId =
                await checkoutMetadataRepo.getTreeIdByImportedListId(
                    importedListId
                );
            return treeId;
        },
        { revalidateOnFocus: false }
    );
}
