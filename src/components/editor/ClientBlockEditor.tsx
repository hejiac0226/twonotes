'use client';
import { useState, useEffect } from 'react';
import Block from './Block';
import AddBlockButton from './AddBlockButton';
import SaveStatusIndicator from './SaveStatus';
import { useAutoSave, loadSavedData } from '@/hooks/useAutoSave';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface BlockData {
    id: string;
    leftContent: string;
    rightContent: string;
}

export default function ClientBlockEditor() {
    const [mounted, setMounted] = useState(false);
    const [blocks, setBlocks] = useState<BlockData[]>([{
        id: '1',
        leftContent: '',
        rightContent: ''
    }]);

    useEffect(() => {
        setMounted(true);
        const saved = loadSavedData<BlockData[]>();
        if (saved) {
            setBlocks(saved);
        }
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setBlocks((blocks) => {
                const oldIndex = blocks.findIndex((block) => block.id === active.id);
                const newIndex = blocks.findIndex((block) => block.id === over.id);

                return arrayMove(blocks, oldIndex, newIndex);
            });
        }
    };

    const updateBlock = (id: string, field: 'leftContent' | 'rightContent', value: string) => {
        setBlocks(blocks.map(block =>
            block.id === id ? { ...block, [field]: value } : block
        ));
    };

    const deleteBlock = (id: string) => {
        setBlocks(blocks.filter(block => block.id !== id));
    };

    const addNewBlock = (index?: number) => {
        const newBlock = {
            id: Date.now().toString(),
            leftContent: '',
            rightContent: ''
        };

        if (typeof index === 'number') {
            const newBlocks = [...blocks];
            newBlocks.splice(index + 1, 0, newBlock);
            setBlocks(newBlocks);
        } else {
            setBlocks([...blocks, newBlock]);
        }
    };

    const saveStatus = useAutoSave(blocks);

    if (!mounted) {
        return null;
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col">
                <SortableContext
                    items={blocks.map(block => block.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {blocks.map((block, index) => (
                        <div key={block.id}>
                            <Block
                                id={block.id}
                                leftContent={block.leftContent}
                                rightContent={block.rightContent}
                                onLeftChange={(content) => updateBlock(block.id, 'leftContent', content)}
                                onRightChange={(content) => updateBlock(block.id, 'rightContent', content)}
                                onDelete={() => deleteBlock(block.id)}
                                isFirst={index === 0}
                                isLast={index === blocks.length - 1}
                            />
                            <AddBlockButton onClick={() => addNewBlock(index)} />
                        </div>
                    ))}
                </SortableContext>
                {blocks.length === 0 && (
                    <button
                        onClick={() => addNewBlock()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-fit"
                    >
                        添加第一个块
                    </button>
                )}
                <SaveStatusIndicator status={saveStatus} />
            </div>
        </DndContext>
    );
} 