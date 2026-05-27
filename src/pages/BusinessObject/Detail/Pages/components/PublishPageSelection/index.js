import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Tree from "@hzero-front-ui/c7n-ui/lib/Tree";
import React, { useEffect, useState } from 'react';
import intl from 'utils/intl';
import { getCurrentUser } from 'utils/utils';
import styles from "./index.less?modules";
const TreeNode = _Tree.TreeNode;
export default (({
  data,
  handleSaveCheckPage
}) => {
  const _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    checkedKeys = _useState2[0],
    setCheckedKeys = _useState2[1];
  const _useState3 = useState(['root']),
    _useState4 = _slicedToArray(_useState3, 2),
    expandedKeys = _useState4[0],
    setExpandedKeys = _useState4[1];
  const onExpand = currentExpandedKeys => {
    setExpandedKeys(currentExpandedKeys);
  };
  const onCheck = currentCheckedKeys => {
    setCheckedKeys([...currentCheckedKeys]);
    const list = [...currentCheckedKeys].filter(ele => ele !== 'root');
    handleSaveCheckPage(list);
  };
  const renderTitle = item => {
    // const publishedIcon = item.publishStatus !== 'UNPUBLISHED' && (
    // <img
    //   className={styles.publishedIcon}
    //   src={item.publishStatus === 'PUBLISHED' ? publishedImg : modifiedImg}
    //   alt={item.publishStatus === 'PUBLISHED' ? '已发布' : '发布后已修改'}
    // />
    // );

    return /*#__PURE__*/React.createElement("div", {
      style: {
        wordBreak: 'break-all'
      }
    }, item.pageName || item.businessObjectName, item.lockedFlag && item.lockedByUserName && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: '5px'
      }
    }, `(${intl.get('hmde.bo.view.message.InteractiveViewHasBeen').d('交互视图已被')}${item.lockedByUserName}${intl.get('hmde.common.button.lock').d('锁定')})`));
  };
  const loop = _data => _data.map(item => {
    var _getCurrentUser;
    if (item.children && item.children.length) {
      return /*#__PURE__*/React.createElement(TreeNode, {
        key: "root",
        title: renderTitle(item),
        disabled: item.lockedFlag
      }, loop(item.children));
    }
    return /*#__PURE__*/React.createElement(TreeNode, {
      key: item.pageCode || 'root',
      title: renderTitle(item),
      disabled: item.lockedFlag && item.lockedBy !== ((_getCurrentUser = getCurrentUser()) === null || _getCurrentUser === void 0 ? void 0 : _getCurrentUser.id)
    });
  });

  // 默认选择全部
  useEffect(() => {
    var _data$children;
    const defaultCheckedKeys = data === null || data === void 0 ? void 0 : (_data$children = data.children) === null || _data$children === void 0 ? void 0 : _data$children.filter(item => !item.lockedFlag).map(item => item.pageCode);
    if (defaultCheckedKeys !== null && defaultCheckedKeys !== void 0 && defaultCheckedKeys.length) {
      onCheck(defaultCheckedKeys);
    }
  }, [data]);
  return /*#__PURE__*/React.createElement("div", {
    className: `${styles['tree-contain']} ${styles.scroll}`
  }, /*#__PURE__*/React.createElement(_Tree, {
    checkable: true,
    onExpand: onExpand,
    expandedKeys: expandedKeys,
    checkedKeys: checkedKeys,
    onCheck: onCheck
  }, loop([data])));
});