import { createTodayTodoDate } from "../utils/todoDateUtils";
import { TodoDate, TodoGroupsById, TodosDaysByDateStrs } from "./todosTypes";

export interface TodosState {
  today: TodoDate;
  activeDate: TodoDate | undefined;
  days: TodosDaysByDateStrs;
  // always sorted in descending order
  dateStrs: readonly string[];
  groups: TodoGroupsById;
}

export const TODOS_STATE_KEY = "todos" as "todos";

export type WithTodosState = {
  [TODOS_STATE_KEY]: TodosState;
};

export function createInitialTodosState(): TodosState {
  return {
    today: createTodayTodoDate(),
    activeDate: undefined,
    days: {},
    dateStrs: [],
    groups: {}
  };
}
