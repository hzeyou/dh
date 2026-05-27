import _Card from "@hzero-front-ui/c7n-ui/lib/Card";
import _extends from "@babel/runtime/helpers/esm/extends";
import _Divider from "@hzero-front-ui/c7n-ui/lib/Divider";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Popconfirm from "@hzero-front-ui/c7n-ui/lib/Popconfirm";
import _Icon from "choerodon-ui/pro/lib/icon";
import _useModal from "choerodon-ui/pro/lib/use-modal";
import React, { useCallback, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import intl from 'utils/intl';
import { toJS } from 'mobx';
import { isTenantRoleLevel } from 'utils/utils';
import { renderPopConfirmTitle } from "hzero-front-apaas/lib/utils/render";
import { SourceType } from "hzero-front-apaas/lib/constants/businessObject";
import { FieldsNameTypes, DataListCodeMeansFn } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionPolicyDS";
import ImgGuDing from "hzero-front-hmde/lib/assets/icon/guding-xuanzhong.svg";
import BOPermissionButton from "hzero-front-hmde/lib/routes/BusinessObject/Detail/components/BOPermissionButton";
import { PERMISSION_POLICY_DATA_RANGE, DataRangeCodeMeansFn } from "hzero-front-hmde/lib/constants/code";
import PublishStatusTag from "../../../components/PulishStatusTag";
import PlatformOrTenantTag from "../../../components/PlatformOrTenantTag";
import EditPermissionModal from "../../../components/EditPermissionModal";
import DistributePermissionModal from "../../../components/DistributePermissionModal";
import PermissionRangeOrganizations from "./components/PermissionRangeOrganizations";
import { getOnlyMasterFlagHelp } from "../../../utils/form";
import { useUsedPermissionStore, useBaseInfoStore } from "../../../store";
import styles from "./index.less?modules";
// 卡片操作项
var OPERATION_KEY = /*#__PURE__*/function (OPERATION_KEY) {
  OPERATION_KEY["DELETE"] = "delete";
  OPERATION_KEY["EDIT"] = "edit";
  OPERATION_KEY["VIEW_DETAIL"] = "viewDetail";
  OPERATION_KEY["MODIFY"] = "modify";
  OPERATION_KEY["DISTRIBUTION"] = "distribution";
  return OPERATION_KEY;
}(OPERATION_KEY || {});
const isTenant = isTenantRoleLevel();
const PermissionPolicyCard = ({
  record,
  isDefaultShowRange,
  readOnlyFlag
}) => {
  const Modal = _useModal();
  const _useUsedPermissionSto = useUsedPermissionStore(),
    usedPermissionDs = _useUsedPermissionSto.usedPermissionDs;
  const baseInfoDs = useBaseInfoStore();
  const sourceType = baseInfoDs.current.get('sourceType'); // 对象类型

  // 是否是默认权限
  const isDefault = !!(record !== null && record !== void 0 && record.get('defaultFlag'));

  // 渲染卡片标题
  const renderCardTitle = useMemo(() => {
    var _record$get;
    return /*#__PURE__*/React.createElement("div", {
      className: styles['title-wrapper']
    }, /*#__PURE__*/React.createElement("span", {
      className: styles.title
    }, record === null || record === void 0 ? void 0 : record.get('groupName')), /*#__PURE__*/React.createElement(PlatformOrTenantTag, {
      isTenant: !Number(record === null || record === void 0 ? void 0 : record.get('tenantId'))
    }), /*#__PURE__*/React.createElement(PublishStatusTag, {
      status: record === null || record === void 0 ? void 0 : record.get('publishStatus')
    }), !(record !== null && record !== void 0 && (_record$get = record.get('groupTenantList')) !== null && _record$get !== void 0 && _record$get.length) && !isDefault && !(record !== null && record !== void 0 && record.get('allowAllTenantFlag')) && /*#__PURE__*/React.createElement("span", {
      className: styles['title-wrapper-span']
    }, /*#__PURE__*/React.createElement(_Icon, {
      type: "error_outline"
    }), intl.get('hmde.bo.businessObject.unassignedGrantScope').d('未分配授予范围')), isDefault && /*#__PURE__*/React.createElement("img", {
      src: ImgGuDing,
      alt: "guding",
      className: styles.img
    }));
  }, [record, usedPermissionDs, isDefault]);

  // 删除操作
  const handleDelete = useCallback(() => {
    usedPermissionDs.delete(record, false).then(res => {
      if (res) {
        usedPermissionDs.query();
        baseInfoDs.query();
      }
    });
  }, [baseInfoDs, usedPermissionDs, record]);

  // 编辑操作
  const handleEdit = useCallback(modify => {
    const isModify = !!modify;
    // 设置 ds 进入编辑状态
    return Modal.open({
      title: intl.get('hmde.bo.businessObject.editPermissionPolicy').d('编辑权限策略'),
      closable: true,
      destroyOnClose: true,
      drawer: true,
      okButton: !readOnlyFlag,
      children: /*#__PURE__*/React.createElement(EditPermissionModal, {
        record: record,
        isModify: isModify,
        baseInfoDs: baseInfoDs,
        onSubmitSuccess: () => {
          usedPermissionDs.query();
          baseInfoDs.query();
        }
      }),
      style: {
        width: '716px'
      }
    });
  }, [baseInfoDs, usedPermissionDs, record]);

  // 查看权限策略
  const handleView = useCallback(() => {
    // 设置 ds 进入编辑状态
    return Modal.open({
      title: intl.get('hmde.bo.businessObject.viewPermissionPolicy').d('查看权限策略'),
      closable: true,
      destroyOnClose: true,
      drawer: true,
      okButton: !readOnlyFlag,
      children: /*#__PURE__*/React.createElement(EditPermissionModal, {
        record: record,
        isModify: false,
        baseInfoDs: baseInfoDs,
        disabled: true,
        onSubmitSuccess: () => {
          usedPermissionDs.query();
          baseInfoDs.query();
        }
      }),
      style: {
        width: '716px'
      }
    });
  }, [baseInfoDs, usedPermissionDs, record]);

  // 分配操作
  const handleDistribute = useCallback(() => {
    Modal.open({
      title: intl.get('hmde.bo.businessObject.allocationPermissionPolicy').d('分配权限策略'),
      closable: true,
      destroyOnClose: true,
      drawer: true,
      children: /*#__PURE__*/React.createElement(DistributePermissionModal, {
        usedPermissionDs: usedPermissionDs,
        record: record,
        baseInfoDs: baseInfoDs
      }),
      style: {
        width: '716px'
      }
    });
  }, [usedPermissionDs, record]);

  // 渲染操作项
  const renderOperations = useMemo(() => {
    const operationList = [];
    const operationMap = {
      [OPERATION_KEY.DELETE]: /*#__PURE__*/React.createElement(_Popconfirm, {
        title: renderPopConfirmTitle(intl.get('hmde.bo.businessObject.delPermissionPolicy.tips1').d('请确认是否删除该权限策略，删除并发布后相关数据会失效。'), intl.get('hmde.bo.businessObject.deletetip').d('是否删除')),
        onConfirm: handleDelete,
        key: "delete"
      }, /*#__PURE__*/React.createElement(BOPermissionButton, {
        disabled: readOnlyFlag,
        funcType: "flat"
      }, intl.get('hmde.common.button.delete').d('删除'))),
      [OPERATION_KEY.EDIT]: /*#__PURE__*/React.createElement(_Button, {
        color: "primary",
        onClick: () => handleEdit(),
        disabled: readOnlyFlag,
        funcType: "flat",
        key: "edit"
      }, intl.get('hmde.common.button.edit').d('编辑')),
      [OPERATION_KEY.VIEW_DETAIL]: /*#__PURE__*/React.createElement(_Button, {
        color: "primary",
        onClick: handleView,
        disabled: readOnlyFlag,
        funcType: "flat",
        key: "view"
      }, intl.get('hmde.common.lookup').d('查看')),
      [OPERATION_KEY.MODIFY]: isTenant && isDefault ? null : /*#__PURE__*/React.createElement(_Button, {
        color: "primary",
        onClick: () => handleEdit(true),
        disabled: readOnlyFlag,
        funcType: "flat",
        key: "edit1"
      }, intl.get('hmde.common.edit').d('修改')),
      [OPERATION_KEY.DISTRIBUTION]: isTenant && isDefault ? null : /*#__PURE__*/React.createElement(BOPermissionButton, {
        color: "primary",
        onClick: handleDistribute,
        disabled: readOnlyFlag,
        funcType: "flat",
        key: "fenpei"
      }, intl.get('hmde.bo.businessObject.allocation').d('分配'))
    };
    if (sourceType === SourceType.PREDEFINE) {
      return null;
    } else if (isDefault) {
      // 默认仅有修改按钮
      if (isTenant) {
        if (sourceType !== SourceType.TENANT) {
          // 租户级别继承平台只有 分配
          operationList.push(OPERATION_KEY.VIEW_DETAIL);
        }
      } else {
        operationList.push(OPERATION_KEY.MODIFY);
      }
    } else if (isTenant && sourceType !== SourceType.TENANT) {
      // 租户级别继承平台只有 分配
      if (!(record !== null && record !== void 0 && record.get(FieldsNameTypes.GRANT_RANGE))) {
        operationList.push(OPERATION_KEY.DISTRIBUTION);
      }
    } else {
      // 平台级别/租户自定义 删除 编辑 分配
      operationList.push(...[OPERATION_KEY.DELETE, OPERATION_KEY.EDIT, OPERATION_KEY.DISTRIBUTION]);
    }
    return /*#__PURE__*/React.createElement("div", {
      className: styles.operations
    }, operationList.map(o => operationMap[o]));
  }, [record, readOnlyFlag]);
  const renderPermissionRangeOrganizations = () => {
    var _record$get2;
    if (!(record !== null && record !== void 0 && (_record$get2 = record.get('groupTenantList')) !== null && _record$get2 !== void 0 && _record$get2.length)) {
      return null;
    }
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Form, {
      record: record
      // useColon={false}
      ,
      columns: 1
    }, /*#__PURE__*/React.createElement(_Output, {
      name: FieldsNameTypes.GRANT_RANGE,
      renderer: () => null
    })), /*#__PURE__*/React.createElement(PermissionRangeOrganizations, {
      data: record === null || record === void 0 ? void 0 : record.get('groupTenantList')
    }));
  };
  const renderAllOrganizations = () => {
    return /*#__PURE__*/React.createElement(_Output, {
      name: FieldsNameTypes.GRANT_RANGE,
      renderer: () => isTenant ? intl.get('hmde.bo.businessObject.allCharacter').d('全部角色') : intl.get('hmde.bo.businessObject.allTenants').d('全部租户')
    });
  };
  const rendererOnlyMasterFlag = ({
    value
  }) => {
    return value ? intl.get('hmde.common.yes').d('是') : intl.get('hmde.common.no').d('否');
  };
  const rendererDataPermissions = ({
    value
  }) => {
    var _toJS, _toJS$split, _toJS$split$map;
    return value ? (_toJS = toJS(value)) === null || _toJS === void 0 ? void 0 : (_toJS$split = _toJS.split('+')) === null || _toJS$split === void 0 ? void 0 : (_toJS$split$map = _toJS$split.map(v => DataListCodeMeansFn()[v])) === null || _toJS$split$map === void 0 ? void 0 : _toJS$split$map.join('+') : intl.get('hmde.bo.businessObject.none').d('无');
  };
  const rendererDataRanges = ({
    value
  }) => {
    return DataRangeCodeMeansFn()[toJS(value)];
  };
  return /*#__PURE__*/React.createElement(_Card, {
    title: renderCardTitle,
    extra: renderOperations,
    className: styles['card-wrapper']
  }, /*#__PURE__*/React.createElement(_Divider, {
    className: styles.line
  }), !(record !== null && record !== void 0 && record.get('allowAllTenantFlag')) && (isDefault ? isDefaultShowRange && renderPermissionRangeOrganizations() : renderPermissionRangeOrganizations()), /*#__PURE__*/React.createElement(_Form, {
    record: record
    // useColon={false}
    ,
    columns: 3,
    labelWidth: "auto"
  }, (record === null || record === void 0 ? void 0 : record.get('allowAllTenantFlag')) && (isDefault ? isDefaultShowRange && renderAllOrganizations() : renderAllOrganizations()), /*#__PURE__*/React.createElement(_Output, {
    name: FieldsNameTypes.DATA_PERMISSION,
    renderer: rendererDataPermissions
  }), /*#__PURE__*/React.createElement(_Output, {
    name: FieldsNameTypes.DATA_RANGE,
    renderer: rendererDataRanges
  }), /*#__PURE__*/React.createElement(_Output, {
    name: FieldsNameTypes.CODE
  }), /*#__PURE__*/React.createElement(_Output, _extends({}, getOnlyMasterFlagHelp(), {
    name: FieldsNameTypes.ONLY_MASTER_FLAG,
    renderer: rendererOnlyMasterFlag,
    hidden: (record === null || record === void 0 ? void 0 : record.get(FieldsNameTypes.DATA_RANGE)) === PERMISSION_POLICY_DATA_RANGE.ALL
  })), /*#__PURE__*/React.createElement(_Output, {
    name: FieldsNameTypes.DESCRIPTION,
    colSpan: 2
  })));
};
export default observer(PermissionPolicyCard);