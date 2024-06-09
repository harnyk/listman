import { useContext } from 'react';
import {
    Dependencies,
    DependenciesContext,
} from '../contexts/DependenciesProvider';

export function useDependencies(): Dependencies {
    const deps = useContext(DependenciesContext);
    if (!deps) {
        throw new Error('TreeProvider not found');
    }
    return deps;
}
