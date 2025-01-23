import ClientBlockEditor from './ClientBlockEditor';
import { Note, Block } from '@/types/note';

interface BlockEditorProps {
    note: Note | null;
    onUpdateBlocks?: (blocks: Block[]) => void;
}

export default function BlockEditor({ note, onUpdateBlocks }: BlockEditorProps) {
    if (!note) {
        return (
            <div className="flex items-center justify-center h-[200px] text-gray-500">
                请选择或创建一个笔记
            </div>
        );
    }

    return <ClientBlockEditor blocks={note.blocks || []} onBlocksChange={onUpdateBlocks} />;
} 