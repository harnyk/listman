import { useClickAway } from 'react-use';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { usePopper } from 'react-popper';
import { FC, useCallback, useRef, useState } from 'react';
import classes from './ContextMenu.module.css';
import clsx from 'clsx';
import { createPortal } from 'react-dom';

interface ContextMenuProps {
    children: () => React.ReactNode;
}

export const ContextMenu: FC<ContextMenuProps> = ({ children }) => {
    const [referenceElement, setReferenceElement] =
        useState<HTMLElement | null>(null);
    const [popperElement, setPopperElement] = useState<HTMLElement | null>(
        null
    );
    const { styles, attributes } = usePopper(referenceElement, popperElement);
    const [isOpen, setIsOpen] = useState(false);
    const handleIconClick = useCallback(() => setIsOpen(true), []);

    const iconClass = clsx(classes.icon, {
        [classes.iconActive]: isOpen,
    });

    const clickAwayTargetRef = useRef(null);
    useClickAway(clickAwayTargetRef, () => {
        setIsOpen(false);
    });

    const menuInPortal = createPortal(
        <div
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
        >
            <div ref={clickAwayTargetRef}>
                <div className={classes.menuInner}>{children()}</div>
            </div>
        </div>,
        document.body
    );

    return (
        <>
            <span ref={setReferenceElement} onClick={handleIconClick}>
                <FaEllipsisVertical className={iconClass} />
            </span>
            {isOpen ? menuInPortal : null}
        </>
    );
};
