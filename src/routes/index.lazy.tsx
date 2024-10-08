import { createLazyFileRoute } from '@tanstack/react-router';
import { useTreeInitWithTestData } from '../hooks/useTreeInitWithTestData';
import { useTreeRoots } from '../hooks/useTreeRoots';
import { RootsView } from '../components/treeview/RootsView';

export const Route = createLazyFileRoute('/')({
    component: Index,
});

function Index() {
    const { data } = useTreeRoots();
    const devInit = useTreeInitWithTestData();

    const handleDevInitClick = async () => {
        await devInit();
    };

    return (
        <div className="App">
            <div>{data && <RootsView items={data} />}</div>
            {import.meta.env.VITE_VERCEL_ENV !== 'production' ? (
                <div>
                    <button onClick={handleDevInitClick}>dev:init</button>
                </div>
            ) : null}
        </div>
    );
}
