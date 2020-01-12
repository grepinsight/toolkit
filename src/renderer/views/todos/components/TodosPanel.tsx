import * as React from "react";
import { connect } from "react-redux";
import { v4 as uuid } from "uuid";
import { KeyNavListActions } from "../../../actions/keyNavListActions";
import { PanelContainer } from "../../../shared-components/PanelContainer";
import { RootState } from "../../../states/rootState";
import { TodosActions } from "../redux/todosActions";
import { selectActiveTodosDay, selectTodosIsReadonly } from "../redux/todosSelectors";
import { TodosDay } from "../redux/todosTypes";
import { todoDateToStr } from "../utils/todoDateUtils";
import { TodoInput } from "./TodoInput";
import { TodosList } from "./TodosList";

require("./TodosPanel.scss");

export namespace TodosPanel {
  export interface StoreProps {
    active: TodosDay | undefined;
    isReadonly: boolean;
  }

  export interface DispatchProps {
    setActive: typeof TodosActions.setActive;
    addTodo: typeof TodosActions.addTodo;
    initLocation: typeof KeyNavListActions.init;
  }

  export type Props = StoreProps & DispatchProps;
}

class TodosPanelInternal extends React.PureComponent<TodosPanel.Props> {
  private listId = uuid();

  public render() {
    const { active, isReadonly } = this.props;

    return (
      <PanelContainer
        className="todos-panel-container"
        title={active != null ? `Todos for ${todoDateToStr(active.date)}` : "Active date not set."}
        isOpen={active != null}
        onClose={this.handleClose}
      >
        {active != null && (
          <div className="todos-panel">
            {!isReadonly && (
              <TodoInput
                listId={this.listId}
                addTodo={this.props.addTodo}
                initLocation={this.props.initLocation}
                onPanelClose={this.handleClose}
              />
            )}
            <TodosList listId={this.listId} day={active} isReadonly={isReadonly} />
          </div>
        )}
      </PanelContainer>
    );
  }

  private handleClose = () => {
    this.props.setActive(undefined);
  };
}

function mapStateToProps(state: RootState): TodosPanel.StoreProps {
  return {
    active: selectActiveTodosDay(state),
    isReadonly: selectTodosIsReadonly(state)
  };
}

const mapDispatchToProps: TodosPanel.DispatchProps = {
  setActive: TodosActions.setActive,
  addTodo: TodosActions.addTodo,
  initLocation: KeyNavListActions.init
};

const enhance = connect(mapStateToProps, mapDispatchToProps);
export const TodosPanel = enhance(TodosPanelInternal);
