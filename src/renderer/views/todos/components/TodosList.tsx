import { noop } from "lodash-es";
import * as React from "react";
import { defaultMemoize } from "reselect";
import { v4 as uuid } from "uuid";
import { createKNL } from "../../../shared-components/KeyNavList";
import { Todo, TodosDay, TodoType } from "../redux/todosTypes";
import { TodoItem } from "./TodoItem";

const KNL = createKNL<Todo>();

export namespace TodosList {
  export interface Props {
    day: TodosDay;
  }
}

export class TodosList extends React.PureComponent<TodosList.Props> {
  private listId = uuid();

  public render() {
    const groupedTodosByType = this.getGroupedTodosByType(this.props.day.todos);
    const groupOrderedTodos = groupedTodosByType.DAY.concat(groupedTodosByType.WEEK);
    return (
      <KNL
        className="todos-list"
        id={this.listId}
        items={groupOrderedTodos}
        onItemSelect={noop}
        getItemKey={getItemKey}
        renderItem={this.renderItem}
      />
    );
  }

  private renderItem = (todo: Todo) => {
    const groupedTodosByType = this.getGroupedTodosByType(this.props.day.todos);
    if (groupedTodosByType.DAY[0]?.id === todo.id) {
      return (
        <React.Fragment>
          <div className="todos-list-group">DAY TODOS</div>
          <TodoItem todo={todo} />
        </React.Fragment>
      );
    } else if (groupedTodosByType.WEEK[0]?.id === todo.id) {
      return (
        <React.Fragment>
          <div className="todos-list-group">WEEK TODOS</div>
          <TodoItem todo={todo} />
        </React.Fragment>
      );
    }
    return <TodoItem todo={todo} />;
  };

  private getGroupedTodosByType = defaultMemoize((todos: readonly Todo[]) => {
    const todosByType: Record<TodoType, Todo[]> = {
      [TodoType.DAY]: [],
      [TodoType.WEEK]: []
    };

    for (const todo of todos) {
      todosByType[todo.todoType].push(todo);
    }

    return todosByType;
  });
}

const getItemKey = (todo: Todo) => todo.id;
