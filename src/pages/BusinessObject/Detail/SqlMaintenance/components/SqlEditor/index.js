import React, { forwardRef, useCallback, useRef, useImperativeHandle } from 'react';
import { useObserver } from 'mobx-react-lite';
import MonacoSqlEditor from "hzero-front-apaas/lib/components/MonacoSqlEditor";
import ToolBar from "./components/Toolbar";
import styles from "./index.less?modules";
const SqlEditor = /*#__PURE__*/forwardRef(({
  disabled
}, ref) => {
  const editorInstanceRef = useRef(null);

  // 获取编辑器实例
  const editorDidMountHandle = useCallback(editor => {
    editorInstanceRef.current = editor;
  }, []);
  useImperativeHandle(ref, () => {
    return {
      editorInstance: editorInstanceRef.current
    };
  });
  return useObserver(() => /*#__PURE__*/React.createElement("div", {
    className: styles.wrapper
  }, /*#__PURE__*/React.createElement(ToolBar, {
    editorInstanceRef: editorInstanceRef,
    disabled: disabled
  }), /*#__PURE__*/React.createElement(MonacoSqlEditor, {
    height: 350,
    width: "100%",
    isSqlTips: true,
    editorDidMount: editorDidMountHandle,
    disabled: disabled
  })));
});
export default SqlEditor;