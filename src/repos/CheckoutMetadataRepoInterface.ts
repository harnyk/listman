export interface CheckoutMetadataRepoInterface {
    registerCheckout: (importedListId: string, treeId: string) => Promise<void>;
    getTreeIdByImportedListId: (
        importedListId: string
    ) => Promise<string | null>;
}
