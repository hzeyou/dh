import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _useModal from "choerodon-ui/pro/lib/use-modal";
import React, { useMemo, useState } from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import request from 'utils/request';
import notification from 'utils/notification';
import { getResponse, setSession } from 'utils/utils';
import { observer } from 'mobx-react-lite';
// import { Popconfirm } from 'choerodon-ui';

import { FieldType, FieldIgnore } from 'choerodon-ui/pro/lib/data-set/enum';
import { TableQueryBarType } from 'choerodon-ui/pro/lib/table/enum';
import { operatorRender } from 'utils/renderer';
import { openTab, closeTab } from 'utils/menuTab';
import { whetherToCloseModal } from 'hzero-front-apaas/lib/utils/common';
import { renderModalConfirm } from "hzero-front-apaas/lib/utils/render";
import { PublishStatus } from "hzero-front-apaas/lib/constants/businessObject";
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import BOPermissionButton from "hzero-front-hmde/lib/routes/BusinessObject/Detail/components/BOPermissionButton";
import { deleteBusinessObjectFieldHistory } from "hzero-front-hmde/lib/services/businessObjectService";
import LowcodePopconfirm from "hzero-front-apaas/lib/components/LowcodePopconfirm";
import VersionRollbackModal from "./VersionRollbackModal";
var FN = /*#__PURE__*/function (FN) {
  FN["VERSION"] = "version";
  FN["DATETIME"] = "creationDate";
  FN["EXPLAIN"] = "versionDescription";
  FN["OPERATOR"] = "operator";
  FN["START_TIME"] = "startTime";
  FN["END_TIME"] = "endTime";
  FN["OPERATOR_LOGIN_NAME"] = "operatorLoginName";
  FN["BO_NAME"] = "businessObjectName";
  return FN;
}(FN || {});
const VersionInfoModal = props => {
  const modal = props.modal,
    businessObjectId = props.businessObjectId,
    businessObjectCreatedFlag = props.businessObjectCreatedFlag;
  const CModal = _useModal();
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    spinning = _useState2[0],
    setSpinning = _useState2[1];
  const versionDs = useMemo(() => new _DataSet({
    autoQuery: true,
    selection: false,
    fields: [{
      name: FN.VERSION,
      label: intl.get('hmde.bo.businessObject.pubVersion').d('发布版本'),
      type: "string"
    }, {
      name: FN.DATETIME,
      label: intl.get('hmde.common.pubtime').d('发布时间'),
      type: "dateTime"
    }, {
      name: FN.EXPLAIN,
      label: intl.get('hmde.bo.businessObject.versiondetail').d('版本描述'),
      type: "string"
    }, {
      name: FN.OPERATOR,
      label: intl.get('hmde.common.operator').d('操作人'),
      type: "string"
    }, {
      name: FN.OPERATOR_LOGIN_NAME,
      label: intl.get('hmde.common.busObjectName').d('业务对象名称'),
      type: "string"
    }],
    queryFields: [{
      name: FN.VERSION,
      label: intl.get('hmde.bo.businessObject.pubVersion').d('发布版本'),
      type: "number"
    }, {
      name: 'creationDate',
      label: intl.get('hmde.common.pubtime').d('发布时间'),
      type: "dateTime",
      range: ['startTime', 'endTime'],
      ignore: "always"
    }, {
      name: FN.START_TIME,
      type: "string",
      bind: 'creationDate.startTime'
    }, {
      name: FN.OPERATOR_LOGIN_NAME,
      label: intl.get('hmde.common.operator').d('操作人'),
      type: "string"
    }, {
      name: FN.END_TIME,
      type: "string",
      bind: 'creationDate.endTime'
    }],
    transport: {
      read: () => {
        return {
          url: `${lowcodeOrganizationURL({
            route: HZERO_HMDE
          })}/business-objects/${businessObjectId}/versions`,
          method: 'GET'
        };
      }
    }
  }), [businessObjectId]);
  const handleDeleteBoHistory = record => {
    deleteBusinessObjectFieldHistory({
      businessObjectId: record.get('businessObjectId'),
      version: record.get('version')
    }).then(res => {
      if (getResponse(res)) {
        versionDs.query();
      }
    });
  };

  /**
   * @description: 跳转到详情页
   */
  function handleOBJdetail(midRecord) {
    const objVersionkey = `objVersion_${midRecord === null || midRecord === void 0 ? void 0 : midRecord.get('businessObjectCode')}_${midRecord === null || midRecord === void 0 ? void 0 : midRecord.get('tenantId')}`;
    if ((midRecord === null || midRecord === void 0 ? void 0 : midRecord.get('rollbackFlag')) === true && (midRecord === null || midRecord === void 0 ? void 0 : midRecord.get('publishStatus')) === PublishStatus.PUBLISHED) {
      setSession(objVersionkey, midRecord.get('version')); // 跳转业务对象的版本
    } else {
      // 不能进行版本回滚，当前版本是最新一版且为发布态，就直接跳到编辑态了
      setSession(objVersionkey, '');
    }
    whetherToCloseModal();
    setTimeout(() => {
      closeTab(`/hmde/business-object/detail/${midRecord.get('businessObjectId')}`);
      openTab({
        key: `/hmde/business-object/detail/${midRecord.get('businessObjectId')}`,
        path: `/hmde/business-object/detail/${midRecord.get('businessObjectId')}`,
        closable: true,
        // tab 是否可以关闭
        // type: 'menu', // tab 类型
        title: midRecord.get('businessObjectName'),
        state: {
          originKey: 'fieldList',
          domainId: midRecord.get('domainId')
        }
      });
    });
  }
  /**
   * @description: 业务对象版本回滚
   */
  function revertVersion(midRecord) {
    const objVersionkey = `objVersion_${midRecord === null || midRecord === void 0 ? void 0 : midRecord.get('businessObjectCode')}_${midRecord === null || midRecord === void 0 ? void 0 : midRecord.get('tenantId')}`;
    setSpinning(true);
    modal.update({
      okProps: {
        disabled: true
      },
      cancelProps: {
        disabled: true
      }
    });
    request(`${lowcodeOrganizationURL({
      route: HZERO_HMDE
    })}/business-objects/${midRecord.get('businessObjectId')}/rollback`, {
      method: 'GET',
      params: {
        version: midRecord.get('version')
      }
    }).then(res => {
      if (!res.failed) {
        notification.success({});
        setSession(objVersionkey, '');
        modal.close();
        closeTab(`/hmde/business-object/detail/${midRecord.get('businessObjectId')}`);
        openTab({
          key: `/hmde/business-object/detail/${midRecord.get('businessObjectId')}`,
          path: `/hmde/business-object/detail/${midRecord.get('businessObjectId')}`,
          closable: true,
          // tab 是否可以关闭
          // type: 'menu', // tab 类型
          title: midRecord.get('businessObjectName'),
          state: {
            originKey: 'fieldList',
            domainId: midRecord.get('domainId')
          }
        });
      } else if (res.failed === true && (res === null || res === void 0 ? void 0 : res.code) === 'hmde.error.publish.field_error') {
        const _res$errorList = res.errorList,
          errorList = _res$errorList === void 0 ? [] : _res$errorList,
          _res$validateRuleErro = res.validateRuleErrorList,
          validateRuleErrorList = _res$validateRuleErro === void 0 ? [] : _res$validateRuleErro,
          _res$associateErrorLi = res.associateErrorList,
          associateErrorList = _res$associateErrorLi === void 0 ? [] : _res$associateErrorLi;
        const data = [...errorList, ...validateRuleErrorList, ...associateErrorList];
        CModal.open({
          key: _Modal.key(),
          okButton: false,
          closable: true,
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
      await versionDs.query();
      setSpinning(false);
      modal.update({
        okProps: {
          disabled: false
        },
        cancelProps: {
          disabled: false
        }
      });
    });
  }

  // 恢复版本
  const handleRestoreNew = r => {
    renderModalConfirm(intl.get('hmde.bo.businessObject.restoreTipsNew').d('恢复后历史版本配置将覆盖成为最新版本配置，请确认是否恢复？'), {
      title: intl.get('hmde.bo.businessObject.isRestoreNew').d('是否恢复'),
      onOk: () => revertVersion(r)
    });
  };

  /**
   * @description: 最新版为编辑态时
   */
  const columns = [{
    name: FN.VERSION,
    width: 130,
    renderer: ({
      record,
      text
    }) => {
      if ((record === null || record === void 0 ? void 0 : record.get('publishStatus')) === PublishStatus.MODIFIED) {
        return intl.get('hmde.bo.businessObject.LatestVersion').d('最新版本');
      }
      return text;
    }
  }, {
    name: FN.DATETIME,
    renderer: ({
      record,
      text
    }) => {
      if ((record === null || record === void 0 ? void 0 : record.get('publishStatus')) === PublishStatus.MODIFIED) {
        return '';
      }
      return text;
    }
  }, {
    name: FN.EXPLAIN
  }, {
    name: FN.OPERATOR,
    renderer: ({
      record
    }) => {
      return `${(record === null || record === void 0 ? void 0 : record.get('operatorRealName')) || ''}${record !== null && record !== void 0 && record.get('operatorLoginName') ? `（${record === null || record === void 0 ? void 0 : record.get('operatorLoginName')}）` : ''}`;
    }
  }, {
    name: 'operate',
    title: '操作',
    width: 230,
    renderer: ({
      record: midRecord
    }) => {
      if (!midRecord) {
        return null;
      }
      const operators = [];
      const publishStatus = midRecord === null || midRecord === void 0 ? void 0 : midRecord.get('publishStatus');
      const rollbackFlag = midRecord === null || midRecord === void 0 ? void 0 : midRecord.get('rollbackFlag');
      const lastVersionFlag = midRecord === null || midRecord === void 0 ? void 0 : midRecord.get('lastVersionFlag');
      operators.push({
        key: 'detail',
        ele: /*#__PURE__*/React.createElement("a", {
          onClick: () => handleOBJdetail(midRecord)
        }, intl.get('hmde.common.button.viewDetail').d('查看详情')),
        len: 4
      });
      if (rollbackFlag === true && publishStatus === PublishStatus.PUBLISHED) {
        operators.push({
          key: 'toNewVersion',
          ele: /*#__PURE__*/React.createElement(BOPermissionButton, {
            componentType: "a",
            disabled: !businessObjectCreatedFlag,
            onClick: () => handleRestoreNew(midRecord)
          }, intl.get('hmde.bo.businessObject.reverNewDetail').d('恢复为最新版本')),
          len: 7
        });
      }

      // 已发布非最新版本, 可删除
      if (publishStatus === PublishStatus.PUBLISHED && !lastVersionFlag) {
        operators.push({
          key: 'delete',
          ele: /*#__PURE__*/React.createElement(LowcodePopconfirm, {
            title: intl.get('hmde.bo.businessObject.deletetip').d('是否删除'),
            onConfirm: () => {
              handleDeleteBoHistory(midRecord);
            }
          }, /*#__PURE__*/React.createElement(BOPermissionButton, {
            componentType: "a",
            disabled: !businessObjectCreatedFlag
          }, intl.get('hmde.common.button.delete').d('删除'))),
          len: 2
        });
      }
      return operatorRender(operators, midRecord, {
        limit: 3
      });
    }
  }];
  return /*#__PURE__*/React.createElement(_Spin, {
    spinning: spinning
  }, /*#__PURE__*/React.createElement(_Table, {
    dataSet: versionDs,
    columns: columns,
    queryBar: "filterBar",
    queryBarProps: {
      fuzzyQueryPlaceholder: intl.get('hmde.bo.businessObject.inputVersionDetail').d('请输入版本描述'),
      dynamicFilterBar: {
        searchText: FN.EXPLAIN
      }
    }
  }));
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(VersionInfoModal));