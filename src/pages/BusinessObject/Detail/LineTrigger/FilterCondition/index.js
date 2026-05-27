import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useEffect, useMemo, useImperativeHandle, useState } from 'react';
import { observer } from 'mobx-react-lite';
import formatterCollections from 'utils/intl/formatterCollections';
import { FuncType } from 'choerodon-ui/pro/lib/button/enum';
import intl from 'utils/intl';
import { FormLayout } from 'choerodon-ui/pro/lib/form/enum';
import { getResponse } from 'utils/utils';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import BOPermissionButton from "hzero-front-hmde/lib/routes/BusinessObject/Detail/components/BOPermissionButton";
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
import { useStore as useFlowStore } from "hzero-front-hmde/lib/routes/ProcessDefinition/Designer/store";
import { getVariableList } from "hzero-front-apaas/lib/components/CustomSqlModal/service";
import { filterConditionDs, relationDs } from "./store";
import Item from "./component/Item";
import styles from "./index.less?modules";
const Index = props => {
  var _boStore$getState, _boStore$getState2;
  const _props$data = props.data,
    data = _props$data === void 0 ? [] : _props$data,
    _props$fieldData = props.fieldData,
    fieldData = _props$fieldData === void 0 ? [] : _props$fieldData,
    logicFormula = props.logicFormula,
    filterCacheRef = props.filterCacheRef,
    _props$disabled = props.disabled,
    disabled = _props$disabled === void 0 ? false : _props$disabled,
    boCode = props.boCode,
    newFlowVariableParams = props.newFlowVariableParams;
  const boStore = useBoStore();
  const flowStore = useFlowStore();
  const hasPermission = (_boStore$getState = boStore === null || boStore === void 0 ? void 0 : (_boStore$getState2 = boStore.getState) === null || _boStore$getState2 === void 0 ? void 0 : _boStore$getState2.call(boStore, 'hasPermission')) !== null && _boStore$getState !== void 0 ? _boStore$getState : true;
  const _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    systemVariable = _useState2[0],
    setSystemVariable = _useState2[1]; // 系统变量

  // 初始化事务流store中的数据
  useEffect(() => {
    var _flowStore$setState;
    if (newFlowVariableParams) {
      flowStore.setState('newFlowVariableParams', newFlowVariableParams);
    }
    flowStore === null || flowStore === void 0 ? void 0 : (_flowStore$setState = flowStore.setState) === null || _flowStore$setState === void 0 ? void 0 : _flowStore$setState.call(flowStore, 'isTriggerEnter', true);
  }, [newFlowVariableParams]);
  useEffect(() => {
    // 获取系统变量
    getVariableList('FLOW').then(res => {
      if (getResponse(res)) {
        setSystemVariable(res);
      }
    });
  }, []);

  // 过滤条件ds
  const filterDs = useMemo(() => {
    return new _DataSet(filterConditionDs());
  }, []);

  // 条件关系ds
  const relDs = useMemo(() => {
    return new _DataSet(relationDs(filterDs));
  }, [filterDs]);

  // 加载过滤条件数据
  useEffect(() => {
    filterDs.loadData(data);
  }, [data]);

  // 加载条件关系数据
  useEffect(() => {
    if (logicFormula) {
      relDs.loadData([{
        logicFormula
      }]);
    }
  }, [logicFormula, data]);

  // 删除item
  const deleteItem = record => {
    filterDs.delete(record, false).then(() => {
      setLogicFormula('del');
    });
  };

  // 赋值条件关系
  const setLogicFormula = type => {
    var _relDs$current, _relDs$current2;
    const itemLength = filterDs.length;
    const oldValue = relDs === null || relDs === void 0 ? void 0 : (_relDs$current = relDs.current) === null || _relDs$current === void 0 ? void 0 : _relDs$current.get('logicFormula');
    let result;
    if (itemLength === 1) {
      result = '1';
    } else if (type === 'add') {
      result = `${oldValue ? `${oldValue} AND` : ``} ${filterDs.length}`;
    } else {
      result = filterDs === null || filterDs === void 0 ? void 0 : filterDs.map((_, i) => i + 1).join(' AND ');
    }
    relDs === null || relDs === void 0 ? void 0 : (_relDs$current2 = relDs.current) === null || _relDs$current2 === void 0 ? void 0 : _relDs$current2.set('logicFormula', result);
  };

  // 对外暴露属性/方法
  useImperativeHandle(filterCacheRef, () => ({
    filterDs,
    relDs
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['export-template-top']
  }, /*#__PURE__*/React.createElement("span", {
    className: styles['export-template-span-label']
  }, intl.get('hmde.common.filterConditional').d('过滤条件')), /*#__PURE__*/React.createElement(BOPermissionButton, {
    funcType: "flat",
    icon: "add",
    onClick: async () => {
      filterDs === null || filterDs === void 0 ? void 0 : filterDs.create({});
      setLogicFormula('add');
    },
    disabled: disabled
  }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.addCondition').d('添加条件')))), !!(filterDs !== null && filterDs !== void 0 && filterDs.length) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: styles['config-content']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['config-head']
  }, /*#__PURE__*/React.createElement("span", null, " "), /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.variableType').d('变量类型')), /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.codingRule.variable').d('变量')), /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.LogicalSymbol').d('逻辑符')), /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.valueType').d('取值类型')), /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.price').d('值')), /*#__PURE__*/React.createElement("span", null, " ")), /*#__PURE__*/React.createElement("div", {
    className: styles['config-detail']
  }, filterDs === null || filterDs === void 0 ? void 0 : filterDs.map((record, index) => {
    return /*#__PURE__*/React.createElement(Item, {
      filterDs: filterDs,
      record: record,
      index: index,
      key: record.index,
      deleteItem: deleteItem,
      fieldData: fieldData,
      systemVariable: systemVariable,
      readonly: !hasPermission || disabled,
      boCode: boCode
    });
  }))), /*#__PURE__*/React.createElement("div", {
    className: styles['config-content-rel']
  }, /*#__PURE__*/React.createElement(_Form, {
    dataSet: relDs,
    layout: "none",
    disabled: !hasPermission
  }, /*#__PURE__*/React.createElement("span", {
    className: styles['trigger-opportunity-label']
  }, intl.get('hmde.common.conditionalRelation').d('条件关系'), /*#__PURE__*/React.createElement(_Tooltip, {
    title: intl.get('hmde.common.conditionalRelation.help').d('使用 AND 和 OR 合并筛选器条件行，示例：(1 AND 2) OR 3'),
    placement: "top"
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "help@v4.0.svg",
    size: 12,
    style: {
      margin: '0 0 2px 4px'
    }
  }))), /*#__PURE__*/React.createElement(_TextField, {
    name: "logicFormula",
    style: {
      width: '248px'
    },
    disabled: disabled
  })))));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Index));