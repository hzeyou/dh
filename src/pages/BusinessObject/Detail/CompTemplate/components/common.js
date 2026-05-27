import _Badge from "@hzero-front-ui/c7n-ui/lib/Badge";
import { PublishStatus } from "hzero-front-apaas/lib/constants/businessObject";
import intl from 'utils/intl';
import React from 'react';
import styles from "../index.less?modules";
export const publishStatusRender = ({
  value
}) => {
  const statusObj = {
    [PublishStatus.PUBLISHED]: {
      status: 'success',
      text: intl.get('hmde.common.status.published').d('已发布')
    },
    [PublishStatus.UNPUBLISHED]: {
      status: 'error',
      text: intl.get('hmde.common.status.unpublished').d('未发布')
    },
    [PublishStatus.MODIFIED]: {
      status: 'warning',
      text: intl.get('hmde.common.status.modified').d('已修改')
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles['publish-status-wrap']
  }, /*#__PURE__*/React.createElement(_Badge, {
    status: statusObj[value].status,
    text: statusObj[value].text
  }));
};