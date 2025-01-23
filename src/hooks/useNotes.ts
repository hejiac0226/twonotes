import { useState, useEffect } from 'react';
import { Note } from '@/types/note';
import { SaveStatus } from '@/hooks/useAutoSave';

const STORAGE_KEY = 'wingnotes-data';
const SAVE_DELAY = 1000;

export function useNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>({ status: 'saved' });

    // 加载笔记
    useEffect(() => {
        const savedNotes = loadSavedNotes();
        if (savedNotes && savedNotes.length > 0) {
            setNotes(savedNotes);
            setCurrentNoteId(savedNotes[0].id);
        }
    }, []);

    // 自动保存
    useEffect(() => {
        if (notes.length === 0) return;

        setSaveStatus({ status: 'saving' });
        const timeoutId = setTimeout(() => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
                setSaveStatus({
                    status: 'saved',
                    lastSaved: new Date()
                });
            } catch (error) {
                setSaveStatus({ status: 'error' });
                console.error('Failed to save:', error);
            }
        }, SAVE_DELAY);

        return () => clearTimeout(timeoutId);
    }, [notes]);

    const currentNote = notes.find(note => note.id === currentNoteId) || null;

    return {
        notes,
        currentNote,
        currentNoteId,
        saveStatus,
        setCurrentNoteId,
        addNote: (title: string) => {
            const newNote: Note = {
                id: crypto.randomUUID(),
                title,
                blocks: [],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            setNotes(prev => [...prev, newNote]);
            setCurrentNoteId(newNote.id);
        },
        updateNote: (noteId: string, updates: Partial<Note>) => {
            setNotes(prev => prev.map(note =>
                note.id === noteId
                    ? { ...note, ...updates, updatedAt: new Date() }
                    : note
            ));
        },
        deleteNote: (noteId: string) => {
            setNotes(prev => prev.filter(note => note.id !== noteId));
            if (currentNoteId === noteId) {
                setCurrentNoteId(notes[0]?.id || null);
            }
        }
    };
}

function loadSavedNotes(): Note[] | null {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error('Failed to load saved notes:', error);
        return null;
    }
} 