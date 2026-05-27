import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import React from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import styles from "./index.less?modules";
const ToolButton = ({
  children,
  onClick,
  tooltipText,
  isShowBg = false
}) => {
  return /*#__PURE__*/React.createElement(_Tooltip, {
    title: tooltipText,
    placement: "bottom"
  }, /*#__PURE__*/React.createElement("div", {
    className: classnames({
      [styles.btn]: true,
      [styles.bg]: isShowBg
    }),
    onClick: onClick
  }, children));
};
export default observer(ToolButton);