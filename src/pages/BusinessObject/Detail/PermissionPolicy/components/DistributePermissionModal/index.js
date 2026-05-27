import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _useModal from "choerodon-ui/pro/lib/use-modal";
import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import intl from 'utils/intl';
import { PublishStatus } from "hzero-front-apaas/lib/constants/businessObject";
import { FieldsNameTypes } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionPolicyDS";
import { PERMISSION_POLICY_DATA_RANGE } from "hzero-front-hmde/lib/constants/code";
import LabelTitleRender from "hzero-front-hmde/lib/businessComponents/LabelTitleRender";
import DistributeRangeModal from "../DistributeRangeModal";
import RangeContent from "./components/RangeContent";
import { rendererDataPermissions, rendererDataRanges, rendererType } from "../../utils/form";
import DataRangeControl from "../CreatePermissionPolicyModal/components/DataRangeControl";
/**
 * 分配弹框
 * @param record
 * @param dataSet
 * @constructor
 */
const DistributePermissionModal = ({
  baseInfoDs,
  usedPermissionDs,
  record
}) => {
  const Modal = _useModal();
  const publishStatus = record === null || record === void 0 ? void 0 : record.get('publishStatus');
  const _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    distributePermissionDs = _useState2[0],
    setDistributePermissionDs = _useState2[1];
  const _React$useState = React.useState(false),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    rangeVisible = _React$useState2[0],
    setRangeVisible = _React$useState2[1];
  useEffect(() => {
    if (publishStatus === PublishStatus.MODIFIED) {
      distributePermissionDs === null || distributePermissionDs === void 0 ? void 0 : distributePermissionDs.query(undefined, {
        groupId: record === null || record === void 0 ? void 0 : record.get('groupId')
      });
    } else {
      distributePermissionDs === null || distributePermissionDs === void 0 ? void 0 : distributePermissionDs.create({
        ...record.toData()
      });
    }
  }, [publishStatus, distributePermissionDs]);

  // 分配弹窗
  const handleDistributeRange = useCallback(ds => {
    return Modal.open({
      title: /*#__PURE__*/React.createElement(LabelTitleRender, {
        value: intl.get('hmde.bo.businessObject.allocationPermissionPolicy').d('分配权限策略'),
        style: {
          height: 28
        },
        help: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "1.", intl.get('hmde.bo.businessObject.allocationPermissionPolicy.status1').d('勾选租户并移至右侧穿梭框，点击【确定】按钮提交则分配权限策略给租户，此时该租户下无角色拥有该权限策略；')), /*#__PURE__*/React.createElement("p", null, "2.", intl.get('hmde.bo.businessObject.allocationPermissionPolicy.status2').d('如需对角色进行权限策略的分配，则应勾选对应角色后移至右侧穿梭框，并点击【确定】按钮提交；')), /*#__PURE__*/React.createElement("p", null, "3.", intl.get('hmde.bo.businessObject.allocationPermissionPolicy.status3').d('勾选【默认授权】，授权给选中租户的所有角色（新增角色默认授予）')))
      }),
      autoCenter: true,
      destroyOnClose: true,
      movable: false,
      children: distributePermissionDs && /*#__PURE__*/React.createElement(DistributeRangeModal, {
        record: record,
        distributePermissionDs: distributePermissionDs,
        distributeDs: ds,
        usedPermissionDs: usedPermissionDs,
        baseInfoDs: baseInfoDs
      }),
      style: {
        width: '1200px'
      }
    });
  }, [record, usedPermissionDs, distributePermissionDs]);
  const renderDataRangeReadOnly = props => {
    const value = props.value;
    const handleClick = () => {
      setRangeVisible(v => !v);
    };
    const renderShow = () => {
      return /*#__PURE__*/React.createElement("a", {
        style: {
          marginLeft: '16px'
        }
      }, rangeVisible ? /*#__PURE__*/React.createElement("span", {
        onClick: handleClick
      }, intl.get('hmde.bo.businessObject.close').d('收起')) : /*#__PURE__*/React.createElement("span", {
        onClick: handleClick
      }, intl.get('hmde.bo.businessObject.open').d('展开')));
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, rendererDataRanges(props), value === PERMISSION_POLICY_DATA_RANGE.CUSTOM && renderShow());
  };
  return /*#__PURE__*/React.createElement("div", null, distributePermissionDs && /*#__PURE__*/React.createElement(_Form, {
    dataSet: distributePermissionDs
    // useColon={false}
    ,
    columns: 2
  }, /*#__PURE__*/React.createElement(_Output, {
    name: FieldsNameTypes.NAME
  }), /*#__PURE__*/React.createElement(_Output, {
    name: FieldsNameTypes.CODE
  }), /*#__PURE__*/React.createElement(_Output, {
    name: FieldsNameTypes.TYPE,
    renderer: rendererType
  }), /*#__PURE__*/React.createElement(_Output, {
    name: FieldsNameTypes.DESCRIPTION
  }), /*#__PURE__*/React.createElement(_Output, {
    name: FieldsNameTypes.DATA_PERMISSION,
    renderer: rendererDataPermissions
  }), /*#__PURE__*/React.createElement(_Output, {
    name: FieldsNameTypes.DATA_RANGE,
    renderer: renderDataRangeReadOnly
  })), rangeVisible && distributePermissionDs && /*#__PURE__*/React.createElement(DataRangeControl, {
    dataSet: distributePermissionDs,
    baseInfoDs: baseInfoDs,
    readOnly: true
  }), /*#__PURE__*/React.createElement(RangeContent, {
    record: record,
    handleDistributeRange: handleDistributeRange,
    ref: ref => {
      if (ref !== null && ref !== void 0 && ref.distributePermissionDs) {
        setDistributePermissionDs(ref.distributePermissionDs);
      }
    }
  }));
};
export default observer(DistributePermissionModal);