import { Link } from '@tanstack/react-router';
import { TreeItem } from '../../entities/TreeItem';
import cls from './RootsView.module.css';

export const RootsView = ({ items }: { items: TreeItem[] }) => {
    return (
        <div>
            <h1>Your locally stored lists</h1>
            {items.map((item) => (
                <h2 key={item.id}>
                    <Link to={'/item/$itemId'} params={{ itemId: item.id }}>
                        {item.title || (
                            <span className={cls.untitled}>
                                &lt;Untitled&gt;
                            </span>
                        )}
                    </Link>
                </h2>
            ))}
        </div>
    );
};
