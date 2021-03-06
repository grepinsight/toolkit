import * as mousetrap from "mousetrap";
import * as React from "react";
import { connect } from "react-redux";
import { FloatingMenuActions } from "../../actions/floatingMenuActions";
import { NavigationActions } from "../../actions/navigationActions";
import { View } from "../../types/viewTypes";
import { Views } from "../../views/view";

export namespace KeyboardShortcuts {
  export interface DispatchProps {
    showFloatingMenu: typeof FloatingMenuActions.show;
    hideFloatingMenu: typeof FloatingMenuActions.hide;
    setNav: typeof NavigationActions.setNav;
  }

  export type Props = DispatchProps;
}

class KeyboardShortcutsInternal extends React.PureComponent<KeyboardShortcuts.Props> {
  private navListenerUnsubscribeCallbacks: (() => void)[] = [];

  public componentDidMount() {
    this.registerKeyboardListeners();
  }

  public componentWillUnmount() {
    this.unregisterKeyboardListeners();
  }

  public render() {
    return null;
  }

  private registerKeyboardListeners() {
    // floating menu
    mousetrap.bind("esc", this.props.hideFloatingMenu);
    mousetrap.bind("/", this.handleSlashKeyUp);

    // navigation
    Views.forEach((view, index) => {
      // start from index 1 for easier keyboard nav
      const callback = this.createNavCallback(index + 1, view);
      // use document.addEventListener over mousetrap so that it's listened to
      // regardless of context (e.g. input, textarea, etc.)
      document.addEventListener("keydown", callback);
      this.navListenerUnsubscribeCallbacks.push(() =>
        document.removeEventListener("keydown", callback)
      );
    });
  }

  private unregisterKeyboardListeners() {
    mousetrap.reset();
    this.navListenerUnsubscribeCallbacks.forEach(callback => callback());
  }

  private handleSlashKeyUp = (evt: ExtendedKeyboardEvent) => {
    const target = (evt.target ?? evt.srcElement) as HTMLElement | null;
    if (target == null || !SLASH_IGNORED_TAG_NAMES.has(target.tagName?.toLowerCase())) {
      this.props.showFloatingMenu();
      // prevent default of this keyUp as it will cause the floating menu
      // input to have the "/" key registered and set as value
      // evt.stopPropagation();
      evt.preventDefault();
    }
  };

  private createNavCallback(index: number, view: View<any>) {
    return (evt: KeyboardEvent) => {
      if (evt.key === `${index}` && evt.metaKey) {
        this.props.setNav(view.name);
      }
    };
  }
}

const SLASH_IGNORED_TAG_NAMES = new Set(["input", "textarea", "select"]);

const mapDispatchToProps: KeyboardShortcuts.DispatchProps = {
  showFloatingMenu: FloatingMenuActions.show,
  hideFloatingMenu: FloatingMenuActions.hide,
  setNav: NavigationActions.setNav
};

const enhanceWithRedux = connect(undefined, mapDispatchToProps);
export const KeyboardShortcuts = enhanceWithRedux(KeyboardShortcutsInternal);
