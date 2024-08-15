import { CheckoutMetadataRepoInterface } from '../repos/CheckoutMetadataRepoInterface';
import { ImportedListRepoInterface } from '../repos/ImportedListRepoInterface';
import { TreeRepoInterface } from '../repos/TreeRepoInterface';

export class CheckoutService {
    constructor(
        private importedListRepo: ImportedListRepoInterface,
        private treeRepo: TreeRepoInterface,
        private checkoutMetadataRepo: CheckoutMetadataRepoInterface
    ) {}

    async checkOut(importedListId: string): Promise<string> {
        const importedList =
            await this.importedListRepo.getList(importedListId);
        if (!importedList) {
            throw new Error('Imported list not found');
        }

        const root = await this.treeRepo.createItem({
            parentId: null,
            title: importedList.Title,
            checked: false,
        });

        for (const item of importedList.Items) {
            const title = item.Name + (item.Note ? ` (${item.Note})` : '');

            await this.treeRepo.createItem({
                parentId: root.id,
                title,
                checked: false,
            });
        }

        await this.checkoutMetadataRepo.registerCheckout(
            importedListId,
            root.id
        );

        return root.id;
    }
}
