import { createContext } from 'react';
import { TreeRepoInterface } from '../repos/TreeRepoInterface';
import { ImportedListRepoInterface } from '../repos/ImportedLIstRepoInterface';

export interface Dependencies {
    treeRepo: TreeRepoInterface;
    importedListRepo: ImportedListRepoInterface;
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
