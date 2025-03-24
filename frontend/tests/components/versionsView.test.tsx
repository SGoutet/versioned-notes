// import React from "react";
import { test, expect, describe, mock } from "bun:test";

import { render, screen, fireEvent } from "@testing-library/react";
import { VersionsView } from "../../src/components/VersionsView";
import { Note } from "../../src/types";
// import { DateRangeTwoTone } from "@mui/icons-material";


describe("VersionsView", () => {
  test("should render versions list provided", () => {
    const versions: Note[] = [
        {
            note_id: "123-456",
            content: "My content nb 1",
            updated: new Date(),
            version_number: 1
        },
        {
            note_id: "123-456",
            content: "My content nb 2",
            updated: new Date(),
            version_number: 2
        },
        {
            note_id: "123-456",
            content: "My content nb 3",
            updated: new Date(),
            version_number: 3
        }
    ]
    const closeView = mock(() => {});

    render(<VersionsView versions={versions} closeView={closeView} />);

    const header = screen.getByRole("heading");
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("Versions History");

    const liste = screen.getByRole("list");
    expect(liste).toBeInTheDocument();
    // Check liste contains three list items
    expect(liste.children.length).toBe(3)
    expect(liste.children[0]).toHaveTextContent("My content nb 1");
    expect(liste.children[1]).toHaveTextContent("My content nb 2");
    expect(liste.children[2]).toHaveTextContent("My content nb 3");

    // Test that selecting two versions will trigger the react diff component
    let tables = screen.queryAllByRole("table");
    expect(tables.length).toBe(0);
    let altText = screen.queryByText("Select 2 versions to view the changes");
    expect(altText).toBeInTheDocument();

    let checkboxes = screen.queryAllByRole("checkbox");
    expect(checkboxes.length).toBe(3);
    fireEvent.click(checkboxes[2]);
    fireEvent.click(checkboxes[1]);

    expect(screen.queryAllByText("Select 2 versions to view the changes").length).toBe(0);
    let diffTitle = screen.queryByText("Changes between version 2 and 3")
    expect(diffTitle).toBeInTheDocument();
    tables = screen.queryAllByRole("table");
    expect(tables.length).toBe(1);

    // deselect first checkbox
    fireEvent.click(checkboxes[2]);

    tables = screen.queryAllByRole("table");
    expect(tables.length).toBe(0);
    altText = screen.queryByText("Select 2 versions to view the changes");
    expect(altText).toBeInTheDocument();

    // re-select checkbox
    fireEvent.click(checkboxes[2]);

    tables = screen.queryAllByRole("table");
    expect(tables.length).toBe(1);
    expect(screen.queryAllByText("Select 2 versions to view the changes").length).toBe(0);
    diffTitle = screen.queryByText("Changes between version 2 and 3")
    expect(diffTitle).toBeInTheDocument();

    // Now test close button
    const closeButton = screen.getByRole("button");
    expect(closeButton).toBeInTheDocument();
    closeButton.click();
    expect(closeView).toHaveBeenCalled();
  });

});
