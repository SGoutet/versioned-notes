import asyncio

from sqlalchemy import select, desc

from notes_db import get_db_session, Note
from notes_models import NoteCreate, NoteUpdate, NoteResponse
from notebook import NoteBook

from pprint import pprint


async def dump_db(db_session):
    return await db_session.scalars(select(Note)) #.group_by(Note.note_id))

def print_notes(notes):
    for note in notes:
        print(f"{note.id}: {note.note_id}: {note.version_number}: {note.current_version}: {note.content}")


async def test_data():
    async for db_session in get_db_session():
        async with db_session as session:
            nb = NoteBook(session)
            # await nb.create_note(NoteCreate(content="more test more!"))
            # notes = await nb.list()
            # note = await nb.get_note(())
            # note = notes[1]
            # await nb.update_note(note.note_id, NoteUpdate(content="test2!"))
            # print(f"Deleting note {note.note_id}")
            await nb.delete_note(note_id='6c533324-372f-48c0-aafe-642a433453d1')
            notes = await dump_db(session)
            # notes = await nb.list()
            print_notes(notes)
            # print([f"{note.id}: {note.note_id}: {note.content}" for note in notes])

asyncio.run(test_data())
