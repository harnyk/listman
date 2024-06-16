import { ImportedListItem } from '../../entities/ImportedListItem';

export const ImportedListItemView: React.FC<{ item: ImportedListItem }> = ({
    item,
}) => {
    return (
        <>
            <div>
                {item.Note ? (
                    <>
                        {item.Name}: {item.Note}
                    </>
                ) : (
                    <>{item.Name}</>
                )}
            </div>
        </>
    );
};
