import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Collapse from "@hzero-front-ui/c7n-ui/lib/Collapse";
import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { uuid } from "hzero-front-hmde/lib/utils/common";
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import notification from 'utils/notification';
import intl from 'utils/intl';
import FlowVarItem from "./FlowVarItem";
import Store from "../stores/EventFlowStore";
import styles from "../index.less?modules";
const Panel = _Collapse.Panel;
const FLowVarList = observer(props => {
  const nodeCode = props.nodeCode;
  const _useContext = useContext(Store),
    eventFlowStore = _useContext.eventFlowStore;
  const nodeFlowVars = eventFlowStore.nodeFlowVars;
  const _useState = useState(nodeFlowVars.get(nodeCode) || []),
    _useState2 = _slicedToArray(_useState, 2),
    array = _useState2[0],
    setArray = _useState2[1];
  const _useState3 = useState(''),
    _useState4 = _slicedToArray(_useState3, 2),
    editStatus = _useState4[0],
    setEditStatus = _useState4[1];
  // 增加变量
  const addVar = e => {
    e.stopPropagation();
    const _nodeFlowVars = eventFlowStore.getNodeFlowVars(nodeCode) || [];
    let required = true;
    for (const item of _nodeFlowVars) {
      if (!item.flowVarName || !item.flowVarSource) {
        required = false;
        break;
      }
      if (item.flowVarSource !== 'IS_NULL' && !item.flowVarValue) {
        required = false;
        break;
      }
    }
    if (required) {
      setEditStatus(`flowVarItem${_nodeFlowVars.length}`);
      _nodeFlowVars.push({
        key: uuid()
      });
      eventFlowStore.setNodeFlowVars(nodeCode, _nodeFlowVars);
      setArray(_nodeFlowVars);
    } else {
      notification.warning({
        message: intl.get('hmde.bo.text.Requiredfieldsmissing').d('有必填项未填，不可增加数据'),
        description: ''
      });
    }
  };
  // 删除变量
  const deleteVar = index => {
    const _nodeFlowVars = eventFlowStore.getNodeFlowVars(nodeCode) || [];
    _nodeFlowVars.splice(index, 1);
    eventFlowStore.setNodeFlowVars(nodeCode, _nodeFlowVars);
    setArray(_nodeFlowVars);
  };
  return /*#__PURE__*/React.createElement(_Collapse, {
    defaultActiveKey: ['1'],
    className: styles['data-var-list']
  }, /*#__PURE__*/React.createElement(Panel, {
    header: intl.get('hmde.bo.flow.title.flowVar').d('流程变量'),
    key: "1",
    extra: /*#__PURE__*/React.createElement(ImgIcon, {
      name: "create-new1.svg",
      size: 16,
      onClick: e => addVar(e)
    })
  }, array.map((item, index) => /*#__PURE__*/React.createElement(FlowVarItem, _extends({
    key: item.key,
    record: item,
    index: index,
    editStatus: editStatus
  }, props, {
    deleteVar: deleteVar
  })))));
});
export default FLowVarList;