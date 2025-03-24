import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { format } from 'date-fns';
import { Note } from '../types';



export interface NotesViewParams {
    notes: Note[];
    selectedNote: Note | null;
    openNoteDialog: boolean;
    noteContent: string;
    setOpenNoteDialog: (open: boolean) => void;
    setNoteContent: (content: string) => void;
    handleCreateNote: () => void;
    handleDeleteNote: (note: Note) => void;
    handleEditNote: (note: Note) => void;
    handleSaveNote: () => void;
    handleViewVersions: (note: Note) => void;
    handleEditView: () => void;
}


export function NotesView({
        notes,
        selectedNote,
        openNoteDialog,
        noteContent,
        setOpenNoteDialog,
        setNoteContent,
        handleCreateNote,
        handleDeleteNote,
        handleEditNote,
        handleSaveNote,
        handleViewVersions,
        handleEditView
    }: NotesViewParams) {


    return (
        <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                My Notes
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleCreateNote}
                sx={{ mb: 2 }}
            >
                Create New Note
            </Button>

            <List>
                {notes.map((note) => (
                    <Paper key={note.note_id} sx={{ mb: 2, p: 2 }}>
                        <ListItem
                            secondaryAction={
                                <Box>
                                    <IconButton
                                        edge="end"
                                        aria-label="edit"
                                        onClick={() => handleEditNote(note)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="history"
                                        onClick={() => { return handleViewVersions(note)}}
                                    >
                                        <HistoryIcon />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => handleDeleteNote(note)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            }
                        >
                            <ListItemText
                                sx={{ width: 3/4}}
                                primary={note.content.length > 255? note.content.slice(0, 255) + '...': note.content}
                                secondary={`V${note.version_number}, Last updated: ${format(new Date(note.updated), 'PPpp')}`}
                            />
                        </ListItem>
                    </Paper>
                ))}
            </List>

            {/* Note Dialog */}
            <Dialog open={openNoteDialog} onClose={() => setOpenNoteDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>{selectedNote ? 'Edit Note' : 'Create Note'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Content"
                        fullWidth
                        multiline
                        rows={4}
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenNoteDialog(false)}>Cancel</Button>
                    <Button onClick={() => handleEditView()} variant="contained">Full Edit</Button>
                    <Button onClick={handleSaveNote} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>)
};
