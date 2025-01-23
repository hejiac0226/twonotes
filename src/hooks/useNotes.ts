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
        } else {
            // 如果没有保存的笔记，创建一个新笔记
            const newNote: Note = {
                id: crypto.randomUUID(),
                title: '新建笔记',
                blocks: [{
                    id: crypto.randomUUID(),
                    leftContent: '',
                    rightContent: '',
                    leftWidth: 50
                }],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            setNotes([newNote]);
            setCurrentNoteId(newNote.id);
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
                blocks: [{
                    id: crypto.randomUUID(),
                    leftContent: '',
                    rightContent: '',
                    leftWidth: 50
                }],
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
        if (!saved) return null;

        const parsedNotes = JSON.parse(saved) as Array<{
            id: string;
            title: string;
            blocks: Array<{
                id: string;
                leftContent: string;
                rightContent: string;
                leftWidth: number;
            }>;
            createdAt: string;  // JSON.parse 会将日期解析为字符串
            updatedAt: string;
        }>;

        // 将日期字符串转换回 Date 对象
        return parsedNotes.map(note => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt)
        }));
    } catch (error) {
        console.error('Failed to load saved notes:', error);
        return null;
    }
} 