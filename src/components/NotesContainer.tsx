'use client';

import NotesList from '@/components/sidebar/NotesList';
import BlockEditor from '@/components/editor/BlockEditor';
import { useNotes } from '@/hooks/useNotes';
import { Block } from '@/types/note';

export default function NotesContainer() {
    const {
        notes,
        currentNote,
        currentNoteId,
        setCurrentNoteId,
        addNote,
        deleteNote,
        updateNote
    } = useNotes();

    const handleAddNote = () => {
        addNote('新建笔记');
    };

    const handleUpdateBlocks = (blocks: Block[]) => {
        if (currentNoteId) {
            updateNote(currentNoteId, { blocks });
        }
    };

    const handleUpdateTitle = (noteId: string, title: string) => {
        updateNote(noteId, { title });
    };

    return (
        <main className="flex min-h-screen bg-gray-50">
            <NotesList
                notes={notes}
                currentNoteId={currentNoteId}
                onNoteSelect={setCurrentNoteId}
                onAddNote={handleAddNote}
                onDeleteNote={deleteNote}
                onUpdateTitle={handleUpdateTitle}
            />
            <div className="flex-1">
                <div className="container mx-auto p-4">
                    <BlockEditor
                        note={currentNote}
                        onUpdateBlocks={handleUpdateBlocks}
                    />
                </div>
            </div>
        </main>
    );
} 