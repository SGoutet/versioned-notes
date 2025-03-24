import { useState, useEffect } from 'react'

import './App.css'

import Container from '@mui/material/Container';

import { api } from './services/api';
import { Note, Views } from './types';
import { VersionsView } from './components/versionsview';
import { NotesView } from './components/notesView';
import { EditView } from './components/editView';



function App() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [noteContent, setNoteContent] = useState<string>('');
    const [openNoteDialog, setOpenNoteDialog] = useState<boolean>(false);
    const [currentView, setCurrentView] = useState<Views>(false);
    const [versions, setVersions] = useState<Note[]>([]);

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        const fetchedNotes = await api.getNotes();
        setNotes(fetchedNotes);
    };

    const handleCreateNote = () => {
        setSelectedNote(null);
        setNoteContent('');
        setOpenNoteDialog(true);
    };

    const handleEditNote = (note: Note) => {
        setSelectedNote(note);
        setNoteContent(note.content);
        setOpenNoteDialog(true);
    };

    const handleSaveNote = async () => {
        try {
            if (selectedNote) {
                await api.updateNote(selectedNote.note_id, { content: noteContent });
            } else {
                await api.createNote({ content: noteContent });
            }
            setOpenNoteDialog(false);
            setCurrentView(Views.notes);
            loadNotes();
        } catch (error) {
            console.error('Error saving note:', error);
        }
    };

    const handleDeleteNote = async (note: Note) => {
        try {
            await api.deleteNote(note.note_id);
            loadNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const handleViewVersions = async (note: Note) => {
        try {
            const noteVersions = await api.getNoteVersions(note.note_id);
            setVersions(noteVersions);
            setSelectedNote(note);
            setCurrentView(Views.versions);
        } catch (error) {
            console.error('Error loading versions:', error);
        }
    };

    return (
        <Container maxWidth="auto">
            {currentView === Views.versions? (
                <VersionsView versions={versions} closeView={() => setCurrentView(Views.notes)} />
            ): (currentView === Views.edit? (
                <EditView noteContent={noteContent}
                          setNoteContent={setNoteContent}
                          saveAndCloseView={handleSaveNote}
                          closeView={() => setCurrentView(Views.notes)}
                />
            ): (
                <NotesView notes={notes}
                           selectedNote={selectedNote}
                           noteContent={noteContent}
                           setNoteContent={setNoteContent}
                           openNoteDialog={openNoteDialog}
                           setOpenNoteDialog={setOpenNoteDialog}
                           handleSaveNote={handleSaveNote}
                           handleCreateNote={handleCreateNote}
                           handleEditNote={handleEditNote}
                           handleDeleteNote={handleDeleteNote}
                           handleViewVersions={handleViewVersions}
                           handleEditView={() => setCurrentView(Views.edit)}
                />
            ))}
        </Container>
    );
}

export default App
