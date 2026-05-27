import React, { useCallback, useRef, useMemo } from 'react';
import MonacoEditor, { monaco } from "hzero-front-apaas/lib/components/MonacoEditor";
import classNames from 'classnames';
import intl from 'utils/intl';
import { FilterFieldsNameType } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionPolicyDS";
import ImgText from "hzero-front-hmde/lib/assets/icon/text.svg";
import { useLocalStore, observer } from 'mobx-react-lite';
import ListItem from "./components/ListItem";
import styles from "./index.less?modules";
const variableData = [{
  value: 'userId',
  meaning: intl.get('hmde.bo.businessObject.fieldtext.userId').d('用户ID'),
  type: 'Long'
}, {
  value: 'realName',
  meaning: intl.get('hmde.bo.businessObject.realName').d('用户真实名称'),
  type: 'String'
}, {
  value: 'email',
  meaning: intl.get('hmde.bo.businessObject.fieldtext.email').d('用户邮箱'),
  type: 'String'
}, {
  value: 'timeZone',
  meaning: intl.get('hmde.bo.businessObject.currentUsageTimeZone').d('用户当前使用时区'),
  type: 'String'
}, {
  value: 'language',
  meaning: intl.get('hmde.bo.businessObject.fieldtext.language').d('用户当前使用语言'),
  type: 'String'
}, {
  value: 'userType',
  meaning: intl.get('hmde.bo.businessObject.fieldtext.userType').d('用户类型, PC端/APP端'),
  type: 'String'
}, {
  value: 'roleId',
  meaning: intl.get('hmde.bo.businessObject.fieldtext.roleId').d('当前角色Id'),
  type: 'Long'
}, {
  value: 'roleMergeFlag',
  meaning: intl.get('hmde.bo.businessObject.fieldtext.roleMergeFlag').d('角色合并标记'),
  type: 'Boolean'
}, {
  value: 'tenantId',
  meaning: intl.get('hmde.bo.businessObject.fieldtext.tenantId').d('当前租户ID'),
  type: 'Long'
}, {
  value: 'tenantNum',
  meaning: intl.get('hmde.bo.businessObject.fieldtext.tenantNum').d('当前租户编码'),
  type: 'String'
}, {
  value: 'organizationId',
  meaning: intl.get('hmde.bo.businessObject.fieldtext.organizationId').d('所属租户ID'),
  type: 'Long'
}, {
  value: 'isAdmin',
  meaning: intl.get('hmde.bo.businessObject.fieldtext.isAdmin').d('是否为超级管理员账号'),
  type: 'Boolean'
}];
/** 废弃该组件，使用CustomSqlModal */
const SqlModal = ({
  record,
  readOnly,
  drillText
}) => {
  var _variableData$listSto;
  const editorRef = useRef(null);
  const listStore = useLocalStore(() => ({
    hoverIndex: -1
  }));
  const handleHover = index => {
    listStore.hoverIndex = index;
  };
  const onItemClick = value => {
    var _record$get, _editorRef$current;
    const _inputValue = `${(_record$get = record === null || record === void 0 ? void 0 : record.get(FilterFieldsNameType.RIGHT_VALUE)) !== null && _record$get !== void 0 ? _record$get : ''} ${value}`;
    record === null || record === void 0 ? void 0 : record.set(FilterFieldsNameType.RIGHT_VALUE, _inputValue);
    // eslint-disable-next-line no-unused-expressions
    (_editorRef$current = editorRef.current) === null || _editorRef$current === void 0 ? void 0 : _editorRef$current.editor.focus();
  };
  const onInputChange = useCallback(value => {
    record === null || record === void 0 ? void 0 : record.set(FilterFieldsNameType.RIGHT_VALUE, value);
  }, []);
  const isInputError = useMemo(() => {
    return !(record !== null && record !== void 0 && record.get(FilterFieldsNameType.RIGHT_VALUE));
  }, [record === null || record === void 0 ? void 0 : record.get(FilterFieldsNameType.RIGHT_VALUE)]);
  const editorDidMountHandle = useCallback((editor, monacoIns) => {
    // 变量提示
    monacoIns.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems() {
        return {
          suggestions: variableData.map(item => ({
            label: item.value,
            kind: monaco.languages.CompletionItemKind.Variable,
            documentation: item.meaning,
            insertText: item.value
            // range: {
            //   // startLineNumber: 0,
            // },
          }))
        };
      }
    });
    // 编辑器聚焦
    editor.focus();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: styles.wrapper
  }, readOnly ? /*#__PURE__*/React.createElement("div", {
    className: styles['read-tips']
  }, "\u3010", drillText, "\xA0=\xA0", intl.get('hmde.common.custom').d('自定义'), "SQL\u3011") : /*#__PURE__*/React.createElement("div", {
    className: styles.tips
  }, /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, intl.get('hmde.bo.businessObject.sqltext').d('动态SQL 作为一个字段的条件查询，可嵌套SQL')), /*#__PURE__*/React.createElement("li", null, intl.get('hmde.bo.businessObject.sqltext2').d('支持动态参数'), " #{}(", intl.get('hmde.bo.businessObject.sqltext3').d('参数必须在CustomUserDetails中，参数形式为 userInfo.xxx'), ")", intl.get('hmde.bo.businessObject.example').d('示例'), "\uFF1Aselect a.columnA from tableA a where a.columnB = #{userInfo.userId}"), /*#__PURE__*/React.createElement("li", null, intl.get('hmde.bo.businessObject.sqltext4').d('目前支持的 userDetail 的可使用变量列举如下'), ":"))), /*#__PURE__*/React.createElement("div", {
    className: styles.content
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames({
      [styles.input]: true,
      [styles.error]: isInputError
    })
  }, /*#__PURE__*/React.createElement(MonacoEditor, {
    language: "sql",
    width: "100%",
    height: "100%",
    theme: "vs",
    value: record === null || record === void 0 ? void 0 : record.get(FilterFieldsNameType.RIGHT_VALUE),
    onChange: onInputChange,
    ref: editorRef,
    options: {
      roundedSelection: false,
      readOnly,
      cursorStyle: 'line',
      automaticLayout: true,
      selectOnLineNumbers: true,
      wordWrap: 'on'
    },
    editorDidMount: editorDidMountHandle
  })), !readOnly && /*#__PURE__*/React.createElement("div", {
    className: styles.optional
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.name
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.title
  }, /*#__PURE__*/React.createElement("img", {
    src: ImgText,
    alt: "text"
  }), intl.get('hmde.bo.businessObject.fieldtext.Variable').d('变量名称')), /*#__PURE__*/React.createElement("div", {
    className: styles.list
  }, variableData.map(({
    value
  }, index) => /*#__PURE__*/React.createElement(ListItem, {
    key: value,
    value: value,
    isHover: index === listStore.hoverIndex,
    handleHover: () => handleHover(index),
    onClick: () => onItemClick(value)
  })))), /*#__PURE__*/React.createElement("div", {
    className: styles.mean
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.title
  }, /*#__PURE__*/React.createElement("img", {
    src: ImgText,
    alt: "text"
  }), intl.get('hmde.bo.businessObject.fieldtext.Meaningofvariables').d('变量含义')), /*#__PURE__*/React.createElement("div", {
    className: styles.text
  }, (_variableData$listSto = variableData[listStore.hoverIndex]) === null || _variableData$listSto === void 0 ? void 0 : _variableData$listSto.meaning)))));
};
export default observer(SqlModal);