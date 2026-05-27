import _extends from "@babel/runtime/helpers/esm/extends";
import _Icon from "choerodon-ui/pro/lib/icon";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _useModal from "choerodon-ui/pro/lib/use-modal";
import _Tabs from "@hzero-front-ui/c7n-ui/lib/Tabs";
import _snakeCase from "lodash/snakeCase";
import _upperFirst from "lodash/upperFirst";
import _omit from "lodash/omit";
import _camelCase from "lodash/camelCase";
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import intl from 'utils/intl';
import { getResponse, isTenantRoleLevel } from 'utils/utils';
import { FuncType } from 'choerodon-ui/pro/lib/button/enum';
import qs from 'querystring';
import notification from 'utils/notification';
import { observer } from 'mobx-react-lite';
import $ from 'jquery';
import { SourceType, FieldType } from "hzero-front-apaas/lib/constants/businessObject";
import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import formatterCollections from 'utils/intl/formatterCollections';
import { renderModalConfirm } from "hzero-front-apaas/lib/utils/render";
import { tableDs } from "hzero-front-hmde/lib/stores/BusinessObject/FieldListDS";
import { deleteBoFieldList, deleteBo, handleDeleteCheckApi, handleBoDeleteCheckApi, updateFieldSort, updateSitBusinessObjectField, updateTenantBusinessObjectField } from "hzero-front-hmde/lib/services/businessObjectService";
import { handleDealFields } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/FieldsList/utils";
import FastCreateFields from "hzero-front-hmde/lib/businessComponents/FastCreateFieldsNew";
import { PhysicalModelType } from "hzero-front-hmde/lib/constants/businessObject";
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
import { TAB_KEYS } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/TabItemList";
import TenantFieldTable from "./components/TenantFieldTable";
import StandardFieldTable from "./components/StandardFieldTable";
import ExtendFieldTable from "./components/ExtendFieldTable";
import ShowExtendsFieldList from "./components/ShowExtendsFieldList";
import AddApiField from "./components/AddApiField";
import { useStore } from "./store";
import styles from "./index.less?modules";
import { handleCheckError, handleReferenceField } from "./utils";
import BOPermissionButton from "../components/BOPermissionButton";
const TabPane = _Tabs.TabPane;
const isTenant = isTenantRoleLevel();
const store = {
  // 存所有结构性组件下保存的数据对象
  dataMap: new Map(),
  getItem: key => store.dataMap.get(key),
  setItem: (key, value) => {
    store.dataMap.set(key, value);
  },
  delete: key => {
    store.dataMap.delete(key);
  }
};
const FieldList = props => {
  var _boStore$getState, _baseInfoDS$current, _baseInfoDS$current2, _baseInfoDS$current3, _baseInfoDS$current4, _baseInfoDS$current5, _baseInfoDS$current6, _baseInfoDS$current7, _baseInfoDS$current8, _baseInfoDS$current9, _baseInfoDS$current10, _baseInfoDS$current11, _props$location, _baseInfoDS$current20, _baseInfoDS$current21, _baseInfoDS$current29, _baseInfoDS$current30;
  const _useStore = useStore(),
    setState = _useStore.setState;
  const history = props.history,
    businessObjectId = props.match.params.id,
    baseInfoDS = props.baseInfoDS,
    publishStatus = props.publishStatus,
    listRef = props.listRef,
    businessObjectName = props.businessObjectName,
    FieldListCache = props.FieldListCache,
    published = props.published,
    businessObjectCode = props.businessObjectCode,
    readOnlyFlag = props.readOnlyFlag,
    showVersion = props.showVersion,
    location = props.location;
  const boStore = useBoStore();
  const Modal = _useModal();
  const boDetailTabActiveKey = boStore === null || boStore === void 0 ? void 0 : (_boStore$getState = boStore.getState) === null || _boStore$getState === void 0 ? void 0 : _boStore$getState.call(boStore, 'boDetailTabActiveKey');
  const queryRef = useRef({});
  const extendTableDSQueryRef = useRef({});
  const wrapperRef = useRef(null);
  const predefineDisabled = ((_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('sourceType')) === SourceType.PREDEFINE;
  const predefineDomainFlag = ((_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : _baseInfoDS$current2.get('domainCode')) === 'SYS';
  const boSourceType = (_baseInfoDS$current3 = baseInfoDS.current) === null || _baseInfoDS$current3 === void 0 ? void 0 : _baseInfoDS$current3.get('sourceType');
  const businessObjectCategory = ((_baseInfoDS$current4 = baseInfoDS.current) === null || _baseInfoDS$current4 === void 0 ? void 0 : _baseInfoDS$current4.get('businessObjectCategory')) || 'EXTEND';
  const tenantCustomObject = ((_baseInfoDS$current5 = baseInfoDS.current) === null || _baseInfoDS$current5 === void 0 ? void 0 : _baseInfoDS$current5.get('sourceType')) === SourceType.TENANT;
  const middleBusinessObjFlag = (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current6 = baseInfoDS.current) === null || _baseInfoDS$current6 === void 0 ? void 0 : _baseInfoDS$current6.get('businessObjectCategory')) === 'MIDDLE'; // 中间对象的标识
  const domainEnabledFlag = (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current7 = baseInfoDS.current) === null || _baseInfoDS$current7 === void 0 ? void 0 : _baseInfoDS$current7.get('extendTableEnabledFlag')) || (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current8 = baseInfoDS.current) === null || _baseInfoDS$current8 === void 0 ? void 0 : _baseInfoDS$current8.get('flexFieldEnabledFlag')); // 租户对象的领域是否开启标准扩展模式或标准弹性域模式  控制是否显示选择扩展字段
  const extendFieldCreatedFlag = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current9 = baseInfoDS.current) === null || _baseInfoDS$current9 === void 0 ? void 0 : _baseInfoDS$current9.get('extendFieldCreatedFlag'); // 租户对象是否允许创建扩展字段  控制选择扩展字段是否必输
  const extendFieldPrefixRule = baseInfoDS !== null && baseInfoDS !== void 0 && (_baseInfoDS$current10 = baseInfoDS.current) !== null && _baseInfoDS$current10 !== void 0 && _baseInfoDS$current10.get('extendFieldPrefixRule') ? JSON.parse(baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current11 = baseInfoDS.current) === null || _baseInfoDS$current11 === void 0 ? void 0 : _baseInfoDS$current11.get('extendFieldPrefixRule')) : ''; // 自定义字段编码前缀
  const _ref = (props === null || props === void 0 ? void 0 : (_props$location = props.location) === null || _props$location === void 0 ? void 0 : _props$location.state) || {},
    _ref$fieldActiveKey = _ref.fieldActiveKey,
    fieldActiveKey = _ref$fieldActiveKey === void 0 ? isTenant && !tenantCustomObject ? null : 'STANDARD' : _ref$fieldActiveKey,
    _ref$domainId = _ref.domainId,
    domainId = _ref$domainId === void 0 ? '' : _ref$domainId;
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    editing = _useState2[0],
    setEditing = _useState2[1];
  const _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    creating = _useState4[0],
    setCreating = _useState4[1];
  const _useState5 = useState(isTenant ? null : FieldType.STANDARD),
    _useState6 = _slicedToArray(_useState5, 2),
    activeKey = _useState6[0],
    setActiveKey = _useState6[1];
  const isFromDomain = domainId && !businessObjectId; // 是否从领域入口跳转

  // 初始化store数据
  useEffect(() => {
    if (baseInfoDS) {
      setState(baseInfoDS.toData());
      setState('baseInfoDS', baseInfoDS);
    }
    setState('businessObjectId', businessObjectId);
    setState('businessObjectCode', businessObjectCode);
    setState('businessObjectName', businessObjectName);
    setState('readOnlyFlag', readOnlyFlag);
    setState('published', published);
    setState('publishStatus', publishStatus);
    setState('isFromDomain', isFromDomain);
    setState('showVersion', showVersion);
  }, [baseInfoDS, businessObjectId, businessObjectCode, businessObjectName, readOnlyFlag, showVersion, published, publishStatus, isFromDomain]);
  useEffect(() => {
    var _location$state;
    // 如果传入业务字段编码,则筛选
    const businessObjectFieldCode = (_location$state = location.state) === null || _location$state === void 0 ? void 0 : _location$state.businessObjectFieldCode;
    if (businessObjectFieldCode) {
      var _tableDS$queryDataSet, _tableDS$queryDataSet2, _tableDS$queryDataSet3;
      (_tableDS$queryDataSet = tableDS.queryDataSet) === null || _tableDS$queryDataSet === void 0 ? void 0 : _tableDS$queryDataSet.create();
      (_tableDS$queryDataSet2 = tableDS.queryDataSet) === null || _tableDS$queryDataSet2 === void 0 ? void 0 : (_tableDS$queryDataSet3 = _tableDS$queryDataSet2.current) === null || _tableDS$queryDataSet3 === void 0 ? void 0 : _tableDS$queryDataSet3.set('businessObjectFieldCode', businessObjectFieldCode);
      tableDS.query().then(() => {
        var _tableDS$queryDataSet4, _tableDS$queryDataSet5;
        (_tableDS$queryDataSet4 = tableDS.queryDataSet) === null || _tableDS$queryDataSet4 === void 0 ? void 0 : (_tableDS$queryDataSet5 = _tableDS$queryDataSet4.current) === null || _tableDS$queryDataSet5 === void 0 ? void 0 : _tableDS$queryDataSet5.set('businessObjectFieldCode', '');
        handleDetail(tableDS.current, FieldType.STANDARD);
      });
    }
  }, []);
  const getAddonBefore = useMemo(() => {
    return extendFieldPrefixRule || '';
  }, [extendFieldPrefixRule]);
  const scrollRef = useRef(0);
  const getType = () => {
    if (isTenant && !tenantCustomObject) {
      return null;
    } else if (tenantCustomObject) {
      return FieldType.CUSTOM;
    } else {
      return FieldType.STANDARD;
    }
  };
  const tableDS = useMemo(() => {
    var _baseInfoDS$current12;
    return new _DataSet(tableDs({
      type: getType(),
      pagingFlag: false,
      predefineDisabled,
      showVersion,
      masterBusinessObjectCode: businessObjectCode,
      physicalModelType: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current12 = baseInfoDS.current) === null || _baseInfoDS$current12 === void 0 ? void 0 : _baseInfoDS$current12.get('physicalModelType')
    }));
  }, [businessObjectId, predefineDisabled, readOnlyFlag, showVersion, baseInfoDS]);
  tableDS.addEventListener('query', ({
    dataSet
  }) => {
    var _dataSet$queryDataSet, _dataSet$queryDataSet2;
    queryRef.current = _omit(dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$queryDataSet = dataSet.queryDataSet) === null || _dataSet$queryDataSet === void 0 ? void 0 : (_dataSet$queryDataSet2 = _dataSet$queryDataSet.current) === null || _dataSet$queryDataSet2 === void 0 ? void 0 : _dataSet$queryDataSet2.toData(), ['__dirty']);
  });
  useEffect(() => {
    baseInfoDS === null || baseInfoDS === void 0 ? void 0 : baseInfoDS.setState('tableDS', tableDS);
  }, [tableDS]);

  // 平台扩展字段
  const extendTableDS = useMemo(() => new _DataSet(tableDs({
    type: FieldType.EXTEND,
    pagingFlag: true,
    showVersion
  })), [businessObjectId, showVersion]);
  const currentDs = activeKey === FieldType.STANDARD || !activeKey ? tableDS : extendTableDS;
  extendTableDS.addEventListener('query', ({
    dataSet
  }) => {
    var _dataSet$queryDataSet3, _dataSet$queryDataSet4;
    extendTableDSQueryRef.current = _omit(dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$queryDataSet3 = dataSet.queryDataSet) === null || _dataSet$queryDataSet3 === void 0 ? void 0 : (_dataSet$queryDataSet4 = _dataSet$queryDataSet3.current) === null || _dataSet$queryDataSet4 === void 0 ? void 0 : _dataSet$queryDataSet4.toData(), ['__dirty']);
  });
  useImperativeHandle(listRef, () => ({
    tableDS,
    extendTableDS,
    baseInfoDS,
    initData
  }));
  useDataSetEvents(extendTableDS, 'update', ({
    name,
    value,
    record
  }) => {
    if (name === 'componentType') {
      record === null || record === void 0 ? void 0 : record.set('maxLength', FieldComponentType.TEXT_FIELD !== value ? undefined : 240);
    }
  });
  useDataSetEvents(tableDS, 'update', ({
    name,
    value,
    record
  }) => {
    if (name === 'componentType') {
      var _record$setState;
      record === null || record === void 0 ? void 0 : record.set('requiredFlag', false);
      record === null || record === void 0 ? void 0 : (_record$setState = record.setState) === null || _record$setState === void 0 ? void 0 : _record$setState.call(record, 'updateInfoFlag', false);
      if ([FieldComponentType.TEXT_FIELD, FieldComponentType.APPENDIX, FieldComponentType.SINGLE_SELECT, FieldComponentType.MULTIPLE_SELECT, FieldComponentType.RADIO, FieldComponentType.CHECKBOX, FieldComponentType.EMAIL].includes(value)) {
        record === null || record === void 0 ? void 0 : record.set('maxLength', 240);
      } else if (FieldComponentType.PHONE_NUMBER === value) {
        record === null || record === void 0 ? void 0 : record.set('maxLength', 11);
      } else if ([FieldComponentType.SWITCH, FieldComponentType.MASTER_RELATION].includes(value)) {
        record === null || record === void 0 ? void 0 : record.set('requiredFlag', true);
      } else if ([FieldComponentType.FLOAT, FieldComponentType.MONEY, FieldComponentType.PERCENTAGE].includes(value)) {
        record === null || record === void 0 ? void 0 : record.set('digitalAccuracy', 2);
      }
    }
  });
  useEffect(() => {
    tableDS.setState('activeKey', activeKey);
    tableDS.setState('businessObjectId', businessObjectId);
    tableDS.setState('getAddonBefore', getAddonBefore);
  }, [tableDS, activeKey]);
  useEffect(() => {
    if (activeKey) {
      setCreating(false);
      setEditing(false);
    }
  }, [activeKey]);
  const catchSearch = () => {
    const searchVal = store.getItem('catchText');
    const queryParams = store.getItem('catchQueryParams');
    if (searchVal) {
      tableDS.setState('__SEARCHTEXT__', searchVal);
      tableDS.setQueryParameter('keyword', searchVal);
    }
    if (queryParams) {
      var _tableDS$queryDataSet6;
      // 修复查询条有数据时，重置按钮不出现
      delete queryParams.__dirty;
      delete queryParams.searchText;
      (_tableDS$queryDataSet6 = tableDS.queryDataSet) === null || _tableDS$queryDataSet6 === void 0 ? void 0 : _tableDS$queryDataSet6.create({}).set(queryParams);
    }
    store.delete('catchText');
    store.delete('catchQueryParams');
  };
  useEffect(() => {
    var _FieldListCache$get;
    catchSearch();
    if (fieldActiveKey) {
      setActiveKey(fieldActiveKey);
    }
    if (FieldListCache !== null && FieldListCache !== void 0 && (_FieldListCache$get = FieldListCache.get()) !== null && _FieldListCache$get !== void 0 && _FieldListCache$get.tabKey) {
      var _FieldListCache$get2;
      setActiveKey(FieldListCache === null || FieldListCache === void 0 ? void 0 : (_FieldListCache$get2 = FieldListCache.get()) === null || _FieldListCache$get2 === void 0 ? void 0 : _FieldListCache$get2.tabKey);
    }
  }, []);

  // 数据初始化
  const initData = () => {
    setEditing(false);
    tableDS.setQueryParameter('businessObjectId', businessObjectId);
    tableDSQuery(tableDS, FieldType.STANDARD);
    baseInfoDS.query();
    if (!isTenant) {
      // 平台层才有扩展字段
      extendTableDS.setQueryParameter('businessObjectId', businessObjectId);
      tableDSQuery(extendTableDS, FieldType.EXTEND);
    }
  };
  useEffect(() => {
    initData();
  }, [tableDS, extendTableDS, publishStatus]);
  useEffect(() => {
    currentDs.setState('boSourceType', boSourceType);
    currentDs.setState('businessObjectId', businessObjectId);
    currentDs.setState('tenantCustomObject', tenantCustomObject);
    currentDs.setState('activeKey', activeKey);
    currentDs.setState('creating', creating);
    currentDs.setState('extendFlag', activeKey && activeKey === FieldType.EXTEND);
    currentDs.setState('businessObjectFieldRequiredFlag', !isFromDomain && domainEnabledFlag && isTenant && !tenantCustomObject && creating);
  }, [creating, boSourceType, domainEnabledFlag, currentDs, tenantCustomObject, businessObjectId, activeKey]);

  // 处理查询参数缓存的场景
  const tableDSQuery = (ds, type) => {
    const cacheQuery = FieldListCache.get() || {};
    const page = (cacheQuery === null || cacheQuery === void 0 ? void 0 : cacheQuery.currentPage) || ds.currentPage;
    const params = {
      size: (cacheQuery === null || cacheQuery === void 0 ? void 0 : cacheQuery.pageSize) || ds.pageSize,
      ...(cacheQuery.queryData || {})
    };
    if (type !== cacheQuery.tabKey) {
      ds.query();
      return;
    }
    ds.query(page, params);
    if (cacheQuery.queryData && Object.keys(cacheQuery.queryData).length) {
      setTimeout(() => {
        Object.keys(cacheQuery.queryData).forEach(key => {
          var _ds$queryDataSet, _ds$queryDataSet$curr;
          const val = (cacheQuery === null || cacheQuery === void 0 ? void 0 : cacheQuery.queryData) && (cacheQuery === null || cacheQuery === void 0 ? void 0 : cacheQuery.queryData[key]);
          // eslint-disable-next-line no-unused-expressions
          ds === null || ds === void 0 ? void 0 : (_ds$queryDataSet = ds.queryDataSet) === null || _ds$queryDataSet === void 0 ? void 0 : (_ds$queryDataSet$curr = _ds$queryDataSet.current) === null || _ds$queryDataSet$curr === void 0 ? void 0 : _ds$queryDataSet$curr.set(key, val);
        });
      }, 20);
    }
    FieldListCache.clearAll();
  };
  const handleDetail = (record, type) => {
    var _record$dataSet$query, _record$dataSet$query2, _record$dataSet, _baseInfoDS$current13, _baseInfoDS$current14;
    const deleteFlag = record === null || record === void 0 ? void 0 : record.getState('deleteFlag');
    // 缓存【查询参数】【分页】
    cacheQueryFun(type);
    let extendProperty = {};
    if (!isTenant) {
      // 平台
      const platformExtensionFlag = activeKey && activeKey === FieldType.EXTEND;
      extendProperty = {
        businessObjectFieldId: platformExtensionFlag ? record === null || record === void 0 ? void 0 : record.get('extendFieldId') : record === null || record === void 0 ? void 0 : record.get('businessObjectFieldId'),
        fieldType: (record === null || record === void 0 ? void 0 : record.get('sourceType')) || (record === null || record === void 0 ? void 0 : record.get('extendCategory')),
        sourceType: platformExtensionFlag ? record === null || record === void 0 ? void 0 : record.get('extendCategory') : record === null || record === void 0 ? void 0 : record.get('sourceType')
      };
    } else if (!tenantCustomObject) {
      // 租户
      extendProperty = {
        inheritFieldId: record === null || record === void 0 ? void 0 : record.get('inheritFieldId'),
        businessObjectFieldId: record === null || record === void 0 ? void 0 : record.get('businessObjectFieldId'),
        fieldType: record === null || record === void 0 ? void 0 : record.get('sourceType')
      };
    } else {
      // 租户自定义字段
      extendProperty = {
        businessObjectFieldId: record === null || record === void 0 ? void 0 : record.get('businessObjectFieldId'),
        fieldType: record === null || record === void 0 ? void 0 : record.get('sourceType'),
        sourceType: SourceType.TENANT
      };
    }
    const searchText = tableDS.getState('__SEARCHTEXT__');
    store.setItem('catchText', searchText);

    // 跳到详情页时把查询参数也带过去
    const queryParams = record === null || record === void 0 ? void 0 : (_record$dataSet$query = record.dataSet.queryDataSet) === null || _record$dataSet$query === void 0 ? void 0 : (_record$dataSet$query2 = _record$dataSet$query.current) === null || _record$dataSet$query2 === void 0 ? void 0 : _record$dataSet$query2.toData();
    const _searchText = record === null || record === void 0 ? void 0 : (_record$dataSet = record.dataSet) === null || _record$dataSet === void 0 ? void 0 : _record$dataSet.getState('__SEARCHTEXT__');
    if (queryParams) {
      store.setItem('catchQueryParams', queryParams);
    }
    if (_searchText) {
      Object.assign(queryParams || {}, {
        searchText: _searchText
      });
    }
    // sql 对象作用类型
    const useType = record === null || record === void 0 ? void 0 : record.get('useType');

    //  跳转到编辑页面
    history.push({
      pathname: `/hmde/business-object/field/edit`,
      search: qs.stringify({
        outComponentType: record === null || record === void 0 ? void 0 : record.get('componentType'),
        published,
        domainId,
        businessObjectId,
        businessObjectCode,
        boSourceType,
        middleBusinessObjFlag,
        businessObjectName: (_baseInfoDS$current13 = baseInfoDS.current) === null || _baseInfoDS$current13 === void 0 ? void 0 : _baseInfoDS$current13.get('businessObjectName'),
        physicalModelType: (_baseInfoDS$current14 = baseInfoDS.current) === null || _baseInfoDS$current14 === void 0 ? void 0 : _baseInfoDS$current14.get('physicalModelType'),
        ...extendProperty,
        tenantCustomObject,
        domainEnabledFlag,
        predefineDisabled,
        readOnlyFlag,
        showVersion,
        deleteFlag,
        type: activeKey,
        queryParams: JSON.stringify(queryParams || {}),
        businessObjectCategory,
        useType
      })
    });
  };

  // 字段删除前需要效验一下 规则
  const handleDeleteCheck = (record, v, isExtend = false) => {
    if (v) {
      record === null || record === void 0 ? void 0 : record.setState('visibleLoading', true);

      // 关联关系字段的删除 走的是对象的删除逻辑
      let delFn;
      let delQuery;
      if ((record === null || record === void 0 ? void 0 : record.get('componentType')) === FieldComponentType.MULTIPLE_RELATION) {
        delFn = handleBoDeleteCheckApi;
        delQuery = [record === null || record === void 0 ? void 0 : record.get('middleBoId')];
      } else {
        var _baseInfoDS$current15;
        delFn = handleDeleteCheckApi;
        delQuery = [{
          businessObjectCode: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current15 = baseInfoDS.current) === null || _baseInfoDS$current15 === void 0 ? void 0 : _baseInfoDS$current15.get('businessObjectCode'),
          businessObjectFieldCode: (record === null || record === void 0 ? void 0 : record.get('businessObjectFieldCode')) || (record === null || record === void 0 ? void 0 : record.get('extendFieldCode')),
          deleteValidFlag: true
        }, isExtend, record];
      }
      delFn(...delQuery).then(res => {
        if (getResponse(res)) {
          record === null || record === void 0 ? void 0 : record.setState('visibleLoading', false);
          // 中间对象特殊处理
          if ((record === null || record === void 0 ? void 0 : record.get('componentType')) === FieldComponentType.MULTIPLE_RELATION) {
            renderModalConfirm(intl.get('hmde.bo.businessObject.deleteMultipleRelation').d('删除该字段即删除中间对象，请确认是否删除，确认删除则触发中间对象删除校验'), {
              title: intl.get('hmde.bo.businessObject.deletetip').d('是否删除'),
              onOk: () => {
                handleDelete(record);
              }
            });
            return;
          }
          record === null || record === void 0 ? void 0 : record.setState('visible', v);
          const _ref2 = res || {},
            ruleName = _ref2.ruleName,
            ruleCode = _ref2.ruleCode;
          if (ruleName && ruleCode) {
            record === null || record === void 0 ? void 0 : record.setState('confirmText', `${intl.get('hmde.bo.businessObject.checkMes3').d('请确认是否删除该字段，该字段配置了正则业务规则')}【${ruleName}（${ruleCode}）】，${intl.get('hmde.bo.businessObject.checkMes4').d('删除后将级联删除相关正则业务规则。')}`);
          } else {
            // record?.setState(
            //   'confirmText',
            //   intl
            //     .get('hmde.bo.businessObject.deleteFieldListObj1')
            //     .d('请确认是否删除该字段，删除并发布后相关数据会失效。')
            // );
          }
        } else {
          record === null || record === void 0 ? void 0 : record.setState('visibleLoading', false);
        }
      });
    }
    if (!v) {
      record === null || record === void 0 ? void 0 : record.setState('visible', v);
    }
    tableDS.clearCachedRecords();
  };

  // 字段删除
  const handleDelete = async (record, flag) => {
    // const dataSet = activeKey === FieldType.EXTEND ? extendTableDS : tableDS;
    // return
    record === null || record === void 0 ? void 0 : record.setState('visibleLoading', true);
    let delFn;
    let delQuery;
    if ((record === null || record === void 0 ? void 0 : record.get('componentType')) === FieldComponentType.MULTIPLE_RELATION) {
      delFn = deleteBo;
      delQuery = [record === null || record === void 0 ? void 0 : record.get('middleBoId')];
    } else {
      delFn = deleteBoFieldList;
      delQuery = [record === null || record === void 0 ? void 0 : record.toData(), activeKey];
    }
    delFn(...delQuery).then(res => {
      record === null || record === void 0 ? void 0 : record.setState('visibleLoading', false);
      if (!(res !== null && res !== void 0 && res.failed)) {
        if (!flag) {
          baseInfoDS.query();
          currentDs.query();
        } else {
          currentDs.remove(record);
        }
        notification.success({
          message: intl.get('hmde.common.handleSuccess').d('操作成功')
        });
      } else {
        notification.warning({
          message: intl.get('hmde.common.deleteError').d('删除失败'),
          description: res.message
        });
      }
    }).catch(() => {
      record === null || record === void 0 ? void 0 : record.setState('visibleLoading', false);
    });
  };

  // 启用|禁用 平台/租户下的业务对象字段
  const handleEnable = async record => {
    const flag = record === null || record === void 0 ? void 0 : record.get('enabledFlag');
    // 必输字段不能禁用
    if (flag && record !== null && record !== void 0 && record.get('requiredFlag')) {
      notification.error({
        message: intl.get('hmde.common.status.error').d('失败'),
        description: intl.get('hmde.bo.businessObject.disabledErrorTip').d('该字段为必输字段，不可禁用'),
        placement: 'bottomRight'
      });
      return false;
    }
    const serviceName = isTenant && !tenantCustomObject ? updateTenantBusinessObjectField : updateSitBusinessObjectField;
    const body = {
      objectVersionNumber: record === null || record === void 0 ? void 0 : record.get('objectVersionNumber'),
      enabledFlag: !flag
    };
    if (isTenant && !tenantCustomObject) {
      Object.assign(body, {
        inheritFieldId: record === null || record === void 0 ? void 0 : record.get('inheritFieldId')
      });
    } else {
      Object.assign(body, {
        businessObjectFieldId: record === null || record === void 0 ? void 0 : record.get('businessObjectFieldId')
      });
    }
    const res = await serviceName({
      body
    });
    if (getResponse(res)) {
      tableDSQuery(tableDS, FieldType.STANDARD);
    }
  };

  /**
   * 跳转到新增字段详情页面
   */
  const handleAddField = fieldType => {
    var _tableDS$queryDataSet7, _baseInfoDS$current16;
    // 缓存【查询参数】【分页】
    cacheQueryFun(fieldType);
    // 缓存查询参数
    const searchText = tableDS.getState('__SEARCHTEXT__');
    store.setItem('catchText', searchText);
    const queryData = (_tableDS$queryDataSet7 = tableDS.queryDataSet) === null || _tableDS$queryDataSet7 === void 0 ? void 0 : _tableDS$queryDataSet7.toData();
    if (queryData) {
      store.setItem('catchQueryParams', queryData === null || queryData === void 0 ? void 0 : queryData[0]);
    }
    // 缓存切换的TabKey
    FieldListCache.update({
      tabKey: fieldType
    });
    history.push({
      pathname: '/hmde/business-object/field/create',
      search: qs.stringify({
        businessObjectId,
        domainId,
        businessObjectName,
        businessObjectCode,
        middleBusinessObjFlag,
        fieldType,
        // sourceType: type,
        boSourceType,
        domainEnabledFlag,
        extendFieldCreatedFlag,
        extendFieldPrefixRule,
        physicalModelType: (_baseInfoDS$current16 = baseInfoDS.current) === null || _baseInfoDS$current16 === void 0 ? void 0 : _baseInfoDS$current16.get('physicalModelType')
      })
    });
  };

  /** 扩展表新建模版字段、标准字段新建模版字段 */
  const handleAddTemplateField = isExtendTable => {
    Modal.open({
      title: intl.get('hmde.bo.businessObject.useTempField').d('引用模板字段'),
      style: {
        width: 957
      },
      closable: true,
      autoCenter: true,
      children: /*#__PURE__*/React.createElement(ShowExtendsFieldList, {
        baseInfoDS: baseInfoDS,
        listTableDS: isExtendTable ? extendTableDS : tableDS,
        isExtendTable: isExtendTable
      }),
      okProps: {
        disabled: true
      }
    });
  };
  // 从api新建字段
  const handleAddApiField = () => {
    Modal.open({
      title: intl.get('hmde.bo.businessObject.useApiField').d('引用API字段'),
      style: {
        width: 957
      },
      closable: true,
      autoCenter: true,
      children: /*#__PURE__*/React.createElement(AddApiField, {
        baseInfoDS: baseInfoDS,
        listTableDS: tableDS
      })
    });
  };

  // 缓存【查询参数】【分页】
  const cacheQueryFun = type => {
    const _data = type === FieldType.EXTEND ? extendTableDSQueryRef : queryRef;
    const queryData = Object.keys(_data.current).reduce((acc, key) => {
      if (_data.current[key] === null || _data.current[key] === undefined || _data.current[key] === '') {
        return acc;
      } else {
        return {
          ...acc,
          [key]: _data.current[key]
        };
      }
    }, {});
    FieldListCache.update({
      queryData,
      pageSize: currentDs.pageSize,
      currentPage: currentDs.currentPage,
      tabKey: type
    });
  };
  const updateSort = dataSet => {
    dataSet === null || dataSet === void 0 ? void 0 : dataSet.forEach((record, index) => {
      record === null || record === void 0 ? void 0 : record.set('seqNum', index + 1);
    });
    const body = dataSet === null || dataSet === void 0 ? void 0 : dataSet.map(record => {
      return {
        businessObjectFieldCode: record === null || record === void 0 ? void 0 : record.get('businessObjectFieldCode'),
        businessObjectId: record === null || record === void 0 ? void 0 : record.get('businessObjectId'),
        _token: record === null || record === void 0 ? void 0 : record.get('_token')
      };
    });
    updateFieldSort(body).then(() => {
      return tableDS.query();
    }).then(() => {
      setTimeout(() => {
        var _$, _$$find, _$$find$;
        (_$ = $(wrapperRef.current)) === null || _$ === void 0 ? void 0 : (_$$find = _$.find('.c7n-pro-table-body')) === null || _$$find === void 0 ? void 0 : (_$$find$ = _$$find[0]) === null || _$$find$ === void 0 ? void 0 : _$$find$.scrollTo({
          top: scrollRef.current,
          left: 0
        });
        baseInfoDS.query();
      }, 0);
    });
  };
  const updateRowConfig = record => {
    var _baseInfoDS$current17;
    const dimensionFlag = ['dimension', 'dimensionValue'].includes(record === null || record === void 0 ? void 0 : record.get('businessObjectFieldCode')) && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current17 = baseInfoDS.current) === null || _baseInfoDS$current17 === void 0 ? void 0 : _baseInfoDS$current17.get('businessObjectCategory')) === 'DIMENSION';
    const conditionFlag = isTenant ? (record === null || record === void 0 ? void 0 : record.get('sourceType')) === FieldType.PREDEFINED || (record === null || record === void 0 ? void 0 : record.get('sourceType')) === FieldType.STANDARD || (record === null || record === void 0 ? void 0 : record.get('sourceType')) === FieldType.INHERIT : (record === null || record === void 0 ? void 0 : record.get('sourceType')) === FieldType.PREDEFINED;
    if (conditionFlag || dimensionFlag) {
      return {
        className: styles['drag-disabled']
      };
    } else {
      return {};
    }
  };
  const renderDragIcon = rowRenderIcon => {
    var _baseInfoDS$current18;
    const record = rowRenderIcon.record;
    const conditionFlag = isTenant ? (record === null || record === void 0 ? void 0 : record.get('sourceType')) === FieldType.PREDEFINED || (record === null || record === void 0 ? void 0 : record.get('sourceType')) === FieldType.STANDARD || (record === null || record === void 0 ? void 0 : record.get('sourceType')) === FieldType.INHERIT : (record === null || record === void 0 ? void 0 : record.get('sourceType')) === FieldType.PREDEFINED;
    const dimensionFlag = ['dimension', 'dimensionValue'].includes(record === null || record === void 0 ? void 0 : record.get('businessObjectFieldCode')) && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current18 = baseInfoDS.current) === null || _baseInfoDS$current18 === void 0 ? void 0 : _baseInfoDS$current18.get('businessObjectCategory')) === 'DIMENSION';
    // 关联关系多选字段也不能拖拽
    const multipleRelationFlag = (record === null || record === void 0 ? void 0 : record.get('componentType')) === FieldComponentType.MULTIPLE_RELATION;
    if (conditionFlag || dimensionFlag || multipleRelationFlag) {
      return /*#__PURE__*/React.createElement(BOPermissionButton, {
        icon: "baseline-drag_indicator",
        className: styles['drag-disabled-btn']
      });
    } else {
      return /*#__PURE__*/React.createElement(_Icon, {
        type: "baseline-drag_indicator",
        style: {
          fontSize: 12
        }
      });
    }
  };
  const handleDragEndBefore = (dataSet, col, resultDrag) => {
    var _resultDrag$destinati, _baseInfoDS$current19, _resultDrag$destinati2, _resultDrag$source;
    const targetIndex = (resultDrag === null || resultDrag === void 0 ? void 0 : (_resultDrag$destinati = resultDrag.destination) === null || _resultDrag$destinati === void 0 ? void 0 : _resultDrag$destinati.index) || 0;
    // 参数对象 拖转 特殊处理
    if ([0, 1].includes(targetIndex) && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current19 = baseInfoDS.current) === null || _baseInfoDS$current19 === void 0 ? void 0 : _baseInfoDS$current19.get('businessObjectCategory')) === 'DIMENSION') {
      return false;
    }
    const targetRecord = tableDS.get(targetIndex);
    const conditionFlag = isTenant ? (targetRecord === null || targetRecord === void 0 ? void 0 : targetRecord.get('sourceType')) !== FieldType.PREDEFINED && (targetRecord === null || targetRecord === void 0 ? void 0 : targetRecord.get('sourceType')) !== FieldType.STANDARD && (targetRecord === null || targetRecord === void 0 ? void 0 : targetRecord.get('sourceType')) !== FieldType.INHERIT : (targetRecord === null || targetRecord === void 0 ? void 0 : targetRecord.get('sourceType')) !== FieldType.PREDEFINED;
    return conditionFlag && (resultDrag === null || resultDrag === void 0 ? void 0 : (_resultDrag$destinati2 = resultDrag.destination) === null || _resultDrag$destinati2 === void 0 ? void 0 : _resultDrag$destinati2.index) !== (resultDrag === null || resultDrag === void 0 ? void 0 : (_resultDrag$source = resultDrag.source) === null || _resultDrag$source === void 0 ? void 0 : _resultDrag$source.index);
  };
  const allHidden = !((_baseInfoDS$current20 = baseInfoDS.current) !== null && _baseInfoDS$current20 !== void 0 && _baseInfoDS$current20.get('extendTableEnabledFlag')) && !((_baseInfoDS$current21 = baseInfoDS.current) !== null && _baseInfoDS$current21 !== void 0 && _baseInfoDS$current21.get('flexFieldEnabledFlag'));
  const getFieldType = () => {
    var _baseInfoDS$current22, _baseInfoDS$current23;
    if (activeKey === FieldType.STANDARD || tenantCustomObject) {
      return tenantCustomObject ? FieldType.CUSTOM : FieldType.STANDARD;
    } else if ((_baseInfoDS$current22 = baseInfoDS.current) !== null && _baseInfoDS$current22 !== void 0 && _baseInfoDS$current22.get('flexFieldEnabledFlag') || (_baseInfoDS$current23 = baseInfoDS.current) !== null && _baseInfoDS$current23 !== void 0 && _baseInfoDS$current23.get('extendTableEnabledFlag')) {
      return FieldType.EXTEND;
    } else if (isTenant && !tenantCustomObject) {
      return FieldType.EXTEND;
    }
  };
  const handleCreate = (fields, fieldType) => {
    const isExtensionField = [FieldType.EXTEND, FieldType.EXTEND_TABLE, FieldType.FLEX_FIELD, FieldType.TENANT_CREATED // 租户继承平台对象自建扩展字段
    ].includes(fieldType); // 是否为扩展字段
    fields.reverse().forEach(field => {
      const defaultValue = handleDealFields([{
        businessObjectId,
        businessObjectCode,
        sourceType: boSourceType,
        extendCategory: businessObjectCategory,
        fieldType: getFieldType(),
        componentType: (field === null || field === void 0 ? void 0 : field.componentType) || FieldComponentType.TEXT_FIELD
      }], {
        isFromDomain,
        domainId,
        isExtensionField,
        category: !isExtensionField ? FieldType.STANDARD : fieldType
      });
      if ((field === null || field === void 0 ? void 0 : field.componentType) === 'PERCENTAGE') {
        Object.assign(defaultValue[0], {
          digitalAccuracy: 4
        });
      }
      if ((field === null || field === void 0 ? void 0 : field.componentType) === 'APPENDIX') {
        var _defaultValue$;
        Object.assign(defaultValue === null || defaultValue === void 0 ? void 0 : (_defaultValue$ = defaultValue[0]) === null || _defaultValue$ === void 0 ? void 0 : _defaultValue$.attributeJson, {
          maxFileCount: 1
        });
      }

      // 自动编号特殊处理下
      if ((field === null || field === void 0 ? void 0 : field.componentType) === 'CODE_RULE') {
        var _snakeCase2, _snakeCase2$substring, _field$meaning, _field$meaning$substr;
        const code = (_snakeCase2 = _snakeCase(extendFieldPrefixRule ? `${businessObjectCode}_${extendFieldPrefixRule}_${field === null || field === void 0 ? void 0 : field.code}` : `${businessObjectCode}_${field === null || field === void 0 ? void 0 : field.code}`)) === null || _snakeCase2 === void 0 ? void 0 : (_snakeCase2$substring = _snakeCase2.substring) === null || _snakeCase2$substring === void 0 ? void 0 : _snakeCase2$substring.call(_snakeCase2, 0, 30);
        Object.assign(defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue[0], {
          optionSettings: '_createCodeRule',
          ruleName: field === null || field === void 0 ? void 0 : (_field$meaning = field.meaning) === null || _field$meaning === void 0 ? void 0 : (_field$meaning$substr = _field$meaning.substring) === null || _field$meaning$substr === void 0 ? void 0 : _field$meaning$substr.call(_field$meaning, 0, 60),
          ruleCode: code
        });
      }
      const record = currentDs.create({
        ...defaultValue[0],
        [activeKey === FieldType.EXTEND ? 'extendFieldCode' : 'businessObjectFieldCode']: getAddonBefore ? _upperFirst(_camelCase(field === null || field === void 0 ? void 0 : field.code)) : _camelCase(field === null || field === void 0 ? void 0 : field.code),
        businessObjectFieldName: field === null || field === void 0 ? void 0 : field.meaning,
        requiredFlag: (field === null || field === void 0 ? void 0 : field.requiredFlag) || false,
        componentType: (field === null || field === void 0 ? void 0 : field.componentType) || '',
        exportableFlag: !isExtensionField ? true : undefined,
        remark: field === null || field === void 0 ? void 0 : field.remark,
        maxLength: field === null || field === void 0 ? void 0 : field.maxLength,
        operationalFlag: true,
        _tls: field._tls || {}
      }, 0);
      record.setState('editing', true);
    });
    setCreating(true);
    if (!isExtensionField) {
      handleBatchSave('fast');
    }
  };

  /**
   * 快速创建字段
   */
  const handleFastCreate = fieldType => {
    // 默认值
    Modal.open({
      title: intl.get('hmde.common.fastCreate').d('快速新建'),
      style: {
        width: 957
      },
      closable: true,
      children: /*#__PURE__*/React.createElement(FastCreateFields, {
        onOkCb: fields => {
          tableDS === null || tableDS === void 0 ? void 0 : tableDS.setState('dragFlag', false);
          handleCreate(fields, fieldType);
        },
        hiddenMeaning: activeKey === FieldType.EXTEND,
        extendFieldPrefixRule: extendFieldPrefixRule,
        baseInfoDS: baseInfoDS
      }),
      autoCenter: true
    });
  };

  /**
   * 批量编辑
   */
  const handleBatchEdit = useCallback(() => {
    currentDs.forEach(r => {
      if ((r === null || r === void 0 ? void 0 : r.get('sourceType')) !== 'PREDEFINED') {
        r.setState('editing', true);
        r.setState('updateInfoFlag', true);
      }
    });
    setEditing(true);
  }, [currentDs]);

  /**
   * 取消批量编辑
   */
  const handleCancelBatchEdit = useCallback(() => {
    currentDs.reset();
    currentDs.forEach(r => {
      r.setState('editing', false);
      r.setState('editType', false);
    });
    setCreating(false);
    setEditing(false);
    tableDS === null || tableDS === void 0 ? void 0 : tableDS.setState('dragFlag', true);
    currentDs.query();
  }, [currentDs]);
  const handleSuccess = () => {
    currentDs.forEach(r => r.setState('editing', false));
    setCreating(false);
    setEditing(false);
    currentDs.setQueryParameter('businessObjectId', businessObjectId);
    currentDs.query();
    baseInfoDS.query();
    return true;
  };

  /**
   * 批量保存
   */
  const handleBatchSave = useCallback(async type => {
    var _currentDs$created, _currentDs$updated, _baseInfoDS$current24, _currentDs$updated2, _currentDs$updated2$f;
    if (!(currentDs !== null && currentDs !== void 0 && (_currentDs$created = currentDs.created) !== null && _currentDs$created !== void 0 && _currentDs$created.length) && !(currentDs !== null && currentDs !== void 0 && (_currentDs$updated = currentDs.updated) !== null && _currentDs$updated !== void 0 && _currentDs$updated.length)) {
      return handleSuccess();
    }

    // 引用字段 可以引用未保存 的关系字段, 但是 需要特殊处理下, 如果引用了一个 未保存过的, 当这个字段编码改了, 或者删了 需要清空相关数据
    handleReferenceField === null || handleReferenceField === void 0 ? void 0 : handleReferenceField(currentDs, getAddonBefore);

    // 引用 公式 自动编号必填项效验
    if (handleCheckError({
      records: currentDs,
      type: 'save',
      isSql: (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current24 = baseInfoDS.current) === null || _baseInfoDS$current24 === void 0 ? void 0 : _baseInfoDS$current24.get('physicalModelType')) === 'SQL'
    })) {
      return;
    }

    // 兼容批量编辑 不进入详情 字段部分内容丢失的bug
    currentDs === null || currentDs === void 0 ? void 0 : (_currentDs$updated2 = currentDs.updated) === null || _currentDs$updated2 === void 0 ? void 0 : (_currentDs$updated2$f = _currentDs$updated2.forEach) === null || _currentDs$updated2$f === void 0 ? void 0 : _currentDs$updated2$f.call(_currentDs$updated2, v => {
      if (v !== null && v !== void 0 && v.getState('updateInfoFlag')) {
        v === null || v === void 0 ? void 0 : v.set('updateInfoFlag', true);
      }
    });

    // 平台标准字段新增编辑
    currentDs.setQueryParameter('businessObjectId', businessObjectId);
    const res = await currentDs.submit();
    if (getResponse(res !== null && res !== void 0 ? res : {})) {
      if (type === 'fast') {
        // setEditing(true);
        handleSuccess();
        currentDs.forEach(v => {
          if ((v === null || v === void 0 ? void 0 : v.get('_status')) === 'create') {
            v.setState('updateInfoFlag', true);
          }
        });
        return true;
      }
      return handleSuccess();
    }
    tableDS === null || tableDS === void 0 ? void 0 : tableDS.setState('dragFlag', true);
    return true;
  }, [currentDs, baseInfoDS, businessObjectId]);
  const buttons = () => {
    var _baseInfoDS$current25, _baseInfoDS$current26, _baseInfoDS$current27, _baseInfoDS$current28;
    const physicalModelType = (_baseInfoDS$current25 = baseInfoDS.current) === null || _baseInfoDS$current25 === void 0 ? void 0 : _baseInfoDS$current25.get('physicalModelType');
    const batchEdit = [!editing && !creating && /*#__PURE__*/React.createElement(BOPermissionButton, {
      disabled: tableDS.length === 0,
      key: "poEdit",
      icon: "edit-o",
      onClick: handleBatchEdit
    }, intl.get('hmde.common.button.batchEdit').d('批量编辑')), (editing || creating) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BOPermissionButton, {
      funcType: "flat",
      key: "cancel",
      icon: "cancel-o",
      onClick: handleCancelBatchEdit
    }, intl.get('hmde.common.button.cancel').d('取消')), /*#__PURE__*/React.createElement(BOPermissionButton, {
      funcType: "flat",
      key: "save",
      icon: "save-o",
      onClick: handleBatchSave
    }, intl.get('hmde.common.button.save').d('保存')))];
    // 组户级看到平台API对象 直接不给任何操作
    if (isTenant && boSourceType === 'PLATFORM' && physicalModelType === PhysicalModelType.API) {
      return [];
    } else if (isTenant && boSourceType === 'PLATFORM' && businessObjectCategory === 'DIMENSION') {
      // 组户级看到平台参数对象 直接不给任何操作
      return [];
    } else if (predefineDisabled || readOnlyFlag) {
      return [];
    } else if (physicalModelType === PhysicalModelType.SQL) {
      return [...batchEdit];
    } else if (isTenant && !tenantCustomObject) {
      return [...batchEdit, /*#__PURE__*/React.createElement(BOPermissionButton, {
        funcType: "flat",
        icon: "add",
        onClick: () => handleAddField(FieldType.EXTEND),
        disabled: predefineDisabled || editing || tableDS.created.length > 0,
        hidden: editing
      }, intl.get('hmde.common.button.create').d('新建'))];
    } else if (activeKey === FieldType.STANDARD || tenantCustomObject) {
      return [...batchEdit, physicalModelType !== PhysicalModelType.API && /*#__PURE__*/React.createElement(BOPermissionButton, {
        funcType: "flat",
        icon: "add",
        disabled: predefineDisabled || editing || tableDS.created.length > 0,
        onClick: () => handleAddTemplateField(),
        hidden: editing
      }, intl.get('hmde.bo.businessObject.useTempField').d('引用模板字段')), physicalModelType === PhysicalModelType.API && /*#__PURE__*/React.createElement(BOPermissionButton, {
        funcType: "flat",
        icon: "add",
        disabled: predefineDisabled || editing || tableDS.created.length > 0,
        onClick: handleAddApiField
      }, intl.get('hmde.bo.businessObject.useApiField').d('引用API字段')), /*#__PURE__*/React.createElement(BOPermissionButton, {
        disabled: editing || tableDS.created.length >= 10,
        key: "fastAdd",
        icon: "playlist_add",
        onClick: () => handleFastCreate(tenantCustomObject ? FieldType.CUSTOM : FieldType.STANDARD),
        hidden: editing
      }, intl.get('hmde.common.fastCreate').d('快速新建')), /*#__PURE__*/React.createElement(BOPermissionButton, {
        funcType: "flat",
        icon: "add",
        onClick: () => handleAddField(tenantCustomObject ? FieldType.CUSTOM : FieldType.STANDARD),
        disabled: predefineDisabled || editing || tableDS.created.length > 0,
        hidden: editing
      }, intl.get('hmde.common.button.create').d('新建'))];
    }
    return [(baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current26 = baseInfoDS.current) === null || _baseInfoDS$current26 === void 0 ? void 0 : _baseInfoDS$current26.get('physicalModelType')) !== 'API' && /*#__PURE__*/React.createElement(BOPermissionButton, {
      funcType: "flat",
      icon: "add",
      disabled: predefineDisabled || editing || tableDS.created.length > 0,
      onClick: () => handleAddTemplateField(true),
      hidden: editing
    }, intl.get('hmde.bo.businessObject.useTempField').d('引用模板字段')), /*#__PURE__*/React.createElement(BOPermissionButton, {
      disabled: editing || tableDS.created.length >= 10,
      key: "fastAdd",
      icon: "playlist_add",
      onClick: () => handleFastCreate(tenantCustomObject ? FieldType.CUSTOM : FieldType.EXTEND),
      hidden: editing
    }, intl.get('hmde.common.fastCreate').d('快速新建')), /*#__PURE__*/React.createElement(BOPermissionButton, {
      funcType: "flat",
      icon: "add",
      hidden: !((_baseInfoDS$current27 = baseInfoDS.current) !== null && _baseInfoDS$current27 !== void 0 && _baseInfoDS$current27.get('flexFieldEnabledFlag')) || editing,
      onClick: () => handleAddField(FieldType.EXTEND),
      disabled: predefineDisabled || editing || tableDS.created.length > 0
    }, intl.get('hmde.common.button.create').d('新建')), /*#__PURE__*/React.createElement(BOPermissionButton, {
      funcType: "flat",
      icon: "add",
      hidden: !((_baseInfoDS$current28 = baseInfoDS.current) !== null && _baseInfoDS$current28 !== void 0 && _baseInfoDS$current28.get('extendTableEnabledFlag')) || editing,
      onClick: () => handleAddField(FieldType.EXTEND),
      disabled: predefineDisabled || editing || tableDS.created.length > 0
    }, intl.get('hmde.common.button.create').d('新建')), ...(editing || creating ? [
    /*#__PURE__*/
    // eslint-disable-next-line react/jsx-indent
    React.createElement(BOPermissionButton, {
      key: "cancel-o",
      icon: "cancel-o",
      onClick: handleCancelBatchEdit
    }, intl.get('hmde.common.button.cancel').d('取消')),
    /*#__PURE__*/
    // eslint-disable-next-line react/jsx-indent
    React.createElement(BOPermissionButton, {
      key: "save",
      icon: "save-o",
      onClick: handleBatchSave
    }, intl.get('hmde.common.button.save').d('保存'))] : [])];
  };
  const commonProps = {
    buttons: buttons(),
    handleDetail,
    activeKey,
    editing,
    creating,
    handleDeleteCheck,
    handleDelete,
    handleEnable,
    showVersion
  };

  // 标准字段 表格
  const standFieldTable = isTenant ? /*#__PURE__*/React.createElement(TenantFieldTable, _extends({
    tableDS: tableDS,
    updateSort: updateSort,
    updateRowConfig: updateRowConfig,
    handleDragEndBefore: handleDragEndBefore,
    renderDragIcon: renderDragIcon,
    scrollRef: scrollRef,
    getAddonBefore: getAddonBefore
  }, commonProps, {
    physicalModelType: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current29 = baseInfoDS.current) === null || _baseInfoDS$current29 === void 0 ? void 0 : _baseInfoDS$current29.get('physicalModelType'),
    baseInfoDS: baseInfoDS
  })) : /*#__PURE__*/React.createElement(StandardFieldTable, _extends({
    tableDS: tableDS,
    updateSort: updateSort,
    updateRowConfig: updateRowConfig,
    handleDragEndBefore: handleDragEndBefore,
    renderDragIcon: renderDragIcon,
    scrollRef: scrollRef,
    predefineDomainFlag: predefineDomainFlag
  }, commonProps, {
    physicalModelType: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current30 = baseInfoDS.current) === null || _baseInfoDS$current30 === void 0 ? void 0 : _baseInfoDS$current30.get('physicalModelType'),
    baseInfoDS: baseInfoDS
  }));
  // 扩展字段 表格
  const extendFieldTable = /*#__PURE__*/React.createElement(ExtendFieldTable, _extends({
    location: props === null || props === void 0 ? void 0 : props.location,
    FieldListCache: FieldListCache,
    tableDS: extendTableDS
  }, commonProps));
  const noTabsTable = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", {
    className: styles.title,
    style: {
      marginBottom: '12px'
    }
  }, intl.get('hmde.common.fieldList').d('字段列表')), standFieldTable);
  const tabChange = key => {
    if (activeKey === FieldType.STANDARD && tableDS.some(v => !v.get('businessObjectFieldId')) || activeKey === FieldType.EXTEND && extendTableDS.some(v => !v.get('extendFieldId')) || editing) {
      notification.warning({
        message: intl.get('hmde.bo.businessObject.msgNoSave').d('当前内容未保存')
      });
      return;
    }
    setActiveKey(key);
  };
  const getTable = () => {
    // 平台
    if (!isTenant) {
      if (allHidden) {
        return noTabsTable;
      } else {
        var _baseInfoDS$current31;
        const physicalModelType = (_baseInfoDS$current31 = baseInfoDS.current) === null || _baseInfoDS$current31 === void 0 ? void 0 : _baseInfoDS$current31.get('physicalModelType');
        return /*#__PURE__*/React.createElement(_Tabs, {
          activeKey: activeKey,
          onChange: key => tabChange(key),
          className: styles['field-tab']
        }, /*#__PURE__*/React.createElement(TabPane, {
          tab: intl.get('hmde.common.field.standardField').d('标准字段'),
          key: FieldType.STANDARD,
          forceRender: true
        }, standFieldTable), ![PhysicalModelType.API, PhysicalModelType.SQL].includes(physicalModelType) && /*#__PURE__*/React.createElement(TabPane, {
          tab: intl.get('hmde.common.field.extendField').d('扩展字段'),
          key: FieldType.EXTEND,
          forceRender: true
        }, extendFieldTable));
      }
    }
    // 租户(租户自定义+租户继承)
    return noTabsTable;
  };
  if (boDetailTabActiveKey === TAB_KEYS.fieldList) {
    // 把保存方法设置到 boStore  上
    boStore === null || boStore === void 0 ? void 0 : boStore.setState('beforePublicOperate', {
      isSaveChanged: editing,
      handleSave: handleBatchSave,
      handleUpdate: handleSuccess
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: wrapperRef,
    className: styles['reset-tabs-style']
  }, getTable());
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(FieldList));