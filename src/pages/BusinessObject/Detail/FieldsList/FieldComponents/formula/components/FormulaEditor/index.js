import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _noop from "lodash/noop";
import React, { useCallback, useEffect, useRef, useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import ReactMonacoEditor, { monaco } from "hzero-front-apaas/lib/components/MonacoEditor";
import { useLanguageSuggestion, useLanguage } from "hzero-front-hmde/lib/businessComponents/FormulaEditorCore/hooks";
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import { registryAutoSelectBlocks, registryEditorTheme, registryMonarchTokensProvider } from "./utils";
import styles from "./index.less?modules";
const THEME = 'formulaEditorTheme';
const FormulaEditor = /*#__PURE__*/forwardRef((props, forwardedRef) => {
  const autoSelectBlocks = props.autoSelectBlocks,
    disabled = props.disabled,
    highLightBlocks = props.highLightBlocks,
    initLanguage = props.initLanguage,
    initValue = props.initValue,
    _props$onChange = props.onChange,
    onChange = _props$onChange === void 0 ? _noop : _props$onChange,
    _props$onBlur = props.onBlur,
    onBlur = _props$onBlur === void 0 ? _noop : _props$onBlur,
    _props$onEditorDidMou = props.onEditorDidMounted,
    onEditorDidMounted = _props$onEditorDidMou === void 0 ? _noop : _props$onEditorDidMou,
    _props$handleCheckFor = props.handleCheckFormula,
    handleCheckFormula = _props$handleCheckFor === void 0 ? _noop : _props$handleCheckFor,
    style = props.style,
    _props$suggestions = props.suggestions,
    suggestions = _props$suggestions === void 0 ? [] : _props$suggestions;
  const _useState = useState(initValue),
    _useState2 = _slicedToArray(_useState, 2),
    code = _useState2[0],
    setCode = _useState2[1];
  const editorInstance = useRef(null);
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  const monacoInstance = useRef(null);
  const unListenerRef = useRef(_noop);
  const language = useLanguage(initLanguage);

  // 外部业务逻辑写在这
  useImperativeHandle(forwardedRef, () => ({
    checkMakers() {
      var _editorInstance$curre, _editorInstance$curre2;
      return !!((_editorInstance$curre = editorInstance.current) !== null && _editorInstance$curre !== void 0 && (_editorInstance$curre2 = _editorInstance$curre.getValue) !== null && _editorInstance$curre2 !== void 0 && _editorInstance$curre2.call(_editorInstance$curre));
      // return !!(monaco.editor.getModelMarkers({}).length === 0 && code);
    },
    clear() {
      setCode('');
    },
    // 插入字符串
    appendText(value) {
      if (!editorInstance.current || typeof value !== 'string') {
        return;
      }
      const selection = editorInstance.current.getSelection();
      if (selection) {
        const range = new monaco.Range(selection === null || selection === void 0 ? void 0 : selection.startLineNumber, selection === null || selection === void 0 ? void 0 : selection.startColumn, selection === null || selection === void 0 ? void 0 : selection.endLineNumber, selection === null || selection === void 0 ? void 0 : selection.endColumn);
        const id = {
          major: 1,
          minor: 1
        };
        const op = {
          identifier: id,
          range,
          text: value || ' ',
          forceMoveMarkers: true
        };
        editorInstance.current.executeEdits('', [op]);
      }
      editorInstance.current.focus();
    },
    setInitValue(value) {
      setCode(value);
      if (!editorInstance.current) {
        return;
      }
      const editor = editorInstance.current;
      // 第一次进来时，不覆盖原有的值，在原有的值之后添加
      const selection = editor.getSelection();
      editor.setSelections([new monaco.Selection(selection === null || selection === void 0 ? void 0 : selection.endLineNumber, selection === null || selection === void 0 ? void 0 : selection.endColumn, (selection === null || selection === void 0 ? void 0 : selection.endLineNumber) + 1, (selection === null || selection === void 0 ? void 0 : selection.endColumn) + 1)]);
      setTimeout(() => {
        // 保证代码块下一次能触发选中
        editor.focus();
      }, 500);
    },
    editorInstance
  }));
  useEffect(() => {
    // 注册主题
    registryEditorTheme(THEME);
    return () => {
      // 卸载事件监听
      unListenerRef.current();
    };
  }, []);

  // 自动高亮块
  useEffect(() => {
    if (!(highLightBlocks !== null && highLightBlocks !== void 0 && highLightBlocks.length)) {
      return;
    }
    const disposable = registryMonarchTokensProvider(language, highLightBlocks);
    return () => {
      disposable.dispose();
    };
  }, [highLightBlocks]);

  // 自动选择块
  useEffect(() => {
    if (!autoSelectBlocks) {
      return;
    }
    const disposable = registryAutoSelectBlocks(editorInstance.current, autoSelectBlocks);
    return () => disposable.dispose();
  }, [autoSelectBlocks]);

  // 注册提示
  useLanguageSuggestion(language, suggestions);

  // monaco editor 配置
  const options = useMemo(() => ({
    roundedSelection: false,
    cursorStyle: 'line',
    automaticLayout: true,
    selectOnLineNumbers: true,
    wordWrap: 'on',
    readOnly: disabled,
    minimap: {
      enabled: false // 是否启用预览图
    }
  }), [disabled]);

  // 挂载事件监听
  const patchEventsListeners = useCallback(editor => {
    const onblurIDisposable = editor.onDidBlurEditorText(handleEditorBlur);
    // editor.getSelection()
    unListenerRef.current = () => {
      onblurIDisposable.dispose();
    };
  }, []);
  const handleChange = useCallback(value => {
    setCode(value);
    onChange(value);
  }, [onChange]);
  const handleEditorDidMount = useCallback((editor, monacoEditor) => {
    editorInstance.current = editor;
    monacoInstance.current = monacoEditor;
    onEditorDidMounted(editor, monacoEditor);
    patchEventsListeners(editor);
  }, [highLightBlocks]);
  const handleEditorBlur = useCallback(() => {
    onBlur();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: style,
    className: [styles['editor-wrapper'], disabled ? styles.disabled : ''].join(' ')
  }, /*#__PURE__*/React.createElement(ReactMonacoEditor, {
    width: "100%",
    height: "100%",
    language: language,
    value: code,
    options: options,
    onChange: handleChange,
    editorDidMount: handleEditorDidMount,
    theme: THEME
  }), !disabled && /*#__PURE__*/React.createElement(_Tooltip, {
    title: "\u6821\u9A8C",
    placement: "top",
    theme: "dark"
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    className: styles['data-check-icon-page'],
    name: "display@1x.svg",
    size: "14px",
    onClick: handleCheckFormula
  })));
});
export default FormulaEditor;