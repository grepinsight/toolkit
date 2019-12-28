import { TypedAction } from "redoodle";
import { ReadingStatusFilter } from "../types/types";

export namespace ReadingActions {
  export const setInputValue = TypedAction.define("reading::set-input-value")<string>();
  export const setFilter = TypedAction.define("reading::set-filter")<ReadingStatusFilter>();
}
