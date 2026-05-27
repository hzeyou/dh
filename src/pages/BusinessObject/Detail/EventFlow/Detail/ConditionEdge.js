import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import React, { useContext, useEffect, useMemo, useState } from 'react';
// import intl from 'utils/intl';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import Store from "../stores/EventFlowStore";
const Option = _Select.Option;
const Index = ({
  edge,
  nodeCode
}) => {
  var _edge$getSourceNode, _edge$getSourceNode$t, _edge$getTargetNode, _edge$getTargetNode$t, _nodeData$attributeJs, _nodeData$conditions2;
  const _useContext = useContext(Store),
    eventFlowStore = _useContext.eventFlowStore;
  const conditionNodeCode = edge === null || edge === void 0 ? void 0 : (_edge$getSourceNode = edge.getSourceNode()) === null || _edge$getSourceNode === void 0 ? void 0 : (_edge$getSourceNode$t = _edge$getSourceNode.toJSON()) === null || _edge$getSourceNode$t === void 0 ? void 0 : _edge$getSourceNode$t.nodeCode;
  const childNodeCode = edge === null || edge === void 0 ? void 0 : (_edge$getTargetNode = edge.getTargetNode()) === null || _edge$getTargetNode === void 0 ? void 0 : (_edge$getTargetNode$t = _edge$getTargetNode.toJSON()) === null || _edge$getTargetNode$t === void 0 ? void 0 : _edge$getTargetNode$t.nodeCode;
  const nodeData = useMemo(() => eventFlowStore.getEventFlowNode(conditionNodeCode) || {}, [conditionNodeCode]);
  const childrenConditionList = (nodeData === null || nodeData === void 0 ? void 0 : (_nodeData$attributeJs = nodeData.attributeJson) === null || _nodeData$attributeJs === void 0 ? void 0 : _nodeData$attributeJs.childrenConditionList) || [];
  const childConditionIndex = childrenConditionList === null || childrenConditionList === void 0 ? void 0 : childrenConditionList.findIndex(item => (item === null || item === void 0 ? void 0 : item.childNodeCode) === childNodeCode);
  const _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    conditionCode = _useState2[0],
    setConditionCode = _useState2[1];
  useEffect(() => {
    var _childrenConditionLis;
    setConditionCode(((_childrenConditionLis = childrenConditionList[childConditionIndex]) === null || _childrenConditionLis === void 0 ? void 0 : _childrenConditionLis.conditionCode) || '');
  }, [nodeCode]);
  const handleSetEdgeCondition = (val = '') => {
    var _nodeData$conditions, _nodeData$conditions$, _nodeData$conditions$2;
    if (childConditionIndex > -1) {
      if (val) {
        childrenConditionList[childConditionIndex].conditionCode = val;
      } else {
        childrenConditionList.splice(childConditionIndex, 1);
      }
    } else {
      childrenConditionList.push({
        childNodeCode,
        conditionCode: val
      });
    }
    setConditionCode(val);
    edge.setLabels((nodeData === null || nodeData === void 0 ? void 0 : (_nodeData$conditions = nodeData.conditions) === null || _nodeData$conditions === void 0 ? void 0 : (_nodeData$conditions$ = _nodeData$conditions.find) === null || _nodeData$conditions$ === void 0 ? void 0 : (_nodeData$conditions$2 = _nodeData$conditions$.call(_nodeData$conditions, c => (c === null || c === void 0 ? void 0 : c.conditionCode) === val)) === null || _nodeData$conditions$2 === void 0 ? void 0 : _nodeData$conditions$2.conditionName) || '');
    eventFlowStore.setNodeData(conditionNodeCode, 'attributeJson', {
      ...nodeData.attributeJson,
      childrenConditionList
    });
  };
  return edge && /*#__PURE__*/React.createElement(_Form, {
    labelLayout: 'vertical'
  }, /*#__PURE__*/React.createElement(_Select, {
    label: intl.get('hmde.bo.view.conditionalbranch').d('条件分支'),
    value: conditionCode,
    onChange: handleSetEdgeCondition,
    optionsFilter: option => !childrenConditionList.some(({
      conditionCode: code
    }) => code === option.get('value'))
  }, nodeData === null || nodeData === void 0 ? void 0 : (_nodeData$conditions2 = nodeData.conditions) === null || _nodeData$conditions2 === void 0 ? void 0 : _nodeData$conditions2.map(item => /*#__PURE__*/React.createElement(Option, {
    value: item.conditionCode
  }, item.conditionName))));
};
export default formatterCollections({
  code: ['hmde.bo']
})(observer(Index));