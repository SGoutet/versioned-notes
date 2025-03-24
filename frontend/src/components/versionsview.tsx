/* Versions View
    displays the versions history list and diff
    the user is able to select 2 versions in the list and view the diff
    the first two versions are selected by default
*/
import {format} from 'date-fns/format';
import ReactDiffViewer from 'react-diff-viewer';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { Note } from '../types';


export interface VersionsViewParams {
    versions: Note[];
    closeView: () => void;
}


export function VersionsView({versions, closeView}: VersionsViewParams) {
    const [checked, setChecked] = React.useState<(Note|null)[]>([null, null]);

    const handleToggle = (version: Note) => () => {
        if (checked[0] === version) {
            setChecked([checked[1], null]);
        }
        else if (checked[1] === version) {
            setChecked([checked[0], null]);
        }
        else if (checked[0] === null) {
            setChecked([version, checked[1]]);
        }
        else if (checked[0].version_number < version.version_number) {
            setChecked([checked[0], version]);
        }
        else {
            setChecked([version, checked[0]]);
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Versions History
            </Typography>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {versions.map((version) => {
                    const version_number: number = version.version_number
                    const labelId = `checkbox-list-label-${version_number}`;

                    return (
                        <ListItem
                            key={version_number}
                            disablePadding
                        >
                            <ListItemButton role={undefined} onClick={handleToggle(version)} dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={checked.includes(version)}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId}
                                              primary={"" + version_number + ": " + (version.content.length > 255? version.content.slice(0, 255) + '...': version.content)}
                                              secondary={`Last updated: ${format(new Date(version.updated), 'PPpp')}`}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            {checked[0] && checked[1]? (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Changes between version {checked[0]?.version_number} and {checked[1]?.version_number}
                    </Typography>
                    <ReactDiffViewer
                        oldValue={checked[0].content}
                        newValue={checked[1].content}
                        splitView={true}
                    />
                </Box>
            ) : (
                <Typography>Select 2 versions to view the changes</Typography>
            )}
            <Button variant="contained" onClick={closeView}>Close</Button>
        </Box>
    );
}


export default VersionsView;
