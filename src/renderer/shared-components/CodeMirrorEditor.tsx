import classNames from "classnames";
import CodeMirror from "codemirror";
import * as React from "react";

import "codemirror/lib/codemirror.css";
import "./base16-ocean-dark.scss";
import "./CodeMirrorEditor.scss";

// no mode yet
// import "codemirror/mode/javascript/javascript.js";
import "codemirror/addon/edit/closebrackets.js";
import "codemirror/addon/selection/active-line.js";

export namespace CodeMirrorEditor {
  export interface Props {
    className?: string;
    value: string;
    onChange(value: string): void;
    onKeyUp?(event: KeyboardEvent): void;
  }
}

type ExtendedCodeMirrorConfiguration = CodeMirror.EditorConfiguration & {
  styleActiveLine: boolean;
  autoCloseBrackets: boolean;
};

export class CodeMirrorEditor extends React.PureComponent<CodeMirrorEditor.Props> {
  private divRef = React.createRef<HTMLDivElement>();

  public componentDidMount() {
    if (this.divRef.current != null) {
      const configurations: ExtendedCodeMirrorConfiguration = {
        autofocus: true,
        tabSize: 2,
        lineNumbers: true,
        theme: "base16-ocean-dark",
        styleActiveLine: true,
        lineWrapping: true,
        autoCloseBrackets: true,
        mode: ""
        // no modes for now
        // mode: {
        //   name: "javascript",
        //   typescript: true
        // }
      };

      const codeMirror = CodeMirror(this.divRef.current, configurations);
      codeMirror.setValue(this.props.value);

      codeMirror.on("changes", editor => {
        this.props.onChange(editor.getValue());
      });

      if (this.props.onKeyUp != null) {
        codeMirror.on("keyup", (_editor, event) => {
          this.props.onKeyUp!(event);
        });
      }
    }
  }

  public render() {
    return (
      <div className={classNames("code-mirror-editor", this.props.className)} ref={this.divRef} />
    );
  }
}
