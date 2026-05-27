import React from 'react';
import { observer } from 'mobx-react-lite';
import intl from 'utils/intl';
import { StoreProvider } from "./store";
import UsefulPermission from "./UsefulPermission";
import styles from "./index.less?modules";
const PermissionPolicy = ({
  baseInfoDS,
  usedPermissionDs,
  readOnlyFlag
}) => {
  return /*#__PURE__*/React.createElement(StoreProvider, {
    usedPermissionDs: usedPermissionDs,
    baseInfoDS: baseInfoDS,
    readOnlyFlag: readOnlyFlag
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.wrapper
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      marginBottom: 12
    }
  }, intl.get('hmde.bo.businessObject.theAccessTo').d('使用权限')), /*#__PURE__*/React.createElement(UsefulPermission, null)));
};
export default observer(PermissionPolicy);