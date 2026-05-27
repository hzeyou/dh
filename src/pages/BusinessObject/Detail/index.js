import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Tabs from "@hzero-front-ui/c7n-ui/lib/Tabs";
import _Progress from "@hzero-front-ui/c7n-ui/lib/ProgressPro";
import _Skeleton from "@hzero-front-ui/c7n-ui/lib/SkeletonPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _extends from "@babel/runtime/helpers/esm/extends";
import _Breadcrumb from "@hzero-front-ui/c7n-ui/lib/Breadcrumb";
import _Tag from "@hzero-front-ui/c7n-ui/lib/Tag";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _useModal from "choerodon-ui/pro/lib/use-modal";
import _isFunction from "lodash/isFunction";
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { clearCache, useSafeState } from 'ahooks';
import LowcodeModalProvider from 'hzero-front-apaas/lib/components/LowcodeModalProvider';
import { Content, Header } from 'components/Page';
import { TagRender } from 'utils/renderer';
import RelationalPivot from 'hzero-front-apaas/lib/components/RelationalPivot';
import { RelationalModule } from 'hzero-front-apaas/lib/constants/code';
import { updateTab, openTab, closeTab } from 'utils/menuTab';
import { whetherToCloseModal } from 'hzero-front-apaas/lib/utils/common';
import { TabsPosition } from 'choerodon-ui/lib/tabs/enum';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import AsyncProgress from 'hzero-front-apaas/lib/components/AsyncProgress';
import { isResponse } from 'hzero-front-apaas/lib/utils/request';
import notification from 'utils/notification';
import { getCurrentTenant, getResponse, getSession, isTenantRoleLevel, setSession } from 'utils/utils';
import request from 'utils/request';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { usePublicBusinessObjects } from "hzero-front-apaas/lib/hooks/PublicObject";
import { renderModalConfirm } from "hzero-front-apaas/lib/utils/render";
import { getBusinessObjectRequests, getOBTabFlag, queryPageDesignConfig } from "hzero-front-hmde/lib/services/businessObjectService";
import { getRecourseServer } from "hzero-front-apaas/lib/services/businessObjectService";
import { SourceType, PublishStatus } from "hzero-front-apaas/lib/constants/businessObject";
import ButtonGroup from "hzero-front-hmde/lib/businessComponents/ButtonGroup";
import BusinessObjectDataSet from "hzero-front-hmde/lib/stores/BusinessObject/BusinessObjectDS";
import { pageDs } from "hzero-front-hmde/lib/stores/BusinessObject/PageDS";
import { compTemplateDs } from "hzero-front-hmde/lib/stores/BusinessObject/CompTemplate";
import { buttonDs } from "hzero-front-hmde/lib/stores/BusinessObject/ButtonDS";
import { ruleDs } from "hzero-front-hmde/lib/stores/BusinessObject/RulesDS";
import { tableDs } from "hzero-front-hmde/lib/stores/BusinessObject/OptionListDS";
import advancedListDS from "hzero-front-hmde/lib/stores/BusinessObject/AdvancedDS";
import RelationDetailDS from "hzero-front-hmde/lib/stores/BusinessObject/RelationDetailDS";
import PermissionPolicyDS, { DsStatus } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionPolicyDS";
import useThemeColor from "hzero-front-apaas/lib/hooks/useThemeColor";
import PublishDetailModal from "hzero-front-apaas/lib/components/PublishDetailModal";
import AuditEditItem from "hzero-front-hmde/lib/routes/BusinessObjectAudit/FrontPage/AuditEditItem";
import FoundationCommonApi from "hzero-front-hmde/lib/businessComponents/CommonApi";
import { permissionCheck } from "hzero-front-hmde/lib/services/authorityManageService";
import { PERMISSION_CATEGORY } from "hzero-front-hmde/lib/constants/code";
import { PhysicalModelType } from "hzero-front-hmde/lib/constants/businessObject";
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import DependentCheckButtons from "hzero-front-hmde/lib/components/DependentCheckButtons";
import { queryBusinessObjectDependentCheck, sendBusinessObjectDependentCheck } from "hzero-front-hmde/lib/services/dependentCheckService";
import { CheckType } from "hzero-front-hmde/lib/components/DependentCheckButtons/constants/code";
import BaseInfo from "../../BusinessObject/Detail/BasicInfo";
import FieldList from "./FieldsList";
import FieldListQueryCache from "./FieldsList/cache/query";
import OptionList from "./OptionsList";
import Pages from "./Pages";
import CompTemplate from "./CompTemplate";
import Buttons from "./Buttons";
import EventFlow from "./EventFlow";
import Rules from "./Rules";
import AdvancedRelationship from "./AdvancedRelationship";
import PermissionPolicy from "./PermissionPolicy";
import RelationDetail from "./RelationDetail";
import SqlMaintenance from "./SqlMaintenance";
import TabTitleList, { statusList, TAB_KEYS, TabPaneRender } from "./TabItemList";
import styles from "./index.less?modules";
import VersionRollbackModal from "../DomainOwnBOList/components/VersionRollbackModal";
import VersionInfoModal from "../DomainOwnBOList/components/VersionInfoModal";
import CommonApi from "./CommonApi";
import LineTrigger from "./LineTrigger";
import BOPublish from "./components/BOPublish";
import BOPermissionButton from "./components/BOPermissionButton";
import { useBoStore } from "./stores";
export const Store = /*#__PURE__*/createContext({});
const isTenant = isTenantRoleLevel();
const PublishTabsKeys = [TAB_KEYS.baseInfo, TAB_KEYS.fieldList, TAB_KEYS.commmonApi, TAB_KEYS.sql, TAB_KEYS.rules, TAB_KEYS.advancedRelationship, TAB_KEYS.permissionPolicy];
// ⚠️ 展示发布按钮,同时页面也可编辑的 tab, 这几个 tab 需要实现发布前保存判断操作
const PublishSaveTabsKeys = [TAB_KEYS.baseInfo, TAB_KEYS.fieldList, TAB_KEYS.commmonApi, TAB_KEYS.sql];
// 业务对象详情
const BODetail = props => {
  var _props$location, _props$location$state, _props$location2, _props$location2$quer, _props$location3, _props$location3$stat, _baseInfoDS$current, _baseInfoDS$current2, _baseInfoDS$current3, _baseInfoDS$current4, _baseInfoDS$current5, _baseInfoDS$current6, _baseInfoDS$current7, _baseInfoDS$current8, _baseInfoDS$current9, _baseInfoDS$current10, _baseInfoDS$current28, _baseInfoDS$current29, _baseInfoDS$current30, _listRef$current3, _listRef$current4, _baseInfoDS$current31;
  const businessObjectId = props.match.params.id;
  const history = props.history;
  const originKey = (props === null || props === void 0 ? void 0 : (_props$location = props.location) === null || _props$location === void 0 ? void 0 : (_props$location$state = _props$location.state) === null || _props$location$state === void 0 ? void 0 : _props$location$state.originKey) || (props === null || props === void 0 ? void 0 : (_props$location2 = props.location) === null || _props$location2 === void 0 ? void 0 : (_props$location2$quer = _props$location2.query) === null || _props$location2$quer === void 0 ? void 0 : _props$location2$quer.originkey) || '';
  const apiListCode = (props === null || props === void 0 ? void 0 : (_props$location3 = props.location) === null || _props$location3 === void 0 ? void 0 : (_props$location3$stat = _props$location3.state) === null || _props$location3$stat === void 0 ? void 0 : _props$location3$stat.apiListCode) || '';
  const Modal = _useModal();
  const themColor = useThemeColor();
  const boStore = useBoStore();
  const hasPermission = boStore.getState('hasPermission');
  const objVersionKey = boStore.getState('objVersionKey');
  const progressRef = useRef({});
  const advancedRef = useRef(); // 高级关系ref
  const businessRuleRef = useRef(); // 业务规则ref
  const permissionRef = useRef(); // 权限策略ref
  const apiRef = useRef(); // 通用api ref
  const foundationCommmonApiRef = useRef(); // 业务对象基础信息 ref
  const auditEditItemRef = useRef(); // 对象审计 ref
  const isFirstRenderRef = useRef(true); // 是否为组件首次渲染
  const oldPathNameRef = useRef(); // 首次加载路径名
  const _useState = useState(TAB_KEYS.fieldList),
    _useState2 = _slicedToArray(_useState, 2),
    activeKey = _useState2[0],
    setActiveKey = _useState2[1];
  const _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    loading = _useState4[0],
    setLoading = _useState4[1];
  const _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    hasHlodModuleFlag = _useState6[0],
    setHasHlodModuleFlag = _useState6[1]; // 如果 hlod 模块没有安装，一些 Tab 页面的内容需要隐藏
  const _useState7 = useState(false),
    _useState8 = _slicedToArray(_useState7, 2),
    publishFlag = _useState8[0],
    setPublishFlag = _useState8[1];
  const _useState9 = useState(0),
    _useState10 = _slicedToArray(_useState9, 2),
    publishPercent = _useState10[0],
    setPublishPercent = _useState10[1];
  const _useState11 = useState(''),
    _useState12 = _slicedToArray(_useState11, 2),
    asyncProgressStatus = _useState12[0],
    setAsyncProgressStatus = _useState12[1];
  const FieldListCache = useMemo(() => new FieldListQueryCache(), []);
  const _useState13 = useState(),
    _useState14 = _slicedToArray(_useState13, 2),
    showVersion = _useState14[0],
    setShowVersion = _useState14[1]; // 展示的版本号 (如果有值说明是历史版本)
  const _useState15 = useState(false),
    _useState16 = _slicedToArray(_useState15, 2),
    readOnlyFlag = _useState16[0],
    setReadOnlyFlag = _useState16[1];
  const versionDescriptionRef = useRef(); // 业务对象发布时的版本说明
  const _useSafeState = useSafeState([]),
    _useSafeState2 = _slicedToArray(_useSafeState, 2),
    versionList = _useSafeState2[0],
    setVersionList = _useSafeState2[1]; // 版本列表
  const _useState17 = useState(false),
    _useState18 = _slicedToArray(_useState17, 2),
    rollbacking = _useState18[0],
    setRollbacking = _useState18[1]; // 版本回滚判断
  const _useSafeState3 = useSafeState(false),
    _useSafeState4 = _slicedToArray(_useSafeState3, 2),
    isFirstLoading = _useSafeState4[0],
    setIsFirstLoading = _useSafeState4[1];

  // 用于接收发布按钮依赖检查的 promise 状态
  const dependentCheckPublishResolveRef = useRef(null);

  // 基础信息DS
  const baseInfoDS = useMemo(() => {
    return new _DataSet({
      ...BusinessObjectDataSet({
        boId: businessObjectId,
        showVersion,
        baseInfoEnter: true,
        boStore
      }),
      autoQuery: false
    });
  }, [businessObjectId, showVersion]);

  // 发布存储数据ds
  const publishDataDs = useMemo(() => new _DataSet({}), []);

  /**
   * 获取版本列表
   */
  const getVersionList = useCallback(() => {
    request(`${lowcodeOrganizationURL({
      route: HZERO_HMDE
    })}/business-objects/${businessObjectId}/versions`, {
      method: 'GET',
      params: {
        page: -1,
        size: -1
      }
    }).then(midRes => {
      if (getResponse(midRes)) {
        setVersionList(midRes === null || midRes === void 0 ? void 0 : midRes.content);
      }
    }).catch(e => {
      console.error(e);
    });
  }, []);
  useEffect(() => {
    // 获取业务对象版本信息
    getVersionList();
  }, []);

  // 设置 tab 的 activeKey 到 store
  useEffect(() => {
    boStore.setState('boDetailTabActiveKey', activeKey);
  }, [activeKey]);
  useEffect(() => {
    // 设置业务对象信息
    boStore.setState('baseInfoDS', baseInfoDS);
  }, [baseInfoDS]);

  // 根据 businessObjectId 获取基本信息
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      setIsFirstLoading(true);
    }
    baseInfoDS.query().then(async res => {
      if (res) {
        // 检查权限信息
        const permissionRes = await permissionCheck({
          dataType: PERMISSION_CATEGORY.BO,
          dataId: res.businessObjectId,
          domainId: res.domainId
        });
        if (isResponse(permissionRes)) {
          boStore.setState('hasPermission', permissionRes.permissionFlag);
        }
        // 统一设置下标签页标题
        // console.log('??更新', res.businessObjectId);
        // 只有从window.open其他地方跳过来才更新标题
        const jumpform = localStorage.getItem('businessObjectJumpform');
        if (jumpform) {
          localStorage.removeItem('businessObjectJumpform');
          updateTab({
            title: res.businessObjectName,
            key: `/hmde/business-object/detail/${res.businessObjectId}`
          });
        }
        setTimeout(() => {
          // 如果是 sql 对象,并且不存在 activeKey, 则定位到 sql 维护
          if ((res === null || res === void 0 ? void 0 : res.physicalModelType) == PhysicalModelType.SQL && !originKey) {
            setActiveKey(TAB_KEYS.sql);
            return;
          }
          if (localStorage.getItem('locateToTemplatePage')) {
            localStorage.removeItem('locateToTemplatePage');
            setActiveKey(TAB_KEYS.template);
            return;
          }
          if (!activeKey || !tabContentVisibleFlag(activeKey)) {
            // 如果要展示的 tab 没有被渲染在页面上，防止用户看到白屏，自动切换到默认 Tab
            // TODO 这个 TAB 有一个缓存行为的问题，前端用了 location.state 的办法实现，导致了一些奇奇怪怪的问题。
            // 让业务记了一个优化项，后面可以从这里开始改起！
            setActiveKey(TAB_KEYS.fieldList);
          }
        }, 50);
      }
    }).finally(() => {
      setIsFirstLoading(false);
    });
  }, [baseInfoDS]);

  // tab节点点击事件
  const handleItemClick = key => {
    var _listRef$current, _businessRuleRef$curr, _advancedRef$current, _permissionRef$curren, _apiRef$current, _apiRef$current$init, _auditEditItemRef$cur, _auditEditItemRef$cur2, _foundationCommmonApi, _foundationCommmonApi2;
    setActiveKey(key);
    let ds = new _DataSet({});
    switch (key) {
      case TAB_KEYS.pages:
        // 交互视图
        ds = pageDS;
        break;
      case TAB_KEYS.template:
        // 单模板
        ds = templateDS;
        break;
      case TAB_KEYS.buttons:
        // 按钮管理
        ds = buttonDS;
        break;
      case TAB_KEYS.baseInfo:
        // 基础信息
        ds = baseInfoDS;
        break;
      case TAB_KEYS.fieldList:
        // 字段列表
        // eslint-disable-next-line no-unused-expressions
        (_listRef$current = listRef.current) === null || _listRef$current === void 0 ? void 0 : _listRef$current.initData();
        return;
      case TAB_KEYS.rules:
        // 业务规则
        // eslint-disable-next-line no-unused-expressions
        (_businessRuleRef$curr = businessRuleRef.current) === null || _businessRuleRef$curr === void 0 ? void 0 : _businessRuleRef$curr.initData();
        return;
      case TAB_KEYS.advancedRelationship:
        // 高级关系
        // eslint-disable-next-line no-unused-expressions
        (_advancedRef$current = advancedRef.current) === null || _advancedRef$current === void 0 ? void 0 : _advancedRef$current.initData();
        return;
      case TAB_KEYS.relationDetail:
        // 关系明细
        ds = relationDetailDS;
        break;
      case TAB_KEYS.permissionPolicy:
        // 权限策略
        // eslint-disable-next-line no-unused-expressions
        (_permissionRef$curren = permissionRef.current) === null || _permissionRef$curren === void 0 ? void 0 : _permissionRef$curren.initData();
        return;
      case TAB_KEYS.commmonApi:
        // 关系明细
        apiRef === null || apiRef === void 0 ? void 0 : (_apiRef$current = apiRef.current) === null || _apiRef$current === void 0 ? void 0 : (_apiRef$current$init = _apiRef$current.init) === null || _apiRef$current$init === void 0 ? void 0 : _apiRef$current$init.call(_apiRef$current);
        break;
      case TAB_KEYS.auditEditItem:
        // 对象审计
        auditEditItemRef === null || auditEditItemRef === void 0 ? void 0 : (_auditEditItemRef$cur = auditEditItemRef.current) === null || _auditEditItemRef$cur === void 0 ? void 0 : (_auditEditItemRef$cur2 = _auditEditItemRef$cur.init) === null || _auditEditItemRef$cur2 === void 0 ? void 0 : _auditEditItemRef$cur2.call(_auditEditItemRef$cur);
        break;
      case TAB_KEYS.foundationCommmonApi:
        // 对象审计
        foundationCommmonApiRef === null || foundationCommmonApiRef === void 0 ? void 0 : (_foundationCommmonApi = foundationCommmonApiRef.current) === null || _foundationCommmonApi === void 0 ? void 0 : (_foundationCommmonApi2 = _foundationCommmonApi.init) === null || _foundationCommmonApi2 === void 0 ? void 0 : _foundationCommmonApi2.call(_foundationCommmonApi);
        break;
      default:
        break;
    }
    ds.query();
  };
  const objectVersionNumber = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('objectVersionNumber');
  const token = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : _baseInfoDS$current2.get('_token');
  const domainId = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current3 = baseInfoDS.current) === null || _baseInfoDS$current3 === void 0 ? void 0 : _baseInfoDS$current3.get('domainId');
  const businessObjectCode = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current4 = baseInfoDS.current) === null || _baseInfoDS$current4 === void 0 ? void 0 : _baseInfoDS$current4.get('businessObjectCode');
  const businessObjectName = (_baseInfoDS$current5 = baseInfoDS.current) === null || _baseInfoDS$current5 === void 0 ? void 0 : _baseInfoDS$current5.get('businessObjectName');
  const physicalModelType = (_baseInfoDS$current6 = baseInfoDS.current) === null || _baseInfoDS$current6 === void 0 ? void 0 : _baseInfoDS$current6.get('physicalModelType');
  const publishStatus = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current7 = baseInfoDS.current) === null || _baseInfoDS$current7 === void 0 ? void 0 : _baseInfoDS$current7.get('publishStatus');
  const sourceType = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current8 = baseInfoDS.current) === null || _baseInfoDS$current8 === void 0 ? void 0 : _baseInfoDS$current8.get('sourceType');
  const newPublishedFlag = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current9 = baseInfoDS.current) === null || _baseInfoDS$current9 === void 0 ? void 0 : _baseInfoDS$current9.get('newPublishedFlag'); // 拟定态的发布状态
  const canVisible = [SourceType.PLATFORM, SourceType.TENANT].includes(sourceType);
  const published = [PublishStatus.PUBLISHED, PublishStatus.MODIFIED].includes(publishStatus);
  const middleBusinessObjFlag = (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current10 = baseInfoDS.current) === null || _baseInfoDS$current10 === void 0 ? void 0 : _baseInfoDS$current10.get('businessObjectCategory')) === 'MIDDLE'; // 关系明细

  /** 业务对象基础信息通用api请求方法 */
  const handleRequest = useCallback(() => getBusinessObjectRequests(businessObjectCode), [businessObjectCode]);
  const versionFlag = !(isTenant && [SourceType.PLATFORM, 'INHERIT'].includes(sourceType));
  // 在这判断是否显示当前版本这个选项
  useEffect(() => {
    if (!versionFlag) {
      // 租户，继承的业务对象不搞多版本
      return;
    }
    baseInfoDS.ready().then(() => {
      const objVersion = getSession(objVersionKey);
      // 判断是否带有版本号,有版本号进入只读状态，没有版本号进入编辑态
      if (!objVersion) {
        setShowVersion(undefined);
        setReadOnlyFlag(false);
      } else {
        setShowVersion(objVersion);
        setReadOnlyFlag(true);
      }
    });
  }, [newPublishedFlag, versionList, showVersion, readOnlyFlag, objVersionKey]);
  const rulesDS = useMemo(() => {
    return new _DataSet(ruleDs({
      showVersion
    }));
  }, [showVersion]);
  const buttonDS = useMemo(() => {
    return new _DataSet(buttonDs(businessObjectCode));
  }, [businessObjectCode]);
  const pageDS = useMemo(() => {
    return new _DataSet(pageDs(businessObjectCode, domainId));
  }, [businessObjectCode]);

  // 单模板 和交互视图字段相同
  const templateDS = useMemo(() => {
    return new _DataSet(compTemplateDs(businessObjectCode, domainId));
  }, [businessObjectCode]);

  // 高级关系菜单列表ds
  const advancedListDs = useMemo(() => {
    return new _DataSet(advancedListDS(businessObjectCode, showVersion));
  }, [businessObjectCode, showVersion]);
  const usedPermissionDs = useMemo(() => new _DataSet(PermissionPolicyDS({
    status: DsStatus.NORMAL,
    showVersion
  })), [showVersion]);

  // 值列表ds
  const optionsListDs = useMemo(() => {
    return new _DataSet(tableDs(businessObjectCode, physicalModelType));
  }, [businessObjectCode]);
  const relationDetailDS = useMemo(() => {
    return new _DataSet(RelationDetailDS(businessObjectId, showVersion));
  }, [businessObjectId, showVersion]);
  useEffect(() => {
    const initPermission = async () => {
      const res = await getOBTabFlag();
      if (res && !res.failed) {
        const isHzeroLowcode = res.content.find(item => item.serviceCode === 'hzero-lowcode');
        if (isHzeroLowcode) {
          const result = await queryPageDesignConfig();
          if (result && !(result !== null && result !== void 0 && result.failed) && +(result === null || result === void 0 ? void 0 : result.businessObjectPageEnabledFlag) === 1) {
            setHasHlodModuleFlag(true);
          }
        }
      }
    };
    initPermission();
  }, []);
  useEffect(() => {
    rulesDS.setState('businessObjectCode', businessObjectCode);
  }, [businessObjectCode]);
  useEffect(() => {
    if (originKey && originKey in TAB_KEYS) {
      setActiveKey(originKey);
    }
  }, [originKey]);
  const listRef = useRef();
  const ruleRef = useRef();
  ruleRef.current = rulesDS;
  const _usePublicBusinessObj = usePublicBusinessObjects({
      _businessObjectId: businessObjectId,
      _objectVersionNumber: objectVersionNumber,
      baseDS: baseInfoDS,
      setPublishFlag,
      setLoading,
      listRef,
      ruleRef,
      token,
      versionDescriptionRef,
      // 版本说明
      optionsListDs
    }),
    handlePublicObject = _usePublicBusinessObj.handlePublicObject;

  // 发布业务对象
  const publicObject = async cb => {
    // // 如果是table编辑态 无法发布
    // if (
    //   listRef?.current?.tableDS.some((v) => v.status === 'add' || v.status === 'update') ||
    //   listRef?.current?.extendTableDS.some((v) => v.status === 'add' || v.status === 'update')
    // ) {
    //   notification.warning({
    //     message: intl.get('hmde.bo.businessObject.msgNoSave').d('当前内容未保存'),
    //   });
    //   return;
    // }
    return new Promise(resolve => {
      // 部分 tab 发布前保存判断
      const _ref = (boStore === null || boStore === void 0 ? void 0 : boStore.getState('beforePublicOperate')) || {},
        isSaveChanged = _ref.isSaveChanged,
        handleSave = _ref.handleSave;
      const openModal = () => {
        var _baseInfoDS$current11, _listRef$current2, _listRef$current2$ext, _baseInfoDS$current12;
        const handleOk = isCheck => {
          setPublishFlag(true);
          setLoading(true);
          return handlePublicObject(undefined, cb, {
            validateAfterPublish: !!isCheck
          }).then(res => {
            if (!res) {
              setPublishFlag(false);
            }
            if (getResponse(res)) {
              optionsListDs.query();
              if (_isFunction(cb)) {
                cb();
              }
            }
            return res;
          });
        };
        Modal.open({
          title: /*#__PURE__*/React.createElement("strong", null, versionFlag ? intl.get('hmde.bo.businessObject.pubObject').d('发布业务对象') : ''),
          children: /*#__PURE__*/React.createElement(BOPublish, {
            versionFlag: versionFlag,
            extendFlag: !(baseInfoDS !== null && baseInfoDS !== void 0 && (_baseInfoDS$current11 = baseInfoDS.current) !== null && _baseInfoDS$current11 !== void 0 && _baseInfoDS$current11.get('extendsTableId')) && (listRef === null || listRef === void 0 ? void 0 : (_listRef$current2 = listRef.current) === null || _listRef$current2 === void 0 ? void 0 : (_listRef$current2$ext = _listRef$current2.extendTableDS) === null || _listRef$current2$ext === void 0 ? void 0 : _listRef$current2$ext.length) && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current12 = baseInfoDS.current) === null || _baseInfoDS$current12 === void 0 ? void 0 : _baseInfoDS$current12.get('extendTableEnabledFlag')),
            textRef: versionDescriptionRef,
            baseInfoDS: baseInfoDS
          }),
          okText: intl.get('hmde.common.publish').d('发布'),
          onOk: () => {
            return handleOk();
          },
          onClose: () => {
            resolve(false);
          },
          footer: (okBtn, cancelBtn, modal) => {
            var _baseInfoDS$current13, _baseInfoDS$current14, _baseInfoDS$current15;
            const dependentCheckQuery = {
              businessObjectCode,
              tenantId: (_baseInfoDS$current13 = baseInfoDS.current) === null || _baseInfoDS$current13 === void 0 ? void 0 : _baseInfoDS$current13.get('tenantId')
            };
            return /*#__PURE__*/React.createElement(React.Fragment, null, cancelBtn, ((_baseInfoDS$current14 = baseInfoDS.current) === null || _baseInfoDS$current14 === void 0 ? void 0 : _baseInfoDS$current14.get('publishStatus')) !== 'UNPUBLISHED' && /*#__PURE__*/React.createElement(DependentCheckButtons, {
              sendCheckDetail: () => sendBusinessObjectDependentCheck(dependentCheckQuery),
              queryCheckDetail: () => queryBusinessObjectDependentCheck(dependentCheckQuery),
              checkType: CheckType.BusinessObject,
              version: (_baseInfoDS$current15 = baseInfoDS.current) === null || _baseInfoDS$current15 === void 0 ? void 0 : _baseInfoDS$current15.get('version'),
              color: "primary",
              beforeQuery: () => new Promise(_resolve => {
                handleOk(true);
                modal.close(false);
                // @ts-ignore
                dependentCheckPublishResolveRef.current = _resolve;
              }),
              isHiddenLastCheck: true
            }, intl.get('hmde.common.dependenceCheck.publish').d('发布并检查依赖项')), okBtn);
          }
        });
      };
      if (PublishSaveTabsKeys.includes(activeKey)) {
        if (isSaveChanged) {
          // 如果未保存，直接调用保存方法
          handleSave === null || handleSave === void 0 ? void 0 : handleSave().then(isSaveSuccess => {
            if (isSaveSuccess) {
              openModal();
            } else {
              resolve(false);
            }
          });
        } else {
          openModal();
        }
      } else {
        openModal();
      }
    });
  };

  // 打开依赖查询弹窗
  const showDependent = closeKey => {
    var _baseInfoDS$current16, _baseInfoDS$current17, _baseInfoDS$current18, _baseInfoDS$current19, _baseInfoDS$current20, _baseInfoDS$current21, _baseInfoDS$current22, _baseInfoDS$current23;
    closeKey && notification.close(closeKey);
    return Modal.open({
      children: /*#__PURE__*/React.createElement(RelationalPivot, {
        modules: [{
          [RelationalModule.BUSINESS_OBJECT]: {
            targetValue: (_baseInfoDS$current16 = baseInfoDS.current) === null || _baseInfoDS$current16 === void 0 ? void 0 : _baseInfoDS$current16.get('businessObjectCode'),
            targetKey: 'BO'
            // tenantId: getCurrentTenant().tenantId,
          }
        }, {
          [RelationalModule.COMBIN_BUSINESS_OBJECT]: {
            targetValue: (_baseInfoDS$current17 = baseInfoDS.current) === null || _baseInfoDS$current17 === void 0 ? void 0 : _baseInfoDS$current17.get('businessObjectCode'),
            targetKey: 'BO'
          }
        }, {
          [RelationalModule.FUNCTION_PAGE]: {
            targetValue: (_baseInfoDS$current18 = baseInfoDS.current) === null || _baseInfoDS$current18 === void 0 ? void 0 : _baseInfoDS$current18.get('businessObjectCode'),
            targetKey: 'BO',
            tenantId: getCurrentTenant().tenantId
          }
        }, {
          [RelationalModule.TRANSACTION_FLOW]: {
            targetValue: (_baseInfoDS$current19 = baseInfoDS.current) === null || _baseInfoDS$current19 === void 0 ? void 0 : _baseInfoDS$current19.get('businessObjectCode'),
            targetKey: 'BO'
            // tenantId: getCurrentTenant().tenantId,
          }
        }, {
          [RelationalModule.SCRIPT_EVENT]: {
            targetKey: 'BO',
            targetValue: (_baseInfoDS$current20 = baseInfoDS.current) === null || _baseInfoDS$current20 === void 0 ? void 0 : _baseInfoDS$current20.get('businessObjectCode')
            // tenantId: getCurrentTenant().tenantId,
          }
        }, {
          [RelationalModule.EXPORT_TEMPLATE]: {
            targetValue: (_baseInfoDS$current21 = baseInfoDS.current) === null || _baseInfoDS$current21 === void 0 ? void 0 : _baseInfoDS$current21.get('businessObjectCode'),
            targetKey: 'BO'
          }
        }, {
          [RelationalModule.IMPORT_TEMPLATE]: {
            targetValue: (_baseInfoDS$current22 = baseInfoDS.current) === null || _baseInfoDS$current22 === void 0 ? void 0 : _baseInfoDS$current22.get('businessObjectCode'),
            targetKey: 'BO'
          }
        }],
        otherProps: {},
        navs: [`${intl.get('hmde.common.busniessObject').d('业务对象')}：${(_baseInfoDS$current23 = baseInfoDS.current) === null || _baseInfoDS$current23 === void 0 ? void 0 : _baseInfoDS$current23.get('businessObjectName')}`],
        exportFlag: true
      })
    });
  };

  /**
   * @description: 发布业务对象成功回调
   */
  const publishedSuccess = recourseFlag => {
    if (window.location.pathname === oldPathNameRef.current) {
      setPublishFlag(false);
      setLoading(false);
      const closeKey = `open${Date.now()}`;
      notification.success({
        duration: recourseFlag ? 10 : 3,
        message: intl.get('hmde.common.successfullyPublished').d('发布成功'),
        key: closeKey,
        placement: 'bottomRight',
        btn: recourseFlag && /*#__PURE__*/React.createElement(_Button, {
          onClick: () => notification.close(closeKey)
        }, intl.get('hmde.common.button.close').d('关闭')),
        description: recourseFlag && /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.publicMsg1').d('该业务对象已被其他对象、页面、事务流、脚本事件、导出模板或导入模板使用，请至'), /*#__PURE__*/React.createElement("a", {
          onClick: () => showDependent(closeKey),
          color: "primary"
        }, intl.get('hmde.bo.businessObject.publicMsg2').d('对象列表>依赖查询')), "\uFF0C", intl.get('hmde.bo.businessObject.publicMsg3').d('查询对应依赖项并根据对象的调整判断是否调整依赖项。'))
      });
      getVersionList();
      baseInfoDS.query();
      if (activeKey === TAB_KEYS.rules) {
        rulesDS.query();
      }
      optionsListDs.query();
      if ('businessObjectCode' in usedPermissionDs.queryParameter) {
        usedPermissionDs.query();
      }
      if (published) {
        // ?
        templateDS.query();
      }
      if (hasHlodModuleFlag && canVisible && published) {
        pageDS.query();
        buttonDS.query();
      }
      // FIXME 目前无法获取准确的缓存 key, 发布完业务对象，清除全部 useRequest 缓存
      clearCache();
    } else {
      setTimeout(() => publishedSuccess(recourseFlag), 400);
    }
  };

  /**
   * 单个发布成功, 需要判断是否有依赖项
   */
  const getRecourseFlag = () => {
    var _dependentCheckPublis, _baseInfoDS$current24, _getCurrentTenant;
    // 更新值列表显示字段
    optionsListDs === null || optionsListDs === void 0 ? void 0 : optionsListDs.setState('changeFlag', +new Date());
    (_dependentCheckPublis = dependentCheckPublishResolveRef.current) === null || _dependentCheckPublis === void 0 ? void 0 : _dependentCheckPublis.call(dependentCheckPublishResolveRef, (_baseInfoDS$current24 = baseInfoDS.current) === null || _baseInfoDS$current24 === void 0 ? void 0 : _baseInfoDS$current24.toData());
    dependentCheckPublishResolveRef.current = null;
    getRecourseServer({
      tenantId: (_getCurrentTenant = getCurrentTenant()) === null || _getCurrentTenant === void 0 ? void 0 : _getCurrentTenant.tenantId,
      businessObjectCode
    }).then(res => {
      if (getResponse(res) || !res) {
        publishedSuccess(res);
      }
    });
    if (PublishSaveTabsKeys.includes(activeKey)) {
      var _boStore$getState, _boStore$getState$han;
      boStore === null || boStore === void 0 ? void 0 : (_boStore$getState = boStore.getState('beforePublicOperate')) === null || _boStore$getState === void 0 ? void 0 : (_boStore$getState$han = _boStore$getState.handleUpdate) === null || _boStore$getState$han === void 0 ? void 0 : _boStore$getState$han.call(_boStore$getState);
    }
  };

  /**
   * @description: 获取标题
   */
  const getTitle = () => {
    var _baseInfoDS$current25, _baseInfoDS$current26;
    const currentActiveItem = tabPaneList.find(o => o.tabKey === activeKey);
    return /*#__PURE__*/React.createElement(_Breadcrumb, {
      style: {
        marginLeft: '10px'
      }
    }, /*#__PURE__*/React.createElement(_Breadcrumb.Item, null, /*#__PURE__*/React.createElement("span", null, ' ', (_baseInfoDS$current25 = baseInfoDS.current) === null || _baseInfoDS$current25 === void 0 ? void 0 : _baseInfoDS$current25.getPristineValue('businessObjectName'), "-", currentActiveItem === null || currentActiveItem === void 0 ? void 0 : currentActiveItem.title), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 10
      }
    }, TagRender(publishStatus, statusList())), /*#__PURE__*/React.createElement(_Tag, null, `${intl.get('hmde.se.scriptEvent.version').d('版本')} ${baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current26 = baseInfoDS.current) === null || _baseInfoDS$current26 === void 0 ? void 0 : _baseInfoDS$current26.get('version')}`)));
  };

  // 控制 Tab 标题，内容是否可见
  const tabContentVisibleFlag = key => {
    var _baseInfoDS$current27;
    if (!(key in TAB_KEYS)) {
      throw new Error(`未知Tab key: ${key}, 请在 TAB_KEYS 变量中定义 tabs 的 key 值.`);
    }
    switch (key) {
      case TAB_KEYS.optionList:
        return !!published;
      case TAB_KEYS.template:
        return !!published;
      case TAB_KEYS.lineTrigger:
      case TAB_KEYS.auditEditItem:
        return !!published && ![PhysicalModelType.API, PhysicalModelType.SQL].includes(physicalModelType);
      case TAB_KEYS.permissionPolicy:
        return physicalModelType !== PhysicalModelType.API;
      case TAB_KEYS.pages:
      case TAB_KEYS.buttons:
      case TAB_KEYS.eventFlow:
        return hasHlodModuleFlag && canVisible && published && physicalModelType !== PhysicalModelType.SQL;
      case TAB_KEYS.relationDetail:
        return false;
      // return middleBusinessObjFlag;
      case TAB_KEYS.advancedRelationship:
        return !middleBusinessObjFlag;
      // 通用api(api模型业务对象需展示)
      case TAB_KEYS.commmonApi:
        return physicalModelType === PhysicalModelType.API;
      case TAB_KEYS.foundationCommmonApi:
        return ((_baseInfoDS$current27 = baseInfoDS.current) === null || _baseInfoDS$current27 === void 0 ? void 0 : _baseInfoDS$current27.get('showApiFlag')) && !!published;
      case TAB_KEYS.rules:
        return physicalModelType !== PhysicalModelType.SQL;
      case TAB_KEYS.sql:
        return physicalModelType === PhysicalModelType.SQL;
      default:
        return true;
    }
  };
  const fieldListProps = {
    listRef,
    baseInfoDS,
    published,
    businessObjectId,
    businessObjectCode,
    // boSourceType: sourceType,
    publishStatus,
    FieldListCache,
    businessObjectName,
    customPrimaryKeyCode: (_baseInfoDS$current28 = baseInfoDS.current) === null || _baseInfoDS$current28 === void 0 ? void 0 : _baseInfoDS$current28.get('customPrimaryKeyCode'),
    readOnlyFlag,
    showVersion
  };
  const advancedRelationshipProps = {
    businessObjectCode,
    businessObjectName,
    businessObjectId,
    advancedListDs,
    baseInfoDS,
    sourceType,
    advancedRef,
    readOnlyFlag,
    showVersion
  };
  // 所有Tab内容列表
  const tabPaneList = [{
    tabKey: TAB_KEYS.baseInfo,
    title: intl.get('hmde.common.baseInfo').d('基础信息'),
    children: /*#__PURE__*/React.createElement(BaseInfo, _extends({
      dataSet: baseInfoDS,
      boSourceType: sourceType,
      readOnlyFlag: readOnlyFlag,
      showVersion: showVersion
    }, props))
  }, {
    tabKey: TAB_KEYS.sql,
    title: intl.get('hmde.bo.sqlBo.maintain').d('SQL 维护'),
    children: /*#__PURE__*/React.createElement(SqlMaintenance, {
      showVersion: showVersion
    })
  }, {
    tabKey: TAB_KEYS.fieldList,
    title: intl.get('hmde.common.fieldList').d('字段列表'),
    children: /*#__PURE__*/React.createElement(FieldList, _extends({}, props, fieldListProps))
  },
  // 通用api
  {
    tabKey: TAB_KEYS.commmonApi,
    title: intl.get('hmde.bo.businessObject.interfaceMain').d('接口维护'),
    children: /*#__PURE__*/React.createElement(CommonApi, {
      baseInfoDS: baseInfoDS,
      apiRef: apiRef,
      optionsListDs: optionsListDs,
      apiListCode: apiListCode
    })
  }, {
    tabKey: TAB_KEYS.optionList,
    title: intl.get('hmde.bo.businessObject.tab.optionList').d('值列表'),
    children: /*#__PURE__*/React.createElement(OptionList, _extends({}, props, {
      domainId: domainId,
      sourceType: sourceType,
      optionsListDs: optionsListDs,
      title: businessObjectName,
      businessObjectTenantId: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current29 = baseInfoDS.current) === null || _baseInfoDS$current29 === void 0 ? void 0 : _baseInfoDS$current29.get('tenantId'),
      businessObjectCode: businessObjectCode,
      baseInfoDS: baseInfoDS,
      handleItemClick: handleItemClick
    }))
  },
  // 记录触发器 LineTrigger
  {
    tabKey: TAB_KEYS.lineTrigger,
    title: intl.get('hmde.bo.businessObject.tab.lineTigger').d('记录触发器'),
    children: /*#__PURE__*/React.createElement(LineTrigger, {
      baseInfoDS: baseInfoDS
    })
  }, {
    tabKey: TAB_KEYS.pages,
    title: intl.get('hmde.bo.businessObject.tab.pages').d('交互视图'),
    children: /*#__PURE__*/React.createElement(Pages, _extends({
      pageDS: pageDS,
      publishStatus: publishStatus,
      domainId: domainId
    }, props, {
      businessObjectCode: businessObjectCode,
      businessObjectName: businessObjectName
    }))
  }, {
    tabKey: TAB_KEYS.buttons,
    title: intl.get('hmde.bo.businessObject.tab.buttons').d('按钮管理'),
    children: /*#__PURE__*/React.createElement(Buttons, _extends({
      buttonDS: buttonDS
    }, props, {
      businessObjectCode: businessObjectCode
    }))
  }, {
    tabKey: TAB_KEYS.rules,
    title: intl.get('hmde.common.rules').d('业务规则'),
    children: /*#__PURE__*/React.createElement(Rules, _extends({}, props, {
      ruleDS: rulesDS,
      domainId: domainId,
      businessRuleRef: businessRuleRef,
      baseInfoDS: baseInfoDS,
      businessObjectCode: businessObjectCode,
      businessObjectName: businessObjectName,
      readOnlyFlag: readOnlyFlag || !hasPermission,
      showVersion: showVersion
    }))
  }, {
    tabKey: TAB_KEYS.eventFlow,
    title: intl.get('hmde.bo.businessObject.tab.eventFlow').d('事件流程'),
    children: /*#__PURE__*/React.createElement(EventFlow, _extends({
      businessObjectCode: businessObjectCode
    }, props, {
      activeKey: activeKey
    }))
  }, {
    tabKey: TAB_KEYS.template,
    title: intl.get('hmde.bo.businessObject.tab.template').d('预设页面'),
    children: /*#__PURE__*/React.createElement(CompTemplate, _extends({
      pageDS: templateDS,
      publishStatus: publishStatus,
      domainId: domainId,
      domainCode: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current30 = baseInfoDS.current) === null || _baseInfoDS$current30 === void 0 ? void 0 : _baseInfoDS$current30.get('domainCode')
    }, props, {
      businessObjectCode: businessObjectCode,
      businessObjectName: businessObjectName
    }))
  }, {
    tabKey: TAB_KEYS.advancedRelationship,
    title: intl.get('hmde.common.advancedRelationship').d('高级关系'),
    children: /*#__PURE__*/React.createElement(AdvancedRelationship, advancedRelationshipProps)
  }, {
    tabKey: TAB_KEYS.permissionPolicy,
    title: intl.get('hmde.bo.businessObject.tab.permissionPolicy').d('权限策略'),
    children: /*#__PURE__*/React.createElement(PermissionPolicy, {
      baseInfoDS: baseInfoDS,
      usedPermissionDs: usedPermissionDs,
      readOnlyFlag: readOnlyFlag
    })
  }, {
    tabKey: TAB_KEYS.relationDetail,
    title: intl.get('hmde.bo.businessObject.tab.relationDetail').d('关系明细'),
    children: /*#__PURE__*/React.createElement(RelationDetail, {
      relationDetailDS: relationDetailDS,
      tableDS: listRef === null || listRef === void 0 ? void 0 : (_listRef$current3 = listRef.current) === null || _listRef$current3 === void 0 ? void 0 : _listRef$current3.tableDS,
      extendTableDS: listRef === null || listRef === void 0 ? void 0 : (_listRef$current4 = listRef.current) === null || _listRef$current4 === void 0 ? void 0 : _listRef$current4.extendTableDS,
      sourceType: sourceType,
      readOnlyFlag: readOnlyFlag
    })
  }, {
    tabKey: TAB_KEYS.auditEditItem,
    title: intl.get('hmde.bo.businessObject.tab.audit').d('对象审计'),
    children: /*#__PURE__*/React.createElement(AuditEditItem, {
      currentCode: businessObjectCode,
      currentId: businessObjectId,
      baseInfoDS: baseInfoDS,
      auditEditItemRef: auditEditItemRef,
      readonly: !hasPermission
    })
  }, {
    tabKey: TAB_KEYS.foundationCommmonApi,
    title: intl.get('hmde.common.commonApi').d('通用API'),
    children: /*#__PURE__*/React.createElement(FoundationCommonApi, {
      onRequest: handleRequest,
      foundationCommmonApiRef: foundationCommmonApiRef,
      isComponent: true,
      physicalModelType: (_baseInfoDS$current31 = baseInfoDS.current) === null || _baseInfoDS$current31 === void 0 ? void 0 : _baseInfoDS$current31.get('physicalModelType')
    })
  }];
  const hiddenPublishFlag = sourceType === SourceType.PREDEFINE || !PublishTabsKeys.includes(activeKey);
  const contextValue = {
    permissionRef
  };

  /**
   * @description: 打开版本信息弹窗
   */
  const openVersionInfoModal = () => {
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
        businessObjectCreatedFlag: hasPermission
      }),
      cancelText: intl.get('hmde.common.button.close').d('关闭'),
      footer: (_, cancelBtn) => cancelBtn
    });
  };

  /**
   * @description: 业务对象版本回滚
   */
  function revertVersion() {
    setRollbacking(true);
    request(`${lowcodeOrganizationURL({
      route: HZERO_HMDE
    })}/business-objects/${businessObjectId}/rollback`, {
      method: 'GET',
      params: {
        version: showVersion
      }
    }).then(res => {
      if (!res.failed) {
        // 版本回退成功，刷新页面
        notification.success({});
        setSession(objVersionKey, '');
        setShowVersion(undefined);
      } else if (res.failed === true && (res === null || res === void 0 ? void 0 : res.code) === 'hmde.error.publish.field_error') {
        const _res$errorList = res.errorList,
          errorList = _res$errorList === void 0 ? [] : _res$errorList,
          _res$validateRuleErro = res.validateRuleErrorList,
          validateRuleErrorList = _res$validateRuleErro === void 0 ? [] : _res$validateRuleErro,
          _res$associateErrorLi = res.associateErrorList,
          associateErrorList = _res$associateErrorLi === void 0 ? [] : _res$associateErrorLi;
        const data = [...errorList, ...validateRuleErrorList, ...associateErrorList];
        Modal.open({
          closable: true,
          okButton: false,
          style: {
            width: '800px'
          },
          cancelText: intl.get('hmde.common.button.close').d('关闭'),
          children: /*#__PURE__*/React.createElement(VersionRollbackModal, {
            data: data
          })
        });
      } else {
        getResponse(res);
      }
    }).catch(err => {
      console.error(err);
    }).finally(async () => {
      setRollbacking(false);
    });
  }
  const onError = async callback => {
    if (window.location.pathname === oldPathNameRef.current) {
      var _await$callback$;
      setPublishFlag(false);
      setLoading(false);
      notification.warning({
        message: intl.get('hmde.common.publishingFailed').d('发布失败'),
        description: (_await$callback$ = (await (callback === null || callback === void 0 ? void 0 : callback()))[0]) === null || _await$callback$ === void 0 ? void 0 : _await$callback$.message,
        placement: 'bottomRight'
      });
    } else {
      setTimeout(() => onError(callback), 400);
    }
  };

  /**
   * @description: 渲染右上角按钮
   */
  function renderTopButs() {
    var _baseInfoDS$current32, _baseInfoDS$current33, _getCurrentTenant2;
    if (readOnlyFlag) {
      return;
    }
    // 多选字段 生成的中间对象 未发布 与那个发布按钮
    const hiddenFlag = (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current32 = baseInfoDS.current) === null || _baseInfoDS$current32 === void 0 ? void 0 : _baseInfoDS$current32.get('middleLinkBusinessObjects')) && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current33 = baseInfoDS.current) === null || _baseInfoDS$current33 === void 0 ? void 0 : _baseInfoDS$current33.get('publishStatus')) === 'UNPUBLISHED';
    return businessObjectCode && !hiddenPublishFlag && !hiddenFlag ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ButtonGroup, {
      mainButtonProps: {
        title: intl.get('hmde.common.publish').d('发布'),
        icon: /*#__PURE__*/React.createElement(ImgIcon, {
          name: "send_publish.svg",
          size: 14,
          style: {
            marginRight: 10
          }
        }),
        permission: true,
        handleClick: () => {
          var _progressRef$current;
          setPublishPercent(0);
          return publicObject(progressRef === null || progressRef === void 0 ? void 0 : (_progressRef$current = progressRef.current) === null || _progressRef$current === void 0 ? void 0 : _progressRef$current.handleQuery);
        },
        buttonProps: {
          loading,
          disabled: publishFlag,
          color: "primary",
          style: {
            marginLeft: 10
          }
        }
      },
      othersButtonProps: [{
        title: intl.get('hmde.bo.businessObject.versionMes').d('版本信息'),
        handleClick: openVersionInfoModal,
        disabled: loading || rollbacking
      }, {
        title: intl.get('hmde.common.ViewLastReleaseStatus').d('查看上次发布情况'),
        hidden: !asyncProgressStatus,
        handleClick: () => {
          var _progressRef$current2;
          if (progressRef !== null && progressRef !== void 0 && (_progressRef$current2 = progressRef.current) !== null && _progressRef$current2 !== void 0 && _progressRef$current2.openAsyncDetail) {
            // 打开发布过程的详情
            progressRef.current.openAsyncDetail();
          }
        }
      }]
    }), /*#__PURE__*/React.createElement(AsyncProgress, {
      _ref: progressRef,
      jobCode: "businessObjectPublish" // 任务编码 - 固定的
      ,
      businessKey: `${businessObjectCode}_${(_getCurrentTenant2 = getCurrentTenant()) === null || _getCurrentTenant2 === void 0 ? void 0 : _getCurrentTenant2.tenantId}` // 业务主键
      ,
      route: HZERO_HMDE // 服务路由
      ,
      timeInterval: 500 // 轮询时间间隔
      ,
      onSuccess: getRecourseFlag,
      onStart: () => {
        oldPathNameRef.current = window.location.pathname;
        setLoading(true);
      },
      onError: async callback => onError(callback),
      onChange: (percent, status) => {
        setPublishPercent(percent);
        setAsyncProgressStatus(status);
        publishDataDs === null || publishDataDs === void 0 ? void 0 : publishDataDs.setState('percent', percent);
        publishDataDs === null || publishDataDs === void 0 ? void 0 : publishDataDs.setState('status', status);
      },
      style: {
        width: '12px'
      },
      hidden: true // 界面不显示，但是需要这个功能，通过 ref 操控
      ,
      openCustomAsyncDetail: openPublishDetailModal,
      backgroundRefresh: true
    })) : null;
  }

  // 恢复版本
  const handleRestoreNew = () => {
    renderModalConfirm(intl.get('hmde.bo.businessObject.restoreTipsNew').d('恢复后历史版本配置将覆盖成为最新版本配置，请确认是否恢复？'), {
      title: intl.get('hmde.bo.businessObject.isRestoreNew').d('是否恢复'),
      onOk: revertVersion
    });
  };

  // 返回最新版本
  const handleGoToNew = () => {
    var _baseInfoDS$current34, _baseInfoDS$current35;
    const objVersionkey = `objVersion_${(_baseInfoDS$current34 = baseInfoDS.current) === null || _baseInfoDS$current34 === void 0 ? void 0 : _baseInfoDS$current34.get('businessObjectCode')}_${(_baseInfoDS$current35 = baseInfoDS.current) === null || _baseInfoDS$current35 === void 0 ? void 0 : _baseInfoDS$current35.get('tenantId')}`;
    setSession(objVersionkey, '');
    whetherToCloseModal();
    setTimeout(() => {
      var _baseInfoDS$current36, _baseInfoDS$current37, _baseInfoDS$current38, _baseInfoDS$current39, _baseInfoDS$current40;
      closeTab(`/hmde/business-object/detail/${(_baseInfoDS$current36 = baseInfoDS.current) === null || _baseInfoDS$current36 === void 0 ? void 0 : _baseInfoDS$current36.get('businessObjectId')}`);
      openTab({
        key: `/hmde/business-object/detail/${(_baseInfoDS$current37 = baseInfoDS.current) === null || _baseInfoDS$current37 === void 0 ? void 0 : _baseInfoDS$current37.get('businessObjectId')}`,
        path: `/hmde/business-object/detail/${(_baseInfoDS$current38 = baseInfoDS.current) === null || _baseInfoDS$current38 === void 0 ? void 0 : _baseInfoDS$current38.get('businessObjectId')}`,
        closable: true,
        // tab 是否可以关闭
        // type: 'menu', // tab 类型
        title: (_baseInfoDS$current39 = baseInfoDS.current) === null || _baseInfoDS$current39 === void 0 ? void 0 : _baseInfoDS$current39.get('businessObjectName'),
        state: {
          originKey: 'fieldList',
          domainId: (_baseInfoDS$current40 = baseInfoDS.current) === null || _baseInfoDS$current40 === void 0 ? void 0 : _baseInfoDS$current40.get('domainId')
        }
      });
    });
  };

  /**
   * @description: 渲染右上角的恢复为最新版本按钮
   */
  function renderVersionRollback() {
    if (businessObjectCode && readOnlyFlag) {
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BOPermissionButton, {
        disabled: rollbacking,
        onClick: handleGoToNew,
        color: "primary"
      }, intl.get('hmde.se.scriptEvent.back').d('返回')), /*#__PURE__*/React.createElement(BOPermissionButton, {
        disabled: rollbacking,
        onClick: handleRestoreNew
      }, intl.get('hmde.bo.businessObject.reverNewDetail').d('恢复为最新版本')), /*#__PURE__*/React.createElement(_Button, {
        onClick: openVersionInfoModal,
        disabled: loading || rollbacking
      }, intl.get('hmde.bo.businessObject.versionMes').d('版本信息')));
    }
  }
  const renderDependence = () => {
    var _baseInfoDS$current41;
    const dependentCheckQuery = {
      businessObjectCode,
      tenantId: (_baseInfoDS$current41 = baseInfoDS.current) === null || _baseInfoDS$current41 === void 0 ? void 0 : _baseInfoDS$current41.get('tenantId')
    };
    if (businessObjectCode && versionFlag && sourceType !== SourceType.PREDEFINE && (versionList || []).length > 0) {
      var _baseInfoDS$current42, _baseInfoDS$current43;
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ButtonGroup, {
        mainButtonProps: {
          title: intl.get('hmde.common.dependenceFind').d('依赖查询'),
          icon: /*#__PURE__*/React.createElement(_Icon, {
            type: "search-o",
            style: {
              marginRight: 4,
              marginBottom: 2
            }
          }),
          afterIcon: /*#__PURE__*/React.createElement(_Tooltip, {
            title: intl.get('hmde.common.dependence.tips').d('查询依赖当前数据的其他功能')
          }, /*#__PURE__*/React.createElement(_Icon, {
            type: "help",
            style: {
              marginLeft: 4,
              marginBottom: 2
            }
          })),
          handleClick: showDependent,
          buttonProps: {}
        },
        othersButtonMenu: !showVersion && /*#__PURE__*/React.createElement(DependentCheckButtons, {
          sendCheckDetail: () => sendBusinessObjectDependentCheck(dependentCheckQuery),
          queryCheckDetail: () => queryBusinessObjectDependentCheck(dependentCheckQuery),
          checkType: CheckType.BusinessObject,
          version: publishStatus === PublishStatus.MODIFIED ? ((_baseInfoDS$current42 = baseInfoDS.current) === null || _baseInfoDS$current42 === void 0 ? void 0 : _baseInfoDS$current42.get('version')) - 1 : (_baseInfoDS$current43 = baseInfoDS.current) === null || _baseInfoDS$current43 === void 0 ? void 0 : _baseInfoDS$current43.get('version'),
          menuFlag: true
        })
      }));
    }
  };

  // 发布详情弹窗
  const openPublishDetailModal = () => {
    Modal.open({
      title: intl.get('hmde.common.publishDetail').d('发布详情'),
      destroyOnClose: true,
      style: {
        width: '595px'
      },
      children: /*#__PURE__*/React.createElement(PublishDetailModal, {
        progressRef: progressRef,
        publishDataDs: publishDataDs
      })
    });
  };
  if (isFirstLoading) {
    return /*#__PURE__*/React.createElement(_Skeleton, null);
  }
  return /*#__PURE__*/React.createElement(LowcodeModalProvider, null, /*#__PURE__*/React.createElement(Header, {
    title: getTitle()
  }, renderTopButs(), renderVersionRollback(), !readOnlyFlag && renderDependence()), /*#__PURE__*/React.createElement(Content, {
    className: styles['business-object-container']
  }, /*#__PURE__*/React.createElement(_Spin, {
    spinning: loading || rollbacking,
    indicator: !rollbacking ? /*#__PURE__*/React.createElement("div", {
      className: styles['spin-inner-content']
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        marginRight: 10
      }
    }, /*#__PURE__*/React.createElement(_Progress, {
      value: publishPercent,
      status: 'active',
      strokeColor: themColor === null || themColor === void 0 ? void 0 : themColor.primary
    })), /*#__PURE__*/React.createElement("a", {
      onClick: e => {
        var _progressRef$current3;
        e.preventDefault();
        if (progressRef !== null && progressRef !== void 0 && (_progressRef$current3 = progressRef.current) !== null && _progressRef$current3 !== void 0 && _progressRef$current3.openAsyncDetail) {
          // 打开发布过程的详情
          progressRef.current.openAsyncDetail();
        }
      }
    }, /*#__PURE__*/React.createElement(_Icon, {
      type: "visibility-o"
    }), "\xA0", /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.button.viewDetail').d('查看详情')))) : undefined
  }, businessObjectCode ? /*#__PURE__*/React.createElement("div", {
    className: styles['sb-tab-layout']
  }, /*#__PURE__*/React.createElement(Store.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement(TabTitleList, {
    activeKey: activeKey,
    baseInfoDS: baseInfoDS,
    domainId: domainId,
    history: history,
    match: props.match,
    tabPaneList: tabPaneList.filter(o => tabContentVisibleFlag(o.tabKey)),
    tabItemClick: handleItemClick,
    readOnlyFlag: readOnlyFlag
  }), /*#__PURE__*/React.createElement(_Tabs, {
    tabPosition: "left",
    activeKey: activeKey,
    tabBarGutter: 0,
    className: styles['c7n-tabs-by-user'],
    tabBarStyle: {
      display: 'none'
    }
  }, tabPaneList.filter(o => tabContentVisibleFlag(o.tabKey)).map(tabItem => TabPaneRender(tabItem))))) : null)));
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(BODetail));