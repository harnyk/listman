import useSWR from 'swr';
import { useDependencies } from './useDependencies';
import { swrKeyTreeIdByImportedListId } from './swr/keys';

export function useTreeIdByImportedListId(importedListId: string) {
    const { checkoutMetadataRepo, treeRepo } = useDependencies();
    return useSWR(
        swrKeyTreeIdByImportedListId(importedListId),
        async () => {
            const treeId =
                await checkoutMetadataRepo.getTreeIdByImportedListId(
                    importedListId
                );

            if (!treeId) {
                return null;
            }

            const treeItem = await treeRepo.getItem(treeId, false);
            if (!treeItem) {
                return null;
            }

            return treeId;
        },
        { revalidateOnFocus: false }
    );
}
