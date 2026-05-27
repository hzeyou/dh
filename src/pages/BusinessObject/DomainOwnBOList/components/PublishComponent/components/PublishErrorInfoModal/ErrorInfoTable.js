import _Alert from "@hzero-front-ui/c7n-ui/lib/Alert";
import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
// 当前业务对象字段与关联物理模型或扩展物理模型存在差异 则弹出提示警告报错框

import React, { useMemo, useCallback } from 'react';
import intl from 'utils/intl';
import { observer } from 'mobx-react-lite';
import { TableColumnTooltip, ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
// import { notification } from 'hzero-ui';
import notification from 'utils/notification';
import { getResponse } from 'utils/utils';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { syncModel } from "hzero-front-hmde/lib/services/businessObjectService";
import styles from "./index.less?modules";
const PublishWarning = ({
  tableDs,
  activeKey = ''
}) => {
  const columns = useMemo(() => [{
    name: 'codeNumber',
    width: 60,
    align: "left",
    renderer: ({
      record
    }) => {
      return +((record || {}).index || 0) + 1;
    }
  }, {
    name: 'businessObjectName',
    tooltip: "overflow"
  }, {
    name: 'physicalModelType',
    align: "left",
    tooltip: "overflow",
    renderer: ({
      value
    }) => {
      if (value === 'TABLE') {
        return intl.get('hmde.bo.businessObject.physicalModel').d('物理模型');
      } else if (value === 'API') {
        return intl.get('hmde.bo.apiModel.title').d('API模型');
      }
    }
  }, {
    name: 'physicsModelName',
    align: "left",
    width: 220,
    tooltip: "overflow"
  }, {
    name: 'functionType',
    align: "left",
    tooltip: "overflow"
  }, {
    name: 'functionName',
    align: "left",
    width: 115,
    tooltip: "overflow"
  }, {
    name: 'propertyType',
    align: "left",
    tooltip: "overflow"
  }, {
    name: 'message',
    align: "left",
    width: 200,
    tooltip: "overflow"
  }, {
    name: 'physicsValue',
    align: "left",
    width: 120,
    tooltip: "overflow"
  }, {
    name: 'businessValue',
    align: "left",
    width: 120,
    tooltip: "overflow"
  }, {
    header: '操作',
    width: 80,
    align: "center",
    lock: 'right',
    renderer: ({
      record
    }) => /*#__PURE__*/React.createElement(_Button, {
      funcType: "flat",
      color: "primary",
      onClick: handleSynchronization.bind(null, record)
    }, intl.get(`hmde.common.noAsyncFlag`).d('同步'))
  }], []);
  const handleSynchronization = useCallback(record => {
    const body = record.toData();
    const tableData = tableDs.toData();
    syncModel([body]).then(res => {
      if (getResponse(res)) {
        notification.success({
          // message: intl.get('hmde.common.tips').d('提示'),
          message: intl.get(`hmde.pd.nodeClassification.syncSuccess`).d('同步成功'),
          placement: 'bottomRight'
        });
        const filterData = tableData.filter(item => (item === null || item === void 0 ? void 0 : item.businessObjectFieldId) !== (body === null || body === void 0 ? void 0 : body.businessObjectFieldId));
        tableDs.loadData(filterData);
      }
    });
  }, [tableDs]);

  /**
   * 一键同步 批量同步
   */
  const synchronization = useCallback(type => {
    if (type === 'all') {
      const body = tableDs.toData();
      syncModel(body).then(res => {
        if (getResponse(res)) {
          notification.success({
            // message: intl.get('hmde.common.tips').d('提示'),
            message: intl.get(`hmde.pd.nodeClassification.syncSuccess`).d('同步成功'),
            placement: 'bottomRight'
          });
          tableDs.loadData([]);
        }
      });
    } else if (tableDs.selected.length > 0) {
      const tableData = tableDs.toData();
      const body = tableDs.selected.map(item => {
        return item.toData();
      });
      const businessObjectFieldIdList = body.map(item => item === null || item === void 0 ? void 0 : item.businessObjectFieldId);
      syncModel(body).then(res => {
        if (getResponse(res)) {
          const filterData = tableData.filter(item => !businessObjectFieldIdList.includes(item === null || item === void 0 ? void 0 : item.businessObjectFieldId));
          notification.success({
            // message: intl.get('hmde.common.tips').d('提示'),
            message: intl.get(`hmde.pd.nodeClassification.syncSuccess`).d('同步成功'),
            placement: 'bottomRight'
          });
          tableDs.loadData(filterData);
        }
      });
    } else {
      notification.warning({
        // message: intl.get('hmde.common.tips').d('提示'),
        message: intl.get(`hmde.bo.businessObject.chooseSelectValue`).d('请先勾选要同步的内容!'),
        placement: 'bottomRight'
      });
    }
  }, [tableDs]);
  const buttons = useMemo(() => /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(_Button, {
    funcType: "flat",
    color: "primary",
    icon: "sync",
    onClick: synchronization.bind(null, 'all')
  }, intl.get(`hmde.bo.businessObject.synchronizationAll`).d('一键同步')), /*#__PURE__*/React.createElement(_Button, {
    funcType: "flat",
    color: "primary",
    icon: "sync_alt",
    disabled: tableDs.selected.length === 0,
    onClick: synchronization.bind(null, 'batch')
  }, intl.get(`hmde.bo.businessObject.synchronizationBatch`).d('批量同步'))), [tableDs.selected]);
  const alertInfo = useMemo(() => {
    const errorMessage = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 'bold'
      }
    }, intl.get(`hmde.bo.businessObject.physicalModel`).d('物理模型')), "\uFF1A", intl.get(`hmde.bo.businessObject.informationDescription1`).d('当前业务对象在领域下无权限更新物理模型，如需更新物理模型请联系管理员获取权限。您也可以选择差异属性并点击“批量同步”按钮将物理模型属性同步到业务对象后继续发布，同步后存在差异的属性会被物理模型中对应的属性覆盖，请谨慎操作。')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 'bold'
      }
    }, intl.get(`hmde.common.apiModal`).d('API模型')), "\uFF1A", intl.get(`hmde.bo.businessObject.informationDescription2`).d('请先解决差异才能再次发布，您可以选择字段并点击“批量同步”按钮，将API参数的属性同步到映射字段或删除未映射标准API参数的字段后继续发布。')));
    const warningMessage = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 'bold'
      }
    }, intl.get(`hmde.bo.businessObject.physicalModel`).d('物理模型')), "\uFF1A", intl.get(`hmde.bo.businessObject.informationDescription3`).d('当前业务对象在领域下无权限更新物理模型，发布后不影响业务对象的使用但物理模型不会被更新，如需更新物理模型请联系管理员获取权限。您也可以选择差异属性并点击“批量同步”按钮将物理模型属性同步到业务对象后继续发布，同步后存在差异的属性会被物理模型中对应的属性覆盖，请谨慎操作。')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 'bold'
      }
    }, intl.get(`hmde.common.apiModal`).d('API模型')), "\uFF1A", intl.get(`hmde.bo.businessObject.informationDescription4`).d('您可以继续发布，如需处理差异，可选择字段并点击“批量同步”按钮，将API参数的属性同步到映射字段。')));
    const title = intl.get(`hmde.bo.businessObject.informationDescription5`).d('检测到以下数据在所属业务对象与关联物理模型/扩展物理模型/API模型中属性存在如下差异：');
    return {
      message: activeKey === 'error' ? errorMessage : warningMessage,
      alertType: activeKey === 'error' ? 'error' : 'warning',
      title
    };
  }, [activeKey]);
  return /*#__PURE__*/React.createElement("div", {
    className: styles['publish-warning']
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#22242A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, alertInfo === null || alertInfo === void 0 ? void 0 : alertInfo.title, buttons), /*#__PURE__*/React.createElement(_Table, {
    dataSet: tableDs,
    columns: columns
  }), /*#__PURE__*/React.createElement(_Alert, {
    style: {
      marginTop: 16
    },
    message: alertInfo === null || alertInfo === void 0 ? void 0 : alertInfo.message,
    type: alertInfo === null || alertInfo === void 0 ? void 0 : alertInfo.alertType,
    showIcon: true
  }));
};
export default observer(PublishWarning);