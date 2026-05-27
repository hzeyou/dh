import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import React from 'react';
import intl from 'utils/intl';
import { observer } from 'mobx-react-lite';
import { isTenantRoleLevel } from 'utils/utils';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';
import { PublishStatus } from "hzero-front-apaas/lib/constants/businessObject";
import BOPermissionButton from "hzero-front-hmde/lib/routes/BusinessObject/Detail/components/BOPermissionButton";
import { PhysicalModelType } from "hzero-front-hmde/lib/constants/businessObject";
import styles from "./index.less?modules";
const isTenant = isTenantRoleLevel();
const Index = ({
  handleCancel,
  isApiModelType,
  physicalModelType,
  deleteFlag,
  detailData,
  handleDelete,
  isEditMode,
  readOnlyFlag,
  handleSave,
  isExtensionField,
  isFromDomain,
  predefineDisabled,
  saveButtonShowFlag,
  boSourceType,
  businessObjectCategory,
  middleDisabled,
  componentType,
  baseInfoDS
}) => {
  var _baseInfoDS$current;
  if (isTenant && boSourceType === 'PLATFORM' && businessObjectCategory === 'DIMENSION') {
    // 组户级看到平台参数对象 直接不给任何操作
    return null;
  }

  // 关联关系多选字段,  如果对象未发布 禁用 继续新建 和 保存按钮
  const saveDisabled = componentType === FieldComponentType.MULTIPLE_RELATION && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('publishStatus')) === PublishStatus.UNPUBLISHED;
  return /*#__PURE__*/React.createElement("div", {
    className: styles['button-wrapper']
  }, /*#__PURE__*/React.createElement(_Button, {
    onClick: handleCancel
  }, intl.get('hmde.common.button.cancel').d('取消')), !isApiModelType && !(physicalModelType === 'API' && isTenant) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BOPermissionButton, {
    hidden: !deleteFlag || (detailData === null || detailData === void 0 ? void 0 : detailData.dimensionFlag) || physicalModelType === PhysicalModelType.SQL || middleDisabled,
    onClick: handleDelete
  }, intl.get('hmde.common.button.delete').d('删除')), /*#__PURE__*/React.createElement(BOPermissionButton, {
    hidden: isEditMode || readOnlyFlag,
    onClick: () => handleSave('continueAdd'),
    disabled: saveDisabled
  }, intl.get('hmde.common.button.continueCreate').d('继续新建')), /*#__PURE__*/React.createElement(BOPermissionButton, {
    hidden: !isEditMode || isExtensionField && (detailData === null || detailData === void 0 ? void 0 : detailData.tenantId) === 0 || isFromDomain || ['createdBy', 'lastUpdatedBy', 'lastUpdateDate', 'createdBy', 'objectVersionNumber', 'tenantId'].includes(detailData === null || detailData === void 0 ? void 0 : detailData.businessObjectFieldCode) && isTenant || predefineDisabled ||
    // detailData?.standardFlag ||
    isEditMode && (detailData === null || detailData === void 0 ? void 0 : detailData.templateCode) || readOnlyFlag || physicalModelType === PhysicalModelType.SQL,
    onClick: () => handleSave('saveAndCreate')
  }, intl.get('hmde.common.button.saveContinueCreate').d('保存并创建'))), saveButtonShowFlag() && /*#__PURE__*/React.createElement(BOPermissionButton, {
    color: "primary",
    onClick: () => handleSave('save')
    // 平台不能编辑扩展字段
    ,
    disabled: readOnlyFlag || (!isTenant || boSourceType === 'TENANT') && isEditMode && isExtensionField || saveDisabled
  }, !isApiModelType ? intl.get('hmde.common.button.save').d('保存') : intl.get('hmde.common.button.sure').d('确定')));
};
export default observer(Index);