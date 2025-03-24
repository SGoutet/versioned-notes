export interface Note {
    note_id: string;
    content: string;
    updated: Date;
    version_number: number;
}

export interface NoteCreate {
    content: string;
}

export interface NoteUpdate {
    content: string;
}

export enum Views {
    notes,
    edit,
    versions
}
