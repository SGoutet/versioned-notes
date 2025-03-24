import difflib

from sqlalchemy import desc, func, delete
from sqlalchemy.orm import Session
from sqlalchemy.future import select

from typing import List
from uuid import UUID, uuid4
from fastapi import HTTPException

from datetime import datetime, timezone

from notes_db import get_db_session, Note
from notes_models import NoteCreate, NoteUpdate, NoteResponse


class NoteBook:

    def __init__(self, db: Session):
        self.db = db

    async def create_note(self, note: NoteCreate) -> NoteResponse:
        note_id = str(uuid4())
        #TODO check exists
        db_note = Note(
            note_id=note_id,
            version_number=1,
            current_version=True,
            content=note.content,
            created=datetime.now()
        )
        self.db.add(db_note)
        await self.db.commit()
        await self.db.refresh(db_note)
        return NoteResponse.from_note(db_note)

    async def list(self) -> List[NoteResponse]:
        q = select(Note).filter_by(current_version=True)
        result = await self.db.execute(q)
        return [NoteResponse.from_note(note) for note in result.scalars()]

    # helper to get SqlAlchemy Note object
    async def _get_note(self, note_id: UUID) -> Note:
        note = await self.db.scalar(
            select(Note).filter(Note.note_id == str(note_id)).filter(Note.current_version)
        )
        if note is None:
            raise HTTPException(status_code=404, detail="Note not found")
        return note

    async def get_note(self, note_id: UUID) -> Note:
        return await self._get_note(note_id)

    async def update_note(self, note_id: UUID, note_update: NoteUpdate) -> NoteResponse:
        # Throws an exception if not found
        old_version = await self._get_note(note_id)
        db_note = Note(
            note_id=str(note_id),
            version_number=old_version.version_number + 1,
            current_version=True,
            content=note_update.content,
            created=datetime.now(timezone.utc)
        )
        self.db.add(db_note)
        old_version.current_version = False
        await self.db.commit()
        await self.db.refresh(db_note)
        return NoteResponse.from_note(db_note)

    async def delete_note(self, note_id: UUID) -> dict:
        db_note = await self._get_note(note_id)
        # stmt = delete(Note).where(Note.note_id == str(note_id))
        # await self.db.execute(stmt)
        # as the above does not work, at least in dev mode,
        #  I just remove current_version from last entry, so the note will not appear in the list any more
        #  another script may be used to actually remove from DB those trashed notes
        db_note.current_version = False
        await self.db.commit()
        await self.db.refresh(db_note)
        return {"message": "Note deleted"}

    async def get_note_versions(self, note_id: UUID) -> List[NoteResponse]:
        versions = await self.db.scalars(
            select(Note).filter(Note.note_id == str(note_id)).order_by(Note.id)
        )
        if not versions:
            raise HTTPException(status_code=404, detail="Note not found")
        return [NoteResponse.from_note(note) for note in versions]

