import { BsThreeDotsVertical } from 'react-icons/bs';
import { useState, useRef, useEffect } from 'react';

interface BlockMenuProps {
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
    isFirst: boolean;
    isLast: boolean;
}

export default function BlockMenu({
    onMoveUp,
    onMoveDown,
    onDelete,
    isFirst,
    isLast
}: BlockMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // 点击外部关闭菜单
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-gray-100 rounded-full"
            >
                <BsThreeDotsVertical className="w-4 h-4 text-gray-500" />
            </button>

            {isOpen && (
                <div className="absolute left-full ml-2 top-0 bg-white shadow-lg rounded-lg py-1 min-w-[120px] z-10">
                    {!isFirst && (
                        <button
                            onClick={() => { onMoveUp(); setIsOpen(false); }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                            上移
                        </button>
                    )}
                    {!isLast && (
                        <button
                            onClick={() => { onMoveDown(); setIsOpen(false); }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                            下移
                        </button>
                    )}
                    <button
                        onClick={() => { onDelete(); setIsOpen(false); }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-500"
                    >
                        删除
                    </button>
                </div>
            )}
        </div>
    );
} 