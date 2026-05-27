import _Dropdown from "@hzero-front-ui/c7n-ui/lib/DropdownPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _Menu from "@hzero-front-ui/c7n-ui/lib/MenuPro";
import React from 'react';
import { getCodeMeaning } from 'utils/utils';
import { Action } from 'choerodon-ui/lib/trigger/enum';
import { observer } from 'mobx-react-lite';
import { openTab } from 'utils/menuTab';
import intl from 'utils/intl';
import TextOverflow from "hzero-front-apaas/lib/components/TextOverflow";
import { ER_LINE_HEIGHT } from "../../constants/graph";
import styles from "./index.less?modules";
const TEXT_WIDTH = 100;
const FIELD_WIDTH = 65;
const Field = ({
  data,
  businessObjectField,
  fieldType
}) => {
  const businessObjectFieldName = businessObjectField.businessObjectFieldName,
    componentType = businessObjectField.componentType,
    requiredFlag = businessObjectField.requiredFlag;
  const handleViewFieldDetail = () => {
    const businessObjectId = data === null || data === void 0 ? void 0 : data.businessObjectId;
    if (businessObjectId) {
      openTab({
        key: `/hmde/business-object/detail/${businessObjectId}`,
        path: `/hmde/business-object/detail/${businessObjectId}`,
        closable: true,
        // tab 是否可以关闭
        title: data.businessObjectName,
        state: {
          businessObjectFieldCode: businessObjectField === null || businessObjectField === void 0 ? void 0 : businessObjectField.businessObjectFieldCode
        }
      });
    }
  };
  const fieldMenu = /*#__PURE__*/React.createElement(_Menu, {
    selectable: false
  }, /*#__PURE__*/React.createElement(_Menu.Item, null, /*#__PURE__*/React.createElement("a", {
    style: {
      fontSize: 12
    },
    onClick: handleViewFieldDetail
  }, intl.get('hmde.bo.businessObject.viewFieldDetails').d('查看字段详情'))));
  return /*#__PURE__*/React.createElement("div", {
    className: styles.field,
    style: {
      height: ER_LINE_HEIGHT
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.name
  }, /*#__PURE__*/React.createElement("span", {
    className: styles.require
  }, requiredFlag && '*'), /*#__PURE__*/React.createElement(TextOverflow, {
    text: businessObjectFieldName,
    width: TEXT_WIDTH,
    tooltipOptions: {
      placement: 'left'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.extra
  }, /*#__PURE__*/React.createElement(TextOverflow, {
    className: styles.type,
    text: getCodeMeaning(componentType, fieldType),
    width: FIELD_WIDTH
  }), /*#__PURE__*/React.createElement(_Dropdown, {
    overlay: fieldMenu,
    trigger: ["click"]
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "more_vert",
    style: {
      color: 'rgba(0,0,0,0.65)',
      marginLeft: 8,
      cursor: 'pointer'
    }
  }))));
};
export default observer(Field);