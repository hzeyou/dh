import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _SelectBox from "@hzero-front-ui/c7n-ui/lib/SelectBoxPro";
import _Lov from "@hzero-front-ui/c7n-ui/lib/LovPro";
import _Switch from "@hzero-front-ui/c7n-ui/lib/SwitchPro";
import _IntlField from "@hzero-front-ui/c7n-ui/lib/IntlFieldPro";
import _TextArea from "@hzero-front-ui/c7n-ui/lib/TextAreaPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _message from "@hzero-front-ui/c7n-ui/lib/MessagePro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _uniqBy from "lodash/uniqBy";
import _isUndefined from "lodash/isUndefined";
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { nanoid } from 'nanoid';
import { observer } from 'mobx-react-lite';
import MonacoEditor, { monaco } from "hzero-front-apaas/lib/components/MonacoEditor";
import { ViewMode } from 'choerodon-ui/pro/lib/lov/enum';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { LabelLayout } from 'choerodon-ui/pro/lib/form/enum';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { isTenantRoleLevel, getResponse } from 'utils/utils';
import { ResizeType } from 'choerodon-ui/pro/lib/text-area/enum';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import SectionTitle from "hzero-front-apaas/lib/components/SectionTitle";
import { formDs, RuleType } from "hzero-front-hmde/lib/stores/BusinessObject/RulesDS";
import DrillButton from "hzero-front-hmde/lib/businessComponents/FormulaEditor/DrillButton";
import ToolBars from "hzero-front-hmde/lib/businessComponents/FormulaEditor/ToolBars";
import { getApiObjectParams, EEnvironmentCode } from "hzero-front-hmde/lib/utils/queryApiObjectFields";
// import LabelTitleRender from '@hmde/businessComponents/LabelTitleRender';
import { useLanguageSuggestion, useBlockAutoSelect, useBlockHighLight } from "hzero-front-hmde/lib/businessComponents/FormulaEditorCore/hooks";
import { codeTransfer } from "hzero-front-hmde/lib/businessComponents/FormulaEditorCore/utils";
import { fixedMarkerPosition } from "hzero-front-hmde/lib/businessComponents/FormulaEditor/utils";
import NewTokenPicker from "hzero-front-hmde/lib/businessComponents/NewTokenPicker";
import useRequestTokens from "hzero-front-hmde/lib/businessComponents/NewTokenPicker/hooks/useRequestTokens";
import { compileExpression } from "hzero-front-hmde/lib/services/businessObjectService";
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
import useGetMultilingualTls from "hzero-front-hmde/lib/hooks/useGetMultilingualTls";
import ErrorRule from "./components/ErrorRule";
import DragOrderContent from "./DragOrderContent";
import { ErrorInfoType } from "./components/IntlLanguage";
import styles from "./index.less?modules";
import { intlMontage } from "./utils";
const isTenant = isTenantRoleLevel();
const Option = _Select.Option;
const Rule = props => {
  var _baseInfoDS$current, _boStore$getState, _formulaMappingList$c, _formDS$current2, _formDS$current11, _formDS$current12, _formDS$current13, _formDS$current14, _baseInfoDS$current7;
  // 用于做meaning和value的映射
  const formulaMappingList = useRef([]);
  const businessObjectId = props.businessObjectId,
    ruleId = props.ruleId,
    businessObjectCode = props.businessObjectCode,
    businessObjectName = props.businessObjectName,
    ruleDS = props.ruleDS,
    baseInfoDS = props.baseInfoDS,
    isCustomRule = props.isCustomRule,
    _props$predefineDisab = props.predefineDisabled,
    predefineDisabled = _props$predefineDisab === void 0 ? false : _props$predefineDisab,
    readOnlyFlag = props.readOnlyFlag,
    showVersion = props.showVersion,
    modal = props.modal,
    _props$isApiTenantTyp = props.isApiTenantType,
    isApiTenantType = _props$isApiTenantTyp === void 0 ? false : _props$isApiTenantTyp;
  const middleBusinessObjFlag = (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('businessObjectCategory')) === 'MIDDLE'; // 关系明细
  const middleObjEditDisableFlag = middleBusinessObjFlag && ruleId; // 是否可以编辑
  const tenantReadOnly = isTenant && ruleId && !isCustomRule;
  const boStore = useBoStore();
  const hasPermission = (_boStore$getState = boStore === null || boStore === void 0 ? void 0 : boStore.getState('hasPermission')) !== null && _boStore$getState !== void 0 ? _boStore$getState : true;
  const _useRequestTokens = useRequestTokens('system-variables'),
    _useRequestTokens2 = _slicedToArray(_useRequestTokens, 2),
    svTokens = _useRequestTokens2[0],
    svTokensLoading = _useRequestTokens2[1];
  const _useRequestTokens3 = useRequestTokens('operators'),
    _useRequestTokens4 = _slicedToArray(_useRequestTokens3, 2),
    opTokens = _useRequestTokens4[0],
    opTokensLoading = _useRequestTokens4[1];
  const _useRequestTokens5 = useRequestTokens('functions'),
    _useRequestTokens6 = _slicedToArray(_useRequestTokens5, 2),
    funTokens = _useRequestTokens6[0],
    funTokensLoading = _useRequestTokens6[1];
  const editorIns = useRef();
  const monacoInstance = useRef();
  const _useState = useState(() => `formula-lang-${nanoid(4)}`),
    _useState2 = _slicedToArray(_useState, 1),
    editorLanguage = _useState2[0];
  const _useState3 = useState(''),
    _useState4 = _slicedToArray(_useState3, 2),
    code = _useState4[0],
    setCode = _useState4[1];
  const _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    selectFields = _useState6[0],
    setSelectFields = _useState6[1];
  const _useState7 = useState(null),
    _useState8 = _slicedToArray(_useState7, 2),
    validation = _useState8[0],
    setValidation = _useState8[1];
  const _useState9 = useState(true),
    _useState10 = _slicedToArray(_useState9, 2),
    dropTenantIdFlad = _useState10[0],
    setDropTenantIdFlad = _useState10[1];
  const errorInfoTls = useGetMultilingualTls('hmde.bo', 'businessObject.formualError');
  const alreadyExistsTls = useGetMultilingualTls('hmde.bo', 'businessObject.alreadyExists');
  const sameDataTls = useGetMultilingualTls('hmde.bo', 'businessObject.sameData');
  const valueSameDataTls = useGetMultilingualTls('hmde.bo', 'businessObject.valueSameData');
  const fieldTls = useGetMultilingualTls('hmde.common', 'field');
  const dataNotMatchTls = useGetMultilingualTls('hmde.bo', 'businessObject.dataNotMatch');
  const ruleTls = useGetMultilingualTls('hmde.bo', 'businessObject.rule');
  const _useState11 = useState(false),
    _useState12 = _slicedToArray(_useState11, 2),
    visible = _useState12[0],
    setVisible = _useState12[1];
  const editorHeight = 182;
  const _useState13 = useState((_formulaMappingList$c = formulaMappingList.current) === null || _formulaMappingList$c === void 0 ? void 0 : _formulaMappingList$c.map(({
      meaning: _meaning
    }) => _meaning)),
    _useState14 = _slicedToArray(_useState13, 2),
    blocks = _useState14[0],
    setBlocks = _useState14[1];

  // 编辑器上次保存的值
  const _useState15 = useState(''),
    _useState16 = _slicedToArray(_useState15, 2),
    lastSavedata = _useState16[0],
    setLastSavedata = _useState16[1];
  const formDS = useMemo(() => {
    var _baseInfoDS$current2;
    return new _DataSet(formDs({
      businessObjectId,
      ruleId,
      businessObjectCode,
      ruleDS,
      showVersion,
      physicalModelType: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : _baseInfoDS$current2.get('physicalModelType')
    }));
  }, [businessObjectId, ruleId, ruleDS, showVersion]);
  const paramObjDisabledFlag = useMemo(() => {
    var _baseInfoDS$current3, _formDS$current;
    return (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current3 = baseInfoDS.current) === null || _baseInfoDS$current3 === void 0 ? void 0 : _baseInfoDS$current3.get('businessObjectCategory')) === 'DIMENSION' && (formDS === null || formDS === void 0 ? void 0 : (_formDS$current = formDS.current) === null || _formDS$current === void 0 ? void 0 : _formDS$current.get('operationalFlag')) === false;
  }, [baseInfoDS, formDS === null || formDS === void 0 ? void 0 : (_formDS$current2 = formDS.current) === null || _formDS$current2 === void 0 ? void 0 : _formDS$current2.get('operationalFlag')]);
  const suggestions = useMemo(() => {
    const suggestObj = {
      ...svTokens,
      ...funTokens
    };
    const suggestionsArr = [];
    Object.keys(suggestObj).forEach(key => {
      suggestObj[key].forEach(item => {
        if (item.format.includes('COL_')) {
          // 把聚合函数去除
          return;
        }
        suggestionsArr.push({
          label: item.name,
          detail: item.format,
          description: item.chineseName
        });
      });
    });
    return suggestionsArr;
  }, [svTokens, funTokens]);
  useLanguageSuggestion(editorLanguage, suggestions);

  // 自动高亮块
  useBlockHighLight(editorLanguage, blocks);

  // 自动选择块
  useBlockAutoSelect(editorIns.current || null, blocks);

  // 表达式错误提示
  useEffect(() => {
    var _editorIns$current;
    const model = (_editorIns$current = editorIns.current) === null || _editorIns$current === void 0 ? void 0 : _editorIns$current.getModel();
    if (!model) {
      return;
    }
    if (!(validation !== null && validation !== void 0 && validation.message) || !(validation !== null && validation !== void 0 && validation.expression)) {
      monaco.editor.setModelMarkers(model, editorLanguage, []);
      return;
    }
    if (!_isUndefined(validation.startLineNumber) && !_isUndefined(validation.endLineNumber) && !_isUndefined(validation.startIndex) && !_isUndefined(validation.endIndex)) {
      const fixedMarker = fixedMarkerPosition({
        message: validation.message,
        startLineNumber: validation.startLineNumber,
        endLineNumber: validation.endLineNumber,
        startIndex: validation.startIndex,
        endIndex: validation.endIndex
      }, validation.expression, formulaMappingList.current);
      monaco.editor.setModelMarkers(model, editorLanguage, [{
        code: 'ERROR',
        severity: monaco.MarkerSeverity.Error,
        message: fixedMarker === null || fixedMarker === void 0 ? void 0 : fixedMarker.message,
        startColumn: fixedMarker === null || fixedMarker === void 0 ? void 0 : fixedMarker.startIndex,
        startLineNumber: fixedMarker === null || fixedMarker === void 0 ? void 0 : fixedMarker.startLineNumber,
        endColumn: (fixedMarker === null || fixedMarker === void 0 ? void 0 : fixedMarker.endIndex) + 1,
        // 标记时包含最后一个字符
        endLineNumber: fixedMarker === null || fixedMarker === void 0 ? void 0 : fixedMarker.endLineNumber
      }]);
    }
  }, [editorLanguage, validation]);
  const checkExpression = async () => {
    var _formDS$current3, _code$match;
    const value = formDS === null || formDS === void 0 ? void 0 : (_formDS$current3 = formDS.current) === null || _formDS$current3 === void 0 ? void 0 : _formDS$current3.get('formula');
    if (!value) {
      return {
        effective: false,
        message: intl.get('hmde.bo.businessObject.expressionNone').d('表达式不能为空')
      };
    }
    const expression = `${((_code$match = code.match(/^\s+/)) === null || _code$match === void 0 ? void 0 : _code$match[0]) || ''}${value}`;
    const res = await compileExpression({
      expression,
      resultType: 'SWITCH'
    });
    if (!getResponse(res)) {
      return null;
    } else {
      return {
        ...res,
        expression
      };
    }
  };
  const load = ({
    dataSet
  }) => {
    var _dataSet$current, _dataSet$current2, _dataSet$current3;
    const validRuleFields = (_dataSet$current = dataSet.current) === null || _dataSet$current === void 0 ? void 0 : _dataSet$current.get('validRuleFields');
    (_dataSet$current2 = dataSet.current) === null || _dataSet$current2 === void 0 ? void 0 : _dataSet$current2.set('updateStatus', true); // 更新 record status (sync => update) 使得能够不做任何修改保存
    if (((_dataSet$current3 = dataSet.current) === null || _dataSet$current3 === void 0 ? void 0 : _dataSet$current3.get('ruleType')) === RuleType.RECHECK_RULE && validRuleFields) {
      var _validRuleFields$toJS;
      setSelectFields(validRuleFields === null || validRuleFields === void 0 ? void 0 : validRuleFields.toJS());

      // 租户id拖拽逻辑
      validRuleFields === null || validRuleFields === void 0 ? void 0 : (_validRuleFields$toJS = validRuleFields.toJS()) === null || _validRuleFields$toJS === void 0 ? void 0 : _validRuleFields$toJS.some((v, i) => {
        if (v.businessObjectFieldCode === 'tenantId') {
          if (i !== (validRuleFields === null || validRuleFields === void 0 ? void 0 : validRuleFields.toJS().length) - 1) {
            setDropTenantIdFlad(false);
          }
          return true;
        }
        return false;
      });
    }
    setCode(setFormulaInitValue(dataSet.current.toData()));
  };

  // formDS update事件
  const update = ({
    record,
    value,
    oldValue,
    name,
    dataSet
  }) => {
    if (name === 'ruleType' && !isTemplateErrorInfoType) {
      record === null || record === void 0 ? void 0 : record.set('errorInfoMeaning', null);
    }
    if (name === 'validRuleFields' && (record === null || record === void 0 ? void 0 : record.get('ruleType')) === RuleType.RECHECK_RULE) {
      // 查重规则
      const _value = value.filter(item => (item === null || item === void 0 ? void 0 : item.businessObjectFieldCode) !== 'tenantId');
      const tenantIdValue = value.filter(item => (item === null || item === void 0 ? void 0 : item.businessObjectFieldCode) === 'tenantId');
      setSelectFields(value !== null && value !== void 0 && value.length ? [..._value, ...tenantIdValue] : null);
      let str = '';
      // eslint-disable-next-line no-unused-expressions
      _value === null || _value === void 0 ? void 0 : _value.forEach((item, index) => {
        if (index !== (_value === null || _value === void 0 ? void 0 : _value.length) - 1) {
          str = `${str}${item === null || item === void 0 ? void 0 : item.businessObjectFieldName}、`;
        } else {
          str = `${str}${item === null || item === void 0 ? void 0 : item.businessObjectFieldName}`;
        }
      });
      if ((_value === null || _value === void 0 ? void 0 : _value.length) === 1) {
        if (!(record !== null && record !== void 0 && record.get('errorInfoMeaning')) && !isTemplateErrorInfoType) {
          record === null || record === void 0 ? void 0 : record.set('errorInfoMeaning', `
          ${intl.get('hmde.bo.businessObject.alreadyExists').d('已存在')} ${str} ${intl.get('hmde.bo.businessObject.sameData').d('相同的数据')}
        `);
          record === null || record === void 0 ? void 0 : record.set('_tls', {
            ...(record === null || record === void 0 ? void 0 : record.get('_tls')),
            errorInfo: intlMontage(alreadyExistsTls, _value === null || _value === void 0 ? void 0 : _value.map(v => {
              var _v$_tls;
              return v === null || v === void 0 ? void 0 : (_v$_tls = v._tls) === null || _v$_tls === void 0 ? void 0 : _v$_tls.businessObjectFieldName;
            }), sameDataTls)
          });
        }
      } else if ((_value === null || _value === void 0 ? void 0 : _value.length) > 1) {
        if (!(record !== null && record !== void 0 && record.get('errorInfoMeaning')) && !isTemplateErrorInfoType) {
          record === null || record === void 0 ? void 0 : record.set('errorInfoMeaning', `
          ${intl.get('hmde.bo.businessObject.alreadyExists').d('已存在')} ${str} ${intl.get('hmde.bo.businessObject.valueSameData').d('组合值相同的数据')}
          `);
          record === null || record === void 0 ? void 0 : record.set('_tls', {
            ...(record === null || record === void 0 ? void 0 : record.get('_tls')),
            errorInfo: intlMontage(alreadyExistsTls, _value === null || _value === void 0 ? void 0 : _value.map(v => {
              var _v$_tls2;
              return v === null || v === void 0 ? void 0 : (_v$_tls2 = v._tls) === null || _v$_tls2 === void 0 ? void 0 : _v$_tls2.businessObjectFieldName;
            }), valueSameDataTls)
          });
        }
      }
    }
    // 正则校验
    if ((record === null || record === void 0 ? void 0 : record.get('ruleType')) === RuleType.REGEXP_VALIDATE) {
      if (name === 'regularRules' && record !== null && record !== void 0 && record.get('validRuleFields') && record !== null && record !== void 0 && record.get('regularRules')) {
        var _dataSet$getField;
        const obj = dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$getField = dataSet.getField('regularRules')) === null || _dataSet$getField === void 0 ? void 0 : _dataSet$getField.getLookupData(value, record);
        if (!(record !== null && record !== void 0 && record.get('errorInfoMeaning')) && !isTemplateErrorInfoType) {
          var _record$get, _record$get2, _record$get2$_tls;
          record === null || record === void 0 ? void 0 : record.set('errorInfoMeaning', `${intl.get('hmde.common.field').d('字段')} ${record === null || record === void 0 ? void 0 : (_record$get = record.get('validRuleFields')) === null || _record$get === void 0 ? void 0 : _record$get.businessObjectFieldName} ${intl.get('hmde.bo.businessObject.dataNotMatch').d('数据不符合')} ${obj === null || obj === void 0 ? void 0 : obj.meaning} ${intl.get('hmde.bo.businessObject.rule').d('规则')}`);
          record === null || record === void 0 ? void 0 : record.set('_tls', {
            ...(record === null || record === void 0 ? void 0 : record.get('_tls')),
            errorInfo: intlMontage(fieldTls, [record === null || record === void 0 ? void 0 : (_record$get2 = record.get('validRuleFields')) === null || _record$get2 === void 0 ? void 0 : (_record$get2$_tls = _record$get2._tls) === null || _record$get2$_tls === void 0 ? void 0 : _record$get2$_tls.businessObjectFieldName], dataNotMatchTls, [obj === null || obj === void 0 ? void 0 : obj._tls], ruleTls)
          });
        }
      } else if (name === 'validRuleFields') {
        !(record !== null && record !== void 0 && record.get('errorInfoMeaning')) && !isTemplateErrorInfoType && (record === null || record === void 0 ? void 0 : record.set('errorInfoMeaning', null));
        record === null || record === void 0 ? void 0 : record.set('regularRules', null);
      }
    }
    // 公式
    if (name === 'ruleType' && (record === null || record === void 0 ? void 0 : record.get('ruleType')) === RuleType.FORMULA_VALIDATE && !isTemplateErrorInfoType) {
      record === null || record === void 0 ? void 0 : record.set('errorInfoMeaning', intl.get('hmde.bo.businessObject.formualError').d('数据不符合公式表达式规则'));
      record === null || record === void 0 ? void 0 : record.set('_tls', {
        ...(record === null || record === void 0 ? void 0 : record.get('_tls')),
        errorInfo: errorInfoTls
      });
    }
    if (name === 'ruleType') {
      // 新增模式下切换需要清空
      // 从正则校验切到公式校验 编辑框带出对应表达式
      if (oldValue === 'REGEXP_VALIDATE' && value === 'FORMULA_VALIDATE') {
        const validRuleFields = record === null || record === void 0 ? void 0 : record.get('validRuleFields');
        const regularRules = record === null || record === void 0 ? void 0 : record.get('regularRules');
        const selectField = Boolean(validRuleFields === null || validRuleFields === void 0 ? void 0 : validRuleFields.businessObjectFieldCode);
        const editorMeaning = selectField ? `REGEX( ${businessObjectName}.${validRuleFields === null || validRuleFields === void 0 ? void 0 : validRuleFields.businessObjectFieldName} , "${record === null || record === void 0 ? void 0 : record.get('formula')}")` : `REGEX(CASCADE(, "${record === null || record === void 0 ? void 0 : record.get('formula')}")`;
        const meaning = selectField ? `CASCADE(${businessObjectName}.${validRuleFields === null || validRuleFields === void 0 ? void 0 : validRuleFields.businessObjectFieldName})` : `CASCADE()`;
        const _value = selectField ? `CASCADE(${businessObjectCode}.${validRuleFields === null || validRuleFields === void 0 ? void 0 : validRuleFields.businessObjectFieldCode})` : `CASCADE()`;
        if (validRuleFields && regularRules) {
          var _formulaMappingList$c2;
          (_formulaMappingList$c2 = formulaMappingList.current) === null || _formulaMappingList$c2 === void 0 ? void 0 : _formulaMappingList$c2.push({
            formula: _value,
            meaning: selectField ? `${businessObjectName}.${validRuleFields === null || validRuleFields === void 0 ? void 0 : validRuleFields.businessObjectFieldName}` : '',
            formulaBriefName: selectField ? `${businessObjectName}.${validRuleFields === null || validRuleFields === void 0 ? void 0 : validRuleFields.businessObjectFieldName}` : '',
            curMeaning: meaning
          });
          setBlocks(formulaMappingList.current.map(({
            meaning: _meaning
          }) => _meaning));
          setTimeout(() => {
            // 等编辑器渲染完成后在设置值 才能设置成功 故使用异步
            setEditorVal(editorMeaning); // 设置编辑器回显值
          }, 0);
        }
      } else {
        record === null || record === void 0 ? void 0 : record.set('regularRules', null);
        record === null || record === void 0 ? void 0 : record.set('formula', null);
      }
      if ((record === null || record === void 0 ? void 0 : record.get('ruleType')) === RuleType.RECHECK_RULE) {
        var _baseInfoDS$current4;
        if ((baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current4 = baseInfoDS.current) === null || _baseInfoDS$current4 === void 0 ? void 0 : _baseInfoDS$current4.get('physicalModelType')) !== 'API') {
          record === null || record === void 0 ? void 0 : record.set('validRuleFields', {
            businessObjectFieldName: intl.get('hmde.common.tenantId').d('租户ID'),
            businessObjectFieldCode: 'tenantId'
          });
        }
        // 查重规则
      } else if (record !== null && record !== void 0 && record.get('validRuleFields')) {
        record === null || record === void 0 ? void 0 : record.set('validRuleFields', null);
        setSelectFields(null);
      }
    }
  };
  useDataSetEvents(formDS, ['update', 'load'], [update, load]);

  /**
   *
   * @param value 值
   * @param valType 类型
   * @param valueList 值列表
   */
  const setEditorVal = value => {
    // 排除 value 为 null 的值
    if (value === undefined || value === null) return;
    if (editorIns !== null && editorIns !== void 0 && editorIns.current && (value || value === '')) {
      var _editorIns$current2, _editorIns$current2$g;
      const selection = editorIns === null || editorIns === void 0 ? void 0 : (_editorIns$current2 = editorIns.current) === null || _editorIns$current2 === void 0 ? void 0 : (_editorIns$current2$g = _editorIns$current2.getSelection) === null || _editorIns$current2$g === void 0 ? void 0 : _editorIns$current2$g.call(_editorIns$current2);
      const range = new monaco.Range(selection === null || selection === void 0 ? void 0 : selection.startLineNumber, selection === null || selection === void 0 ? void 0 : selection.startColumn, selection === null || selection === void 0 ? void 0 : selection.endLineNumber, selection === null || selection === void 0 ? void 0 : selection.endColumn);
      const id = {
        major: 1,
        minor: 1
      };
      const op = {
        identifier: id,
        range,
        text: value || ' ',
        forceMoveMarkers: true
      };
      editorIns.current.executeEdits('', [op]);
      editorIns.current.focus();
    }
  };

  // 初始化的时候设置公式的值
  const setFormulaInitValue = data => {
    var _data$formulaAnalyzeR, _data$formulaAnalyzeR2, _data$formulaAnalyzeR3, _codeTransfer;
    const formula = data.formula;
    const referenceInfoList = [];
    data === null || data === void 0 ? void 0 : (_data$formulaAnalyzeR = data.formulaAnalyzeResult) === null || _data$formulaAnalyzeR === void 0 ? void 0 : (_data$formulaAnalyzeR2 = _data$formulaAnalyzeR.analyzeResultList) === null || _data$formulaAnalyzeR2 === void 0 ? void 0 : (_data$formulaAnalyzeR3 = _data$formulaAnalyzeR2.forEach) === null || _data$formulaAnalyzeR3 === void 0 ? void 0 : _data$formulaAnalyzeR3.call(_data$formulaAnalyzeR2, ele => {
      referenceInfoList.push(...(ele.referenceInfoList || []));
    });
    const transferList = [];
    // TODO: 获取到referenceList，然后去设置formulaMappingList
    referenceInfoList === null || referenceInfoList === void 0 ? void 0 : referenceInfoList.forEach(item => {
      transferList.push({
        value: `${item.businessObjectCode}.${item.businessObjectFieldCode || item.fieldFormula}`,
        meaning: `${item.businessObjectName}.${item.businessObjectFieldName}`,
        formula: item.referenceFormula
      });
    });
    const desc = (_codeTransfer = codeTransfer(formula, transferList, 'value', 'meaning')) === null || _codeTransfer === void 0 ? void 0 : _codeTransfer.replace(/CURRENT_\w+?\(\)/g, $0 => {
      var _formulaMappingList$c3, _formulaMappingList$c4;
      const meaning = (_formulaMappingList$c3 = formulaMappingList.current) === null || _formulaMappingList$c3 === void 0 ? void 0 : (_formulaMappingList$c4 = _formulaMappingList$c3.find(item => item.value === $0)) === null || _formulaMappingList$c4 === void 0 ? void 0 : _formulaMappingList$c4.meaning;
      return meaning !== null && meaning !== void 0 ? meaning : $0;
    });
    _uniqBy(referenceInfoList, 'referenceFormula').forEach(i => {
      const list = [];
      referenceInfoList.forEach(r => {
        if (r.referenceFormula === i.referenceFormula) {
          list.push(r);
        }
      });
      const tranList = list.map(t => {
        return {
          value: `${t.businessObjectCode}.${t.businessObjectFieldCode || t.fieldFormula}`,
          meaning: `${t.businessObjectName}.${t.businessObjectFieldName}`,
          formula: t.referenceFormula
        };
      });
      const curMeaning = codeTransfer(i.referenceFormula, tranList, 'value', 'meaning');
      formulaMappingList.current.push({
        meaning: curMeaning,
        value: i.referenceFormula
      });
    });
    setBlocks(formulaMappingList.current.map(({
      meaning
    }) => meaning));
    setLastSavedata(desc || formula);
    return desc || formula;
  };

  // 保存数据
  modal === null || modal === void 0 ? void 0 : modal.handleOk(async () => {
    var _formDS$current4;
    if (!hasPermission) return true;
    const flag = await formDS.validate();
    if (!flag) return false;
    if (((_formDS$current4 = formDS.current) === null || _formDS$current4 === void 0 ? void 0 : _formDS$current4.get('ruleType')) === RuleType.FORMULA_VALIDATE) {
      const validationRes = validation || (await checkExpression());
      if (!validationRes) {
        return false;
      }
      setValidation(validationRes);
      if (!validationRes.effective) {
        notification.error({
          message: intl.get('hmde.bo.businessObject.invalidExpression').d('表达式校验失败，请修改表达式内容')
        });
        return false;
      }
    }
    try {
      const res = await formDS.submit();
      if (!(res !== null && res !== void 0 && res.failed)) {
        ruleDS.query();
        baseInfoDS.query();
      }
    } catch (err) {
      return false;
    }
  });

  /**
   * 编辑器change回调
   * @param {String} val 当前编辑器的值
   */
  const handleEditorChange = val => {
    var _formDS$current5;
    setCode(val);
    const temp = codeTransfer(val, formulaMappingList.current, 'meaning', 'value');
    if (formDS !== null && formDS !== void 0 && (_formDS$current5 = formDS.current) !== null && _formDS$current5 !== void 0 && _formDS$current5.set) {
      formDS.current.set('formula', temp);
    }
    setValidation(null);
  };
  const handleEditorDidMount = (editor, monacoIns) => {
    monacoInstance.current = monacoIns;
    editorIns.current = editor;
    // // Register a new language
    monaco.languages.register({
      id: editorLanguage
    });

    // // Register a tokens provider for the language
    monaco.languages.setMonarchTokensProvider(editorLanguage, {
      tokenizer: {
        root: [[/(CASCADE|CURRENT)\(.*?\)|9999/, 'block']]
      }
    });

    // Define a new theme that contains only rules that match this language
    monaco.editor.defineTheme('myCoolTheme', {
      base: 'vs',
      inherit: true,
      rules: [{
        token: 'block',
        foreground: '2b7de6',
        fontStyle: 'bold',
        background: 'EDF9FA'
      }],
      colors: {
        // 相关颜色属性配置
        'editor.background': '#ffffff',
        // 背景色
        'block.background': 'blue',
        'block.foreground': 'blue'
        //  'editor.selectionBackground': 'red',
        //  'editor.inactiveSelectionBackground': 'red',
      }
    });
    monaco.editor.setTheme('myCoolTheme');

    // 编辑器聚焦
    // editor.focus();
  };

  /**
   * 获取drill数据，回写到editor
   * @param dataSet drill的dataSet
   */
  const handleOk = params => {
    const _ref = params,
      value = _ref.value,
      text = _ref.text;
    formulaMappingList.current.push({
      value,
      meaning: text
    });
    setBlocks(formulaMappingList.current.map(({
      meaning: _meaning
    }) => _meaning));
    setEditorVal(`${text} `);
    // eslint-disable-next-line no-unused-expressions
    // formDS?.current?.set('validRuleFields', result);
  };
  const drillRenderer = () => {
    var _baseInfoDS$current5;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(DrillButton, {
      drillProps: {
        selectObjectCheckFlag: true,
        onOk: handleOk,
        name: 'field',
        businessObjectCode,
        isWriteBack: false,
        initDrillParams: {
          drillPublishFlag: false // 传false钻取非发布的数据
        },
        otherDrillParams: {
          excludeComponentTypeList: 'REFERENCE_FIELD,FORMULA',
          ...((baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current5 = baseInfoDS.current) === null || _baseInfoDS$current5 === void 0 ? void 0 : _baseInfoDS$current5.get('physicalModelType')) === 'API' ? getApiObjectParams(EEnvironmentCode.BUSINESS_RULE_DRILL) : {})
        }
      },
      style: {
        color: '#0840F8 '
      }
    }, intl.get('hmde.bo.businessObject.pushField').d('插入字段'), /*#__PURE__*/React.createElement(_Icon, {
      type: "LOV-o",
      style: {
        fontSize: 14,
        marginBottom: 2,
        marginLeft: '4px'
      }
    })));
  };
  const options = {
    roundedSelection: false,
    cursorStyle: 'line',
    automaticLayout: true,
    selectOnLineNumbers: true,
    renderSideBySide: false,
    wordWrap: 'on',
    readOnly: readOnlyFlag || predefineDisabled || isApiTenantType || tenantReadOnly
  };

  /**
   * 校验用户输入的公式，只是前端校验
   * @returns
   */
  const handleCheck = async () => {
    const validationRes = validation || (await checkExpression());
    if (validationRes !== null && validationRes !== void 0 && validationRes.effective) {
      _message.success(intl.get('hmde.common.successValidation').d('校验成功'), 3, () => {}, 'top');
    }
    setValidation(validationRes);
  };

  // 插入一个符号
  const handlePickToken = ({
    value,
    format
  }) => {
    const val = value || format;
    setEditorVal(`${val} `);
  };

  // 公式渲染
  const rendererFormula = () => {
    return /*#__PURE__*/React.createElement("div", {
      className: styles['formula-editor']
    }, (validation === null || validation === void 0 ? void 0 : validation.effective) === false && /*#__PURE__*/React.createElement("div", {
      className: styles['tip-contain-warn']
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ImgIcon, {
      name: "publish_fail_icon.svg",
      size: 14
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block'
      }
    }, validation === null || validation === void 0 ? void 0 : validation.message), ";"), /*#__PURE__*/React.createElement(ImgIcon, {
      name: "publish_fail_red.png",
      style: {
        width: '195px',
        height: '28px'
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: styles['config-form']
    }, /*#__PURE__*/React.createElement(_Form, {
      labelLayout: "none",
      dataSet: formDS,
      disabled: readOnlyFlag || predefineDisabled || isApiTenantType || tenantReadOnly || !hasPermission,
      columns: 2,
      style: {
        width: '50%'
      }
    }, /*#__PURE__*/React.createElement(_Output, {
      name: "field",
      renderer: drillRenderer
    })), /*#__PURE__*/React.createElement("div", {
      className: styles['config-form-tools']
    }, /*#__PURE__*/React.createElement(ToolBars, {
      lastSavedata: lastSavedata,
      editorInstance: editorIns.current,
      reset: () => handleEditorChange(''),
      disabled: readOnlyFlag || predefineDisabled || isApiTenantType || tenantReadOnly
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(MonacoEditor, {
      width: "100%",
      height: editorHeight,
      language: editorLanguage,
      value: code,
      options: options,
      onChange: handleEditorChange,
      editorDidMount: handleEditorDidMount,
      theme: "myCoolTheme"
    }), !(readOnlyFlag || predefineDisabled || isApiTenantType || tenantReadOnly) && /*#__PURE__*/React.createElement(_Tooltip, {
      title: intl.get('hmde.bo.businessObject.check').d('校验'),
      placement: "top",
      theme: "dark"
    }, /*#__PURE__*/React.createElement(ImgIcon, {
      className: styles['data-check-icon-page'],
      name: "display@1x.svg",
      size: "14px",
      onClick: handleCheck
    }))), /*#__PURE__*/React.createElement("div", {
      className: styles['token-picker-container']
    }, /*#__PURE__*/React.createElement(NewTokenPicker, {
      descriptionPaneHidden: true,
      title: intl.get('hmde.common.systemVariables').d('系统变量'),
      disabled: readOnlyFlag || predefineDisabled || isApiTenantType || tenantReadOnly,
      loading: svTokensLoading,
      nodes: svTokens,
      onTokenClick: handlePickToken
    }), /*#__PURE__*/React.createElement(NewTokenPicker, {
      descriptionPaneHidden: true,
      title: intl.get('hmde.bo.businessObject.formula.operator').d('运算符'),
      disabled: readOnlyFlag || predefineDisabled || isApiTenantType || tenantReadOnly,
      loading: opTokensLoading,
      nodes: opTokens,
      onTokenClick: handlePickToken,
      showChineseName: true
    }), /*#__PURE__*/React.createElement(NewTokenPicker, {
      title: intl.get('hmde.bo.businessObject.functionList').d('函数列表'),
      disabled: readOnlyFlag || predefineDisabled || isApiTenantType || tenantReadOnly,
      loading: funTokensLoading,
      nodes: funTokens,
      onTokenClick: handlePickToken
    })));
  };
  const getRegularRules = record => {
    var _formDS$current7, _formDS$current8;
    if (tenantReadOnly) {
      var _formDS$current6;
      return ((_formDS$current6 = formDS.current) === null || _formDS$current6 === void 0 ? void 0 : _formDS$current6.get('regexpRule')) === 'defaultRule' ? /*#__PURE__*/React.createElement(_Output, {
        name: "regularRules",
        colSpan: 2,
        renderer: ({
          text
        }) => text
      }) : /*#__PURE__*/React.createElement(_Output, {
        name: "regexpName",
        colSpan: 2,
        renderer: ({
          text
        }) => text
      });
    } else if (((_formDS$current7 = formDS.current) === null || _formDS$current7 === void 0 ? void 0 : _formDS$current7.get('regexpRule')) === 'defaultRule') {
      return /*#__PURE__*/React.createElement(_Select, {
        name: "regularRules",
        noCache: true,
        colSpan: 2,
        searchable: true,
        optionsFilter: () => {
          if ([FieldComponentType.TEXT_FIELD, FieldComponentType.TEXT_AREA, FieldComponentType.NUMBER_FIELD, FieldComponentType.FLOAT, FieldComponentType.PHONE_NUMBER, FieldComponentType.EMAIL].includes(record === null || record === void 0 ? void 0 : record.get('selectComponentType'))) {
            return true;
          }
          return false;
        }
      });
    } else if (((_formDS$current8 = formDS.current) === null || _formDS$current8 === void 0 ? void 0 : _formDS$current8.get('regexpRule')) === 'createRule') {
      // return <TextField newLine name="regexpName" colSpan={2} style={{ width: '100%' }} />;
    }
  };
  const getFormula = () => {
    var _formDS$current9, _formDS$current10;
    if (((_formDS$current9 = formDS.current) === null || _formDS$current9 === void 0 ? void 0 : _formDS$current9.get('regexpRule')) === 'defaultRule') {
      return /*#__PURE__*/React.createElement(_TextField, {
        name: "formula",
        disabled: true,
        colSpan: 2,
        style: {
          width: '100%'
        }
      });
    } else if (((_formDS$current10 = formDS.current) === null || _formDS$current10 === void 0 ? void 0 : _formDS$current10.get('regexpRule')) === 'createRule') {
      return /*#__PURE__*/React.createElement(_TextArea, {
        name: "formula",
        colSpan: 4,
        style: {
          width: '100%'
        },
        rows: 4,
        resize: "both",
        placeholder: intl.get('hmde.common.pleaseInput').d('请输入'),
        helpTooltipProps: {
          popupInnerStyle: {
            maxWidth: 'none'
          },
          placement: 'right'
        }
      });
    }
  };
  const isFormDisabled = readOnlyFlag || predefineDisabled || isApiTenantType || !hasPermission;
  const isTemplateErrorInfoType = ((_formDS$current11 = formDS.current) === null || _formDS$current11 === void 0 ? void 0 : _formDS$current11.get('errorInfoType')) === ErrorInfoType.PLATFORM;
  return /*#__PURE__*/React.createElement(_Spin, {
    dataSet: formDS
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    title: intl.get('hmde.bo.businessObject.title.ruleDefine').d('规则定义'),
    style: {
      padding: '0 0 16px 0'
    }
  }), /*#__PURE__*/React.createElement(_Form, {
    dataSet: formDS,
    columns: 2
    // useColon={false}
    ,
    disabled: isFormDisabled
  }, tenantReadOnly ? /*#__PURE__*/React.createElement(_IntlField, {
    disabled: true,
    name: "ruleName",
    style: {
      width: '100%'
    }
  }) : /*#__PURE__*/React.createElement(_IntlField, {
    name: "ruleName",
    style: {
      width: '100%'
    },
    disabled: paramObjDisabledFlag
  }), /*#__PURE__*/React.createElement(_TextField, {
    name: "ruleCode",
    colSpan: 1,
    hidden: !!ruleId,
    addonBefore: /*#__PURE__*/React.createElement(_Tooltip, {
      title: businessObjectCode + (isTenant ? `_C_` : `_S_`),
      placement: "top",
      hidden: !visible
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: '152px',
        height: 26,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        display: 'inline-block',
        lineHeight: '26px'
      },
      onMouseEnter: e => {
        var _e$target, _e$target2;
        if (((_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.scrollWidth) > ((_e$target2 = e.target) === null || _e$target2 === void 0 ? void 0 : _e$target2.offsetWidth)) {
          setVisible(true);
        }
      },
      onMouseLeave: () => setVisible(false)
    }, businessObjectCode + (isTenant ? `_C_` : `_S_`))),
    maxLength: Number(90 - businessObjectCode.length - 3),
    showLengthInfo: true,
    clearButton: true,
    disabled: paramObjDisabledFlag
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "ruleCode",
    colSpan: 1,
    hidden: !ruleId
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "ruleType",
    colSpan: 1,
    renderer: ({
      name,
      text
    }) => tenantReadOnly ? text : /*#__PURE__*/React.createElement(_Select, {
      disabled: middleObjEditDisableFlag || paramObjDisabledFlag,
      optionsFilter: option => {
        if (option.get('value') === 'RECHECK_RULE') {
          var _baseInfoDS$current6;
          if (middleBusinessObjFlag || isTenantRoleLevel() && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current6 = baseInfoDS.current) === null || _baseInfoDS$current6 === void 0 ? void 0 : _baseInfoDS$current6.get('sourceType')) === 'PLATFORM'
          // || baseInfoDS?.current?.get('physicalModelType') === 'API'
          ) {
            // 中间对象/api对象 不允许创建查重规则
            // 租户继承平台的业务对象, 创建的时候也不能创建查重规则
            return false;
          }
          return true;
        } else {
          return true;
        }
      },
      name: name,
      style: {
        width: '100%'
      },
      clearButton: false
    })
  }), /*#__PURE__*/React.createElement(_Switch, {
    name: "enabledFlag",
    colSpan: 1,
    readOnly: tenantReadOnly,
    disabled: middleObjEditDisableFlag || paramObjDisabledFlag
  }), tenantReadOnly ? /*#__PURE__*/React.createElement(_Output, {
    name: "errorInfoMeaning",
    colSpan: 2,
    rowSpan: 2
  }) : /*#__PURE__*/React.createElement(ErrorRule, {
    record: formDS.current,
    name: "errorInfoMeaning",
    colSpan: 2,
    resize: "vertical",
    disabled: isFormDisabled
  })), /*#__PURE__*/React.createElement(SectionTitle, {
    title: intl.get('hmde.bo.businessObject.title.ruleEditing').d('规则编辑')
  }), /*#__PURE__*/React.createElement(_Form, {
    dataSet: formDS,
    columns: 4
    // useColon={false}
    ,
    disabled: readOnlyFlag || predefineDisabled || isApiTenantType || !hasPermission
  }, ((_formDS$current12 = formDS.current) === null || _formDS$current12 === void 0 ? void 0 : _formDS$current12.get('ruleType')) === RuleType.RECHECK_RULE && /*#__PURE__*/React.createElement(_Output, {
    label: intl.get('hmde.common.recheckField').d('查重字段'),
    colSpan: 2,
    renderer: () => /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement(_Lov, {
      name: "validRuleFields",
      icon: "add",
      mode: "button",
      color: "primary",
      funcType: "flat",
      clearButton: false,
      readOnly: tenantReadOnly,
      disabled: middleObjEditDisableFlag || paramObjDisabledFlag,
      noCache: true
    }, intl.get('hmde.common.addField1').d('添加字段')))
  }), ((_formDS$current13 = formDS.current) === null || _formDS$current13 === void 0 ? void 0 : _formDS$current13.get('ruleType')) === RuleType.REGEXP_VALIDATE && /*#__PURE__*/React.createElement(React.Fragment, null, tenantReadOnly ? /*#__PURE__*/React.createElement(_Output, {
    name: "validRuleFields",
    colSpan: 2,
    renderer: ({
      text
    }) => text
  }) : /*#__PURE__*/React.createElement(_Lov, {
    name: "validRuleFields",
    colSpan: 2,
    style: {
      width: '100%'
    },
    noCache: true
  }), /*#__PURE__*/React.createElement(_SelectBox, {
    name: "regexpRule",
    colSpan: 2,
    disabled: tenantReadOnly
  }, /*#__PURE__*/React.createElement(Option, {
    value: "defaultRule"
  }, intl.get('hmde.bo.businessObject.defaultRegularRule').d('默认正则规则')), /*#__PURE__*/React.createElement(Option, {
    value: "createRule"
  }, intl.get('hmde.bo.businessObject.customRegularRule').d('自定义正则规则'))), getRegularRules(formDS.current), tenantReadOnly ? /*#__PURE__*/React.createElement(_Output, {
    newLine: true,
    name: "formula",
    colSpan: 2,
    renderer: ({
      text
    }) => text
  }) : getFormula()), ((_formDS$current14 = formDS.current) === null || _formDS$current14 === void 0 ? void 0 : _formDS$current14.get('ruleType')) === RuleType.FORMULA_VALIDATE && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_SelectBox, {
    colSpan: 4,
    name: "triggerType"
  }), /*#__PURE__*/React.createElement(_Output, {
    className: styles['formula-wrapper'],
    label: intl.get('hmde.common.express').d('表达式'),
    name: "formula",
    colSpan: 4,
    newLine: true,
    renderer: rendererFormula,
    tooltip: 'none'
  }))), selectFields && /*#__PURE__*/React.createElement(DragOrderContent, {
    selectFields: selectFields,
    dropTenantIdFlad: dropTenantIdFlad,
    formDS: formDS,
    physicalModelType: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current7 = baseInfoDS.current) === null || _baseInfoDS$current7 === void 0 ? void 0 : _baseInfoDS$current7.get('physicalModelType'),
    tenantReadOnly: readOnlyFlag || tenantReadOnly || middleObjEditDisableFlag || predefineDisabled || isApiTenantType || paramObjDisabledFlag
  }));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Rule));