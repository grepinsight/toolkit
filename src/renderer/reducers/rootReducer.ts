import { combineReducers } from "redoodle";
import { RootState } from "../states/rootState";
import { floatingMenuReducer } from "./floatingMenuReducer";
import { persistedReducer } from "./persistedReducer";
import { todoReducer } from "./todoReducer";

export const rootReducer = combineReducers<RootState>({
  persisted: persistedReducer,
  floatingMenu: floatingMenuReducer,
  todo: todoReducer
});
