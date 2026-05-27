import _Icon from "choerodon-ui/lib/icon";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/Tooltip";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useState } from 'react';
import Icons from 'components/Icons';
import styles from "./index.less?modules";
const MenuItem = ({
  icon,
  domainName,
  selectedFlag
}) => {
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    visible = _useState2[0],
    setVisible = _useState2[1];
  return /*#__PURE__*/React.createElement("div", {
    className: styles['menu-title']
  }, /*#__PURE__*/React.createElement(Icons, {
    style: {
      marginRight: '8px',
      fontSize: '12px'
    },
    type: icon
  }), /*#__PURE__*/React.createElement(_Tooltip, {
    title: domainName,
    visible: visible
  }, /*#__PURE__*/React.createElement("span", {
    onMouseEnter: e => {
      var _e$target, _e$target2;
      if (((_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.scrollWidth) > ((_e$target2 = e.target) === null || _e$target2 === void 0 ? void 0 : _e$target2.offsetWidth)) {
        setVisible(true);
      }
    },
    onMouseLeave: () => setVisible(false),
    style: {
      color: 'rgba(0, 0, 0, 0.65)',
      fontSize: '12px'
    }
  }, domainName)), selectedFlag && /*#__PURE__*/React.createElement(_Icon, {
    type: "check_circle_outline-o",
    style: {
      color: '#0840F8'
    }
  }));
};
export default MenuItem;