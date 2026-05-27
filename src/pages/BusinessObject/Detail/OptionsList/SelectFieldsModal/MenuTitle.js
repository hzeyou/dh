import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import React, { useMemo, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useDrag } from 'react-dnd';
import intl from 'utils/intl';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
const MASTER_SLAVE = 'MASTER_SLAVE',
  REL_MASTER_SLAVE =
  // 普通主从(relateType)
  'REL_MASTER_SLAVE',
  SLAVE_MASTER =
  // 高级关系主从
  'SLAVE_MASTER',
  MASTER_RELATION =
  // 高级从主关系
  'MASTER_RELATION',
  LINK =
  // 普通从主关系
  'LINK',
  LINK_RELATION =
  // 高级关联关系
  'LINK_RELATION' // 普通关联关系
;
const getRelateType = currentNodeData => {
  const type = (currentNodeData === null || currentNodeData === void 0 ? void 0 : currentNodeData.relateType) || (currentNodeData === null || currentNodeData === void 0 ? void 0 : currentNodeData.componentType) || (currentNodeData === null || currentNodeData === void 0 ? void 0 : currentNodeData.associateType);
  let iconName = '';
  let title = '';
  const preTitle = `${intl.get('hmde.common.advancedRelationship').d('高级关系')}-`;
  switch (type) {
    case SLAVE_MASTER:
    case MASTER_RELATION:
      iconName = currentNodeData !== null && currentNodeData !== void 0 && currentNodeData.associateType ? 'gaojicongzhu.svg' : 'bocCongZhu.svg';
      title = intl.get('hmde.common.slaveMaster').d('从主');
      break;
    case MASTER_SLAVE:
    case REL_MASTER_SLAVE:
      iconName = currentNodeData !== null && currentNodeData !== void 0 && currentNodeData.associateType ? 'gaojizhucong.svg' : 'bocZhuCong.svg';
      title = intl.get('hmde.common.masterSlave').d('主从');
      break;
    case LINK:
    case LINK_RELATION:
      iconName = currentNodeData !== null && currentNodeData !== void 0 && currentNodeData.associateType ? 'gaojiguanlian.svg' : 'bocGuanLian.svg';
      title = intl.get('hmde.common.link').d('关联');
      break;
    default:
      iconName = currentNodeData !== null && currentNodeData !== void 0 && currentNodeData.associateType ? 'gaojizhucong.svg' : 'bocZhu.svg';
      title = intl.get('hmde.common.master').d('主');
      break;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Tooltip, {
    title: currentNodeData !== null && currentNodeData !== void 0 && currentNodeData.associateType ? preTitle + title : title
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: iconName,
    size: 16,
    style: {
      marginRight: 4
    }
  })), (currentNodeData === null || currentNodeData === void 0 ? void 0 : currentNodeData.associateType) && preTitle);
};
function getStyle(isDragging) {
  return isDragging ? {
    background: '#ffffff',
    boxShadow: '-1px 1px 4px 0 #c1d1f2'
  } : {};
}
export default observer(({
  currentNodeData,
  dataSet,
  errorMessage
}) => {
  const upDateRef = useRef();
  const _useDrag = useDrag({
      item: {
        type: 'field',
        field: currentNodeData
      },
      canDrag: () => !isHiddenIndicator,
      end(item, monitor) {
        const dropResult = monitor.getDropResult();
        if (item && dropResult) {
          dropResult.callback(currentNodeData);
        }
      },
      collect: monitor => ({
        isDragging: monitor.isDragging()
      })
    }),
    _useDrag2 = _slicedToArray(_useDrag, 2),
    isDragging = _useDrag2[0].isDragging,
    drag = _useDrag2[1];
  const dragStyle = getStyle(isDragging);
  useDataSetEvents(dataSet, ['remove', 'create'], [({
    records
  }) => {
    var _records$;
    if ((records === null || records === void 0 ? void 0 : (_records$ = records[0]) === null || _records$ === void 0 ? void 0 : _records$.get('uuid')) === currentNodeData.uuid) {
      upDateRef.current = +new Date();
    }
  }, ({
    record
  }) => {
    if ((record === null || record === void 0 ? void 0 : record.get('uuid')) === currentNodeData.uuid) {
      upDateRef.current = +new Date();
    }
  }]);
  const isHiddenIndicator = useMemo(() => {
    return !(currentNodeData !== null && currentNodeData !== void 0 && currentNodeData.drillFlag) || dataSet.some(record => {
      if (record !== null && record !== void 0 && record.get('fieldPath') && (record === null || record === void 0 ? void 0 : record.get('fieldPath')) === currentNodeData._fieldPath) {
        (record === null || record === void 0 ? void 0 : record.get('uuid')) !== currentNodeData.uuid && (record === null || record === void 0 ? void 0 : record.set('uuid', currentNodeData.uuid));
        return true;
      } else if (`${record === null || record === void 0 ? void 0 : record.get('businessObjectCode')}.${record === null || record === void 0 ? void 0 : record.get('businessObjectFieldCode')}.${record === null || record === void 0 ? void 0 : record.get('parentId')}` === `${currentNodeData === null || currentNodeData === void 0 ? void 0 : currentNodeData.businessObjectCode}.${currentNodeData === null || currentNodeData === void 0 ? void 0 : currentNodeData.businessObjectFieldCode}.${currentNodeData === null || currentNodeData === void 0 ? void 0 : currentNodeData.parentId}`) {
        (record === null || record === void 0 ? void 0 : record.get('uuid')) !== currentNodeData.uuid && (record === null || record === void 0 ? void 0 : record.set('uuid', currentNodeData.uuid));
        return true;
      }
      return false;
    });
  }, [upDateRef === null || upDateRef === void 0 ? void 0 : upDateRef.current]);
  const isShowRelateType = [MASTER_RELATION, LINK_RELATION].includes(currentNodeData === null || currentNodeData === void 0 ? void 0 : currentNodeData.componentType) || (currentNodeData === null || currentNodeData === void 0 ? void 0 : currentNodeData.associateType);
  return errorMessage ? /*#__PURE__*/React.createElement(_Tooltip, {
    title: errorMessage,
    placement: "right"
  }, /*#__PURE__*/React.createElement("div", {
    ref: drag,
    style: {
      userSelect: 'none',
      whiteSpace: 'nowrap',
      borderRadius: 2,
      padding: '0 4px',
      transition: 'all .3s',
      ...dragStyle
    }
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "drag_indicator_black.svg",
    size: 14,
    style: {
      visibility: isHiddenIndicator ? 'hidden' : 'visible',
      display: isHiddenIndicator && isShowRelateType ? 'none' : 'inline-block'
    }
  }), isShowRelateType && getRelateType(currentNodeData), /*#__PURE__*/React.createElement("span", null, (currentNodeData === null || currentNodeData === void 0 ? void 0 : currentNodeData.businessObjectFieldName) || (currentNodeData === null || currentNodeData === void 0 ? void 0 : currentNodeData.associateName)))) : /*#__PURE__*/React.createElement("div", {
    ref: drag,
    style: {
      userSelect: 'none',
      whiteSpace: 'nowrap',
      borderRadius: 2,
      padding: '0 4px',
      transition: 'all .3s',
      ...dragStyle
    }
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "drag_indicator_black.svg",
    size: 14,
    style: {
      visibility: isHiddenIndicator ? 'hidden' : 'visible',
      display: isHiddenIndicator && isShowRelateType ? 'none' : 'inline-block'
    }
  }), isShowRelateType && getRelateType(currentNodeData), /*#__PURE__*/React.createElement("span", null, (currentNodeData === null || currentNodeData === void 0 ? void 0 : currentNodeData.businessObjectFieldName) || (currentNodeData === null || currentNodeData === void 0 ? void 0 : currentNodeData.associateName)));
});