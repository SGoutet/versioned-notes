# UI models
from typing import Annotated
from pydantic import BaseModel, StringConstraints
from datetime import datetime
from uuid import UUID


class NoteCreate(BaseModel):
    content: Annotated[str, StringConstraints(min_length=1, max_length=10000)]


class NoteUpdate(BaseModel):
    content: Annotated[str, StringConstraints(min_length=1, max_length=10000)]


class NoteResponse(BaseModel):
    note_id: UUID
    version_number: int
    content: Annotated[str, StringConstraints(min_length=1, max_length=10000)]
    updated: datetime

    @staticmethod
    def from_note(note: 'Note') -> 'NoteResponse':
        return NoteResponse(
            note_id=UUID(note.note_id),
            version_number=note.version_number,
            updated=note.created,
            content=note.content
        )
