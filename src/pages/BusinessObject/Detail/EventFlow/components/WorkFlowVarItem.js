import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
const _excluded = ["__dirty"];
import React, { useMemo, useState, useContext, useEffect, useRef } from 'react';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { LabelLayout } from 'choerodon-ui/pro/lib/form/enum';
import DrillComponent, { EDrillMainKeyType } from 'hzero-front-apaas/lib/components/DrillComponent';
import intl from 'utils/intl';
import Store from "../stores/EventFlowStore";
import styles from "../index.less?modules";
const Option = _Select.Option;
const WorkFlowVarItem = props => {
  const nodeCode = props.nodeCode,
    record = props.record;
  const _useContext = useContext(Store),
    eventFlowStore = _useContext.eventFlowStore,
    flowVarDS = _useContext.flowVarDS,
    businessObjectCode = _useContext.businessObjectCode;
  const previousDS = eventFlowStore.previousDS,
    setEditFn = eventFlowStore.setEditFn,
    activeCard = eventFlowStore.activeCard;
  const index = props.index;
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    showState = _useState2[0],
    setShowState = _useState2[1];
  const eleId = `workFlowVarItem${index}`;
  const _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    edit = _useState4[0],
    setEdit = _useState4[1];
  const _useState5 = useState(record === null || record === void 0 ? void 0 : record.workFlowVarSource),
    _useState6 = _slicedToArray(_useState5, 2),
    workFlowVarSource = _useState6[0],
    setWorkFlowVarSource = _useState6[1];
  const fieldName = useRef('');
  const onMouseEnter = () => {
    setShowState(true);
  };
  const onMouseLeave = () => {
    setShowState(false);
  };
  const fn1 = e => {
    e._customFlag = eleId;
  };
  useEffect(() => {
    var _document, _document$getElementB;
    // eslint-disable-next-line
    (_document = document) === null || _document === void 0 ? void 0 : (_document$getElementB = _document.getElementById(eleId)) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.addEventListener('click', fn1);
    return () => {
      var _document2, _document2$getElement;
      // eslint-disable-next-line
      (_document2 = document) === null || _document2 === void 0 ? void 0 : (_document2$getElement = _document2.getElementById(eleId)) === null || _document2$getElement === void 0 ? void 0 : _document2$getElement.removeEventListener('click', fn1);
    };
  }, []);
  const FlowVarSelect = () => {
    return /*#__PURE__*/React.createElement(_Select, {
      name: "workFlowVarValue"
    }, flowVarDS.toData().map(item => {
      return /*#__PURE__*/React.createElement(Option, {
        value: item.flowVarKey
      }, item.flowVarKey);
    }));
  };
  const ds = useMemo(() => new _DataSet({
    autoCreate: true,
    fields: [{
      name: 'workFlowVarName',
      type: "string",
      label: intl.get('hmde.bo.model.variablename').d('变量名'),
      required: true
    }, {
      name: 'workFlowVarCode',
      type: "string",
      label: intl.get('hmde.bo.model.variablecode').d('变量编码')
    }, {
      name: 'workFlowVarSource',
      type: "string",
      label: intl.get('hmde.bo.model.variableValueSource').d('变量值来源'),
      required: true
    }, {
      name: 'workFlowVarValue',
      type: "string",
      label: intl.get('hmde.bo.businessObject.variableValue').d('变量值'),
      computedProps: {
        required: ({
          record: _record
        }) => _record.get('workFlowVarSource') !== 'IS_NULL'
      }
    }],
    events: {
      load: ({
        dataSet
      }) => {
        if (nodeCode) {
          const nodeWorkFlowVars = eventFlowStore.getNodeWorkFlowVars(nodeCode) || [];
          nodeWorkFlowVars[index] = dataSet.current.toData();
          eventFlowStore.setNodeFlowVars(nodeCode, nodeWorkFlowVars);
        }
      },
      update: ({
        record: _record,
        name,
        value
      }) => {
        if (name === 'workFlowVarName') {
          const selectedValue = flowVarDS.toData().find(item => item.flowVarKey === value);
          if (selectedValue) {
            _record.set('workFlowVarSource', selectedValue.sourceType);
            _record.set('workFlowVarValue', selectedValue.workFlowVarValue);
          }
        }
        if (name === 'workFlowVarSource') {
          setWorkFlowVarSource(value);
          if (!value || value === 'IS_NULL') {
            _record.set('workFlowVarValue', '');
          }
        }
        if (nodeCode) {
          const nodeWorkFlowVars = eventFlowStore.getNodeWorkFlowVars(nodeCode) || [];
          const _ref = _record.toData() || {},
            __dirty = _ref.__dirty,
            recordData = _objectWithoutProperties(_ref, _excluded);
          nodeWorkFlowVars[index] = recordData;
          eventFlowStore.setNodeWorkFlowVars(nodeCode, nodeWorkFlowVars);
        }
      }
    }
  }), []);
  const handleOk = params => {
    const value = params.value,
      text = params.text;
    if (ds.current) {
      ds.current.set(fieldName.current, value);
      ds.current.set(`${fieldName.current}Text`, text);
    }
  };
  const drillRenderer = (_fieldName, readOnly = false) => {
    var _ds$current2;
    fieldName.current = _fieldName;
    return /*#__PURE__*/React.createElement(DrillComponent, {
      onOk: handleOk,
      onClear: () => {
        var _ds$current;
        return ds === null || ds === void 0 ? void 0 : (_ds$current = ds.current) === null || _ds$current === void 0 ? void 0 : _ds$current.set(_fieldName, '');
      },
      name: _fieldName,
      initValue: ds === null || ds === void 0 ? void 0 : (_ds$current2 = ds.current) === null || _ds$current2 === void 0 ? void 0 : _ds$current2.get(_fieldName),
      businessObjectCode: businessObjectCode,
      drillMainKeyType: EDrillMainKeyType.ALL,
      readOnly: readOnly
    });
  };
  const editFn = () => {
    setEdit(true);
  };

  // 初始化,ds加载
  useEffect(() => {
    for (const key in record) {
      if (Object.prototype.hasOwnProperty.call(record, key) && ds.current) {
        ds.current.set(key, record[key]);
      }
    }
  }, [record]);

  // 如果此条记录被删除，则对应清空previousDS，setEditFn，activeCard
  useEffect(() => {
    return () => {
      previousDS.current = null;
      setEditFn.current = null;
      activeCard.current = null;
    };
  }, []);
  useEffect(() => {
    if (edit) {
      previousDS.current = ds;
      setEditFn.current = setEdit;
      activeCard.current = eleId;
    }
  }, [edit, ds]);
  const getDataVarSourceText = value => {
    if (value === 'FIXED_VALUE') {
      return intl.get('hmde.common.fixedValue').d('固定值');
    }
    if (value === 'BO_FIELD') {
      return intl.get('hmde.common.busObjField').d('业务对象字段');
    }
    if (value === 'IS_NULL') {
      return '空';
    }
    if (value === 'FLOW_VAR') {
      return intl.get('hmde.bo.flow.title.flowVar').d('流程变量');
    }
    return '';
  };
  const displayArea = () => {
    var _ds$current3, _ds$current4, _ds$current5, _ds$current6;
    return /*#__PURE__*/React.createElement("div", {
      className: showState ? styles['data-var-edit'] : '',
      onClick: () => editFn()
    }, /*#__PURE__*/React.createElement("div", {
      className: styles['first-line']
    }, /*#__PURE__*/React.createElement("span", {
      className: styles['first-line-span']
    }, ds !== null && ds !== void 0 && (_ds$current3 = ds.current) !== null && _ds$current3 !== void 0 && _ds$current3.get('workFlowVarName') ? ds === null || ds === void 0 ? void 0 : (_ds$current4 = ds.current) === null || _ds$current4 === void 0 ? void 0 : _ds$current4.get('workFlowVarName') : '参数KEY(FIELD.amount)')), /*#__PURE__*/React.createElement("div", {
      className: styles['second-line']
    }, /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.model.variableValueSource').d('变量值来源')), /*#__PURE__*/React.createElement("div", null, getDataVarSourceText(ds === null || ds === void 0 ? void 0 : (_ds$current5 = ds.current) === null || _ds$current5 === void 0 ? void 0 : _ds$current5.get('workFlowVarSource')))), /*#__PURE__*/React.createElement("div", {
      className: styles['third-line']
    }, /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.businessObject.variableValue').d('变量值')), /*#__PURE__*/React.createElement("div", null, workFlowVarSource === 'BO_FIELD' ? drillRenderer('workFlowVarValue', true) : ds === null || ds === void 0 ? void 0 : (_ds$current6 = ds.current) === null || _ds$current6 === void 0 ? void 0 : _ds$current6.get('workFlowVarValue'))));
  };
  const editArea = () => {
    return /*#__PURE__*/React.createElement("div", {
      className: showState ? styles['data-var-edit'] : ''
    }, /*#__PURE__*/React.createElement(_Form, {
      labelLayout: "placeholder"
      // useColon={false}
      ,
      dataSet: ds
    }, /*#__PURE__*/React.createElement(_Select, {
      name: "workFlowVarName",
      disabled: true
    }), /*#__PURE__*/React.createElement(_Select, {
      name: "workFlowVarSource"
    }, /*#__PURE__*/React.createElement(Option, {
      value: "FIXED_VALUE"
    }, intl.get('hmde.common.fixedValue').d('固定值')), /*#__PURE__*/React.createElement(Option, {
      value: "BO_FIELD"
    }, intl.get('hmde.common.busObjField').d('业务对象字段')), /*#__PURE__*/React.createElement(Option, {
      value: "FLOW_VAR"
    }, intl.get('hmde.bo.flow.title.flowVar').d('流程变量')), /*#__PURE__*/React.createElement(Option, {
      value: "IS_NULL"
    }, intl.get('hmde.bo.flow.title.empty').d('空'))), workFlowVarSource === 'FIXED_VALUE' && /*#__PURE__*/React.createElement(_TextField, {
      name: "workFlowVarValue"
    }), workFlowVarSource === 'BO_FIELD' && drillRenderer('workFlowVarValue'), workFlowVarSource === 'FLOW_VAR' && FlowVarSelect(), !workFlowVarSource && /*#__PURE__*/React.createElement(_TextField, {
      name: "workFlowVarValue"
    })));
  };
  return /*#__PURE__*/React.createElement("div", {
    id: eleId,
    className: styles['data-var-item'],
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave
    // onMouseOut={onMouseLeave}
    // onClick={globalClick}
  }, edit ? editArea() : displayArea());
};
export default WorkFlowVarItem;