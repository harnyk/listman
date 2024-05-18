import clsx from 'clsx';
import { useCallback, useRef, useState } from 'react';
import useLongPress from 'react-use/esm/useLongPress';
import { TreeItemWithChildren } from '../entities/TreeItemWithChildren';
import classes from './ItemTitle.module.css';

export const ItemTitle = ({
    item,
    onTitleChange,
}: {
    item: Pick<TreeItemWithChildren, 'id' | 'title' | 'checked'>;
    onTitleChange?: (id: string, title: string) => void;
}) => {
    const [editMode, setEditMode] = useState(false);
    const [currentValue, setCurrentValue] = useState(item.title);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setCurrentValue(e.target.value);
        },
        [setCurrentValue]
    );

    const handleBlur = useCallback(() => {
        setEditMode(false);
        onTitleChange?.(item.id, currentValue);
    }, [item.id, onTitleChange, currentValue]);

    const enterEditMode = useCallback(() => {
        setEditMode(true);
        setTimeout(() => inputRef.current?.select());
    }, [setEditMode]);

    const longPressEvents = useLongPress(enterEditMode);

    const handleSpanKeyUp = useCallback(
        (e: React.KeyboardEvent<HTMLSpanElement>) => {
            if (e.key === 'Enter') {
                enterEditMode();
            }
        },
        [enterEditMode]
    );

    const handleInputKeyUp = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                handleBlur();
            }
        },
        [handleBlur]
    );

    const className = clsx({
        [classes.done]: item.checked,
    });

    if (!editMode) {
        return (
            <span
                className={className}
                tabIndex={0}
                onKeyUp={handleSpanKeyUp}
                {...longPressEvents}
            >
                {item.title}
            </span>
        );
    }

    return (
        <>
            <input
                type="text"
                ref={inputRef}
                value={currentValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyUp={handleInputKeyUp}
            />
        </>
    );
};
