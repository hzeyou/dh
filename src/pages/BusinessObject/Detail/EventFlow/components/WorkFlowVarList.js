import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Collapse from "@hzero-front-ui/c7n-ui/lib/Collapse";
import React, { useState, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
// import ImgIcon from '@hmde/utils/ImgIcon';
import intl from 'utils/intl';
import WorkFlowVarItem from "./WorkFlowVarItem";
import Store from "../stores/EventFlowStore";
import styles from "../index.less?modules";
const Panel = _Collapse.Panel;
const WorkFLowVarList = observer(props => {
  const nodeCode = props.nodeCode,
    updateFlag = props.updateFlag;
  const _useContext = useContext(Store),
    eventFlowStore = _useContext.eventFlowStore;
  const nodeWorkFlowVars = eventFlowStore.nodeWorkFlowVars;
  const _useState = useState(nodeWorkFlowVars.get(nodeCode) || []),
    _useState2 = _slicedToArray(_useState, 2),
    array = _useState2[0],
    setArray = _useState2[1];
  useEffect(() => {
    setArray(nodeWorkFlowVars.get(nodeCode) || []);
  }, [updateFlag]);
  // 增加变量
  // const addVar = (e) => {
  //   e.stopPropagation();
  //   setArray([...array, {}]);
  // };
  // 删除变量
  // const deleteVar = (index) => {
  //   const _nodeWorkFlowVars = eventFlowStore.getNodeWorkFlowVars(nodeCode) || [];
  //   _nodeWorkFlowVars.splice(index, 1);
  //   eventFlowStore.setNodeWorkFlowVars(nodeCode, _nodeWorkFlowVars);
  //   setArray(_nodeWorkFlowVars);
  // };

  return /*#__PURE__*/React.createElement(_Collapse, {
    defaultActiveKey: ['1'],
    className: styles['data-var-list']
  }, /*#__PURE__*/React.createElement(Panel, {
    header: intl.get('hmde.bo.model.Workflowprocessvariables').d('工作流流程变量'),
    key: "1"
    // extra={<ImgIcon name="create-new1.svg" size={16} onClick={(e) => addVar(e)} />}
  }, array.map((item, index) => /*#__PURE__*/React.createElement(WorkFlowVarItem, _extends({
    record: item,
    index: index
  }, props)))));
});
export default WorkFLowVarList;