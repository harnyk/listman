import { useTreeInitWithTestData } from './hooks/useTreeInitWithTestData';
import { useTreeRoots } from './hooks/useTreeRoots';
import { RootsView } from './treeview/RootsView';

function App() {
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

export default App;
