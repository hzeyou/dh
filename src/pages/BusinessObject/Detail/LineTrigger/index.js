import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Popconfirm from "@hzero-front-ui/c7n-ui/lib/Popconfirm";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _useModal from "choerodon-ui/pro/lib/use-modal";
import React, { useEffect, useMemo } from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import qs from 'qs';
import { operatorRender } from 'utils/renderer';
import { enableRender } from "hzero-front-apaas/lib/utils/render";
import { getResponse, isTenantRoleLevel, getCurrentOrganizationId } from 'utils/utils';
import { FuncType, ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { useHistory } from 'react-router-dom';
import notification from 'utils/notification';
import intl from 'utils/intl';
import { TableQueryBarType, ColumnAlign, TableColumnTooltip, ColumnLock } from 'choerodon-ui/pro/lib/table/enum';
import { renderPopConfirmTitle } from "hzero-front-apaas/lib/utils/render";
import lineTriggerDS, { FN } from "hzero-front-hmde/lib/stores/BusinessObject/LineTriggerDS";
import BOPermissionButton from "hzero-front-hmde/lib/routes/BusinessObject/Detail/components/BOPermissionButton";
import AddMol from "./components/AddMol";
import { pubService, enableService, disabledService } from "./service";
import { getPubTypeTag } from "./utils";
import styles from "./index.less?modules";
const isTenant = isTenantRoleLevel();
const tenantId = getCurrentOrganizationId();
const App = ({
  baseInfoDS
}) => {
  var _baseInfoDS$current;
  const Modal = _useModal();
  const history = useHistory();
  // 表格ds
  const tableListDs = useMemo(() => {
    return new _DataSet(lineTriggerDS(baseInfoDS));
  }, []);
  const isApiTenantType = (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('physicalModelType')) === 'API' && isTenant;
  useEffect(() => {
    init();
  }, []);
  const init = () => {
    tableListDs.query();
  };
  const handleSet = record => {
    var _baseInfoDS$current2, _baseInfoDS$current3, _baseInfoDS$current4;
    history.push({
      pathname: `/hmde/business-object/linetrigger-detail/${record === null || record === void 0 ? void 0 : record.get('businessObjectTriggerId')}`,
      search: qs.stringify({
        businessObjectId: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : _baseInfoDS$current2.get('businessObjectId'),
        businessObjectCode: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current3 = baseInfoDS.current) === null || _baseInfoDS$current3 === void 0 ? void 0 : _baseInfoDS$current3.get('businessObjectCode'),
        physicalModelType: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current4 = baseInfoDS.current) === null || _baseInfoDS$current4 === void 0 ? void 0 : _baseInfoDS$current4.get('physicalModelType'),
        triggerType: record === null || record === void 0 ? void 0 : record.get('triggerType')
      })
    });
  };
  const handlePub = record => {
    record === null || record === void 0 ? void 0 : record.setState('loading', true);
    pubService(record === null || record === void 0 ? void 0 : record.toData()).then(res => {
      record === null || record === void 0 ? void 0 : record.setState('loading', false);
      if (res && res.failed === true) {
        notification.error({
          message: intl.get('hmde.common.publishingFailed').d('发布失败'),
          description: res.message
        });
      } else {
        notification.success({
          message: intl.get('hmde.common.handleSuccess').d('操作成功')
        });
        tableListDs === null || tableListDs === void 0 ? void 0 : tableListDs.query();
      }
    });
  };
  const handleCopy = record => {
    handleAddField('copy', record);
  };
  const handleEnable = record => {
    if (record !== null && record !== void 0 && record.get('enabledFlag')) {
      disabledService(record === null || record === void 0 ? void 0 : record.get('businessObjectTriggerId')).then(res => {
        if (getResponse(res)) {
          notification.success({
            message: intl.get('hmde.common.handleSuccess').d('操作成功')
          });
          tableListDs === null || tableListDs === void 0 ? void 0 : tableListDs.query();
        }
      });
    } else {
      enableService(record === null || record === void 0 ? void 0 : record.get('businessObjectTriggerId')).then(res => {
        if (getResponse(res)) {
          notification.success({
            message: intl.get('hmde.common.handleSuccess').d('操作成功')
          });
          tableListDs === null || tableListDs === void 0 ? void 0 : tableListDs.query();
        }
      });
    }
  };
  const handleEdit = record => {
    handleAddField('edit', record);
  };
  // 表格列
  const columns = useMemo(() => {
    return [{
      name: FN.triggerName,
      align: "left",
      tooltip: "overflow",
      renderer: ({
        value,
        record
      }) => {
        if (!isApiTenantType) {
          return /*#__PURE__*/React.createElement("a", {
            disabled: isApiTenantType,
            onClick: () => handleSet(record)
          }, value);
        } else {
          return value;
        }
      }
    }, {
      name: FN.triggerTypeMeaning,
      align: "left",
      tooltip: "overflow"
    }, {
      name: FN.enabledFlag,
      align: "left",
      tooltip: "overflow",
      renderer: ({
        value
      }) => enableRender(value ? 1 : 0, {
        wrapperStyle: {
          justifyContent: 'start'
        }
      })
    }, {
      name: FN.publishStatus,
      align: "left",
      tooltip: "overflow",
      renderer: ({
        value
      }) => getPubTypeTag(value)
    }, {
      name: FN.asyncFlag,
      align: "left",
      tooltip: "overflow",
      renderer: ({
        value
      }) => enableRender(value ? 1 : 0, {
        wrapperStyle: {
          justifyContent: 'start'
        },
        trueText: intl.get('hmde.common.yes').d('是'),
        falseText: intl.get('hmde.common.no').d('否')
      })
    }, {
      name: FN.transactionType,
      align: "left",
      tooltip: "overflow"
    }, {
      name: FN.sourceType,
      align: "left",
      tooltip: "overflow"
    }, {
      name: FN.remark,
      align: "left",
      tooltip: "overflow"
    }, {
      header: intl.get('hmde.common.table.column.operate').d('操作'),
      align: "left",
      width: 180,
      renderer: ({
        record
      }) => {
        const operators = [(record === null || record === void 0 ? void 0 : record.get('tenantId')) === tenantId && {
          key: 'pub',
          ele: /*#__PURE__*/React.createElement(BOPermissionButton, {
            componentType: "a",
            onClick: () => handlePub(record),
            style: {
              width: 'auto'
            }
          }, /*#__PURE__*/React.createElement(BOPermissionButton, {
            funcType: "link",
            color: "primary",
            loading: (record === null || record === void 0 ? void 0 : record.getState('loading')) || false,
            disabled: isApiTenantType
          }, intl.get('hmde.common.publish').d('发布'))),
          len: 2,
          title: intl.get('hmde.common.publish').d('发布')
        }, (record === null || record === void 0 ? void 0 : record.get('tenantId')) === tenantId && {
          key: 'edit',
          ele: /*#__PURE__*/React.createElement(BOPermissionButton, {
            componentType: "a",
            onClick: () => handleEdit(record),
            disabled: isApiTenantType
          }, intl.get('hmde.common.button.edit').d('编辑')),
          len: 2,
          title: intl.get('hmde.common.button.edit').d('编辑')
        }, (record === null || record === void 0 ? void 0 : record.get('tenantId')) === tenantId && {
          key: 'copy',
          ele: /*#__PURE__*/React.createElement(BOPermissionButton, {
            componentType: "a",
            onClick: () => handleCopy(record),
            disabled: isApiTenantType
          }, intl.get('hmde.common.copy').d('复制')),
          len: 2,
          title: intl.get('hmde.common.copy').d('复制')
        }, (record === null || record === void 0 ? void 0 : record.get('tenantId')) === tenantId && {
          key: 'enable',
          ele: /*#__PURE__*/React.createElement(_Popconfirm, {
            title: renderPopConfirmTitle('', record !== null && record !== void 0 && record.get('enabledFlag') ? intl.get('hmde.common.message.disableTips').d(`是否禁用`) : intl.get('hmde.common.isEnabled').d(`是否启用`)),
            onConfirm: () => handleEnable(record)
          }, /*#__PURE__*/React.createElement(BOPermissionButton, {
            componentType: "a",
            disabled: isApiTenantType
          }, record !== null && record !== void 0 && record.get('enabledFlag') ? intl.get('hmde.common.button.disable').d('禁用') : intl.get('hmde.common.button.enable').d('启用'))),
          len: 2,
          title: record !== null && record !== void 0 && record.get('enabledFlag') ? intl.get('hmde.common.button.disable').d('禁用') : intl.get('hmde.common.button.enable').d('启用')
        }, (record === null || record === void 0 ? void 0 : record.get('tenantId')) === tenantId && {
          key: 'delete',
          ele: /*#__PURE__*/React.createElement(_Popconfirm, {
            title: renderPopConfirmTitle(intl.get('hmde.bo.businessObject.tiggerDeieteTips').d(`请确认是否删除该记录触发器，删除并发布后相关数据会失效。`), intl.get('hmde.bo.businessObject.deletetip').d('是否删除')),
            onConfirm: () => tableListDs === null || tableListDs === void 0 ? void 0 : tableListDs.delete(record, false)
          }, /*#__PURE__*/React.createElement(BOPermissionButton, {
            componentType: "a",
            disabled: isApiTenantType
          }, intl.get('hmde.common.button.delete').d('删除'))),
          len: 2,
          title: intl.get('hmde.common.button.delete').d('删除')
        }].filter(Boolean);
        return operatorRender(operators, record, {
          limit: 3
        });
      },
      lock: "right"
    }].filter(Boolean);
  }, []);

  // table操作-新增记录
  const handleAddField = (type, record) => {
    var _baseInfoDS$current5, _baseInfoDS$current6;
    const formDs = new _DataSet(lineTriggerDS(baseInfoDS, type));
    let title;
    switch (type) {
      case 'edit':
        formDs.loadData([{
          ...(record === null || record === void 0 ? void 0 : record.toData())
        }]);
        title = intl.get('hmde.bo.businessObject.editTigger').d('编辑触发器');
        break;
      case 'copy':
        formDs.create({
          [FN.triggerName]: record === null || record === void 0 ? void 0 : record.get(FN.triggerName),
          [FN.triggerType]: record === null || record === void 0 ? void 0 : record.get(FN.triggerType),
          [FN.asyncFlag]: record === null || record === void 0 ? void 0 : record.get(FN.asyncFlag),
          [FN.enabledFlag]: record === null || record === void 0 ? void 0 : record.get(FN.enabledFlag),
          [FN.remark]: record === null || record === void 0 ? void 0 : record.get(FN.remark),
          [FN.domainName]: record === null || record === void 0 ? void 0 : record.get('domainName'),
          [FN.domainId]: record === null || record === void 0 ? void 0 : record.get('domainId'),
          businessObjectTriggerId: record === null || record === void 0 ? void 0 : record.get('businessObjectTriggerId')
        });
        title = intl.get('hmde.bo.businessObject.copyTigger').d('复制触发器');
        break;
      default:
        formDs.create({
          [FN.asyncFlag]: false,
          [FN.enabledFlag]: true,
          [FN.domainName]: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current5 = baseInfoDS.current) === null || _baseInfoDS$current5 === void 0 ? void 0 : _baseInfoDS$current5.get('domainName'),
          [FN.domainId]: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current6 = baseInfoDS.current) === null || _baseInfoDS$current6 === void 0 ? void 0 : _baseInfoDS$current6.get('domainId')
        });
        title = intl.get('hmde.bo.businessObject.createTigger').d('新建触发器');
        break;
    }
    Modal.open({
      title,
      style: {
        width: '595px'
      },
      contentStyle: {
        maxHeight: '100%'
      },
      drawer: type === 'edit',
      closable: false,
      destroyOnClose: true,
      children: /*#__PURE__*/React.createElement(AddMol, {
        ds: formDs,
        tableListDs: tableListDs,
        type: type
      }),
      okText: intl.get('hmde.common.button.sure').d('确定')
    });
  };
  const buttons = [/*#__PURE__*/React.createElement(BOPermissionButton, {
    key: "add",
    onClick: handleAddField,
    icon: "add",
    disabled: isApiTenantType
  }, intl.get('hmde.common.button.create').d('新建'))].filter(Boolean);
  return /*#__PURE__*/React.createElement("div", {
    className: styles['line-trigger']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['line-trigger-title']
  }, intl.get('hmde.bo.businessObject.tab.lineTigger').d('记录触发器')), /*#__PURE__*/React.createElement(_Table, {
    dataSet: tableListDs,
    queryBar: "filterBar",
    queryBarProps: {
      fuzzyQueryPlaceholder: intl.get('hmde.bo.businessObject.enterlineTiggerName').d('请输入触发器名称')
    },
    buttons: buttons,
    columns: columns,
    style: {
      overflow: 'auto'
    }
  }));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(App));