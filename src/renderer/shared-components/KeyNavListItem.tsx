import { Classes } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { KeyNavListActions } from "../actions/keyNavListActions";
import { selectKeyNavListCurrent } from "../selectors/keyNavListSelectors";
import { RootState } from "../states/rootState";

require("./KeyNavListItem.scss");

export namespace KeyNavListItem {
  export interface OwnProps<T> {
    className?: string;
    row: number;
    item: T;
    onItemSelect: (item: T) => void;
    children: JSX.Element;
  }

  export interface StoreProps {
    isActive: boolean;
  }

  export interface DispatchProps {
    setCurrent: typeof KeyNavListActions.setCurrent;
  }

  export type Props<T> = OwnProps<T> & StoreProps & DispatchProps;
}

class KeyNavListItemInternal extends React.PureComponent<KeyNavListItem.Props<any>> {
  public render() {
    return (
      <div
        className={classNames("key-nav-list-item", Classes.ELEVATION_0, this.props.className, {
          "-active": this.props.isActive
        })}
        onClick={this.handleClick}
      >
        {this.props.children}
      </div>
    );
  }

  private handleClick = () => {
    this.props.setCurrent({ row: this.props.row });
    this.props.onItemSelect(this.props.item);
  };
}

function mapStateToProps(
  state: RootState,
  ownProps: KeyNavListItem.OwnProps<any>
): KeyNavListItem.StoreProps {
  return {
    isActive: selectKeyNavListCurrent(state).row === ownProps.row
  };
}

const mapDispatchToProps: KeyNavListItem.DispatchProps = {
  setCurrent: KeyNavListActions.setCurrent
};

const enhanceWithRedux = connect(mapStateToProps, mapDispatchToProps);
export const KeyNavListItem = enhanceWithRedux(KeyNavListItemInternal);
