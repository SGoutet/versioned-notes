import axios from 'axios';
import { Note, NoteCreate, NoteUpdate } from '../types';

const API_URL = 'http://localhost:8000';

export const api = {
    // Notes
    getNotes: async (): Promise<Note[]> => {
        const response = await axios.get(`${API_URL}/notes/`);
        return response.data;
    },

    getNote: async (id: string): Promise<Note> => {
        const response = await axios.get(`${API_URL}/notes/${id}`);
        return response.data;
    },

    createNote: async (note: NoteCreate): Promise<Note> => {
        const response = await axios.post(`${API_URL}/notes/`, note);
        return response.data;
    },

    updateNote: async (id: string, note: NoteUpdate): Promise<Note> => {
        const response = await axios.put(`${API_URL}/notes/${id}`, note);
        return response.data;
    },

    deleteNote: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/notes/${id}`);
    },

    // Versions
    getNoteVersions: async (noteId: string): Promise<Note[]> => {
        const response = await axios.get(`${API_URL}/notes/${noteId}/versions`);
        return response.data;
    },

};