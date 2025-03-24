import { describe, test, expect, mock } from 'bun:test';
import { screen, render, fireEvent } from '@testing-library/react';

import { NotesView } from "../../src/components/NotesView";
import { Note } from "../../src/types";



describe("NotesView", () => {
  test("notes display", () => {
    const notes: Note[] = [
        {
            note_id: "123-456",
            content: "My content nb 1",
            updated: new Date(),
            version_number: 3
        },
        {
            note_id: "123-4567",
            content: "My content nb 2",
            updated: new Date(),
            version_number: 1
        },
        {
            note_id: "123-4568",
            content: "My content nb 3",
            updated: new Date(),
            version_number: 2
        }
    ]
    const setOpenNoteDialog = mock((open: boolean) => {});
    const setNoteContent = mock((content: string) => {});
    const handleCreateNote = mock(() => {});
    const handleDeleteNote = mock((note: Note) => {});
    const handleEditNote = mock((note: Note) => {});
    const handleSaveNote = mock(() => {});
    const handleViewVersions = mock((note: Note) => {});
    const handleEditView = mock(() => {});

    render(<NotesView
      notes={notes}
      noteContent=""
      setNoteContent={setNoteContent}
      setOpenNoteDialog={setOpenNoteDialog}
      handleCreateNote={handleCreateNote}
      handleViewVersions={handleViewVersions}
      handleEditView={handleEditView}
      handleDeleteNote={handleDeleteNote}
      handleEditNote={handleEditNote}
      handleSaveNote={handleSaveNote}
    />);

    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("My Notes");

    const liste = screen.getByRole("list");
    expect(liste).toBeInTheDocument();
    expect(liste.childElementCount).toBe(3);

    const create_button = screen.getByText("Create New Note");
    expect(create_button).toBeInTheDocument();
    fireEvent.click(create_button);
    expect(handleCreateNote).toHaveBeenCalled();
  });

  test("create note", () => {
    const notes: Note[] = [
      {
          note_id: "123-456",
          content: "My content nb 1",
          updated: new Date(),
          version_number: 3
      },
      {
          note_id: "123-4567",
          content: "My content nb 2",
          updated: new Date(),
          version_number: 1
      },
      {
          note_id: "123-4568",
          content: "My content nb 3",
          updated: new Date(),
          version_number: 2
      }
  ]
  const setOpenNoteDialog = mock((open: boolean) => {});
  const setNoteContent = mock((content: string) => {});
  const handleCreateNote = mock(() => {});
  const handleDeleteNote = mock((note: Note) => {});
  const handleEditNote = mock((note: Note) => {});
  const handleSaveNote = mock(() => {});
  const handleViewVersions = mock((note: Note) => {});
  const handleEditView = mock(() => {});

  render(<NotesView
    notes={notes}
    noteContent=""
    setNoteContent={setNoteContent}
    openNoteDialog={true}
    setOpenNoteDialog={setOpenNoteDialog}
    handleCreateNote={handleCreateNote}
    handleViewVersions={handleViewVersions}
    handleEditView={handleEditView}
    handleDeleteNote={handleDeleteNote}
    handleEditNote={handleEditNote}
    handleSaveNote={handleSaveNote}
    />);

    expect(screen.getByText("Create Note")).toBeInTheDocument();

  })
});
