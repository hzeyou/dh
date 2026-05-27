import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Tabs from "@hzero-front-ui/c7n-ui/lib/Tabs";
import _extends from "@babel/runtime/helpers/esm/extends";
import _head from "lodash/head";
import _groupBy from "lodash/groupBy";
import _get from "lodash/get";
import React, { useState } from 'react';
import intl from 'utils/intl';
import { FuncType } from 'choerodon-ui/pro/lib/button/enum';
import classnames from 'classnames';
import { PublishStatus } from "hzero-front-apaas/lib/constants/businessObject";
import useThemeColor from "hzero-front-apaas/lib/hooks/useThemeColor";
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import { ReactComponent as IconBaseInfo } from "hzero-front-hmde/lib/assets/icon/bo_item_base.svg";
import { ReactComponent as IconFieldList } from "hzero-front-hmde/lib/assets/icon/bo_item_field.svg";
import { ReactComponent as IconRule } from "hzero-front-hmde/lib/assets/icon/bo_item_rule.svg";
import { ReactComponent as IconAdvancedRelationship } from "hzero-front-hmde/lib/assets/icon/bo_item_advance.svg";
import { ReactComponent as IconPermissionPolicy } from "hzero-front-hmde/lib/assets/icon/bo_item_permission.svg";
import { ReactComponent as IconPages } from "hzero-front-hmde/lib/assets/icon/bo_item_pages.svg";
import { ReactComponent as IconButtons } from "hzero-front-hmde/lib/assets/icon/bo_item_buttons.svg";
import { ReactComponent as IconEventFlow } from "hzero-front-hmde/lib/assets/icon/bo_item_event.svg";
import { ReactComponent as IconTemplate } from "hzero-front-hmde/lib/assets/icon/bo_item_template.svg";
import { ReactComponent as IconOptionList } from "hzero-front-hmde/lib/assets/icon/bo_item_option.svg";
import { ReactComponent as IconLineTrigger } from "hzero-front-hmde/lib/assets/icon/bo_item_trigger.svg";
import { ReactComponent as IconAuditEditItem } from "hzero-front-hmde/lib/assets/icon/bo_item_audit.svg";
import { ReactComponent as IconFoundationCommmonApi } from "hzero-front-hmde/lib/assets/icon/bo_item_foundation.svg";
import { ReactComponent as IconRelationDetail } from "hzero-front-hmde/lib/assets/icon/bo_item_relation.svg";
import { ReactComponent as IconSql } from "hzero-front-hmde/lib/assets/icon/bo_item_sql.svg";
import FloatBusinessObjectBar from "./FloatBusinessObjectBar";
import styles from "./index.less?modules";
export let TAB_KEYS = /*#__PURE__*/function (TAB_KEYS) {
  TAB_KEYS["baseInfo"] = "baseInfo";
  TAB_KEYS["fieldList"] = "fieldList";
  TAB_KEYS["optionList"] = "optionList";
  TAB_KEYS["pages"] = "pages";
  TAB_KEYS["template"] = "template";
  TAB_KEYS["buttons"] = "buttons";
  TAB_KEYS["rules"] = "rules";
  TAB_KEYS["eventFlow"] = "eventFlow";
  TAB_KEYS["advancedRelationship"] = "advancedRelationship";
  TAB_KEYS["permissionPolicy"] = "permissionPolicy";
  TAB_KEYS["relationDetail"] = "relationDetail";
  TAB_KEYS["commmonApi"] = "commmonApi";
  TAB_KEYS["lineTrigger"] = "lineTrigger";
  TAB_KEYS["auditEditItem"] = "auditEditItem";
  TAB_KEYS["foundationCommmonApi"] = "foundationCommmonApi";
  TAB_KEYS["sql"] = "sql";
  return TAB_KEYS;
}({}); // sql 维护
const tabIcon = {
  [TAB_KEYS.baseInfo]: /*#__PURE__*/React.createElement(IconBaseInfo, null),
  [TAB_KEYS.fieldList]: /*#__PURE__*/React.createElement(IconFieldList, null),
  [TAB_KEYS.rules]: /*#__PURE__*/React.createElement(IconRule, null),
  [TAB_KEYS.advancedRelationship]: /*#__PURE__*/React.createElement(IconAdvancedRelationship, null),
  [TAB_KEYS.permissionPolicy]: /*#__PURE__*/React.createElement(IconPermissionPolicy, null),
  [TAB_KEYS.pages]: /*#__PURE__*/React.createElement(IconPages, null),
  [TAB_KEYS.buttons]: /*#__PURE__*/React.createElement(IconButtons, null),
  [TAB_KEYS.eventFlow]: /*#__PURE__*/React.createElement(IconEventFlow, null),
  [TAB_KEYS.template]: /*#__PURE__*/React.createElement(IconTemplate, null),
  [TAB_KEYS.optionList]: /*#__PURE__*/React.createElement(IconOptionList, null),
  [TAB_KEYS.lineTrigger]: /*#__PURE__*/React.createElement(IconLineTrigger, null),
  [TAB_KEYS.auditEditItem]: /*#__PURE__*/React.createElement(IconAuditEditItem, null),
  [TAB_KEYS.foundationCommmonApi]: /*#__PURE__*/React.createElement(IconFoundationCommmonApi, null),
  [TAB_KEYS.relationDetail]: /*#__PURE__*/React.createElement(IconRelationDetail, null),
  [TAB_KEYS.commmonApi]: /*#__PURE__*/React.createElement(IconFoundationCommmonApi, null),
  [TAB_KEYS.sql]: /*#__PURE__*/React.createElement(IconSql, null)
};
export let GROUP_KEYS = /*#__PURE__*/function (GROUP_KEYS) {
  GROUP_KEYS["objectModel"] = "objectModel";
  GROUP_KEYS["objectInteractive"] = "objectInteractive";
  GROUP_KEYS["objectResource"] = "objectResource";
  GROUP_KEYS["unKnow"] = "unKnow";
  return GROUP_KEYS;
}({});
export const statusList = () => [{
  status: PublishStatus.PUBLISHED,
  color: 'green',
  text: intl.get('hmde.common.status.published').d('已发布')
}, {
  status: PublishStatus.MODIFIED,
  color: 'yellow',
  text: intl.get('hmde.common.status.modified').d('已修改')
}, {
  status: PublishStatus.UNPUBLISHED,
  text: intl.get('hmde.common.status.unpublished').d('未发布')
}];

// 分组依据
const groupMap = () => ({
  [GROUP_KEYS.objectModel]: {
    order: 0,
    key: GROUP_KEYS.objectModel,
    groupName: intl.get('hmde.bo.businessObject.objectModel').d('对象模型'),
    groupKeys: [TAB_KEYS.sql, TAB_KEYS.baseInfo, TAB_KEYS.fieldList, TAB_KEYS.commmonApi, TAB_KEYS.rules, TAB_KEYS.advancedRelationship, TAB_KEYS.permissionPolicy, TAB_KEYS.relationDetail]
  },
  [GROUP_KEYS.objectInteractive]: {
    order: 1,
    key: GROUP_KEYS.objectInteractive,
    groupName: intl.get('hmde.bo.businessObject.objectInteractive').d('对象交互'),
    groupKeys: [TAB_KEYS.pages, TAB_KEYS.buttons, TAB_KEYS.eventFlow, TAB_KEYS.template]
  },
  [GROUP_KEYS.objectResource]: {
    order: 2,
    key: GROUP_KEYS.objectResource,
    groupName: intl.get('hmde.bo.businessObject.objectResource').d('对象资源'),
    groupKeys: [TAB_KEYS.optionList, TAB_KEYS.lineTrigger, TAB_KEYS.auditEditItem, TAB_KEYS.foundationCommmonApi]
  }
});
export const TabPaneRender = ({
  tabKey,
  props,
  title,
  visible = true,
  children
}) => {
  if (!visible) return null;
  return /*#__PURE__*/React.createElement(_Tabs.TabPane, _extends({}, props, {
    tab: title,
    key: tabKey
  }), /*#__PURE__*/React.createElement("div", {
    className: styles['panel-layout-container']
  }, children));
};
const NORMAL_COLOR = '#595959';
export default function TabTitleList({
  tabPaneList,
  activeKey,
  tabItemClick,
  baseInfoDS,
  domainId,
  history,
  match,
  readOnlyFlag
}) {
  var _baseInfoDS$current, _baseInfoDS$current2;
  const _useThemeColor = useThemeColor(),
    primary = _useThemeColor.primary;
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isCollapsed = _useState2[0],
    setIsCollapsed = _useState2[1];
  const _useState3 = useState(''),
    _useState4 = _slicedToArray(_useState3, 2),
    hoverItemKey = _useState4[0],
    setHoverItemKey = _useState4[1];
  const onMouseEnter = key => {
    setHoverItemKey(key);
  };
  const onMouseLeave = () => {
    setHoverItemKey('');
  };
  const renderSwitchIcon = (icon, text) => {
    return isCollapsed ? icon : [icon, text];
  };

  // 给 Tabs 分组
  const tabItemRender = () => {
    const groupObj = _groupBy(tabPaneList, ({
      tabKey
    }) => {
      if (groupMap()[GROUP_KEYS.objectModel].groupKeys.indexOf(tabKey) > -1) {
        return GROUP_KEYS.objectModel;
      } else if (groupMap()[GROUP_KEYS.objectInteractive].groupKeys.indexOf(tabKey) > -1) {
        return GROUP_KEYS.objectInteractive;
      } else if (groupMap()[GROUP_KEYS.objectResource].groupKeys.indexOf(tabKey) > -1) {
        return GROUP_KEYS.objectResource;
      } else {
        // unKnow 组的数据不会被渲染到页面上
        return GROUP_KEYS.unKnow;
      }
    });
    const renderIcon = (tabItem, iconStyle) => {
      let element = /*#__PURE__*/React.createElement("span", {
        className: styles.icon,
        style: iconStyle
      }, tabIcon[tabItem.tabKey]);
      if (isCollapsed) {
        element = /*#__PURE__*/React.createElement(_Tooltip, {
          title: tabItem.title
        }, element);
      }
      return element;
    };
    const renderAGroupOfItem = list => list.map(tabItem => {
      let content = tabItem === null || tabItem === void 0 ? void 0 : tabItem.title;
      const activeFlag = activeKey === tabItem.tabKey;
      if (activeFlag) {
        content = /*#__PURE__*/React.createElement("a", {
          onClick: e => e.preventDefault()
        }, content, /*#__PURE__*/React.createElement("span", {
          style: {
            background: primary
          }
        }));
      }
      const iconStyle = {
        marginRight: isCollapsed ? 0 : 8
      };
      if (activeFlag) {
        iconStyle.color = primary;
      }
      return /*#__PURE__*/React.createElement("div", {
        key: tabItem.tabKey,
        className: styles['sb-tab-item'],
        onMouseEnter: () => onMouseEnter(tabItem.tabKey),
        onMouseLeave: () => onMouseLeave(),
        style: activeFlag || hoverItemKey === tabItem.tabKey ? {
          color: primary
        } : {
          color: NORMAL_COLOR
        },
        onClick: () => {
          if (activeKey !== tabItem.tabKey) {
            tabItemClick(tabItem.tabKey, tabItem);
          }
        }
      }, renderSwitchIcon(renderIcon(tabItem, iconStyle), content), activeFlag && /*#__PURE__*/React.createElement("div", {
        className: styles['active-line'],
        style: {
          backgroundColor: primary
        }
      }));
    });
    return Object.keys(groupObj).filter(k => k !== GROUP_KEYS.unKnow) // unKnow 组的数据不会被渲染到页面上
    .sort((a, b) => groupMap()[a].order - groupMap()[b].order).slice(0, readOnlyFlag ? 1 : undefined) // 只读状态下，只显示对象模型的基本信息
    .map(key => {
      if (!groupObj[key].length) return null;
      return /*#__PURE__*/React.createElement("div", {
        key: key,
        className: styles['tab-a-group']
      }, !isCollapsed && /*#__PURE__*/React.createElement("div", {
        className: styles['sb-title']
      }, groupMap()[key].groupName), /*#__PURE__*/React.createElement("div", null, renderAGroupOfItem(groupObj[key])));
    });
  };

  // 渲染中间对象的标识
  const renderMiddleObjFlag = () => {
    const flag = _get(_head(baseInfoDS.toData()), ['businessObjectCategory']);
    switch (flag) {
      case 'MIDDLE':
        return /*#__PURE__*/React.createElement(_Tooltip, {
          title: intl.get('hmde.bo.businessObject.middle').d('中间对象')
        }, /*#__PURE__*/React.createElement(ImgIcon, {
          name: "middleObject.svg",
          size: 14,
          style: {
            marginRight: '5px'
          }
        }));
      case 'STANDARD':
        return /*#__PURE__*/React.createElement(_Tooltip, {
          title: intl.get('hmde.bo.businessObject.standard').d('基础对象')
        }, /*#__PURE__*/React.createElement(ImgIcon, {
          name: "baseObject.svg",
          size: 14,
          style: {
            marginRight: '5px'
          }
        }));
      case 'DIMENSION':
        return /*#__PURE__*/React.createElement(_Tooltip, {
          title: intl.get('hmde.common.paramObj').d('参数对象')
        }, /*#__PURE__*/React.createElement(ImgIcon, {
          name: "paramObject.svg",
          size: 14,
          style: {
            marginRight: '5px'
          }
        }));
      default:
        break;
    }
    return null;
  };
  const handleSwitchCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles['sb-tab-nav'],
    style: {
      flexBasis: isCollapsed ? '48px' : '150px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['sb-object-name']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['object-text'],
    style: {
      marginLeft: isCollapsed ? 15 : 0
    }
  }, !isCollapsed && /*#__PURE__*/React.createElement("h3", null, renderMiddleObjFlag(), /*#__PURE__*/React.createElement(_Tooltip, {
    title: (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.getPristineValue('businessObjectName')
  }, (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : _baseInfoDS$current2.getPristineValue('businessObjectName'))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FloatBusinessObjectBar, {
    domainId: domainId,
    statusList: statusList(),
    history: history,
    match: match
  })))), /*#__PURE__*/React.createElement("div", {
    className: classnames({
      [styles['tab-group-wrap']]: true,
      [styles['tab-group-scroll']]: isCollapsed
    })
  }, tabItemRender()), /*#__PURE__*/React.createElement("div", {
    className: styles['switch-area']
  }, /*#__PURE__*/React.createElement(_Button, {
    onClick: handleSwitchCollapsed,
    icon: isCollapsed ? 'caidanzhankai' : 'caidanzhedie',
    funcType: "link"
  })));
}