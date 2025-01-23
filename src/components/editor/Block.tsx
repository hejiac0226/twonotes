import { useState, useRef } from 'react';
import BlockMenu from './BlockMenu';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BlockProps {
    id: string;
    leftContent: string;
    rightContent: string;
    onLeftChange: (content: string) => void;
    onRightChange: (content: string) => void;
    onDelete: () => void;
    isFirst: boolean;
    isLast: boolean;
    onMove: (direction: 'up' | 'down') => void;
}

export default function Block({
    id,
    leftContent,
    rightContent,
    onLeftChange,
    onRightChange,
    onDelete,
    isFirst,
    isLast,
    onMove
}: BlockProps) {
    const [leftWidth, setLeftWidth] = useState(50); // 左栏宽度百分比
    const isDragging = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isDraggingBlock
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDraggingBlock ? 0.5 : 1,
    };

    const handleDragStart = () => {
        isDragging.current = true;
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', handleDragEnd);
    };

    const handleDrag = (e: MouseEvent) => {
        if (!isDragging.current || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;

        // 限制拖动范围在 30% 到 70% 之间
        setLeftWidth(Math.min(Math.max(newLeftWidth, 30), 70));
    };

    const handleDragEnd = () => {
        isDragging.current = false;
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleDragEnd);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex gap-0 min-h-[200px] bg-white rounded-lg shadow-md relative group"
        >
            {/* 操作菜单 */}
            <div
                className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2"
                {...attributes}
                {...listeners}
            >
                <BlockMenu
                    onDelete={onDelete}
                    onMoveUp={() => onMove('up')}
                    onMoveDown={() => onMove('down')}
                    isFirst={isFirst}
                    isLast={isLast}
                />
            </div>

            <div ref={containerRef} className="flex flex-1">
                {/* 左栏 */}
                <div style={{ width: `${leftWidth}%` }} className="p-4">
                    <textarea
                        className="w-full h-full resize-none outline-none"
                        value={leftContent}
                        onChange={(e) => onLeftChange(e.target.value)}
                        placeholder="在此输入描述内容..."
                    />
                </div>

                {/* 分隔线 */}
                <div
                    className="w-1 bg-gray-200 hover:bg-blue-400 cursor-col-resize transition-colors"
                    onMouseDown={handleDragStart}
                />

                {/* 右栏 */}
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