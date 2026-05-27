import React from 'react';
import styles from "./index.less?modules";
const RequiredLabel = ({
  children
}) => {
  return /*#__PURE__*/React.createElement("span", {
    className: styles['required-label']
  }, children);
};
export default RequiredLabel;