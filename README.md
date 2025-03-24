# versioned-notes
Web app allowing to save versioned notes

## User Guide
### Notes list view
The app opens on the notes list view, listing all notes. Long notes are shortened.
![Notes view](/images/notes.png)

- Click on "Create new note" button, or the edit Icon next to a note, to enter the **edit note dialog**.
- Click on the history icon next to a note to enter the note **versions history view**
- Click on the trash bin icon to delete a note

### Versions history view
This view lists all versions of a note.

It is possible to see the changes between two versions by selecting two different versions of a note.

![Versions view](/images/version.png)

### Edit dialog
The edit dialog allows to simply and quickly edit a note. The new content will be saved as a new version.

Clicking on full edit button brings to the **full edit view**

### Full edit view
Allows to edit note as markdown

![Edit dialog](/images/markdown_editor.png)


## Installation
### Install backend

```
cd backend
python -m venv venv
pip install -r .\requirements.txt
python .\scripts\initdb.py
```


### Run tests

`venv\Scripts\activate.bat`


### Run server

```
venv\Scripts\activate.bat
uvicorn main:app
```

add option `--reload` in dev mode

`uvicorn main:app --reload`

The FastAPI backend will then be accessible at http://localhost:8000/

http://localhost:8000/docs for full API documentation
![Fast API docs](/images/fastapi.png)


## Front End

fron end relies on bun package manager, with vite bundler

```
cd ..\frontend
bun install
```
`bun dev` to launch dev server

`bun test` for tests

