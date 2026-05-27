import React, { useRef, useEffect } from 'react';
import { useHover } from 'ahooks';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import styles from "./index.less?modules";
const ListItem = ({
  value,
  isHover,
  onClick,
  handleHover
}) => {
  const ref = useRef(null);
  const isHovering = useHover(ref);
  useEffect(() => {
    if (isHovering) {
      handleHover();
    }
  }, [isHovering]);
  return /*#__PURE__*/React.createElement("div", {
    className: classnames({
      [styles.item]: true,
      [styles.hover]: isHover
    }),
    onClick: onClick,
    ref: ref
  }, value);
};
export default observer(ListItem);