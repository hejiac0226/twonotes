export interface Block {
    id: string;
    leftContent: string;
    rightContent: string;
    leftWidth: number;
}

export interface Note {
    id: string;
    title: string;
    blocks: Block[];
    createdAt: Date;
    updatedAt: Date;
} 