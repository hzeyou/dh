import _Dropdown from "@hzero-front-ui/c7n-ui/lib/DropdownPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Menu from "@hzero-front-ui/c7n-ui/lib/MenuPro";
import React from 'react';
import { getCodeMeaning } from 'utils/utils';
import { Action } from 'choerodon-ui/lib/trigger/enum';
import { observer } from 'mobx-react-lite';
import { openTab } from 'utils/menuTab';
import intl from 'utils/intl';
import { isTextEllipsis } from 'hzero-front-apaas/lib/utils/common';
import { TAB_KEYS } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/TabItemList";
import { ER_LINE_HEIGHT } from "../../constants/graph";
import styles from "./index.less?modules";
const TEXT_WIDTH = 100;
const Associate = ({
  data,
  associate,
  fieldType
}) => {
  const associateName = associate.associateName,
    associateType = associate.associateType,
    associateCode = associate.associateCode;
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
          originKey: TAB_KEYS.advancedRelationship,
          associateCode
        }
      });
    }
  };
  const fieldMenu = /*#__PURE__*/React.createElement(_Menu, {
    selectable: false,
    className: styles.menu
  }, /*#__PURE__*/React.createElement(_Menu.Item, null, /*#__PURE__*/React.createElement("a", {
    style: {
      fontSize: 12
    },
    onClick: handleViewFieldDetail
  }, intl.get('hmde.bo.businessObject.viewRelationshipDetails').d('查看关系详情'))));
  const renderText = () => {
    const isShowTip = isTextEllipsis(associateName, TEXT_WIDTH);
    const textDom = /*#__PURE__*/React.createElement("span", {
      style: {
        width: TEXT_WIDTH
      },
      className: styles.text
    }, associateName);
    if (isShowTip) {
      return /*#__PURE__*/React.createElement(_Tooltip, {
        placement: "left",
        title: associateName,
        theme: "light"
      }, textDom);
    } else {
      return textDom;
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles.field,
    style: {
      height: ER_LINE_HEIGHT
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.name
  }, /*#__PURE__*/React.createElement("span", {
    className: styles.require
  }), renderText()), /*#__PURE__*/React.createElement("div", {
    className: styles.extra
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.type
  }, getCodeMeaning(associateType, fieldType)), /*#__PURE__*/React.createElement(_Dropdown, {
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
export default observer(Associate);