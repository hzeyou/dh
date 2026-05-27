import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Row from "choerodon-ui/lib/row";
import _Col from "choerodon-ui/lib/col";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _Alert from "@hzero-front-ui/c7n-ui/lib/Alert";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _isFunction from "lodash/isFunction";
import _isArray from "lodash/isArray";
import _cloneDeep from "lodash/cloneDeep";
import _pick from "lodash/pick";
import _omitBy from "lodash/omitBy";
/* eslint-disable no-unused-expressions */
import React, { useRef, useState, useMemo, useEffect, useImperativeHandle } from 'react';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import qs from 'querystring';
import { LabelAlign } from 'choerodon-ui/pro/lib/form/enum';
import { getResponse, isTenantRoleLevel } from 'utils/utils';
import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import { useHistory } from 'react-router';
import { SourceType, FieldType } from "hzero-front-apaas/lib/constants/businessObject";
import IconPicker from "hzero-front-hmde/lib/businessComponents/IconPicker";
import SectionTitle from "hzero-front-apaas/lib/components/SectionTitle";
import { dataSourceFn } from "hzero-front-hmde/lib/businessComponents/IconPicker/enums";
import { renderModalConfirm } from "hzero-front-apaas/lib/utils/render";
import { dominFieldExtendsDS } from "hzero-front-hmde/lib/stores/Domain/DomainDS";
import { createBusinessObjectField, updateBusinessObjectField, getBusinessObjectField, getTemplateField, createPlateformExtensionBusinessObjectField, updatePlateformExtensionBusinessObjectField, getPlateformExtensionBusinessObjectField, createTenantExtensionBusinessObjectField, getTenantBusinessObjectFieldDetail, createDomainTemplateField, editDomainTemplateField, handleDeleteCheckApi, handleBoDeleteCheckApi, deleteBoFieldList, deleteBo } from "hzero-front-hmde/lib/services/businessObjectService";
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
import { PhysicalModelType } from "hzero-front-hmde/lib/constants/businessObject";
import { TAB_KEYS } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/TabItemList";
import { SQL_PARAM_CATEGORY } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/SqlMaintenance/datasets/sqlParamsDS";
import MultipleRelationPub from "hzero-front-hmde/lib/routes/BusinessObject/Detail/FieldsList/FieldComponents/MultipleRelation/MultipleRelationPub";
import styles from "./index.less?modules";
import FieldSelect from "../FieldComponents/select";
import CodingRules from "../FieldComponents/CodingRules";
import Formula from "../FieldComponents/formula";
import MultipleRelation from "../FieldComponents/MultipleRelation";
import CommonField from "../FieldComponents/CommonField";
import FieldSource from "./FieldSource";
import ExampleComponent from "./ExampleComponent";
import HeadButtonGroup from "./components/HeadButtonGroup";
// import { FieldSourceType } from '../constants/constants';
import { polyfillData, viewTypeApi, handleFieldChange, handleFieldSave } from "./utils";
const isTenant = isTenantRoleLevel();
/**
 * 从已有数据源中获取符合callback条件的字段类型信息
 * @param callback
 */
const getFieldItem = callback => {
  var _dataSourceFn, _dataSourceFn$forEach;
  let childrenList = [];
  dataSourceFn === null || dataSourceFn === void 0 ? void 0 : (_dataSourceFn = dataSourceFn()) === null || _dataSourceFn === void 0 ? void 0 : (_dataSourceFn$forEach = _dataSourceFn.forEach) === null || _dataSourceFn$forEach === void 0 ? void 0 : _dataSourceFn$forEach.call(_dataSourceFn, item => {
    childrenList = [...childrenList, ...item.children];
  });
  const res = childrenList.find(callback);
  return res;
};

// 用于存储当前字段的缓存信息
const store = {
  dataMap: new Map(),
  getItem: key => store.dataMap.get(key),
  setItem: (key, value) => {
    store.dataMap.set(key, value);
  },
  delete: key => {
    store.dataMap.delete(key);
  }
};
const Index = props => {
  var _boStore$getState, _boStore$getState2, _boStore$getState2$cu, _dominFieldExtendsDs$2, _baseInfoDS$current3, _baseInfoDS$current4, _baseInfoDS$current5, _dominFieldExtendsDs$3, _dominFieldExtendsDs$4, _middleLinkBusinessOb, _middleLinkBusinessOb2, _middleLinkBusinessOb3, _middleLinkBusinessOb4, _middleLinkBusinessOb5, _middleLinkBusinessOb6, _middleLinkBusinessOb7, _middleLinkBusinessOb8, _middleLinkBusinessOb9, _middleLinkBusinessOb10, _middleLinkBusinessOb11, _middleLinkBusinessOb12, _middleLinkBusinessOb13, _middleLinkBusinessOb14, _middleLinkBusinessOb15, _middleLinkBusinessOb16, _middleLinkBusinessOb17, _middleLinkBusinessOb18, _middleLinkBusinessOb19, _middleLinkBusinessOb20;
  const history = useHistory();
  const fieldType = props.fieldType,
    published = props.published,
    boSourceType = props.boSourceType,
    inheritFieldId = props.inheritFieldId,
    businessObjectId = props.businessObjectId,
    businessObjectCode = props.businessObjectCode,
    customPrimaryKeyCode = props.customPrimaryKeyCode,
    businessObjectFieldId = props.businessObjectFieldId,
    middleBusinessObjFlag = props.middleBusinessObjFlag,
    tenantSqlObjectDisabled = props.tenantSqlObjectDisabled,
    level = props.level,
    domainId = props.domainId,
    templateFieldId = props.templateFieldId,
    domainTenantId = props.tenantId,
    domainTenantName = props.tenantName,
    _props$selectItemTena = props.selectItemTenantId,
    selectItemTenantId = _props$selectItemTena === void 0 ? '' : _props$selectItemTena,
    _props$predefineDisab = props.predefineDisabled,
    predefineDisabled = _props$predefineDisab === void 0 ? false : _props$predefineDisab,
    _props$templateCode = props.templateCode,
    templateCode = _props$templateCode === void 0 ? '' : _props$templateCode,
    setShowFieldDetail = props.setShowFieldDetail,
    FieldListCache = props.FieldListCache,
    _props$updataFieldLis = props.updataFieldList,
    updataFieldList = _props$updataFieldLis === void 0 ? () => {} : _props$updataFieldLis,
    tenantCustomObject = props.tenantCustomObject,
    domainEnabledFlag = props.domainEnabledFlag,
    extendFieldCreatedFlag = props.extendFieldCreatedFlag,
    businessObjectName = props.businessObjectName,
    readOnlyFlag = props.readOnlyFlag,
    showVersion = props.showVersion,
    extendFieldPrefixRule = props.extendFieldPrefixRule,
    deleteFlag = props.deleteFlag,
    typeKey = props.type,
    listRef = props.listRef,
    _props$isERCreate = props.isERCreate,
    isERCreate = _props$isERCreate === void 0 ? false : _props$isERCreate,
    modal = props.modal,
    okCallback = props.okCallback,
    _props$isApiModelType = props.isApiModelType,
    isApiModelType = _props$isApiModelType === void 0 ? false : _props$isApiModelType,
    _props$isApiCustomTyp = props.isApiCustomType,
    isApiCustomType = _props$isApiCustomTyp === void 0 ? false : _props$isApiCustomTyp,
    handleCloseDetail = props.handleCloseDetail,
    physicalModelType = props.physicalModelType,
    apiModelRecord = props.apiModelRecord,
    apiType = props.apiType,
    businessObjectCategory = props.businessObjectCategory,
    _props$fastCreateEnte = props.fastCreateEnter,
    fastCreateEnter = _props$fastCreateEnte === void 0 ? false : _props$fastCreateEnte,
    fastCreateEnterRecord = props.fastCreateEnterRecord,
    _props$fastCreateEnte2 = props.fastCreateEnterIsEidt,
    fastCreateEnterIsEidt = _props$fastCreateEnte2 === void 0 ? true : _props$fastCreateEnte2,
    noSaveRelationFieldList = props.noSaveRelationFieldList,
    useType = props.useType,
    outComponentType = props.outComponentType;
  const saveSessionStorage = () => {
    sessionStorage.setItem('domainInfo', JSON.stringify({
      level,
      tenantId: domainTenantId,
      tenantName: domainTenantName,
      domainId,
      selectItemTenantId
    }));
  };
  const boStore = useBoStore();
  const hasPermission = (_boStore$getState = boStore === null || boStore === void 0 ? void 0 : boStore.getState('hasPermission')) !== null && _boStore$getState !== void 0 ? _boStore$getState : true;
  const baseInfoDS = boStore === null || boStore === void 0 ? void 0 : boStore.getState('baseInfoDS');
  const middleLinkBusinessObjects = boStore === null || boStore === void 0 ? void 0 : (_boStore$getState2 = boStore.getState('baseInfoDS')) === null || _boStore$getState2 === void 0 ? void 0 : (_boStore$getState2$cu = _boStore$getState2.current) === null || _boStore$getState2$cu === void 0 ? void 0 : _boStore$getState2$cu.get('middleLinkBusinessObjects');
  const iconRef = useRef();
  const pubRef = useRef();
  const prevComponentType = useRef(''); // 记录改变前的组件类型
  const childrenComRef = useRef(); // 用于拿子组件的回调
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    loading = _useState2[0],
    setLoading = _useState2[1];
  const _useState3 = useState(),
    _useState4 = _slicedToArray(_useState3, 2),
    detailData = _useState4[0],
    setDetailData = _useState4[1];
  // const [sourceType, setSourceType] = useState<string>(currentSourceType);
  // const [releaseLoading, setReleaseLoading] = useState(false);
  const _useState5 = useState(''),
    _useState6 = _slicedToArray(_useState5, 2),
    componentType = _useState6[0],
    setComponentType = _useState6[1];
  const _useState7 = useState(),
    _useState8 = _slicedToArray(_useState7, 2),
    hoverExampleInfo = _useState8[0],
    setHoverExampleInfo = _useState8[1];
  const _useState9 = useState(),
    _useState10 = _slicedToArray(_useState9, 2),
    selectComponentName = _useState10[0],
    setSelectComponentName = _useState10[1];
  const _useState11 = useState(),
    _useState12 = _slicedToArray(_useState11, 2),
    selectedExampleInfo = _useState12[0],
    setSelectedExampleInfo = _useState12[1];
  const _useState13 = useState(),
    _useState14 = _slicedToArray(_useState13, 2),
    oldComponentType = _useState14[0],
    setOldComponentType = _useState14[1];
  const _useState15 = useState(''),
    _useState16 = _slicedToArray(_useState15, 2),
    inheritId = _useState16[0],
    setInheritId = _useState16[1];
  const _useState17 = useState(false),
    _useState18 = _slicedToArray(_useState17, 2),
    apiRuleCodeEidt = _useState18[0],
    setApiRuleCodeEidt = _useState18[1];
  const isEditMode = !!businessObjectFieldId || !!inheritFieldId || !!templateFieldId || apiRuleCodeEidt; // 是否为编辑
  const isEditCurField = isEditMode && (detailData === null || detailData === void 0 ? void 0 : detailData.componentType) === (selectedExampleInfo === null || selectedExampleInfo === void 0 ? void 0 : selectedExampleInfo.value); // 编辑态 并且相信字段类型和当前选中字段类型一致

  // 中间对象那俩个从主字段不能删除 不能切换类型
  const middleDisabled = useMemo(() => componentType === FieldComponentType.MASTER_RELATION && middleBusinessObjFlag, [componentType, middleBusinessObjFlag]);

  // 领域的扩展表示和业务对象的扩展表示不一样
  const isExtensionField = [FieldType.EXTEND, FieldType.EXTEND_TABLE, FieldType.FLEX_FIELD, FieldType.TENANT_CREATED // 租户继承平台对象自建扩展字段
  ].includes(fieldType); // 是否为扩展字段
  const isFromDomain = domainId && !businessObjectId; // 是否从领域入口跳转

  const allPlugin = useMemo(() => ({
    select: FieldSelect,
    CodingRules,
    formula: Formula,
    CommonField,
    MultipleRelation
  }), [selectComponentName]);
  useEffect(() => {
    if (isERCreate) {
      modal === null || modal === void 0 ? void 0 : modal.handleOk(async () => {
        let flag = await handleSave('save');
        flag = !!(flag && !flag.failed);
        if (flag) {
          okCallback === null || okCallback === void 0 ? void 0 : okCallback();
        }
        return flag;
      });
    }
    if (fastCreateEnter) {
      modal === null || modal === void 0 ? void 0 : modal.handleOk(async () => {
        fastCreateEnterRecord && (fastCreateEnterRecord === null || fastCreateEnterRecord === void 0 ? void 0 : fastCreateEnterRecord.setState('updateInfoFlag', false));
        handleSave('save');
        return false;
      });
    }
  });

  // 继承行为
  const dominFieldExtendsDs = useMemo(() => new _DataSet(dominFieldExtendsDS()), []);
  useDataSetEvents(dominFieldExtendsDs, 'update', ({
    value
  }) => {
    if (value) {
      var _iconRef$current;
      let extendsTypeObj = {};
      let cType = '';
      if (value === 'tenantId' || value === 'objectVersionNumber') {
        extendsTypeObj = {
          value: 'NUMBER_FIELD',
          componentName: 'CommonField'
        };
        cType = 'NUMBER_FIELD';
      }
      if (value === 'creationDate' || value === 'lastUpdateDate') {
        extendsTypeObj = {
          value: 'DATETIME_SELECTION_BOX',
          componentName: 'CommonField'
        };
        cType = 'DATETIME_SELECTION_BOX';
      }
      if (value === 'createdBy' || value === 'lastUpdatedBy') {
        extendsTypeObj = {
          value: 'LINK_RELATION',
          componentName: 'CommonField'
        };
        cType = 'LINK_RELATION';
      }
      handleTypeChange(extendsTypeObj);
      const currentItem = getFieldItem(item => item.value === cType);
      (_iconRef$current = iconRef.current) === null || _iconRef$current === void 0 ? void 0 : _iconRef$current.setValue(currentItem);
      setHoverExampleInfo(currentItem);
    } else {
      var _iconRef$current2;
      (_iconRef$current2 = iconRef.current) === null || _iconRef$current2 === void 0 ? void 0 : _iconRef$current2.setValue(undefined);
      setSelectComponentName(undefined);
      setHoverExampleInfo(undefined);
    }
  });
  useEffect(() => {
    init();
    return () => {
      // 组件卸载清除缓存数据
      store.dataMap.clear();
    };
  }, [businessObjectFieldId, inheritFieldId]);

  // 字段编码前缀
  const getAddonBefore = useMemo(() => {
    return extendFieldPrefixRule || '';
  }, [extendFieldPrefixRule]);

  /**
   * 校验字段编码前缀
   */
  const checkFieldPrefix = () => {
    const codeErrorFlag = isTenant && getAddonBefore && (getAddonBefore.length > 30 || !/^[a-z][0-9a-zA-Z]{0,}$/.test(getAddonBefore));
    if (codeErrorFlag) {
      notification.error({
        message: intl.get('hmde.bo.businessObject.codeTypeErrorTitle').d('编码前缀格式错误'),
        description: intl.get('hmde.bo.businessObject.codeTypeErrorDetail').d('字段编码前缀格式错误，请至HZERO租户-领域控制处修改字段编码前缀')
      });
      return false;
    }
    return true;
  };

  // api自定义属性进来 需要重置 小数位数的 效验规则
  const setDigitalAccuracyValidator = currentDs => {
    if ((apiModelRecord === null || apiModelRecord === void 0 ? void 0 : apiModelRecord.get('paramType')) === 'BigDecimal' && !viewTypeApi(apiModelRecord, apiType)) {
      var _childrenComRef$curre, _childrenComRef$curre2, _childrenComRef$curre3, _childrenComRef$curre4;
      const decimalDigits = (apiModelRecord === null || apiModelRecord === void 0 ? void 0 : apiModelRecord.get('decimalDigits')) || 2;
      (_childrenComRef$curre = childrenComRef.current) === null || _childrenComRef$curre === void 0 ? void 0 : (_childrenComRef$curre2 = _childrenComRef$curre[currentDs]) === null || _childrenComRef$curre2 === void 0 ? void 0 : (_childrenComRef$curre3 = _childrenComRef$curre2.current) === null || _childrenComRef$curre3 === void 0 ? void 0 : (_childrenComRef$curre4 = _childrenComRef$curre3.getField('digitalAccuracy')) === null || _childrenComRef$curre4 === void 0 ? void 0 : _childrenComRef$curre4.set('validator', recordValue => {
        if (recordValue > decimalDigits || recordValue < 1 || !recordValue) {
          return `
              ${intl.get('hmde.bo.businessObject.errorValidator1').d(`映射API参数小数位数为`)}
              ${decimalDigits},
              ${intl.get('hmde.bo.businessObject.errorValidator2').d(`字段允许修改范围为`)}
              ${1 - decimalDigits})
            `;
        }
      });
    }
  };

  // 自带数据进来(需要调用接口)
  const customFieldInit = () => {
    var _res5, _res6, _res7, _iconRef$current3;
    let res = {};
    if (isApiCustomType) {
      var _res, _res2;
      res = apiModelRecord === null || apiModelRecord === void 0 ? void 0 : apiModelRecord.get('apiCustom');
      res._token = apiModelRecord === null || apiModelRecord === void 0 ? void 0 : apiModelRecord.get('_token');
      res.businessObjectFieldName = ((_res = res) === null || _res === void 0 ? void 0 : _res.fieldName) || (apiModelRecord === null || apiModelRecord === void 0 ? void 0 : apiModelRecord.get('paramDescription'));
      res.businessObjectFieldCode = (_res2 = res) === null || _res2 === void 0 ? void 0 : _res2.paramName;
      if (['SINGLE_SELECT', 'MULTIPLE_SELECT'].includes(res.componentType)) {
        var _res3;
        res.attributeJson && (res.attributeJson.optionSettings = (_res3 = res) !== null && _res3 !== void 0 && _res3.lovCode ? '_valueList' : '_custom');
      }
      if (['CODE_RULE'].includes(res.componentType) && res.ruleCode) {
        setApiRuleCodeEidt(true);
      }
    }
    if (fastCreateEnter) {
      res = (fastCreateEnterRecord === null || fastCreateEnterRecord === void 0 ? void 0 : fastCreateEnterRecord.toData()) || {};
    }
    if (getAddonBefore) {
      var _res4, _res4$businessObjectF;
      res.businessObjectFieldCode = (_res4 = res) === null || _res4 === void 0 ? void 0 : (_res4$businessObjectF = _res4.businessObjectFieldCode) === null || _res4$businessObjectF === void 0 ? void 0 : _res4$businessObjectF.substring(getAddonBefore.length);
    }
    polyfillData(res); // 历史数据修复
    setDetailData(res); // 缓存详情数据
    setComponentType((_res5 = res) === null || _res5 === void 0 ? void 0 : _res5.componentType);
    setOldComponentType((_res6 = res) === null || _res6 === void 0 ? void 0 : _res6.componentType);
    // setSourceType(currentSourceType);
    prevComponentType.current = (_res7 = res) === null || _res7 === void 0 ? void 0 : _res7.componentType;
    const obj = getFieldItem(item => {
      var _res8;
      return item.value === ((_res8 = res) === null || _res8 === void 0 ? void 0 : _res8.componentType);
    });
    const currentDs = `${obj === null || obj === void 0 ? void 0 : obj.componentName}Ds`;
    // eslint-disable-next-line no-unused-expressions
    (_iconRef$current3 = iconRef.current) === null || _iconRef$current3 === void 0 ? void 0 : _iconRef$current3.setValue(obj);
    setSelectComponentName(obj === null || obj === void 0 ? void 0 : obj.componentName);
    setSelectedExampleInfo(obj);
    setTimeout(() => {
      // childrenComRef.current?.[currentDs]?.loadData([res]);
      // childrenComRef?.current?.customInitChild?.(res);
      // childrenComRef.current?.[currentDs]?.setState('tlsParams', {
      //   businessObjectFieldId,
      //   inheritFieldId: inheritFieldId || _inheritId,
      // });

      if (isApiCustomType) {
        var _childrenComRef$curre12, _childrenComRef$curre13, _childrenComRef$curre14, _childrenComRef$curre15, _childrenComRef$curre16, _childrenComRef$curre17, _childrenComRef$curre18;
        // 设置字段必输
        if (apiModelRecord !== null && apiModelRecord !== void 0 && apiModelRecord.get('requiredFlag')) {
          var _childrenComRef$curre5, _childrenComRef$curre6, _childrenComRef$curre7, _childrenComRef$curre8, _childrenComRef$curre9, _childrenComRef$curre10, _childrenComRef$curre11;
          (_childrenComRef$curre5 = childrenComRef.current) === null || _childrenComRef$curre5 === void 0 ? void 0 : (_childrenComRef$curre6 = _childrenComRef$curre5[currentDs]) === null || _childrenComRef$curre6 === void 0 ? void 0 : (_childrenComRef$curre7 = _childrenComRef$curre6.current) === null || _childrenComRef$curre7 === void 0 ? void 0 : _childrenComRef$curre7.set('requiredFlag', true);
          (_childrenComRef$curre8 = childrenComRef.current) === null || _childrenComRef$curre8 === void 0 ? void 0 : (_childrenComRef$curre9 = _childrenComRef$curre8[currentDs]) === null || _childrenComRef$curre9 === void 0 ? void 0 : (_childrenComRef$curre10 = _childrenComRef$curre9.current) === null || _childrenComRef$curre10 === void 0 ? void 0 : (_childrenComRef$curre11 = _childrenComRef$curre10.getField('requiredFlag')) === null || _childrenComRef$curre11 === void 0 ? void 0 : _childrenComRef$curre11.set('disabled', true);
        }
        // 编码字段禁用
        (_childrenComRef$curre12 = childrenComRef.current) === null || _childrenComRef$curre12 === void 0 ? void 0 : (_childrenComRef$curre13 = _childrenComRef$curre12[currentDs]) === null || _childrenComRef$curre13 === void 0 ? void 0 : (_childrenComRef$curre14 = _childrenComRef$curre13.current) === null || _childrenComRef$curre14 === void 0 ? void 0 : _childrenComRef$curre14.set('businessObjectFieldCode', apiModelRecord === null || apiModelRecord === void 0 ? void 0 : apiModelRecord.get('paramName'));
        (_childrenComRef$curre15 = childrenComRef.current) === null || _childrenComRef$curre15 === void 0 ? void 0 : (_childrenComRef$curre16 = _childrenComRef$curre15[currentDs]) === null || _childrenComRef$curre16 === void 0 ? void 0 : (_childrenComRef$curre17 = _childrenComRef$curre16.current) === null || _childrenComRef$curre17 === void 0 ? void 0 : (_childrenComRef$curre18 = _childrenComRef$curre17.getField('businessObjectFieldCode')) === null || _childrenComRef$curre18 === void 0 ? void 0 : _childrenComRef$curre18.set('disabled', true);
        // 小数位数的设置
        setDigitalAccuracyValidator(currentDs);
      }
    }, 0);
  };

  // 编辑初始化查询
  const init = _inheritId => {
    // api类型业务对象 自定义字段
    if (isApiCustomType || fastCreateEnter && (!(businessObjectFieldId || inheritFieldId) || fastCreateEnterRecord !== null && fastCreateEnterRecord !== void 0 && fastCreateEnterRecord.getState('editType')) && !templateFieldId) {
      customFieldInit();
      setInheritId(_inheritId);
      return;
    }
    checkFieldPrefix();
    if (isEditMode) {
      // 进入编辑态
      setLoading(true);
      // 扩展字段调用不同接口
      let getDetailName = isExtensionField ? getPlateformExtensionBusinessObjectField : getBusinessObjectField;
      if (isTenant && boSourceType !== SourceType.TENANT) {
        getDetailName = getTenantBusinessObjectFieldDetail;
      }
      let query = {
        version: showVersion,
        componentType: outComponentType
      };
      if (templateFieldId) {
        getDetailName = getTemplateField;
        getDetailName({
          templateFieldId,
          query
        }).then(res => {
          setLoading(false);
          if (res && !res.failed) {
            var _iconRef$current4;
            setDetailData(res); // 缓存详情数据
            setComponentType(res === null || res === void 0 ? void 0 : res.componentType);
            setOldComponentType(res === null || res === void 0 ? void 0 : res.componentType);
            // setSourceType(currentSourceType);
            const obj = getFieldItem(item => item.value === (res === null || res === void 0 ? void 0 : res.componentType));
            // const currentDs = `${obj?.componentName}Ds`;
            // eslint-disable-next-line no-unused-expressions
            (_iconRef$current4 = iconRef.current) === null || _iconRef$current4 === void 0 ? void 0 : _iconRef$current4.setValue(obj);
            setSelectComponentName(obj === null || obj === void 0 ? void 0 : obj.componentName);
            setSelectedExampleInfo(obj);
            // setTimeout(() => {
            //   childrenComRef.current?.[currentDs]?.loadData([res]);
            //   childrenComRef?.current?.customInitChild?.(res);
            //   childrenComRef.current?.[currentDs]?.setState('tlsParams', {
            //     businessObjectFieldId,
            //     inheritFieldId,
            //   });
            // }, 0);
            dominFieldExtendsDs === null || dominFieldExtendsDs === void 0 ? void 0 : dominFieldExtendsDs.removeAll();
            if (res !== null && res !== void 0 && res.fieldBehavior) {
              dominFieldExtendsDs.loadData([{
                extendsWhoField: res.fieldBehavior
              }]);
            }
          } else {
            notification.error({
              message: intl.get('hmde.common.errorMes').d('错误信息'),
              description: res.message
            });
          }
        }).catch(err => {
          setLoading(false);
          notification.error({
            message: intl.get('hmde.common.errorMes').d('错误信息'),
            description: err.message
          });
        });
        return true;
      }
      if (isTenant && boSourceType !== SourceType.TENANT) {
        query = {
          version: showVersion,
          businessObjectFieldId,
          businessObjectId,
          inheritFieldId: inheritFieldId || _inheritId,
          componentType: outComponentType
        };
      }
      getDetailName({
        businessObjectFieldId,
        query
      }).then(res => {
        setLoading(false);
        if (res && !res.failed) {
          var _iconRef$current5;
          polyfillData(res); // 历史数据修复
          setDetailData(res); // 缓存详情数据
          setComponentType(res === null || res === void 0 ? void 0 : res.componentType);
          setOldComponentType(res === null || res === void 0 ? void 0 : res.componentType);
          // setSourceType(currentSourceType);
          prevComponentType.current = res === null || res === void 0 ? void 0 : res.componentType;
          const obj = getFieldItem(item => item.value === (res === null || res === void 0 ? void 0 : res.componentType));
          // const currentDs = `${obj?.componentName}Ds`;
          // eslint-disable-next-line no-unused-expressions
          (_iconRef$current5 = iconRef.current) === null || _iconRef$current5 === void 0 ? void 0 : _iconRef$current5.setValue(obj);
          setSelectComponentName(obj === null || obj === void 0 ? void 0 : obj.componentName);
          setSelectedExampleInfo(obj);

          // 字段进入 需要同步下 外面的设置 名称 是否必输 描述 关联对象
          if (fastCreateEnter) {
            const fName = fastCreateEnterRecord === null || fastCreateEnterRecord === void 0 ? void 0 : fastCreateEnterRecord.get('businessObjectFieldName');
            if (fName) {
              res.businessObjectFieldName = fName;
              if (res.inheritFieldId) {
                res.inheritFieldName = fName;
              }
            }
            res.requiredFlag = fastCreateEnterRecord === null || fastCreateEnterRecord === void 0 ? void 0 : fastCreateEnterRecord.get('requiredFlag');
            res.remark = fastCreateEnterRecord === null || fastCreateEnterRecord === void 0 ? void 0 : fastCreateEnterRecord.get('remark');
            if (res.masterBusinessObjectCode !== (fastCreateEnterRecord === null || fastCreateEnterRecord === void 0 ? void 0 : fastCreateEnterRecord.get('masterBusinessObjectCode'))) {
              res.refBusinessObjectName = fastCreateEnterRecord === null || fastCreateEnterRecord === void 0 ? void 0 : fastCreateEnterRecord.get('refBusinessObjectName');
              res.masterBusinessObjectId = fastCreateEnterRecord === null || fastCreateEnterRecord === void 0 ? void 0 : fastCreateEnterRecord.get('masterBusinessObjectId');
              res.masterBusinessObjectCode = fastCreateEnterRecord === null || fastCreateEnterRecord === void 0 ? void 0 : fastCreateEnterRecord.get('masterBusinessObjectCode');
              res.businessObjectOptionCode = '';
              res.businessObjectOptionName = '';
            }
          }
          // setTimeout(() => {
          // childrenComRef.current?.[currentDs]?.loadData([res]);
          // childrenComRef?.current?.customInitChild?.(res);
          // childrenComRef.current?.[currentDs]?.setState('tlsParams', {
          //   businessObjectFieldId,
          //   inheritFieldId: inheritFieldId || inheritId,
          // });
          // }, 0);
        } else {
          notification.error({
            message: intl.get('hmde.common.errorMes').d('错误信息'),
            description: res.message
          });
        }
      }).catch(err => {
        setLoading(false);
        notification.error({
          message: intl.get('hmde.common.errorMes').d('错误信息'),
          description: err.message
        });
      });
    }
  };
  const editComponentTypeFilter = data => {
    var _baseInfoDS$current;
    // sql 对象,类型去除 【公式】【引用】【自动编号】【关联关系多选】
    if (physicalModelType === PhysicalModelType.SQL) {
      const sqlFilterRules = [FieldComponentType.FORMULA, FieldComponentType.REFERENCE_FIELD, FieldComponentType.CODE_RULE, FieldComponentType.MULTIPLE_RELATION];
      data.forEach(item => {
        item.children = item.children.filter(v => !sqlFilterRules.includes(v.key));
      });
      // 查询参数字段去除关联、从主
      if (useType === SQL_PARAM_CATEGORY.QUERY_PARAM) {
        const sqlQueryFilterRules = [FieldComponentType.LINK_RELATION, FieldComponentType.MASTER_RELATION];
        data.forEach(item => {
          item.children = item.children.filter(v => !sqlQueryFilterRules.includes(v.key));
        });
      }
    }

    // 参数对象
    if ((baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('businessObjectCategory')) === 'DIMENSION') {
      data.forEach(item => {
        item.children = item.children.filter(v => ![FieldComponentType.MULTIPLE_RELATION].includes(v.key));
      });
    }
    const textType = [FieldComponentType.TEXT_FIELD,
    // 文本
    FieldComponentType.PHONE_NUMBER,
    // 手机号码
    FieldComponentType.SINGLE_SELECT,
    // 下拉单选
    FieldComponentType.MULTIPLE_SELECT,
    // 下拉多选
    FieldComponentType.RADIO,
    // 单选框
    FieldComponentType.CHECKBOX,
    // 复选
    FieldComponentType.APPENDIX,
    // 附件
    FieldComponentType.EMAIL,
    // 电子邮箱
    FieldComponentType.CODE_RULE];
    // 不可修改
    const cannotChangeType = [
    // 'TEXT_AREA', // 多行文本
    // 'RICH_TEXT', // 富文本
    // 'NUMBER_FIELD', // 整数
    FieldComponentType.SWITCH,
    // 开关
    FieldComponentType.FORMULA,
    // 公式
    // FieldComponentType.DATE_SELECTION_BOX, // 日期
    FieldComponentType.DATETIME_SELECTION_BOX,
    // 日期时间
    FieldComponentType.REFERENCE_FIELD,
    // 引用关系
    FieldComponentType.SINGLE_APPENDIX,
    // 单附件
    // FieldComponentType.LOCATION, // 地图
    FieldComponentType.MULTIPLE_RELATION // 关联关系多选
    ];
    // 关联 从组 可互相切换
    const relationChangeType = [FieldComponentType.LINK_RELATION,
    // 关联关系
    FieldComponentType.MASTER_RELATION // 从主关系
    ];
    // 浮点类型
    const floatType = [FieldComponentType.FLOAT, FieldComponentType.PERCENTAGE, FieldComponentType.MONEY];
    const intType = [FieldComponentType.NUMBER_FIELD, FieldComponentType.LINK_RELATION, FieldComponentType.MASTER_RELATION]; // 整数
    const multiplyTextType = [FieldComponentType.TEXT_AREA, FieldComponentType.RICH_TEXT, FieldComponentType.LOCATION]; // 多行文本类型
    /** 日期类型 */
    const dateType = [FieldComponentType.DATE_SELECTION_BOX, FieldComponentType.DATETIME_SELECTION_BOX]; // 日期类型可以修改为日期时间

    const initComponentType = detailData === null || detailData === void 0 ? void 0 : detailData.componentType; // 编辑态初始字段类型

    /**
     * 2021-M10 特性：允许租户下创建【关联关系，主从关系】.如果将来需要禁用，可改成：false。
     * isDisabledTenantRelationField = true; // 允许创建
     * isDisabledTenantRelationField = false; // 不允许创建
     */
    // 2.1.0Release仍然不允许租户拓展字段创建关联关系和从主关系
    const isDisabledTenantRelationField = true;

    // 新增: 文本类型可以切换为 长文本/地图, 但是不可逆
    if (initComponentType === 'TEXT_FIELD') {
      textType.push(FieldComponentType.TEXT_AREA, FieldComponentType.RICH_TEXT, FieldComponentType.LOCATION);
    }
    if (isTenant && boSourceType !== 'TENANT' && isExtensionField && !isDisabledTenantRelationField) {
      const filterTypeArr = [FieldComponentType.MASTER_RELATION,
      // 从主关系
      FieldComponentType.LINK_RELATION // 关联关系
      ];
      if (isEditMode) {
        return data.map(item => {
          var _item$children;
          return {
            ...item,
            children: ((_item$children = item.children) === null || _item$children === void 0 ? void 0 : _item$children.filter(({
              value
            }) => {
              if (initComponentType && textType.includes(initComponentType)) {
                return textType.includes(value) && !filterTypeArr.includes(value);
              } else if (initComponentType && cannotChangeType.includes(initComponentType)) {
                return false;
              } else if (initComponentType && floatType.includes(initComponentType)) {
                return floatType.includes(value) && !filterTypeArr.includes(value);
              } else if (initComponentType === FieldComponentType.NUMBER_FIELD) {
                return intType.includes(value) && !filterTypeArr.includes(value);
              } else if (initComponentType && multiplyTextType.includes(initComponentType)) {
                return multiplyTextType.includes(value);
              } else if (initComponentType && relationChangeType.includes(initComponentType)) {
                return relationChangeType.includes(value);
              } else if (initComponentType && [FieldComponentType.DATE_SELECTION_BOX].includes(initComponentType)) {
                return dateType.includes(value);
              }
              return !filterTypeArr.includes(value);
            })) || []
          };
        }).filter(({
          children
        }) => children.length);
      } else {
        return data.map(item => {
          var _item$children2;
          return {
            ...item,
            children: ((_item$children2 = item.children) === null || _item$children2 === void 0 ? void 0 : _item$children2.filter(({
              value
            }) => {
              return !filterTypeArr.includes(value);
            })) || []
          };
        }).filter(({
          children
        }) => children.length);
      }
    }
    const isChooseAll = () => {
      // 如果是关联关系多选 不能切
      if (initComponentType === FieldComponentType.MULTIPLE_RELATION) {
        return false;
      }

      // 平台下 如果字段未发布, 可以切换所有类型字段
      if (detailData !== null && detailData !== void 0 && detailData.componentModifiedFlag && !isTenant) {
        return true;
      }
      //  租户自建对象也支持 这个逻辑
      if (detailData !== null && detailData !== void 0 && detailData.componentModifiedFlag && isTenant && boSourceType === SourceType.TENANT) {
        return true;
      }
      // 租户继承平台 创建的字段 如果没有选择扩展字段也可以
      if (detailData !== null && detailData !== void 0 && detailData.componentModifiedFlag && isTenant && boSourceType === SourceType.INHERIT && !detailData.extendFieldId) {
        return true;
      }
      return false;
    };
    if (!isEditMode || isChooseAll()) {
      // 领域新建标准字段
      if (isFromDomain && !isExtensionField) {
        // 过滤 公式字段 引用 从主 自动编号
        const filterTypeArr = [FieldComponentType.FORMULA,
        // 公式
        // FieldComponentType.MASTER_RELATION, // 从主关系
        FieldComponentType.REFERENCE_FIELD,
        // 引用关系
        FieldComponentType.CODE_RULE,
        // 自动编号
        // FieldComponentType.LINK_RELATION,
        FieldComponentType.MULTIPLE_RELATION // 关系类型多选
        ];
        return data.map(item => {
          var _item$children3;
          return {
            ...item,
            children: (_item$children3 = item.children) === null || _item$children3 === void 0 ? void 0 : _item$children3.filter(({
              value
            }) => {
              return !filterTypeArr.includes(value);
            })
          };
        }).filter(({
          children
        }) => children.length);
      }
      // 平台新建扩展字段或租户自定义创建字段
      if ((!isTenant || boSourceType === SourceType.TENANT) && isExtensionField) {
        const platformCreateExtensionFilter = [FieldComponentType.TEXT_FIELD, FieldComponentType.TEXT_AREA,
        // RICH_TEXT,
        FieldComponentType.NUMBER_FIELD, FieldComponentType.FLOAT, FieldComponentType.DATE_SELECTION_BOX, FieldComponentType.DATETIME_SELECTION_BOX, FieldComponentType.SWITCH, FieldComponentType.SINGLE_APPENDIX];
        return data.map(item => {
          var _item$children4;
          return {
            ...item,
            children: (_item$children4 = item.children) === null || _item$children4 === void 0 ? void 0 : _item$children4.filter(({
              value
            }) => {
              return platformCreateExtensionFilter.includes(value);
            })
          };
        }).filter(({
          children
        }) => children.length);
      }
    } else if (isEditMode) {
      var _data$map;
      // 编辑时需要根据保存的字段类型过滤
      // 文本
      return (_data$map = data.map(item => {
        var _item$children5;
        return {
          ...item,
          children: ((_item$children5 = item.children) === null || _item$children5 === void 0 ? void 0 : _item$children5.filter(({
            value
          }) => {
            if (initComponentType && textType.includes(initComponentType)) {
              return textType.includes(value);
            } else if (initComponentType && cannotChangeType.includes(initComponentType)) {
              return false;
            } else if (initComponentType && floatType.includes(initComponentType)) {
              return floatType.includes(value);
            } else if (initComponentType === FieldComponentType.NUMBER_FIELD) {
              return intType.includes(value);
            } else if (initComponentType && multiplyTextType.includes(initComponentType)) {
              return multiplyTextType.includes(value);
            } else if (initComponentType && relationChangeType.includes(initComponentType)) {
              return relationChangeType.includes(value);
            } else if (initComponentType && [FieldComponentType.DATE_SELECTION_BOX].includes(initComponentType)) {
              // 租户不能将日期改为日期时间
              return !isTenant && dateType.includes(value);
            }
            return true;
          })) || []
        };
      })) === null || _data$map === void 0 ? void 0 : _data$map.filter(({
        children
      }) => children.length);
    }

    // 处理备份数据
    let _data = _cloneDeep(data);

    // 中间对象需要过滤【从主】类型的字段创建
    if (middleBusinessObjFlag) {
      const excludeMiddleArr = [FieldComponentType.MASTER_RELATION, FieldComponentType.MULTIPLE_RELATION];
      _data.forEach(o => {
        if (_isArray(o.children)) {
          // eslint-disable-next-line no-param-reassign
          o.children = o.children.filter(oo => !excludeMiddleArr.includes(oo.key));
        }
      });
    }

    // api对象需要过滤引用字段/公式字段/关联关系多选
    if (physicalModelType === 'API') {
      const excludeMiddleArr = [FieldComponentType.REFERENCE_FIELD, FieldComponentType.FORMULA, FieldComponentType.MULTIPLE_RELATION];
      _data.forEach(o => {
        if (_isArray(o.children)) {
          // eslint-disable-next-line no-param-reassign
          o.children = o.children.filter(oo => !excludeMiddleArr.includes(oo.key));
        }
      });
    }

    // api 自定义属性类型需要特殊处理
    if (isApiModelType) {
      var _apiModelRecord$get;
      let includeMiddleArr = [FieldComponentType.TEXT_FIELD];
      switch (apiModelRecord === null || apiModelRecord === void 0 ? void 0 : (_apiModelRecord$get = apiModelRecord.get('paramType')) === null || _apiModelRecord$get === void 0 ? void 0 : _apiModelRecord$get.toLocaleLowerCase()) {
        case 'string':
          includeMiddleArr = [FieldComponentType.TEXT_FIELD, FieldComponentType.TEXT_AREA, FieldComponentType.RICH_TEXT, FieldComponentType.SINGLE_SELECT, FieldComponentType.MULTIPLE_SELECT, FieldComponentType.RADIO, FieldComponentType.CHECKBOX,
          // FieldComponentType.PHONE_NUMBER,
          FieldComponentType.CODE_RULE,
          // FieldComponentType.EMAIL,
          FieldComponentType.APPENDIX, FieldComponentType.LOCATION];
          break;
        case 'byte':
          includeMiddleArr = [FieldComponentType.SWITCH];
          break;
        case 'localdate':
          includeMiddleArr = [FieldComponentType.DATE_SELECTION_BOX];
          break;
        case 'zoneddatetime':
          includeMiddleArr = [FieldComponentType.DATETIME_SELECTION_BOX];
          break;
        case 'bigdecimal':
          includeMiddleArr = [FieldComponentType.FLOAT, FieldComponentType.PERCENTAGE, FieldComponentType.MONEY];
          break;
        case 'long':
          includeMiddleArr = [FieldComponentType.NUMBER_FIELD
          // FieldComponentType.MASTER_RELATION,
          // FieldComponentType.LINK_RELATION,
          ];
          break;
        case 'string(byte[])':
          includeMiddleArr = [FieldComponentType.SINGLE_APPENDIX];
          break;
        default:
          break;
      }
      _data.forEach(o => {
        if (_isArray(o.children)) {
          // eslint-disable-next-line no-param-reassign
          o.children = o.children.filter(oo => includeMiddleArr.includes(oo.key));
        }
      });
      _data = _data.filter(v => v.children.length);
    }

    // 租户继承平台的对象 不能创建 关联关系多选
    // 编辑态 也不能 新建
    if (isTenant && boSourceType !== SourceType.TENANT || isEditMode) {
      const excludeMiddleArr = [FieldComponentType.MULTIPLE_RELATION];
      _data.forEach(o => {
        if (_isArray(o.children)) {
          // eslint-disable-next-line no-param-reassign
          o.children = o.children.filter(oo => !excludeMiddleArr.includes(oo.key));
        }
      });
    }
    return _data;
  };

  // 组件change回调
  const handleTypeChange = (obj = {}) => {
    const oType = componentType;
    const value = obj.value,
      componentName = obj.componentName;
    if (value) {
      const currentDs = `${selectComponentName}Ds`;
      if (!isEditMode && childrenComRef.current) {
        var _childrenComRef$curre19, _childrenComRef$curre20, _childrenComRef$curre21, _formValues$inheritFi, _formValues$businessO;
        // 缓存当前表单公共字段值
        const formValues = ((_childrenComRef$curre19 = childrenComRef.current) === null || _childrenComRef$curre19 === void 0 ? void 0 : (_childrenComRef$curre20 = _childrenComRef$curre19[currentDs]) === null || _childrenComRef$curre20 === void 0 ? void 0 : (_childrenComRef$curre21 = _childrenComRef$curre20.current) === null || _childrenComRef$curre21 === void 0 ? void 0 : _childrenComRef$curre21.toData()) || {};
        store.setItem('commonFieldData', {
          inheritFieldName: formValues === null || formValues === void 0 ? void 0 : formValues.inheritFieldName,
          businessObjectFieldName: formValues === null || formValues === void 0 ? void 0 : formValues.businessObjectFieldName,
          inheritFieldCode: getAddonBefore ? formValues === null || formValues === void 0 ? void 0 : (_formValues$inheritFi = formValues.inheritFieldCode) === null || _formValues$inheritFi === void 0 ? void 0 : _formValues$inheritFi.substring(getAddonBefore.length) : formValues === null || formValues === void 0 ? void 0 : formValues.inheritFieldCode,
          businessObjectFieldCode: getAddonBefore ? formValues === null || formValues === void 0 ? void 0 : (_formValues$businessO = formValues.businessObjectFieldCode) === null || _formValues$businessO === void 0 ? void 0 : _formValues$businessO.substring(getAddonBefore.length) : formValues === null || formValues === void 0 ? void 0 : formValues.businessObjectFieldCode,
          helpText: _cloneDeep(formValues === null || formValues === void 0 ? void 0 : formValues.helpText),
          remark: formValues === null || formValues === void 0 ? void 0 : formValues.remark
          // attributeJson: formValues?.attributeJson,
        });
      }
      const nextDs = `${componentName}Ds`;
      setComponentType(value);
      setSelectedExampleInfo(obj);
      setSelectComponentName(componentName);
      if (!isEditMode) {
        setTimeout(() => {
          const catchObj = store.getItem('commonFieldData');
          if (catchObj) {
            for (const key in catchObj) {
              if (Object.prototype.hasOwnProperty.call(catchObj, key) && catchObj !== null && catchObj !== void 0 && catchObj[key]) {
                var _childrenComRef$curre22, _childrenComRef$curre23, _childrenComRef$curre24;
                // eslint-disable-next-line no-unused-expressions
                (_childrenComRef$curre22 = childrenComRef.current) === null || _childrenComRef$curre22 === void 0 ? void 0 : (_childrenComRef$curre23 = _childrenComRef$curre22[nextDs]) === null || _childrenComRef$curre23 === void 0 ? void 0 : (_childrenComRef$curre24 = _childrenComRef$curre23.current) === null || _childrenComRef$curre24 === void 0 ? void 0 : _childrenComRef$curre24.set(`${key}`, catchObj === null || catchObj === void 0 ? void 0 : catchObj[key]);
              }
            }
          }
        }, 0);
      }
      if (isEditMode) {
        setTimeout(() => {
          var _childrenComRef$curre25, _childrenComRef$curre26, _childrenComRef$curre27, _childrenComRef$curre28, _childrenComRef$curre29, _childrenComRef$curre30, _childrenComRef$curre31, _childrenComRef$curre32, _childrenComRef$curre33, _childrenComRef$curre38, _childrenComRef$curre39, _childrenComRef$curre40, _childrenComRef$curre41;
          const initData = {
            ...detailData,
            attributeJson: {},
            ...((detailData === null || detailData === void 0 ? void 0 : detailData.attributeJson) || {})
          };
          // 富文本默认值类型为固定值时切换 清空默认值
          if (componentType === FieldComponentType.RICH_TEXT && (initData === null || initData === void 0 ? void 0 : initData.defaultValueType) === 'NORMAL') {
            Object.assign(initData, {
              defaultValue: ''
            });
          }
          const fields = [...(((_childrenComRef$curre25 = childrenComRef.current) === null || _childrenComRef$curre25 === void 0 ? void 0 : (_childrenComRef$curre26 = _childrenComRef$curre25[nextDs]) === null || _childrenComRef$curre26 === void 0 ? void 0 : (_childrenComRef$curre27 = _childrenComRef$curre26.fields) === null || _childrenComRef$curre27 === void 0 ? void 0 : (_childrenComRef$curre28 = _childrenComRef$curre27.keys) === null || _childrenComRef$curre28 === void 0 ? void 0 : _childrenComRef$curre28.call(_childrenComRef$curre27)) || [])];
          const flagFields = ['creationDate', 'createdBy', 'lastUpdateDate', 'lastUpdatedBy', '_token', 'tenantId', 'businessObjectFieldCode', 'businessObjectFieldName', 'businessObjectFieldId', 'businessObjectId', 'inheritFieldId', 'objectVersionNumber', 'extendFieldDigitalAccuracy'];
          // 字段类型变更   属性匹配当前类型属性配置
          for (const key in initData) {
            // eslint-disable-next-line no-prototype-builtins
            if (initData !== null && initData !== void 0 && initData.hasOwnProperty(key)) {
              var _detailData$attribute;
              if (!fields.includes(key) && !flagFields.includes(key)) {
                delete initData[key];
              }
              // eslint-disable-next-line no-prototype-builtins
              if ((_detailData$attribute = detailData.attributeJson) !== null && _detailData$attribute !== void 0 && _detailData$attribute.hasOwnProperty(key)) {
                Object.assign(initData.attributeJson, {
                  [key]: initData[key]
                });
                delete initData[key];
              }
              initData.attributeJson = _omitBy(initData.attributeJson, v => v === undefined);
            }
          }
          (_childrenComRef$curre29 = childrenComRef.current) === null || _childrenComRef$curre29 === void 0 ? void 0 : (_childrenComRef$curre30 = _childrenComRef$curre29[nextDs]) === null || _childrenComRef$curre30 === void 0 ? void 0 : _childrenComRef$curre30.loadData([initData]);
          const data = (_childrenComRef$curre31 = childrenComRef.current) === null || _childrenComRef$curre31 === void 0 ? void 0 : (_childrenComRef$curre32 = _childrenComRef$curre31[nextDs]) === null || _childrenComRef$curre32 === void 0 ? void 0 : (_childrenComRef$curre33 = _childrenComRef$curre32.current) === null || _childrenComRef$curre33 === void 0 ? void 0 : _childrenComRef$curre33.toData();
          if (isExtensionField && data !== null && data !== void 0 && data.maxLength) {
            var _childrenComRef$curre34, _childrenComRef$curre35, _childrenComRef$curre36, _childrenComRef$curre37;
            (_childrenComRef$curre34 = childrenComRef.current) === null || _childrenComRef$curre34 === void 0 ? void 0 : (_childrenComRef$curre35 = _childrenComRef$curre34[nextDs]) === null || _childrenComRef$curre35 === void 0 ? void 0 : (_childrenComRef$curre36 = _childrenComRef$curre35.current) === null || _childrenComRef$curre36 === void 0 ? void 0 : (_childrenComRef$curre37 = _childrenComRef$curre36.getField('maxLength')) === null || _childrenComRef$curre37 === void 0 ? void 0 : _childrenComRef$curre37.set('validator', recordValue => {
              if (recordValue || recordValue === 0) {
                if (recordValue > (data === null || data === void 0 ? void 0 : data.maxLength) || recordValue < 1) {
                  return `
                      ${intl.get('hmde.bo.businessObject.range.minmax').d(`可填范围为`)}
                      ${1 - (data === null || data === void 0 ? void 0 : data.maxLength)}
                    `;
                }
              }
            });
          }
          childrenComRef === null || childrenComRef === void 0 ? void 0 : (_childrenComRef$curre38 = childrenComRef.current) === null || _childrenComRef$curre38 === void 0 ? void 0 : (_childrenComRef$curre39 = _childrenComRef$curre38.customInitChild) === null || _childrenComRef$curre39 === void 0 ? void 0 : _childrenComRef$curre39.call(_childrenComRef$curre38, initData);
          (_childrenComRef$curre40 = childrenComRef.current) === null || _childrenComRef$curre40 === void 0 ? void 0 : (_childrenComRef$curre41 = _childrenComRef$curre40[nextDs]) === null || _childrenComRef$curre41 === void 0 ? void 0 : _childrenComRef$curre41.setState('tlsParams', {
            businessObjectFieldId,
            inheritFieldId
          });
          if (value === FieldComponentType.MASTER_RELATION) {
            var _childrenComRef$curre42, _childrenComRef$curre43, _childrenComRef$curre44;
            (_childrenComRef$curre42 = childrenComRef.current) === null || _childrenComRef$curre42 === void 0 ? void 0 : (_childrenComRef$curre43 = _childrenComRef$curre42[nextDs]) === null || _childrenComRef$curre43 === void 0 ? void 0 : (_childrenComRef$curre44 = _childrenComRef$curre43.current) === null || _childrenComRef$curre44 === void 0 ? void 0 : _childrenComRef$curre44.set('linkRelationType', 'ONE_TO_MANY');
          }
        }, 0);
      }
    } else {
      setHoverExampleInfo(undefined);
      setSelectedExampleInfo(undefined);
    }

    // 字段切换 特殊处理 (统一处理)
    setTimeout(() => {
      var _childrenComRef$curre45;
      const currentDs = `${componentName}Ds`;
      const ds = (_childrenComRef$curre45 = childrenComRef.current) === null || _childrenComRef$curre45 === void 0 ? void 0 : _childrenComRef$curre45[currentDs];
      handleFieldChange({
        ds,
        value,
        businessObjectId,
        oType
      });
    }, 300);

    // api类型进来 需要注意下编码,以及字段必输的问题
    if (isApiCustomType) {
      const currentDs = `${componentName}Ds`;
      setTimeout(() => {
        var _childrenComRef$curre53, _childrenComRef$curre54, _childrenComRef$curre55, _childrenComRef$curre56, _childrenComRef$curre57, _childrenComRef$curre58, _childrenComRef$curre59;
        if (apiModelRecord !== null && apiModelRecord !== void 0 && apiModelRecord.get('requiredFlag')) {
          var _childrenComRef$curre46, _childrenComRef$curre47, _childrenComRef$curre48, _childrenComRef$curre49, _childrenComRef$curre50, _childrenComRef$curre51, _childrenComRef$curre52;
          (_childrenComRef$curre46 = childrenComRef.current) === null || _childrenComRef$curre46 === void 0 ? void 0 : (_childrenComRef$curre47 = _childrenComRef$curre46[currentDs]) === null || _childrenComRef$curre47 === void 0 ? void 0 : (_childrenComRef$curre48 = _childrenComRef$curre47.current) === null || _childrenComRef$curre48 === void 0 ? void 0 : _childrenComRef$curre48.set('requiredFlag', true);
          (_childrenComRef$curre49 = childrenComRef.current) === null || _childrenComRef$curre49 === void 0 ? void 0 : (_childrenComRef$curre50 = _childrenComRef$curre49[currentDs]) === null || _childrenComRef$curre50 === void 0 ? void 0 : (_childrenComRef$curre51 = _childrenComRef$curre50.current) === null || _childrenComRef$curre51 === void 0 ? void 0 : (_childrenComRef$curre52 = _childrenComRef$curre51.getField('requiredFlag')) === null || _childrenComRef$curre52 === void 0 ? void 0 : _childrenComRef$curre52.set('disabled', true);
        }
        // 编码字段禁用
        (_childrenComRef$curre53 = childrenComRef.current) === null || _childrenComRef$curre53 === void 0 ? void 0 : (_childrenComRef$curre54 = _childrenComRef$curre53[currentDs]) === null || _childrenComRef$curre54 === void 0 ? void 0 : (_childrenComRef$curre55 = _childrenComRef$curre54.current) === null || _childrenComRef$curre55 === void 0 ? void 0 : _childrenComRef$curre55.set('businessObjectFieldCode', apiModelRecord === null || apiModelRecord === void 0 ? void 0 : apiModelRecord.get('paramName'));
        (_childrenComRef$curre56 = childrenComRef.current) === null || _childrenComRef$curre56 === void 0 ? void 0 : (_childrenComRef$curre57 = _childrenComRef$curre56[currentDs]) === null || _childrenComRef$curre57 === void 0 ? void 0 : (_childrenComRef$curre58 = _childrenComRef$curre57.current) === null || _childrenComRef$curre58 === void 0 ? void 0 : (_childrenComRef$curre59 = _childrenComRef$curre58.getField('businessObjectFieldCode')) === null || _childrenComRef$curre59 === void 0 ? void 0 : _childrenComRef$curre59.set('disabled', true);
        // 小数位数的设置
        setDigitalAccuracyValidator(currentDs);
      });
    }
  };

  // 右侧示例展示
  const handleEnter = ({
    value
  }) => {
    const obj = getFieldItem(item => item.value === value);
    setHoverExampleInfo(obj);
  };

  // 右侧示例清空
  const handleLeave = () => {
    setHoverExampleInfo(undefined);
  };
  const getFormValues = async () => {
    var _childrenComRef$curre60, _childrenComRef$curre65, _childrenComRef$curre66, _childrenComRef$curre67, _childrenComRef$curre68, _childrenComRef$curre69, _childrenComRef$curre70, _childrenComRef$curre71, _formValues;
    const currentDs = `${selectComponentName}Ds`;
    let validateRes;
    if ((_childrenComRef$curre60 = childrenComRef.current) !== null && _childrenComRef$curre60 !== void 0 && _childrenComRef$curre60.customValidator) {
      var _childrenComRef$curre61;
      validateRes = await ((_childrenComRef$curre61 = childrenComRef.current) === null || _childrenComRef$curre61 === void 0 ? void 0 : _childrenComRef$curre61.customValidator());
    } else {
      var _childrenComRef$curre62, _childrenComRef$curre63, _childrenComRef$curre64;
      validateRes = await ((_childrenComRef$curre62 = childrenComRef.current) === null || _childrenComRef$curre62 === void 0 ? void 0 : (_childrenComRef$curre63 = _childrenComRef$curre62[currentDs]) === null || _childrenComRef$curre63 === void 0 ? void 0 : (_childrenComRef$curre64 = _childrenComRef$curre63.current) === null || _childrenComRef$curre64 === void 0 ? void 0 : _childrenComRef$curre64.validate());
    }
    if (!validateRes) return false;
    const fieldKeys = [...(((_childrenComRef$curre65 = childrenComRef.current) === null || _childrenComRef$curre65 === void 0 ? void 0 : (_childrenComRef$curre66 = _childrenComRef$curre65[currentDs]) === null || _childrenComRef$curre66 === void 0 ? void 0 : (_childrenComRef$curre67 = _childrenComRef$curre66.fields) === null || _childrenComRef$curre67 === void 0 ? void 0 : (_childrenComRef$curre68 = _childrenComRef$curre67.keys) === null || _childrenComRef$curre68 === void 0 ? void 0 : _childrenComRef$curre68.call(_childrenComRef$curre67)) || [])];
    let formValues = ((_childrenComRef$curre69 = childrenComRef.current) === null || _childrenComRef$curre69 === void 0 ? void 0 : (_childrenComRef$curre70 = _childrenComRef$curre69[currentDs]) === null || _childrenComRef$curre70 === void 0 ? void 0 : (_childrenComRef$curre71 = _childrenComRef$curre70.current) === null || _childrenComRef$curre71 === void 0 ? void 0 : _childrenComRef$curre71.toData()) || {};
    if (formValues.defaultValue === undefined) {
      formValues.defaultValue = null;
    }
    formValues = {
      ..._pick(detailData, fieldKeys),
      ...formValues,
      extendFieldId: ((_formValues = formValues) === null || _formValues === void 0 ? void 0 : _formValues.extendFieldId) || (detailData === null || detailData === void 0 ? void 0 : detailData.extendFieldId) // 选择引用扩展字段 这个字段比较特殊 只有新建时才显示 编辑时不展示 故编辑时fieldKeys不包含extendFieldId，pick()取值少了extendFieldId报错
    }; // 保存的时候需要把上次的数据也带上，防止有一些表单字段不显示，导致值丢失

    return formValues;
  };
  const getInheritType = formValues => {
    // 租户层新建且未选扩展字段则为租户自建扩展字段
    if (isTenant && !(formValues !== null && formValues !== void 0 && formValues.businessObjectFieldId) && !(formValues !== null && formValues !== void 0 && formValues.extendFieldId)) {
      return FieldType.TENANT_CREATED;
    }
    return !isExtensionField ? FieldType.STANDARD : FieldType.EXTEND;
  };

  /**
   * 保存|继续新建
   * @param type 标识 保存|继续新建|保存并新建
   */
  const handleSave = async type => {
    var _childrenComRef$curre72, _formValues2, _childrenComRef$curre73, _childrenComRef$curre74;
    if (!checkFieldPrefix()) return;
    if (type === 'continueAdd') {
      var _iconRef$current6, _iconRef$current6$cle;
      (_iconRef$current6 = iconRef.current) === null || _iconRef$current6 === void 0 ? void 0 : (_iconRef$current6$cle = _iconRef$current6.clearSelect) === null || _iconRef$current6$cle === void 0 ? void 0 : _iconRef$current6$cle.call(_iconRef$current6);
    }
    let formValues;
    switch (selectComponentName) {
      case 'CodingRules':
        formValues = await ((_childrenComRef$curre72 = childrenComRef.current) === null || _childrenComRef$curre72 === void 0 ? void 0 : _childrenComRef$curre72.getFieldsValue(businessObjectFieldId, detailData));
        (_formValues2 = formValues) === null || _formValues2 === void 0 ? true : delete _formValues2.defaultValue;
        break;
      case 'select':
        formValues = await ((_childrenComRef$curre73 = childrenComRef.current) === null || _childrenComRef$curre73 === void 0 ? void 0 : _childrenComRef$curre73.getFieldsValue(detailData));
        break;
      case 'MultipleRelation':
        formValues = await ((_childrenComRef$curre74 = childrenComRef.current) === null || _childrenComRef$curre74 === void 0 ? void 0 : _childrenComRef$curre74.getFieldsValue(detailData));
        break;
      default:
        // 公共校验和取值
        formValues = await getFormValues();
        break;
    }
    if (formValues) {
      var _baseInfoDS$current2, _baseInfoDS$current2$, _detailData$middleBus;
      const saveProps = {
        formValues,
        componentType,
        childrenComRef,
        getInheritType,
        businessObjectCode,
        isExtensionField,
        businessObjectId,
        isApiCustomType,
        selectComponentName,
        apiModelRecord,
        apiType,
        handleCloseDetail,
        getAddonBefore,
        fastCreateEnter,
        businessObjectFieldId,
        fastCreateEnterRecord,
        fieldType,
        boSourceType,
        createPlateformExtensionBusinessObjectField,
        oldComponentType,
        isEditMode,
        modal,
        domainId,
        updateBusinessObjectField,
        createBusinessObjectField,
        isFromDomain,
        dominFieldExtendsDs,
        templateCode,
        editDomainTemplateField,
        createDomainTemplateField,
        updatePlateformExtensionBusinessObjectField,
        createTenantExtensionBusinessObjectField,
        handleDeleteCheckApi,
        dispatchService,
        type,
        domainCode: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : (_baseInfoDS$current2$ = _baseInfoDS$current2.get) === null || _baseInfoDS$current2$ === void 0 ? void 0 : _baseInfoDS$current2$.call(_baseInfoDS$current2, 'domainCode')
      };
      if (isEditMode && componentType === FieldComponentType.MULTIPLE_RELATION && detailData !== null && detailData !== void 0 && (_detailData$middleBus = detailData.middleBusinessObject) !== null && _detailData$middleBus !== void 0 && _detailData$middleBus.businessObjectCode) {
        var _detailData$middleBus2, _detailData$middleBus3;
        renderModalConfirm( /*#__PURE__*/React.createElement(React.Fragment, null, intl.get('hmde.bo.businessObject.fieldChangeTips1').d('当前字段已生成对应配置的中间对象'), "\u3010", detailData === null || detailData === void 0 ? void 0 : (_detailData$middleBus2 = detailData.middleBusinessObject) === null || _detailData$middleBus2 === void 0 ? void 0 : _detailData$middleBus2.businessObjectName, "\uFF08", detailData === null || detailData === void 0 ? void 0 : (_detailData$middleBus3 = detailData.middleBusinessObject) === null || _detailData$middleBus3 === void 0 ? void 0 : _detailData$middleBus3.businessObjectCode, "\uFF09\u3011\uFF0C", intl.get('hmde.bo.businessObject.fieldChangeTips2').d('修改字段属性后，可能会对已有数据造成影响，请确认是否修改？')), {
          title: intl.get('hmde.bo.businessObject.notice').d('注意'),
          onOk: () => {
            handleFieldSave(saveProps);
          }
        });
        return;
      }
      handleFieldSave(saveProps);
    }
  };
  const handleSaveResult = (type, r) => {
    var _FieldListCache$clear;
    notification.success({
      message: intl.get('hmde.common.saveSuccess').d('保存成功')
    });

    // 通过 ER 图创建不需要刷新列表
    if (isERCreate) return true;

    // 更新左侧列表
    updataFieldList === null || updataFieldList === void 0 ? void 0 : updataFieldList();
    // 如果有创建数据的行为，需要清空缓存
    if (!isEditMode) {
      FieldListCache === null || FieldListCache === void 0 ? void 0 : FieldListCache.clearByOmit('tabKey');
    }
    if (type === 'continueAdd') {
      var _iconRef$current7, _iconRef$current7$emi, _dominFieldExtendsDs$;
      (_iconRef$current7 = iconRef.current) === null || _iconRef$current7 === void 0 ? void 0 : (_iconRef$current7$emi = _iconRef$current7.emitEmpty) === null || _iconRef$current7$emi === void 0 ? void 0 : _iconRef$current7$emi.call(_iconRef$current7); // 清空输入框
      // 清空数据
      setLoading(false);
      setSelectComponentName(undefined);
      setHoverExampleInfo(undefined);
      setSelectedExampleInfo(undefined);
      dominFieldExtendsDs === null || dominFieldExtendsDs === void 0 ? void 0 : (_dominFieldExtendsDs$ = dominFieldExtendsDs.current) === null || _dominFieldExtendsDs$ === void 0 ? void 0 : _dominFieldExtendsDs$.set('extendsWhoField', '');
    } else if (type === 'saveAndCreate') {
      const isTenantType = tenantCustomObject ? FieldType.CUSTOM : FieldType.EXTEND;
      history === null || history === void 0 ? void 0 : history.push({
        pathname: '/hmde/business-object/field/create',
        search: qs.stringify({
          businessObjectId,
          domainId,
          businessObjectName,
          businessObjectCode,
          middleBusinessObjFlag,
          fieldType: isTenant ? isTenantType : FieldType.STANDARD,
          // sourceType: type,
          boSourceType,
          domainEnabledFlag,
          extendFieldCreatedFlag
        })
      });
    } else {
      // 跳转回字段列表
      if (_isFunction(setShowFieldDetail)) {
        setShowFieldDetail(false);
      } else if (isEditMode) {
        init(r === null || r === void 0 ? void 0 : r.inheritFieldId);
      } else {
        history === null || history === void 0 ? void 0 : history.push({
          pathname: `/hmde/business-object/detail/${businessObjectId}`,
          state: {
            originKey: 'fieldList',
            // eslint-disable-next-line no-nested-ternary
            fieldActiveKey:
            // eslint-disable-next-line no-nested-ternary
            isTenant && boSourceType !== 'TENANT' ? null : fieldType === FieldType.EXTEND ? FieldType.EXTEND : FieldType.STANDARD
          }
        });
      }
      if (isFromDomain) {
        saveSessionStorage();
      }
    }
    setLoading(false);

    // model-4269 保存成功, 清楚缓存数据
    FieldListCache === null || FieldListCache === void 0 ? void 0 : (_FieldListCache$clear = FieldListCache.clearByOmit) === null || _FieldListCache$clear === void 0 ? void 0 : _FieldListCache$clear.call(FieldListCache, 'tabKey');
    store.setItem('commonFieldData', {});
  };
  const dispatchService = ({
    serviceName,
    body,
    query,
    type,
    isUpdate
  }) => {
    setLoading(true);
    return serviceName({
      body,
      query,
      boSourceType
    }).then(r => {
      if (r && !(r !== null && r !== void 0 && r.failed)) {
        // 关联关系多选的保存 需要自动发布 对应的中间对象
        if ((body === null || body === void 0 ? void 0 : body.componentType) === FieldComponentType.MULTIPLE_RELATION) {
          var _pubRef$current, _pubRef$current$handl, _body$middleBusinessO, _r$middleBusinessObje;
          setLoading(false);
          pubRef === null || pubRef === void 0 ? void 0 : (_pubRef$current = pubRef.current) === null || _pubRef$current === void 0 ? void 0 : (_pubRef$current$handl = _pubRef$current.handlePublish) === null || _pubRef$current$handl === void 0 ? void 0 : _pubRef$current$handl.call(_pubRef$current, r === null || r === void 0 ? void 0 : r.middleBoId, body === null || body === void 0 ? void 0 : (_body$middleBusinessO = body.middleBusinessObject) === null || _body$middleBusinessO === void 0 ? void 0 : _body$middleBusinessO.businessObjectCode, r === null || r === void 0 ? void 0 : (_r$middleBusinessObje = r.middleBusinessObject) === null || _r$middleBusinessObje === void 0 ? void 0 : _r$middleBusinessObje._token);
          return;
        }
        // 发布成功的回调
        handleSaveResult(type, r);
      } else {
        notification.error({
          message: isUpdate ? intl.get('hmde.common.updateError').d('更新失败') : intl.get('hmde.common.createError').d('创建失败'),
          description: r === null || r === void 0 ? void 0 : r.message
        });
        setLoading(false);
      }
      return r;
    }).catch(err => {
      notification.error({
        message: intl.get('hmde.common.saveError').d('保存失败'),
        description: err.message
      });
    });
  };

  // 取消
  const handleCancel = async () => {
    if (isApiModelType) {
      handleCloseDetail();
      return;
    }
    if (isFromDomain) {
      saveSessionStorage();
    }
    if (_isFunction(setShowFieldDetail)) {
      setShowFieldDetail(false);
    } else {
      history.push({
        pathname: `/hmde/business-object/detail/${businessObjectId}`,
        state: {
          originKey: TAB_KEYS.fieldList,
          fieldActiveKey: isTenant && boSourceType !== SourceType.TENANT ? null : FieldType.STANDARD
        }
      });
    }
  };

  // 租户查看平台标准字段的时候 或者 平台层编辑扩展字段时 并且 编辑时未切换字段 或系统预置对象 统统禁用
  // 直接根据templateCode判断是否为模板字段
  const disabledFlag = readOnlyFlag || (detailData === null || detailData === void 0 ? void 0 : detailData.templateCode) && !(!templateFieldId && fastCreateEnter) && !((!isTenant || boSourceType === SourceType.TENANT) && isEditMode && componentType === FieldComponentType.LINK_RELATION) ||
  // 预置字段不能编辑，除非: 平台用户编辑预置的关联关系字段
  (!isTenant || boSourceType === SourceType.TENANT) && isExtensionField && isEditCurField ||
  // 平台层扩展字段也不能编辑
  boSourceType === SourceType.PREDEFINE || !fastCreateEnterIsEidt ||
  // 字段列表 弹窗形式 引用,  非编辑态  只能看 不能改
  // (physicalModelType === 'API' && isTenant) || // 租户下 api类型业务对象 啥都不能改
  !hasPermission;
  // TODO 租户层只能编辑部分字段 https://shimo.im/sheets/TDPwHgdTWWWhYjXc/dWDMa

  const storeData = {
    childrenComRef,
    selectedExampleInfo,
    disabled: disabledFlag,
    isEditCurField,
    businessObjectId,
    isEditMode,
    isExtensionField,
    // 字段列表中扩展字段的tab !isExtensionField标准字段  目前业务对象就两类 要么标准字段要么扩展字段
    isFromDomain,
    businessObjectCode,
    businessObjectName,
    parentInit: init,
    // 父组件的初始化方法传给子组件
    detailData,
    customPrimaryKeyCode,
    // 自定义主键编码
    inheritFieldId,
    businessObjectPublished: isEditMode && published && JSON.parse(published),
    // 业务对象是否发布
    boSourceType,
    // 业务对象来源类型
    componentType,
    iconRef,
    middleBusinessObjFlag,
    fieldType,
    tenantCustomObject,
    domainEnabledFlag,
    extendFieldCreatedFlag,
    extendFieldPrefixRule,
    oldComponentType,
    fieldBehavior: (dominFieldExtendsDs === null || dominFieldExtendsDs === void 0 ? void 0 : (_dominFieldExtendsDs$2 = dominFieldExtendsDs.current) === null || _dominFieldExtendsDs$2 === void 0 ? void 0 : _dominFieldExtendsDs$2.get('extendsWhoField')) || null,
    physicalModelType,
    isApiCustomType,
    fastCreateEnter,
    businessObjectFieldId,
    inheritId,
    dimensionFlag: detailData === null || detailData === void 0 ? void 0 : detailData.dimensionFlag,
    middleDisabled,
    extendTableEnabledFlag: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current3 = baseInfoDS.current) === null || _baseInfoDS$current3 === void 0 ? void 0 : _baseInfoDS$current3.get('extendTableEnabledFlag'),
    flexFieldEnabledFlag: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current4 = baseInfoDS.current) === null || _baseInfoDS$current4 === void 0 ? void 0 : _baseInfoDS$current4.get('flexFieldEnabledFlag'),
    extendTableSuffix: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current5 = baseInfoDS.current) === null || _baseInfoDS$current5 === void 0 ? void 0 : _baseInfoDS$current5.get('extendTableSuffix'),
    tenantSqlObjectDisabled,
    baseInfoDS,
    noSaveRelationFieldList
  };
  /**
   * 动态导入需要加载组件
   * @param _fieldName 维护的文件名和enums枚举中的value值对应
   */
  const renderFieldComponents = _fieldName => {
    const Component = allPlugin[_fieldName];
    return /*#__PURE__*/React.createElement(Component, storeData);
  };

  // 保存按钮展示逻辑
  const saveButtonShowFlag = () => {
    // 1. 创建人 最后更新人 (包括继承者2者的) 展示
    const flag1 = ['createdBy', 'lastUpdatedBy'].includes(detailData === null || detailData === void 0 ? void 0 : detailData.templateFieldCode) || ['createdBy', 'lastUpdatedBy'].includes(detailData === null || detailData === void 0 ? void 0 : detailData.fieldBehavior);

    // 2. 预置领域的业务对象隐藏 , 标准对象的模版字段隐藏
    const flag2 = boSourceType !== SourceType.PREDEFINE && !(isEditMode && detailData !== null && detailData !== void 0 && detailData.templateCode);

    // 租户下 api类型 需要隐藏
    // return (flag1 || flag2) && !(physicalModelType === 'API' && isTenant);
    return flag1 || flag2;
  };
  const handleDelete = async () => {
    setLoading(true);
    let delCheckFn;
    let delCheckQuery;
    if (detailData.componentType === FieldComponentType.MULTIPLE_RELATION) {
      delCheckFn = handleBoDeleteCheckApi;
      delCheckQuery = detailData.middleBoId;
    } else {
      delCheckFn = handleDeleteCheckApi;
      delCheckQuery = {
        businessObjectCode,
        businessObjectFieldCode: detailData.businessObjectFieldCode,
        deleteValidFlag: true
      };
    }
    const data = await delCheckFn(delCheckQuery).catch(e => console.error(e));
    if (getResponse(data)) {
      const _ref = data || {},
        ruleName = _ref.ruleName,
        ruleCode = _ref.ruleCode;
      let confirmText = ruleCode ? `${intl.get('hmde.bo.businessObject.checkMes3').d('请确认是否删除该字段，该字段配置了正则业务规则')}【${ruleName}（${ruleCode}）】，${intl.get('hmde.bo.businessObject.checkMes4').d('删除后将级联删除相关正则业务规则。')}` : intl.get('hmde.bo.businessObject.deleteFieldListObj').d('请确认是否删除该字段，删除并发布后该字段的相关数据会被清空或失效。');

      // 关联关系多选字段 删除提示 不一样
      if ((detailData === null || detailData === void 0 ? void 0 : detailData.componentType) === FieldComponentType.MULTIPLE_RELATION) {
        confirmText = intl.get('hmde.bo.businessObject.deleteMultipleRelation').d('删除该字段即删除中间对象，请确认是否删除，确认删除则触发中间对象删除校验');
      }
      renderModalConfirm(confirmText, {
        title: intl.get('hmde.bo.businessObject.deletetip').d('是否删除'),
        onOk: () => {
          let delFn;
          let delQuery;
          if (detailData.componentType === FieldComponentType.MULTIPLE_RELATION) {
            delFn = deleteBo;
            delQuery = [detailData.middleBoId];
          } else {
            delFn = deleteBoFieldList;
            delQuery = [detailData, typeKey];
          }
          delFn(...delQuery).then(res => {
            if (!(res !== null && res !== void 0 && res.failed)) {
              notification.success({
                message: intl.get('hmde.common.handleSuccess').d('操作成功')
              });
              // 返回列表页
              handleCancel();
            } else {
              notification.warning({
                message: intl.get('hmde.common.deleteError').d('删除失败'),
                description: res.message
              });
            }
          });
        },
        onClose: () => {
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
  };

  // 对外暴露ref
  useImperativeHandle(listRef, () => ({
    childrenComRef
  }));
  const headButtonGroupProps = {
    handleCancel,
    isApiModelType,
    physicalModelType,
    deleteFlag,
    detailData,
    handleDelete,
    isEditMode,
    readOnlyFlag,
    handleSave,
    isExtensionField,
    isFromDomain,
    predefineDisabled,
    saveButtonShowFlag,
    boSourceType,
    businessObjectCategory,
    middleDisabled,
    componentType,
    baseInfoDS
  };
  return /*#__PURE__*/React.createElement(MultipleRelationPub, {
    businessObjectCode: businessObjectCode,
    pubRef: pubRef,
    handleSaveResult: handleSaveResult
  }, /*#__PURE__*/React.createElement(_Spin, {
    wrapperClassName: styles['spin-wrapper'],
    spinning: loading
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['content-right']
  }, !fastCreateEnter && !isERCreate && /*#__PURE__*/React.createElement(SectionTitle, {
    title: intl.get('hmde.common.fieldType').d('字段类型')
  }, /*#__PURE__*/React.createElement(HeadButtonGroup, headButtonGroupProps)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: isERCreate ? 'inherit' : 'auto'
    }
  }, isApiCustomType && /*#__PURE__*/React.createElement(_Alert, {
    message: intl.get('hmde.bo.businessObject.tipmessage').d('维护自定义属性字段，该字段不会生成对象字段在字段列表中展示'),
    type: "info",
    showIcon: true,
    style: {
      marginBottom: '16px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingRight: fastCreateEnter || detailData !== null && detailData !== void 0 && detailData.dimensionFlag ? 0 : 359
    }
  }, (isFromDomain && !isExtensionField && !isEditMode && templateCode !== 'SYS' && !fastCreateEnter || (dominFieldExtendsDs === null || dominFieldExtendsDs === void 0 ? void 0 : (_dominFieldExtendsDs$3 = dominFieldExtendsDs.current) === null || _dominFieldExtendsDs$3 === void 0 ? void 0 : _dominFieldExtendsDs$3.get('extendsWhoField'))) && /*#__PURE__*/React.createElement(_Row, null, /*#__PURE__*/React.createElement(_Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(_Form, {
    dataSet: dominFieldExtendsDs,
    labelAlign: "left"
    // useColon={false}
    ,
    disabled: isEditMode || !hasPermission
  }, /*#__PURE__*/React.createElement(_Select, {
    name: "extendsWhoField",
    placeholder: intl.get('hmde.common.placeholder').d('请选择')
  })))), !fastCreateEnter && /*#__PURE__*/React.createElement(_Row, null, /*#__PURE__*/React.createElement(_Col, {
    span: 12
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(IconPicker
  // 租户不能对平台标准字段进行编辑  平台不能编辑扩展字段
  , {
    disabled: readOnlyFlag || (detailData === null || detailData === void 0 ? void 0 : detailData.standardFlag) && physicalModelType !== PhysicalModelType.SQL || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField || (!isTenant || boSourceType === 'TENANT') && isEditMode && isExtensionField || (dominFieldExtendsDs === null || dominFieldExtendsDs === void 0 ? void 0 : (_dominFieldExtendsDs$4 = dominFieldExtendsDs.current) === null || _dominFieldExtendsDs$4 === void 0 ? void 0 : _dominFieldExtendsDs$4.get('extendsWhoField')) || isEditMode && (detailData === null || detailData === void 0 ? void 0 : detailData.templateCode) || !hasPermission || (detailData === null || detailData === void 0 ? void 0 : detailData.dimensionFlag) || middleDisabled || middleBusinessObjFlag && componentType === 'MASTER_RELATION' // 中间对象的默认两个从主关系类型字段禁用字段类型选择框
    ,
    labelWidth: 100,
    label: intl.get('hmde.common.fieldType').d('字段类型'),
    showText: boSourceType === SourceType.PREDEFINE,
    dataSource: editComponentTypeFilter(dataSourceFn === null || dataSourceFn === void 0 ? void 0 : dataSourceFn()),
    onChange: handleTypeChange,
    onItemEnter: handleEnter,
    onItemLeave: handleLeave,
    iconPickerRef: iconRef,
    detailData: detailData
  }))), /*#__PURE__*/React.createElement(_Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(FieldSource, {
    fieldType: fieldType
  }))), /*#__PURE__*/React.createElement(SectionTitle, {
    title: intl.get('hmde.common.baseAttribute').d('基础属性')
  }), middleLinkBusinessObjects && middleDisabled && /*#__PURE__*/React.createElement(_Alert, {
    message: /*#__PURE__*/React.createElement(React.Fragment, null, intl.get('hmde.bo.businessObject.middleDisabledTips1').d('该中间对象由对象'), "\u3010", middleLinkBusinessObjects === null || middleLinkBusinessObjects === void 0 ? void 0 : (_middleLinkBusinessOb = middleLinkBusinessObjects[0]) === null || _middleLinkBusinessOb === void 0 ? void 0 : (_middleLinkBusinessOb2 = _middleLinkBusinessOb.first) === null || _middleLinkBusinessOb2 === void 0 ? void 0 : _middleLinkBusinessOb2.businessObjectName, "\uFF08", middleLinkBusinessObjects === null || middleLinkBusinessObjects === void 0 ? void 0 : (_middleLinkBusinessOb3 = middleLinkBusinessObjects[0]) === null || _middleLinkBusinessOb3 === void 0 ? void 0 : (_middleLinkBusinessOb4 = _middleLinkBusinessOb3.first) === null || _middleLinkBusinessOb4 === void 0 ? void 0 : _middleLinkBusinessOb4.businessObjectCode, "\uFF09\u3011", intl.get('hmde.bo.businessObject.middleDisabledTips2').d('的关联关系（多）字段'), "\u3010", middleLinkBusinessObjects === null || middleLinkBusinessObjects === void 0 ? void 0 : (_middleLinkBusinessOb5 = middleLinkBusinessObjects[0]) === null || _middleLinkBusinessOb5 === void 0 ? void 0 : (_middleLinkBusinessOb6 = _middleLinkBusinessOb5.firstFieldList) === null || _middleLinkBusinessOb6 === void 0 ? void 0 : (_middleLinkBusinessOb7 = _middleLinkBusinessOb6[0]) === null || _middleLinkBusinessOb7 === void 0 ? void 0 : _middleLinkBusinessOb7.fieldName, "\uFF08", middleLinkBusinessObjects === null || middleLinkBusinessObjects === void 0 ? void 0 : (_middleLinkBusinessOb8 = middleLinkBusinessObjects[0]) === null || _middleLinkBusinessOb8 === void 0 ? void 0 : (_middleLinkBusinessOb9 = _middleLinkBusinessOb8.firstFieldList) === null || _middleLinkBusinessOb9 === void 0 ? void 0 : (_middleLinkBusinessOb10 = _middleLinkBusinessOb9[0]) === null || _middleLinkBusinessOb10 === void 0 ? void 0 : _middleLinkBusinessOb10.fieldCode, "\uFF09\u3011", intl.get('hmde.bo.businessObject.middleDisabledTips4').d('所创建，请至对象'), "\u3010", middleLinkBusinessObjects === null || middleLinkBusinessObjects === void 0 ? void 0 : (_middleLinkBusinessOb11 = middleLinkBusinessObjects[0]) === null || _middleLinkBusinessOb11 === void 0 ? void 0 : (_middleLinkBusinessOb12 = _middleLinkBusinessOb11.first) === null || _middleLinkBusinessOb12 === void 0 ? void 0 : _middleLinkBusinessOb12.businessObjectName, "\uFF08", middleLinkBusinessObjects === null || middleLinkBusinessObjects === void 0 ? void 0 : (_middleLinkBusinessOb13 = middleLinkBusinessObjects[0]) === null || _middleLinkBusinessOb13 === void 0 ? void 0 : (_middleLinkBusinessOb14 = _middleLinkBusinessOb13.first) === null || _middleLinkBusinessOb14 === void 0 ? void 0 : _middleLinkBusinessOb14.businessObjectCode, "\uFF09\u3011", intl.get('hmde.bo.businessObject.middleDisabledTips2').d('的关联关系（多）字段'), "\u3010", middleLinkBusinessObjects === null || middleLinkBusinessObjects === void 0 ? void 0 : (_middleLinkBusinessOb15 = middleLinkBusinessObjects[0]) === null || _middleLinkBusinessOb15 === void 0 ? void 0 : (_middleLinkBusinessOb16 = _middleLinkBusinessOb15.firstFieldList) === null || _middleLinkBusinessOb16 === void 0 ? void 0 : (_middleLinkBusinessOb17 = _middleLinkBusinessOb16[0]) === null || _middleLinkBusinessOb17 === void 0 ? void 0 : _middleLinkBusinessOb17.fieldName, "\uFF08", middleLinkBusinessObjects === null || middleLinkBusinessObjects === void 0 ? void 0 : (_middleLinkBusinessOb18 = middleLinkBusinessObjects[0]) === null || _middleLinkBusinessOb18 === void 0 ? void 0 : (_middleLinkBusinessOb19 = _middleLinkBusinessOb18.firstFieldList) === null || _middleLinkBusinessOb19 === void 0 ? void 0 : (_middleLinkBusinessOb20 = _middleLinkBusinessOb19[0]) === null || _middleLinkBusinessOb20 === void 0 ? void 0 : _middleLinkBusinessOb20.fieldCode, "\uFF09\u3011", intl.get('hmde.common.edit').d('修改')),
    type: "info",
    showIcon: true,
    style: {
      marginBottom: '12px'
    }
  }), /*#__PURE__*/React.createElement(_Row, {
    gutter: 10
  }, /*#__PURE__*/React.createElement(_Col, {
    span: 24
  }, selectComponentName && renderFieldComponents(selectComponentName)))))), !fastCreateEnter && !(detailData !== null && detailData !== void 0 && detailData.dimensionFlag) && /*#__PURE__*/React.createElement(ExampleComponent, {
    componentType: componentType,
    hoverExampleInfo: hoverExampleInfo,
    selectedExampleInfo: selectedExampleInfo,
    isApiCustomType: isApiCustomType
  })));
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(Index));