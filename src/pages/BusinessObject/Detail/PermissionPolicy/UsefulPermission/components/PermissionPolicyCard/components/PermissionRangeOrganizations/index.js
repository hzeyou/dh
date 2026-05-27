import _Icon from "choerodon-ui/pro/lib/icon";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/Tooltip";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useCallback, useMemo, useState } from 'react';
import intl from 'utils/intl';
import { getThemeColor } from "hzero-front-apaas/lib/utils/common";
import styles from "./index.less?modules";
// 展示收起按钮的数量
const SHOW_MORE_MAX_NUMBER = 6;

/**
 * 租户授权范围展示
 * @param data
 * @constructor
 */
const PermissionRangOrganizations = ({
  data = []
}) => {
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isShowMore = _useState2[0],
    setIsShowMore = _useState2[1];
  const _getThemeColor = getThemeColor(),
    primary = _getThemeColor.primary,
    step1 = _getThemeColor.step1;

  // 是否显示展开按钮
  const isMore = useMemo(() => {
    return data.length > SHOW_MORE_MAX_NUMBER;
  }, [data]);
  const renderOrganization = useCallback(({
    tenantName,
    groupRoleList,
    index
  }) => {
    return /*#__PURE__*/React.createElement("div", {
      className: styles.organization
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.index
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: primary,
        background: step1
      }
    }, index + 1)), /*#__PURE__*/React.createElement("div", {
      className: styles.content
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.name
    }, tenantName), /*#__PURE__*/React.createElement("div", {
      className: styles.roles
    }, /*#__PURE__*/React.createElement(_Tooltip, {
      title: groupRoleList.map(v => v.roleName).join('、'),
      placement: "top"
    }, groupRoleList.map(v => v.roleName).join('、')))));
  }, []);
  const renderMore = useMemo(() => {
    const changeIsShowMore = () => {
      setIsShowMore(v => !v);
    };
    const Wrapper = ({
      children
    }) => {
      return /*#__PURE__*/React.createElement("span", {
        onClick: changeIsShowMore,
        className: styles.operate
      }, children);
    };
    const Open = /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(_Icon, {
      type: "expand_more"
    }), /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.open').d('展开')));
    const Close = /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(_Icon, {
      type: "expand_less"
    }), /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.close').d('收起')));
    return isShowMore ? Close : Open;
  }, [isShowMore]);
  if (data.length === 0) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: styles.wrapper
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.list
  }, data.slice(0, isMore && !isShowMore ? SHOW_MORE_MAX_NUMBER : data.length).map((item, index) => renderOrganization({
    ...item,
    index
  }))), isMore && /*#__PURE__*/React.createElement("div", {
    className: styles.more
  }, renderMore));
};
export default PermissionRangOrganizations;