import { useState, useEffect } from 'react';

const STORAGE_KEY = 'wingnotes-data';
const SAVE_DELAY = 1000; // 1秒后自动保存

export interface SaveStatus {
    status: 'saved' | 'saving' | 'error';
    lastSaved?: Date;
}

export function useAutoSave<T>(data: T): SaveStatus {
    const [saveStatus, setSaveStatus] = useState<SaveStatus>({ status: 'saved' });

    useEffect(() => {
        setSaveStatus({ status: 'saving' });

        const timeoutId = setTimeout(() => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
    }, [data]);

    return saveStatus;
}

export function loadSavedData<T>(): T | null {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error('Failed to load saved data:', error);
        return null;
    }
} 