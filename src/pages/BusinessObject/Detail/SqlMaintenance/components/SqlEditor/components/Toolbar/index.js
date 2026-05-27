import _Dropdown from "@hzero-front-ui/c7n-ui/lib/DropdownPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Menu from "@hzero-front-ui/c7n-ui/lib/MenuPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import intl from 'utils/intl';
import { FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { useRequest } from 'ahooks';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import { formatSql } from "hzero-front-apaas/lib/utils/sql";
import { quickInsertCode } from "hzero-front-hmde/lib/utils/editor";
import { getVariableList } from "hzero-front-apaas/lib/components/CustomSqlModal/service";
import SqlStatementTips from "hzero-front-hmde/lib/routes/ProcessDefinition/Designer/Node/components/SqlStatementTips";
import styles from "./index.less?modules";
const Toolbar = ({
  editorInstanceRef,
  disabled
}) => {
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    canRedo = _useState2[0],
    setCanRedo = _useState2[1];
  const _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    canUndo = _useState4[0],
    setCanUndo = _useState4[1];
  const redoNumberRef = useRef(0); // 可撤回的最大备份id

  // 拿到系统变量数据
  const _useRequest = useRequest(() => getVariableList('SQL'), {
      staleTime: -1
    }),
    variableList = _useRequest.data;
  useEffect(() => {
    var _editorInstanceRef$cu;
    (_editorInstanceRef$cu = editorInstanceRef.current) === null || _editorInstanceRef$cu === void 0 ? void 0 : _editorInstanceRef$cu.onDidChangeModelContent(() => {
      var _editorInstanceRef$cu2;
      const model = (_editorInstanceRef$cu2 = editorInstanceRef.current) === null || _editorInstanceRef$cu2 === void 0 ? void 0 : _editorInstanceRef$cu2.getModel();
      if (model) {
        const altId = model.getAlternativeVersionId();
        setCanRedo(altId < redoNumberRef.current);
        setCanUndo(altId > 2);
      }
    });
  }, []);
  const handleReset = () => {
    _Modal.confirm({
      title: intl.get('hmde.bo.sqlEditor.handleTips1').d('确认清空SQL初始内容吗?')
    }).then(button => {
      if (button === 'ok') {
        var _editorInstanceRef$cu3;
        (_editorInstanceRef$cu3 = editorInstanceRef.current) === null || _editorInstanceRef$cu3 === void 0 ? void 0 : _editorInstanceRef$cu3.setValue('');
      }
    });
  };
  const handleUndo = () => {
    var _editorInstanceRef$cu4, _editorInstanceRef$cu5, _editorInstanceRef$cu6;
    // 撤销输入
    redoNumberRef.current = Math.max(redoNumberRef.current, ((_editorInstanceRef$cu4 = editorInstanceRef.current) === null || _editorInstanceRef$cu4 === void 0 ? void 0 : (_editorInstanceRef$cu5 = _editorInstanceRef$cu4.getModel()) === null || _editorInstanceRef$cu5 === void 0 ? void 0 : _editorInstanceRef$cu5.getAlternativeVersionId()) || 0);
    (_editorInstanceRef$cu6 = editorInstanceRef.current) === null || _editorInstanceRef$cu6 === void 0 ? void 0 : _editorInstanceRef$cu6.trigger('keyboard', 'undo', null);
  };
  const handleRedo = () => {
    var _editorInstanceRef$cu7;
    (_editorInstanceRef$cu7 = editorInstanceRef.current) === null || _editorInstanceRef$cu7 === void 0 ? void 0 : _editorInstanceRef$cu7.trigger('keyboard', 'redo', null);
  };
  const handleAddVariable = value => {
    if (editorInstanceRef.current) {
      quickInsertCode(editorInstanceRef.current, value);
    }
  };
  const handleBeautifySql = () => {
    if (editorInstanceRef.current) {
      formatSql(editorInstanceRef.current);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles.toolbar
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.title
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.name
  }, intl.get('hmde.pd.processDefinition.sql').d('SQL 语句'), /*#__PURE__*/React.createElement(_Tooltip, {
    placement: "top",
    theme: "light",
    title: /*#__PURE__*/React.createElement(SqlStatementTips, null)
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "help",
    style: {
      fontSize: 14,
      marginLeft: 5,
      marginRight: 25,
      color: 'rgba(0,0,0,.45)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: styles.line
  }), !disabled && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Tooltip, {
    placement: "bottom",
    title: intl.get('hmde.bo.businessObject.empty').d('清空'),
    theme: "dark"
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "reset-bold.svg",
    size: 14,
    onClick: handleReset,
    style: {
      cursor: 'pointer'
    }
  })), /*#__PURE__*/React.createElement(_Tooltip, {
    placement: "bottom",
    title: intl.get('hmde.common.view.revoke').d('撤销'),
    theme: "dark"
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "revocation.svg",
    size: 14,
    style: {
      cursor: canUndo ? 'pointer' : 'not-allowed',
      opacity: canUndo ? 1 : 0.5
    },
    onClick: () => canUndo && handleUndo()
  })), /*#__PURE__*/React.createElement(_Tooltip, {
    placement: "bottom",
    title: intl.get('hmde.bo.sqlEditor.redo').d('重做'),
    theme: "dark"
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "renewal.svg",
    size: 14,
    style: {
      cursor: canRedo ? 'pointer' : 'not-allowed',
      opacity: canRedo ? 1 : 0.5
    },
    onClick: () => canRedo && handleRedo()
  })), /*#__PURE__*/React.createElement(_Tooltip, {
    placement: "bottom",
    title: intl.get('hmde.bo.sqlEditor.beautifySql').d('美化 SQL'),
    theme: "dark"
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "auto_fix_high",
    style: {
      cursor: 'pointer',
      color: 'rgba(0,0,0,0.65)'
    },
    onClick: handleBeautifySql
  })))), !disabled && /*#__PURE__*/React.createElement("div", {
    className: styles.extra
  }, /*#__PURE__*/React.createElement(_Dropdown, {
    overlay: /*#__PURE__*/React.createElement(_Menu, {
      selectable: false
    }, variableList === null || variableList === void 0 ? void 0 : variableList.map(item => /*#__PURE__*/React.createElement(_Menu.Item, {
      key: item.value
    }, /*#__PURE__*/React.createElement("a", {
      onClick: () => handleAddVariable(item.value)
    }, item.meaning))))
  }, /*#__PURE__*/React.createElement(_Button, {
    funcType: "link"
  }, intl.get('hmde.common.systemVariables').d('系统变量'), /*#__PURE__*/React.createElement(_Icon, {
    type: "keyboard_arrow_down"
  })))));
};
export default observer(Toolbar);