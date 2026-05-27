import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import React, { useEffect, useMemo } from 'react';
// import { TableMode } from 'choerodon-ui/pro/lib/table/enum';
import intl from 'utils/intl';
import { Tooltip as ToolTipEnum } from 'choerodon-ui/pro/lib/core/enum';
import { SelectionMode, TableQueryBarType } from 'choerodon-ui/pro/lib/table/enum';
import { getCurrentUser } from 'utils/utils';
import { PublishStatus } from "hzero-front-apaas/lib/constants/businessObject";
import mobileIcon from "hzero-front-hmde/lib/routes/BusinessObject/Detail/CompTemplate/assets/icon/mobile_icon.svg";
import pcIcon from "hzero-front-hmde/lib/routes/BusinessObject/Detail/CompTemplate/assets/icon/pc_icon.svg";
import pageLock from "hzero-front-hmde/lib/routes/BusinessObject/Detail/CompTemplate/assets/icon/page_lock.svg";
import { publishStatusRender } from "../common";
import { platformType } from "../../commonCode";
import { PublishPageDS } from "../AddNewPageLayout/ds";
const PublishPageTable = ({
  businessObjectCode,
  domainId,
  data,
  handleSaveCheckPage,
  isPublished
}) => {
  const publishPageDS = useMemo(() => new _DataSet({
    ...PublishPageDS(businessObjectCode, domainId),
    events: {
      batchSelect: ({
        dataSet
      }) => {
        onCheck(dataSet.selected);
      },
      batchUnSelect: ({
        dataSet
      }) => {
        onCheck(dataSet.selected);
      }
    }
  }), []);
  useEffect(() => {
    publishPageDS.loadData(data);
  }, []);
  const columns = useMemo(() => {
    return [{
      name: 'pageName',
      width: 100,
      renderer: ({
        value,
        record
      }) => {
        return /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'center'
          }
        }, /*#__PURE__*/React.createElement("span", null, value), !(record !== null && record !== void 0 && record.selectable) && /*#__PURE__*/React.createElement(_Tooltip, {
          title: intl.get('hmde.bo.businessObject.pageLock', {
            userName: record === null || record === void 0 ? void 0 : record.get('lockByName')
          }).d('页面已被{userName}锁定')
        }, /*#__PURE__*/React.createElement("img", {
          style: {
            height: '14px',
            marginLeft: '6px'
          },
          src: pageLock,
          alt: "icon"
        })));
      }
    }, {
      name: 'pageCode',
      width: 250
    }, {
      name: 'platform',
      width: 100,
      renderer: ({
        value
      }) => {
        if (value === platformType.MOBILE) {
          return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("img", {
            style: {
              height: '14px',
              marginRight: '6px'
            },
            src: mobileIcon,
            alt: "icon"
          }), intl.get('hmde.common.platformMobile').d('移动端'));
        }
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("img", {
          style: {
            height: '14px',
            marginRight: '6px'
          },
          src: pcIcon,
          alt: "icon"
        }), intl.get('hmde.common.platformPc').d('PC端'));
      }
    }, {
      name: 'publishStatus',
      width: 100,
      tooltip: ToolTipEnum.overflow,
      renderer: publishStatusRender
    }];
  }, []);

  // 默认选择全部
  useEffect(() => {
    if (isPublished) return;
    const defaultCheckedRecords = publishPageDS === null || publishPageDS === void 0 ? void 0 : publishPageDS.filter(record => {
      var _getCurrentUser;
      return (!record.get('lockedFlag') || record.get('lockedFlag') && record.get('lockedBy') === ((_getCurrentUser = getCurrentUser()) === null || _getCurrentUser === void 0 ? void 0 : _getCurrentUser.id)) && [PublishStatus.MODIFIED, PublishStatus.UNPUBLISHED].includes(record.get('publishStatus'));
    });
    const disabledSelectRecords = publishPageDS === null || publishPageDS === void 0 ? void 0 : publishPageDS.filter(record => {
      var _getCurrentUser2;
      return record.get('lockedFlag') && record.get('lockedBy') !== ((_getCurrentUser2 = getCurrentUser()) === null || _getCurrentUser2 === void 0 ? void 0 : _getCurrentUser2.id);
    });
    if (disabledSelectRecords !== null && disabledSelectRecords !== void 0 && disabledSelectRecords.length) {
      disabledSelectRecords.forEach(r => {
        Object.assign(r, {
          selectable: false
        });
      });
    }
    if (defaultCheckedRecords !== null && defaultCheckedRecords !== void 0 && defaultCheckedRecords.length) {
      publishPageDS.batchSelect(defaultCheckedRecords);
      onCheck(defaultCheckedRecords);
    }
  }, [data]);
  const onCheck = selectedRecords => {
    const currentCheckedKeys = selectedRecords.map(record => {
      return record.toData();
    });
    if (handleSaveCheckPage) handleSaveCheckPage(currentCheckedKeys);
  };
  return /*#__PURE__*/React.createElement(_Table, {
    key: "tenantId"
    // mode={TableMode.tree}
    ,
    selectionMode: isPublished ? "none" : "rowbox",
    pagination: false,
    queryBar: isPublished ? "none" : "filterBar",
    queryBarProps: {
      fuzzyQuery: false,
      queryFieldsLimit: 4
    },
    dataSet: publishPageDS,
    columns: columns,
    highLightRow: false
  });
};
export default PublishPageTable;