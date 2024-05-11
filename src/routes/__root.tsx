import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const mode = import.meta.env.MODE;

export const Route = createRootRoute({
    component: () => (
        <>
            <Outlet />
            {mode !== 'production' ? <TanStackRouterDevtools /> : null}
        </>
    ),
});
