import { TypedAction } from "redoodle";
import { ArchiveStatus } from "../../../types/types";
import { Note, NotesById } from "../notesTypes";

export namespace NotesActions {
  export const setActiveId = TypedAction.define("notes::set-active-id")<string | undefined>();
  export const setQuery = TypedAction.define("notes::set-query")<string>();
  export const addNote = TypedAction.define("notes::add-note")<Note>();
  export const setNoteValue = TypedAction.define("notes::set-note-value")<SetNoteValuePayload>();
  export const setArchiveStatus = TypedAction.define("readings::set-reading-status")<
    SetStatusPayload
  >();

  export interface SetStatusPayload {
    id: string;
    status: ArchiveStatus;
  }

  export interface SetNoteValuePayload {
    id: string;
    value: string;
  }
}

export namespace NotesInternalActions {
  export const setNotes = TypedAction.define("internal-notes::set-notes")<NotesById>();
}
