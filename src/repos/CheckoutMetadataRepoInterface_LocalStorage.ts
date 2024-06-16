import { appDomain } from '../shared/constants';
import { CheckoutMetadataRepoInterface } from './CheckoutMetadataRepoInterface';

export class CheckoutMetadataRepoInterface_LocalStorage
    implements CheckoutMetadataRepoInterface
{
    private static storageVersion = 1;
    private static collectionName = 'importedListToTree';

    private static idToKey(id: string) {
        return `${appDomain}.${this.storageVersion}.${this.collectionName}.${id}`;
    }

    async registerCheckout(
        importedListId: string,
        treeId: string
    ): Promise<void> {
        const key =
            CheckoutMetadataRepoInterface_LocalStorage.idToKey(importedListId);
        localStorage.setItem(key, treeId);
    }
    async getTreeIdByImportedListId(
        importedListId: string
    ): Promise<string | null> {
        const key =
            CheckoutMetadataRepoInterface_LocalStorage.idToKey(importedListId);
        return localStorage.getItem(key);
    }
}
