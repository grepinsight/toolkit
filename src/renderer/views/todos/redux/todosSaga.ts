import { ipcRenderer } from "electron-better-ipc";
import { setWith, TypedAction } from "redoodle";
import { all, delay, fork, put, select, takeLatest } from "redux-saga/effects";
import { IpcEvent } from "../../../../shared/ipcEvent";
import { DAY_IN_MILLIS, getSundayDate } from "../../../utils/dateUtils";
import { createTodo, createTodosDay } from "../todosObjects";
import { createTodayTodoDate, todoDateToDate, todoDateToStr } from "../utils/todoDateUtils";
import { InternalTodosActions, TodosActions } from "./todosActions";
import {
  selectTodosDateStrs,
  selectTodosDays,
  selectTodosHasToday,
  selectTodosLatestDay,
  selectTodosPersist,
  selectTodosToday
} from "./todosSelectors";
import {
  PersistedTodos,
  Todo,
  TodosDay,
  TodosDaysByDateStrs,
  TodoStatus,
  TodoType
} from "./todosTypes";

const TODOS_FILE_NAME = "todos";

export function* todosSaga() {
  yield initializeTodos();
  yield all([
    yield fork(initializeTodayUpdater),
    yield takeLatest(TodosActions.initToday.TYPE, createTodosToday),
    yield takeLatest(TodosActions.addTodo.TYPE, addTodo),
    yield takeLatest(TodosActions.removeTodo.TYPE, removeTodo),
    yield takeLatest(TodosActions.setTodoStatus.TYPE, setTodoStatus)
  ]);
}

function* initializeTodos() {
  let persisted: PersistedTodos | undefined = yield ipcRenderer.callMain(
    IpcEvent.READ_DATA,
    TODOS_FILE_NAME
  );

  if (persisted == null) {
    persisted = {
      todosDays: [],
      groups: {}
    };
    yield writeTodos(persisted);
  }

  const days: TodosDaysByDateStrs = {};
  const dateStrs: string[] = [];

  for (const day of persisted.todosDays) {
    const dateStr = todoDateToStr(day.date);
    dateStrs.push(dateStr);
    days[dateStr] = day;
  }

  yield put(
    InternalTodosActions.setTodos({
      days,
      dateStrs
    })
  );
  yield put(InternalTodosActions.setGroups(persisted.groups));
}

function* initializeTodayUpdater() {
  const tomorrowDateInMillis = todoDateToDate(createTodayTodoDate()).getTime() + DAY_IN_MILLIS;
  const slackTimeInMillis = 5 * 1000; // 5 seconds slack

  // set timeout until midnight and then set next timeout for updating each day
  let delayTimeMillis = tomorrowDateInMillis - Date.now() + slackTimeInMillis;

  while (true) {
    yield delay(delayTimeMillis);
    yield put(TodosActions.updateTodayDate());

    // set delayTimeMillis to be 1 day after this
    delayTimeMillis = DAY_IN_MILLIS;
  }
}

function* createTodosToday(action: TypedAction<TodosActions.InitTodayPayload>) {
  const hasToday: boolean = yield select(selectTodosHasToday);
  if (hasToday) {
    return;
  }

  const { shouldInherit } = action.payload;
  const latestDay: TodosDay | undefined = yield select(selectTodosLatestDay);
  let todos: readonly Todo[] = [];

  if (latestDay != null) {
    // inherit WEEK todos regardless of `shouldInherit` value, if latestDay is same week
    const isSameWeek =
      getSundayDate(new Date()).getTime() ===
      getSundayDate(todoDateToDate(latestDay.date)).getTime();
    todos = latestDay.todos.filter(
      todo =>
        todo.status !== TodoStatus.FINISHED &&
        (shouldInherit || (todo.todoType === TodoType.WEEK && isSameWeek))
    );
  }

  const today = createTodosDay({ todos });
  const todayDateStr = todoDateToStr(today.date);
  const days: TodosDaysByDateStrs = yield select(selectTodosDays);
  const dateStrs: readonly string[] = yield select(selectTodosDateStrs);

  const newDays = setWith(days, {
    [todayDateStr]: today
  });
  const newDateStrs = [todayDateStr, ...dateStrs];

  yield put(
    InternalTodosActions.setTodos({
      days: newDays,
      dateStrs: newDateStrs
    })
  );
  yield put(TodosActions.setActive(today.date));
  yield writeTodos();
}

function* addTodo(action: TypedAction<TodosActions.AddTodoPayload>) {
  const today: TodosDay | undefined = yield select(selectTodosToday);

  // if today has not yet been initialized, do nothing
  if (today == null) {
    return;
  }

  const { value, type } = action.payload;
  const days: TodosDaysByDateStrs = yield select(selectTodosDays);
  const newDays = setWith(days, {
    [todoDateToStr(today.date)]: {
      ...today,
      todos: [createTodo({ value, todoType: type }), ...today.todos]
    }
  });
  yield put(InternalTodosActions.setTodos({ days: newDays }));
  yield writeTodos();
}

function* removeTodo(action: TypedAction<TodosActions.RemoveTodoPayload>) {
  const { date, todoId } = action.payload;
  const days: TodosDaysByDateStrs = yield select(selectTodosDays);
  const dateStr = todoDateToStr(date);
  const day = days[dateStr];

  if (day == null) {
    return;
  }

  const newDays = setWith(days, {
    [dateStr]: {
      ...day,
      todos: day.todos.filter(todo => todo.id !== todoId)
    }
  });

  yield put(InternalTodosActions.setTodos({ days: newDays }));
  yield writeTodos();
}

function* setTodoStatus(action: TypedAction<TodosActions.SetTodoStatusPayload>) {
  const { date, todoId, status } = action.payload;
  const days: TodosDaysByDateStrs = yield select(selectTodosDays);
  const dateStr = todoDateToStr(date);
  const day = days[dateStr];

  if (day == null) {
    return;
  }

  const newDays = setWith(days, {
    [dateStr]: {
      ...day,
      todos: day.todos.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        } else {
          return {
            ...todo,
            status
          };
        }
      })
    }
  });

  yield put(InternalTodosActions.setTodos({ days: newDays }));
  yield writeTodos();
}

function* writeTodos(todos?: PersistedTodos) {
  const toPersist: PersistedTodos = todos ?? (yield select(selectTodosPersist));
  ipcRenderer.callMain(IpcEvent.WRITE_DATA, {
    fileName: TODOS_FILE_NAME,
    data: toPersist
  });
}
