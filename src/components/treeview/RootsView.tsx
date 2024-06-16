import { Link } from '@tanstack/react-router';
import { TreeItem } from '../../entities/TreeItem';

export const RootsView = ({ items }: { items: TreeItem[] }) => {
    return (
        <div>
            <h1>Lists</h1>
            {items.map((item) => (
                <h2 key={item.id}>
                    <Link to={'/item/$itemId'} params={{ itemId: item.id }}>
                        {item.title}
                    </Link>
                </h2>
            ))}
        </div>
    );
};
