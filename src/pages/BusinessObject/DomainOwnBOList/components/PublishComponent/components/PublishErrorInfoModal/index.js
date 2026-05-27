import _extends from "@babel/runtime/helpers/esm/extends";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Tabs from "@hzero-front-ui/c7n-ui/lib/Tabs";
import _noop from "lodash/noop";
import _isFunction from "lodash/isFunction";
// 当前业务对象字段与关联物理模型或扩展物理模型存在差异 则弹出提示警告报错框

import React, { useState, useMemo, useEffect } from 'react';
import intl from 'utils/intl';
import { observer } from 'mobx-react-lite';
import { TabsType } from 'choerodon-ui/lib/tabs/enum';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import ErrorInfoTable from "./ErrorInfoTable";
import errorTableDS from "./errorTableDS";
const TabPane = _Tabs.TabPane;
const PublishWarning = ({
  dataSource = [],
  publicObjectSave = _noop,
  cb = _noop,
  _extendList,
  modal
}) => {
  const _useState = useState('error'),
    _useState2 = _slicedToArray(_useState, 2),
    activeKey = _useState2[0],
    setActiveKey = _useState2[1];
  const tableDataObj = useMemo(() => {
    const errorList = dataSource.filter(i => (i === null || i === void 0 ? void 0 : i.errorLevel) === 'ERROR' || (i === null || i === void 0 ? void 0 : i.level) === 'ERROR');
    const warningList = dataSource.filter(i => (i === null || i === void 0 ? void 0 : i.errorLevel) === 'WARNING' || (i === null || i === void 0 ? void 0 : i.level) === 'WARNING');
    return {
      errorList,
      warningList
    };
  }, [dataSource]);
  const errorTableDs = useMemo(() => new _DataSet(errorTableDS(tableDataObj === null || tableDataObj === void 0 ? void 0 : tableDataObj.errorList)), []);
  const warnTableDs = useMemo(() => new _DataSet(errorTableDS(tableDataObj === null || tableDataObj === void 0 ? void 0 : tableDataObj.warningList)), []);
  useEffect(() => {
    if (activeKey === 'error') {
      modal === null || modal === void 0 ? void 0 : modal.update({
        footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Button, {
          color: "primary",
          onClick: () => {
            modal.close();
          }
        }, intl.get('hmde.common.button.cancel').d('取消')), /*#__PURE__*/React.createElement(_Button, {
          color: "primary",
          disabled: errorTableDs.length !== 0,
          onClick: () => {
            if (_isFunction(cb)) {
              publicObjectSave === null || publicObjectSave === void 0 ? void 0 : publicObjectSave(cb, _extendList, false);
            }
            modal.close();
          }
        }, intl.get('hmde.common.publish').d('发布')))
      });
    }
  }, [activeKey, errorTableDs.length]);
  const warningTableInfoProps = {
    activeKey
  };
  const onChange = val => {
    setActiveKey(val);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Tabs, {
    onChange: onChange,
    type: "card"
  }, /*#__PURE__*/React.createElement(TabPane, {
    tab: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(ImgIcon, {
      name: "executed-failed.svg",
      style: {
        marginRight: 4
      },
      size: 14
    }), "\u5931\u8D25\uFF08", errorTableDs === null || errorTableDs === void 0 ? void 0 : errorTableDs.length, "\uFF09"),
    key: "error"
  }, /*#__PURE__*/React.createElement(ErrorInfoTable, _extends({}, warningTableInfoProps, {
    tableDs: errorTableDs
  }))), /*#__PURE__*/React.createElement(TabPane, {
    tab: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(ImgIcon, {
      name: "warning.svg",
      style: {
        marginRight: 4
      },
      size: 14
    }), intl.get('hmde.common.view.title.warn').d('警告'), "\uFF08", warnTableDs === null || warnTableDs === void 0 ? void 0 : warnTableDs.length, "\uFF09"),
    key: "warning"
  }, /*#__PURE__*/React.createElement(ErrorInfoTable, _extends({}, warningTableInfoProps, {
    tableDs: warnTableDs
  })))));
};
export default observer(PublishWarning);