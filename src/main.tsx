import React from 'react';
import ReactDOM from 'react-dom/client';
import { TreeProvider } from './contexts/TreeProvider.tsx';
import { TreeRepo_LocalStorage } from './repos/TreeRepo_LocalStorage.ts';

import { RouterProvider, createRouter } from '@tanstack/react-router';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

const repo = new TreeRepo_LocalStorage();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <TreeProvider repo={repo}>
            <RouterProvider router={router} />
        </TreeProvider>
    </React.StrictMode>
);
