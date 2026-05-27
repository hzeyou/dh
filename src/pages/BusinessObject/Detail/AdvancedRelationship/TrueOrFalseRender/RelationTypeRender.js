import React, { memo } from 'react';
import intl from 'utils/intl';
import styles from "./index.less?modules";
const SLAVE_MASTER = 'SLAVE_MASTER',
  // 从主
  LINK // 关联
  = 'LINK';
function RelationTypeRender({
  associateType
}) {
  const getComponentTypeIcon = () => {
    let title = '';
    let className = '';
    if (associateType) {
      switch (associateType) {
        case SLAVE_MASTER:
          className = 'masterRelation';
          title = intl.get('hmde.common.slaveMaster').d('从主');
          break;
        case LINK:
          className = 'link';
          title = intl.get('hmde.common.link').d('关联');
          break;
        default:
          break;
      }
    }
    return /*#__PURE__*/React.createElement("div", {
      className: styles[className]
    }, title);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles['relation-content']
  }, getComponentTypeIcon());
}
export default /*#__PURE__*/memo(RelationTypeRender);