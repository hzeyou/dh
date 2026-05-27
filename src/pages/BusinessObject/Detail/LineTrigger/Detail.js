import _Tabs from "@hzero-front-ui/c7n-ui/lib/Tabs";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Breadcrumb from "@hzero-front-ui/c7n-ui/lib/Breadcrumb";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _isEmpty from "lodash/isEmpty";
import React, { useRef, useMemo, useState, useEffect } from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { Header, Content } from 'components/Page';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { useHistory, useParams } from 'react-router-dom';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import intl from 'utils/intl';
import { getResponse, getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import useSearchParams from 'hzero-front-apaas/lib/hooks/useSearchParams';
import LowerCodeModalProvider from 'hzero-front-apaas/lib/components/LowcodeModalProvider';
import { detailDs } from "hzero-front-hmde/lib/stores/BusinessObject/LineTriggerDS";
import ProcessDefinition from "hzero-front-hmde/lib/routes/ProcessDefinition/Designer";
import BOPermissionButton from "hzero-front-hmde/lib/routes/BusinessObject/Detail/components/BOPermissionButton";
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
import { StoreProvider } from "hzero-front-hmde/lib/routes/ProcessDefinition/Designer/store";
import styles from "./index.less?modules";
import { getPubTypeTag, getTypeTag } from "./utils";
import { pubService, drillService } from "./service";
import FilterCondition from "./FilterCondition";
const tenantId = getCurrentOrganizationId();
var TabsKey = /*#__PURE__*/function (TabsKey) {
  TabsKey["CONDITION"] = "condition";
  TabsKey["FLOW"] = "flow";
  return TabsKey;
}(TabsKey || {});
const App = () => {
  var _boStore$getState, _boStore$getState2, _filterCacheRef$curre7, _filterCacheRef$curre8, _filterCacheRef$curre9, _filterCacheRef$curre10, _ds$current3, _ds$current13, _ds$current14, _ds$current15, _ds$current16, _ds$current17;
  const history = useHistory();
  const _useSearchParams = useSearchParams(),
    triggerType = _useSearchParams.triggerType,
    businessObjectId = _useSearchParams.businessObjectId;
  const _useParams = useParams(),
    id = _useParams.id;
  const boStore = useBoStore();
  const hasPermission = (_boStore$getState = boStore === null || boStore === void 0 ? void 0 : (_boStore$getState2 = boStore.getState) === null || _boStore$getState2 === void 0 ? void 0 : _boStore$getState2.call(boStore, 'hasPermission')) !== null && _boStore$getState !== void 0 ? _boStore$getState : true;

  // 筛选条件ref
  const filterCacheRef = useRef(null);
  // 事务流的ref
  const lineTriggerEnterRef = useRef();

  // 筛选条件data
  const _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    filterData = _useState2[0],
    setFilterData = _useState2[1];
  const _useState3 = useState([]),
    _useState4 = _slicedToArray(_useState3, 2),
    fieldData = _useState4[0],
    setFieldData = _useState4[1];
  const _useState5 = useState(),
    _useState6 = _slicedToArray(_useState5, 2),
    newFlowVariableParams = _useState6[0],
    setNewFlowVariableParams = _useState6[1];
  const ds = useMemo(() => {
    return new _DataSet(detailDs(id, filterCacheRef));
  }, []);

  // 触发器类型
  const batchTriggerType = useMemo(() => {
    return triggerType ? ['BATCH_CREATE_BEFORE', 'BATCH_CREATE_AFTER', 'BATCH_UPDATE_BEFORE', 'BATCH_UPDATE_AFTER', 'BATCH_DELETE_BEFORE', 'BATCH_DELETE_AFTER'].includes(triggerType) : false;
  }, [triggerType]);
  const needFlowInit = useRef(false);
  const _useState7 = useState(batchTriggerType ? TabsKey.FLOW : TabsKey.CONDITION),
    _useState8 = _slicedToArray(_useState7, 2),
    activeKey = _useState8[0],
    setActiveKey = _useState8[1];
  const _useState9 = useState(),
    _useState10 = _slicedToArray(_useState9, 2),
    buttonNode = _useState10[0],
    setButtonNode = _useState10[1];
  const _useState11 = useState(false),
    _useState12 = _slicedToArray(_useState11, 2),
    triggerDisabledFlag = _useState12[0],
    setTriggerDisabledFlag = _useState12[1];
  const filterFlag = useMemo(() => {
    var _filterCacheRef$curre, _filterCacheRef$curre2, _filterCacheRef$curre3, _filterCacheRef$curre4, _filterCacheRef$curre5, _filterCacheRef$curre6;
    return ((filterCacheRef === null || filterCacheRef === void 0 ? void 0 : (_filterCacheRef$curre = filterCacheRef.current) === null || _filterCacheRef$curre === void 0 ? void 0 : (_filterCacheRef$curre2 = _filterCacheRef$curre.filterDs) === null || _filterCacheRef$curre2 === void 0 ? void 0 : _filterCacheRef$curre2.dirty) || (filterCacheRef === null || filterCacheRef === void 0 ? void 0 : (_filterCacheRef$curre3 = filterCacheRef.current) === null || _filterCacheRef$curre3 === void 0 ? void 0 : (_filterCacheRef$curre4 = _filterCacheRef$curre3.relDs) === null || _filterCacheRef$curre4 === void 0 ? void 0 : _filterCacheRef$curre4.dirty)) && ((filterData === null || filterData === void 0 ? void 0 : filterData.length) !== 0 || (filterCacheRef === null || filterCacheRef === void 0 ? void 0 : (_filterCacheRef$curre5 = filterCacheRef.current) === null || _filterCacheRef$curre5 === void 0 ? void 0 : (_filterCacheRef$curre6 = _filterCacheRef$curre5.filterDs) === null || _filterCacheRef$curre6 === void 0 ? void 0 : _filterCacheRef$curre6.length));
  }, [filterCacheRef === null || filterCacheRef === void 0 ? void 0 : (_filterCacheRef$curre7 = filterCacheRef.current) === null || _filterCacheRef$curre7 === void 0 ? void 0 : (_filterCacheRef$curre8 = _filterCacheRef$curre7.filterDs) === null || _filterCacheRef$curre8 === void 0 ? void 0 : _filterCacheRef$curre8.dirty, filterCacheRef === null || filterCacheRef === void 0 ? void 0 : (_filterCacheRef$curre9 = filterCacheRef.current) === null || _filterCacheRef$curre9 === void 0 ? void 0 : (_filterCacheRef$curre10 = _filterCacheRef$curre9.relDs) === null || _filterCacheRef$curre10 === void 0 ? void 0 : _filterCacheRef$curre10.dirty, filterData]);
  const flowFlag = useMemo(() => {
    return triggerDisabledFlag;
  }, [triggerDisabledFlag]);
  useEffect(() => {
    var _ds$current, _ds$current2;
    (ds === null || ds === void 0 ? void 0 : (_ds$current = ds.current) === null || _ds$current === void 0 ? void 0 : _ds$current.get('flowId')) && drillService(ds === null || ds === void 0 ? void 0 : (_ds$current2 = ds.current) === null || _ds$current2 === void 0 ? void 0 : _ds$current2.get('flowId')).then(res => {
      if (getResponse(res)) {
        let inputList = [];
        let inputParameter = {};
        try {
          var _inputParameter;
          inputParameter = JSON.parse(res.inputParameter);
          inputList = ((_inputParameter = inputParameter) === null || _inputParameter === void 0 ? void 0 : _inputParameter.paramList) || [];
        } catch (error) {
          console.log(error);
          return;
        }
        const triggerFlag1 = Object.values(res.nodeList || {}).some(v => {
          return !['START', 'END'].includes(v.type);
        });
        setTriggerDisabledFlag(!triggerFlag1);
        if (!_isEmpty(inputList)) {
          // 处理一下
          inputList.forEach(v => {
            if (v.parentId !== 1) {
              v.showId = v.showId.replace(`${v.parentId}_`, `${v.parentId}.`);
            }
            if (v.parentId === 1) {
              if (v.id === '$new' || v.id === '$old') {
                v.businessObjectName += `[${v.id}]`;
              }
            }
          });
          setFieldData(inputList);
          setNewFlowVariableParams({
            ...inputParameter,
            paramList: inputList
          });
        }
      }
    });
  }, [ds === null || ds === void 0 ? void 0 : (_ds$current3 = ds.current) === null || _ds$current3 === void 0 ? void 0 : _ds$current3.get('flowId')]);
  useDataSetEvents(ds, 'load', ({
    dataSet
  }) => {
    var _dataSet$current;
    setFilterData(dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$current = dataSet.current) === null || _dataSet$current === void 0 ? void 0 : _dataSet$current.get('businessObjectTriggerCondList'));
  });
  const handleSaveForm = async () => {
    var _filterCacheRef$curre11, _filterCacheRef$curre12;
    if ((await (filterCacheRef === null || filterCacheRef === void 0 ? void 0 : (_filterCacheRef$curre11 = filterCacheRef.current) === null || _filterCacheRef$curre11 === void 0 ? void 0 : _filterCacheRef$curre11.filterDs.validate())) && (await (filterCacheRef === null || filterCacheRef === void 0 ? void 0 : (_filterCacheRef$curre12 = filterCacheRef.current) === null || _filterCacheRef$curre12 === void 0 ? void 0 : _filterCacheRef$curre12.relDs.validate()))) {
      var _ds$current4, _filterCacheRef$curre13, _filterCacheRef$curre14, _ds$current5, _filterCacheRef$curre15, _filterCacheRef$curre16, _filterCacheRef$curre17;
      ds === null || ds === void 0 ? void 0 : (_ds$current4 = ds.current) === null || _ds$current4 === void 0 ? void 0 : _ds$current4.set('businessObjectTriggerCondList', filterCacheRef === null || filterCacheRef === void 0 ? void 0 : (_filterCacheRef$curre13 = filterCacheRef.current) === null || _filterCacheRef$curre13 === void 0 ? void 0 : (_filterCacheRef$curre14 = _filterCacheRef$curre13.filterDs) === null || _filterCacheRef$curre14 === void 0 ? void 0 : _filterCacheRef$curre14.toData());
      ds === null || ds === void 0 ? void 0 : (_ds$current5 = ds.current) === null || _ds$current5 === void 0 ? void 0 : _ds$current5.set('logicFormula', filterCacheRef === null || filterCacheRef === void 0 ? void 0 : (_filterCacheRef$curre15 = filterCacheRef.current) === null || _filterCacheRef$curre15 === void 0 ? void 0 : (_filterCacheRef$curre16 = _filterCacheRef$curre15.relDs) === null || _filterCacheRef$curre16 === void 0 ? void 0 : (_filterCacheRef$curre17 = _filterCacheRef$curre16.current) === null || _filterCacheRef$curre17 === void 0 ? void 0 : _filterCacheRef$curre17.get('logicFormula'));
      await ds.submit();
      ds === null || ds === void 0 ? void 0 : ds.query();
    }
  };
  const lineTrigger = () => {
    ds.query();
  };
  const renderTitle = () => {
    var _ds$current6, _ds$current7, _ds$current8;
    return /*#__PURE__*/React.createElement(_Breadcrumb, {
      style: {
        marginLeft: '10px'
      }
    }, /*#__PURE__*/React.createElement(_Breadcrumb.Item, {
      style: {
        cursor: 'pointer'
      },
      onClick: () => {
        history.push({
          pathname: `/hmde/business-object/detail/${businessObjectId}`,
          state: {
            originKey: 'lineTrigger',
            fieldActiveKey: 'STANDARD'
          }
        });
      }
    }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.objDetail').d('对象详情'), "-", intl.get('hmde.bo.businessObject.tab.lineTigger').d('记录触发器'))), /*#__PURE__*/React.createElement(_Breadcrumb.Item, null, /*#__PURE__*/React.createElement("span", {
      style: {
        marginRight: '10px'
      }
    }, ds === null || ds === void 0 ? void 0 : (_ds$current6 = ds.current) === null || _ds$current6 === void 0 ? void 0 : _ds$current6.get('triggerName')), getPubTypeTag(ds === null || ds === void 0 ? void 0 : (_ds$current7 = ds.current) === null || _ds$current7 === void 0 ? void 0 : _ds$current7.get('publishStatus')), getTypeTag(ds === null || ds === void 0 ? void 0 : (_ds$current8 = ds.current) === null || _ds$current8 === void 0 ? void 0 : _ds$current8.get('enabledFlag'))));
  };
  const handlePub = () => {
    var _ds$current9;
    pubService({
      ...(ds === null || ds === void 0 ? void 0 : (_ds$current9 = ds.current) === null || _ds$current9 === void 0 ? void 0 : _ds$current9.toData())
    }).then(res => {
      if (res && res.failed === true) {
        notification.error({
          message: intl.get('hmde.common.publishingFailed').d('发布失败'),
          description: res.message
        });
      } else {
        notification.success({
          message: intl.get('hmde.common.successfullyPublished').d('发布成功')
        });
        ds === null || ds === void 0 ? void 0 : ds.query();
        if (activeKey === TabsKey.CONDITION) {
          needFlowInit.current = true;
        } else {
          var _lineTriggerEnterRef$, _lineTriggerEnterRef$2;
          lineTriggerEnterRef === null || lineTriggerEnterRef === void 0 ? void 0 : (_lineTriggerEnterRef$ = lineTriggerEnterRef.current) === null || _lineTriggerEnterRef$ === void 0 ? void 0 : (_lineTriggerEnterRef$2 = _lineTriggerEnterRef$.pageInit) === null || _lineTriggerEnterRef$2 === void 0 ? void 0 : _lineTriggerEnterRef$2.call(_lineTriggerEnterRef$);
        }
      }
    });
  };
  const pubButton = style => {
    var _ds$current10, _ds$current11;
    return (ds === null || ds === void 0 ? void 0 : (_ds$current10 = ds.current) === null || _ds$current10 === void 0 ? void 0 : _ds$current10.get('tenantId')) === tenantId ? /*#__PURE__*/React.createElement(_Tooltip, {
      title: filterFlag || flowFlag ? intl.get('hmde.bo.businessObject.saveError').d('当前触发器内条件或事务处理流未配置或配置无效') : '',
      theme: "dark"
    }, /*#__PURE__*/React.createElement(BOPermissionButton, {
      icon: "publish2",
      color: "primary",
      onClick: handlePub,
      disabled: filterFlag || flowFlag || (ds === null || ds === void 0 ? void 0 : (_ds$current11 = ds.current) === null || _ds$current11 === void 0 ? void 0 : _ds$current11.get('publishStatus')) === 'PUBLISHED',
      style: style
    }, intl.get('hmde.common.publish').d('发布'))) : null;
  };
  const buttons = () => {
    var _ds$current12;
    if ((ds === null || ds === void 0 ? void 0 : (_ds$current12 = ds.current) === null || _ds$current12 === void 0 ? void 0 : _ds$current12.get('tenantId')) !== tenantId) {
      return null;
    }
    if (activeKey === TabsKey.CONDITION) {
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BOPermissionButton, {
        onClick: handleSaveForm,
        icon: "save"
      }, intl.get('hmde.common.button.save').d('保存')), pubButton({}));
    } else {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'row-reverse'
        }
      }, pubButton({
        marginLeft: '8px'
      }), buttonNode);
    }
  };
  const tabChange = v => {
    if (!!filterFlag && v === TabsKey.FLOW || !!filterFlag && v === TabsKey.CONDITION) {
      notification.error({
        message: intl.get(`hmde.common.tips`).d('提示'),
        description: intl.get(`hmde.bo.businessObject.tabChangeTips`).d('请先保存当前页数据')
      });
      return;
    }
    if (v === TabsKey.FLOW && needFlowInit.current) {
      var _lineTriggerEnterRef$3, _lineTriggerEnterRef$4;
      lineTriggerEnterRef === null || lineTriggerEnterRef === void 0 ? void 0 : (_lineTriggerEnterRef$3 = lineTriggerEnterRef.current) === null || _lineTriggerEnterRef$3 === void 0 ? void 0 : (_lineTriggerEnterRef$4 = _lineTriggerEnterRef$3.pageInit) === null || _lineTriggerEnterRef$4 === void 0 ? void 0 : _lineTriggerEnterRef$4.call(_lineTriggerEnterRef$3);
      needFlowInit.current = false;
    }
    setActiveKey(v);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Header, {
    title: renderTitle()
  }), /*#__PURE__*/React.createElement(Content, null, /*#__PURE__*/React.createElement("div", {
    className: `${styles['trigger-detail']} ${batchTriggerType ? styles['trigger-detail-batch'] : ''}`
  }, /*#__PURE__*/React.createElement(_Tabs, {
    activeKey: activeKey,
    onChange: v => tabChange(v),
    style: {
      height: '100%'
    },
    tabBarExtraContent: buttons()
  }, /*#__PURE__*/React.createElement(_Tabs.TabPane, {
    hidden: batchTriggerType,
    tab: () => /*#__PURE__*/React.createElement("span", {
      className: styles.tabSpan
    }, intl.get('hmde.bo.businessObject.condition').d('条件'), !!filterFlag && activeKey === TabsKey.FLOW && /*#__PURE__*/React.createElement("i", null)),
    key: TabsKey.CONDITION,
    style: {
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['trigger-opportunity']
  }, /*#__PURE__*/React.createElement("span", {
    className: styles['trigger-opportunity-label']
  }, intl.get('hmde.bo.businessObject.trigger').d('触发时机')), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(_Output, {
    dataSet: ds,
    name: "triggerType"
  }))), /*#__PURE__*/React.createElement(StoreProvider, null, /*#__PURE__*/React.createElement(LowerCodeModalProvider, null, /*#__PURE__*/React.createElement(FilterCondition, {
    data: filterData,
    fieldData: fieldData,
    newFlowVariableParams: newFlowVariableParams,
    logicFormula: ds === null || ds === void 0 ? void 0 : (_ds$current13 = ds.current) === null || _ds$current13 === void 0 ? void 0 : _ds$current13.get('logicFormula'),
    filterCacheRef: filterCacheRef,
    disabled: (ds === null || ds === void 0 ? void 0 : (_ds$current14 = ds.current) === null || _ds$current14 === void 0 ? void 0 : _ds$current14.get('tenantId')) !== tenantId,
    boCode: ds === null || ds === void 0 ? void 0 : (_ds$current15 = ds.current) === null || _ds$current15 === void 0 ? void 0 : _ds$current15.get('businessObjectCode')
  })))), /*#__PURE__*/React.createElement(_Tabs.TabPane, {
    hidden: !(ds !== null && ds !== void 0 && (_ds$current16 = ds.current) !== null && _ds$current16 !== void 0 && _ds$current16.get('flowId')),
    disabled: batchTriggerType,
    key: TabsKey.FLOW,
    tab: () => /*#__PURE__*/React.createElement("span", {
      className: styles.tabSpan
    }, intl.get('hmde.bo.businessObject.Triggertransactionflow').d('触发事务流'), flowFlag && activeKey === TabsKey.CONDITION && /*#__PURE__*/React.createElement("i", null))
  }, /*#__PURE__*/React.createElement(ProcessDefinition, {
    flowId: ds === null || ds === void 0 ? void 0 : (_ds$current17 = ds.current) === null || _ds$current17 === void 0 ? void 0 : _ds$current17.get('flowId'),
    triggerEnter: true,
    setButtonNode: setButtonNode,
    lineTriggerEnterRef: lineTriggerEnterRef,
    lineTrigger: lineTrigger,
    readonly: !hasPermission,
    setTriggerDisabledFlag: setTriggerDisabledFlag
  }))))));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(App));