import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Collapse from "@hzero-front-ui/c7n-ui/lib/Collapse";
import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { uuid } from "hzero-front-hmde/lib/utils/common";
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import notification from 'utils/notification';
import intl from 'utils/intl';
import DataVarItem from "./DataVarItem";
import Store from "../stores/EventFlowStore";
import styles from "../index.less?modules";
const Panel = _Collapse.Panel;
const DataVarList = observer(props => {
  const nodeCode = props.nodeCode;
  const _useContext = useContext(Store),
    eventFlowStore = _useContext.eventFlowStore;
  const nodeDataVars = eventFlowStore.nodeDataVars;
  const _useState = useState(nodeDataVars.get(nodeCode) || []),
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
    const _nodeDataVars = eventFlowStore.getNodeDataVars(nodeCode) || [];
    let required = true;
    for (const item of _nodeDataVars) {
      if (!item.dataVarName || !item.dataVarSource) {
        required = false;
        break;
      }
      if (item.dataVarSource !== 'IS_NULL' && !item.dataVarValue) {
        required = false;
        break;
      }
    }
    if (required) {
      setEditStatus(`dataVarItem${_nodeDataVars.length}`);
      _nodeDataVars.push({
        key: uuid()
      });
      eventFlowStore.setNodeDataVars(nodeCode, _nodeDataVars);
      setArray(_nodeDataVars);
    } else {
      notification.warning({
        message: intl.get('hmde.bo.text.Requiredfieldsmissing').d('有必填项未填，不可增加数据'),
        description: ''
      });
    }
  };
  // 删除变量
  const deleteVar = index => {
    const _nodeDataVars = eventFlowStore.getNodeDataVars(nodeCode) || [];
    _nodeDataVars.splice(index, 1);
    eventFlowStore.setNodeDataVars(nodeCode, _nodeDataVars);
    setArray(_nodeDataVars);
  };
  return /*#__PURE__*/React.createElement(_Collapse, {
    defaultActiveKey: ['1'],
    className: styles['data-var-list']
  }, /*#__PURE__*/React.createElement(Panel, {
    header: intl.get('hmde.bo.text.Dataoperationvariables').d('数据操作变量'),
    key: "1",
    extra: /*#__PURE__*/React.createElement(ImgIcon, {
      name: "create-new1.svg",
      size: 16,
      onClick: e => addVar(e)
    })
  }, array.map((item, index) => /*#__PURE__*/React.createElement(DataVarItem, _extends({
    key: item.key,
    record: item,
    index: index,
    editStatus: editStatus
  }, props, {
    deleteVar: deleteVar
  })))));
});
export default DataVarList;