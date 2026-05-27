import React from 'react';
import { toJS } from 'mobx';
import intl from 'utils/intl';
import { DataListCodeMeans } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionPolicyDS";
import { DataRangeCodeMeans } from "hzero-front-hmde/lib/constants/code";
import PermissionPolicyImageCom from "hzero-front-hmde/lib/components/imageComponents/PermissionPolicyImageCom";
import PlatformOrTenantTag from "../components/PlatformOrTenantTag";
import permissionStyle from "../UsefulPermission/index.less?modules";

/**
 * 显示数据操作权限
 * @param value
 */
export const rendererDataPermissions = ({
  value
}) => {
  var _toJS, _toJS$split, _toJS$split$map;
  return value ? (_toJS = toJS(value)) === null || _toJS === void 0 ? void 0 : (_toJS$split = _toJS.split('+')) === null || _toJS$split === void 0 ? void 0 : (_toJS$split$map = _toJS$split.map(v => DataListCodeMeans[v])) === null || _toJS$split$map === void 0 ? void 0 : _toJS$split$map.join('+') : intl.get('hmde.bo.businessObject.none').d('无');
};

/**
 * 显示数据范围
 * @param value
 */
export const rendererDataRanges = ({
  value
}) => {
  return DataRangeCodeMeans[toJS(value)];
};

/**
 * 显示权限类型
 * @param value
 */
export const rendererType = ({
  record
}) => {
  return /*#__PURE__*/React.createElement(PlatformOrTenantTag, {
    isTenant: !Number(record === null || record === void 0 ? void 0 : record.get('tenantId'))
  });
};

/**
 * 仅对主对象生效的帮助
 */
export const getOnlyMasterFlagHelp = () => {
  return {
    help: /*#__PURE__*/React.createElement(PermissionPolicyImageCom, null),
    helpTooltipProps: {
      popupClassName: permissionStyle['help-tooltip']
    }
  };
};