import _isString from "lodash/isString";
import React, { memo, isValidElement } from 'react';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import styles from "./index.less?modules";
const Card = ({
  icon,
  title,
  description,
  style,
  children,
  _ref
}) => {
  const renderIcon = () => {
    if (_isString(icon)) {
      return /*#__PURE__*/React.createElement(ImgIcon, {
        name: icon,
        size: 14,
        style: {
          marginRight: 4
        }
      });
    } else if ( /*#__PURE__*/isValidElement(icon)) {
      return icon;
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles['card-container'],
    style: style,
    ref: _ref
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['card-title']
  }, renderIcon(), title, description), /*#__PURE__*/React.createElement("div", {
    className: styles['card-content']
  }, children));
};
export default /*#__PURE__*/memo(Card);