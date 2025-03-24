import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import MDEditor from '@uiw/react-md-editor';


export interface EditViewParams {
    noteContent: string;
    setNoteContent: (content: string) => void;
    saveAndCloseView: () => void;
    closeView: () => void;
}


export function EditView({noteContent, setNoteContent, saveAndCloseView, closeView}: EditViewParams) {

  return (
    <Box sx={{ mt: 2 }}>
      <MDEditor
        value={noteContent}
        onChange={(value, viewUpdate) => {setNoteContent(value)}}
      />
      <MDEditor.Markdown source={noteContent} style={{ whiteSpace: 'pre-wrap' }} />
      <Button variant="contained" onClick={closeView}>Close</Button>
      <Button variant="contained" onClick={saveAndCloseView}>Save and Close</Button>
    </Box>
  );
}
