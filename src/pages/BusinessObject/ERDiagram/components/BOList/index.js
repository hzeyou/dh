import _useDataSet from "choerodon-ui/pro/lib/use-data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Tabs from "@hzero-front-ui/c7n-ui/lib/Tabs";
import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import { useUpdateEffect } from 'ahooks';
import intl from 'utils/intl';
import navOpenImg from "hzero-front-hmde/lib/assets/icon/navOpen.svg";
import navFlodImg from "hzero-front-hmde/lib/assets/icon/navFlod.svg";
import { getResponse } from 'utils/utils';
import { fetchDomainDetail } from "hzero-front-hmde/lib/services/businessObjectService";
import { handleMenuTabRefresh } from "hzero-front-hmde/lib/utils/common";
import boDS, { BoFN } from "../../datasets/boDS";
import domainDS, { DomainFN } from "../../datasets/domainDS";
import { useERStore } from "../../stores";
import AllBoList from "./components/AllBoList";
import SelectedBoList from "./components/SelectedBoList";
import styles from "./index.less?modules";
const TabPane = _Tabs.TabPane;
const BOList = () => {
  const _useState = useState(true),
    _useState2 = _slicedToArray(_useState, 2),
    isShow = _useState2[0],
    setIsShow = _useState2[1];
  const boDs = _useDataSet(() => boDS(), []);
  const domainDs = _useDataSet(() => domainDS(), []);
  const _useParams = useParams(),
    domainId = _useParams.domainId;
  const erStore = useERStore();
  useUpdateEffect(() => {
    // 重新刷新当前页
    handleMenuTabRefresh();
  }, [domainId]);
  const queryDomainDetail = _domainId => {
    return fetchDomainDetail(_domainId).then(res => {
      if (getResponse(res)) {
        erStore.setState('businessObjectCreatedFlag', res === null || res === void 0 ? void 0 : res.businessObjectCreatedFlag);
        return res;
      }
    });
  };
  useEffect(() => {
    boDs.setQueryParameter('domainId', domainId);
    boDs.query();
    queryDomainDetail(domainId).then(res => {
      var _domainDs$current;
      (_domainDs$current = domainDs.current) === null || _domainDs$current === void 0 ? void 0 : _domainDs$current.set(DomainFN.DOMAIN_LOV, res);
    });
  }, []);
  useEffect(() => {
    // 判断 boDs 的记录里是否包含当前选中的节点
    const selectedBOIds = erStore.getState('selectedBOIds');
    boDs === null || boDs === void 0 ? void 0 : boDs.forEach(record => {
      if (selectedBOIds.includes(record.get(BoFN.ID))) {
        Object.assign(record, {
          isSelected: true
        });
      } else {
        Object.assign(record, {
          isSelected: false
        });
      }
    });
  }, [erStore.getState('selectedBOIds')]);
  useDataSetEvents(boDs, 'load', ({
    dataSet
  }) => {
    // 筛选或切换领域后,需要重新勾选已选择的业务对象
    const selectedBOIds = erStore.getState('selectedBOIds', true);
    dataSet.forEach(record => {
      if (selectedBOIds.includes(record.get(BoFN.ID))) {
        Object.assign(record, {
          isSelected: true
        });
      } else {
        Object.assign(record, {
          isSelected: false
        });
      }
    });
  });
  useDataSetEvents(boDs, ['batchSelect', 'batchUnSelect'], ({
    dataSet
  }) => {
    // 当前列表中已选择的业务对象
    const ids = dataSet.selected.map(record => record.get(BoFN.ID)) || [];
    // 已选择的业务对象
    const selectedBOIds = erStore.getState('selectedBOIds', true);
    // 当前列表中的所有业务对象
    const curListAllBOIds = dataSet.records.map(record => record.get(BoFN.ID)) || [];
    // 如果已选择的业务对象不在当前列表中, 则数据不变
    selectedBOIds.forEach(id => {
      if (!curListAllBOIds.includes(id)) {
        ids.push(id);
      }
    });
    erStore.setState('selectedBOIds', ids);
  });

  // 领域变更重置数据
  useDataSetEvents(domainDs, 'update', ({
    name,
    value
  }) => {
    if (name === DomainFN.DOMAIN_LOV && value) {
      var _erStore$getState;
      queryDomainDetail(value === null || value === void 0 ? void 0 : value.domainId);
      boDs.setQueryParameter('domainId', value[DomainFN.DOMAIN_ID]);
      boDs.query();
      // 清空画布
      (_erStore$getState = erStore.getState('graph')) === null || _erStore$getState === void 0 ? void 0 : _erStore$getState.resetCells([]);
      erStore.setState({
        graphERData: [],
        domain: value,
        selectedBOIds: []
      });
    }
  });
  const handleShowChange = useCallback(() => {
    setIsShow(s => !s);
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: styles.wrapper,
    hidden: !isShow
  }, /*#__PURE__*/React.createElement(_Tabs, {
    defaultActiveKey: "1"
  }, /*#__PURE__*/React.createElement(TabPane, {
    tab: intl.get('hmde.common.busniessObject').d('业务对象'),
    key: "1"
  }, /*#__PURE__*/React.createElement(AllBoList, {
    boDs: boDs,
    domainDs: domainDs
  })), /*#__PURE__*/React.createElement(TabPane, {
    tab: intl.get('hmde.bo.businessObject.boCanvas').d('画布对象'),
    key: "2"
  }, /*#__PURE__*/React.createElement(SelectedBoList, null))), /*#__PURE__*/React.createElement("img", {
    src: navFlodImg,
    onClick: handleShowChange,
    className: styles['nav-flod'],
    alt: "navOpen"
  })), /*#__PURE__*/React.createElement("div", {
    className: styles['nav-open'],
    onClick: handleShowChange,
    hidden: isShow
  }, /*#__PURE__*/React.createElement("img", {
    alt: "navOpen",
    src: navOpenImg
  }), /*#__PURE__*/React.createElement("div", {
    className: styles.title
  }, intl.get('hmde.bo.dataTransport.boList').d('对象列表'))));
};
export default observer(BOList);