import { useState, useRef, useEffect, type ReactNode } from 'react';

interface BlockMenuProps {
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
    isFirst: boolean;
    isLast: boolean;
    children: ReactNode;
}

export default function BlockMenu({
    onMoveUp,
    onMoveDown,
    onDelete,
    isFirst,
    isLast,
    children
}: BlockMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDotClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.preventDefault();
        e.stopPropagation();
        action();
        setIsOpen(false);
    };

    return (
        <div ref={menuRef}>
            <div
                onClick={handleDotClick}
                className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
            >
                {children}
            </div>

            {isOpen && (
                <div className="absolute left-full top-0 ml-2 bg-white shadow-lg rounded-lg py-1 min-w-[120px] z-30">
                    {!isFirst && (
                        <button
                            onClick={(e) => handleActionClick(e, onMoveUp)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                            上移
                        </button>
                    )}
                    {!isLast && (
                        <button
                            onClick={(e) => handleActionClick(e, onMoveDown)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                            下移
                        </button>
                    )}
                    <button
                        onClick={(e) => handleActionClick(e, onDelete)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-500"
                    >
                        删除
                    </button>
                </div>
            )}
        </div>
    );
}