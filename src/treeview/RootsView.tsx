import { Link } from '@tanstack/react-router';
import { TreeItem } from '../entities/TreeItem';

export const RootsView = (items: TreeItem[]) => {
    return (
        <div>
            <h1>Lists</h1>
            {items.map((item) => (
                <h2>
                    <Link to={'/item/$itemId'} params={{ itemId: item.id }}>
                        {item.title}
                    </Link>
                </h2>
            ))}
        </div>
    );
};
