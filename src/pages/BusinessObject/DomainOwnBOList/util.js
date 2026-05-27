import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import React from "react";
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-param-reassign */
import request from 'utils/request';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { openTab } from 'utils/menuTab';
import { lowcodeOrganizationURL } from "hzero-front-apaas/lib/utils/common";
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import qs from 'qs';

// 配置导出
export const handleConfigExport = () => {
  request(`${lowcodeOrganizationURL({
    route: HZERO_HMDE
  })}/business-objects-export-templates/download`, {
    method: 'PUT',
    // params: { businessObjectExportTemplateId },
    data: []
  }).then(res => {
    if (getResponse(res)) {
      notification.success({
        description: /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.exportTemplate.tip.tip').d('异步导出任务已提交，请至'), /*#__PURE__*/React.createElement("a", {
          onClick: () => {
            openTab({
              key: `/hmsg/user-message/list`,
              // 打开 tab 的 key
              path: `/hmsg/user-message/list`,
              // 打开页面的path
              title: intl.get('hmde.bo.exportTemplate.tip.news').d('站内消息'),
              // tab的标题
              search: qs.stringify({
                tabKey: 'exportHistory'
              }),
              closable: true // tab 是否可以关闭
            });
            '';
          }
        }, intl.get('hmde.bo.exportTemplate.tip.news').d('站内消息'), " ", '>', intl.get('hmde.bo.exportTemplate.tip.exportHistory').d('导出记录')), ' ', intl.get('hmde.common.lookup').d('查看'))
      });
    }
  });
};
export const getBoCategoryHelp = boType => {
  switch (boType) {
    case 'STANDARD':
      return /*#__PURE__*/React.createElement(_Tooltip, {
        title: intl.get('hmde.bo.businessObject.baseObjectTypeTip').d(`承载具体业务属性集合的基本业务实体，组合部分包括字段、业务规则、关系、权限等。`),
        placement: "top"
      }, /*#__PURE__*/React.createElement(_Icon, {
        type: "info_outline",
        style: {
          margin: '-3px 0px 0px 2px'
        }
      }));
    case 'MIDDLE':
      return /*#__PURE__*/React.createElement(_Tooltip, {
        title: intl.get('hmde.bo.businessObject.middleObjectTypeTip').d(`用于存储两个对象之间多对多关系的关联数据。`),
        placement: "top"
      }, /*#__PURE__*/React.createElement(_Icon, {
        type: "info_outline",
        style: {
          margin: '-3px 0px 0px 2px'
        }
      }));
    case 'DIMENSION':
      return /*#__PURE__*/React.createElement(_Tooltip, {
        title: intl.get('hmde.bo.businessObject.paramObjectTypeTip').d(`维护与管理系统级参数，通常用于封装与特定功能或业务逻辑相关的多个参数，以便在不同功能之间传递和使用。`),
        placement: "top"
      }, /*#__PURE__*/React.createElement(_Icon, {
        type: "info_outline",
        style: {
          margin: '-3px 0px 0px 2px'
        }
      }));
    default:
      return '';
  }
};