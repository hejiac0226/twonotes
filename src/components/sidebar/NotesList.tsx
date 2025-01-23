import { Note } from '@/types/note';
import { formatDate } from '@/utils/date';
import { BsPlusCircle as PlusIcon, BsTrash as TrashIcon } from 'react-icons/bs';
import { useState } from 'react';

interface NotesListProps {
    notes: Note[];
    currentNoteId: string | null;
    onNoteSelect: (noteId: string) => void;
    onAddNote: () => void;
    onDeleteNote: (noteId: string) => void;
    onUpdateTitle: (noteId: string, title: string) => void;
}

export default function NotesList({
    notes,
    currentNoteId,
    onNoteSelect,
    onAddNote,
    onDeleteNote,
    onUpdateTitle
}: NotesListProps) {
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

    const handleTitleClick = (noteId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setEditingNoteId(noteId);
    };

    const handleTitleChange = (noteId: string, newTitle: string) => {
        onUpdateTitle(noteId, newTitle);
    };

    const handleTitleBlur = () => {
        setEditingNoteId(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setEditingNoteId(null);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent, noteId: string) => {
        e.stopPropagation();
        if (confirm('确定要删除这个笔记吗？')) {
            onDeleteNote(noteId);
        }
    };

    return (
        <div className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">笔记列表</h2>
                    <button
                        onClick={onAddNote}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <span className="sr-only">新建笔记</span>
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-2">
                    {notes.map(note => (
                        <div
                            key={note.id}
                            className={`p-3 rounded-lg cursor-pointer group ${
                                note.id === currentNoteId
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'hover:bg-gray-50'
                            }`}
                            onClick={() => onNoteSelect(note.id)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1 font-medium">
                                    {editingNoteId === note.id ? (
                                        <input
                                            type="text"
                                            value={note.title}
                                            onChange={(e) => handleTitleChange(note.id, e.target.value)}
                                            onBlur={handleTitleBlur}
                                            onKeyDown={handleKeyDown}
                                            className="w-full bg-transparent outline-none border-b border-blue-300"
                                            autoFocus
                                        />
                                    ) : (
                                        <div
                                            onClick={(e) => handleTitleClick(note.id, e)}
                                            className="cursor-text"
                                        >
                                            {note.title}
                                        </div>
                                    )}
                                </div>
                                {note.id === currentNoteId && (
                                    <button
                                        onClick={(e) => handleDeleteClick(e, note.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded-full"
                                        title="删除笔记"
                                    >
                                        <TrashIcon className="w-4 h-4 text-red-500" />
                                    </button>
                                )}
                            </div>
                            <div className="text-sm text-gray-500">
                                {formatDate(note.updatedAt)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 