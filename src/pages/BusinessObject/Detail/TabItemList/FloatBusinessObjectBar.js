import _Dropdown from "@hzero-front-ui/c7n-ui/lib/Dropdown";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Tag from "@hzero-front-ui/c7n-ui/lib/Tag";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import intl from 'utils/intl';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { openTab, closeTab } from 'utils/menuTab';
import { setSession } from 'utils/utils';
import FeiDaList from "hzero-front-hmde/lib/businessComponents/FeiDaList";
import BusinessObjectDataSet from "hzero-front-hmde/lib/stores/BusinessObject/BusinessObjectDS";
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
// import { handleMenuTabUpdate } from '@hmde/utils/common';

import styles from "./index.less?modules";
export default function FloatBusinessObjectBar({
  domainId,
  statusList,
  match
}) {
  const businessObjectId = match.params.id;
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    visibleFlag = _useState2[0],
    setVisibleFlag = _useState2[1];
  const boTableDs = useMemo(() => {
    return new _DataSet({
      ...BusinessObjectDataSet({
        domainId
      }),
      pageSize: 20
    });
  }, [domainId]);
  const boStore = useBoStore();

  // 点击空白区域收起 Dropdown
  const hiddenDropdown = useCallback(() => {
    setVisibleFlag(false);
  }, []);
  useEffect(() => {
    boTableDs.setQueryParameter('domainId', domainId);
    boTableDs.query();
    window.addEventListener('click', hiddenDropdown);
    return () => {
      window.removeEventListener('click', hiddenDropdown);
    };
  }, []);
  const listAreaStyle = {
    maxHeight: 558
  };
  const overlayContent = /*#__PURE__*/React.createElement("div", {
    className: styles['float-content-wrap'],
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement(FeiDaList, {
    listAreaStyle: listAreaStyle,
    autoLoadMore: true,
    dataSet: boTableDs,
    autoLocateFirst: false,
    initSelectedId: businessObjectId,
    idField: "businessObjectId",
    stateField: "publishStatus",
    title: "businessObjectName",
    placeholder: intl.get('hmde.bo.businessObject.objectModelPlaceholder').d('请搜索对象名称/编码'),
    stateRender: status => {
      if (status === '' || status === undefined || status === null) return '';
      const currentStatus = statusList.find(item => item.status === status) || statusList.find(item => item.status === 'default') || {};
      return /*#__PURE__*/React.createElement(_Tag, {
        color: currentStatus.color || ''
      }, currentStatus.text);
    },
    onClickItem: data => {
      var _boStore$getState;
      setSession(boStore === null || boStore === void 0 ? void 0 : (_boStore$getState = boStore.getState) === null || _boStore$getState === void 0 ? void 0 : _boStore$getState.call(boStore, 'objVersionKey'), '');
      // history.replace(`/hmde/business-object/detail/${data.businessObjectId}`);
      closeTab(`/hmde/business-object/detail/${businessObjectId}`);
      openTab({
        key: `/hmde/business-object/detail/${data.businessObjectId}`,
        path: `/hmde/business-object/detail/${data.businessObjectId}`,
        icon: null,
        // 图标的值,antd 的 Icon
        closable: true,
        // tab 是否可以关闭
        type: 'menu',
        // tab 类型
        title: data === null || data === void 0 ? void 0 : data.businessObjectName,
        state: {
          originKey: 'fieldList',
          domainId
        }
      });
    }
  }));
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement(_Dropdown, {
    overlay: overlayContent,
    trigger: "click",
    visible: visibleFlag
  }, /*#__PURE__*/React.createElement(_Button, {
    funcType: "flat",
    icon: "repeat",
    onClick: () => {
      boTableDs.query();
      setVisibleFlag(true);
    },
    style: {
      border: 'none',
      borderRadius: '50%',
      boxSizing: 'border-box',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px'
    }
  })));
}