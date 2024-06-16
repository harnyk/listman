import { RouterProvider, createRouter } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { DependenciesProvider } from './contexts/DependenciesProvider.tsx';
import { ImportedListRepo_Impl } from './repos/ImportedListRepo_Impl.ts';
import { TreeRepo_LocalStorage } from './repos/TreeRepo_LocalStorage.ts';
import { routeTree } from './routeTree.gen';
import { CheckoutService } from './services/CheckoutService.ts';
import { CheckoutMetadataRepoInterface_LocalStorage } from './repos/CheckoutMetadataRepoInterface_LocalStorage.ts';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

const treeRepo = new TreeRepo_LocalStorage();
const importedListRepo = new ImportedListRepo_Impl();
const checkoutMetadataRepo = new CheckoutMetadataRepoInterface_LocalStorage();
const checkoutService = new CheckoutService(
    importedListRepo,
    treeRepo,
    checkoutMetadataRepo
);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <DependenciesProvider
            treeRepo={treeRepo}
            importedListRepo={importedListRepo}
            checkoutService={checkoutService}
            checkoutMetadataRepo={checkoutMetadataRepo}
        >
            <RouterProvider router={router} />
        </DependenciesProvider>
    </React.StrictMode>
);
