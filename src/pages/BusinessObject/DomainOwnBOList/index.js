import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Progress from "@hzero-front-ui/c7n-ui/lib/ProgressPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Popconfirm from "@hzero-front-ui/c7n-ui/lib/Popconfirm";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Icon from "choerodon-ui/lib/icon";
import _getConfig from "choerodon-ui/lib/get-config";
import _useDataSet from "choerodon-ui/pro/lib/use-data-set";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _useModal from "choerodon-ui/pro/lib/use-modal";
import _isArray from "lodash/isArray";
import _isObject from "lodash/isObject";
import _forEach from "lodash/forEach";
import _isEmpty from "lodash/isEmpty";
/*
 * @Descripttion: 业务对象管理页面
 * @Date: 2021-08-04 13:39:58
 * @Author: ZHIJIAN.XU@HAND-CHINA.COM
 * @version: 0.0.1
 * @copyright: Copyright (c) 2021, Hand
 * ⚠️ 该模块被 apaas plugin 导出
 */

import React, { useMemo, useState, useEffect, useRef, useImperativeHandle } from 'react';
import { observer } from 'mobx-react-lite';
import { withRouter } from 'dva/router';
import { useRequest } from 'ahooks';
import RelationalPivot from 'hzero-front-apaas/lib/components/RelationalPivot';
import { RelationalModule } from 'hzero-front-apaas/lib/constants/code';
import { Header, Content, EmptyPage } from 'components/Page';
import request from 'utils/request';
import notification from 'utils/notification';
import qs from 'qs';
import { getResponse, isTenantRoleLevel, getCurrentTenant, setSession, getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { operatorRender } from 'utils/renderer';
import formatterCollections from 'utils/intl/formatterCollections';
import { ColumnAlign, ColumnLock, TableQueryBarType } from 'choerodon-ui/pro/lib/table/enum';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { openTab } from 'utils/menuTab';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import CommonImport from 'components/Import';
import List from "hzero-front-apaas/lib/components/List";
import Icons from 'components/Icons';
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { enableRender, statusRender } from "hzero-front-apaas/lib/utils/render";
import { PublishStatus, SourceType } from "hzero-front-apaas/lib/constants/businessObject";
import { renderPopConfirmTitle } from "hzero-front-apaas/lib/utils/render";
import { DomainDS } from "hzero-front-hmde/lib/stores/Domain/DomainDS";
import BusinessObjectDataSet from "hzero-front-hmde/lib/stores/BusinessObject/BusinessObjectDS";
import { queryIntlDataService, fetchDomainDetail, getApplicationService } from "hzero-front-hmde/lib/services/businessObjectService";
import { lowcodeOrganizationURL, getHzeroTabTitle } from "hzero-front-hmde/lib/utils/common";
import useThemeColor from "hzero-front-apaas/lib/hooks/useThemeColor";
import PopconfirmButton from "hzero-front-hmde/lib/components/PopconfirmButton";
import TextOverflow from "hzero-front-apaas/lib/components/TextOverflow";
import SearchForm from "hzero-front-hmde/lib/routes/Domain/components/NewList/SearchForm";
import CreateBOModal from "./CreateBOModal";
import CopyBOModal from "./CopyBOModal";
import PublishComponent from "./components/PublishComponent";
import VersionInfoModal from "./components/VersionInfoModal";
import FastCreateObj from "./FastCreateObjNew";
import AiCreateBo from "./AiCreateBo";
import { FN, PublicTypeList } from "./type";
import styles from "./index.less?modules";
import ConfigExport from "./components/ConfigExport";
import { getTenantBusinessObjectPrefixRule } from "./utils";
const isTenant = isTenantRoleLevel();
let cacheValue = ''; // 领域搜索条件缓存
let cacheDsValue; // 右侧 ds 查询条件缓存
// let batchPublishModalRef;
let scrollTop = 0;
const store = {
  // 存所有结构性组件下保存的数据对象
  dataMap: new Map(),
  getItem: key => store.dataMap.get(key),
  setItem: (key, value) => {
    store.dataMap.set(key, value);
  },
  delete: key => {
    store.dataMap.delete(key);
  },
  clear: () => {
    store.dataMap.clear();
  }
};
const DomainOwnBOList = ({
  isWorkbenchEnter,
  workbenchEnterdomainId,
  headRef,
  businessObjectKeyword,
  // workbenchEnterdomainCode,
  // workbenchEnterdomainName,
  workbenchEnterdomainObj
}) => {
  var _location$hash, _location$search$spli, _applicationFlagObj$h2;
  const Modal = _useModal();
  const hashDomainId = workbenchEnterdomainId || ((_location$hash = location.hash) === null || _location$hash === void 0 ? void 0 : _location$hash.substring(1));
  const element = document.getElementById('menuScroll');
  let _search = (_location$search$spli = location.search.split('?')) === null || _location$search$spli === void 0 ? void 0 : _location$search$spli[1];
  _search = qs.parse(_search);
  const _ref = _search || {},
    originKey = _ref.originKey;
  const progressRef = useRef({});
  const emptyDomain = {};
  const _useState = useState(emptyDomain),
    _useState2 = _slicedToArray(_useState, 2),
    domain = _useState2[0],
    setDomain = _useState2[1];
  const _useState3 = useState(cacheValue),
    _useState4 = _slicedToArray(_useState3, 2),
    searchValue = _useState4[0],
    setSearchValue = _useState4[1];
  const _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    loading = _useState6[0],
    setLoading = _useState6[1];
  const _useState7 = useState(false),
    _useState8 = _slicedToArray(_useState7, 2),
    publishFlag = _useState8[0],
    setPublishFlag = _useState8[1];
  const _useState9 = useState(0),
    _useState10 = _slicedToArray(_useState9, 2),
    publishPercent = _useState10[0],
    setPublishPercent = _useState10[1];
  const _useState11 = useState(PublicTypeList.publicObject),
    _useState12 = _slicedToArray(_useState11, 2),
    publicType = _useState12[0],
    setPublicType = _useState12[1];
  const domainListDs = useMemo(() => new _DataSet(DomainDS()), []);
  const extendTableEnabledFlag = domain === null || domain === void 0 ? void 0 : domain.extendTableEnabledFlag;
  const boTableDs = _useDataSet(() => BusinessObjectDataSet(domain), []);
  const themColor = useThemeColor();

  // 组合业务对象创建权限
  const _useRequest = useRequest(() => getApplicationService('hzero-aip'), {
      retryCount: 3
    }),
    applicationFlagObj = _useRequest.data;
  useDataSetEvents(domainListDs, 'query', ({
    dataSet
  }) => {
    var _dataSet$current;
    // 如果搜索了对象名称/编码 ,搜索内容需要带到右侧表格
    const word = dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$current = dataSet.current) === null || _dataSet$current === void 0 ? void 0 : _dataSet$current.get('businessObjectKeyword');
    if (word) {
      // 将左侧列表的对象编码查询带到右侧table
      boTableDs.setState('__SEARCHTEXT__', word);
      boTableDs.setQueryParameter('keyword', word);
      boTableDs.query();
    }
    cacheValue = dataSet.getQueryParameter(_getConfig('tableFilterSearchText'));
    return true;
  });
  useEffect(() => {
    return () => {
      var _boTableDs$queryDataS, _val$;
      const val = (_boTableDs$queryDataS = boTableDs.queryDataSet) === null || _boTableDs$queryDataS === void 0 ? void 0 : _boTableDs$queryDataS.data;
      cacheDsValue = val === null || val === void 0 ? void 0 : (_val$ = val[0]) === null || _val$ === void 0 ? void 0 : _val$.data;
    };
  }, [boTableDs]);
  useEffect(() => {
    if (cacheDsValue && _isObject(cacheDsValue) && !isWorkbenchEnter) {
      setTimeout(() => {
        _forEach(cacheDsValue, (value, key) => {
          var _boTableDs$queryDataS2, _boTableDs$queryDataS3;
          // eslint-disable-next-line no-unused-expressions
          (_boTableDs$queryDataS2 = boTableDs.queryDataSet) === null || _boTableDs$queryDataS2 === void 0 ? void 0 : (_boTableDs$queryDataS3 = _boTableDs$queryDataS2.current) === null || _boTableDs$queryDataS3 === void 0 ? void 0 : _boTableDs$queryDataS3.set(key, value); // 不能通过 loadData 方式，否则重置按钮恢复初始值会改变
        });
      }, 0);
    }
  }, [boTableDs]);

  // 查询租户业务对象自定义前缀
  const _useRequest2 = useRequest(() => fetchDomainDetail(domain === null || domain === void 0 ? void 0 : domain.domainId), {
      manual: true
    }),
    _useRequest2$data = _useRequest2.data,
    data = _useRequest2$data === void 0 ? workbenchEnterdomainObj : _useRequest2$data,
    runAsync = _useRequest2.runAsync;
  useEffect(() => {
    boTableDs.setState('domainId', domain === null || domain === void 0 ? void 0 : domain.domainId);
    boTableDs.setState('domainCode', domain === null || domain === void 0 ? void 0 : domain.domainCode);
    if (domain !== null && domain !== void 0 && domain.domainId && !workbenchEnterdomainObj) {
      runAsync();
    }
  }, [domain === null || domain === void 0 ? void 0 : domain.domainId, domain === null || domain === void 0 ? void 0 : domain.domainCode, boTableDs]);
  const init = () => {
    if (isWorkbenchEnter && workbenchEnterdomainObj) {
      setDomain(workbenchEnterdomainObj);
      return;
    }
    if (hashDomainId && originKey !== 'objectDetail') {
      // 如果是从领域跳转过来的，需要把原来的查询条件清除，否则会出现无法跳转到指定的业务对象的情况
      setSearchValue('');
      domainListDs.setQueryParameter('keyword', '');
    }
    // 初始化时如果路径上已存在该领域id,搜索该领域
    if (hashDomainId) {
      domainListDs.setQueryParameter('domainId', hashDomainId);
    }
    domainListDs.query().then(res => {
      if (_isArray(res === null || res === void 0 ? void 0 : res.content)) {
        // 初始查询成功,清除对 domainId 的筛选
        domainListDs.setQueryParameter('domainId', null);
        if (hashDomainId) {
          const targetItem = res.content.find(v => v.domainId === hashDomainId);
          if (targetItem) {
            setSearchValue(targetItem.domainName);
          }
        }
      }
    });
  };
  useEffect(() => {
    init();
  }, [workbenchEnterdomainObj]);
  const catchSearch = () => {
    const searchVal = store.getItem('catchText');
    const queryParams = store.getItem('catchQueryParams');
    // if (searchVal) {
    boTableDs.setState('__SEARCHTEXT__', searchVal);
    boTableDs.setQueryParameter('keyword', searchVal);
    // boTableDs.query();
    // }
    if (queryParams) {
      var _boTableDs$queryDataS4;
      (_boTableDs$queryDataS4 = boTableDs.queryDataSet) === null || _boTableDs$queryDataS4 === void 0 ? void 0 : _boTableDs$queryDataS4.create(queryParams);
    }
    store.delete('catchText');
    store.delete('catchQueryParams');
  };

  // 初始化
  const initData = () => {
    var _boTableDs$queryDataS5, _boTableDs$queryDataS6;
    boTableDs === null || boTableDs === void 0 ? void 0 : (_boTableDs$queryDataS5 = boTableDs.queryDataSet) === null || _boTableDs$queryDataS5 === void 0 ? void 0 : (_boTableDs$queryDataS6 = _boTableDs$queryDataS5.current) === null || _boTableDs$queryDataS6 === void 0 ? void 0 : _boTableDs$queryDataS6.reset(); // 切换领域重置表格搜索域
    boTableDs.setQueryParameter('domainId', domain === null || domain === void 0 ? void 0 : domain.domainId);
    if (domain !== null && domain !== void 0 && domain.domainId) {
      var _domainListDs$queryDa, _domainListDs$queryDa2;
      // 切换领域时

      if (isWorkbenchEnter && businessObjectKeyword) {
        boTableDs.setState('__SEARCHTEXT__', businessObjectKeyword);
        boTableDs.setQueryParameter('keyword', businessObjectKeyword);
      }
      /** 领域列表小漏斗的业务对象编码查询字段 */
      const word = (_domainListDs$queryDa = domainListDs.queryDataSet) === null || _domainListDs$queryDa === void 0 ? void 0 : (_domainListDs$queryDa2 = _domainListDs$queryDa.current) === null || _domainListDs$queryDa2 === void 0 ? void 0 : _domainListDs$queryDa2.get('businessObjectKeyword');
      if (word) {
        boTableDs.setState('__SEARCHTEXT__', word);
        boTableDs.setQueryParameter('keyword', word);
      }
      boTableDs.query();
    }
    (domain === null || domain === void 0 ? void 0 : domain.domainId) && queryIntlDataService().then(res => {
      if (getResponse(res)) {
        var _res$map;
        const intlStr = JSON.stringify(res === null || res === void 0 ? void 0 : (_res$map = res.map) === null || _res$map === void 0 ? void 0 : _res$map.call(res, item => ({
          code: item.code,
          value: item.value,
          description: item.description,
          meaning: item.meaning,
          name: item.name
        })));
        sessionStorage.setItem('multiLanguageStr', intlStr);
      }
    });
  };
  useEffect(() => {
    catchSearch();
    initData();
  }, [domain === null || domain === void 0 ? void 0 : domain.domainId, businessObjectKeyword]);
  useEffect(() => {
    setTimeout(() => {
      if (element) {
        element.scrollTo({
          top: scrollTop || 0
        });
      }
    }, 300);
  }, [element]);
  const handlePush = item => {
    var _boTableDs$queryDataS7, _boTableDs$queryDataS8, _boTableDs$queryDataS9;
    cacheDsValue = (_boTableDs$queryDataS7 = boTableDs.queryDataSet) === null || _boTableDs$queryDataS7 === void 0 ? void 0 : (_boTableDs$queryDataS8 = _boTableDs$queryDataS7.data) === null || _boTableDs$queryDataS8 === void 0 ? void 0 : _boTableDs$queryDataS8[0].data;
    const businessObjectId = item.businessObjectId,
      domainId = item.domainId,
      businessObjectName = item.businessObjectName,
      businessObjectCode = item.businessObjectCode;
    // history.push(`/hmde/business-object/detail/${id}`);
    const searchText = boTableDs.getState('__SEARCHTEXT__');
    store.setItem('catchText', searchText);
    const queryData = (_boTableDs$queryDataS9 = boTableDs.queryDataSet) === null || _boTableDs$queryDataS9 === void 0 ? void 0 : _boTableDs$queryDataS9.toData();
    if (queryData) {
      store.setItem('catchQueryParams', queryData === null || queryData === void 0 ? void 0 : queryData[0]);
    }
    setSession(`objVersion_${businessObjectCode}_${getCurrentOrganizationId()}`, '');
    openTab({
      key: `/hmde/business-object/detail/${businessObjectId}`,
      path: `/hmde/business-object/detail/${businessObjectId}`,
      closable: true,
      // tab 是否可以关闭
      // type: 'menu', // tab 类型
      title: businessObjectName,
      state: {
        domainId
      }
    });
  };
  const handleEnableBO = async id => {
    const res = await request(
    // `${API_HOST}/hmde/v1/${
    //   isTenantRoleLevel() ? `${getUserOrganizationId()}/` : ''
    // }business-objects/${id}/enabled`,
    `${lowcodeOrganizationURL({
      route: HZERO_HMDE
    })}/business-objects/${id}/enabled`, {
      method: 'PUT'
    });
    if (getResponse(res)) {
      boTableDs.query();
    }
  };
  const handleDisableBO = async id => {
    const res = await request(
    // `${API_HOST}/hmde/v1/${
    //   isTenantRoleLevel() ? `${getUserOrganizationId()}/` : ''
    // }business-objects/${id}/disabled`,
    `${lowcodeOrganizationURL({
      route: HZERO_HMDE
    })}/business-objects/${id}/disabled`, {
      method: 'PUT'
    });
    if (getResponse(res)) {
      boTableDs.query();
    }
  };
  /**
   * 快速创建业务对象
   */
  const handleFastCreate = () => {
    // 默认值
    Modal.open({
      title: /*#__PURE__*/React.createElement("div", {
        className: styles.title
      }, intl.get('hmde.common.fastCreate').d('快速新建')),
      style: {
        width: 950
      },
      closable: true,
      autoCenter: true,
      children: /*#__PURE__*/React.createElement(FastCreateObj, {
        domain: domain,
        tableQuery: () => boTableDs.query(),
        tenantBusinessObjectPrefixRule: data !== null && data !== void 0 && data.tenantBusinessObjectPrefixRule ? JSON.parse(data === null || data === void 0 ? void 0 : data.tenantBusinessObjectPrefixRule) : ''
      })
    });
  };
  const handleCreateBO = () => {
    Modal.open({
      title: /*#__PURE__*/React.createElement("div", {
        className: styles.title
      }, intl.get('hmde.common.addBusObj').d('新建业务对象')),
      style: {
        width: '958px'
      },
      contentStyle: {
        maxHeight: '85%',
        display: 'flex',
        flexDirection: 'column'
      },
      closable: true,
      border: false,
      autoCenter: true,
      okText: intl.get('hmde.common.button.save').d('保存'),
      cancelText: intl.get('hmde.common.button.cancel').d('取消'),
      okFirst: false,
      children: /*#__PURE__*/React.createElement(CreateBOModal, {
        dataSet: boTableDs,
        domain: domain,
        domainId: domain === null || domain === void 0 ? void 0 : domain.domainId,
        serviceCode: domain === null || domain === void 0 ? void 0 : domain.serviceCode,
        domainCode: domain === null || domain === void 0 ? void 0 : domain.domainCode,
        extendTableEnabledFlag: extendTableEnabledFlag,
        extendTableSuffix: domain === null || domain === void 0 ? void 0 : domain.extendTableSuffix,
        tenantBusinessObjectPrefixRule: getTenantBusinessObjectPrefixRule(data === null || data === void 0 ? void 0 : data.tenantBusinessObjectPrefixRule)
      })
    });
  };

  // AI新建
  const handleAiCreateBO = () => {
    Modal.open({
      title: /*#__PURE__*/React.createElement("div", {
        className: styles.title
      }, intl.get('hmde.bo.businessObject.aiCreateBusinessObject').d('AI新建')),
      style: {
        width: '958px'
      },
      contentStyle: {
        maxHeight: '85%',
        display: 'flex',
        flexDirection: 'column'
      },
      closable: true,
      border: false,
      autoCenter: true,
      okText: intl.get('hmde.common.button.save').d('保存'),
      cancelText: intl.get('hmde.common.button.cancel').d('取消'),
      okFirst: false,
      children: /*#__PURE__*/React.createElement(AiCreateBo, {
        boTableDs: boTableDs,
        domainCode: domain === null || domain === void 0 ? void 0 : domain.domainCode,
        domainId: domain === null || domain === void 0 ? void 0 : domain.domainId,
        tenantBusinessObjectPrefixRule: data !== null && data !== void 0 && data.tenantBusinessObjectPrefixRule ? JSON.parse(data.tenantBusinessObjectPrefixRule) : ''
      })
    });
  };
  const handleToER = () => {
    openTab({
      key: `/hmde/business-object/er`,
      path: `/hmde/business-object/er/${domain === null || domain === void 0 ? void 0 : domain.domainId}`,
      closable: true,
      // tab 是否可以关闭
      title: intl.get('hmde.bo.businessObject.erDiagram').d('业务对象 ER 图')
    });
  };

  // 复制成功提示框
  const copySuccess = ({
    businessObjectCode,
    businessObjectName,
    businessObjectId
  }) => {
    Modal.open({
      title: /*#__PURE__*/React.createElement("div", {
        className: styles.title
      }, /*#__PURE__*/React.createElement(_Icon, {
        type: "check_circle",
        style: {
          color: '#11D954',
          marginRight: 5
        }
      }), intl.get('hmde.common.copySuccess').d('复制成功')),
      contentStyle: {
        maxHeight: '85%',
        display: 'flex',
        flexDirection: 'column',
        width: '368px',
        minWidth: '368px'
      },
      border: false,
      autoCenter: true,
      okText: intl.get('hmde.common.button.viewDetail').d('查看详情'),
      okFirst: false,
      children: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: styles['copy-success-title']
      }, intl.get('hmde.bo.businessObject.objectInfo').d('业务对象信息')), /*#__PURE__*/React.createElement("div", {
        className: styles['copy-success-detail']
      }, /*#__PURE__*/React.createElement("div", {
        className: styles['copy-success-item']
      }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.busObjectName').d('业务对象名称')), /*#__PURE__*/React.createElement("span", null, businessObjectName)), /*#__PURE__*/React.createElement("div", {
        className: styles['copy-success-item']
      }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.busObjectCode').d('业务对象编码')), /*#__PURE__*/React.createElement("span", null, businessObjectCode)))),
      onOk: () => {
        openTab({
          key: `/hmde/business-object/detail/${businessObjectId}`,
          path: `/hmde/business-object/detail/${businessObjectId}`,
          closable: true,
          // tab 是否可以关闭
          title: businessObjectName,
          state: {
            originKey: 'fieldList',
            domainId: domain === null || domain === void 0 ? void 0 : domain.domainId
          }
        });
      },
      afterClose: () => {
        boTableDs.query();
      }
    });
  };

  // 复制业务对象
  const handleCEditBO = record => {
    Modal.open({
      title: /*#__PURE__*/React.createElement("div", {
        className: styles.title
      }, intl.get('hmde.bo.businessObject.copyBo').d('复制业务对象')),
      style: {
        width: '958px'
      },
      contentStyle: {
        maxHeight: '85%',
        display: 'flex',
        flexDirection: 'column'
      },
      closable: false,
      border: false,
      keyboardClosable: false,
      autoCenter: true,
      okText: intl.get('hmde.common.button.sure').d('确定'),
      cancelText: intl.get('hmde.common.button.close').d('关闭'),
      okFirst: false,
      children: /*#__PURE__*/React.createElement(CopyBOModal, {
        record: record,
        domain: domain,
        copySuccess: copySuccess,
        businessObjectCreatedFlag: data === null || data === void 0 ? void 0 : data.businessObjectCreatedFlag,
        oldTenantBusinessObjectPrefixRule: data !== null && data !== void 0 && data.tenantBusinessObjectPrefixRule ? JSON.parse(data.tenantBusinessObjectPrefixRule) : ''
      })
    });
  };

  // 依赖查询弹窗
  const dependenceFindFn = (record, boDeleteFlag) => {
    Modal.open({
      children: /*#__PURE__*/React.createElement(RelationalPivot, {
        modules: [{
          [RelationalModule.BUSINESS_OBJECT]: {
            targetValue: record === null || record === void 0 ? void 0 : record.get('businessObjectCode'),
            targetKey: 'BO'
            // tenantId: getCurrentTenant().tenantId,
          }
        }, {
          [RelationalModule.COMBIN_BUSINESS_OBJECT]: {
            targetValue: record === null || record === void 0 ? void 0 : record.get(FN.BUSINESS_OBJECT_CODE),
            targetKey: 'BO'
          }
        }, {
          [RelationalModule.FUNCTION_PAGE]: {
            targetValue: record === null || record === void 0 ? void 0 : record.get('businessObjectCode'),
            targetKey: 'BO',
            tenantId: getCurrentTenant().tenantId
          }
        }, {
          [RelationalModule.TRANSACTION_FLOW]: {
            targetValue: record === null || record === void 0 ? void 0 : record.get('businessObjectCode'),
            targetKey: 'BO'
            // tenantId: getCurrentTenant().tenantId,
          }
        }, {
          [RelationalModule.SCRIPT_EVENT]: {
            targetKey: 'BO',
            targetValue: record === null || record === void 0 ? void 0 : record.get('businessObjectCode')
            // tenantId: getCurrentTenant().tenantId,
          }
        }, {
          [RelationalModule.EXPORT_TEMPLATE]: {
            targetValue: record === null || record === void 0 ? void 0 : record.get('businessObjectCode'),
            targetKey: 'BO'
          }
        }, {
          [RelationalModule.IMPORT_TEMPLATE]: {
            targetValue: record === null || record === void 0 ? void 0 : record.get('businessObjectCode'),
            targetKey: 'BO'
          }
        }],
        otherProps: {
          boDeleteFlag
        },
        navs: [`${intl.get('hmde.common.busniessObject').d('业务对象')}：${record === null || record === void 0 ? void 0 : record.get('businessObjectName')}`],
        exportFlag: true
      })
    });
  };
  const handleChange = ({
    record,
    value,
    name
  }) => record === null || record === void 0 ? void 0 : record.set(name, value);
  const _useState13 = useState(false),
    _useState14 = _slicedToArray(_useState13, 2),
    visible = _useState14[0],
    setVisible = _useState14[1];
  const _useState15 = useState(''),
    _useState16 = _slicedToArray(_useState15, 2),
    busId = _useState16[0],
    setBusId = _useState16[1];
  const handleCheck = record => {
    setBusId('');
    request(`${lowcodeOrganizationURL({
      route: HZERO_HMDE
    })}/business-objects/${record === null || record === void 0 ? void 0 : record.get('businessObjectId')}?checkFlag=true`, {
      method: 'DELETE'
    }).then(res => {
      if (res.failed && ['hmde.error.delete.ref_used', 'hmde.error.delete.ref_used.detail'].includes(res.code)) {
        notification.error({
          message: intl.get('hmde.common.noDelete').d('不允许删除'),
          placement: 'bottomRight',
          description: intl.get('hmde.bo.businessObject.boDeleteMessage').d('该业务对象被依赖项使用，不允许删除')
        });
        setTimeout(() => {
          dependenceFindFn(record, true);
        }, 500);
        return;
      }
      if (getResponse(res)) {
        setVisible(true);
        setBusId(record === null || record === void 0 ? void 0 : record.get('businessObjectId'));
      }
    });
  };
  const columns = () => [{
    name: FN.BUSINESS_OBJECT_NAME,
    sortable: true,
    renderer: ({
      value,
      record,
      name
    }) => {
      if (!(record !== null && record !== void 0 && record.getState('editing'))) {
        return /*#__PURE__*/React.createElement("a", {
          style: {
            verticalAlign: 'initial'
          },
          onClick: () => handlePush(record === null || record === void 0 ? void 0 : record.toData())
        }, value);
      }
      return /*#__PURE__*/React.createElement(_TextField, {
        maxLength: 60,
        className: styles['bo-name'],
        name: FN.BUSINESS_OBJECT_NAME,
        value: record === null || record === void 0 ? void 0 : record.get(FN.BUSINESS_OBJECT_NAME),
        onChange: val => handleChange({
          value: val,
          record,
          name
        })
      });
    },
    minWidth: 150
  }, {
    name: FN.BUSINESS_OBJECT_CODE,
    sortable: true,
    // editor: (r) => !!r?.getState('editing') && creating,
    minWidth: 190
  }, {
    name: FN.BUSINESS_OBJECT_CATEGORY
  }, {
    name: FN.PHYSICAL_MODEL_TYPE
  }, {
    name: FN.SOURCE_TYPE
  }, {
    name: FN.PUBLISH_STATUS,
    align: "center",
    renderer: ({
      value
    }) => {
      const statusList = [{
        value: PublishStatus.PUBLISHED,
        status: 'success',
        text: intl.get('hmde.common.status.published').d('已发布')
      }, {
        value: PublishStatus.MODIFIED,
        status: 'warning',
        text: intl.get('hmde.common.status.modified').d('已修改')
      }, {
        value: PublishStatus.UNPUBLISHED,
        status: 'default',
        text: intl.get('hmde.common.status.unpublished').d('未发布')
      }];
      return statusRender(value === null || value === void 0 ? void 0 : value.toUpperCase(), statusList);
    }
  }, {
    name: FN.REMARK
  }, {
    name: FN.ENABLED_FLAG,
    align: "center",
    renderer: ({
      value
    }) => enableRender(value)
  }, {
    header: intl.get('hmde.common.table.column.operate').d('操作'),
    width: 230,
    lock: "right",
    renderer: ({
      dataSet,
      record
    }) => {
      var _record$get, _record$get2;
      const canEdit = !isTenant || isTenant && (record === null || record === void 0 ? void 0 : record.get('sourceType')) === 'TENANT';
      const operators = [];

      // 新增依赖查询按钮
      if ((record === null || record === void 0 ? void 0 : (_record$get = record.get('publishStatus')) === null || _record$get === void 0 ? void 0 : _record$get.toUpperCase()) !== PublishStatus.UNPUBLISHED) {
        operators.push({
          key: 'dependenceFind',
          ele: /*#__PURE__*/React.createElement("a", {
            onClick: () => dependenceFindFn(record)
          }, intl.get('hmde.common.dependenceFind').d('依赖查询')),
          len: 4,
          title: intl.get('hmde.common.dependenceFind').d('依赖查询')
        });
      }
      if (!(isTenant && ['PREDEFINE', 'PLATFORM', 'INHERIT'].includes(record === null || record === void 0 ? void 0 : record.get('sourceType'))) && (record === null || record === void 0 ? void 0 : (_record$get2 = record.get('publishStatus')) === null || _record$get2 === void 0 ? void 0 : _record$get2.toUpperCase()) !== PublishStatus.UNPUBLISHED) {
        operators.push({
          key: 'version',
          ele: /*#__PURE__*/React.createElement("a", {
            onClick: () => openVersionInfoModal(record)
          }, intl.get('hmde.bo.businessObject.versionMes').d('版本信息')),
          title: intl.get('hmde.bo.businessObject.versionMes').d('版本信息'),
          len: 4
        });
      }

      // 4155 新增业务对象复制功能(禁用状态 复制按钮置灰)
      // 租户层，平台标准对象不支持复制
      // 2023/7/24新增 api对象不支持复制
      if (
      // record?.get('physicalModelType') !== 'API' &&
      (record === null || record === void 0 ? void 0 : record.get('sourceType')) !== 'PREDEFINE' && !(isTenant && ['PLATFORM', 'INHERIT'].includes(record === null || record === void 0 ? void 0 : record.get('sourceType')))
      // && record?.get('businessObjectCategory') !== 'DIMENSION'
      ) {
        operators.push({
          key: 'templateSet',
          ele: !(record !== null && record !== void 0 && record.get('enabledFlag')) ? /*#__PURE__*/React.createElement("a", {
            style: {
              color: 'rgb(140, 140, 140)'
            }
          }, intl.get('hmde.common.copy').d('复制')) : /*#__PURE__*/React.createElement("a", {
            onClick: () => handleCEditBO(record)
          }, intl.get('hmde.common.copy').d('复制')),
          len: 2,
          title: !(record !== null && record !== void 0 && record.get('enabledFlag')) ? intl.get('hmde.bo.businessObject.copy.help').d('禁用的业务对象, 无法进行复制。') : intl.get('hmde.common.copy').d('复制')
        });
      }

      // 导出单挑业务对象(暂不设置权限)
      if ((record === null || record === void 0 ? void 0 : record.get('businessObjectCategory')) === 'STANDARD' && (record === null || record === void 0 ? void 0 : record.get('physicalModelType')) === 'TABLE') {
        operators.push({
          key: 'handleConfigExport',
          ele: /*#__PURE__*/React.createElement(ConfigExport, {
            businessObjectId: record === null || record === void 0 ? void 0 : record.get('businessObjectId')
          }),
          title: intl.get('hmde.bo.businessObject.handleConfigExport').d('配置导出'),
          len: 4
        });
      }
      if (!((record === null || record === void 0 ? void 0 : record.get('sourceType')) === 'PREDEFINE' && !isTenant) && canEdit) {
        const _enabledFlag = record === null || record === void 0 ? void 0 : record.get('enabledFlag');
        const showText = _enabledFlag ? intl.get('hmde.common.button.disable').d('禁用') : intl.get('hmde.common.button.enable').d('启用');
        operators.push({
          key: 'enableStatus',
          ele: /*#__PURE__*/React.createElement(PopconfirmButton
          // title={
          //   !record?.get('enabledFlag')
          //     ? intl
          //         .get('hmde.bo.businessObject.enableBusinessObj')
          //         .d('请确认是否启用该业务对象？')
          //     : intl
          //         .get('hmde.bo.businessObject.disableBusinessObj')
          //         .d('请确认是否禁用该业务对象？')
          // }
          , {
            titleTips: record !== null && record !== void 0 && record.get('enabledFlag') ? intl.get('hmde.common.message.disableTips').d(`是否禁用`) : intl.get('hmde.common.isEnabled').d(`是否启用`),
            text: showText,
            busLimits: true,
            onConfirm: () => {
              if (record !== null && record !== void 0 && record.get('enabledFlag')) {
                handleDisableBO(record === null || record === void 0 ? void 0 : record.get('businessObjectId'));
              } else {
                handleEnableBO(record === null || record === void 0 ? void 0 : record.get('businessObjectId'));
              }
            },
            delUrl: record !== null && record !== void 0 && record.get('enabledFlag') ? `/business-objects/${record === null || record === void 0 ? void 0 : record.get('businessObjectId')}/disabled?checkFlag=true` : `/business-objects/${record === null || record === void 0 ? void 0 : record.get('businessObjectId')}/enabled?checkFlag=true`,
            method: "PUT",
            componentType: "a"
          }),
          len: 2,
          title: showText
        });
      }
      if (canEdit && (record === null || record === void 0 ? void 0 : record.get('sourceType')) !== 'PREDEFINE') {
        operators.push({
          key: 'enable',
          ele:
          /*#__PURE__*/
          // <PopconfirmButton
          //   title={
          //   record?.get('publishStatus')?.toUpperCase() === PublishStatus.UNPUBLISHED
          //     ? intl
          //         .get('hmde.bo.businessObject.confirm.deleteBusinessObj')
          //         .d('请确认是否删除该业务对象?')
          //     : `
          //       ${intl
          //         .get('hmde.bo.businessObject.confirm.deleteBusinessObj2')
          //         .d('请确认是否删除该业务对象？不会级联删除关联的物理模型')}
          //       ${record?.get('physicalModelName')}
          //   `
          // }
          //   text={intl.get('hmde.common.button.delete').d('删除')}
          //   busLimits
          //   onConfirm={() => dataSet?.delete(record!, false)}
          //   styles={{ verticalAlign: 'top', width: '100%', textAlign: 'left' }}
          //   delUrl={`/business-objects/${record?.get('businessObjectId')}?checkFlag=true`}
          //   method="DELETE"
          // />
          React.createElement("a", {
            onClick: () => handleCheck(record)
          }, intl.get('hmde.common.button.delete').d('删除')),
          len: 2,
          title: intl.get('hmde.common.button.delete').d('删除')
        });
      }
      return (
        /*#__PURE__*/
        // 删除提示特殊处理
        React.createElement(_Popconfirm, {
          title: renderPopConfirmTitle(
          // record?.get('publishStatus')?.toUpperCase() === PublishStatus.UNPUBLISHED
          //   ? intl
          //       .get('hmde.bo.businessObject.confirm.deleteBusinessObj')
          //       .d('请确认是否删除该业务对象?')
          //   : `${intl
          //       .get('hmde.bo.businessObject.confirm.deleteBusinessObj2')
          //       .d('请确认是否删除该业务对象？不会级联删除关联的物理模型')}${record?.get(
          //       'physicalModelName'
          //     )}`,
          '', intl.get('hmde.bo.businessObject.deletetip').d('是否删除')),
          onConfirm: () => dataSet === null || dataSet === void 0 ? void 0 : dataSet.delete(record, false),
          onCancel: () => setVisible(false),
          visible: visible && (record === null || record === void 0 ? void 0 : record.get('businessObjectId')) === busId
        }, operatorRender(operators, record, {
          limit: 3
        }))
      );
    }
  }];
  useDataSetEvents(boTableDs, 'update', ({
    name,
    value,
    record
  }) => {
    if (name === 'businessObjectCode' && value) {
      record === null || record === void 0 ? void 0 : record.set('physicalModelName', `${domain === null || domain === void 0 ? void 0 : domain.domainCode}_${value || ''}`);
      record === null || record === void 0 ? void 0 : record.set('extendsTableName', `${domain === null || domain === void 0 ? void 0 : domain.domainCode}_${value || ''}_${(domain === null || domain === void 0 ? void 0 : domain.extendTableSuffix) || 'EXT'}`);
    }
  });
  const buttons = useMemo(() => {
    const operateButtons = [/*#__PURE__*/React.createElement(_Button, {
      color: "primary",
      icon: "search",
      onClick: handleToER
    }, intl.get('hmde.bo.button.viewRET').d('查看ER图')), /*#__PURE__*/React.createElement(ConfigExport, {
      domainId: domain.domainId
    })];
    if ((domain === null || domain === void 0 ? void 0 : domain.sourceType) !== SourceType.PREDEFINE) {
      var _applicationFlagObj$h;
      operateButtons.push(...[/*#__PURE__*/React.createElement(CommonImport, {
        templateCode: isTenant ? 'HMDE.BO.IMPORT.TENANT' : 'HMDE.BUSINESS_OBJECT.IMPORT',
        buttonText: intl.get('hmde.bo.businessObject.handleConfigImport').d('配置导入'),
        buttonProps: {
          funcType: 'link',
          style: {
            padding: '0 8px'
          },
          disabled: _isEmpty(domain) || data && !(data !== null && data !== void 0 && data.businessObjectCreatedFlag),
          hidden: isTenant && !(data !== null && data !== void 0 && data.tenantBusinessObjectCreatedFlag) || !(data !== null && data !== void 0 && data.businessObjectCreatedFlag)
        }
      }), /*#__PURE__*/React.createElement(_Button, {
        icon: "smart_toy-o",
        color: "primary",
        onClick: handleAiCreateBO,
        disabled: _isEmpty(domain),
        hidden: isTenant && !(data !== null && data !== void 0 && data.tenantBusinessObjectCreatedFlag) || !(data !== null && data !== void 0 && data.businessObjectCreatedFlag) || (applicationFlagObj === null || applicationFlagObj === void 0 ? void 0 : (_applicationFlagObj$h = applicationFlagObj['hzero-aip']) === null || _applicationFlagObj$h === void 0 ? void 0 : _applicationFlagObj$h.status) === 'DOWN'
      }, intl.get('hmde.bo.businessObject.aiCreateBusinessObject').d('AI新建')), /*#__PURE__*/React.createElement(_Button, {
        key: "fastAdd",
        icon: "playlist_add",
        color: "primary",
        disabled: _isEmpty(domain) || data && !(data !== null && data !== void 0 && data.businessObjectCreatedFlag),
        onClick: handleFastCreate,
        hidden: isTenant && !(data !== null && data !== void 0 && data.tenantBusinessObjectCreatedFlag) || !(data !== null && data !== void 0 && data.businessObjectCreatedFlag)
      }, intl.get('hmde.common.fastCreate').d('快速新建')), /*#__PURE__*/React.createElement(_Button, {
        icon: "add",
        color: "primary",
        onClick: handleCreateBO,
        disabled: _isEmpty(domain) || data && !(data !== null && data !== void 0 && data.businessObjectCreatedFlag),
        hidden: isTenant && !(data !== null && data !== void 0 && data.tenantBusinessObjectCreatedFlag) || !(data !== null && data !== void 0 && data.businessObjectCreatedFlag)
      }, intl.get('hmde.common.button.create').d('新建'))]);
    }
    return operateButtons;
  }, [isTenant, domain, data === null || data === void 0 ? void 0 : data.tenantBusinessObjectPrefixRule, data === null || data === void 0 ? void 0 : data.tenantBusinessObjectCreatedFlag, data === null || data === void 0 ? void 0 : data.businessObjectCreatedFlag, applicationFlagObj === null || applicationFlagObj === void 0 ? void 0 : (_applicationFlagObj$h2 = applicationFlagObj['hzero-aip']) === null || _applicationFlagObj$h2 === void 0 ? void 0 : _applicationFlagObj$h2.status]);
  const publishComProps = {
    setPublishPercent,
    progressRef,
    publicType,
    setLoading,
    boTableDs,
    setPublicType,
    publishFlag,
    setPublishFlag,
    domain // 把当前选择的领域也传过去
  };
  const openVersionInfoModal = record => {
    const businessObjectId = record === null || record === void 0 ? void 0 : record.get('businessObjectId');
    Modal.open({
      title: /*#__PURE__*/React.createElement("div", {
        className: styles.title
      }, intl.get('hmde.bo.businessObject.versionMes').d('版本信息')),
      closable: true,
      style: {
        width: '958px'
      },
      children: /*#__PURE__*/React.createElement(VersionInfoModal, {
        businessObjectId: businessObjectId,
        businessObjectCreatedFlag: data === null || data === void 0 ? void 0 : data.businessObjectCreatedFlag
      }),
      cancelText: intl.get('hmde.common.button.close').d('关闭'),
      footer: (_, cancelBtn) => cancelBtn
    });
  };

  // 对外暴露按钮区域 用于飞达工作台那边使用
  useImperativeHandle(headRef, () => ({
    getHeadButton: headerButtons
  }));
  const headerButtons = () => {
    return /*#__PURE__*/React.createElement(PublishComponent, publishComProps);
  };
  const renderSearchForm = () => {
    return /*#__PURE__*/React.createElement(SearchForm, {
      ListDs: domainListDs
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, !isWorkbenchEnter && /*#__PURE__*/React.createElement(Header, {
    title: /*#__PURE__*/React.createElement("div", {
      className: styles['header-title']
    }, getHzeroTabTitle())
  }, headerButtons()), /*#__PURE__*/React.createElement(Content, null, /*#__PURE__*/React.createElement(_Spin, {
    spinning: loading,
    style: {
      width: '100%'
    },
    indicator: /*#__PURE__*/React.createElement("div", {
      className: styles['spin-inner-content']
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        marginRight: 20
      }
    }, /*#__PURE__*/React.createElement(_Progress, {
      value: publishPercent,
      status: 'active',
      strokeColor: themColor === null || themColor === void 0 ? void 0 : themColor.primary
    })), /*#__PURE__*/React.createElement("a", {
      onClick: e => {
        var _progressRef$current;
        e.preventDefault();
        if (progressRef !== null && progressRef !== void 0 && (_progressRef$current = progressRef.current) !== null && _progressRef$current !== void 0 && _progressRef$current.openAsyncDetail) {
          // 打开发布过程的详情
          progressRef.current.openAsyncDetail();
        }
      }
    }, /*#__PURE__*/React.createElement(_Icon, {
      type: "visibility-o"
    }), "\xA0", /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.button.viewDetail').d('查看详情'))))
  }), /*#__PURE__*/React.createElement("div", {
    className: styles['bo-content'],
    style: {
      height: isWorkbenchEnter ? 'auto' : '100%'
    }
  }, !isWorkbenchEnter && /*#__PURE__*/React.createElement("div", {
    className: styles['menu-left'],
    onScroll: e => {
      var _e$target;
      scrollTop = e === null || e === void 0 ? void 0 : (_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.scrollTop;
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: styles['content-title'],
    style: {
      marginBottom: 20
    }
  }, intl.get('hmde.common.domain').d('领域')), /*#__PURE__*/React.createElement("div", {
    className: styles['main-content']
  }, /*#__PURE__*/React.createElement(List, {
    dataSet: domainListDs,
    idField: "domainId",
    title: "domainName",
    className: styles['domain-list'],
    titleRender: (value, record) => {
      return /*#__PURE__*/React.createElement("div", {
        className: styles['domain-title']
      }, /*#__PURE__*/React.createElement(Icons, {
        style: {
          marginRight: '8px',
          fontSize: '12px'
        },
        type: record.icon
      }), /*#__PURE__*/React.createElement(TextOverflow, {
        text: value,
        width: 150
      }));
    },
    searchForm: renderSearchForm
    // searchForm={() => (
    //   <Form dataSet={domainListDs.queryDataSet}>
    //     <TextField
    //       name="domainKeyword"
    //       placeholder={intl
    //         .get('hmde.common.text.domainnamecode')
    //         .d('请输入领域名称/编码')}
    //       clearButton
    //       onEnterDown={() => domainListDs.query()}
    //     />
    //     <TextField
    //       name="businessObjectKeyword"
    //       placeholder={intl
    //         .get('hmde.common.fuzzyQueryPlaceholder3')
    //         .d('请输入对象名称/编码')}
    //       clearButton
    //       onEnterDown={() => domainListDs.query()}
    //     />
    //   </Form>
    // )}
    ,
    initKeyword: searchValue,
    shrinkFlag: true,
    searchIconHighlight: true,
    placeholder: intl.get('hmde.common.searchNameCode').d('搜索名称/编码'),
    onChange: ({
      record
    }) => {
      if (record) {
        const domainId = record.get('domainId');
        location.hash = domainId;
        setDomain(record.toData());
      }
    },
    searchFormFooterStyle: {
      justifyContent: 'flex-end'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: `${styles['content-right']} ${isWorkbenchEnter ? styles['content-right-branch'] : ''}`
  }, !isWorkbenchEnter && /*#__PURE__*/React.createElement("h3", {
    className: styles['content-title']
  }, domain.domainName), domainListDs.length > 0 || isWorkbenchEnter ? /*#__PURE__*/React.createElement(_Table, {
    dataSet: boTableDs,
    queryBar: "filterBar",
    buttons: buttons,
    columns: columns(),
    queryBarProps: {
      fuzzyQueryPlaceholder: intl.get('hmde.bo.businessObject.batchPublishModal.placeholder').d('可输入业务对象名称、编码等')
    }
  }) : /*#__PURE__*/React.createElement(EmptyPage, null)))));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(withRouter(observer(DomainOwnBOList)));