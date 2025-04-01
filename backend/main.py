import difflib

from datetime import datetime
from uuid import UUID, uuid4

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from notebook import get_db_session, NoteBook
from notes_models import NoteCreate, NoteUpdate, NoteResponse


app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/notes/", response_model=NoteResponse)
async def create_note(note: NoteCreate, db: Session = Depends(get_db_session)):
    note: NoteResponse = await NoteBook(db).create_note(note)
    return note


@app.get("/notes/", response_model=List[NoteResponse])
async def get_notes(db: Session = Depends(get_db_session)):
    return await NoteBook(db).list()


@app.get("/notes/{note_id}", response_model=NoteResponse)
async def get_note(note_id: UUID, db: Session = Depends(get_db_session)):
    note: NoteResponse = await NoteBook(db).get_note(note_id)
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@app.put("/notes/{note_id}", response_model=NoteResponse)
async def update_note(note_id: UUID, note_update: NoteUpdate, db: Session = Depends(get_db_session)):
    db_note = await NoteBook(db).get_note(note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    note = await NoteBook(db).update_note(note_id, note_update)
    return note


@app.delete("/notes/{note_id}")
async def delete_note(note_id: UUID, db: Session = Depends(get_db_session)):
    nb = NoteBook(db)
    await nb.delete_note(note_id)
    return {"message": "Note deleted"}


@app.get("/notes/{note_id}/versions", response_model=List[NoteResponse])
async def get_note_versions(note_id: UUID, db: Session = Depends(get_db_session)):
    nb = NoteBook(db)
    return await nb.get_note_versions(note_id)
