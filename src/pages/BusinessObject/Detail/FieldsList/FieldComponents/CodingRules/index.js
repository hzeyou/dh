import _Popconfirm from "@hzero-front-ui/c7n-ui/lib/Popconfirm";
import _Switch from "@hzero-front-ui/c7n-ui/lib/SwitchPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _SelectBox from "@hzero-front-ui/c7n-ui/lib/SelectBoxPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _NumberField from "@hzero-front-ui/c7n-ui/lib/NumberFieldPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _Lov from "@hzero-front-ui/c7n-ui/lib/LovPro";
import _IntlField from "@hzero-front-ui/c7n-ui/lib/IntlFieldPro";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _snakeCase from "lodash/snakeCase";
import _upperFirst from "lodash/upperFirst";
import _camelCase from "lodash/camelCase";
import _isEmpty from "lodash/isEmpty";
// 下拉单选/多选组件
import React, { useMemo, useImperativeHandle, useState, useEffect } from 'react';
import notification from 'utils/notification';
import { LabelLayout, LabelAlign } from 'choerodon-ui/pro/lib/form/enum';
import { observer } from 'mobx-react-lite';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { isTenantRoleLevel, getCurrentOrganizationId } from 'utils/utils';
import { IntlType } from 'choerodon-ui/pro/lib/intl-field/enum';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import MultiIntlField from "hzero-front-hmde/lib/businessComponents/MultiIntlField";
import LabelTitleRender from "hzero-front-hmde/lib/businessComponents/LabelTitleRender";
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import SectionTitle from "hzero-front-apaas/lib/components/SectionTitle";
import { renderPopConfirmTitle } from "hzero-front-apaas/lib/utils/render";
import CodeRulesList from "./CodeRulesList";
import CodingRulesDS, { lovDS } from "./CodingRulesDS";
import styles from "./index.less?modules";
const isTenant = isTenantRoleLevel();
const currentTenantId = getCurrentOrganizationId();
const Option = _Select.Option;
const SEQUENCE = 'SEQUENCE',
  // 流水号
  CONSTANT = 'CONSTANT',
  // 固定字符
  VARIABLE = 'VARIABLE',
  // 变量
  UUID = 'UUID',
  // 随机变量uuid
  DATE // 日期
  = 'DATE';
const ruleMap = {
  [SEQUENCE]: intl.get('hmde.bo.businessObject.codingRule.serialNumber').d('流水号'),
  [CONSTANT]: intl.get('hmde.bo.businessObject.codingRule.fieldString').d('固定字符'),
  [VARIABLE]: intl.get('hmde.bo.businessObject.codingRule.variable').d('变量'),
  [UUID]: intl.get('hmde.bo.businessObject.codingRule.uuid').d('随机唯一编码 UUID'),
  [DATE]: intl.get('hmde.bo.businessObject.codingRule.date').d('添加日期')
};
const titleMap = () => ({
  [SEQUENCE]: intl.get('hmde.bo.businessObject.digit').d('位数'),
  [CONSTANT]: intl.get('hmde.common.fixedValue').d('固定值'),
  [VARIABLE]: intl.get('hmde.bo.businessObject.variableValue').d('变量值'),
  [UUID]: intl.get('hmde.bo.businessObject.digit').d('位数'),
  [DATE]: intl.get('hmde.bo.businessObject.dateFormat').d('日期格式')
});

// 处理回显数据
const dealRuleData = item => {
  Object.assign(item, {
    ruleName: ruleMap[item.fieldType],
    firstInputTitle: titleMap()[item.fieldType],
    addRuleList: item.fieldType
  });
  switch (item.fieldType) {
    case SEQUENCE:
      // 流水号
      Object.assign(item, {
        secondInputTitle: intl.get('hmde.bo.businessObject.initialFlow').d('起始流水'),
        thirdInputTitle: intl.get('hmde.bo.businessObject.resetFrequency').d('重置频率'),
        firstInput: item === null || item === void 0 ? void 0 : item.seqLength,
        secondInput: item === null || item === void 0 ? void 0 : item.startValue,
        thirdInput: item === null || item === void 0 ? void 0 : item.resetFrequency
      });
      return item;
    case CONSTANT:
      // 固定字符串
      Object.assign(item, {
        firstInput: item === null || item === void 0 ? void 0 : item.fieldValue
      });
      return item;
    case VARIABLE:
      // 变量
      Object.assign(item, {
        firstInputTitle: intl.get('hmde.bo.businessObject.variableKey').d('段值'),
        secondInputTitle: intl.get('hmde.bo.businessObject.variableType').d('变量类型'),
        thirdInputTitle: titleMap()[item.fieldType],
        firstInput: item === null || item === void 0 ? void 0 : item.variableKey,
        secondInput: item === null || item === void 0 ? void 0 : item.variableType,
        thirdInput: item === null || item === void 0 ? void 0 : item.fieldValue
      });
      return item;
    case UUID:
      // 随机变量
      Object.assign(item, {
        firstInput: item === null || item === void 0 ? void 0 : item.seqLength
      });
      return item;
    case DATE:
      // 日期
      Object.assign(item, {
        firstInput: item === null || item === void 0 ? void 0 : item.dateMask
      });
      return item;
    default:
      return item;
  }
};
function Index(props) {
  var _CodingRulesDs$curren10, _CodingRulesDs$curren11, _ruleFormDs$current3, _CodingRulesDs$curren12, _CodingRulesDs$curren13, _ruleFormDs$current4, _CodingRulesDs$curren14, _CodingRulesDs$curren15, _CodingRulesDs$curren16, _ruleFormDs$current5, _CodingRulesDs$curren17, _CodingRulesDs$curren18, _CodingRulesDs$curren19;
  const selectedExampleInfo = props.selectedExampleInfo,
    isExtensionField = props.isExtensionField,
    isEditMode = props.isEditMode,
    businessObjectId = props.businessObjectId,
    businessObjectCode = props.businessObjectCode,
    customPrimaryKeyCode = props.customPrimaryKeyCode,
    disabled = props.disabled,
    isEditCurField = props.isEditCurField,
    boSourceType = props.boSourceType,
    domainEnabledFlag = props.domainEnabledFlag,
    extendFieldCreatedFlag = props.extendFieldCreatedFlag,
    extendFieldPrefixRule = props.extendFieldPrefixRule,
    _props$isApiCustomTyp = props.isApiCustomType,
    isApiCustomType = _props$isApiCustomTyp === void 0 ? false : _props$isApiCustomTyp,
    fastCreateEnter = props.fastCreateEnter,
    detailData = props.detailData,
    inheritFieldId = props.inheritFieldId,
    businessObjectFieldId = props.businessObjectFieldId,
    inheritId = props.inheritId,
    _props$physicalModelT = props.physicalModelType,
    physicalModelType = _props$physicalModelT === void 0 ? 'TABLE' : _props$physicalModelT;
  const _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    curFieldCode = _useState2[0],
    setCurFieldCode = _useState2[1];
  const _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    cantEditOtherTenant = _useState4[0],
    setCantEditOtherTenant = _useState4[1];
  const _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    selectRuleFlag = _useState6[0],
    setSelectRuleFlag = _useState6[1];
  const _useState7 = useState(false),
    _useState8 = _slicedToArray(_useState7, 2),
    changeRule = _useState8[0],
    setChangeRule = _useState8[1];
  // const resetStatusRef: any = useRef<boolean>(false);
  const CodingRulesDs = useMemo(() => new _DataSet(CodingRulesDS({
    isExtensionField,
    isEditMode,
    customPrimaryKeyCode,
    componentType: selectedExampleInfo === null || selectedExampleInfo === void 0 ? void 0 : selectedExampleInfo.value,
    businessObjectId,
    disabled,
    boSourceType,
    extendFieldCreatedFlag,
    isApiCustomType
  })), [isTenant, isEditMode, isExtensionField, selectedExampleInfo === null || selectedExampleInfo === void 0 ? void 0 : selectedExampleInfo.value, businessObjectId, customPrimaryKeyCode, disabled, boSourceType]);
  // 已有编码规则
  const ruleListDs = CodingRulesDs.children.ruleListDS;
  const ruleFormDs = CodingRulesDs.children.ruleFormDS;
  useEffect(() => {
    if (!isEditMode) {
      ruleListDs.loadData([{
        addRuleList: {
          value: 'DATE',
          meaning: intl.get(`hmde.common.date`).d('日期'),
          orderSeq: 0,
          enabledFlag: 1
        },
        dateMask: 'yyyyMMdd',
        fieldType: 'DATE',
        firstInput: 'yyyyMMdd',
        firstInputTitle: intl.get('hmde.bo.businessObject.dateFormat').d('日期格式'),
        orderSeq: 1
      }, {
        addRuleList: {
          value: 'SEQUENCE',
          meaning: intl.get('hmde.bo.businessObject.codingRule.serialNumber').d('流水号'),
          orderSeq: 0,
          enabledFlag: 1
        },
        encryptedFlag: 0,
        fieldType: 'SEQUENCE',
        firstInput: 3,
        firstInputTitle: intl.get('hmde.bo.businessObject.digit').d('位数'),
        orderSeq: 2,
        resetFrequency: 'DAY',
        secondInput: 0,
        secondInputTitle: intl.get('hmde.bo.businessObject.initialFlow').d('起始流水'),
        seqLength: 3,
        startValue: 0,
        thirdInput: 'DAY',
        thirdInputTitle: intl.get('hmde.bo.businessObject.resetFrequency').d('重置频率')
      }]);
      ruleFormDs === null || ruleFormDs === void 0 ? void 0 : ruleFormDs.loadData([{
        sequenceIsolationLevel: 'GLOBAL'
      }]);
    }
  }, []);

  // 选择编码规则ds
  const lovDs = useMemo(() => new _DataSet(lovDS()), [ruleListDs, ruleFormDs]);
  const lovDsUpdate = async ({
    name,
    value,
    dataSet
  }) => {
    if (name === 'selectCodeRule') {
      var _res$ruleDetailVOList, _res$ruleDetailVOList2, _CodingRulesDs$curren;
      if (!value) {
        ruleFormDs.loadData([]);
        ruleListDs.loadData([]);
        setCantEditOtherTenant(false);
        setSelectRuleFlag(false);
        return;
      }
      if (isTenant && boSourceType !== 'TENANT') {
        if ((value === null || value === void 0 ? void 0 : value.tenantId) !== currentTenantId) {
          setCantEditOtherTenant(true);
        } else {
          setCantEditOtherTenant(false);
        }
      }
      dataSet.setQueryParameter('ruleCode', value === null || value === void 0 ? void 0 : value.ruleCode);
      if (!isTenant) {
        dataSet.setQueryParameter('tenantId', value === null || value === void 0 ? void 0 : value.tenantId);
      }
      const res = await dataSet.query();
      const formData = {
        ruleId: res.ruleId,
        // useFlag: !!res.useFlag,
        useFlag: false,
        tenantId: res.tenantId,
        ruleCode: res.ruleCode,
        ruleName: res.ruleName,
        sequenceIsolationLevel: res.sequenceIsolationLevel || 'TENANT'
      };
      const _res = res === null || res === void 0 ? void 0 : (_res$ruleDetailVOList = res.ruleDetailVOList) === null || _res$ruleDetailVOList === void 0 ? void 0 : (_res$ruleDetailVOList2 = _res$ruleDetailVOList.map) === null || _res$ruleDetailVOList2 === void 0 ? void 0 : _res$ruleDetailVOList2.call(_res$ruleDetailVOList, i => dealRuleData(i));
      const codeRuleData = (_CodingRulesDs$curren = CodingRulesDs.current) === null || _CodingRulesDs$curren === void 0 ? void 0 : _CodingRulesDs$curren.toData();

      // toData 会自动加上前缀这里还需要手动去除一下
      if (extendFieldPrefixRule && codeRuleData.businessObjectFieldCode) {
        codeRuleData.businessObjectFieldCode = codeRuleData.businessObjectFieldCode.replace(extendFieldPrefixRule, '');
      }
      const data = {
        ...codeRuleData,
        ruleFormDS: [formData],
        ruleListDS: _res,
        // useFlag: !!res.useFlag,
        useFlag: false // 更换就刷新规则有没有被使用的状态
      };
      setSelectRuleFlag(true);
      // eslint-disable-next-line no-unused-expressions
      CodingRulesDs === null || CodingRulesDs === void 0 ? void 0 : CodingRulesDs.loadData([data]);
      // loadData方法会改变dataset的status，不进行数据校验
      Object.assign(CodingRulesDs.current || {}, {
        status: 'update'
      });
    }
  };
  React.useEffect(() => {
    lovDs.addEventListener('update', lovDsUpdate);
    return () => {
      lovDs.removeEventListener('update', lovDsUpdate);
    };
  }, [lovDs]);

  // CodingRulesDs 更新
  const update = ({
    name,
    value,
    record
  }) => {
    if (['businessObjectFieldCode', 'extendFieldCode', 'templateFieldCode', 'inheritFieldCode'].includes(name) && value) {
      // record?.set(name, camelCase(value));
      record === null || record === void 0 ? void 0 : record.set(name, extendFieldPrefixRule ? _upperFirst(_camelCase(value)) : _camelCase(value));
    }
    if (name === 'optionSettings') {
      var _CodingRulesDs$curren2;
      ruleFormDs.loadData([{}]);
      ruleListDs.loadData([]);
      ruleFormDs === null || ruleFormDs === void 0 ? void 0 : ruleFormDs.setState('ruleNameEditFlag', false);
      ruleFormDs === null || ruleFormDs === void 0 ? void 0 : ruleFormDs.setState('ruleCodeEditFlag', false);
      lovDs.removeAll();
      lovDs.create({});
      setSelectRuleFlag(false);
      setCantEditOtherTenant(false);
      // eslint-disable-next-line no-unused-expressions
      (_CodingRulesDs$curren2 = CodingRulesDs.current) === null || _CodingRulesDs$curren2 === void 0 ? void 0 : _CodingRulesDs$curren2.set('useFlag', false);
    }
    if ((record === null || record === void 0 ? void 0 : record.get('optionSettings')) === '_createCodeRule') {
      if (['businessObjectFieldName', 'inheritFieldName'].includes(name) && !(ruleFormDs !== null && ruleFormDs !== void 0 && ruleFormDs.getState('ruleNameEditFlag'))) {
        var _ruleFormDs$current, _value$substring;
        ruleFormDs === null || ruleFormDs === void 0 ? void 0 : (_ruleFormDs$current = ruleFormDs.current) === null || _ruleFormDs$current === void 0 ? void 0 : _ruleFormDs$current.init('ruleName', value === null || value === void 0 ? void 0 : (_value$substring = value.substring) === null || _value$substring === void 0 ? void 0 : _value$substring.call(value, 0, 60));
      }
      if (['businessObjectFieldCode', 'inheritFieldCode'].includes(name) && !(ruleFormDs !== null && ruleFormDs !== void 0 && ruleFormDs.getState('ruleCodeEditFlag'))) {
        var _ruleFormDs$current2, _snakeCase2, _snakeCase2$substring;
        ruleFormDs === null || ruleFormDs === void 0 ? void 0 : (_ruleFormDs$current2 = ruleFormDs.current) === null || _ruleFormDs$current2 === void 0 ? void 0 : _ruleFormDs$current2.init('ruleCode', (_snakeCase2 = _snakeCase(extendFieldPrefixRule ? `${businessObjectCode}_${extendFieldPrefixRule}_${value}` : `${businessObjectCode}_${value}`)) === null || _snakeCase2 === void 0 ? void 0 : (_snakeCase2$substring = _snakeCase2.substring) === null || _snakeCase2$substring === void 0 ? void 0 : _snakeCase2$substring.call(_snakeCase2, 0, 30));
      }
    }
  };
  useDataSetEvents(ruleFormDs, 'update', ({
    name
  }) => {
    if (name === 'ruleName') {
      ruleFormDs === null || ruleFormDs === void 0 ? void 0 : ruleFormDs.setState('ruleNameEditFlag', true);
    }
    if (name === 'ruleCode') {
      ruleFormDs === null || ruleFormDs === void 0 ? void 0 : ruleFormDs.setState('ruleCodeEditFlag', true);
    }
  });
  React.useEffect(() => {
    CodingRulesDs === null || CodingRulesDs === void 0 ? void 0 : CodingRulesDs.setState('extendFieldPrefixRule', extendFieldPrefixRule);
  }, [CodingRulesDs, extendFieldPrefixRule]);
  React.useEffect(() => {
    CodingRulesDs.addEventListener('update', update);
    return () => {
      CodingRulesDs.removeEventListener('update', update);
    };
  }, [CodingRulesDs]);

  // 保存取数据
  const getFieldsValue = async (_businessObjectFieldId, _detailData) => {
    var _CodingRulesDs$curren3;
    await (lovDs === null || lovDs === void 0 ? void 0 : lovDs.validate());
    if (await ((_CodingRulesDs$curren3 = CodingRulesDs.current) === null || _CodingRulesDs$curren3 === void 0 ? void 0 : _CodingRulesDs$curren3.validate())) {
      var _CodingRulesDs$curren4, _formValues$attribute;
      const formValues = (_CodingRulesDs$curren4 = CodingRulesDs.current) === null || _CodingRulesDs$curren4 === void 0 ? void 0 : _CodingRulesDs$curren4.toData();
      const ruleFormDS = formValues.ruleFormDS,
        ruleListDS = formValues.ruleListDS;
      let i = 1;
      // 重置变量的variableKey
      ruleListDS.forEach(item => {
        if ((item === null || item === void 0 ? void 0 : item.fieldType) === 'VARIABLE') {
          Object.assign(item, {
            variableKey: `variable${i}`
          });
          i++;
        }
      });
      const ruleFormValue = ruleFormDS[0];
      // 创建字段
      if (!_businessObjectFieldId && !inheritFieldId) {
        if (_isEmpty(ruleListDS)) {
          notification.error({
            message: intl.get('hmde.common.errorMes').d('错误信息'),
            description: intl.get('hmde.bo.businessObject.codingRuleError').d('编码规则不能为空，请先添加编码规则后重试')
          });
          return;
        }
        Object.assign(formValues, {
          codeRuleVO: {
            ruleId: ruleFormValue === null || ruleFormValue === void 0 ? void 0 : ruleFormValue.ruleId,
            useFlag: ruleFormValue === null || ruleFormValue === void 0 ? void 0 : ruleFormValue.useFlag,
            tenantId: ruleFormValue === null || ruleFormValue === void 0 ? void 0 : ruleFormValue.tenantId,
            ruleName: ruleFormValue === null || ruleFormValue === void 0 ? void 0 : ruleFormValue.ruleName,
            ruleDetailVOList: ruleListDS,
            _status: 'create'
          },
          ruleCode: ruleFormValue === null || ruleFormValue === void 0 ? void 0 : ruleFormValue.ruleCode,
          // 规则编码
          sequenceIsolationLevel: ruleFormValue === null || ruleFormValue === void 0 ? void 0 : ruleFormValue.sequenceIsolationLevel,
          // 流水号规则
          isolationVariables: ruleFormValue === null || ruleFormValue === void 0 ? void 0 : ruleFormValue.isolationVariables // 流水号规则变量
        });
      } else if (changeRule) {
        Object.assign(formValues, {
          // ..._detailData?.codeRuleVO,
          ...formValues,
          codeRuleVO: {
            // ..._detailData?.codeRuleVO,
            ...ruleFormValue,
            ruleDetailVOList: ruleListDS,
            _status: 'create'
          },
          ruleCode: ruleFormValue.ruleCode,
          // 规则编码
          sequenceIsolationLevel: ruleFormValue === null || ruleFormValue === void 0 ? void 0 : ruleFormValue.sequenceIsolationLevel,
          // 流水号规则
          isolationVariables: ruleFormValue === null || ruleFormValue === void 0 ? void 0 : ruleFormValue.isolationVariables // 流水号规则变量
        });
      } else {
        Object.assign(formValues, {
          ...(changeRule ? {} : _detailData === null || _detailData === void 0 ? void 0 : _detailData.codeRuleVO),
          ...formValues,
          codeRuleVO: {
            ...(_detailData === null || _detailData === void 0 ? void 0 : _detailData.codeRuleVO),
            ...ruleFormValue,
            ruleDetailVOList: ruleListDS,
            _status: 'update'
          },
          ruleCode: (_detailData === null || _detailData === void 0 ? void 0 : _detailData.ruleCode) || ruleFormValue.ruleCode,
          // 规则编码
          sequenceIsolationLevel: ruleFormValue === null || ruleFormValue === void 0 ? void 0 : ruleFormValue.sequenceIsolationLevel,
          // 流水号规则
          isolationVariables: ruleFormValue === null || ruleFormValue === void 0 ? void 0 : ruleFormValue.isolationVariables // 流水号规则变量
        });
      }
      (_formValues$attribute = formValues.attributeJson) === null || _formValues$attribute === void 0 ? true : delete _formValues$attribute.optionSettings;
      return formValues;
    }
  };

  // 维护需要暴露给父组件的api 一般是ds
  useImperativeHandle(props === null || props === void 0 ? void 0 : props.childrenComRef, () => ({
    CodingRulesDs,
    // 务必维护和组件名称一致后缀加Ds 方便父组件调用
    getAttributeJson,
    customInitChild,
    getFieldsValue
  }), [CodingRulesDs, changeRule]);

  // 初始化
  const customInitChild = initData => {
    var _initData$codeRuleVO, _initData$codeRuleVO2, _initData$codeRuleVO3, _initData$codeRuleVO4;
    const formData = {
      ruleName: (initData === null || initData === void 0 ? void 0 : (_initData$codeRuleVO = initData.codeRuleVO) === null || _initData$codeRuleVO === void 0 ? void 0 : _initData$codeRuleVO.ruleName) || (initData === null || initData === void 0 ? void 0 : initData.ruleName),
      ruleCode: (initData === null || initData === void 0 ? void 0 : (_initData$codeRuleVO2 = initData.codeRuleVO) === null || _initData$codeRuleVO2 === void 0 ? void 0 : _initData$codeRuleVO2.ruleCode) || (initData === null || initData === void 0 ? void 0 : initData.ruleCode),
      sequenceIsolationLevel: initData === null || initData === void 0 ? void 0 : initData.sequenceIsolationLevel,
      isolationVariables: initData === null || initData === void 0 ? void 0 : initData.isolationVariables
    };
    const valueList = initData === null || initData === void 0 ? void 0 : (_initData$codeRuleVO3 = initData.codeRuleVO) === null || _initData$codeRuleVO3 === void 0 ? void 0 : _initData$codeRuleVO3.ruleDetailVOList.map(i => dealRuleData(i));
    const data = {
      ...initData,
      useFlag: initData === null || initData === void 0 ? void 0 : (_initData$codeRuleVO4 = initData.codeRuleVO) === null || _initData$codeRuleVO4 === void 0 ? void 0 : _initData$codeRuleVO4.useFlag,
      optionSettings: initData.optionSettings || '_exitCodeRule',
      ruleFormDS: [formData],
      ruleListDS: valueList
    };
    setChangeRule(false);
    if (fastCreateEnter || isApiCustomType) {
      var _initData$codeRuleVO5, _initData$codeRuleVO6;
      lovDs === null || lovDs === void 0 ? void 0 : lovDs.create({
        ruleName: (initData === null || initData === void 0 ? void 0 : (_initData$codeRuleVO5 = initData.codeRuleVO) === null || _initData$codeRuleVO5 === void 0 ? void 0 : _initData$codeRuleVO5.ruleName) || (initData === null || initData === void 0 ? void 0 : initData.ruleName),
        ruleCode: (initData === null || initData === void 0 ? void 0 : (_initData$codeRuleVO6 = initData.codeRuleVO) === null || _initData$codeRuleVO6 === void 0 ? void 0 : _initData$codeRuleVO6.ruleCode) || (initData === null || initData === void 0 ? void 0 : initData.ruleCode)
      });
    }
    CodingRulesDs === null || CodingRulesDs === void 0 ? void 0 : CodingRulesDs.loadData([data]);
    setCurFieldCode(initData === null || initData === void 0 ? void 0 : initData.businessObjectFieldCode);
  };
  useEffect(() => {
    detailData && initData();
  }, [CodingRulesDs, inheritFieldId, businessObjectFieldId, inheritId, detailData]);
  const initData = () => {
    setTimeout(() => {
      CodingRulesDs === null || CodingRulesDs === void 0 ? void 0 : CodingRulesDs.loadData([detailData]);
      customInitChild === null || customInitChild === void 0 ? void 0 : customInitChild(detailData);
      CodingRulesDs === null || CodingRulesDs === void 0 ? void 0 : CodingRulesDs.setState('tlsParams', {
        businessObjectFieldId,
        inheritFieldId: inheritFieldId || inheritId
      });
    }, 0);
  };

  // 获取后端数据库中不存在的字段属性
  const getAttributeJson = () => {
    var _CodingRulesDs$curren5, _CodingRulesDs$curren6;
    return {
      // 传给后端数据库中不存在的字段信息
      helpText: (_CodingRulesDs$curren5 = CodingRulesDs.current) === null || _CodingRulesDs$curren5 === void 0 ? void 0 : _CodingRulesDs$curren5.get('helpText'),
      readOnlyFlag: (_CodingRulesDs$curren6 = CodingRulesDs.current) === null || _CodingRulesDs$curren6 === void 0 ? void 0 : _CodingRulesDs$curren6.get('readOnlyFlag')
    };
  };

  // 重置规则
  const resetCodeRule = async () => {
    const msg = intl.get('hmde.bo.businessObject.codingRule.deleteRule.tip').d('若此字段编码规则已使用，更改规则并保存后将影响序号的连续性，您确定切换规则吗？');
    _Modal.confirm({
      title: intl.get('hmde.bo.businessObject.codingRule.deleteRule').d('切换编码规则'),
      destroyed: true,
      children: msg,
      closable: true,
      onOk: async () => {
        var _lovDs$removeAll, _CodingRulesDs$curren7;
        ruleFormDs.removeAll();
        ruleListDs.removeAll();
        lovDs === null || lovDs === void 0 ? void 0 : (_lovDs$removeAll = lovDs.removeAll) === null || _lovDs$removeAll === void 0 ? void 0 : _lovDs$removeAll.call(lovDs);
        setSelectRuleFlag(false);
        // eslint-disable-next-line no-unused-expressions
        (_CodingRulesDs$curren7 = CodingRulesDs.current) === null || _CodingRulesDs$curren7 === void 0 ? void 0 : _CodingRulesDs$curren7.set('useFlag', false);
        setChangeRule(true);
      }
    });
  };
  const handleAddRule = async () => {
    const flag = await ruleListDs.validate();
    if (flag) {
      ruleListDs.create({});
    }
  };
  const handleStorageEncryptFlag = () => {
    var _CodingRulesDs$curren8, _CodingRulesDs$curren9;
    CodingRulesDs === null || CodingRulesDs === void 0 ? void 0 : (_CodingRulesDs$curren8 = CodingRulesDs.current) === null || _CodingRulesDs$curren8 === void 0 ? void 0 : _CodingRulesDs$curren8.set('storageEncryptFlag', !(CodingRulesDs !== null && CodingRulesDs !== void 0 && (_CodingRulesDs$curren9 = CodingRulesDs.current) !== null && _CodingRulesDs$curren9 !== void 0 && _CodingRulesDs$curren9.get('storageEncryptFlag')));
  };
  const getAddonBefore = useMemo(() => {
    return extendFieldPrefixRule || '';
  }, [extendFieldPrefixRule]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Form, {
    dataSet: CodingRulesDs,
    columns: 2
    // useColon={false}
    // labelWidth="auto" // 甄云环境因ued样式文件不同而出现样式错误问题
    ,
    labelLayout: "horizontal",
    disabled: disabled // 标准字段均禁用
    ,
    labelAlign: "left",
    className: styles['code-rule-form']
  }, /*#__PURE__*/React.createElement(_IntlField, {
    name: isTenant && boSourceType !== 'TENANT' && isExtensionField ? 'inheritFieldName' : 'businessObjectFieldName',
    placeholder: intl.get('hmde.bo.businessObject.enterthefieldname').d('请输入字段名称'),
    showLengthInfo: true
  }), isExtensionField && boSourceType !== 'TENANT' && domainEnabledFlag ? /*#__PURE__*/React.createElement(_Lov, {
    name: "businessObjectField",
    hidden: isEditMode,
    placeholder: intl.get('hmde.bo.businessObject.please.SelectExtendedField').d('请选择扩展字段')
  }) : null, isEditMode || isExtensionField && isEditMode ? /*#__PURE__*/React.createElement(_Output, {
    name: isTenant && boSourceType !== 'TENANT' && isExtensionField ? 'inheritFieldCode' : 'businessObjectFieldCode'
  }) : /*#__PURE__*/React.createElement(_TextField, {
    name: isTenant && boSourceType !== 'TENANT' && isExtensionField ? 'inheritFieldCode' : 'businessObjectFieldCode',
    placeholder: intl.get('hmde.bo.businessObject.enterthefieldcode').d('请输入字段编码'),
    addonBefore: getAddonBefore && /*#__PURE__*/React.createElement(_Tooltip, {
      title: getAddonBefore
    }, getAddonBefore),
    maxLength: 60 - getAddonBefore.length,
    showLengthInfo: true
  }), /*#__PURE__*/React.createElement(_NumberField, {
    name: "maxLength",
    placeholder: intl.get('hmde.bo.businessObject.please.Entermaximumlength').d('请输入最大长度')
  }), /*#__PURE__*/React.createElement(React.Fragment, null, !changeRule && isEditMode && ruleListDs.length > 0 && /*#__PURE__*/React.createElement(_Output, {
    name: "optionTitle",
    renderer: () => /*#__PURE__*/React.createElement(_Button, {
      onClick: resetCodeRule,
      disabled: isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField
    }, intl.get('hmde.bo.businessObject.codingRule.deleteRule').d('切换编码规则'))
  }), (!isEditMode ||
  // resetStatusRef.current ||
  changeRule || isEditMode && ruleListDs.length === 0) && /*#__PURE__*/React.createElement(_SelectBox, {
    name: "optionSettings",
    disabled: disabled || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField
  }, /*#__PURE__*/React.createElement(Option, {
    value: "_exitCodeRule"
  }, intl.get('hmde.bo.businessObject.optionSettings.valueList').d('已有编码规则')), /*#__PURE__*/React.createElement(Option, {
    value: "_createCodeRule"
  }, intl.get('hmde.bo.businessObject.optionSettings.custom').d('创建编码规则'))))), /*#__PURE__*/React.createElement("div", {
    className: styles['row-custom']
  },
  // resetStatusRef.current ||
  (changeRule || !isEditMode || isEditMode && ruleListDs.length === 0) && ((_CodingRulesDs$curren10 = CodingRulesDs.current) === null || _CodingRulesDs$curren10 === void 0 ? void 0 : _CodingRulesDs$curren10.get('optionSettings')) === '_exitCodeRule' ? /*#__PURE__*/React.createElement(_Form, {
    dataSet: lovDs,
    columns: 2,
    labelAlign: "left"
    // useColon={false}
  }, /*#__PURE__*/React.createElement(_Lov, {
    name: "selectCodeRule"
    // mode={ViewMode.button}
    ,
    placeholder: intl.get('hmde.bo.businessObject.optionSettings.selectRuleCode').d('选择已有编码规则'),
    disabled:
    // CodingRulesDs.current?.get('useFlag') ||
    !changeRule && (disabled || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField),
    noCache: true,
    onChange: () => {
      setChangeRule(true);
    }
  })) : null, ((_CodingRulesDs$curren11 = CodingRulesDs.current) === null || _CodingRulesDs$curren11 === void 0 ? void 0 : _CodingRulesDs$curren11.get('optionSettings')) === '_createCodeRule' || selectRuleFlag || (fastCreateEnter || isEditMode || isApiCustomType) && (_ruleFormDs$current3 = ruleFormDs.current) !== null && _ruleFormDs$current3 !== void 0 && _ruleFormDs$current3.get('ruleCode') ?
  /*#__PURE__*/
  // eslint-disable-next-line react/jsx-indent
  React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Form, {
    dataSet: ruleFormDs
    // useColon={false}
    ,
    columns: 2,
    disabled: !changeRule && (disabled || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField),
    labelAlign: "left"
  }, cantEditOtherTenant ? /*#__PURE__*/React.createElement(_Output, {
    name: "ruleName",
    colSpan: 1
  }) : /*#__PURE__*/React.createElement(_TextField, {
    name: "ruleName",
    colSpan: 1,
    placeholder: intl.get('hmde.bo.businessObject.Enterrulename').d('请输入规则名称'),
    maxLength: 60,
    showLengthInfo: true,
    clearButton: true
  }), (_CodingRulesDs$curren12 = CodingRulesDs.current) !== null && _CodingRulesDs$curren12 !== void 0 && _CodingRulesDs$curren12.get('useFlag') ? /*#__PURE__*/React.createElement(_Output, {
    name: "ruleCode",
    colSpan: 1
  }) : /*#__PURE__*/React.createElement(_TextField, {
    name: "ruleCode",
    disabled: ((_CodingRulesDs$curren13 = CodingRulesDs.current) === null || _CodingRulesDs$curren13 === void 0 ? void 0 : _CodingRulesDs$curren13.get('useFlag')) || !changeRule && (((_ruleFormDs$current4 = ruleFormDs.current) === null || _ruleFormDs$current4 === void 0 ? void 0 : _ruleFormDs$current4.get('ruleCode')) &&
    // !resetStatusRef.current &&
    isEditCurField || cantEditOtherTenant),
    maxLength: 30,
    showLengthInfo: true,
    clearButton: true,
    colSpan: 1,
    placeholder: intl.get('hmde.bo.businessObject.Enterrulecode').d('请输入规则编码')
  })), /*#__PURE__*/React.createElement("div", {
    className: styles['row-custom-header']
  }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.ruleCode').d('编码规则')), /*#__PURE__*/React.createElement("a", {
    style: {
      display: 'flex',
      alignItems: 'center',
      marginRight: 20
    },
    hidden: (_CodingRulesDs$curren14 = CodingRulesDs.current) === null || _CodingRulesDs$curren14 === void 0 ? void 0 : _CodingRulesDs$curren14.get('useFlag'),
    disabled:
    // CodingRulesDs.current?.get('useFlag') ||
    !changeRule && (disabled || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField || cantEditOtherTenant),
    onClick: handleAddRule
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "add"
  }), intl.get('hmde.bo.businessObject.createRule').d('添加规则'))), /*#__PURE__*/React.createElement(CodeRulesList
  // standardFlag
  , {
    ruleListDs: ruleListDs,
    useFlag: (_CodingRulesDs$curren15 = CodingRulesDs.current) === null || _CodingRulesDs$curren15 === void 0 ? void 0 : _CodingRulesDs$curren15.get('useFlag'),
    disabled:
    // CodingRulesDs.current?.get('useFlag') ||
    !changeRule && (disabled || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField || cantEditOtherTenant),
    businessObjectCode: businessObjectCode,
    curFieldCode: curFieldCode
  }),
  // ps: 有流水号数据的时候, 才展示流水号规则
  //  ps: 逻辑变更, 创建=>能编辑  编辑=>根据useFlag  changeRule => 重置之后能编辑机
  (ruleListDs === null || ruleListDs === void 0 ? void 0 : ruleListDs.find(v => (v === null || v === void 0 ? void 0 : v.get('fieldType')) === 'SEQUENCE')) && /*#__PURE__*/React.createElement(_Form, {
    dataSet: ruleFormDs
    // useColon={false}
    ,
    columns: 2,
    disabled:
    // (CodingRulesDs.current?.get('useFlag') && isEditMode) ||
    // (!changeRule &&
    //   (disabled ||
    //     (isTenant &&
    //       boSourceType !== 'TENANT' &&
    //       isEditMode &&
    //       !isExtensionField)))
    ((_CodingRulesDs$curren16 = CodingRulesDs.current) === null || _CodingRulesDs$curren16 === void 0 ? void 0 : _CodingRulesDs$curren16.get('useFlag')) && isEditMode && !changeRule || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField || disabled,
    labelAlign: "left"
  }, /*#__PURE__*/React.createElement(_Select, {
    name: "sequenceIsolationLevel",
    labelWidth: 150,
    label: /*#__PURE__*/React.createElement(LabelTitleRender, {
      value: intl.get('hmde.bo.businessObject.sequenceIsolationLevel').d('流水号规则'),
      customerDom: /*#__PURE__*/React.createElement(ImgIcon, {
        name: "serial-number-rule@2x.png",
        style: {
          width: 569,
          height: 531
        }
      })
    }),
    colSpan: 1,
    placeholder: intl.get('hmde.bo.businessObject.serialnumberrule').d('请选择流水号规则')
  }), ((_ruleFormDs$current5 = ruleFormDs.current) === null || _ruleFormDs$current5 === void 0 ? void 0 : _ruleFormDs$current5.get('sequenceIsolationLevel')) === 'TENANT_VARIABLE' && /*#__PURE__*/React.createElement(_Select, {
    multiple: true,
    name: "isolationVariables",
    colSpan: 1,
    placeholder: intl.get('hmde.bo.businessObject.sequencenumberrulevariable').d('请选择流水号规则变量')
  }, ruleListDs.filter(i => i.get('fieldType') === VARIABLE).map(i => /*#__PURE__*/React.createElement(Option, {
    value: i.get('variableKey'),
    key: i.get('variableKey')
  }, `${intl.get('hmde.bo.businessObject.codingRule.variable').d('变量')}(${intl.get('hmde.bo.businessObject.variableKey').d('段值')}：${i.get('variableKey')})`))))) : null), /*#__PURE__*/React.createElement(_Form, {
    dataSet: CodingRulesDs,
    columns: 2
    // useColon={false}
    ,
    labelLayout: "horizontal",
    disabled: disabled,
    labelAlign: "left"
  }, /*#__PURE__*/React.createElement(_Switch, {
    name: "requiredFlag",
    disabled: isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField && ((_CodingRulesDs$curren17 = CodingRulesDs.current) === null || _CodingRulesDs$curren17 === void 0 ? void 0 : _CodingRulesDs$curren17.get('platformFieldRequiredFlag'))
  })), /*#__PURE__*/React.createElement(SectionTitle, {
    title: intl.get('hmde.bo.businessObject.otherprops').d('其他属性')
  }), /*#__PURE__*/React.createElement(_Form, {
    dataSet: CodingRulesDs,
    columns: 2
    // useColon={false}
    // labelWidth="auto" // 甄云环境因ued样式文件不同而出现样式错误问题
    ,
    labelLayout: "horizontal",
    disabled: disabled // 标准字段均禁用
    ,
    labelAlign: "left",
    labelWidth: 110
  }, /*#__PURE__*/React.createElement(_Output, {
    name: "helpText",
    key: "helpText",
    colSpan: 1,
    newLine: true,
    renderer: ({
      record
    }) => {
      return /*#__PURE__*/React.createElement(MultiIntlField, {
        name: "helpText",
        label: intl.get('hmde.common.helpText').d('帮助文本'),
        record: record,
        init: record === null || record === void 0 ? void 0 : record.get('helpText'),
        disabled: disabled || isEditMode && isTenant && boSourceType !== 'TENANT' && !isExtensionField,
        textFieldStyle: {
          height: '85px'
        }
      });
    }
  }), /*#__PURE__*/React.createElement(_IntlField, {
    name: "remark",
    colSpan: 1,
    style: {
      height: '85px'
    },
    type: "multipleLine",
    suffix: /*#__PURE__*/React.createElement(_Icon, {
      type: "language"
    }),
    disabled: disabled || isEditMode && isTenant && boSourceType !== 'TENANT' && !isExtensionField,
    placeholder: intl.get('hmde.common.remark.placeholder').d('请输入描述')
  }), isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField ? !isApiCustomType && /*#__PURE__*/React.createElement(_Switch, {
    key: "exportableFlag",
    name: "exportableFlag",
    disabled: true
  }) : !isApiCustomType &&
  /*#__PURE__*/
  // eslint-disable-next-line react/jsx-indent
  React.createElement(_Output, {
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
  }), !isExtensionField && !isApiCustomType && /*#__PURE__*/React.createElement(_Switch, {
    key: "defaultDisplayFieldFlag",
    name: "defaultDisplayFieldFlag",
    disabled: isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField
  }), !isExtensionField && (isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField ? physicalModelType === 'TABLE' &&
  /*#__PURE__*/
  // eslint-disable-next-line react/jsx-indent
  React.createElement(_Form.ItemGroup, {
    label: /*#__PURE__*/React.createElement(LabelTitleRender, {
      value: intl.get('hmde.bo.businessObject.storageEncryptFlag').d('存储加密'),
      help: intl.get('hmde.bo.businessObject.storageEncryptFlag.help').d('开启后，字段存储时加密存储，仅支持精确查询')
    })
  }, /*#__PURE__*/React.createElement(_Switch, {
    key: "storageEncryptFlag",
    name: "storageEncryptFlag",
    disabled: true
  })) : physicalModelType === 'TABLE' &&
  /*#__PURE__*/
  // eslint-disable-next-line react/jsx-indent
  React.createElement(_Form.ItemGroup, {
    label: /*#__PURE__*/React.createElement(LabelTitleRender, {
      value: intl.get('hmde.bo.businessObject.storageEncryptFlag').d('存储加密'),
      help: intl.get('hmde.bo.businessObject.storageEncryptFlag.help').d('开启后，字段存储时加密存储，仅支持精确查询')
    })
  }, /*#__PURE__*/React.createElement(_Form.Item, {
    name: "storageEncryptFlag",
    key: "storageEncryptFlag"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(_Popconfirm, {
    title: renderPopConfirmTitle(CodingRulesDs !== null && CodingRulesDs !== void 0 && (_CodingRulesDs$curren18 = CodingRulesDs.current) !== null && _CodingRulesDs$curren18 !== void 0 && _CodingRulesDs$curren18.get('storageEncryptFlag') ? intl.get('hmde.bo.businessObject.storageEncryptFlag.closetip').d('关闭开关并发布后，将会解密处理已有数据，请确认是否关闭？') : intl.get('hmde.bo.businessObject.storageEncryptFlag.opentip').d('开启开关并发布后，将会加密处理已有数据，请确认是否开启？'), CodingRulesDs !== null && CodingRulesDs !== void 0 && (_CodingRulesDs$curren19 = CodingRulesDs.current) !== null && _CodingRulesDs$curren19 !== void 0 && _CodingRulesDs$curren19.get('storageEncryptFlag') ? intl.get('hmde.bo.businessObject.isCose').d('是否关闭') : intl.get('hmde.bo.businessObject.isOpen').d('是否开启')),
    okText: intl.get('hmde.common.button.ensure').d('确认'),
    cancelText: intl.get('hmde.common.button.cancel').d('取消'),
    onConfirm: handleStorageEncryptFlag
  }, /*#__PURE__*/React.createElement("span", null, physicalModelType === 'TABLE' && /*#__PURE__*/React.createElement(_Switch, {
    key: "storageEncryptFlag",
    name: "storageEncryptFlag",
    readOnly: true
  })))))))));
}
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(Index));