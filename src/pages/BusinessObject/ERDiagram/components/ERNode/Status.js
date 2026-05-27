import _Tag from "@hzero-front-ui/c7n-ui/lib/Tag";
import React from 'react';
import { observer } from 'mobx-react-lite';
import { PublishStatus } from "hzero-front-apaas/lib/constants/businessObject";
import intl from 'utils/intl';
const statusMap = {
  [PublishStatus.PUBLISHED]: /*#__PURE__*/React.createElement(_Tag, {
    color: "green"
  }, intl.get('hmde.common.status.published').d('已发布')),
  [PublishStatus.UNPUBLISHED]: /*#__PURE__*/React.createElement(_Tag, {
    color: "gray"
  }, intl.get('hmde.common.status.unpublished').d('未发布')),
  [PublishStatus.MODIFIED]: /*#__PURE__*/React.createElement(_Tag, {
    color: "yellow"
  }, intl.get('hmde.common.status.modified').d('已修改'))
};
const statusSelectedMap = {
  [PublishStatus.PUBLISHED]: /*#__PURE__*/React.createElement(_Tag, {
    color: "rgba(255,255,255,0.25)"
  }, intl.get('hmde.common.status.published').d('已发布')),
  [PublishStatus.UNPUBLISHED]: /*#__PURE__*/React.createElement(_Tag, {
    color: "gray"
  }, intl.get('hmde.common.status.unpublished').d('未发布')),
  [PublishStatus.MODIFIED]: /*#__PURE__*/React.createElement(_Tag, {
    color: "yellow"
  }, intl.get('hmde.common.status.modified').d('已修改'))
};
const Status = ({
  publishStatus,
  isSelected
}) => {
  if (!publishStatus) {
    return null;
  }
  if (isSelected) {
    return statusSelectedMap[publishStatus];
  } else {
    return statusMap[publishStatus];
  }
};
export default observer(Status);