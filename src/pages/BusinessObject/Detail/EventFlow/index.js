import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _extends from "@babel/runtime/helpers/esm/extends";
import _Radio from "@hzero-front-ui/c7n-ui/lib/Radio";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _Tabs from "@hzero-front-ui/c7n-ui/lib/Tabs";
import React, { useEffect, useMemo, useState } from 'react';
import intl from 'utils/intl';
import { getCurrentOrganizationId, isTenantRoleLevel } from 'utils/utils';
// import notification from 'utils/notification';
// import { TagRender } from 'utils/renderer';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import qs from 'querystring';
import { TableQueryBarType } from 'choerodon-ui/pro/lib/table/enum';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import SpringTooltip from "hzero-front-hmde/lib/businessComponents/SpringTooltip";
import Popconfirm from 'hzero-ui/lib/popconfirm';
import { TAB_KEYS } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/TabItemList";
import { eventFlowDs } from "hzero-front-hmde/lib/stores/BusinessObject/EventFlowDS";
import ModalForm from "./ModalForm";
import styles from "./index.less?modules";
const TabPane = _Tabs.TabPane;
const tenantId = getCurrentOrganizationId();
const eventFlowCreateModalKey = _Modal.key();
const eventFlowEditModalKey = _Modal.key();
var EventFlowViewKey = /*#__PURE__*/function (EventFlowViewKey) {
  EventFlowViewKey["PLATFORM"] = "PLATFORM";
  EventFlowViewKey["TENANT"] = "TENANT";
  return EventFlowViewKey;
}(EventFlowViewKey || {}); // 租户事件流
export let EventFlowCategory = /*#__PURE__*/function (EventFlowCategory) {
  EventFlowCategory["STANDARD"] = "STANDARD";
  EventFlowCategory["PREDEFINE"] = "PREDEFINE";
  EventFlowCategory["CUSTOM"] = "CUSTOM";
  return EventFlowCategory;
}({}); // 租户自定义事
const Index = ({
  businessObjectCode,
  history,
  match,
  activeKey
}) => {
  const _ref = (match === null || match === void 0 ? void 0 : match.params) || {},
    businessObjectId = _ref.id;
  const _useState = useState(EventFlowViewKey.PLATFORM),
    _useState2 = _slicedToArray(_useState, 2),
    eventFlowKey = _useState2[0],
    setEventFlowKey = _useState2[1];
  const _useState3 = useState(EventFlowCategory.STANDARD),
    _useState4 = _slicedToArray(_useState3, 2),
    standardValue = _useState4[0],
    setStandardValue = _useState4[1];
  const eventFlowDS = useMemo(() => new _DataSet(eventFlowDs({
    businessObjectCode,
    tenantId
  })), []);
  const customEventFlowDS = useMemo(() => new _DataSet(isTenantRoleLevel() ? {
    ...eventFlowDs({
      businessObjectCode,
      tenantId
    }),
    autoQuery: true
  } : {}), []);
  useEffect(() => {
    if (activeKey === TAB_KEYS.eventFlow) {
      eventFlowDS.setQueryParameter('flowCategory', standardValue);
      eventFlowDS.query();
    }
  }, [standardValue, activeKey]);
  const handleCreateEventFlow = () => {
    const flowCategory = eventFlowKey === EventFlowViewKey.PLATFORM ? EventFlowCategory.PREDEFINE : EventFlowCategory.CUSTOM;
    _Modal.open({
      key: eventFlowCreateModalKey,
      title: intl.get('hmde.bo.eventFlow.create').d('新建事件流'),
      autoCenter: true,
      border: false,
      bodyStyle: {
        paddingTop: 0
      },
      closable: true,
      children: /*#__PURE__*/React.createElement(ModalForm, {
        businessObjectCode: businessObjectCode,
        flowCategory: flowCategory,
        tenantId: tenantId,
        callback: gotoFlowDetail
      }),
      afterClose: () => {
        if (eventFlowKey === EventFlowViewKey.PLATFORM) {
          eventFlowDS.query();
        } else {
          customEventFlowDS.query();
        }
      }
    });
  };
  const handleEdit = id => {
    _Modal.open({
      key: eventFlowEditModalKey,
      title: intl.get('hmde.bo.eventFlow.edit').d('编辑事件流'),
      bodyStyle: {
        paddingTop: 0
      },
      drawerBorder: false,
      drawer: true,
      children: /*#__PURE__*/React.createElement(ModalForm, {
        businessObjectCode: businessObjectCode,
        flowId: id,
        tenantId: tenantId,
        callback: () => {}
      }),
      afterClose: () => {
        if (eventFlowKey === EventFlowViewKey.PLATFORM) {
          eventFlowDS.query();
        } else {
          customEventFlowDS.query();
        }
      }
    });
  };
  const gotoFlowDetail = (id, code) => {
    history.push({
      pathname: `/hmde/business-object/event-flow/${id}/${code}`,
      search: qs.stringify({
        businessObjectCode,
        businessObjectId
      })
    });
  };
  const cardProps = record => ({
    dataSet: eventFlowDS,
    record,
    handleEdit,
    gotoFlowDetail
  });
  return /*#__PURE__*/React.createElement(_Tabs, {
    activeKey: eventFlowKey,
    onChange: k => setEventFlowKey(k),
    className: styles['eventFlow-tabs'],
    tabBarStyle: {
      border: 'none'
    },
    tabBarExtraContent: !isTenantRoleLevel() && /*#__PURE__*/React.createElement(_Button, {
      icon: "add",
      color: "primary",
      disabled: !isTenantRoleLevel() && standardValue === EventFlowCategory.STANDARD
      // || (isTenantRoleLevel() && eventFlowKey !== EventFlowViewKey.TENANT)
      ,
      onClick: handleCreateEventFlow
    }, intl.get('hmde.common.button.create').d('新建'))
  }, /*#__PURE__*/React.createElement(TabPane, {
    tab: intl.get('hmde.bo.eventFlow.tab.standard').d('标准事件流'),
    key: EventFlowViewKey.PLATFORM,
    forceRender: true
  }, /*#__PURE__*/React.createElement(_Radio.Group, {
    value: standardValue,
    style: {
      marginBottom: 16
    },
    onChange: async v => {
      var _v$target;
      setStandardValue(v === null || v === void 0 ? void 0 : (_v$target = v.target) === null || _v$target === void 0 ? void 0 : _v$target.value);
    }
  }, /*#__PURE__*/React.createElement(_Radio.Button, {
    value: EventFlowCategory.STANDARD
  }, intl.get('hmde.bo.businessObject.standard.standard').d('系统标准')), /*#__PURE__*/React.createElement(_Radio.Button, {
    value: EventFlowCategory.PREDEFINE
  }, intl.get('hmde.bo.businessObject.standard.predefined').d('平台预置'))), /*#__PURE__*/React.createElement("div", {
    className: styles['eventFlow-container'],
    hidden: standardValue === EventFlowCategory.PREDEFINE
  }, eventFlowDS === null || eventFlowDS === void 0 ? void 0 : eventFlowDS.map(record => /*#__PURE__*/React.createElement(Card, _extends({}, cardProps(record), {
    extra: false
  })))), /*#__PURE__*/React.createElement(_Table, {
    className: styles.queryBar,
    dataSet: eventFlowDS,
    queryBar: "filterBar",
    hidden: standardValue === EventFlowCategory.STANDARD,
    autoFootHeight: true,
    footer: /*#__PURE__*/React.createElement("div", {
      className: styles['eventFlow-container']
    }, eventFlowDS === null || eventFlowDS === void 0 ? void 0 : eventFlowDS.map(record => /*#__PURE__*/React.createElement(Card, _extends({}, cardProps(record), {
      extra: !isTenantRoleLevel()
    })))),
    pagination: {
      pageSizeOptions: ['9', '18', '45', '90']
    }
  })));
};
const Card = ({
  dataSet,
  record,
  extra = false,
  handleEdit,
  gotoFlowDetail
}) => {
  const _ref2 = record.toData(),
    flowId = _ref2.flowId,
    title = _ref2.flowName,
    flowCode = _ref2.flowCode,
    remark = _ref2.remark;

  // const handleDisable = async (enable = false) => {
  //   const service = enable ? disableEventFlow : enableEventFlow;
  //   const res = await service(record?.toData());
  //   if (getResponse(res)) {
  //     notification.success({
  //       message: intl.get('hmde.common.handleSuccess').d('操作成功'),
  //     } as any);
  //     dataSet.query();
  //   }
  // };

  const handleDelete = async () => {
    await dataSet.delete(record, false);
  };

  // const enableList = [
  //   {
  //     status: 1,
  //     color: 'green',
  //     text: intl.get('hmde.common.button.enable').d('启用'),
  //   },
  //   {
  //     status: 0,
  //     color: 'red',
  //     text: intl.get('hmde.common.button.disable').d('禁用'),
  //   },
  // ];

  return /*#__PURE__*/React.createElement("div", {
    className: styles['card-container']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['card-extra'],
    hidden: !extra
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => handleEdit(flowId)
  }, intl.get('hmde.common.button.edit').d('编辑')), /*#__PURE__*/React.createElement(Popconfirm, {
    onConfirm: () => handleDelete(),
    placement: "top",
    title: /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: '160px',
        marginLeft: '5px'
      }
    }, intl.get('hmde.bo.businessObject.confirm.delete').d('是否删除此条记录'))
  }, /*#__PURE__*/React.createElement("a", null, intl.get('hmde.common.button.delete').d('删除')))), /*#__PURE__*/React.createElement("div", {
    className: styles['card-content'],
    onClick: () => gotoFlowDetail(flowId, flowCode)
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['card-title']
  }, /*#__PURE__*/React.createElement("strong", null, title)), /*#__PURE__*/React.createElement("small", null, flowCode), /*#__PURE__*/React.createElement(SpringTooltip, {
    title: remark
  }, stRef => /*#__PURE__*/React.createElement("p", {
    ref: stRef
  }, remark))));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Index));