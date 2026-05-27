import _Dropdown from "@hzero-front-ui/c7n-ui/lib/DropdownPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _Divider from "@hzero-front-ui/c7n-ui/lib/Divider";
import _Menu from "@hzero-front-ui/c7n-ui/lib/MenuPro";
import _extends from "@babel/runtime/helpers/esm/extends";
import _Modal2 from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _useModal from "choerodon-ui/pro/lib/use-modal";
import _uniq from "lodash/uniq";
import _isEqual from "lodash/isEqual";
import _isArray from "lodash/isArray";
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Action } from 'choerodon-ui/lib/trigger/enum';
import useCode from 'hzero-front-apaas/lib/hooks/useCode';
import classnames from 'classnames';
import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';
import { openTab } from 'utils/menuTab';
import { getResponse, isTenantRoleLevel } from 'utils/utils';
import intl from 'utils/intl';
import { isResponse } from 'hzero-front-apaas/lib/utils/request';
import { cachedRequest } from 'hzero-front-apaas/lib/utils/request';
import { SourceType, FieldType } from "hzero-front-apaas/lib/constants/businessObject";
import AddAndEditField from "hzero-front-hmde/lib/routes/BusinessObject/Detail/FieldsList/AddAndEditField";
import BOPublish from "hzero-front-hmde/lib/routes/BusinessObject/Detail/components/BOPublish";
import { publicBusinessObjects } from "hzero-front-apaas/lib/services/businessObjectService";
import { permissionCheck } from "hzero-front-hmde/lib/services/authorityManageService";
import { PERMISSION_CATEGORY } from "hzero-front-hmde/lib/constants/code";
import Field from "./Field";
import Associate from "./Associate";
import Status from "./Status";
import { getNodeHeight, getPortRefY } from "../../utils/common";
import { ER_NODE_WIDTH, ER_PADDING, ER_TITLE_HEIGHT } from "../../constants/graph";
import styles from "./index.less?modules";
const RELATION_TYPE = [FieldComponentType.LINK_RELATION, FieldComponentType.MASTER_RELATION, FieldComponentType.REFERENCE_FIELD, FieldComponentType.MULTIPLE_RELATION];
const ERNode = ({
  node
}) => {
  const BO_FIELD_TYPE = useCode('HMDE.BUSINESS_OBJECT.FIELD_TYPE');
  const BO_RELATION_TYPE = useCode('HMDE.BUSINESS_OBJECT.RELATION_TYPE');
  const data = node === null || node === void 0 ? void 0 : node.getData();
  const selectedNodeId = data.selectedNodeId,
    domainCode = data.domainCode,
    domainId = data.domainId,
    isShowNonRelationalFields = data.isShowNonRelationalFields,
    updateGraphCells = data.updateGraphCells,
    updateSelectedNodeId = data.updateSelectedNodeId,
    selectedBOIds = data.selectedBOIds,
    graph = data.graph,
    sourceType = data.sourceType,
    businessObjectCategory = data.businessObjectCategory,
    flexFieldEnabledFlag = data.flexFieldEnabledFlag,
    extendTableEnabledFlag = data.extendTableEnabledFlag,
    extendFieldCreatedFlag = data.extendFieldCreatedFlag,
    extendFieldPrefixRule = data.extendFieldPrefixRule,
    physicalModelType = data.physicalModelType,
    businessObjectId = data.businessObjectId,
    businessObjectCode = data.businessObjectCode,
    objectVersionNumber = data.objectVersionNumber,
    _token = data._token,
    queryPublishBoProcess = data.queryPublishBoProcess;
  const isSelected = selectedNodeId === data.businessObjectId;
  const isPreDomain = domainCode === 'SYS'; // 是否为预置领域
  const Modal = _useModal();
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    hasPermission = _useState2[0],
    setHasPermission = _useState2[1];
  const versionFlag = !(isTenantRoleLevel() && [SourceType.PLATFORM, 'INHERIT'].includes(sourceType));
  const versionDescriptionRef = useRef(null); // 业务对象发布时的版本说明

  const displayBusinessObjectFields = useMemo(() => {
    return data.businessObjectFields.filter(field => {
      if (isShowNonRelationalFields) {
        return true;
      } else {
        return RELATION_TYPE.includes(field.componentType);
      }
    });
  }, [isShowNonRelationalFields, data]);
  const displayBusinessObjectAssociateList = useMemo(() => {
    var _data$businessObjectA;
    return (_data$businessObjectA = data.businessObjectAssociateList) !== null && _data$businessObjectA !== void 0 ? _data$businessObjectA : [];
  }, [isShowNonRelationalFields, data]);

  // 判断字段是否有新建权限
  useEffect(() => {
    const query = {
      dataType: PERMISSION_CATEGORY.BO,
      dataId: businessObjectId,
      domainId
    };
    const cacheKey = `hmde-cachedRequest-${JSON.stringify(query)}`;
    cachedRequest(() => permissionCheck(query), cacheKey).then(permissionRes => {
      if (isResponse(permissionRes)) {
        setHasPermission(permissionRes.permissionFlag);
      }
    });
  }, [businessObjectId, domainId]);
  useEffect(() => {
    // 修改连接桩属性
    displayBusinessObjectFields.forEach((field, index) => {
      if (RELATION_TYPE.includes(field.componentType)) {
        node === null || node === void 0 ? void 0 : node.setPortProp(field.businessObjectFieldId, 'attrs/portBody', {
          refY: getPortRefY(index)
        });
      }
    });
    displayBusinessObjectAssociateList.forEach((associate, index) => {
      node === null || node === void 0 ? void 0 : node.setPortProp(associate.businessObjectAssociateId, 'attrs/portBody', {
        refY: getPortRefY(index + displayBusinessObjectFields.length)
      });
    });

    // 同步修改节点大小
    node === null || node === void 0 ? void 0 : node.setProp('size', {
      width: ER_NODE_WIDTH,
      height: getNodeHeight(node.getData(), isShowNonRelationalFields)
    });
  }, [displayBusinessObjectFields.length, displayBusinessObjectAssociateList.length]);
  const handleShowNonRelationalFields = () => {
    var _node$getData;
    node === null || node === void 0 ? void 0 : node.setData({
      ...(node === null || node === void 0 ? void 0 : node.getData()),
      isShowNonRelationalFields: !isShowNonRelationalFields
    });
    node === null || node === void 0 ? void 0 : node.setProp('size', {
      width: ER_NODE_WIDTH,
      height: getNodeHeight(node === null || node === void 0 ? void 0 : (_node$getData = node.getData) === null || _node$getData === void 0 ? void 0 : _node$getData.call(node), !isShowNonRelationalFields)
    });
  };
  const handleViewBODetail = () => {
    openTab({
      key: `/hmde/business-object/detail/${data.businessObjectId}`,
      path: `/hmde/business-object/detail/${data.businessObjectId}`,
      closable: true,
      // tab 是否可以关闭
      title: data.businessObjectName
    });
  };
  const handleCreateRelationField = () => {
    const fieldType = isTenantRoleLevel() ? FieldType.CUSTOM : FieldType.STANDARD; // 字段类型
    _Modal2.open({
      title: intl.get('hmde.common.addField').d('新建字段'),
      destroyOnClose: true,
      closable: true,
      key: _Modal2.key(),
      style: {
        width: 1000,
        minHeight: 650
      },
      resizable: true,
      children: /*#__PURE__*/React.createElement(AddAndEditField, {
        isERCreate: true,
        businessObjectId: data.businessObjectId,
        businessObjectCode: data.businessObjectCode,
        okCallback: updateGraphCells,
        fieldType: fieldType,
        boSourceType: sourceType,
        middleBusinessObjFlag: businessObjectCategory === 'MIDDLE',
        domainEnabledFlag: extendTableEnabledFlag || flexFieldEnabledFlag,
        extendFieldCreatedFlag: extendFieldCreatedFlag,
        extendFieldPrefixRule: extendFieldPrefixRule ? JSON.parse(extendFieldPrefixRule) : '',
        physicalModelType: physicalModelType
      })
    });
  };
  const handleShowAssociation = () => {
    const relationBusinessObjectIds = data.relationBusinessObjectIds;
    if (_isArray(relationBusinessObjectIds) && relationBusinessObjectIds.length > 0) {
      let selectedIds = selectedBOIds || [];
      selectedIds = [...selectedIds, ...relationBusinessObjectIds];
      // 全部转为字符串存储
      // ⚠️兼容非主键加密的情况
      selectedIds = selectedIds.map(id => String(id));
      // 去重
      selectedIds = _uniq(selectedIds);
      updateSelectedNodeId(selectedIds);
    }
  };
  const handleHideBoAndAssociation = isHideSelf => {
    if (node && graph) {
      // 获取当前节点相邻的节点
      const neighborNodes = graph.getNeighbors(node);
      const neighborIds = neighborNodes.map(item => item.id).filter(id => id !== node.id); // 排除自身 (有时候会获取到自身)
      let selectedIds = selectedBOIds || [];
      // 删除当前id及相邻id
      if (isHideSelf) {
        // 是否隐藏自身
        selectedIds = selectedIds.filter(id => id !== node.id && !neighborIds.includes(id));
      } else {
        selectedIds = selectedIds.filter(id => !neighborIds.includes(id));
      }
      updateSelectedNodeId(selectedIds);
    }
  };
  const handleBoPublish = () => {
    Modal.open({
      title: /*#__PURE__*/React.createElement("strong", null, versionFlag ? intl.get('hmde.bo.businessObject.pubObject').d('发布业务对象') : ''),
      children: /*#__PURE__*/React.createElement(BOPublish, {
        versionFlag: versionFlag,
        extendFlag: extendTableEnabledFlag,
        textRef: versionDescriptionRef
      }),
      onOk: () => {
        var _versionDescriptionRe;
        publicBusinessObjects({
          body: {
            _token,
            businessObjectId,
            objectVersionNumber,
            versionDescription: versionDescriptionRef === null || versionDescriptionRef === void 0 ? void 0 : (_versionDescriptionRe = versionDescriptionRef.current) === null || _versionDescriptionRe === void 0 ? void 0 : _versionDescriptionRe.value,
            ignoreWarning: true
          },
          ignoreWarning: true
        }).then(res => {
          if (getResponse(res)) {
            queryPublishBoProcess(businessObjectCode);
          }
        });
      }
    });
  };
  const boMenu = useMemo(() => {
    const ItemA = ({
      children,
      ...props
    }) => {
      return /*#__PURE__*/React.createElement("a", _extends({
        style: {
          fontSize: 12
        }
      }, props), children);
    };
    return /*#__PURE__*/React.createElement(_Menu, {
      selectable: false
    }, !isPreDomain && /*#__PURE__*/React.createElement(_Menu.Item, {
      onClick: handleShowAssociation
    }, /*#__PURE__*/React.createElement(ItemA, null, intl.get('hmde.bo.businessObject.showAllAssBo').d('显示此对象所有的关联对象'))), /*#__PURE__*/React.createElement(_Menu.Item, {
      onClick: () => handleHideBoAndAssociation(true)
    }, /*#__PURE__*/React.createElement(ItemA, null, intl.get('hmde.bo.businessObject.hideAllAssBo').d('隐藏此对象及其关联对象'))), /*#__PURE__*/React.createElement(_Menu.Item, {
      onClick: () => handleHideBoAndAssociation(false)
    }, /*#__PURE__*/React.createElement(ItemA, null, intl.get('hmde.bo.businessObject.hideSomeAssBo').d('仅隐藏此对象关联对象'))), /*#__PURE__*/React.createElement(_Menu.Item, {
      onClick: handleShowNonRelationalFields
    }, /*#__PURE__*/React.createElement(ItemA, null, isShowNonRelationalFields ? intl.get('hmde.bo.businessObject.hidden').d('隐藏') : intl.get('hmde.bo.businessObject.show').d('显示'), intl.get('hmde.bo.businessObject.noRelationalFields').d('非关系字段'))), /*#__PURE__*/React.createElement(_Divider, {
      style: {
        margin: 0,
        background: 'rgba(0,0,0,0.10)'
      }
    }), !isPreDomain && hasPermission && /*#__PURE__*/React.createElement(_Menu.Item, {
      onClick: handleCreateRelationField
    }, /*#__PURE__*/React.createElement(ItemA, null, intl.get('hmde.common.addField').d('新建字段'))), !isPreDomain && /*#__PURE__*/React.createElement(_Menu.Item, {
      onClick: handleBoPublish
    }, /*#__PURE__*/React.createElement(ItemA, null, intl.get('hmde.bo.businessObject.pubObject').d('发布业务对象'))), /*#__PURE__*/React.createElement(_Menu.Item, null, /*#__PURE__*/React.createElement(ItemA, {
      onClick: handleViewBODetail
    }, intl.get('hmde.bo.businessObject.viewObjDetails').d('查看对象详情'))));
  }, [isShowNonRelationalFields, hasPermission, isPreDomain]);
  return /*#__PURE__*/React.createElement("div", {
    className: classnames({
      [styles.wrapper]: true,
      [styles.selected]: isSelected
    }),
    style: {
      paddingBottom: ER_PADDING
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.title,
    style: {
      height: ER_TITLE_HEIGHT
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.name
  }, data.businessObjectName), /*#__PURE__*/React.createElement("div", {
    className: styles.extra
  }, /*#__PURE__*/React.createElement(Status, {
    publishStatus: data.publishStatus,
    isSelected: isSelected
  }), /*#__PURE__*/React.createElement(_Dropdown, {
    overlay: boMenu,
    trigger: ["click"]
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "settings-o",
    style: {
      cursor: 'pointer'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: styles.divider,
    style: {
      marginBottom: ER_PADDING
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: styles.list
  }, displayBusinessObjectFields.map(item => /*#__PURE__*/React.createElement(Field, {
    key: item.businessObjectFieldId,
    businessObjectField: item,
    fieldType: BO_FIELD_TYPE,
    data: data
  }))), displayBusinessObjectAssociateList.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: styles.dashed
  }), /*#__PURE__*/React.createElement("div", {
    className: styles.list
  }, displayBusinessObjectAssociateList.map(item => /*#__PURE__*/React.createElement(Associate, {
    key: item.associateBusinessObjectId,
    associate: item,
    fieldType: BO_RELATION_TYPE,
    data: data
  })))));
};
export default /*#__PURE__*/memo(ERNode, (prev, next) => {
  var _prev$node, _next$node;
  return !_isEqual((_prev$node = prev.node) === null || _prev$node === void 0 ? void 0 : _prev$node.getData(), (_next$node = next.node) === null || _next$node === void 0 ? void 0 : _next$node.getData());
});
// export default ERNode;