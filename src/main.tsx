import React from 'react';
import ReactDOM from 'react-dom/client';
import { DependenciesProvider } from './contexts/DependenciesProvider.tsx';
import { TreeRepo_LocalStorage } from './repos/TreeRepo_LocalStorage.ts';

import { RouterProvider, createRouter } from '@tanstack/react-router';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
import { ImportedListRepo_Impl } from './repos/ImportedListRepo_Impl.ts';

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

const treeRepo = new TreeRepo_LocalStorage();
const importedListRepo = new ImportedListRepo_Impl();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <DependenciesProvider
            treeRepo={treeRepo}
            importedListRepo={importedListRepo}
        >
            <RouterProvider router={router} />
        </DependenciesProvider>
    </React.StrictMode>
);
