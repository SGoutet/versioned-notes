import pytest

from sqlalchemy.orm import Session
from datetime import datetime

from notebook import NoteBook
from notes_db import Note
from models import NoteCreate


def test_create_note(db: Session):
    notebook = NoteBook(db)
    note_create = NoteCreate(content="Test content")
    note = notebook.create_note(note_create)
    assert note.content == "Test content"
    assert note.created is not None


def test_list_notes(db: Session):
    notebook = NoteBook(db)
    note_create1 = NoteCreate(content="Test content 1")
    note_create2 = NoteCreate(content="Test content 2")
    notebook.create_note(note_create1)
    notebook.create_note(note_create2)
    notes = notebook.list()
    assert len(notes) == 2
    assert notes[0].content == "Test content 2"
    assert notes[1].content == "Test content 1"


def test_get_full_note(db: Session):
    notebook = NoteBook(db)
    note_create = NoteCreate(content="Test content")
    created_note = notebook.create_note(note_create)
    note = notebook.get_full_note(created_note.id, db)
    assert note.content == "Test content"
    assert note.created is not None
