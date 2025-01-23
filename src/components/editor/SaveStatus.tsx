'use client';
import { SaveStatus } from '@/hooks/useAutoSave';
import { useEffect, useState } from 'react';

interface SaveStatusProps {
    status: SaveStatus;
}

export default function SaveStatusIndicator({ status }: SaveStatusProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 text-sm text-gray-600 bg-white rounded-lg shadow-md px-4 py-2">
            {status.status === 'saving' && (
                <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    正在保存...
                </span>
            )}
            {status.status === 'saved' && (
                <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    已保存 {status.lastSaved && (
                        <time dateTime={status.lastSaved.toISOString()}>
                            {new Intl.DateTimeFormat('zh-CN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            }).format(status.lastSaved)}
                        </time>
                    )}
                </span>
            )}
            {status.status === 'error' && (
                <span className="flex items-center gap-2 text-red-500">
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                    保存失败
                </span>
            )}
        </div>
    );
} 