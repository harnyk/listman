import { createContext } from 'react';
import { ImportedListRepoInterface } from '../repos/ImportedLIstRepoInterface';
import { TreeRepoInterface } from '../repos/TreeRepoInterface';
import { CheckoutService } from '../services/CheckoutService';
import { CheckoutMetadataRepoInterface } from '../repos/CheckoutMetadataRepoInterface';

export interface Dependencies {
    treeRepo: TreeRepoInterface;
    importedListRepo: ImportedListRepoInterface;
    checkoutService: CheckoutService;
    checkoutMetadataRepo: CheckoutMetadataRepoInterface;
}

export const DependenciesContext = createContext<Dependencies | null>(null);

export const DependenciesProvider = ({
    children,
    ...dependencies
}: {
    children: React.ReactNode;
} & Dependencies) => {
    return (
        <DependenciesContext.Provider value={dependencies}>
            {children}
        </DependenciesContext.Provider>
    );
};
