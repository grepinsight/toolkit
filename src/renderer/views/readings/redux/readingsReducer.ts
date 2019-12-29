import { setWith, TypedReducer } from "redoodle";
import { ReadingActions as ReadingsActions } from "./readingsActions";
import { ReadingsState } from "./readingsState";

export const readingsReducer = TypedReducer.builder<ReadingsState>()
  .withHandler(ReadingsActions.setInputValue.TYPE, (state, inputValue) => {
    return setWith(state, { inputValue });
  })
  .withHandler(ReadingsActions.setFilter.TYPE, (state, filter) => {
    return setWith(state, { filter });
  })
  .build();
