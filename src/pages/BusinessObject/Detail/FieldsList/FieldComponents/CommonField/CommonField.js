import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _Row from "choerodon-ui/pro/lib/row";
import _Col from "choerodon-ui/pro/lib/col";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Alert from "@hzero-front-ui/c7n-ui/lib/Alert";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _camelCase from "lodash/camelCase";
import _groupBy from "lodash/groupBy";
import intl from 'utils/intl';
import Lov from "hzero-front-hmde/lib/components/LowcodeLov";
import { Observer } from 'mobx-react-lite';
import React, { useEffect, useImperativeHandle, useState, useRef, useMemo } from 'react';
import { FuncType, ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { ViewMode } from 'choerodon-ui/pro/lib/lov/enum';
import { LabelAlign } from 'choerodon-ui/pro/lib/form/enum';
import notification from 'utils/notification';
import { getResponse, isTenantRoleLevel, getCurrentLanguage } from 'utils/utils';
import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import FormulaEditor from "hzero-front-hmde/lib/businessComponents/FormulaEditor";
import SectionTitle from "hzero-front-apaas/lib/components/SectionTitle";
import { setFieldProperties, setDatasetProps, CommonFieldTextValidator } from "hzero-front-hmde/lib/stores/FieldProperties";
import { MeaningConfig, lovValuesDS, linkMidBoDS } from "hzero-front-hmde/lib/stores/ObjectFieldDS";
import formatterCollections from 'utils/intl/formatterCollections';
import MultiIntlField from "hzero-front-hmde/lib/businessComponents/MultiIntlField";
import { SourceType } from "hzero-front-apaas/lib/constants/businessObject";

// import { queryIdpValue } from 'services/api';
import { queryMultiIdpValue } from "hzero-front-hmde/lib/services/commonService";
// import ImgIcon from '@hmde/utils/ImgIcon';
import { handleDeleteCheckApi } from "hzero-front-hmde/lib/services/businessObjectService";
import { getApiObjectParams, EEnvironmentCode } from "hzero-front-hmde/lib/utils/queryApiObjectFields";
import { getDrillFIeldType } from "hzero-front-hmde/lib/utils/common";
import { PhysicalModelType } from "hzero-front-hmde/lib/constants/businessObject";
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
import LovDefineModal from "../select/LovDefineModal";
import LovValuesList from "../select/LovValuesList";
import styles from "./index.less?modules";
import { GroupMapping, linkHaveMiddleObj } from "./utils";
const getFormDsConfig = ({
  type,
  boSourceType,
  businessObjectId,
  isEditMode,
  isExtensionField,
  isFromDomain,
  businessObjectCode,
  customPrimaryKeyCode,
  componentType,
  tenantCustomObject,
  businessObjectFieldCode,
  domainEnabledFlag,
  extendFieldCreatedFlag,
  getAddonBefore,
  updateAssociateBoCheck,
  isApiCustomType,
  physicalModelType,
  middleBusinessObjMasterRelationFlag,
  noSaveRelationFieldList
}) => {
  const filedPropertied = setFieldProperties({
    type,
    boSourceType,
    isEditMode,
    isExtensionField,
    isFromDomain,
    businessObjectId,
    businessObjectFieldCode,
    domainEnabledFlag,
    isApiCustomType,
    physicalModelType,
    // updateAssociateBoCheck,
    middleBusinessObjMasterRelationFlag
  });
  const _setDatasetProps = setDatasetProps({
      filedPropertied,
      businessObjectId,
      isEditMode,
      isExtensionField,
      isFromDomain,
      businessObjectCode,
      customPrimaryKeyCode,
      componentType,
      tenantCustomObject,
      extendFieldCreatedFlag,
      getAddonBefore,
      updateAssociateBoCheck,
      physicalModelType,
      type,
      isApiCustomType,
      noSaveRelationFieldList
    }),
    datasetProps = _setDatasetProps.datasetProps;
  return datasetProps;
};
const isTenant = isTenantRoleLevel();
function CommonField(props) {
  var _useBoStore, _CommonFieldDs$curren3;
  const selectedExampleInfo = props.selectedExampleInfo,
    disabled = props.disabled,
    detailData = props.detailData,
    businessObjectId = props.businessObjectId,
    isEditMode = props.isEditMode,
    isExtensionField = props.isExtensionField,
    isFromDomain = props.isFromDomain,
    businessObjectCode = props.businessObjectCode,
    customPrimaryKeyCode = props.customPrimaryKeyCode,
    fieldType = props.fieldType,
    boSourceType = props.boSourceType,
    iconRef = props.iconRef,
    middleBusinessObjFlag = props.middleBusinessObjFlag,
    tenantCustomObject = props.tenantCustomObject,
    domainEnabledFlag = props.domainEnabledFlag,
    extendFieldCreatedFlag = props.extendFieldCreatedFlag,
    oldComponentType = props.oldComponentType,
    componentType = props.componentType,
    fieldBehavior = props.fieldBehavior,
    extendFieldPrefixRule = props.extendFieldPrefixRule,
    _props$isApiCustomTyp = props.isApiCustomType,
    isApiCustomType = _props$isApiCustomTyp === void 0 ? false : _props$isApiCustomTyp,
    physicalModelType = props.physicalModelType,
    _props$fastCreateEnte = props.fastCreateEnter,
    fastCreateEnter = _props$fastCreateEnte === void 0 ? false : _props$fastCreateEnte,
    businessObjectFieldId = props.businessObjectFieldId,
    inheritFieldId = props.inheritFieldId,
    inheritId = props.inheritId,
    dimensionFlag = props.dimensionFlag,
    businessObjectName = props.businessObjectName,
    middleDisabled = props.middleDisabled,
    extendTableEnabledFlag = props.extendTableEnabledFlag,
    _props$extendTableSuf = props.extendTableSuffix,
    extendTableSuffix = _props$extendTableSuf === void 0 ? 'ext' : _props$extendTableSuf,
    tenantSqlObjectDisabled = props.tenantSqlObjectDisabled,
    noSaveRelationFieldList = props.noSaveRelationFieldList;
  const _ref = selectedExampleInfo || {},
    value = _ref.value;
  const _useState = useState(new _DataSet()),
    _useState2 = _slicedToArray(_useState, 2),
    CommonFieldDs = _useState2[0],
    setCommonFieldDs = _useState2[1];
  const _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    codeDisabled = _useState4[0],
    setCodeDisabled = _useState4[1];
  const _useState5 = useState({}),
    _useState6 = _slicedToArray(_useState5, 2),
    fields = _useState6[0],
    setFields = _useState6[1];
  const _useState7 = useState([]),
    _useState8 = _slicedToArray(_useState7, 2),
    lovData = _useState8[0],
    setLovData = _useState8[1];
  const _useState9 = useState({}),
    _useState10 = _slicedToArray(_useState9, 2),
    refList = _useState10[0],
    setRefList = _useState10[1];
  const _useState11 = useState(true),
    _useState12 = _slicedToArray(_useState11, 2),
    refState = _useState12[0],
    setRefState = _useState12[1];
  const _useState13 = useState(false),
    _useState14 = _slicedToArray(_useState13, 2),
    showTipFlag = _useState14[0],
    setShowTipFlag = _useState14[1];
  const _useState15 = useState(false),
    _useState16 = _slicedToArray(_useState15, 2),
    requireFlag = _useState16[0],
    setRequireFlag = _useState16[1];
  const _useState17 = useState(''),
    _useState18 = _slicedToArray(_useState17, 2),
    relBoId = _useState18[0],
    setRelBoId = _useState18[1];
  const _useState19 = useState(''),
    _useState20 = _slicedToArray(_useState19, 2),
    currentFormula = _useState20[0],
    setCurrentFormula = _useState20[1];
  const _useState21 = useState({}),
    _useState22 = _slicedToArray(_useState21, 2),
    currentHelpText = _useState22[0],
    setCurrentHelpText = _useState22[1];
  const formulaEditorRef = useRef(null);
  const hadTipFlag = useRef(false); // 更改关联对象是否已经提示过

  const lovValuesDsSwitch = useMemo(() => new _DataSet(lovValuesDS(CommonFieldDs)), []);
  const baseInfoDS = (_useBoStore = useBoStore()) === null || _useBoStore === void 0 ? void 0 : _useBoStore.getState('baseInfoDS');

  // 中间对象lov
  const linkMidBoDs = useMemo(() => new _DataSet(linkMidBoDS(businessObjectId, relBoId)), [businessObjectId, relBoId]);
  useDataSetEvents(linkMidBoDs, 'update', ({
    value: midValue
  }) => {
    if (midValue) {
      linkHaveMiddleObj(midValue, CommonFieldDs, businessObjectCode, isTenant);
      linkMidBoDs.removeAll();
    }
  });

  // 中间对象的从主字段
  const middleBusinessObjMasterRelationFlag = middleBusinessObjFlag && (detailData === null || detailData === void 0 ? void 0 : detailData.componentType) === FieldComponentType.MASTER_RELATION;
  useEffect(() => {
    var _CommonFieldDs$curren;
    // 领域新建关联字段 当选择继承的时候, 非必填
    CommonFieldDs === null || CommonFieldDs === void 0 ? void 0 : (_CommonFieldDs$curren = CommonFieldDs.current) === null || _CommonFieldDs$curren === void 0 ? void 0 : _CommonFieldDs$curren.setState('fieldBehavior', fieldBehavior);
  }, [fieldBehavior, CommonFieldDs]);

  // eslint-disable-next-line no-unused-expressions
  useEffect(() => {
    var _CommonFieldDs$curren2;
    CommonFieldDs === null || CommonFieldDs === void 0 ? void 0 : (_CommonFieldDs$curren2 = CommonFieldDs.current) === null || _CommonFieldDs$curren2 === void 0 ? void 0 : _CommonFieldDs$curren2.set('codeDisabled', codeDisabled);
    CommonFieldDs === null || CommonFieldDs === void 0 ? void 0 : CommonFieldDs.setState('codeDisabled', codeDisabled);
  }, [codeDisabled, CommonFieldDs.getState('codeDisabled')]);
  // eslint-disable-next-line no-unused-expressions
  CommonFieldDs === null || CommonFieldDs === void 0 ? void 0 : (_CommonFieldDs$curren3 = CommonFieldDs.current) === null || _CommonFieldDs$curren3 === void 0 ? void 0 : _CommonFieldDs$curren3.setState('currentFormula', currentFormula);
  const useTipFlag = () => {
    var _iconRef$current2;
    const _useState23 = useState(false),
      _useState24 = _slicedToArray(_useState23, 2),
      tipFlag = _useState24[0],
      setTipFlag = _useState24[1];
    useEffect(() => {
      var _iconRef$current;
      // eslint-disable-next-line no-unused-expressions
      [intl.get(`hmde.common.phoneNumber`).d('手机号码'), intl.get(`hmde.common.email`).d('电子邮箱')].includes((_iconRef$current = iconRef.current) === null || _iconRef$current === void 0 ? void 0 : _iconRef$current.value) ? setTipFlag(true) : setTipFlag(false);
    }, [(_iconRef$current2 = iconRef.current) === null || _iconRef$current2 === void 0 ? void 0 : _iconRef$current2.value]);
    return tipFlag;
  };
  const tipFlag = useTipFlag();
  const init = data => {
    const _ref2 = data || {},
      formula = _ref2.formula,
      attributeJson = _ref2.attributeJson,
      defaultValueAnalyzeResult = _ref2.defaultValueAnalyzeResult,
      formulaAnalyzeResult = _ref2.formulaAnalyzeResult,
      platformFieldRequiredFlag = _ref2.platformFieldRequiredFlag;
    if (formulaAnalyzeResult) {
      setRefList(formulaAnalyzeResult);
      setRefState(formulaAnalyzeResult === null || formulaAnalyzeResult === void 0 ? void 0 : formulaAnalyzeResult.success);
    } else if (defaultValueAnalyzeResult) {
      setRefList(defaultValueAnalyzeResult);
      setRefState(defaultValueAnalyzeResult === null || defaultValueAnalyzeResult === void 0 ? void 0 : defaultValueAnalyzeResult.success);
    }
    if (formula) {
      var _formula$match, _str$split, _arr$splice, _CommonFieldDs$curren4, _CommonFieldDs$curren5;
      const str = (_formula$match = formula.match(/CASCADE\((.*?)\)/)) === null || _formula$match === void 0 ? void 0 : _formula$match[1];
      const arr = (str === null || str === void 0 ? void 0 : (_str$split = str.split) === null || _str$split === void 0 ? void 0 : _str$split.call(str, ',')) || [];
      const newFormula = arr.length > 2 ? (_arr$splice = arr.splice(1, arr.length - 1)) === null || _arr$splice === void 0 ? void 0 : _arr$splice.join(',') : arr[1];
      setCurrentFormula(`CASCADE(${newFormula})`);
      // eslint-disable-next-line no-unused-expressions
      CommonFieldDs === null || CommonFieldDs === void 0 ? void 0 : (_CommonFieldDs$curren4 = CommonFieldDs.current) === null || _CommonFieldDs$curren4 === void 0 ? void 0 : _CommonFieldDs$curren4.init('formula', `CASCADE(${newFormula})`);
      // eslint-disable-next-line no-unused-expressions
      CommonFieldDs === null || CommonFieldDs === void 0 ? void 0 : (_CommonFieldDs$curren5 = CommonFieldDs.current) === null || _CommonFieldDs$curren5 === void 0 ? void 0 : _CommonFieldDs$curren5.init('newFormula', formula);
    }
    if (attributeJson) {
      setCurrentHelpText((attributeJson === null || attributeJson === void 0 ? void 0 : attributeJson.helpText) || {});
    }
    if (platformFieldRequiredFlag) {
      setRequireFlag(platformFieldRequiredFlag);
    }

    // 开关字段-值集-回显设置
    if ((data === null || data === void 0 ? void 0 : data.componentType) === 'SWITCH' && data !== null && data !== void 0 && data.lovCode) {
      queryLovData(data === null || data === void 0 ? void 0 : data.lovCode);
    }
  };
  const thisUpdate = ({
    name,
    value: _value,
    dataSet: ds,
    record
  }) => {
    var _Object$prototype$has, _Object$prototype$has2;
    if (name === 'businessObjectField' && _value && (_Object$prototype$has = Object.prototype.hasOwnProperty) !== null && _Object$prototype$has !== void 0 && (_Object$prototype$has2 = _Object$prototype$has.call) !== null && _Object$prototype$has2 !== void 0 && _Object$prototype$has2.call(_Object$prototype$has, _value, 'formerInheritField')) {
      setShowTipFlag(_value.formerInheritField);
    } else {
      setShowTipFlag(false);
    }
    if (name === 'meaningConfig' && ds.current) {
      if (_value === 'valueList') {
        ds.current.set('trueMeaning', null);
        ds.current.set('falseMeaning', null);
      } else {
        ds.current.set('trueMeaning', MeaningConfig.yes);
        ds.current.set('falseMeaning', MeaningConfig.no);
      }
    }
    if (name === 'valueList' && _value) {
      queryLovData(_value === null || _value === void 0 ? void 0 : _value.lovCode);
    }

    // 中间对象属性逻辑处理
    if (componentType === FieldComponentType.MULTIPLE_RELATION) {
      // 中间对象名称处理
      if (name === 'masterBusinessObject') {
        setRelBoId(_value ? _value.businessObjectId : undefined);
      }
      if (name === 'masterBusinessObject' && _value) {
        var _ds$current, _ds$current2, _baseInfoDS$current, _ds$current3, _ds$current4;
        if (!isEditMode) {
          record.set('middleBoId', '');
          record.setState('disabledMidProps', false);
          record.set('secondField.businessObjectFieldId', undefined);
        }
        record === null || record === void 0 ? void 0 : record.set('physicalModelNameEditedFlag', undefined);
        record === null || record === void 0 ? void 0 : record.set('extendsTableNameEditedFlag', undefined);
        !isEditMode && (record === null || record === void 0 ? void 0 : record.set('middleBusinessObject.customPrimaryKeyCode', ''));
        ds === null || ds === void 0 ? void 0 : (_ds$current = ds.current) === null || _ds$current === void 0 ? void 0 : _ds$current.set('middleBusinessObject_businessObjectName', `${businessObjectName}${intl.get('hmde.common.and').d('与')}${_value === null || _value === void 0 ? void 0 : _value.businessObjectName}${intl.get('hmde.bo.businessObject.dMiddleObject').d('的中间对象')}`);
        !isEditMode && (ds === null || ds === void 0 ? void 0 : (_ds$current2 = ds.current) === null || _ds$current2 === void 0 ? void 0 : _ds$current2.set('middleBusinessObject.businessObjectCode', `${businessObjectCode.replace(`${baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('domainCode')}_`, '')}_${_value === null || _value === void 0 ? void 0 : _value.businessObjectCode.replace(`${_value === null || _value === void 0 ? void 0 : _value.domainCode}_`, '')}`));
        ds === null || ds === void 0 ? void 0 : (_ds$current3 = ds.current) === null || _ds$current3 === void 0 ? void 0 : _ds$current3.set('secondField_businessObjectFieldName', _value.businessObjectName + 'ID');
        ds === null || ds === void 0 ? void 0 : (_ds$current4 = ds.current) === null || _ds$current4 === void 0 ? void 0 : _ds$current4.set('secondField.businessObjectFieldCode', _camelCase(_value.businessObjectCode) + 'Id');
      }
      if (name === 'refValueListBusinessObject') {
        var _ds$current5;
        ds === null || ds === void 0 ? void 0 : (_ds$current5 = ds.current) === null || _ds$current5 === void 0 ? void 0 : _ds$current5.setState('linkObjChange', true);
      }
      if (name === 'middleBusinessObject.businessObjectCode') {
        // 物理模型名称
        if (!(record !== null && record !== void 0 && record.get('physicalModelNameEditedFlag'))) {
          var _baseInfoDS$current2;
          record === null || record === void 0 ? void 0 : record.set('middleBusinessObject.physicalModelName', `${_camelCase(baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : _baseInfoDS$current2.get('domainCode'))}_${_value}`);
        }
        // 扩展物理模型名称
        if (!(record !== null && record !== void 0 && record.get('extendsTableNameEditedFlag')) && !isTenant) {
          var _baseInfoDS$current3;
          record === null || record === void 0 ? void 0 : record.set('middleBusinessObject.extendsTableName', `${_camelCase(baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current3 = baseInfoDS.current) === null || _baseInfoDS$current3 === void 0 ? void 0 : _baseInfoDS$current3.get('domainCode'))}_${_value}_${extendTableSuffix}`);
        }
      }
    }
  };

  // 文本, 富文本, 多行文本, 默认值效验规则 添加 所关联的规则的正则效验 (编辑状态下)
  // 手机号码, 邮箱 编辑的时候 也需要按照所关联的正则效验来
  const thisLoad = ({
    dataSet
  }) => {
    if (['TEXT_FIELD', 'TEXT_AREA', 'RICH_TEXT', 'PHONE_NUMBER', 'EMAIL'].includes(value) && isEditMode && oldComponentType === value) {
      handleDeleteCheckApi({
        businessObjectCode,
        businessObjectFieldCode: detailData === null || detailData === void 0 ? void 0 : detailData.businessObjectFieldCode
      }).then(res => {
        if (!(res !== null && res !== void 0 && res.failed)) {
          const _ref3 = res || {},
            formula = _ref3.formula,
            errorInfo = _ref3.errorInfo,
            enabledFlag = _ref3.enabledFlag;
          // 业务规则禁用时不校验
          enabledFlag && CommonFieldTextValidator({
            dataSet,
            formula,
            errorInfo,
            value
          });
        }
      });
    }
  };

  /**
   * 更新关联业务对象时的校验信息
   */
  const updateAssociateBoCheck = async () => {
    var _CommonFieldDs$curren6;
    let cancelFlag = false;
    if (!hadTipFlag.current && isEditMode && CommonFieldDs !== null && CommonFieldDs !== void 0 && (_CommonFieldDs$curren6 = CommonFieldDs.current) !== null && _CommonFieldDs$curren6 !== void 0 && _CommonFieldDs$curren6.get('masterBusinessObjectId')) {
      await _Modal.confirm({
        children: intl.get('hmde.bo.businessObject.AssociateBoCheck').d('更改关联对象后可能会对已有记录造成影响，请确认是否修改？'),
        okText: intl.get('hmde.common.button.sure').d('确定'),
        onOk: () => {
          hadTipFlag.current = true;
        },
        onCancel: () => {
          cancelFlag = true;
          hadTipFlag.current = false;
          return true;
        }
      });
      if (cancelFlag) {
        return false;
      }
      return true;
    }
  };
  const getAddonBefore = useMemo(() => {
    return extendFieldPrefixRule || '';
  }, [extendFieldPrefixRule]);
  useEffect(() => {
    let ds;
    if (value) {
      const datasetProps = getFormDsConfig({
        type: value,
        boSourceType,
        businessObjectId,
        isEditMode,
        isExtensionField,
        isFromDomain,
        businessObjectCode,
        customPrimaryKeyCode,
        componentType: value,
        tenantCustomObject,
        businessObjectFieldCode: detailData === null || detailData === void 0 ? void 0 : detailData.businessObjectFieldCode,
        domainEnabledFlag,
        extendFieldCreatedFlag,
        getAddonBefore,
        updateAssociateBoCheck,
        isApiCustomType,
        physicalModelType,
        middleBusinessObjMasterRelationFlag,
        noSaveRelationFieldList
      });
      setFields(_groupBy(datasetProps.fields, ({
        name
      }) => {
        // 如果是开关类型，【是否可导出】
        if (value === 'SWITCH' && name === 'exportableFlag') return 'otherProps';

        // 继承字段需要特殊处理
        if (GroupMapping.fieldBehaviorProps.indexOf(name) > -1 && fieldBehavior && !isEditMode) {
          return 'fieldBehaviorProps';
        }
        if (GroupMapping.head.indexOf(name) > -1) {
          return 'head';
        } else if (GroupMapping.defaultValueType.includes(name)) {
          return 'defaultValueType';
        } else if (GroupMapping.defaultValueField.indexOf(name) > -1) {
          return 'defaultValueField';
        } else if (GroupMapping.unRender.indexOf(name) > -1) {
          return 'unRender';
        } else if (GroupMapping.otherProps.indexOf(name) > -1) {
          return 'otherProps';
        } else if (GroupMapping.middleProps.indexOf(name) > -1) {
          return 'middleProps';
        } else if (GroupMapping.middleBoMasterRelationProps.indexOf(name) > -1) {
          return 'middleBoMasterRelationProps';
        } else {
          return 'ret';
        }
      }));
      ds = new _DataSet(datasetProps);
      setCommonFieldDs(ds);
      ds.addEventListener('update', thisUpdate);
      ds.addEventListener('load', thisLoad);
      setCodeDisabled(isEditMode);
    }
    return () => {
      if (ds) {
        ds.removeEventListener('update', thisUpdate);
        ds.removeEventListener('load', thisLoad);
      }
    };
  }, [value]);
  const customValidator = async () => {
    var _CommonFieldDs$curren7, _CommonFieldDs$curren8;
    const flag1 = await ((_CommonFieldDs$curren7 = CommonFieldDs.current) === null || _CommonFieldDs$curren7 === void 0 ? void 0 : _CommonFieldDs$curren7.validate(true));
    const flag2 = await (lovValuesDsSwitch === null || lovValuesDsSwitch === void 0 ? void 0 : lovValuesDsSwitch.validate());
    if (!flag1 || !flag2) {
      return false;
    }

    // 开关字段需要特殊处理下
    const _ref4 = window.dvaApp._store.getState().global || {},
      language = _ref4.language;
    if (componentType === FieldComponentType.SWITCH && (CommonFieldDs === null || CommonFieldDs === void 0 ? void 0 : (_CommonFieldDs$curren8 = CommonFieldDs.current) === null || _CommonFieldDs$curren8 === void 0 ? void 0 : _CommonFieldDs$curren8.get('meaningConfig')) === 'selfConfig' && language) {
      var _CommonFieldDs$curren9, _CommonFieldDs$curren10, _CommonFieldDs$curren11, _CommonFieldDs$curren12;
      if (!(CommonFieldDs !== null && CommonFieldDs !== void 0 && (_CommonFieldDs$curren9 = CommonFieldDs.current) !== null && _CommonFieldDs$curren9 !== void 0 && (_CommonFieldDs$curren10 = _CommonFieldDs$curren9.get('falseMeaning')) !== null && _CommonFieldDs$curren10 !== void 0 && _CommonFieldDs$curren10[language]) || !(CommonFieldDs !== null && CommonFieldDs !== void 0 && (_CommonFieldDs$curren11 = CommonFieldDs.current) !== null && _CommonFieldDs$curren11 !== void 0 && (_CommonFieldDs$curren12 = _CommonFieldDs$curren11.get('trueMeaning')) !== null && _CommonFieldDs$curren12 !== void 0 && _CommonFieldDs$curren12[language])) {
        return false;
      }
    }
    const _toData = CommonFieldDs.current.toData(),
      defaultValueType = _toData.defaultValueType,
      fixDateTime = _toData.fixDateTime;
    // 校验表达式
    if ([defaultValueType, fixDateTime].includes('EXPRESSION')) {
      var _formulaEditorRef$cur;
      if (formulaEditorRef.current && !(await ((_formulaEditorRef$cur = formulaEditorRef.current) === null || _formulaEditorRef$cur === void 0 ? void 0 : _formulaEditorRef$cur.checkValidate()))) {
        return false;
      }
    }
    // 校验引用字段
    if (value === 'REFERENCE_FIELD' && !refState) {
      notification.warning({
        message: intl.get('hmde.bo.businessObject.refErrorMessage').d('引用了不存在的字段，请重新选择')
      });
      return false;
    }
    return true;
  };
  useImperativeHandle(props === null || props === void 0 ? void 0 : props.childrenComRef, () => ({
    CommonFieldDs,
    // 暴露出去的ds名称: 组件名称+Ds
    lovValuesDsSwitch,
    // 开关类型需要维护一个值集的list
    customInitChild: initData => init(initData),
    customValidator
  }));
  useEffect(() => {
    detailData && initData();
  }, [CommonFieldDs, inheritFieldId, businessObjectFieldId, inheritId, detailData]);
  const initData = () => {
    setTimeout(() => {
      if (isApiCustomType && value === 'SWITCH' && !(detailData !== null && detailData !== void 0 && detailData.meaningConfig)) {
        detailData.meaningConfig = 'selfConfig';
        detailData.trueMeaning = {
          zh_CN: '是',
          en_US: 'Yes'
        };
        detailData.falseMeaning = {
          zh_CN: '否',
          en_US: 'No'
        };
      }
      CommonFieldDs === null || CommonFieldDs === void 0 ? void 0 : CommonFieldDs.loadData([detailData]);
      init === null || init === void 0 ? void 0 : init(detailData);
      CommonFieldDs === null || CommonFieldDs === void 0 ? void 0 : CommonFieldDs.setState('tlsParams', {
        businessObjectFieldId,
        inheritFieldId: inheritFieldId || inheritId
      });
    }, 0);
  };
  const queryLovData = async lovCode => {
    const res = await queryMultiIdpValue(lovCode);
    if (getResponse(res)) {
      setLovData(res);
      // res = res?.map((v) => {
      //   return {
      //     ...v,
      //     meaning: { [getCurrentLanguage()]: v.meaning },
      //   };
      // });
      lovValuesDsSwitch.loadData(res);
    }
  };

  /**
   * 这里的禁用控制逻辑，根据这个文档来：https://shimo.im/sheets/TDPwHgdTWWWhYjXc/dWDMa
   * @param item 渲染的表单项目
   * @returns boolean
   */
  const getDisabled = item => {
    if ((detailData === null || detailData === void 0 ? void 0 : detailData.inheritSourceType) === 'TENANT_CREATED' || (detailData === null || detailData === void 0 ? void 0 : detailData.sourceType) === 'TENANT_CREATED') {
      return false;
    }

    // 中间对象的2个从主字段如果是继承平台的 不能修改
    if (boSourceType !== SourceType.TENANT && isTenant && middleBusinessObjMasterRelationFlag) {
      return true;
    }
    if (middleBusinessObjFlag && (detailData === null || detailData === void 0 ? void 0 : detailData.operationalFlag) === false) {
      // 如果是中间对象，并且编辑的是中间对象默认生成的数据。
      // 只允许编辑：【名称、帮助、描述、引用值列表】其他都要禁用
      return !['businessObjectFieldName', 'helpText', 'remark', 'refValueListBusinessObject', 'optionType', 'optionDisplayFieldObject'].includes(item.name);
    }

    // 视图来源 编辑态禁用
    // if (item?.name === 'optionType' && isEditCurField) {
    //   return true;
    // }

    const flag = isTenant && boSourceType !== SourceType.TENANT && isEditMode && (detailData === null || detailData === void 0 ? void 0 : detailData.componentType) === value && (['exportableFlag'].includes(item === null || item === void 0 ? void 0 : item.name) ||
    // 所有字段类型的是否可导出禁用
    ['APPENDIX'].includes(value) && !isExtensionField && ['fileTypes', 'multipleFlag', 'maxFileSize', 'maxFileCount', 'storageDirectory', 'storageBucketName', 'storageCodeObj', 'fileStorageType'].includes(item === null || item === void 0 ? void 0 : item.name) || ['MASTER_RELATION'].includes(value) && isTenant && !tenantCustomObject && (detailData === null || detailData === void 0 ? void 0 : detailData.inheritSourceType) !== 'EXTEND' && ['masterBusinessObject', 'linkRelationType'].includes(item === null || item === void 0 ? void 0 : item.name) || [
    // 'masterBusinessObject',
    // 'linkRelationType',
    'refValueListBusinessObject', 'optionType'].includes(item === null || item === void 0 ? void 0 : item.name) || ['LINK_RELATION'].includes(value) && isTenant && !tenantCustomObject && (detailData === null || detailData === void 0 ? void 0 : detailData.inheritSourceType) !== 'EXTEND' && ['masterBusinessObject'].includes(item === null || item === void 0 ? void 0 : item.name) || [
    // 'masterBusinessObject',
    'refValueListBusinessObject', 'optionType'].includes(item === null || item === void 0 ? void 0 : item.name) || ['REFERENCE_FIELD'].includes(value) && !isExtensionField && ['refBusinessObject', 'formula'].includes(item === null || item === void 0 ? void 0 : item.name) || ['TEXT_FIELD', 'TEXT_AREA', 'RICH_TEXT', 'NUMBER_FIELD', 'FLOAT', 'PERCENTAGE', 'MONEY', 'PHONE_NUMBER'].includes(value) && ['readOnlyFlag', 'defaultValue', 'defaultValueType'].includes(item === null || item === void 0 ? void 0 : item.name) || ['NUMBER_FIELD', 'FLOAT', 'PERCENTAGE', 'MONEY'].includes(value) && !isExtensionField && ['maxValue', 'minValue'].includes(item === null || item === void 0 ? void 0 : item.name) || ['FLOAT', 'PERCENTAGE', 'MONEY'].includes(value) && !isExtensionField && ['digitalAccuracy'].includes(item === null || item === void 0 ? void 0 : item.name) || ['SWITCH', 'DATE_SELECTION_BOX', 'DATETIME_SELECTION_BOX', 'APPENDIX', 'EMAIL'].includes(value) && ['defaultValue'].includes(item === null || item === void 0 ? void 0 : item.name));
    if (isTenant && boSourceType !== SourceType.TENANT) {
      if (!isExtensionField && (item.name === 'meaningConfig' || item.name === 'defaultValue' || item.name === 'fixDateTime' || item.name === 'optionDisplayFieldObject' || item.name === 'defaultValueType')) {
        // 租户下不能编辑平台的【含义配置】【默认值】【默认值类型】【时间-默认值】【日期时间-默认值】字段
        return true;
      }

      // 租户下编辑自己创建的【扩展字段】
      if (isExtensionField) {
        if (['defaultValue', 'defaultValueType', 'exportableFlag', 'refValueListBusinessObject', 'optionType', 'optionDisplayFieldObject'].includes(item.name)) {
          // 租户自己创建的扩展字段是可以编辑的
          return false;
        }
      }
    }
    // 平台用户可以编辑预置字段-关联关系字段的 视图来源、值集视图、引用值列表、显示字段
    // 模版字段 按照预制的来
    // 更多属性进去 全部禁用
    if (isEditMode && (fieldType === 'PREDEFINED' || detailData !== null && detailData !== void 0 && detailData.templateCode)) {
      // 租户继承平台的 不满足此逻辑
      if (isTenant && boSourceType === SourceType.PLATFORM) {
        return true;
      }
      return !['optionType', 'refValueListBusinessObject', 'optionDisplayFieldObject'].includes(item.name) || fastCreateEnter;
    }

    // 新增逻辑 领域模板字段 创建人/更新人(平台层下) 视图来源/值集视图/显示字段 可编辑
    if (isEditMode && boSourceType === SourceType.PREDEFINE) {
      if (isTenant) {
        return true;
      }
      return !['optionType', 'refValueListBusinessObject', 'optionDisplayFieldObject'].includes(item.name);
    }

    // 租户 继承平台 关联关系多选字段 不能编辑
    if (isTenant && boSourceType !== SourceType.TENANT && componentType === FieldComponentType.MULTIPLE_RELATION) {
      return true;
    }
    return flag;
  };
  const handleMiddleDisabled = item => {
    var _baseInfoDS$current4;
    const middleLinkBusinessObjects = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current4 = baseInfoDS.current) === null || _baseInfoDS$current4 === void 0 ? void 0 : _baseInfoDS$current4.get('middleLinkBusinessObjects');
    if (middleDisabled && middleLinkBusinessObjects) {
      if ((item === null || item === void 0 ? void 0 : item.name) === 'businessObjectFieldName') {
        return true;
      }
      if ((item === null || item === void 0 ? void 0 : item.name) === 'optionType' || (item === null || item === void 0 ? void 0 : item.name) === 'refValueListBusinessObject') {
        // if (
        //   middleLinkBusinessObjects?.[0]?.first?.businessObjectCode !==
        //   detailData?.masterBusinessObjectCode
        // ) {
        //   return true;
        // }
        return true;
      }
    }
    return false;
  };

  // 生成独立值集
  const handleCreateValueList = async () => {
    var _CommonFieldDs$curren13;
    const _ref5 = ((_CommonFieldDs$curren13 = CommonFieldDs.current) === null || _CommonFieldDs$curren13 === void 0 ? void 0 : _CommonFieldDs$curren13.toData()) || {},
      trueMeaning = _ref5.trueMeaning,
      falseMeaning = _ref5.falseMeaning;
    const handleResponse = res => {
      var _res$content;
      if (!getResponse(res)) {
        return false;
      }
      if (!CommonFieldDs.current) {
        return;
      }
      CommonFieldDs.current.set('meaningConfig', 'valueList');
      CommonFieldDs.current.set('valueList', res === null || res === void 0 ? void 0 : (_res$content = res.content) === null || _res$content === void 0 ? void 0 : _res$content[0]);
    };
    return _Modal.open({
      title: intl.get('hmde.bo.businessObject.valueList.create').d('值集定义'),
      key: _Modal.key(),
      border: false,
      autoCenter: true,
      children: /*#__PURE__*/React.createElement(LovDefineModal, {
        businessObjectCode: businessObjectCode,
        valueList: [{
          value: 1,
          meaning: trueMeaning
        }, {
          value: 0,
          meaning: falseMeaning
        }],
        selectDs: CommonFieldDs,
        onResponse: handleResponse,
        valuesListProps: {
          operationColumnHidden: true,
          readonlyFields: ['value']
        }
      })
    });
  };
  const checkRender = item => {
    var _CommonFieldDs$curren17, _CommonFieldDs$curren18;
    if (item.name === 'defaultValue') {
      var _CommonFieldDs$curren14, _CommonFieldDs$curren16;
      // 非日期、 日期时间字段的默认值处理逻辑 只有固定值才展示固定日期时间
      if (!['DATETIME_SELECTION_BOX', 'DATE_SELECTION_BOX'].includes(value) && ((_CommonFieldDs$curren14 = CommonFieldDs.current) === null || _CommonFieldDs$curren14 === void 0 ? void 0 : _CommonFieldDs$curren14.get('defaultValueType')) === 'NORMAL') {
        var _CommonFieldDs$curren15;
        return ((_CommonFieldDs$curren15 = CommonFieldDs.current) === null || _CommonFieldDs$curren15 === void 0 ? void 0 : _CommonFieldDs$curren15.get('defaultValueType')) === 'NORMAL';
        // 日期、 日期时间的默认值的处理逻辑 系统当前日期和固定值才展示 固定日期时间
      } else if (['DATETIME_SELECTION_BOX', 'DATE_SELECTION_BOX'].includes(value) && ['fix'].includes((_CommonFieldDs$curren16 = CommonFieldDs.current) === null || _CommonFieldDs$curren16 === void 0 ? void 0 : _CommonFieldDs$curren16.get('fixDateTime'))) {
        return true;
      }
      return false;
    }
    if (item.name === 'optionDisplayFieldObject' && ((_CommonFieldDs$curren17 = CommonFieldDs.current) === null || _CommonFieldDs$curren17 === void 0 ? void 0 : _CommonFieldDs$curren17.get('optionType')) !== 'LOV_VIEW' && ![PhysicalModelType.API, PhysicalModelType.SQL].includes(physicalModelType)) {
      return false;
    }
    if (item.name === 'midBoMasterRelationShowField' && ((_CommonFieldDs$curren18 = CommonFieldDs.current) === null || _CommonFieldDs$curren18 === void 0 ? void 0 : _CommonFieldDs$curren18.get('masterOptionType')) !== 'LOV_VIEW') {
      return false;
    }

    // 附件multipleFlag固定为true
    if (item.name === 'multipleFlag') return false;
    if (!item.Render) return false;
    return true;
  };
  const renderFormItem = (items = []) => {
    if (!Array.isArray(items) || !items.length) return null;
    let _items = [...items];

    // sql 对象去除是否多语言 默认值类型
    if (physicalModelType === PhysicalModelType.SQL) {
      _items = _items.filter(v => !['multiLanguageFlag', 'defaultValueType', 'fixDateTime'].includes(v.name));
    }

    // 继承行为 不展示默认值 (创建)
    if (fieldBehavior && !isEditMode) {
      var _items2;
      _items = (_items2 = _items) === null || _items2 === void 0 ? void 0 : _items2.filter(v => !['fixDateTime', 'minValue', 'maxValue'].includes(v === null || v === void 0 ? void 0 : v.name));
    }

    // 中间对象属性 没开启扩展表模式 隐藏 扩展物理模型名称 (租户也隐藏)
    if (componentType === FieldComponentType.MULTIPLE_RELATION && (!extendTableEnabledFlag || isTenant)) {
      var _items3;
      _items = (_items3 = _items) === null || _items3 === void 0 ? void 0 : _items3.filter(v => !['middleBusinessObject.extendsTableName'].includes(v === null || v === void 0 ? void 0 : v.name));
    }
    return _items.map(item => {
      var _baseInfoDS$current5;
      if (!checkRender(item)) return null;
      return item.Render({
        isExtensionField,
        refState,
        setRefState,
        refList,
        preDisabled: boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode,
        currentFormula,
        currentHelpText,
        showTipFlag,
        usedInfo: detailData === null || detailData === void 0 ? void 0 : detailData.usedInfo,
        disabled: !(tenantSqlObjectDisabled && (item === null || item === void 0 ? void 0 : item.name) === 'businessObjectFieldName') &&
        // 租户继承平台自定义SQL对象 字段名称可编辑 其余不可编辑
        disabled && boSourceType !== SourceType.PREDEFINE ||
        // 额外增加的禁用规则放在这
        // businessObjectPublished &&
        // (detailData?.componentType === value &&
        //   detailData?.businessObjectFieldId &&
        //   isTenant &&
        //   !tenantCustomObject &&
        //   detailData?.inheritSourceType !== 'EXTEND' &&
        //   [
        //     // 编辑态时没有切换其他字段类型 那么它的关联方式、关联对象字段不可编辑
        //     'linkRelationType',
        //     'masterBusinessObject',
        //   ].includes(item?.name)) ||
        getDisabled(item) ||
        // (dimensionFlag && ["businessObjectFieldName", "maxLength", "requiredFlag"].includes(item?.name)),
        dimensionFlag || handleMiddleDisabled(item),
        // 多选字段 中间对象 禁用逻辑
        // 租户层部分字段属性禁用
        requireFlag,
        boSourceType,
        physicalModelType,
        domainCode: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current5 = baseInfoDS.current) === null || _baseInfoDS$current5 === void 0 ? void 0 : _baseInfoDS$current5.get('domainCode'),
        oldComponentType,
        componentModifiedFlag: detailData === null || detailData === void 0 ? void 0 : detailData.componentModifiedFlag,
        extendTableEnabledFlag,
        middleBusinessObject: detailData === null || detailData === void 0 ? void 0 : detailData.middleBusinessObject
      }, CommonFieldDs.current);
    });
  };

  // 默认值字段在样式上比较特殊，需要单独拿出来做渲染
  const renderSpecialDefaultValueField = () => {
    var _fields$defaultValueF, _CommonFieldDs$curren19, _CommonFieldDs$curren20, _CommonFieldDs$curren21;
    if (!(fields !== null && fields !== void 0 && (_fields$defaultValueF = fields.defaultValueField) !== null && _fields$defaultValueF !== void 0 && _fields$defaultValueF.length)) return;
    const isSwitchFlag = value === 'SWITCH';
    const showEditorFlag = ((_CommonFieldDs$curren19 = CommonFieldDs.current) === null || _CommonFieldDs$curren19 === void 0 ? void 0 : _CommonFieldDs$curren19.get('defaultValueType')) === 'EXPRESSION' || ((_CommonFieldDs$curren20 = CommonFieldDs.current) === null || _CommonFieldDs$curren20 === void 0 ? void 0 : _CommonFieldDs$curren20.get('fixDateTime')) === 'EXPRESSION';
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Form, {
      columns: 2,
      dataSet: CommonFieldDs,
      disabled: boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode
      // useColon={false}
      ,
      labelAlign: "left"
    }, renderFormItem(fields === null || fields === void 0 ? void 0 : fields.defaultValueField)), showEditorFlag && /*#__PURE__*/React.createElement(React.Fragment, null, isSwitchFlag && /*#__PURE__*/React.createElement(_Alert, {
      message: intl.get('hmde.bo.businessObject.switchTypeTips').d('表达式结果需为开关类型。'),
      type: "info",
      showIcon: true
    }), /*#__PURE__*/React.createElement(FormulaEditor, {
      ref: formulaEditorRef,
      key: (_CommonFieldDs$curren21 = CommonFieldDs.current) === null || _CommonFieldDs$curren21 === void 0 ? void 0 : _CommonFieldDs$curren21.getPristineValue('defaultValue'),
      name: "defaultValue",
      initErrorMessage: !refState && (refList === null || refList === void 0 ? void 0 : refList.message),
      formDs: CommonFieldDs,
      businessObjectCode: businessObjectCode,
      businessObjectFieldCode: detailData === null || detailData === void 0 ? void 0 : detailData.businessObjectFieldCode,
      selectedExampleInfo: selectedExampleInfo,
      disabled: disabled || getDisabled(fields.defaultValueField[0]),
      DrillComponentProps: {
        selectObjectCheckFlag: true,
        initDrillParams: {
          drillPublishFlag: false // 传false钻取非发布的数据
        },
        otherDrillParams: physicalModelType === 'API' ? getApiObjectParams(EEnvironmentCode.FIELD_DEFAULT_EXPRESS_DRILL) : {},
        componentTypeList: getDrillFIeldType === null || getDrillFIeldType === void 0 ? void 0 : getDrillFIeldType(['FORMULA', 'REFERENCE_FIELD'])
      },
      hideFieldFlag: isFromDomain
    })));
  };

  // 开关类型字段渲染
  const renderSwitchFiled = () => {
    var _fields$ret, _CommonFieldDs$curren22, _CommonFieldDs$curren23, _CommonFieldDs$curren25;
    if (!((detailData === null || detailData === void 0 ? void 0 : detailData.componentType) === 'SWITCH' || value === 'SWITCH')) return;
    const renderItem = (fields === null || fields === void 0 ? void 0 : (_fields$ret = fields.ret) === null || _fields$ret === void 0 ? void 0 : _fields$ret.find(o => o.name === 'meaningConfig')) || {};
    if (!checkRender(renderItem)) return;
    const disableFlag = disabled || getDisabled(renderItem);
    return ((_CommonFieldDs$curren22 = CommonFieldDs.current) === null || _CommonFieldDs$curren22 === void 0 ? void 0 : _CommonFieldDs$curren22.get('meaningConfig')) === 'valueList' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: styles['row-valueList-wrap']
    }, /*#__PURE__*/React.createElement("div", {
      className: styles['row-valueList']
    }, /*#__PURE__*/React.createElement("div", {
      className: styles['row-valueList-lov']
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-block',
        width: 58
      }
    }, intl.get('hmde.common.valueList').d('值集')), /*#__PURE__*/React.createElement(Lov, {
      style: {
        flex: 1
      },
      dataSet: CommonFieldDs,
      name: "valueList",
      clearButton: false,
      noCache: true,
      disabled: disableFlag
    })), /*#__PURE__*/React.createElement("div", {
      className: styles['valueList-operate']
    }, ((_CommonFieldDs$curren23 = CommonFieldDs.current) === null || _CommonFieldDs$curren23 === void 0 ? void 0 : _CommonFieldDs$curren23.get('lovCode')) && isTenant && /*#__PURE__*/React.createElement(_Tooltip, {
      theme: "light",
      trigger: 'click',
      placement: "bottom"
      // overlayStyle={{ maxHeight: 300, overflow: 'auto' } as any}
      ,
      autoAdjustOverflow: true,
      arrowPointAtCenter: true,
      onHiddenChange: visible => {
        var _CommonFieldDs$curren24;
        const lovCode = (_CommonFieldDs$curren24 = CommonFieldDs.current) === null || _CommonFieldDs$curren24 === void 0 ? void 0 : _CommonFieldDs$curren24.get('lovCode');
        if (!visible && lovCode) queryLovData(lovCode);
      },
      title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: styles['meaning-value-container']
      }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.meaning').d('含义')), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.price').d('值'))), (lovData || []).map(item => {
        var _item$meaning;
        return /*#__PURE__*/React.createElement("div", {
          className: styles['meaning-value-container'],
          key: item.vaue
        }, /*#__PURE__*/React.createElement("span", null, item === null || item === void 0 ? void 0 : (_item$meaning = item.meaning) === null || _item$meaning === void 0 ? void 0 : _item$meaning[getCurrentLanguage()]), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null, item.value));
      }))
    }, /*#__PURE__*/React.createElement(_Button, {
      icon: "visibility-o",
      funcType: "flat"
    }, intl.get('hmde.common.lookup').d('查看'))), /*#__PURE__*/React.createElement(_Button, {
      icon: "add",
      funcType: "flat",
      disabled: disabled || boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField,
      onClick: handleCreateValueList
    }, intl.get('hmde.bo.businessObject.valueList.add').d('新建值集'))))), !isTenant && ((_CommonFieldDs$curren25 = CommonFieldDs.current) === null || _CommonFieldDs$curren25 === void 0 ? void 0 : _CommonFieldDs$curren25.get('lovCode')) && /*#__PURE__*/React.createElement("div", {
      className: styles['row-custom']
    }, /*#__PURE__*/React.createElement("div", {
      className: styles['row-custom-header']
    }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.valueListData').d('值集数据'))), /*#__PURE__*/React.createElement(LovValuesList, {
      operateHeaderFlag: true,
      valueListDs: lovValuesDsSwitch,
      disabled: disabled || boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField
    }))) : /*#__PURE__*/React.createElement("div", {
      className: styles['row-custom']
    }, /*#__PURE__*/React.createElement("div", {
      className: styles['lov-value-list-wrap']
    }, /*#__PURE__*/React.createElement(_Row, {
      className: styles['header-txt']
    }, /*#__PURE__*/React.createElement(_Col, {
      className: styles.meaning
    }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.switchStatus').d('开关状态'))), /*#__PURE__*/React.createElement(_Col, {
      className: styles['switch-title'],
      style: {
        paddingLeft: '25px'
      }
    }, /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.businessObject.price').d('值'))), /*#__PURE__*/React.createElement(_Col, {
      style: {
        paddingLeft: '25px'
      }
    }, /*#__PURE__*/React.createElement("div", null, intl.get('hmde.common.meaning').d('含义')))), /*#__PURE__*/React.createElement(_Row, {
      key: "open",
      className: styles['line-content']
    }, /*#__PURE__*/React.createElement(_Col, {
      className: styles.meaning
    }, intl.get('hmde.common.button.open').d('开启')), /*#__PURE__*/React.createElement(_Col, {
      className: styles['divide-line']
    }), /*#__PURE__*/React.createElement(_Col, {
      className: styles['value']
    }, "1"), /*#__PURE__*/React.createElement(_Col, {
      className: styles['divide-line']
    }), /*#__PURE__*/React.createElement(_Col, {
      className: styles['form-layout']
    }, /*#__PURE__*/React.createElement(_Form, {
      dataSet: CommonFieldDs
      // useColon={false}
    }, /*#__PURE__*/React.createElement(_Output, {
      name: "trueMeaning",
      key: "trueMeaning",
      renderer: ({
        record
      }) => {
        return /*#__PURE__*/React.createElement(MultiIntlField, {
          required: true,
          name: "trueMeaning",
          label: intl.get('hmde.common.meaning').d('含义'),
          record: record,
          init: record && (record === null || record === void 0 ? void 0 : record.get('trueMeaning')),
          disabled: disableFlag,
          textFieldStyle: {
            height: '28px'
          },
          single: true
        });
      }
    })))), /*#__PURE__*/React.createElement(_Row, {
      key: "close",
      className: styles['line-content']
    }, /*#__PURE__*/React.createElement(_Col, {
      className: styles.meaning
    }, intl.get('hmde.common.button.close').d('关闭')), /*#__PURE__*/React.createElement(_Col, {
      className: styles['divide-line']
    }), /*#__PURE__*/React.createElement(_Col, {
      className: styles['value']
    }, "0"), /*#__PURE__*/React.createElement(_Col, {
      className: styles['divide-line']
    }), /*#__PURE__*/React.createElement(_Col, {
      className: styles['form-layout']
    }, /*#__PURE__*/React.createElement(_Form, {
      dataSet: CommonFieldDs
      // useColon={false}
    }, /*#__PURE__*/React.createElement(_Output, {
      name: "falseMeaning",
      key: "falseMeaning",
      renderer: ({
        record
      }) => {
        return /*#__PURE__*/React.createElement(MultiIntlField, {
          required: true,
          name: "falseMeaning",
          record: record,
          label: intl.get('hmde.common.meaning').d('含义'),
          init: record && (record === null || record === void 0 ? void 0 : record.get('falseMeaning')),
          disabled: disableFlag,
          textFieldStyle: {
            height: '28px'
          },
          single: true
        });
      }
    }))))), /*#__PURE__*/React.createElement("div", {
      className: styles['row-custom-footer']
    }, /*#__PURE__*/React.createElement("p", null, intl.get('hmde.bo.businessObject.valueList.custom.create.help').d('生成独立值集操作会将自定义的选项内容转化为独立值集，执行后选项会跳转到值集选项，字段选择创建的值集。')), /*#__PURE__*/React.createElement("a", {
      disabled: disabled || boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField,
      onClick: () => handleCreateValueList()
    }, intl.get('hmde.bo.businessObject.valueList.custom.create').d('生成独立值集'))));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Observer, null, () => {
    var _iconRef$current3, _iconRef$current4;
    return /*#__PURE__*/React.createElement("div", null, tipFlag && /*#__PURE__*/React.createElement(_Alert, {
      style: {
        margin: '4px 0 12px 0'
      },
      message: `${intl.get('hmde.common.button.create').d('新建')}${(_iconRef$current3 = iconRef.current) === null || _iconRef$current3 === void 0 ? void 0 : _iconRef$current3.value}${intl.get('hmde.bo.businessObject.fieldsMessage1').d('字段会生成一条默认的业务规则校验')}${(_iconRef$current4 = iconRef.current) === null || _iconRef$current4 === void 0 ? void 0 : _iconRef$current4.value}${intl.get('hmde.bo.businessObject.Legitimacyof').d('的合法性')}。`,
      type: "info",
      showIcon: true
    }), componentType === FieldComponentType.MULTIPLE_RELATION && /*#__PURE__*/React.createElement(_Alert, {
      style: {
        marginBottom: '12px'
      },
      message: intl.get('hmde.bo.businessObject.middleProps.tips').d('字段保存后，将根据该字段配置自动生成/更新当前对象与关联对象的中间对象；当前对象即中间对象的关联对象1，关联对象即中间对象的关联对象2。'),
      type: "info",
      showIcon: true
    }), /*#__PURE__*/React.createElement(_Form, {
      columns: 2,
      dataSet: CommonFieldDs,
      disabled: boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode
      // useColon={false}
      ,
      labelAlign: "left",
      className: styles['common-form']
    }, renderFormItem(fields === null || fields === void 0 ? void 0 : fields.head)), !fieldBehavior || isEditMode ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Form, {
      columns: 2,
      dataSet: CommonFieldDs,
      disabled:
      // 领域模板字段 创建人/更新人(平台层下) 视图来源/值集视图/显示字段 可编辑
      !fieldBehavior && boSourceType === SourceType.PREDEFINE && !['createdBy', 'lastUpdatedBy'].includes(detailData === null || detailData === void 0 ? void 0 : detailData.templateFieldCode) && !isTenant && isEditMode
      // useColon={false}
      ,
      labelAlign: "left"
    }, renderFormItem(fields === null || fields === void 0 ? void 0 : fields.ret)), renderSwitchFiled(), componentType === FieldComponentType.MULTIPLE_RELATION && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionTitle, {
      title: intl.get('hmde.bo.businessObject.middleProps').d('中间对象属性')
    }), /*#__PURE__*/React.createElement(_Alert, {
      style: {
        marginBottom: '12px'
      },
      message: /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: '3px'
        }
      }, intl.get('hmde.bo.businessObject.middleProps.tips1').d('字段保存后将以相关属性例如中间对象名称、'), /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 700
        }
      }, intl.get('hmde.bo.businessObject.middleObjectCode').d('中间对象编码')), "\u3001", /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 700
        }
      }, intl.get('hmde.common.label.physicalModelName').d('物理模型名称')), intl.get('hmde.bo.businessObject.middleProps.tips2').d('等生成/更新对应中间对象')), /*#__PURE__*/React.createElement(Lov, {
        dataSet: linkMidBoDs,
        name: "middleBo",
        noCache: true,
        mode: "button",
        color: "primary",
        funcType: "flat",
        clearButton: false,
        icon: "content_copy",
        hidden: isEditMode
      }, intl.get('hmde.bo.businessObject.linkMidBo').d('选择相关中间对象'))),
      type: "info",
      showIcon: true
    }), /*#__PURE__*/React.createElement(_Form, {
      columns: 2,
      dataSet: CommonFieldDs,
      disabled: boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode
      // useColon={false}
      ,
      labelAlign: "left",
      labelWidth: 110
    }, renderFormItem(fields === null || fields === void 0 ? void 0 : fields.middleProps))), middleBusinessObjMasterRelationFlag && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionTitle, {
      title: `${intl.get('hmde.common.busniessObject').d('业务对象')}【${detailData === null || detailData === void 0 ? void 0 : detailData.refBusinessObjectName}】${intl.get('hmde.bo.businessObject.fieldMesNewEnd').d('的关联多选字段信息')}`
    }), /*#__PURE__*/React.createElement(_Form, {
      columns: 2,
      dataSet: CommonFieldDs,
      disabled: boSourceType !== SourceType.TENANT && isTenant,
      labelAlign: "left",
      labelWidth: 110
    }, renderFormItem(fields === null || fields === void 0 ? void 0 : fields.middleBoMasterRelationProps))), /*#__PURE__*/React.createElement(SectionTitle, {
      title: intl.get('hmde.bo.businessObject.otherprops').d('其他属性')
    }), /*#__PURE__*/React.createElement(_Form, {
      columns: 2,
      dataSet: CommonFieldDs,
      disabled: boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode
      // useColon={false}
      ,
      labelAlign: "left",
      labelWidth: 110
    }, renderFormItem(fields === null || fields === void 0 ? void 0 : fields.otherProps)), /*#__PURE__*/React.createElement(_Form, {
      columns: 2,
      dataSet: CommonFieldDs,
      disabled: boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode
      // useColon={false}
      ,
      labelAlign: "left"
    }, renderFormItem(fields === null || fields === void 0 ? void 0 : fields.defaultValueType)), renderSpecialDefaultValueField()) :
    /*#__PURE__*/
    // 领域继承 特殊处理
    React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionTitle, {
      title: intl.get('hmde.bo.businessObject.otherprops').d('其他属性')
    }), /*#__PURE__*/React.createElement(_Form, {
      columns: 2,
      dataSet: CommonFieldDs,
      disabled: boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode
      // useColon={false}
      ,
      labelAlign: "left"
    }, renderFormItem(fields === null || fields === void 0 ? void 0 : fields.fieldBehaviorProps))));
  }));
}
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(CommonField);