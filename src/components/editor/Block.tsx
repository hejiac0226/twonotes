import { useState, useRef } from 'react';
import BlockMenu from './BlockMenu';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IoSettingsOutline, IoSwapVerticalOutline } from 'react-icons/io5';  // 使用设置和垂直交换图标

interface BlockProps {
    id: string;
    leftContent: string;
    rightContent: string;
    leftWidth: number;  // 添加左栏宽度属性
    onLeftChange: (content: string) => void;
    onRightChange: (content: string) => void;
    onWidthChange: (width: number) => void;  // 添加宽度变化回调
    onDelete: () => void;
    isFirst: boolean;
    isLast: boolean;
    onMove: (direction: 'up' | 'down') => void;
}

export default function Block({
    id,
    leftContent,
    rightContent,
    leftWidth: initialLeftWidth = 50,
    onLeftChange,
    onRightChange,
    onWidthChange,
    onDelete,
    isFirst,
    isLast,
    onMove
}: BlockProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleDragStart = (e: React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
        const startX = e.clientX;
        const startWidth = leftWidth;

        const handleDrag = (e: MouseEvent) => {
            if (!containerRef.current || !isDragging.current) return;
            const delta = e.clientX - startX;
            const containerWidth = containerRef.current.offsetWidth;
            const newWidth = Math.max(10, Math.min(90, startWidth + (delta / containerWidth) * 100));
            setLeftWidth(newWidth);
            onWidthChange(newWidth);
        };

        const handleDragEnd = () => {
            isDragging.current = false;
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', handleDragEnd);
        };

        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', handleDragEnd);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex gap-0 min-h-[200px] bg-white rounded-lg shadow-md relative ml-12"
        >
            <div className="absolute left-0 top-2 -translate-x-[40px] flex flex-col gap-2">
                <div
                    {...attributes}
                    {...listeners}
                    className="p-2 hover:bg-gray-100 rounded-full cursor-grab"
                >
                    <IoSwapVerticalOutline className="w-4 h-4 text-gray-400" />
                </div>
                <BlockMenu
                    onDelete={onDelete}
                    onMoveUp={() => onMove('up')}
                    onMoveDown={() => onMove('down')}
                    isFirst={isFirst}
                    isLast={isLast}
                >
                    <IoSettingsOutline className="w-4 h-4 text-gray-400" />
                </BlockMenu>
            </div>

            <div ref={containerRef} className="flex flex-1">
                <div style={{ width: `${leftWidth}%` }} className="p-4">
                    <textarea
                        className="w-full h-full resize-none outline-none"
                        value={leftContent}
                        onChange={(e) => onLeftChange(e.target.value)}
                        placeholder="在此输入描述内容..."
                    />
                </div>

                <div
                    className="w-1 bg-gray-200 hover:bg-blue-400 cursor-col-resize transition-colors"
                    onMouseDown={handleDragStart}
                />

                <div style={{ width: `${100 - leftWidth}%` }} className="p-4">
                    <textarea
                        className="w-full h-full resize-none outline-none"
                        value={rightContent}
                        onChange={(e) => onRightChange(e.target.value)}
                        placeholder="在此放置参考内容..."
                    />
                </div>
            </div>
        </div>
    );
} 