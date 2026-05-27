import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _TreeSelect from "@hzero-front-ui/c7n-ui/lib/TreeSelectPro";
import _useModal from "choerodon-ui/pro/lib/use-modal";
import _isString from "lodash/isString";
import _isArray from "lodash/isArray";
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { FormLayout } from 'choerodon-ui/pro/lib/form/enum';
import { FieldType, DataSetSelection } from 'choerodon-ui/pro/lib/data-set/enum';
import { toJS } from 'mobx';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import DrillComponent, { EDrillMainKeyType } from 'hzero-front-apaas/lib/components/DrillComponent';
import Expression from "hzero-front-hmde/lib/routes/ProcessDefinition/Designer/Node/baseComponents/Expression";
import RangeSelect from "hzero-front-hmde/lib/routes/ProcessDefinition/Designer/Node/baseComponents/RangeSelect";
// import { StoreProvider } from '@hmde/routes/ProcessDefinition/Designer/store';
import { filterOperatorTypeMap, getConstantRenderMap } from "hzero-front-hmde/lib/routes/ProcessDefinition/Designer/Node/utils/field";
import { drill } from "hzero-front-hmde/lib/services/businessObjectService";
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import { INPUT_ROOT_KEY } from "hzero-front-hmde/lib/routes/ProcessDefinition/Designer/NewFlowContext/type";
import styles from "../index.less?modules";
import { FILTER_CONDITION_FN } from "../store";
import { componentTypeMap, handleOptionsFilter } from "../utils";
const _ref = window.dvaApp._store.getState().global || {},
  language = _ref.language;
const Item = ({
  readonly,
  record,
  index,
  deleteItem,
  fieldData = [],
  filterDs,
  systemVariable = [],
  boCode
}) => {
  const Modal = _useModal();
  const treeFieldData = useMemo(() => {
    const parentItemList = fieldData.filter(v => v.parentId === INPUT_ROOT_KEY);
    fieldData.forEach(v => {
      parentItemList.forEach(item => {
        if (item.id === v.parentId) {
          if (!item.children) {
            item.children = [];
          }
          item.children.push(v);
        }
      });
    });
    return parentItemList || [];
  }, [fieldData]);
  useEffect(() => {
    if (!(record !== null && record !== void 0 && record.get(FILTER_CONDITION_FN.COMPONENT_TYPE))) {
      record === null || record === void 0 ? void 0 : record.set(FILTER_CONDITION_FN.COMPONENT_TYPE, (record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.LEFT_EXPRESS_TYPE)) || '');
    }
    if (record !== null && record !== void 0 && record.get(FILTER_CONDITION_FN.VARIABLE_VALUE)) {
      setFelation(true);
      boCode && setRelationObCode(boCode);
    }
  }, []);
  const rangeRef = useRef();
  const valueNull = useMemo(() => {
    return !['IS_NULL', 'IS_NOT_NULL'].includes(record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.OPERATOR_TYPE));
  }, [record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.OPERATOR_TYPE)]);
  const tree = useMemo(() => treeFieldData.map(v => /*#__PURE__*/React.createElement(_TreeSelect.TreeNode, {
    title: v.businessObjectName,
    value: v.businessObjectCode,
    disabled: true,
    key: v.businessObjectCode
  }, (v.children || []).map(item => /*#__PURE__*/React.createElement(_TreeSelect.TreeNode, {
    key: item.showId,
    value: `${v.businessObjectCode}.${item.businessObjectFieldCode}`,
    title: item.businessObjectFieldName
  })))), [treeFieldData]);

  // 变量/值 输入框渲染
  const renderVariable = type => {
    var _record$getField;
    // 变量类型/取值类型
    const switchKey = !type ? record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.VARIABLE_TYPE) : record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.VALUE_TYPE);
    // 变量/值
    const nameKey = !type ? FILTER_CONDITION_FN.VARIABLE : FILTER_CONDITION_FN.VALUE;
    // 是否展示 右侧钻取组件
    const rFlag = !type ? relationFlag : relationFlagRight;
    // 钻取主键 需要传入的 业务对象code
    const rCode = !type ? relationObCode : relationObCodeRight;
    // 钻取主键 key 的 name
    const dirllName = !type ? FILTER_CONDITION_FN.VARIABLE_VALUE : FILTER_CONDITION_FN.RIGHT_VALUE;
    // 表达式 key 的 name
    const expressName = !type ? FILTER_CONDITION_FN.LEFT_EXPRESS_NAME : FILTER_CONDITION_FN.RIGHT_EXPRESS_NAME;
    record === null || record === void 0 ? void 0 : (_record$getField = record.getField(FILTER_CONDITION_FN.VALUE)) === null || _record$getField === void 0 ? void 0 : _record$getField.set('range', false);
    switch (switchKey) {
      case 'INPUT_PARAM':
        // 右侧介于需要特殊处理
        if ((record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.OPERATOR_TYPE)) === 'RANGE' && type) {
          const initV = record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.VALUE);
          const initRangeValue = {};
          try {
            initRangeValue.startValue = initV.split(',')[0];
            initRangeValue.endValue = initV.split(',')[1];
          } catch (error) {
            console.log(error);
          }
          return /*#__PURE__*/React.createElement(RangeSelect, {
            style: {
              width: '100%',
              background: '#fff'
            },
            rangeRef: rangeRef,
            curName: "rightValue",
            valueType: 'INPUT_PARAM',
            curRecord: record,
            initRangeValue: initRangeValue
          });
        }
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_TreeSelect, {
          name: nameKey,
          style: {
            marginRight: '10px',
            width: rFlag ? '47%' : '100%'
          }
        }, tree), rFlag &&
        /*#__PURE__*/
        // 钻取组件
        React.createElement("div", {
          style: {
            width: '47%',
            display: 'inline-block'
          }
        }, /*#__PURE__*/React.createElement(DrillComponent, {
          onOk: params => {
            const _ref2 = params || {},
              value = _ref2.value;
            record === null || record === void 0 ? void 0 : record.set(dirllName, value);
            // 设置 componentType
            if (!type) {
              var _params$result, _params$result2;
              record === null || record === void 0 ? void 0 : record.set(FILTER_CONDITION_FN.COMPONENT_TYPE, params === null || params === void 0 ? void 0 : (_params$result = params.result) === null || _params$result === void 0 ? void 0 : _params$result.componentType);
              record === null || record === void 0 ? void 0 : record.set(FILTER_CONDITION_FN.OPERATOR_TYPE, '');
              record === null || record === void 0 ? void 0 : record.set('attributeJson', (params === null || params === void 0 ? void 0 : (_params$result2 = params.result) === null || _params$result2 === void 0 ? void 0 : _params$result2.attributeJson) || {});
            }
          },
          onClear: () => {
            record === null || record === void 0 ? void 0 : record.set(dirllName, '');
            if (!type) {
              record === null || record === void 0 ? void 0 : record.set(FILTER_CONDITION_FN.COMPONENT_TYPE, 'LINK_RELATION');
              record === null || record === void 0 ? void 0 : record.set('attributeJson', {});
            }
          },
          name: dirllName,
          initValue: record === null || record === void 0 ? void 0 : record.get(dirllName),
          businessObjectCode: rCode,
          drillMainKeyType: EDrillMainKeyType.ALL
        })));
      case 'EXPRESSION':
        return /*#__PURE__*/React.createElement(_TextField, {
          name: expressName,
          readOnly: true,
          style: {
            marginRight: '10px',
            width: '100%'
          },
          suffix: /*#__PURE__*/React.createElement(ImgIcon, {
            name: "goujian.svg",
            size: 16,
            style: {
              marginLeft: '4px'
            },
            onClick: () => buildExpression(expressName, nameKey, type)
          }),
          renderer: ({
            text
          }) => {
            return /*#__PURE__*/React.createElement("div", {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }
            }, /*#__PURE__*/React.createElement("div", {
              style: {
                width: '70%',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }
            }, text), (record === null || record === void 0 ? void 0 : record.get('componentType')) && !type && /*#__PURE__*/React.createElement("div", {
              style: {
                height: '20px',
                color: '#11D954',
                backgroundColor: ' #E6FFEA',
                width: '60px',
                lineHeight: '20px',
                marginLeft: '4px',
                textAlign: 'center'
              }
            }, componentTypeMap.get(record === null || record === void 0 ? void 0 : record.get('componentType'))));
          }
        });
      case 'SYSTEM_VARIABLE':
        // 右侧介于 特殊处理
        if ((record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.OPERATOR_TYPE)) === 'RANGE' && type) {
          const initV = record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.VALUE);
          const initRangeValue = {};
          try {
            initRangeValue.startValue = initV.split(',')[0];
            initRangeValue.endValue = initV.split(',')[1];
          } catch (error) {
            console.log(error);
          }
          return /*#__PURE__*/React.createElement(RangeSelect, {
            style: {
              width: '100%',
              background: '#fff'
            },
            rangeRef: rangeRef,
            curName: "rightValue",
            valueType: 'SYSTEM_VARIABLE',
            systemVariable: systemVariable,
            curRecord: record,
            initRangeValue: initRangeValue
          });
        }
        return /*#__PURE__*/React.createElement(_Select, {
          name: nameKey,
          style: {
            marginRight: '10px',
            width: '100%'
          }
        }, systemVariable === null || systemVariable === void 0 ? void 0 : systemVariable.map(item => /*#__PURE__*/React.createElement(_Select.Option, {
          value: item === null || item === void 0 ? void 0 : item.value
        }, item === null || item === void 0 ? void 0 : item.meaning)));
      case 'CONSTANT':
        return renderRightValue();
      default:
        return /*#__PURE__*/React.createElement(_TextField, {
          name: nameKey,
          style: {
            marginRight: '10px',
            width: '100%'
          }
        });
    }
  };

  // 表达式弹窗
  const expressionRef = useRef();
  const buildExpression = (expressName, nameKey, type) => {
    let rangeValue = {};
    if ((record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.OPERATOR_TYPE)) === 'RANGE') {
      var _record$get, _valueArr$, _valueArr$$replaceAll, _valueArr$2, _valueArr$2$replaceAl;
      const valueArr = (record === null || record === void 0 ? void 0 : (_record$get = record.get(nameKey)) === null || _record$get === void 0 ? void 0 : _record$get.split(',')) || [];
      rangeValue = {
        startValue: ((_valueArr$ = valueArr[0]) === null || _valueArr$ === void 0 ? void 0 : (_valueArr$$replaceAll = _valueArr$.replaceAll) === null || _valueArr$$replaceAll === void 0 ? void 0 : _valueArr$$replaceAll.call(_valueArr$, '&sbquo;', ',')) || '',
        endValue: ((_valueArr$2 = valueArr[1]) === null || _valueArr$2 === void 0 ? void 0 : (_valueArr$2$replaceAl = _valueArr$2.replaceAll) === null || _valueArr$2$replaceAl === void 0 ? void 0 : _valueArr$2$replaceAl.call(_valueArr$2, '&sbquo;', ',')) || ''
      };
    }
    Modal.open({
      title: intl.get('hmde.pd.processDefinition.expressMaintenance').d('表达式维护'),
      mask: true,
      style: {
        width: 957
      },
      // key: Modal.key(),
      children:
      /*#__PURE__*/
      // <StoreProvider>
      React.createElement(Expression, {
        expressionRef: expressionRef,
        name: record === null || record === void 0 ? void 0 : record.get(expressName),
        componentType: record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.LEFT_EXPRESS_TYPE),
        rangeValue: rangeValue,
        content: record === null || record === void 0 ? void 0 : record.get(nameKey),
        typeFlag: !type,
        rangeFlag: (record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.OPERATOR_TYPE)) === 'RANGE',
        versionDisabled: false,
        viewType: "detail",
        triggerEnter: true,
        treeFieldData: fieldData,
        systemVariable: systemVariable,
        includeTabKey: ['INPUT', 'SYSTEM']
      })
      // </StoreProvider>
      ,
      drawer: false,
      onOk: async () => {
        var _expressionRef$curren, _expressionRef$curren2;
        const validate = await ((_expressionRef$curren = expressionRef.current) === null || _expressionRef$curren === void 0 ? void 0 : (_expressionRef$curren2 = _expressionRef$curren.expressionCodeArea) === null || _expressionRef$curren2 === void 0 ? void 0 : _expressionRef$curren2.validate());
        if (validate) {
          var _expressionRef$curren4, _expressionRef$curren5, _expressionRef$curren6;
          const _expressionRef$curren3 = (_expressionRef$curren4 = expressionRef.current) === null || _expressionRef$curren4 === void 0 ? void 0 : (_expressionRef$curren5 = _expressionRef$curren4.expressionCodeArea) === null || _expressionRef$curren5 === void 0 ? void 0 : (_expressionRef$curren6 = _expressionRef$curren5.current) === null || _expressionRef$curren6 === void 0 ? void 0 : _expressionRef$curren6.toData(),
            content = _expressionRef$curren3.content,
            expressionName = _expressionRef$curren3.expressionName,
            componentType = _expressionRef$curren3.componentType,
            startValue = _expressionRef$curren3.startValue,
            endValue = _expressionRef$curren3.endValue;
          record === null || record === void 0 ? void 0 : record.set(expressName, expressionName);
          if (!type) {
            record === null || record === void 0 ? void 0 : record.set(FILTER_CONDITION_FN.COMPONENT_TYPE, componentType);
            record === null || record === void 0 ? void 0 : record.set(FILTER_CONDITION_FN.LEFT_EXPRESS_TYPE, componentType);
          }

          // 处理介于的情况
          if ((record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.OPERATOR_TYPE)) === 'RANGE') {
            record === null || record === void 0 ? void 0 : record.set(nameKey, `${startValue.replaceAll(',', '&sbquo;')},${endValue.replaceAll(',', '&sbquo;')}`);
          } else {
            record === null || record === void 0 ? void 0 : record.set(nameKey, content);
          }
          return true;
        } else {
          return false;
        }
      }
    });
  };

  // 设置赚取的业务对象code
  const setDrillBoCode = (parentField, field, type) => {
    drill({
      query: {
        businessObjectCode: parentField.realObjectCode || parentField.showId,
        drillMainKeyFlag: false
      }
    }).then(res => {
      var _res$businessObjectFi, _res$businessObjectFi2;
      const businessObjectField = res === null || res === void 0 ? void 0 : (_res$businessObjectFi = res.businessObjectFields) === null || _res$businessObjectFi === void 0 ? void 0 : (_res$businessObjectFi2 = _res$businessObjectFi.find) === null || _res$businessObjectFi2 === void 0 ? void 0 : _res$businessObjectFi2.call(_res$businessObjectFi, item => (item === null || item === void 0 ? void 0 : item.businessObjectFieldCode) === (field === null || field === void 0 ? void 0 : field.businessObjectFieldCode));
      if (businessObjectField !== null && businessObjectField !== void 0 && businessObjectField.masterBusinessObjectCode) {
        if (type === 'left') {
          setRelationObCode(businessObjectField === null || businessObjectField === void 0 ? void 0 : businessObjectField.masterBusinessObjectCode);
          setFelation(true);
        } else {
          setRelationObCodeRight(businessObjectField === null || businessObjectField === void 0 ? void 0 : businessObjectField.masterBusinessObjectCode);
          setFelationRight(true);
        }
      }
    });
  };
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    relationFlag = _useState2[0],
    setFelation = _useState2[1];
  const _useState3 = useState(''),
    _useState4 = _slicedToArray(_useState3, 2),
    relationObCode = _useState4[0],
    setRelationObCode = _useState4[1];
  const _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    relationFlagRight = _useState6[0],
    setFelationRight = _useState6[1];
  const _useState7 = useState(''),
    _useState8 = _slicedToArray(_useState7, 2),
    relationObCodeRight = _useState8[0],
    setRelationObCodeRight = _useState8[1];
  useDataSetEvents(filterDs, 'update', ({
    name,
    value,
    record: curRecord
  }) => {
    if (record.id !== curRecord.id) return;
    // 变量类型
    if (name === FILTER_CONDITION_FN.VARIABLE_TYPE) {
      curRecord === null || curRecord === void 0 ? void 0 : curRecord.set(FILTER_CONDITION_FN.VARIABLE, '');
      curRecord === null || curRecord === void 0 ? void 0 : curRecord.set(FILTER_CONDITION_FN.VARIABLE_VALUE, '');
      curRecord === null || curRecord === void 0 ? void 0 : curRecord.set(FILTER_CONDITION_FN.COMPONENT_TYPE, '');
      curRecord === null || curRecord === void 0 ? void 0 : curRecord.set(FILTER_CONDITION_FN.LEFT_EXPRESS_TYPE, '');
      curRecord === null || curRecord === void 0 ? void 0 : curRecord.set(FILTER_CONDITION_FN.LEFT_EXPRESS_NAME, '');

      // 系统变量 组件类型赋值为 文本类型
      if (value === 'SYSTEM_VARIABLE') {
        curRecord === null || curRecord === void 0 ? void 0 : curRecord.set(FILTER_CONDITION_FN.COMPONENT_TYPE, 'TEXT_FIELD');
      }
    }

    // 变量
    if (name === FILTER_CONDITION_FN.VARIABLE) {
      setFelation(false);
      curRecord === null || curRecord === void 0 ? void 0 : curRecord.set(FILTER_CONDITION_FN.VARIABLE_VALUE, '');
      setRelationObCode('');
      if ((curRecord === null || curRecord === void 0 ? void 0 : curRecord.get(FILTER_CONDITION_FN.VARIABLE_TYPE)) === 'INPUT_PARAM') {
        // 判断入参 是否是 主键/关系字段
        const field = fieldData.find(v => {
          var _value$split;
          return v.businessObjectFieldCode === (value === null || value === void 0 ? void 0 : (_value$split = value.split('.')) === null || _value$split === void 0 ? void 0 : _value$split[1]);
        });
        const parentField = fieldData.find(v => v.id === (field === null || field === void 0 ? void 0 : field.parentId));
        if (['LINK_RELATION', 'MASTER_RELATION'].includes(field === null || field === void 0 ? void 0 : field.componentType)) {
          setDrillBoCode(parentField, field, 'left');
        }
        curRecord === null || curRecord === void 0 ? void 0 : curRecord.set(FILTER_CONDITION_FN.COMPONENT_TYPE, (field === null || field === void 0 ? void 0 : field.componentType) || 'TEXT_FIELD');
        curRecord === null || curRecord === void 0 ? void 0 : curRecord.set('attributeJson', (field === null || field === void 0 ? void 0 : field.attributeJson) || {});
        curRecord === null || curRecord === void 0 ? void 0 : curRecord.set('lovCode', (field === null || field === void 0 ? void 0 : field.lovCode) || undefined);
      }
    }

    // 变量-值
    if (name === FILTER_CONDITION_FN.VARIABLE_VALUE) {
      curRecord === null || curRecord === void 0 ? void 0 : curRecord.set(FILTER_CONDITION_FN.VALUE_TYPE, '');
    }

    // 字段类型
    if (name === FILTER_CONDITION_FN.COMPONENT_TYPE) {
      curRecord === null || curRecord === void 0 ? void 0 : curRecord.set(FILTER_CONDITION_FN.OPERATOR_TYPE, '');
    }

    // 取值类型
    if (name === FILTER_CONDITION_FN.VALUE_TYPE) {
      var _rangeRef$current, _rangeRef$current$ran;
      curRecord === null || curRecord === void 0 ? void 0 : curRecord.set(FILTER_CONDITION_FN.VALUE, '');
      curRecord === null || curRecord === void 0 ? void 0 : curRecord.set(FILTER_CONDITION_FN.RIGHT_VALUE, '');
      curRecord === null || curRecord === void 0 ? void 0 : curRecord.set(FILTER_CONDITION_FN.RIGHT_EXPRESS_NAME, '');
      rangeRef === null || rangeRef === void 0 ? void 0 : (_rangeRef$current = rangeRef.current) === null || _rangeRef$current === void 0 ? void 0 : (_rangeRef$current$ran = _rangeRef$current.rangeDataSet) === null || _rangeRef$current$ran === void 0 ? void 0 : _rangeRef$current$ran.removeAll();
    }
    // 值
    if (name === FILTER_CONDITION_FN.VALUE) {
      setFelationRight(false);
      setRelationObCodeRight('');
      if ((curRecord === null || curRecord === void 0 ? void 0 : curRecord.get(FILTER_CONDITION_FN.VALUE_TYPE)) === 'INPUT_PARAM') {
        // 判断入参 是否是 主键/关系字段
        const field = fieldData.find(v => v.showId === value);
        const parentField = fieldData.find(v => v.id === (field === null || field === void 0 ? void 0 : field.parentId));
        if (['LINK_RELATION', 'MASTER_RELATION'].includes(field === null || field === void 0 ? void 0 : field.componentType)) {
          setDrillBoCode(parentField, field, 'right');
        }
      }
    }

    // 逻辑符
    if (name === FILTER_CONDITION_FN.OPERATOR_TYPE) {
      curRecord === null || curRecord === void 0 ? void 0 : curRecord.set(FILTER_CONDITION_FN.VALUE, '');
      curRecord === null || curRecord === void 0 ? void 0 : curRecord.set(FILTER_CONDITION_FN.RIGHT_VALUE, '');
    }
  });
  useEffect(() => {
    if ((record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.VARIABLE_TYPE)) === 'INPUT_PARAM') {
      const field = fieldData.find(v => v.showId === (record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.VARIABLE)));
      const parentField = fieldData.find(v => v.id === (field === null || field === void 0 ? void 0 : field.parentId));
      if (['LINK_RELATION', 'MASTER_RELATION'].includes(field === null || field === void 0 ? void 0 : field.componentType)) {
        setDrillBoCode(parentField, field, 'left');
      }
    }
    if ((record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.VALUE_TYPE)) === 'INPUT_PARAM') {
      const field = fieldData.find(v => v.showId === (record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.VALUE)));
      const parentField = fieldData.find(v => v.id === (field === null || field === void 0 ? void 0 : field.parentId));
      if (['LINK_RELATION', 'MASTER_RELATION'].includes(field === null || field === void 0 ? void 0 : field.componentType)) {
        setDrillBoCode(parentField, field, 'right');
      }
    }
  }, [fieldData]);

  // 固定值渲染
  const renderRightValue = () => {
    var _componentElement, _componentElement2, _record$getField2;
    let componentElement = getConstantRenderMap(record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.COMPONENT_TYPE), record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.OPERATOR_TYPE)); // 组件 reactElement 格式数据

    // 暂时做一下兜底操作
    if ((record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.COMPONENT_TYPE)) === 'REFERENCE_FIELD') {
      componentElement = /*#__PURE__*/React.createElement(_TextField, null);
    }
    if (!componentElement) {
      return null;
    }
    const componentName = (_componentElement = componentElement) === null || _componentElement === void 0 ? void 0 : _componentElement.type.displayName; // 组件名
    const componentProps = (_componentElement2 = componentElement) === null || _componentElement2 === void 0 ? void 0 : _componentElement2.props; // 组件 props
    record === null || record === void 0 ? void 0 : (_record$getField2 = record.getField(FILTER_CONDITION_FN.VALUE)) === null || _record$getField2 === void 0 ? void 0 : _record$getField2.set('range', !!componentProps.range);
    const cloneComponent = _props => /*#__PURE__*/React.cloneElement(componentElement, {
      name: FILTER_CONDITION_FN.VALUE,
      ..._props,
      style: {
        width: '100%'
      }
    });

    // 兼容数组数据
    if (componentProps.range || componentProps.multiple) {
      const _value = record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.VALUE);
      if (_isString(_value)) {
        record.set(FILTER_CONDITION_FN.VALUE, _value.split(','));
      }
    }
    let _dataSet = null;
    const attributeJson = toJS(record === null || record === void 0 ? void 0 : record.get('attributeJson'));
    const lovCode = record === null || record === void 0 ? void 0 : record.get('lovCode');
    const _dataSetProps = {
      fields: [{
        name: FILTER_CONDITION_FN.VALUE,
        type: "string",
        textField: 'meaning',
        valueField: 'value'
      }],
      data: [{
        [FILTER_CONDITION_FN.VALUE]: record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.VALUE)
      }],
      events: {
        update: ({
          value
        }) => {
          record.set(FILTER_CONDITION_FN.VALUE, value);
        }
      }
    };
    if (_isArray(attributeJson === null || attributeJson === void 0 ? void 0 : attributeJson.customOptionList)) {
      var _attributeJson$custom;
      const data = attributeJson === null || attributeJson === void 0 ? void 0 : (_attributeJson$custom = attributeJson.customOptionList) === null || _attributeJson$custom === void 0 ? void 0 : _attributeJson$custom.map(item => {
        var _item$meaning;
        return {
          ...item,
          meaning: item === null || item === void 0 ? void 0 : (_item$meaning = item.meaning) === null || _item$meaning === void 0 ? void 0 : _item$meaning[language]
        };
      });
      _dataSetProps.fields[0].options = new _DataSet({
        selection: componentProps !== null && componentProps !== void 0 && componentProps.multiple ? "multiple" : "single",
        data: data || []
      });
      _dataSet = new _DataSet(_dataSetProps);
    } else if (lovCode) {
      _dataSetProps.fields[0].lookupCode = lovCode;
      _dataSet = new _DataSet(_dataSetProps);
    }
    switch (componentName) {
      case 'DatePicker':
        if (componentProps.range || componentProps.multiple) {
          return cloneComponent({
            format: 'YYYY-MM-DD'
          });
        } else {
          return cloneComponent({
            format: 'YYYY-MM-DD'
          });
        }
      case 'DateTimePicker':
        if (componentProps.range || componentProps.multiple) {
          return cloneComponent({
            format: 'YYYY-MM-DD HH:mm:ss'
          });
        } else {
          return cloneComponent({
            format: 'YYYY-MM-DD HH:mm:ss'
          });
        }
      case 'TextField':
        if (componentProps.multiple) {
          return cloneComponent({});
        } else {
          return cloneComponent({});
        }
      case 'Select':
        return cloneComponent({
          dataSet: _dataSet
        });
      default:
        return cloneComponent({});
    }
  };
  return /*#__PURE__*/React.createElement(_Form, {
    record: record,
    key: index,
    className: styles['option-condition'],
    layout: "none",
    disabled: readonly
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['option-item']
  }, index + 1), /*#__PURE__*/React.createElement("div", {
    className: styles['option-item']
  }, /*#__PURE__*/React.createElement(_Select, {
    name: FILTER_CONDITION_FN.VARIABLE_TYPE,
    optionsFilter: option => handleOptionsFilter(option, 'left'),
    style: {
      width: '100%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: styles['option-item']
  }, renderVariable()), /*#__PURE__*/React.createElement("div", {
    className: styles['option-item']
  }, /*#__PURE__*/React.createElement(_Select, {
    name: FILTER_CONDITION_FN.OPERATOR_TYPE,
    style: {
      width: '100%'
    },
    optionsFilter: obj => {
      const item = (obj === null || obj === void 0 ? void 0 : obj.get('value')) || '';
      return filterOperatorTypeMap((record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.COMPONENT_TYPE)) || (record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.LEFT_EXPRESS_TYPE)) || 'TEXT_FIELD', item);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: styles['option-item']
  }, valueNull && /*#__PURE__*/React.createElement(_Select, {
    name: FILTER_CONDITION_FN.VALUE_TYPE,
    optionsFilter: option => handleOptionsFilter(option),
    style: {
      width: '100%'
    },
    onOption: ({
      record: recordM
    }) => {
      if ((recordM === null || recordM === void 0 ? void 0 : recordM.get('value')) === 'CONSTANT' && ((record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.COMPONENT_TYPE)) === 'LINK_RELATION' || (record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.COMPONENT_TYPE)) === 'MASTER_RELATION' || (record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.COMPONENT_TYPE)) === 'PRIMARY_KEY' || (record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.VARIABLE_TYPE)) === 'SYSTEM_VARIABLE')) {
        return {
          disabled: true
        };
      }
      return {
        disabled: false
      };
    },
    optionRenderer: ({
      value,
      text
    }) => {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          width: '100%',
          display: 'flex',
          alignItems: 'center'
        }
      }, /*#__PURE__*/React.createElement("span", null, text), value === 'CONSTANT' && ((record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.COMPONENT_TYPE)) === 'LINK_RELATION' || (record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.COMPONENT_TYPE)) === 'MASTER_RELATION' || (record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.COMPONENT_TYPE)) === 'PRIMARY_KEY') && /*#__PURE__*/React.createElement(_Tooltip, {
        placement: "top",
        title: intl.get('hmde.bo.businessObject.tooltip1').d('主键和关系类字段无法直接使用固定值进行取值，建议先使用查询记录类节点查出相关记录，再在此处通过配置表达式等方式获取相关记录的主键进行过滤')
      }, /*#__PURE__*/React.createElement(_Icon, {
        type: "help_outline",
        style: {
          fontSize: 14,
          marginLeft: '5px',
          paddingTop: '2px'
        }
      })));
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: styles['option-item']
  }, valueNull && renderVariable('right')), !readonly && /*#__PURE__*/React.createElement("div", {
    className: styles['option-item']
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "delete-B16@1x.svg",
    className: styles['delete-button'],
    size: 16,
    onClick: () => {
      deleteItem(record);
    }
  })));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Item));