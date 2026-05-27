import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _useModal from "choerodon-ui/pro/lib/use-modal";
import _isArray from "lodash/isArray";
import React, { useCallback, useEffect, useState, useImperativeHandle, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { isTenantRoleLevel } from 'utils/utils';
import { FuncType } from 'choerodon-ui/pro/lib/button/enum';
import intl from 'utils/intl';
import { Store } from "hzero-front-hmde/lib/routes/BusinessObject/Detail";
import BOPermissionButton from "hzero-front-hmde/lib/routes/BusinessObject/Detail/components/BOPermissionButton";
import { useBaseInfoStore, useUsedPermissionStore } from "../store";
import Empty from "../components/Empty";
import PermissionPolicyCard from "./components/PermissionPolicyCard";
import CreatePermissionPolicyModal from "../components/CreatePermissionPolicyModal";
import styles from "./index.less?modules";
const isTenant = isTenantRoleLevel();
const UsePermission = () => {
  const Modal = _useModal();
  const _useContext = useContext(Store),
    permissionRef = _useContext.permissionRef;
  const _useUsedPermissionSto = useUsedPermissionStore(),
    usedPermissionDs = _useUsedPermissionSto.usedPermissionDs,
    readOnlyFlag = _useUsedPermissionSto.readOnlyFlag;
  const baseInfoDs = useBaseInfoStore();
  const sourceType = baseInfoDs.current.get('sourceType'); // 对象类型
  const _useState = useState(true),
    _useState2 = _slicedToArray(_useState, 2),
    isDefaultShowRange = _useState2[0],
    setIsDefaultShowRange = _useState2[1]; // 是否展示默认权限的授予范围

  useImperativeHandle(permissionRef, () => ({
    initData
  }));
  useEffect(() => {
    initData();
  }, [readOnlyFlag]);

  // 初始化数据
  const initData = () => {
    usedPermissionDs.setQueryParameter('businessObjectCode', baseInfoDs.current.get('businessObjectCode'));
    usedPermissionDs.query().then(res => {
      if (_isArray(res) && res.length > 1) {
        setIsDefaultShowRange(false);
      }
    });
  };
  const onSearch = e => {
    usedPermissionDs.query(undefined, {
      keyWord: e.target.value
    });
  };
  const handleAdd = useCallback(() => {
    return Modal.open({
      title: intl.get('hmde.bo.businessObject.createPermissionPolicy').d('新建权限策略'),
      autoCenter: true,
      closable: true,
      destroyOnClose: true,
      style: {
        width: '700px'
      },
      children: /*#__PURE__*/React.createElement(CreatePermissionPolicyModal, {
        dataSet: usedPermissionDs,
        baseInfoDs: baseInfoDs
      }),
      footer: null
    });
  }, [usedPermissionDs, baseInfoDs]);
  return /*#__PURE__*/React.createElement(_Spin, {
    dataSet: usedPermissionDs
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.wrapper
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.header
  }, /*#__PURE__*/React.createElement(_TextField, {
    className: styles.search,
    placeholder: intl.get('hmde.bo.businessObject.permissionPolicy.placeholder').d('请输入权限策略名称、编码'),
    prefix: /*#__PURE__*/React.createElement(_Icon, {
      type: "search",
      style: {
        color: '#D0D0D0'
      }
    }),
    onEnterDown: onSearch
  }), /*#__PURE__*/React.createElement("div", {
    className: styles.operation
  }, (!isTenant && sourceType !== 'PREDEFINE' || isTenant && sourceType === 'TENANT') && /*#__PURE__*/React.createElement(BOPermissionButton, {
    funcType: "link",
    icon: "add",
    onClick: handleAdd,
    disabled: readOnlyFlag
  }, intl.get('hmde.common.button.create').d('新建')))), /*#__PURE__*/React.createElement("div", {
    className: styles.content
  }, usedPermissionDs.records.length === 0 ? /*#__PURE__*/React.createElement(Empty, {
    subTitle: intl.get('hmde.bo.businessObject.noSearchContent').d('搜索内容不存在')
  }) : usedPermissionDs.records.map(record => /*#__PURE__*/React.createElement(PermissionPolicyCard, {
    key: record === null || record === void 0 ? void 0 : record.get('groupCode'),
    record: record,
    readOnlyFlag: readOnlyFlag,
    isDefaultShowRange: isDefaultShowRange
  })))));
};
export default observer(UsePermission);