import { TypedAction } from "redoodle";
import { Reading, ReadingStatus, ReadingStatusFilter } from "../readingsTypes";

export namespace ReadingActions {
  export const setInputValue = TypedAction.define("readings::set-input-value")<string>();
  export const setFilter = TypedAction.define("readings::set-filter")<ReadingStatusFilter>();
  export const setActive = TypedAction.define("readings::set-active")<Reading | undefined>();
  export const addReading = TypedAction.define("readings::add-reading")<Reading>();
  export const setReadingStatus = TypedAction.define("readings::set-reading-status")<{
    id: string;
    status: ReadingStatus;
  }>();
}

export namespace ReadingsInternalActions {
  export const setReadings = TypedAction.define("internal-readings::set-readings")<
    readonly Reading[]
  >();
}
