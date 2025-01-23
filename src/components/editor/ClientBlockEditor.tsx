'use client';
import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Block from './Block';
import AddBlockButton from './AddBlockButton';
import { useAutoSave, SaveStatus } from '@/hooks/useAutoSave';
import SaveStatusIndicator from './SaveStatus';
import { Block as BlockType } from '@/types/note';

interface ClientBlockEditorProps {
    blocks: BlockType[];
    onBlocksChange?: (blocks: BlockType[]) => void;
}

export default function ClientBlockEditor({ blocks: initialBlocks, onBlocksChange }: ClientBlockEditorProps) {
    const [blocks, setBlocks] = useState<BlockType[]>(initialBlocks);

    // 当外部传入的 blocks 改变时，更新内部状态
    useEffect(() => {
        setBlocks(initialBlocks);
    }, [initialBlocks]);

    const handleBlockChange = (id: string, updates: Partial<BlockType>) => {
        const newBlocks = blocks.map(block =>
            block.id === id ? { ...block, ...updates } : block
        );
        setBlocks(newBlocks);
        onBlocksChange?.(newBlocks);
    };

    const handleAddBlock = (index: number) => {
        const newBlock: BlockType = {
            id: crypto.randomUUID(),
            leftContent: '',
            rightContent: '',
            leftWidth: 50  // 设置默认宽度
        };
        const newBlocks = [
            ...blocks.slice(0, index),
            newBlock,
            ...blocks.slice(index)
        ];
        setBlocks(newBlocks);
        onBlocksChange?.(newBlocks);
    };

    const handleDeleteBlock = (id: string) => {
        const newBlocks = blocks.filter(block => block.id !== id);
        setBlocks(newBlocks);
        onBlocksChange?.(newBlocks);
    };

    const handleMoveBlock = (id: string, direction: 'up' | 'down') => {
        const index = blocks.findIndex(block => block.id === id);
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex >= 0 && newIndex < blocks.length) {
            const newBlocks = arrayMove(blocks, index, newIndex);
            setBlocks(newBlocks);
            onBlocksChange?.(newBlocks);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = blocks.findIndex(block => block.id === active.id);
        const newIndex = blocks.findIndex(block => block.id === over.id);

        const newBlocks = arrayMove(blocks, oldIndex, newIndex);
        setBlocks(newBlocks);
        onBlocksChange?.(newBlocks);
    };

    return (
        <DndContext
            onDragEnd={handleDragEnd}
            collisionDetection={closestCenter}
        >
            <div className="space-y-4">
                {blocks.length === 0 ? (
                    <div className="mt-0">  {/* 为空状态的加号添加上边距 */}
                        <AddBlockButton
                            onClick={() => handleAddBlock(0)}
                        />
                    </div>
                ) : (
                    <SortableContext
                        items={blocks.map(block => block.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {blocks.map((block, index) => (
                            <div key={block.id}>
                                {index === 0 && (
                                    <div className="mb-4">  {/* 为第一个加号添加下边距 */}
                                        <AddBlockButton
                                            onClick={() => handleAddBlock(0)}
                                        />
                                    </div>
                                )}
                                <Block
                                    {...block}
                                    onLeftChange={(content) =>
                                        handleBlockChange(block.id, { leftContent: content })
                                    }
                                    onRightChange={(content) =>
                                        handleBlockChange(block.id, { rightContent: content })
                                    }
                                    onWidthChange={(width) =>
                                        handleBlockChange(block.id, { leftWidth: width })
                                    }
                                    onDelete={() => handleDeleteBlock(block.id)}
                                    onMove={(direction) => handleMoveBlock(block.id, direction)}
                                    isFirst={index === 0}
                                    isLast={index === blocks.length - 1}
                                />
                                <AddBlockButton
                                    onClick={() => handleAddBlock(index + 1)}
                                />
                            </div>
                        ))}
                    </SortableContext>
                )}
            </div>
        </DndContext>
    );
} 