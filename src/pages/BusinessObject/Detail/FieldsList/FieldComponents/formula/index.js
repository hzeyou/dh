import _Popconfirm from "@hzero-front-ui/c7n-ui/lib/Popconfirm";
import _Switch from "@hzero-front-ui/c7n-ui/lib/SwitchPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Lov from "@hzero-front-ui/c7n-ui/lib/LovPro";
import _SelectBox from "@hzero-front-ui/c7n-ui/lib/SelectBoxPro";
import _NumberField from "@hzero-front-ui/c7n-ui/lib/NumberFieldPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _IntlField from "@hzero-front-ui/c7n-ui/lib/IntlFieldPro";
import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _Alert from "@hzero-front-ui/c7n-ui/lib/Alert";
import _Icon from "choerodon-ui/pro/lib/icon";
import _message2 from "@hzero-front-ui/c7n-ui/lib/MessagePro";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _uniqBy from "lodash/uniqBy";
import _upperFirst from "lodash/upperFirst";
import _camelCase from "lodash/camelCase";
import React, { useMemo, useImperativeHandle, useState, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { observer } from 'mobx-react-lite';
import { IntlType } from 'choerodon-ui/pro/lib/intl-field/enum';
import { FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { LabelAlign, LabelLayout } from 'choerodon-ui/pro/lib/form/enum';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { isTenantRoleLevel, getResponse, getCurrentLanguage } from 'utils/utils';
import notification from 'utils/notification';
import { EDrillMainKeyType } from 'hzero-front-apaas/lib/components/DrillComponent';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import { queryIdpValue } from 'services/api';
import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';
import uuid from 'uuid/v4';
import { SourceType } from "hzero-front-apaas/lib/constants/businessObject";
import DrillButton from "hzero-front-hmde/lib/businessComponents/FormulaEditor/DrillButton";
import ToolBars from "hzero-front-hmde/lib/businessComponents/FormulaEditor/ToolBars";
import MultiIntlField from "hzero-front-hmde/lib/businessComponents/MultiIntlField";
import NewTokenPicker from "hzero-front-hmde/lib/businessComponents/NewTokenPicker";
import useRequestTokens from "hzero-front-hmde/lib/businessComponents/NewTokenPicker/hooks/useRequestTokens";
import { formulaExpressionCompile } from "hzero-front-hmde/lib/services/businessObjectService";
import SqlModal from "hzero-front-hmde/lib/businessComponents/SqlModal";
import SectionTitle from "hzero-front-apaas/lib/components/SectionTitle";
import { getDrillFIeldType } from "hzero-front-hmde/lib/utils/common";
import { renderPopConfirmTitle } from "hzero-front-apaas/lib/utils/render";
import PolymerizationFormula from "./components/PolymerizationFormula";
import FormulaEditor from "./components/FormulaEditor";
import FormulaDS from "./FormulaDS";
import FormDS, { FieldNameTypes as FormFieldNameTypes } from "./FormDS";
import LovValuesList from "./LovValuesList";
import { codeTransfer, typeMapConvert } from "./utils";
import LovDefineModal from "./LovDefineModal";
import styles from "./style.less?modules";
const isTenant = isTenantRoleLevel();

// const formulaMappingList: any[] = []; // 用于做meaning和value的映射

// type FormulaValidation = {
//   errorList?: any[];
//   valid: boolean;
//   warnList?: any[];
// };

function Index(props) {
  var _formulaMappingList$c, _formulaDs$current10, _formulaDs$current11, _formulaDs$current12, _formulaDs$current13, _formulaDs$current14, _formulaDs$current15, _formulaDs$current16, _formulaDs$current17;
  const isExtensionField = props.isExtensionField,
    isFromDomain = props.isFromDomain,
    businessObjectCode = props.businessObjectCode,
    businessObjectName = props.businessObjectName,
    customPrimaryKeyCode = props.customPrimaryKeyCode,
    businessObjectId = props.businessObjectId,
    disabled = props.disabled,
    isEditMode = props.isEditMode,
    boSourceType = props.boSourceType,
    extendFieldPrefixRule = props.extendFieldPrefixRule,
    detailData = props.detailData,
    businessObjectFieldId = props.businessObjectFieldId,
    inheritId = props.inheritId,
    inheritFieldId = props.inheritFieldId;

  // 用于做meaning和value的映射
  const formulaMappingList = useRef([]);
  const _useRequestTokens = useRequestTokens('system-variables'),
    _useRequestTokens2 = _slicedToArray(_useRequestTokens, 2),
    svTokens = _useRequestTokens2[0],
    svTokensLoading = _useRequestTokens2[1];
  const _useRequestTokens3 = useRequestTokens('operators'),
    _useRequestTokens4 = _slicedToArray(_useRequestTokens3, 2),
    opTokens = _useRequestTokens4[0],
    opTokensLoading = _useRequestTokens4[1];
  const _useRequestTokens5 = useRequestTokens('field-functions'),
    _useRequestTokens6 = _slicedToArray(_useRequestTokens5, 2),
    funTokens = _useRequestTokens6[0],
    funTokensLoading = _useRequestTokens6[1];
  const _useState = useState(`formula-lang-${nanoid(4)}`),
    _useState2 = _slicedToArray(_useState, 1),
    editorLanguage = _useState2[0];
  const _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    checkLoading = _useState4[0],
    setCheckLoading = _useState4[1];
  const formulaEditorRef = useRef(null);
  const _useState5 = useState(''),
    _useState6 = _slicedToArray(_useState5, 2),
    curFieldId = _useState6[0],
    setCurFieldId = _useState6[1];
  const _useState7 = useState(''),
    _useState8 = _slicedToArray(_useState7, 2),
    type = _useState8[0],
    setType = _useState8[1];
  const _useState9 = useState(null),
    _useState10 = _slicedToArray(_useState9, 2),
    formulaValidation = _useState10[0],
    setFormulaValidation = _useState10[1];
  const _useState11 = useState((_formulaMappingList$c = formulaMappingList.current) === null || _formulaMappingList$c === void 0 ? void 0 : _formulaMappingList$c.map(({
      meaning
    }) => meaning)),
    _useState12 = _slicedToArray(_useState11, 2),
    highLightBlocks = _useState12[0],
    setHighLightBlocks = _useState12[1];

  // 编辑器上次保存的值
  const _useState13 = useState(''),
    _useState14 = _slicedToArray(_useState13, 2),
    lastSavedata = _useState14[0],
    setLastSavedata = _useState14[1];
  const formulaDs = useMemo(() => new _DataSet({
    ...FormulaDS(isExtensionField, isFromDomain, customPrimaryKeyCode, boSourceType),
    events: {
      update: ({
        name,
        value,
        record
      }) => {
        if (name === 'resultType' && value) {
          setType(value);
          if (value === 'BigDecimal' && !(record !== null && record !== void 0 && record.get('digitalAccuracy'))) {
            record === null || record === void 0 ? void 0 : record.set('digitalAccuracy', 2);
          }
        }
        if (['formula', 'resultType'].includes(name)) {
          setFormulaValidation(null);
        }
      },
      load: ({
        dataSet
      }) => {
        var _dataSet$current;
        const lovCode = dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$current = dataSet.current) === null || _dataSet$current === void 0 ? void 0 : _dataSet$current.get('lovCode');
        if (lovCode) {
          getLovList(lovCode);
        }
      }
    }
  }), [isExtensionField, isFromDomain, customPrimaryKeyCode, isExtensionField, boSourceType]);
  useEffect(() => {
    formulaDs === null || formulaDs === void 0 ? void 0 : formulaDs.setState('extendFieldPrefixRule', extendFieldPrefixRule);
  }, [formulaDs, extendFieldPrefixRule]);
  const formDs = useMemo(() => new _DataSet(FormDS()), []);
  const valueListDs = useMemo(() => formulaDs.children.customOptionList, [isExtensionField, isEditMode]);
  const lovValuesDs = useMemo(() => formulaDs.children.lovValues, [isExtensionField, isEditMode]);

  // API业务对象不能建公式字段，不展示聚合类
  // const fixedFunTokens = useMemo(() => {
  //   const objTokens = { ...funTokens };
  //   if (physicalModelType === 'API') {
  //     delete objTokens['聚合类'];
  //     return objTokens;
  //   }
  //   return objTokens;
  // }, [funTokens]);

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
  }, [svTokens]);
  useDataSetEvents(formulaDs, 'update', ({
    name,
    value,
    record,
    dataSet
  }) => {
    var _dataSet$current3;
    if (['businessObjectFieldCode', 'extendFieldCode', 'templateFieldCode', 'inheritFieldCode'].includes(name) && value) {
      record === null || record === void 0 ? void 0 : record.set(name, extendFieldPrefixRule ? _upperFirst(_camelCase(value)) : _camelCase(value));
    }
    if (name === 'resultType' && value) {
      var _dataSet$current2;
      setType(value);
      if (!(record !== null && record !== void 0 && record.get('digitalAccuracy'))) {
        record === null || record === void 0 ? void 0 : record.set('digitalAccuracy', 2);
      }
      valueListDs === null || valueListDs === void 0 ? void 0 : valueListDs.deleteAll(false);
      lovValuesDs === null || lovValuesDs === void 0 ? void 0 : lovValuesDs.deleteAll(false);
      record === null || record === void 0 ? void 0 : record.set('valueList', '');
      if (value === 'Boolean' && (dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$current2 = dataSet.current) === null || _dataSet$current2 === void 0 ? void 0 : _dataSet$current2.get('optionSettings')) === '_custom') {
        valueListDs === null || valueListDs === void 0 ? void 0 : valueListDs.create({
          value: 1,
          meaning: {
            [getCurrentLanguage()]: '开启'
          }
        });
        valueListDs === null || valueListDs === void 0 ? void 0 : valueListDs.create({
          value: 0,
          meaning: {
            [getCurrentLanguage()]: '关闭'
          }
        });
      }
    }
    if (['formula', 'resultType'].includes(name)) {
      setFormulaValidation(null);
    }
    if (name === 'valueList' && value) {
      getLovList(value === null || value === void 0 ? void 0 : value.lovCode);
    }
    if (name === 'optionSettings' && value === '_custom' && (dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$current3 = dataSet.current) === null || _dataSet$current3 === void 0 ? void 0 : _dataSet$current3.get('resultType')) === 'Boolean') {
      valueListDs === null || valueListDs === void 0 ? void 0 : valueListDs.deleteAll(false);
      valueListDs === null || valueListDs === void 0 ? void 0 : valueListDs.create({
        value: 1,
        meaning: {
          [getCurrentLanguage()]: '开启'
        }
      });
      valueListDs === null || valueListDs === void 0 ? void 0 : valueListDs.create({
        value: 0,
        meaning: {
          [getCurrentLanguage()]: '关闭'
        }
      });
    }
  });

  // 手动获取值集
  const getLovList = async lovCode => {
    const res = await queryIdpValue(lovCode);
    if (getResponse(res)) {
      // if (!isTenant) {
      res.forEach(v => {
        Object.assign(v, {
          meaning: {
            [getCurrentLanguage()]: v.meaning
          }
        });
      });
      lovValuesDs.loadData(res);
      // }
    }
  };

  // const errorAndWarnList = [
  //   ...(formulaValidation?.errorList || []),
  //   ...(formulaValidation?.warnList || []),
  // ];

  // 客制化的数据初始化
  const init = initData => {
    var _codeTransfer, _formulaMappingList$c5, _initData$attributeJs, _formulaEditorRef$cur, _formulaEditorRef$cur2;
    const _ref = initData || {},
      _ref$referenceInfoLis = _ref.referenceInfoList,
      referenceInfoList = _ref$referenceInfoLis === void 0 ? [] : _ref$referenceInfoLis,
      _ref$formula = _ref.formula,
      formula = _ref$formula === void 0 ? '' : _ref$formula,
      formulaAnalyzeResult = _ref.formulaAnalyzeResult;
    const _ref2 = formulaAnalyzeResult || {},
      success = _ref2.success,
      _message = _ref2.message;
    if (!success && _message) {
      setFormulaValidation({
        effective: false,
        message: _message
      });
    }
    const transferList = [];
    // TODO: 获取到referenceList，然后去设置formulaMappingList
    referenceInfoList.forEach(item => {
      const vValue = item.businessObjectFieldCode || item.fieldFormula;
      const mValue = item.businessObjectFieldName;
      transferList.push({
        value: `${item.businessObjectCode}${vValue ? `.${vValue}` : ''}`,
        meaning: `${item.businessObjectName}${mValue ? `.${mValue}` : ''}`,
        formula: item.referenceFormula
      });
    });
    const desc = (_codeTransfer = codeTransfer(formula, transferList, 'value', 'meaning')) === null || _codeTransfer === void 0 ? void 0 : _codeTransfer.replace(/CURRENT_\w+?\(\)/g, $0 => {
      var _formulaMappingList$c2, _formulaMappingList$c3, _formulaMappingList$c4;
      const meaning = formulaMappingList === null || formulaMappingList === void 0 ? void 0 : (_formulaMappingList$c2 = formulaMappingList.current) === null || _formulaMappingList$c2 === void 0 ? void 0 : (_formulaMappingList$c3 = _formulaMappingList$c2.find) === null || _formulaMappingList$c3 === void 0 ? void 0 : (_formulaMappingList$c4 = _formulaMappingList$c3.call(_formulaMappingList$c2, item => item.value === $0)) === null || _formulaMappingList$c4 === void 0 ? void 0 : _formulaMappingList$c4.meaning;
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
        const vValue = t.businessObjectFieldCode || t.fieldFormula;
        const mValue = t.businessObjectFieldName;
        return {
          value: `${t.businessObjectCode}${vValue ? `.${vValue}` : ''}`,
          meaning: `${t.businessObjectName}${mValue ? `.${mValue}` : ''}`,
          formula: t.referenceFormula
        };
      });
      const curMeaning = codeTransfer(i.referenceFormula, tranList, 'value', 'meaning');
      formulaMappingList.current.push({
        meaning: curMeaning,
        value: i.referenceFormula
      });
    });
    setHighLightBlocks((_formulaMappingList$c5 = formulaMappingList.current) === null || _formulaMappingList$c5 === void 0 ? void 0 : _formulaMappingList$c5.map(({
      meaning
    }) => meaning));
    setType(initData === null || initData === void 0 ? void 0 : (_initData$attributeJs = initData.attributeJson) === null || _initData$attributeJs === void 0 ? void 0 : _initData$attributeJs.resultType);
    setCurFieldId(initData === null || initData === void 0 ? void 0 : initData.businessObjectFieldId);
    setLastSavedata(desc || formula);
    (_formulaEditorRef$cur = formulaEditorRef.current) === null || _formulaEditorRef$cur === void 0 ? void 0 : (_formulaEditorRef$cur2 = _formulaEditorRef$cur.setInitValue) === null || _formulaEditorRef$cur2 === void 0 ? void 0 : _formulaEditorRef$cur2.call(_formulaEditorRef$cur, desc || formula);
  };

  // 校验公式
  const checkFormula = async () => {
    var _formulaDs$current;
    if (!formulaEditorRef.current.checkMakers()) {
      return {
        effective: false,
        message: intl.get('hmde.bo.businessObject.expressionNone').d('表达式不能为空')
      };
    }
    const _ref3 = ((_formulaDs$current = formulaDs.current) === null || _formulaDs$current === void 0 ? void 0 : _formulaDs$current.toData()) || {},
      formula = _ref3.formula,
      resultType = _ref3.resultType;
    setCheckLoading(true);
    const res = await formulaExpressionCompile({
      businessObjectId,
      componentType: 'FORMULA',
      formula,
      resultType: [FieldComponentType.SINGLE_SELECT, FieldComponentType.MULTIPLE_SELECT].includes(resultType) ? 'String' : resultType
    }, {
      resultComponentType: typeMapConvert(resultType)
    });
    setCheckLoading(false);
    if (!getResponse(res)) {
      return {
        effective: false
      };
    }
    return {
      effective: res.effective,
      message: res.message
    };
  };

  // 维护需要暴露给父组件的api 一般是ds
  useImperativeHandle(props === null || props === void 0 ? void 0 : props.childrenComRef, () => ({
    formulaDs,
    // 务必维护和组件名称一致后缀加Ds 方便父组件调用
    lovValuesDs,
    customInitChild: init,
    async customValidator() {
      var _formulaDs$current2;
      const res = await ((_formulaDs$current2 = formulaDs.current) === null || _formulaDs$current2 === void 0 ? void 0 : _formulaDs$current2.validate());
      if (!res) {
        return false;
      }
      const validation = formulaValidation || (await checkFormula());
      if (validation.effective === false) {
        notification.error({
          message: intl.get('hmde.bo.businessObject.invalidExpression').d('表达式校验失败，请修改表达式内容')
        });
      }
      setFormulaValidation(validation);
      return validation.effective;
    }
  }));
  useEffect(() => {
    detailData && initData();
  }, [formulaDs, inheritFieldId, businessObjectFieldId, inheritId, detailData]);
  const initData = () => {
    setTimeout(() => {
      formulaDs === null || formulaDs === void 0 ? void 0 : formulaDs.loadData([detailData]);
      init === null || init === void 0 ? void 0 : init(detailData);
      formulaDs === null || formulaDs === void 0 ? void 0 : formulaDs.setState('tlsParams', {
        businessObjectFieldId,
        inheritFieldId: inheritFieldId || inheritId
      });
    }, 0);
  };
  const sqlModalSave = ({
    value
  }) => {
    var _formulaDs$current3, _value$replace, _value$replace$call$r, _value$replace$call;
    const formula = formulaDs === null || formulaDs === void 0 ? void 0 : (_formulaDs$current3 = formulaDs.current) === null || _formulaDs$current3 === void 0 ? void 0 : _formulaDs$current3.get('formula');
    const handleValue = (value === null || value === void 0 ? void 0 : (_value$replace = value.replace) === null || _value$replace === void 0 ? void 0 : (_value$replace$call$r = (_value$replace$call = _value$replace.call(value, /\r\n/g, ' ')).replace) === null || _value$replace$call$r === void 0 ? void 0 : _value$replace$call$r.call(_value$replace$call, /\s+/g, ' ')) || '';
    if (formula) {
      const msg1 = intl.get('hmde.bo.businessObject.expressTipMsg').d(`表达式内已存在函数COL_SUB_SELECT()，添加该函数后将清空函数COL_SUB_SELECT()，请确认是否添加？`);
      const msg2 = intl.get('hmde.bo.businessObject.expressTipMsg2').d(`添加该函数后将清空已有表达式，请确认是否添加？`);
      return _Modal.confirm({
        title: formula.indexOf('COL_SUB_SELECT(') > -1 ? msg1 : msg2
      }).then(res => {
        if (res === 'ok') {
          var _formulaDs$current4;
          formulaEditorRef.current.setInitValue(`COL_SUB_SELECT("${handleValue}")`);
          (_formulaDs$current4 = formulaDs.current) === null || _formulaDs$current4 === void 0 ? void 0 : _formulaDs$current4.set('formula', `COL_SUB_SELECT("${handleValue}")`);
          return true;
        }
        return false;
      });
    } else {
      var _formulaDs$current5;
      (_formulaDs$current5 = formulaDs.current) === null || _formulaDs$current5 === void 0 ? void 0 : _formulaDs$current5.set('formula', `COL_SUB_SELECT("${handleValue}")`);
      formulaEditorRef.current.setInitValue(` COL_SUB_SELECT("${handleValue}") `); // 不加这个，表达式组件不显示内容
      return true;
    }
  };

  // 插入聚合公式
  const handleCreatePolymerization = formula => {
    const polymerizationProps = {
      formula,
      curFieldId,
      businessObjectCode,
      businessObjectId,
      businessObjectName,
      onOk: handleOk
    };
    const sqlModalProps = {
      customTip: /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, intl.get('hmde.bo.businessObject.expressTipMsg3').d('支持系统变量，变量参数必须在CustomUserDetails中，变量格式为'), ' ', "#", '{userInfo.xxx}'), /*#__PURE__*/React.createElement("li", null, intl.get('hmde.bo.businessObject.expressTipMsg4').d('在子查询中可以使用'), " $", `{MASTER_TABLE_ALIAS}`, ' ', intl.get('hmde.bo.businessObject.expressTipMsg5').d('占位符获取到主表的别名')), /*#__PURE__*/React.createElement("li", null, intl.get('hmde.bo.businessObject.expressTipMsg6').d('参数必须使用 ? 或者'), " ", `{}`, ' ', intl.get('hmde.bo.businessObject.expressTipMsg7').d('占位符号'))),
      onOk: sqlModalSave
    };
    const children = formula === 'COL_SUB_SELECT' ? /*#__PURE__*/React.createElement(SqlModal, sqlModalProps) : /*#__PURE__*/React.createElement(PolymerizationFormula, polymerizationProps);
    return _Modal.open({
      key: _Modal.key(),
      title: intl.get('hmde.pd.processDefinition.function').d('函数'),
      drawer: false,
      closable: true,
      destroyOnClose: true,
      style: {
        width: 'calc((200% - 8px) / 3)',
        maxWidth: 957
      },
      children
    });
  };

  // 校验公式
  const handleCheckFormula = async () => {
    const validation = await checkFormula();
    if (validation !== null && validation !== void 0 && validation.effective) {
      _message2.success(intl.get('hmde.common.successValidation').d('校验成功'), 3, () => {}, 'top');
    }
    setFormulaValidation(validation);

    // if (isEmpty(validation.errorList) && isEmpty(validation.warnList)) {
    //   message.success(
    //     intl.get('hmde.common.successValidation').d('校验成功'),
    //     3,
    //     () => { },
    //     'top'
    //   );
    // } else {
    // }
  };

  /**
   * 编辑器change回调
   * @param {String} val 当前编辑器的值
   */
  const handleFormulaChange = val => {
    var _formulaDs$current6;
    const temp = codeTransfer(val, formulaMappingList.current, 'meaning', 'value');
    // const temp = NewCodeTransfer(val, formulaMappingList.current, 'formulaBriefName', 'formula');
    if (formulaDs !== null && formulaDs !== void 0 && (_formulaDs$current6 = formulaDs.current) !== null && _formulaDs$current6 !== void 0 && _formulaDs$current6.set) {
      formulaDs.current.set('formula', temp);
    }
  };
  const handleFormulaBlur = async () => {
    var _formulaDs$current7;
    await (formulaDs === null || formulaDs === void 0 ? void 0 : (_formulaDs$current7 = formulaDs.current) === null || _formulaDs$current7 === void 0 ? void 0 : _formulaDs$current7.validate());
  };

  /**
   * 获取drill数据，回写到editor
   * @param dataSet drill的dataSet
   */
  const handleOk = params => {
    var _formulaMappingList$c6;
    const _ref4 = params,
      value = _ref4.value,
      text = _ref4.text;
    formulaMappingList === null || formulaMappingList === void 0 ? void 0 : formulaMappingList.current.unshift({
      value,
      meaning: text
    });
    setHighLightBlocks((_formulaMappingList$c6 = formulaMappingList.current) === null || _formulaMappingList$c6 === void 0 ? void 0 : _formulaMappingList$c6.map(({
      meaning
    }) => meaning));
    formulaEditorRef.current.appendText(` ${text} `);
  };

  // 插入一个符号
  const handlePickToken = ({
    format,
    value,
    name
  }) => {
    const val = value || format;
    if (val.startsWith('COL_')) {
      handleCreatePolymerization(name);
    } else {
      formulaEditorRef.current.appendText(`${val} `);
    }
  };
  const drillRenderer = () => {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(DrillButton, {
      drillProps: {
        onOk: handleOk,
        name: 'field',
        selectObjectCheckFlag: true,
        businessObjectCode: businessObjectCode,
        isWriteBack: false,
        curFieldId,
        drillMainKeyType: EDrillMainKeyType.EXCLUDE_FIRST,
        showTooltip: false,
        initDrillParams: {
          drillPublishFlag: false
        },
        componentTypeList: getDrillFIeldType === null || getDrillFIeldType === void 0 ? void 0 : getDrillFIeldType(['FORMULA'])
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
  const getAddonBefore = useMemo(() => {
    return extendFieldPrefixRule || '';
  }, [extendFieldPrefixRule]);
  const formulaRenderer = () => {
    var _formulaDs$current8, _formulaEditorRef$cur3, _formulaEditorRef$cur4;
    const formulaEditorDisabled = disabled || boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode || isEditMode && isTenant && boSourceType !== 'TENANT' && !isExtensionField;
    return /*#__PURE__*/React.createElement(_Spin, {
      spinning: checkLoading
    }, (formulaDs === null || formulaDs === void 0 ? void 0 : (_formulaDs$current8 = formulaDs.current) === null || _formulaDs$current8 === void 0 ? void 0 : _formulaDs$current8.get('resultType')) === 'Boolean' && /*#__PURE__*/React.createElement(_Alert, {
      message: intl.get('hmde.bo.businessObject.switchTypeTips').d('表达式结果需为开关类型。'),
      type: "info",
      showIcon: true
    }), /*#__PURE__*/React.createElement("div", {
      className: styles['formula-editor']
    }, (formulaValidation === null || formulaValidation === void 0 ? void 0 : formulaValidation.effective) === false && /*#__PURE__*/React.createElement(_Alert, {
      style: {
        margin: '4px'
      },
      message: formulaValidation === null || formulaValidation === void 0 ? void 0 : formulaValidation.message,
      type: "error",
      showIcon: true
    }), /*#__PURE__*/React.createElement("div", {
      className: styles['config-form']
    }, /*#__PURE__*/React.createElement(_Form, {
      labelLayout: "none",
      dataSet: formDs
      // useColon={false}
      ,
      style: {
        width: '50%'
      },
      disabled: formulaEditorDisabled
    }, /*#__PURE__*/React.createElement(_Output, {
      // style={{ width: '25%' }}
      name: FormFieldNameTypes.FIELD,
      tooltip: 'none',
      renderer: drillRenderer
    })), /*#__PURE__*/React.createElement(ToolBars, {
      lastSavedata: lastSavedata,
      editorInstance: (_formulaEditorRef$cur3 = formulaEditorRef.current) === null || _formulaEditorRef$cur3 === void 0 ? void 0 : (_formulaEditorRef$cur4 = _formulaEditorRef$cur3.editorInstance) === null || _formulaEditorRef$cur4 === void 0 ? void 0 : _formulaEditorRef$cur4.current,
      reset: () => {
        var _formulaEditorRef$cur5, _formulaDs$current9;
        (_formulaEditorRef$cur5 = formulaEditorRef.current) === null || _formulaEditorRef$cur5 === void 0 ? void 0 : _formulaEditorRef$cur5.clear();
        (_formulaDs$current9 = formulaDs.current) === null || _formulaDs$current9 === void 0 ? void 0 : _formulaDs$current9.set('formula', '');
      },
      disabled: formulaEditorDisabled
    })), /*#__PURE__*/React.createElement(FormulaEditor, {
      ref: formulaEditorRef,
      autoSelectBlocks: highLightBlocks,
      highLightBlocks: highLightBlocks,
      disabled: formulaEditorDisabled,
      onBlur: handleFormulaBlur,
      onChange: handleFormulaChange,
      initLanguage: editorLanguage,
      suggestions: suggestions,
      handleCheckFormula: handleCheckFormula
    }), /*#__PURE__*/React.createElement("div", {
      className: styles['token-picker-container']
    }, /*#__PURE__*/React.createElement(NewTokenPicker, {
      descriptionPaneHidden: true,
      title: intl.get('hmde.common.systemVariables').d('系统变量'),
      disabled: formulaEditorDisabled,
      loading: svTokensLoading,
      nodes: svTokens,
      onTokenClick: handlePickToken
    }), /*#__PURE__*/React.createElement(NewTokenPicker, {
      descriptionPaneHidden: true,
      title: intl.get('hmde.bo.businessObject.formula.operator').d('运算符'),
      disabled: formulaEditorDisabled,
      loading: opTokensLoading,
      nodes: opTokens,
      onTokenClick: handlePickToken,
      showChineseName: true
    }), /*#__PURE__*/React.createElement(NewTokenPicker, {
      title: intl.get('hmde.bo.businessObject.functionList').d('函数列表'),
      disabled: formulaEditorDisabled,
      loading: funTokensLoading,
      nodes: funTokens,
      onTokenClick: handlePickToken,
      key: uuid()
    }))));
  };
  const openCreateValueList = ds => {
    _Modal.open({
      key: _Modal.key(),
      title: intl.get('hmde.bo.businessObject.valueList.create').d('值集定义'),
      border: false,
      autoCenter: true,
      children: /*#__PURE__*/React.createElement(LovDefineModal, {
        valueList: ds === null || ds === void 0 ? void 0 : ds.toData(),
        businessObjectCode: businessObjectCode,
        selectDs: formulaDs
      })
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Form, {
    dataSet: formulaDs,
    columns: 4
    // useColon={false}
    ,
    disabled: disabled || boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode,
    labelAlign: "left",
    className: styles['formula-form']
  }, !isFromDomain && !isExtensionField && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_IntlField, {
    name: "businessObjectFieldName",
    colSpan: 2,
    suffix: /*#__PURE__*/React.createElement(_Icon, {
      type: "language"
    }),
    placeholder: intl.get('hmde.bo.businessObject.enterthefieldname').d('请输入字段名称'),
    showLengthInfo: true
  }), isEditMode ? /*#__PURE__*/React.createElement(_Output, {
    name: "businessObjectFieldCode",
    colSpan: 2
  }) : /*#__PURE__*/React.createElement(_TextField, {
    name: "businessObjectFieldCode",
    colSpan: 2,
    placeholder: intl.get('hmde.bo.businessObject.enterthefieldcode').d('请输入字段编码'),
    addonBefore: getAddonBefore && /*#__PURE__*/React.createElement(_Tooltip, {
      title: getAddonBefore
    }, getAddonBefore),
    maxLength: 60 - getAddonBefore.length,
    showLengthInfo: true
  })), !isFromDomain && isExtensionField && isTenant && boSourceType !== 'TENANT' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_IntlField, {
    name: "inheritFieldName",
    colSpan: 2,
    suffix: /*#__PURE__*/React.createElement(_Icon, {
      type: "language"
    }),
    placeholder: intl.get('hmde.bo.businessObject.enterthefieldname').d('请输入字段名称')
  }), isEditMode ? /*#__PURE__*/React.createElement(_Output, {
    name: "inheritFieldCode",
    colSpan: 2
  }) : /*#__PURE__*/React.createElement(_TextField, {
    name: "inheritFieldCode",
    colSpan: 2,
    placeholder: intl.get('hmde.bo.businessObject.enterthefieldcode').d('请输入字段编码'),
    addonBefore: getAddonBefore && /*#__PURE__*/React.createElement(_Tooltip, {
      title: getAddonBefore
    }, getAddonBefore),
    maxLength: 60 - getAddonBefore.length,
    showLengthInfo: true
  })), isFromDomain && !isExtensionField && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_IntlField, {
    name: "templateFieldName",
    colSpan: 2,
    suffix: /*#__PURE__*/React.createElement(_Icon, {
      type: "language"
    }),
    placeholder: intl.get('hmde.bo.businessObject.enterthefieldname').d('请输入字段名称')
  }), isEditMode ? /*#__PURE__*/React.createElement(_Output, {
    name: "templateFieldCode",
    colSpan: 2
  }) : /*#__PURE__*/React.createElement(_TextField, {
    name: "templateFieldCode",
    colSpan: 2,
    placeholder: intl.get('hmde.bo.businessObject.enterthefieldcode').d('请输入字段编码'),
    addonBefore: getAddonBefore && /*#__PURE__*/React.createElement(_Tooltip, {
      title: getAddonBefore
    }, getAddonBefore),
    maxLength: 60 - getAddonBefore.length,
    showLengthInfo: true
  })), /*#__PURE__*/React.createElement(_Select, {
    name: "resultType",
    colSpan: 2,
    placeholder: intl.get('hmde.bo.businessObject.chooseResultType').d('请选择返回值类型'),
    disabled: isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField
  }), ['BigDecimal'].includes(type) && /*#__PURE__*/React.createElement(_NumberField, {
    colSpan: 2,
    name: "digitalAccuracy",
    disabled: isEditMode && isTenant && boSourceType !== 'TENANT' && !isExtensionField,
    placeholder: intl.get('hmde.bo.businessObject.enterAccuracy').d('请输入精度')
  }), [FieldComponentType.SINGLE_SELECT, FieldComponentType.MULTIPLE_SELECT, 'Boolean'].includes(formulaDs === null || formulaDs === void 0 ? void 0 : (_formulaDs$current10 = formulaDs.current) === null || _formulaDs$current10 === void 0 ? void 0 : _formulaDs$current10.get('resultType')) && /*#__PURE__*/React.createElement(_SelectBox, {
    name: "optionSettings",
    colSpan: 2,
    disabled: isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField
  }, /*#__PURE__*/React.createElement(_SelectBox.Option, {
    value: "_custom"
  }, intl.get('hmde.common.custom').d('自定义')), /*#__PURE__*/React.createElement(_SelectBox.Option, {
    value: "_valueList"
  }, intl.get('hmde.common.valueList').d('值集')))), [FieldComponentType.SINGLE_SELECT, FieldComponentType.MULTIPLE_SELECT, 'Boolean'].includes(formulaDs === null || formulaDs === void 0 ? void 0 : (_formulaDs$current11 = formulaDs.current) === null || _formulaDs$current11 === void 0 ? void 0 : _formulaDs$current11.get('resultType')) && (((_formulaDs$current12 = formulaDs.current) === null || _formulaDs$current12 === void 0 ? void 0 : _formulaDs$current12.get('optionSettings')) === '_valueList' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: styles['row-valueList']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['row-valueList-lov']
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 58
    }
  }, intl.get('hmde.common.valueList').d('值集')), /*#__PURE__*/React.createElement(_Lov, {
    style: {
      flex: 1
    },
    dataSet: formulaDs,
    name: "valueList",
    clearButton: false,
    noCache: true,
    disabled: isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField
  })), /*#__PURE__*/React.createElement("div", {
    className: styles['valueList-operate']
  }, /*#__PURE__*/React.createElement(_Button, {
    onClick: () => openCreateValueList(),
    disabled: disabled || boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField,
    icon: "add",
    funcType: "flat"
  }, intl.get('hmde.bo.businessObject.valueList.add').d('新建值集')))), !isTenant && ((_formulaDs$current13 = formulaDs.current) === null || _formulaDs$current13 === void 0 ? void 0 : _formulaDs$current13.get('lovCode')) && /*#__PURE__*/React.createElement("div", {
    className: styles['row-custom']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['row-custom-header']
  }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.valueListData').d('值集数据')), /*#__PURE__*/React.createElement(_Button, {
    onClick: () => lovValuesDs.create({}),
    icon: "add",
    funcType: "flat",
    hidden: (formulaDs === null || formulaDs === void 0 ? void 0 : (_formulaDs$current14 = formulaDs.current) === null || _formulaDs$current14 === void 0 ? void 0 : _formulaDs$current14.get('resultType')) === 'Boolean'
  }, intl.get('hmde.bo.businessObject.createCodeField').d('新建编码字段'))), /*#__PURE__*/React.createElement(LovValuesList, {
    operateHeaderFlag: false,
    valueListDs: lovValuesDs,
    resultType: formulaDs === null || formulaDs === void 0 ? void 0 : (_formulaDs$current15 = formulaDs.current) === null || _formulaDs$current15 === void 0 ? void 0 : _formulaDs$current15.get('resultType')
  }))) : /*#__PURE__*/React.createElement("div", {
    className: styles['row-custom']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['row-custom-header']
  }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.custom').d('自定义')), (formulaDs === null || formulaDs === void 0 ? void 0 : (_formulaDs$current16 = formulaDs.current) === null || _formulaDs$current16 === void 0 ? void 0 : _formulaDs$current16.get('resultType')) !== 'Boolean' && /*#__PURE__*/React.createElement(_Button, {
    onClick: () => valueListDs.create({}),
    disabled: isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField,
    funcType: "flat",
    icon: "add"
  }, intl.get('hmde.bo.businessObject.addCustomOptions').d('新建自定义选项'))), /*#__PURE__*/React.createElement(LovValuesList, {
    operateHeaderFlag: false,
    valueListDs: valueListDs,
    disabled: isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField,
    resultType: formulaDs === null || formulaDs === void 0 ? void 0 : (_formulaDs$current17 = formulaDs.current) === null || _formulaDs$current17 === void 0 ? void 0 : _formulaDs$current17.get('resultType')
  }), /*#__PURE__*/React.createElement("div", {
    className: styles['row-custom-footer']
  }, /*#__PURE__*/React.createElement("p", null, intl.get('hmde.bo.businessObject.valueList.custom.create.help').d('生成独立值集操作会将自定义的选项内容转化为独立值集，执行后选项会跳转到值集选项，字段选择创建的值集。')), /*#__PURE__*/React.createElement("a", {
    disabled: disabled || boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField,
    onClick: async () => openCreateValueList(valueListDs)
  }, intl.get('hmde.bo.businessObject.valueList.custom.create').d('生成独立值集'))))), /*#__PURE__*/React.createElement(_Form, {
    dataSet: formulaDs,
    columns: 4
    // useColon={false}
    ,
    disabled: disabled || boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode || isEditMode && isTenant && boSourceType !== 'TENANT' && !isExtensionField,
    labelAlign: "left"
  }, /*#__PURE__*/React.createElement(_Output, {
    name: "formula",
    tooltip: 'none',
    colSpan: 4,
    renderer: formulaRenderer
  })), /*#__PURE__*/React.createElement(SectionTitle, {
    title: intl.get('hmde.bo.businessObject.otherprops').d('其他属性')
  }), /*#__PURE__*/React.createElement(_Form, {
    dataSet: formulaDs,
    columns: 4
    // useColon={false}
    ,
    disabled: disabled || boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode,
    labelAlign: "left"
  }, /*#__PURE__*/React.createElement(_Output, {
    name: "helpText",
    key: "helpText",
    colSpan: 2,
    renderer: ({
      record
    }) => {
      return /*#__PURE__*/React.createElement(MultiIntlField, {
        name: "helpText",
        label: intl.get('hmde.common.helpText').d('帮助文本'),
        record: record,
        init: record === null || record === void 0 ? void 0 : record.get('helpText'),
        textFieldStyle: {
          height: '85px'
        },
        disabled: boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField
      });
    }
  }), /*#__PURE__*/React.createElement(_IntlField, {
    name: "remark",
    colSpan: 2,
    type: "multipleLine",
    style: {
      height: '85px'
    },
    suffix: /*#__PURE__*/React.createElement(_Icon, {
      type: "language"
    }),
    disabled: isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField,
    placeholder: intl.get('hmde.common.remark.placeholder').d('请输入描述')
  }), isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField ? /*#__PURE__*/React.createElement(_Switch, {
    key: "exportableFlag",
    name: "exportableFlag",
    disabled: true
  }) : /*#__PURE__*/React.createElement(_Output, {
    name: "exportableFlag",
    key: "exportableFlag",
    style: {
      border: 'none'
    },
    renderer: ({
      record
    }) => {
      return /*#__PURE__*/React.createElement(_Popconfirm, {
        title: renderPopConfirmTitle(record !== null && record !== void 0 && record.get('exportableFlag') ? intl.get('hmde.bo.businessObject.exportableFlag.closetip').d('关闭开关并发布后，该字段的数据将不允许导出，请确认是否关闭？') : intl.get('hmde.bo.businessObject.exportableFlag.opentip').d('开启开关并发布后，该字段的数据将允许导出，请确认是否开启？'), record !== null && record !== void 0 && record.get('exportableFlag') ? intl.get('hmde.bo.businessObject.isCose').d('是否关闭') : intl.get('hmde.bo.businessObject.isOpen').d('是否开启')),
        okText: intl.get('hmde.common.button.ensure').d('确认'),
        cancelText: intl.get('hmde.common.button.cancel').d('取消'),
        onConfirm: () => record === null || record === void 0 ? void 0 : record.set('exportableFlag', !(record !== null && record !== void 0 && record.get('exportableFlag')))
      }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(_Switch, {
        name: "exportableFlag",
        readOnly: true
      })));
    }
  })));
}
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(Index));