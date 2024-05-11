import { createContext } from 'react';
import { TreeRepoInterface } from '../repos/TreeRepoInterface';

export const TreeContext = createContext<TreeRepoInterface | null>(null);

export const TreeProvider = ({
    children,
    repo,
}: {
    children: React.ReactNode;
    repo: TreeRepoInterface;
}) => {
    return <TreeContext.Provider value={repo}>{children}</TreeContext.Provider>;
};
