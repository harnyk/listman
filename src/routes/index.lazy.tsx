import { createLazyFileRoute } from '@tanstack/react-router';
import { useTreeInitWithTestData } from '../hooks/useTreeInitWithTestData';
import { useTreeRoots } from '../hooks/useTreeRoots';
import { RootsView } from '../treeview/RootsView';

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
            <div>{data && RootsView(data)}</div>
            <div>
                <button onClick={handleDevInitClick}>dev:init</button>
            </div>
        </div>
    );
}
