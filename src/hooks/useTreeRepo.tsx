import { useContext } from 'react';
import { TreeRepoInterface } from '../repos/TreeRepoInterface';
import { TreeContext } from '../contexts/TreeProvider';

export function useTreeRepo(): TreeRepoInterface {
    const repo = useContext(TreeContext);
    if (!repo) {
        throw new Error('TreeProvider not found');
    }
    return repo;
}
