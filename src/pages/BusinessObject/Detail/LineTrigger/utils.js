import _Tag from "@hzero-front-ui/c7n-ui/lib/Tag";
import React from "react";
/* eslint-disable react/react-in-jsx-scope */
import intl from 'utils/intl';
export const getPubTypeTag = key => {
  if (key === 'PUBLISHED') {
    return /*#__PURE__*/React.createElement(_Tag, {
      color: "green"
    }, intl.get('hmde.common.status.published').d('已发布'));
  }
  if (key === 'MODIFIED') {
    return /*#__PURE__*/React.createElement(_Tag, {
      color: "yellow"
    }, intl.get('hmde.common.status.modified').d('已修改'));
  }
  if (key === 'UNPUBLISHED') {
    return /*#__PURE__*/React.createElement(_Tag, {
      color: "blue"
    }, intl.get('hmde.common.status.unpublished').d('未发布'));
  }
  return null;
};
export const getTypeTag = key => {
  if (key) {
    return /*#__PURE__*/React.createElement(_Tag, {
      color: "green"
    }, intl.get('hmde.common.button.enable').d('启用'));
  } else {
    return /*#__PURE__*/React.createElement(_Tag, {
      color: "red"
    }, intl.get('hmde.common.button.disable').d('禁用'));
  }
};