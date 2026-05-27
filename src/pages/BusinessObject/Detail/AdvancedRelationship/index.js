import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _message from "@hzero-front-ui/c7n-ui/lib/Message";
import _useModal from "choerodon-ui/pro/lib/use-modal";
import React, { useEffect, useImperativeHandle } from 'react';
import { observer } from 'mobx-react-lite';
import { TableQueryBarType, ColumnLock, ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { SourceType } from "hzero-front-apaas/lib/constants/businessObject";
import { operatorRender } from 'utils/renderer';
import { enableRender } from "hzero-front-apaas/lib/utils/render";
import formatterCollections from 'utils/intl/formatterCollections';
import { isTenantRoleLevel } from 'utils/utils';
import notification from 'utils/notification';
import intl from 'utils/intl';
import { useLocation } from 'react-router';
import { deleteAdvanceService, toggleStatusAdvanceService } from "hzero-front-hmde/lib/services/businessObjectService";
import { jumpObjectDetail } from "hzero-front-hmde/lib/utils/bo";
import BOPermissionButton from "hzero-front-hmde/lib/routes/BusinessObject/Detail/components/BOPermissionButton";
import PopconfirmButton from "hzero-front-hmde/lib/components/PopconfirmButton";
import { PhysicalModelType } from "hzero-front-hmde/lib/constants/businessObject";
import { FieldType } from "hzero-front-apaas/lib/constants/businessObject";
import RightContent from "./CreateOrEditForm";
import { AssociateType } from "./CreateOrEditForm/type";
import parentStyles from "../index.less?modules";
const isTenant = isTenantRoleLevel();
const Index = ({
  businessObjectCode,
  businessObjectId,
  businessObjectName,
  advancedListDs,
  baseInfoDS,
  sourceType,
  advancedRef,
  readOnlyFlag,
  showVersion
}) => {
  var _baseInfoDS$current, _baseInfoDS$current2;
  const _useLocation = useLocation(),
    routeState = _useLocation.state;
  const Modal = _useModal();
  // 租户层SQL对象不可修改高级关系
  const tenantSqlObjectDisabled = isTenant && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('physicalModelType')) === PhysicalModelType.SQL && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : _baseInfoDS$current2.get('sourceType')) === FieldType.INHERIT;
  useImperativeHandle(advancedRef, () => ({
    initData
  }));
  useEffect(() => {
    initData();
  }, []);

  // 初始化数据
  const initData = async () => {
    advancedListDs.query().then(() => {
      if (advancedListDs.totalCount > 0) {
        var _advancedListDs$query, _advancedListDs$query2;
        (_advancedListDs$query = advancedListDs.queryDataSet) === null || _advancedListDs$query === void 0 ? void 0 : (_advancedListDs$query2 = _advancedListDs$query.current) === null || _advancedListDs$query2 === void 0 ? void 0 : _advancedListDs$query2.set('associateCode', routeState === null || routeState === void 0 ? void 0 : routeState.associateCode);
        advancedListDs.query().then(() => {
          const targetRecord = advancedListDs.find(record => record.get('associateCode') === (routeState === null || routeState === void 0 ? void 0 : routeState.associateCode));
          if (targetRecord) {
            handleOpenModal('edit', targetRecord);
          }
        });
      }
    });
  };

  // 删除高级关系
  const handleDeleteAdvRelation = record => {
    const _businessObjectAssociateId = record.toData().businessObjectAssociateId;
    deleteAdvanceService(_businessObjectAssociateId).then(async res => {
      if (res && res.failed) {
        notification.warning({
          message: intl.get('hmde.common.deleteError').d('删除失败'),
          description: res.message
        });
      } else {
        _message.success(intl.get('hmde.common.notification.successfullyDeleted').d('删除成功'), undefined, undefined, 'top');
      }
      advancedListDs.query();
      baseInfoDS.query();
    });
  };

  // 关系的启用/禁用
  const handleDisableRule = record => {
    toggleStatusAdvanceService(record.toData()).then(res => {
      if (res && res.failed) {
        notification.warning({
          message: intl.get('hmde.common.disableError').d('禁用失败'),
          description: res.message
        });
      } else {
        notification.success({
          message: intl.get('hmde.common.handleSuccess').d('操作成功')
        });
        advancedListDs.query();
        baseInfoDS.query();
      }
    });
  };

  // 编辑详情
  const handleOpenModal = (type, record) => {
    const params = {
      advancedListDs,
      baseInfoDS,
      readOnlyFlag: readOnlyFlag || tenantSqlObjectDisabled,
      showVersion,
      type,
      businessObjectId,
      businessObjectName,
      businessObjectCode
    };
    if (record) {
      Object.assign(params, {
        businessObjectAssociateId: record === null || record === void 0 ? void 0 : record.get('businessObjectAssociateId')
      });
    }
    Modal.open({
      title: type === 'create' ? intl.get('hmde.bo.businessObject.addHighGx').d('新建高级关系') : intl.get('hmde.bo.businessObject.editHighGx').d('编辑高级关系'),
      destroyOnClose: true,
      drawer: type !== 'create',
      closable: true,
      style: {
        width: type !== 'create' ? 958 : 1000
      },
      children: /*#__PURE__*/React.createElement(RightContent, params),
      cancelText: intl.get('hmde.common.button.cancel').d('取消')
    });
  };
  const columns = [{
    name: 'associateName',
    renderer: ({
      value,
      record
    }) => {
      return /*#__PURE__*/React.createElement("a", {
        style: {
          verticalAlign: 'text-bottom'
        },
        onClick: () => {
          handleOpenModal('edit', record);
        }
      }, value);
    }
  }, {
    name: 'associateCode'
  }, {
    name: 'associateType',
    renderer: ({
      value
    }) => {
      if (value === AssociateType.SLAVE_MASTER) {
        return intl.get('hmde.common.slaveMaster').d('从主');
      }
      if (value === AssociateType.LINK) return intl.get('hmde.common.link').d('关联');
      return null;
    }
  }, {
    name: 'associateBusinessObjectName',
    renderer: ({
      record,
      text
    }) => {
      if (!record) return null;
      const id = record.get('associateBusinessObjectId');
      const name = record.get('associateBusinessObjectName');
      return text && /*#__PURE__*/React.createElement("a", {
        onClick: () => jumpObjectDetail({
          businessObjectId: id,
          businessObjectName: name
        })
      }, text);
    }
  }, {
    name: 'enabledFlag',
    align: "left",
    renderer: ({
      value
    }) => enableRender(value, {
      wrapperStyle: {
        justifyContent: 'left'
      }
    })
  }, {
    title: intl.get('hmde.common.table.column.operate').d('操作'),
    width: 160,
    lock: "right",
    renderer: ({
      record
    }) => {
      var _baseInfoDS$current3, _baseInfoDS$current4;
      if (tenantSqlObjectDisabled) {
        return null;
      }
      const statusText = record !== null && record !== void 0 && record.get('enabledFlag') ? intl.get('hmde.common.button.disable').d('禁用') : intl.get('hmde.common.button.enable').d('启用');
      const operators = [{
        key: 'disable',
        ele: /*#__PURE__*/React.createElement(PopconfirmButton
        // title={
        //   record?.get('enabledFlag')
        //     ? intl
        //         .get('hmde.bo.businessObject.disableHighRelation')
        //         .d('请确认是否禁用该高级关系?')
        //     : intl
        //         .get('hmde.bo.businessObject.enableHighRelation')
        //         .d('请确认是否启用该高级关系?')
        // }
        , {
          titleTips: record !== null && record !== void 0 && record.get('enabledFlag') ? intl.get('hmde.common.message.disableTips').d(`是否禁用`) : intl.get('hmde.common.isEnabled').d(`是否启用`),
          text: statusText,
          busLimits: true,
          onConfirm: () => handleDisableRule(record),
          styles: {
            verticalAlign: 'top'
          },
          delUrl: `/business-object-associates/${record === null || record === void 0 ? void 0 : record.get('businessObjectAssociateId')}/${record !== null && record !== void 0 && record.get('enabledFlag') ? 'disable' : 'enable'}?checkFlag=true`,
          method: "PUT",
          disabled: readOnlyFlag || isTenant && sourceType === SourceType.PLATFORM || (record === null || record === void 0 ? void 0 : record.get('operationalFlag')) === false && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current3 = baseInfoDS.current) === null || _baseInfoDS$current3 === void 0 ? void 0 : _baseInfoDS$current3.get('businessObjectCategory')) === 'DIMENSION'
        }),
        len: 2,
        title: statusText
      }, {
        key: 'delete',
        ele: /*#__PURE__*/React.createElement(PopconfirmButton, {
          title: intl.get('hmde.bo.businessObject.deleteHighRelation1').d('请确认是否删除该高级关系，删除并发布后相关数据会失效。'),
          titleTips: intl.get('hmde.bo.businessObject.deletetip').d('是否删除'),
          text: intl.get('hmde.common.button.delete').d('删除'),
          busLimits: true,
          onConfirm: () => handleDeleteAdvRelation(record),
          styles: {
            verticalAlign: 'top',
            marginLeft: '16px'
          },
          delUrl: `/business-object-associates/${record === null || record === void 0 ? void 0 : record.get('businessObjectAssociateId')}?checkFlag=true`,
          method: "DELETE",
          disabled: readOnlyFlag || isTenant && sourceType === SourceType.PLATFORM || (record === null || record === void 0 ? void 0 : record.get('operationalFlag')) === false && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current4 = baseInfoDS.current) === null || _baseInfoDS$current4 === void 0 ? void 0 : _baseInfoDS$current4.get('businessObjectCategory')) === 'DIMENSION'
        }),
        len: 2,
        title: intl.get('hmde.common.button.delete').d('删除')
      }];
      return operatorRender(operators, record);
    }
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", {
    className: parentStyles.title,
    style: {
      marginBottom: '12px'
    }
  }, intl.get('hmde.common.advancedRelationship').d('高级关系')), /*#__PURE__*/React.createElement(_Table, {
    dataSet: advancedListDs,
    columns: columns,
    queryBar: "filterBar",
    queryBarProps: {
      fuzzyQueryPlaceholder: intl.get('hmde.bo.businessObject.pleaseintercodename').d('请输入关系名称、编码等')
    },
    buttons: [/*#__PURE__*/React.createElement(BOPermissionButton, {
      icon: "add",
      hidden: sourceType === SourceType.PREDEFINE || isTenant && sourceType === SourceType.PLATFORM || tenantSqlObjectDisabled || readOnlyFlag || isTenant && sourceType !== SourceType.TENANT,
      disabled: readOnlyFlag || tenantSqlObjectDisabled,
      onClick: () => handleOpenModal('create')
    }, intl.get('hmde.common.button.create').d('新建'))]
  }));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Index));