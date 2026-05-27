import _ConfigProvider from "choerodon-ui/lib/config-provider";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _TreeSelect from "@hzero-front-ui/c7n-ui/lib/TreeSelectPro";
import _trim from "lodash/trim";
import _nth from "lodash/nth";
import _get from "lodash/get";
import _isArray from "lodash/isArray";
import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { nanoid } from 'nanoid';
import { observer } from 'mobx-react-lite';
import { LabelAlign } from 'choerodon-ui/pro/lib/form/enum';
import { ShowHelp } from 'choerodon-ui/pro/lib/field/enum';
import intl from 'utils/intl';
import { TagRender } from 'utils/renderer';
import { getResponse } from 'utils/utils';
import { FuncType, ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import DrillComponent from 'hzero-front-apaas/lib/components/DrillComponent';
import { FieldComponentType } from "hzero-front-apaas/lib/constants/businessObject";
import EditorError from "hzero-front-hmde/lib/businessComponents/EditorError";
import { getDrillFIeldType } from "hzero-front-hmde/lib/utils/common";
import { getPolymerizationCondition, formulaExpressionCompile } from "hzero-front-hmde/lib/services/businessObjectService";
import NewFilterCondition from "hzero-front-hmde/lib/businessComponents/NewFilterCondition";
import { arithmetic } from "../../../../constants/constants";
import { codeTransfer } from "../../utils";
import FormulaEditor from "../FormulaEditor";
import RequiredLabel from "../RequiredLabel";
import PolymerizationRuleDS, { FieldNameTypes } from "./stores/PolymerizationRuleDS";
import { POLYMERIZATION_STANDARD_HELP, POLYMERIZATION_EXPRESSION_HELP } from "./constants";
import styles from "./index.less?modules";
const TreeNode = _TreeSelect.TreeNode;
const idField = 'businessObjectFieldId';
const titleField = 'businessObjectFieldName';
const childrenField = 'businessObjectFields';
const middleNode = '_middleNode_';
/**
 * 获取钻取组件对象的 path
 * 输入：CASCADE(fff_facai.createdBy,SYS_USER.loginName)
 * 输出：fff_facai.createdBy,SYS_USER.loginName
 */
const getDrillObjPath = str => {
  // 这里有正则的分组捕获，如果改了正则，记得改对应的序号
  const temp = _nth(`${str}`.replace(/\s+/g, '').match(/CASCADE\((.*?)\)/), 1) || '';
  return temp.split(',');
};
const PolymerizationFormula = props => {
  var _formDs$current4;
  const businessObjectId = props.businessObjectId,
    formula = props.formula,
    curFieldId = props.curFieldId,
    businessObjectCode = props.businessObjectCode,
    businessObjectName = props.businessObjectName,
    onOk = props.onOk,
    modal = props.modal;
  const _useState = useState(`formula-lang-${nanoid(4)}`),
    _useState2 = _slicedToArray(_useState, 1),
    editorLanguage = _useState2[0];
  const _useState3 = useState({}),
    _useState4 = _slicedToArray(_useState3, 2),
    conditionFieldList = _useState4[0],
    setConditionFieldList = _useState4[1];
  // 聚合表达式校验错误信息
  const _useState5 = useState([]),
    _useState6 = _slicedToArray(_useState5, 2),
    expressionErrorList = _useState6[0],
    setExpressionErrorList = _useState6[1];
  const formulaEditorRef = useRef(null);
  const _useState7 = useState([]),
    _useState8 = _slicedToArray(_useState7, 2),
    mappingList = _useState8[0],
    setMappingList = _useState8[1];
  const mappingListRef = useRef(mappingList);
  const filterCacheRef = useRef(null);
  const formDs = useMemo(() => new _DataSet(PolymerizationRuleDS(filterCacheRef)), [formula]);
  const blocks = useMemo(() => mappingList.map(({
    meaning
  }) => meaning), [mappingList]);

  // 表单数据
  useEffect(() => {
    formDs.create({
      [FieldNameTypes.FORMULA_NAME]: formula,
      [FieldNameTypes.CONDITION_RELATIONSHIP]: ''
    });
  }, [formDs, formula]);

  // 点击确认时执行动作
  useEffect(() => {
    modal.handleOk(async () => {
      var _formDs$current, _filterCacheRef$curre;
      const res1 = await ((_formDs$current = formDs.current) === null || _formDs$current === void 0 ? void 0 : _formDs$current.validate());
      const res2 = await (filterCacheRef === null || filterCacheRef === void 0 ? void 0 : (_filterCacheRef$curre = filterCacheRef.current) === null || _filterCacheRef$curre === void 0 ? void 0 : _filterCacheRef$curre.ds.validate());
      const res3 = await validateExpression();
      if (!(res1 && res2 && res3)) {
        return false;
      }
      const formValue = formDs.current.toData();
      let polymerizationStandardCode = formValue.polymerizationStandardCode,
        polymerizationStandard = formValue.polymerizationStandard; // 聚合基准字段
      if (!polymerizationStandard) {
        polymerizationStandard = `CASCADE(${businessObjectName})`;
      }
      if (!polymerizationStandardCode) {
        polymerizationStandardCode = `CASCADE(${businessObjectCode})`;
      }
      const polymerizationExpressionCode = formValue.polymerizationExpressionCode,
        polymerizationExpression = formValue.polymerizationExpression; // 据和表达式
      const _handleConditionRes = handleConditionRes(),
        conditionValue = _handleConditionRes.value,
        conditionText = _handleConditionRes.text; // 聚合条件

      const expressionCode = _trim(polymerizationExpressionCode) ? `, ${_trim(polymerizationExpressionCode)}` : '';
      const expressionText = _trim(polymerizationExpression) ? `, ${_trim(polymerizationExpression)}` : '';
      // 聚合条件、聚合基准、聚合公式
      const _value = `${formula}(${conditionValue}${polymerizationStandardCode}${expressionCode})`;
      const _text = `${formula}(${conditionText}${polymerizationStandard}${expressionText})`;
      onOk({
        value: _value,
        text: _text,
        mappingList
      });
    });
  });

  // 查询字段选择树
  useEffect(() => {
    var _formDs$current2;
    if ((_formDs$current2 = formDs.current) !== null && _formDs$current2 !== void 0 && _formDs$current2.get(FieldNameTypes.POLYMERIZATION_STANDARD_CODE) || businessObjectCode) {
      var _formDs$current3;
      let codeValue = (_formDs$current3 = formDs.current) === null || _formDs$current3 === void 0 ? void 0 : _formDs$current3.get(FieldNameTypes.POLYMERIZATION_STANDARD_CODE);
      if (!codeValue || codeValue === 'CASCADE()') {
        codeValue = `CASCADE(${businessObjectCode})`;
      }
      setTimeout(() => {
        getPolymerizationCondition({
          referenceFormula: codeValue
        }).then(res => {
          var _res$businessObjectFi, _res$businessObjectFi2;
          if (res !== null && res !== void 0 && res.failed) return;
          // 兼容主键不加密 引起的问题
          res === null || res === void 0 ? void 0 : (_res$businessObjectFi = res.businessObjectFields) === null || _res$businessObjectFi === void 0 ? void 0 : (_res$businessObjectFi2 = _res$businessObjectFi.forEach) === null || _res$businessObjectFi2 === void 0 ? void 0 : _res$businessObjectFi2.call(_res$businessObjectFi, v => {
            var _v$businessObjectFiel, _v$businessObjectFiel2;
            v.businessObjectFieldId = (_v$businessObjectFiel = v.businessObjectFieldId) === null || _v$businessObjectFiel === void 0 ? void 0 : (_v$businessObjectFiel2 = _v$businessObjectFiel.toString) === null || _v$businessObjectFiel2 === void 0 ? void 0 : _v$businessObjectFiel2.call(_v$businessObjectFiel);
          });
          setConditionFieldList(res);
        });
      });
    }
  }, [(_formDs$current4 = formDs.current) === null || _formDs$current4 === void 0 ? void 0 : _formDs$current4.get(FieldNameTypes.POLYMERIZATION_STANDARD_CODE)]);

  // 校验聚合表达式
  const validateExpression = useCallback(async () => {
    if (formula === 'COL_COUNT') {
      return true;
    }
    if (!formulaEditorRef.current.checkMakers()) {
      setExpressionErrorList([{
        message: intl.get('hmde.bo.businessObject.expressionNone').d('表达式不能为空')
      }]);
      return false;
    }
    const expressionCode = formDs.current.get(FieldNameTypes.POLYMERIZATION_EXPRESSION_CODE);
    const res = await formulaExpressionCompile({
      businessObjectId,
      componentType: 'FORMULA',
      formula: expressionCode
    });
    if (!getResponse(res)) {
      return false;
    }
    const message = res.message;
    res !== null && res !== void 0 && res.effective ? setExpressionErrorList([]) : setExpressionErrorList([{
      message
    }]);
    return res === null || res === void 0 ? void 0 : res.effective;
  }, [businessObjectId, formDs]);

  // 聚合表达式可选字段筛选
  const expressionFieldOptionsFilter = useCallback(fieldData => {
    let options;
    switch (formula) {
      case 'COL_SUM':
      case 'COL_DISTINCTSUM':
      case 'COL_AVG':
      case 'COL_DISTINCTAVG':
        options = [FieldComponentType.NUMBER_FIELD, FieldComponentType.FLOAT, FieldComponentType.MONEY, FieldComponentType.PERCENTAGE];
        break;
      case 'COL_MAX':
      case 'COL_MIN':
        options = [FieldComponentType.NUMBER_FIELD, FieldComponentType.FLOAT, FieldComponentType.MONEY, FieldComponentType.PERCENTAGE, FieldComponentType.DATE_SELECTION_BOX, FieldComponentType.DATETIME_SELECTION_BOX];
        break;
      case 'COL_COUNT':
        options = [];
        break;
      case 'COL_DISTINCTCOUNT':
        options = getDrillFIeldType(['MASTER_RELATION', 'LINK_RELATION', 'MULTIPLE_RELATION', 'FORMULA']);
        break;
      default:
        options = [];
        break;
    }
    return options.includes(fieldData === null || fieldData === void 0 ? void 0 : fieldData.componentType);
  }, [formula]);

  // 条件可选字段筛选
  const conditionFieldOptionsFilter = useCallback(fieldData => {
    return [FieldComponentType.TEXT_FIELD,
    // 文本
    FieldComponentType.TEXT_AREA,
    // 多行文本
    FieldComponentType.RICH_TEXT,
    // 多行文本
    FieldComponentType.SWITCH,
    // 开关
    FieldComponentType.PHONE_NUMBER,
    // 手机号码
    FieldComponentType.EMAIL,
    // 电子邮箱
    FieldComponentType.APPENDIX,
    // 附件
    'LINK',
    // 超链接
    FieldComponentType.NUMBER_FIELD,
    // 整数
    FieldComponentType.FLOAT,
    // 浮点数
    FieldComponentType.PERCENTAGE,
    // 百分数
    FieldComponentType.MONEY,
    // 金额
    FieldComponentType.DATE_SELECTION_BOX,
    // 日期
    FieldComponentType.DATETIME_SELECTION_BOX,
    // 日期时间
    FieldComponentType.RADIO,
    // 单选
    FieldComponentType.SINGLE_SELECT,
    // 下拉单选
    FieldComponentType.CHECKBOX,
    // 复选
    FieldComponentType.MULTIPLE_SELECT,
    // 下拉多选
    FieldComponentType.CODE_RULE,
    // 编码规则
    FieldComponentType.REFERENCE_FIELD // 引用字段
    ].includes(fieldData === null || fieldData === void 0 ? void 0 : fieldData.componentType);
  }, []);

  // 字段选择树
  const fieldTreeData = useCallback((originData, filter) => {
    var _originData$childrenF;
    if (!(originData && _isArray(originData[childrenField]))) return;

    // 由于这个树比较特殊，子节点只有可能有一个，所以可以简单通过层级，快速定位到对应的节点
    let level = 0;
    const buildTreeData = item => {
      if (item.subBusinessObject) {
        // 渲染另一个对象
        level += 1;
        return /*#__PURE__*/React.createElement(TreeNode, {
          value: middleNode + item.businessObjectFieldCode + item[idField] + level,
          title: _get(item, ['subBusinessObject', 'parentBOFieldName'], '中间对象'),
          disabled: true
        }, [_get(item, ['subBusinessObject', childrenField], []).map(i => buildTreeData(i))]);
      } else {
        return filter(item) && /*#__PURE__*/React.createElement(TreeNode, {
          value: `${level}__${item[idField]}`,
          title: item[titleField]
        });
      }
    };
    return (_originData$childrenF = originData[childrenField]) === null || _originData$childrenF === void 0 ? void 0 : _originData$childrenF.map(item => buildTreeData(item));
  }, []);

  // 选择聚合表达式字段
  const handleExpressionFieldChange = value => {
    // @ts-ignore
    const _ref = foreachTreeSelect(value) || {},
      pathObjCode = _ref.pathObjCode,
      pathObjName = _ref.pathObjName;
    if (pathObjCode && pathObjName) {
      const mapObj = {
        value: `CASCADE(${pathObjCode.join(',')})`,
        meaning: `CASCADE(${pathObjName.join(',')})`
      };
      mappingListRef.current = [...mappingList, mapObj];
      setMappingList(mappingListRef.current);
      formulaEditorRef.current.appendText(`${mapObj.meaning} `);
    }
    return false;
  };

  // 选择聚合表达式运算符
  const handleExpressionOperatorChangeBefore = useCallback(value => {
    formulaEditorRef.current.appendText(value);
    return false;
  }, []);

  // 聚合表达式变化
  const handleExpressionMeaningChange = useCallback(codeMeaning => {
    //  清空报错信息
    setExpressionErrorList([]);
    const code = codeTransfer(codeMeaning, mappingListRef.current, 'meaning', 'value');
    if (formDs.current) {
      formDs.current.set(FieldNameTypes.POLYMERIZATION_EXPRESSION_CODE, code);
      formDs.current.set(FieldNameTypes.POLYMERIZATION_EXPRESSION, codeMeaning);
    }
  }, [mappingList]);

  // 处理条件
  const handleConditionRes = () => {
    var _filterCacheRef$curre2, _filterCacheRef$curre3;
    const filterData = (filterCacheRef === null || filterCacheRef === void 0 ? void 0 : (_filterCacheRef$curre2 = filterCacheRef.current) === null || _filterCacheRef$curre2 === void 0 ? void 0 : (_filterCacheRef$curre3 = _filterCacheRef$curre2.ds) === null || _filterCacheRef$curre3 === void 0 ? void 0 : _filterCacheRef$curre3.toData()) || [];
    let valueNew = '';
    let codeNew = '';
    if (filterData !== null && filterData !== void 0 && filterData.length) {
      var _formDs$current5, _conditionRelationshi;
      const handleData = filterData.map(v => {
        // 变量类型
        let strCode = v.fieldType;
        let strMeaning = v.fieldType;

        // 变量
        if (v.fieldType === 'FIELD') {
          strCode += `, ${v.fieldPath}`;
          strMeaning += `, ${v.fieldPathMeaning}`;
        } else if (v.fieldType === 'EXPRESSION') {
          strCode += `, '${v.fieldPath}'`;
          strMeaning += `, '${v.fieldPath}'`;
        } else {
          strCode += `, ${v.fieldPath}`;
          strMeaning += `, ${v.fieldPath}`;
        }

        // 逻辑符
        strCode += `, ${v.operatorType}`;
        strMeaning += `, ${v.operatorType}`;
        if (!['IS_NULL', 'IS_NOT_NULL'].includes(v.operatorType)) {
          // 取值类型
          strCode += `, ${v.valueType}`;
          strMeaning += `, ${v.valueType}`;

          // 值
          if (v.valueType === 'FIELD') {
            strCode += `, ${v.value}`;
            strMeaning += `, ${v.valueMeaning}`;
          } else if (['FIXED', 'EXPRESSION'].includes(v.valueType)) {
            strCode += `, '${v.value}'`;
            strMeaning += `, '${v.value}'`;
          } else {
            strCode += `, ${v.value}`;
            strMeaning += `, ${v.value}`;
          }
        }
        return {
          value: `COL_CONDITION(${strCode})`,
          text: `COL_CONDITION(${strMeaning})`
        };
        // 左侧字段类型, 字段值, 操作符, 右侧字段类型, 右侧值
      });
      const conditionRelationship = (formDs === null || formDs === void 0 ? void 0 : (_formDs$current5 = formDs.current) === null || _formDs$current5 === void 0 ? void 0 : _formDs$current5.get(FieldNameTypes.CONDITION_RELATIONSHIP)) || '';
      const matches = (conditionRelationship === null || conditionRelationship === void 0 ? void 0 : (_conditionRelationshi = conditionRelationship.match) === null || _conditionRelationshi === void 0 ? void 0 : _conditionRelationshi.call(conditionRelationship, /\b(AND|OR)\b/g)) || [];
      handleData.forEach((v, i) => {
        if (i === 0) {
          valueNew += v.value;
          codeNew += v.text;
        } else {
          valueNew += `${(matches === null || matches === void 0 ? void 0 : matches[i]) === 'OR' ? ' || ' : ' && '}${v.value}`;
          codeNew += `${(matches === null || matches === void 0 ? void 0 : matches[i]) === 'OR' ? ' || ' : ' && '}${v.text}`;
        }
      });
    }
    return {
      value: valueNew ? `${valueNew}, ` : '',
      text: codeNew ? `${codeNew}, ` : ''
    };
  };

  // 处理选择时候树形数据
  const foreachTreeSelect = selectId => {
    var _formDs$current6, _formDs$current7, _conditionFieldList$c;
    if (!_isArray(conditionFieldList[childrenField])) return;
    const indexStr = String(_get(`${selectId}`.match(/[0-9]+/), ['0'], '0'));
    const pureId = `${selectId}`.replace(/[0-9]+__/, '');
    const getItemValueAndText = item => ({
      value: `${_get(item, 'businessObjectCode')}.${_get(item, 'businessObjectFieldCode')}`,
      text: `${_get(item, 'businessObjectName')}.${_get(item, 'businessObjectFieldName')}`
    });

    // 由于这个树比较特殊，子节点只有可能有一个，所以可以简单通过层级，快速定位到对应的节点
    let level = 0;
    let res = {};
    let pathObjCode = [];
    let pathObjName = [];

    // 把基准字段的路径，拼接到item，简便取值时候
    const standardCode = getDrillObjPath((_formDs$current6 = formDs.current) === null || _formDs$current6 === void 0 ? void 0 : _formDs$current6.get(FieldNameTypes.POLYMERIZATION_STANDARD_CODE));
    const standardName = getDrillObjPath((_formDs$current7 = formDs.current) === null || _formDs$current7 === void 0 ? void 0 : _formDs$current7.get(FieldNameTypes.POLYMERIZATION_STANDARD));
    const mapTreeData = item => {
      if (item.subBusinessObject) {
        // 记录上次的根节点
        pathObjCode.push(standardCode[level]);
        pathObjName.push(standardName[level]);
        level += 1;
        _get(item, ['subBusinessObject', childrenField], []).map(i => mapTreeData(i));
      } else if (indexStr === String(level)) {
        if (pureId === item[idField]) {
          const temp = getItemValueAndText(item);
          res = {
            ...item,
            pathObjCode: [...pathObjCode, temp.value],
            pathObjName: [...pathObjName, temp.text]
          };
          pathObjCode = [];
          pathObjName = [];
        }
      }
    };

    // eslint-disable-next-line no-unused-expressions
    (_conditionFieldList$c = conditionFieldList[childrenField]) === null || _conditionFieldList$c === void 0 ? void 0 : _conditionFieldList$c.map(item => mapTreeData(item));
    return res;
  };

  // 处理钻取组件条件
  const handleQuery = (level, query) => {
    // 只钻取对象
    return {
      ...query,
      drillFieldFlag: false,
      drillPublishFlag: level > 0
    };
  };
  const formulaNameRender = ({
    value
  }) => {
    return /*#__PURE__*/React.createElement("div", {
      className: styles['formula-name-title']
    }, /*#__PURE__*/React.createElement("div", {
      className: styles['sb-first-for-margin-add']
    }, value, "("), TagRender('formulaNameTag', [{
      status: 'formulaNameTag',
      text: intl.get('hmde.bo.businessObject.formulaStanderName').d('聚合基准名称')
    }]), /*#__PURE__*/React.createElement("div", {
      className: styles['sb-last-for-margin-dismiss']
    }, ")"));
  };
  const polymerizationStandardRender = ({
    record
  }) => {
    const handleOk = frillProps => {
      if (record !== null && record !== void 0 && record.set) {
        var _filterCacheRef$curre4, _filterCacheRef$curre5;
        record === null || record === void 0 ? void 0 : record.set(FieldNameTypes.POLYMERIZATION_STANDARD, frillProps === null || frillProps === void 0 ? void 0 : frillProps.text);
        record === null || record === void 0 ? void 0 : record.set(FieldNameTypes.POLYMERIZATION_STANDARD_CODE, frillProps === null || frillProps === void 0 ? void 0 : frillProps.value);

        // 切换了基准字段，清空所有
        formulaEditorRef.current.clear();
        formDs.current.set(FieldNameTypes.POLYMERIZATION_EXPRESSION, '');
        formDs.current.set(FieldNameTypes.POLYMERIZATION_EXPRESSION_CODE, '');
        record === null || record === void 0 ? void 0 : record.set(FieldNameTypes.CONDITION_RELATIONSHIP, '');
        // tableDs.deleteAll(false);
        filterCacheRef === null || filterCacheRef === void 0 ? void 0 : (_filterCacheRef$curre4 = filterCacheRef.current) === null || _filterCacheRef$curre4 === void 0 ? void 0 : (_filterCacheRef$curre5 = _filterCacheRef$curre4.ds) === null || _filterCacheRef$curre5 === void 0 ? void 0 : _filterCacheRef$curre5.deleteAll(false);
      }
    };
    const handleClear = () => {
      var _formDs$current8, _filterCacheRef$curre6, _filterCacheRef$curre7;
      record === null || record === void 0 ? void 0 : record.set(FieldNameTypes.POLYMERIZATION_STANDARD, null);
      formDs === null || formDs === void 0 ? void 0 : (_formDs$current8 = formDs.current) === null || _formDs$current8 === void 0 ? void 0 : _formDs$current8.set(FieldNameTypes.POLYMERIZATION_STANDARD_CODE, null);
      formulaEditorRef.current.clear();
      formDs.current.set(FieldNameTypes.POLYMERIZATION_EXPRESSION, '');
      formDs.current.set(FieldNameTypes.POLYMERIZATION_EXPRESSION_CODE, '');
      record === null || record === void 0 ? void 0 : record.set(FieldNameTypes.CONDITION_RELATIONSHIP, '');
      // tableDs.deleteAll(false);
      filterCacheRef === null || filterCacheRef === void 0 ? void 0 : (_filterCacheRef$curre6 = filterCacheRef.current) === null || _filterCacheRef$curre6 === void 0 ? void 0 : (_filterCacheRef$curre7 = _filterCacheRef$curre6.ds) === null || _filterCacheRef$curre7 === void 0 ? void 0 : _filterCacheRef$curre7.deleteAll(false);
    };
    return /*#__PURE__*/React.createElement(DrillComponent, {
      onOk: handleOk,
      onClear: handleClear
      // isWriteBack={false}
      ,
      curFieldId: curFieldId,
      name: FieldNameTypes.POLYMERIZATION_STANDARD,
      businessObjectCode: businessObjectCode
      // selectObjectCheckFlag // 函数必须钻取到字段
      ,
      queryHandleBeforeFetch: handleQuery,
      drillDownFlag: true // 向下钻取
    });
  };

  // treeSelect样式覆盖 添加自定义禁用效果
  const optionRenderer = _props => {
    var _record$get;
    const text = _props.text,
      record = _props.record;
    const disabled = record === null || record === void 0 ? void 0 : (_record$get = record.get('value')) === null || _record$get === void 0 ? void 0 : _record$get.startsWith('title#');
    return /*#__PURE__*/React.createElement(_Tooltip, {
      title: text
    }, /*#__PURE__*/React.createElement(_Button, {
      funcType: "flat",
      color: "primary",
      disabled: disabled,
      style: {
        color: 'rgba(0, 0, 0, 0.65)'
      }
    }, text));
  };
  return /*#__PURE__*/React.createElement(_ConfigProvider, {
    showHelp: "label"
  }, /*#__PURE__*/React.createElement(_Form, {
    dataSet: formDs,
    columns: 2,
    labelAlign: "left",
    labelWidth: 160
  }, /*#__PURE__*/React.createElement(_Output, {
    name: FieldNameTypes.FORMULA_NAME,
    renderer: formulaNameRender
  }), /*#__PURE__*/React.createElement(_Output, {
    renderer: polymerizationStandardRender,
    label: intl.get('hmde.bo.businessObject.polymerizationStandard').d('聚合基准'),
    help: POLYMERIZATION_STANDARD_HELP()
  }), /*#__PURE__*/React.createElement(_Output, {
    label: /*#__PURE__*/React.createElement(RequiredLabel, null, intl.get('hmde.bo.businessObject.polyExpression').d('聚合表达式')),
    help: POLYMERIZATION_EXPRESSION_HELP(),
    hidden: formula === 'COL_COUNT'
  })), /*#__PURE__*/React.createElement("div", {
    hidden: formula === 'COL_COUNT',
    className: styles['item-wrapper']
  }, expressionErrorList.length > 0 && /*#__PURE__*/React.createElement(EditorError, {
    style: {
      marginBottom: '8px'
    },
    errorList: expressionErrorList
  }), /*#__PURE__*/React.createElement(_Form, {
    columns: 3,
    labelAlign: "left",
    className: styles['expression-form']
  }, /*#__PURE__*/React.createElement(_TreeSelect, {
    label: intl.get('hmde.common.field').d('字段'),
    searchable: true,
    onBeforeChange: handleExpressionFieldChange,
    placeholder: intl.get('hmde.bo.businessObject.placeholder.toSelectField').d('请选择字段')
  }, fieldTreeData(conditionFieldList, expressionFieldOptionsFilter)), /*#__PURE__*/React.createElement(_TreeSelect, {
    label: intl.get('hmde.bo.businessObject.formula.operator').d('运算符'),
    onBeforeChange: handleExpressionOperatorChangeBefore,
    searchable: true,
    placeholder: intl.get('hmde.bo.businessObject.toSelectOperator').d('请选择运算符'),
    optionRenderer: optionRenderer
  }, arithmetic.filter(type => [intl.get('hmde.bo.businessObject.loarithmeticgic').d('算术'), intl.get('hmde.bo.businessObject.other').d('其他')].includes(type.value)).map(item => {
    return /*#__PURE__*/React.createElement(TreeNode, {
      value: `title#${item.value}`,
      title: item.meaning,
      disabled: true
    }, item.children.map(i => {
      return /*#__PURE__*/React.createElement(TreeNode, {
        value: i.value,
        title: i.meaning
      });
    }));
  }))), /*#__PURE__*/React.createElement(FormulaEditor, {
    ref: formulaEditorRef,
    initLanguage: editorLanguage,
    highLightBlocks: blocks,
    autoSelectBlocks: blocks,
    style: {
      height: '100px'
    },
    onChange: handleExpressionMeaningChange
  })), /*#__PURE__*/React.createElement(NewFilterCondition, {
    filterCacheRef: filterCacheRef,
    data: [],
    logicFormulaName: FieldNameTypes.CONDITION_RELATIONSHIP,
    detailDsV: formDs,
    lookupCode: "HMDE.OPTION.FILTER_CONDTION_VALUE_TYPE",
    name: FieldNameTypes.POLYMERIZATION_CONDITION,
    leftExpressionName: "leftExpressionName",
    rightExpressionName: "rightExpressionName",
    showTopLable: true,
    businessObjectName: "aaa",
    busObjectCode: "TESTX_BUGFIX",
    isFormula: true,
    foreachTreeSelect: foreachTreeSelect,
    treeData: fieldTreeData(conditionFieldList, conditionFieldOptionsFilter),
    draftFieldFlag: true
  }), /*#__PURE__*/React.createElement(_Form, {
    dataSet: formDs,
    labelAlign: "left"
    // useColon={false}
    ,
    labelWidth: 160
  }, /*#__PURE__*/React.createElement(_TextField, {
    name: FieldNameTypes.CONDITION_RELATIONSHIP
  })));
};
export default observer(PolymerizationFormula);