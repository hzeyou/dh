import React, { memo } from 'react';
import intl from 'utils/intl';
import styles from "./index.less?modules";
function EnableRender({
  enabledFlag
}) {
  if (enabledFlag) {
    return /*#__PURE__*/React.createElement("div", {
      className: styles['enable-content']
    }, intl.get('hmde.common.button.enable').d('启用'));
  } else {
    return /*#__PURE__*/React.createElement("div", {
      className: styles['disable-content']
    }, intl.get('hmde.common.button.disable').d('禁用'));
  }
}
export default /*#__PURE__*/memo(EnableRender);