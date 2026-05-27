import _Pagination from "@hzero-front-ui/c7n-ui/lib/PaginationPro";
import _extends from "@babel/runtime/helpers/esm/extends";
import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _isArray from "lodash/isArray";
import _isUndefined from "lodash/isUndefined";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useDataSet, useDataSetEvent } from 'utils/hooks';
import intl from 'utils/intl';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { TableMode } from 'choerodon-ui/pro/lib/table/enum';
import { PublishStatus } from "hzero-front-apaas/lib/constants/businessObject";
import { toJS } from 'mobx';
import { useObserver } from 'mobx-react';
import { toTree } from "hzero-front-hmde/lib/utils/treeUtils";
import { FieldsNameTypes, SelectedDistributeDS } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionDistributeDS";
import { FieldsNameTypes as PolicyFieldsNameTypes } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionPolicyDS";
import { organizationTreeToArray } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/PermissionPolicy/utils/tree";
import PermissionPolicyDS, { DsStatus } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionPolicyDS";
import useDataSetLoadFirst from "hzero-front-hmde/lib/hooks/useDataSetLoadFirst";
import Empty from "../../../Empty";
import styles from "./index.less?modules";
const RangeContent = /*#__PURE__*/forwardRef(({
  record,
  handleDistributeRange
}, ref) => {
  const selectedDistributeDS = useDataSet(() => new _DataSet(SelectedDistributeDS(true)));
  const _useState = useState({
      total: 0,
      pageSize: 10,
      page: 1
    }),
    _useState2 = _slicedToArray(_useState, 2),
    pageData = _useState2[0],
    setPageData = _useState2[1];
  const _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    hasInitPageData = _useState4[0],
    setHasInitPageData = _useState4[1];
  const tableDataRef = useRef({});
  const publishStatus = record === null || record === void 0 ? void 0 : record.get('publishStatus');
  const distributePermissionDs = useDataSet(() => new _DataSet(PermissionPolicyDS({
    status: publishStatus === PublishStatus.MODIFIED ? DsStatus.MODIFIED : DsStatus.NORMAL
  })));
  useImperativeHandle(ref, () => {
    return {
      distributePermissionDs
    };
  }, [distributePermissionDs]);
  useEffect(() => {
    selectedDistributeDS.setQueryParameter('groupId', record === null || record === void 0 ? void 0 : record.get('groupId'));
    selectedDistributeDS.setQueryParameter('allowAllTenantFlag', record === null || record === void 0 ? void 0 : record.get('allowAllTenantFlag'));
    selectedDistributeDS.query();
  }, []);
  useDataSetLoadFirst(selectedDistributeDS, ({
    dataSet
  }) => {
    const res = dataSet.toData();
    if (_isArray(res) && res.length) {
      setHasInitPageData(true);
      const arr = toTree(res, 'id', 'tenantId').filter(v => _isUndefined(v.tenantId));
      tableDataRef.current = {
        totalElements: arr.length,
        content: arr
      };
    }
  });
  useDataSetEvent(selectedDistributeDS, 'load', ({
    dataSet
  }) => {
    const res = dataSet.toData();
    if (_isArray(res)) {
      const arr = toTree(res, 'id', 'tenantId').filter(v => _isUndefined(v.tenantId));
      setPageData({
        ...pageData,
        total: arr.length
      });
    }
  });
  const columns = useMemo(() => {
    return [{
      name: FieldsNameTypes.NAME
    }, {
      name: FieldsNameTypes.CODE
    }, {
      name: FieldsNameTypes.DEFAULT_GRANTED_FLAG,
      renderer: ({
        value,
        record: r
      }) => {
        if (!_isUndefined(r.get('tenantId'))) {
          return '-';
        }
        return value ? intl.get('hmde.common.yes').d('是') : intl.get('hmde.common.no').d('否');
      }
    }];
  }, []);
  const onRow = ({
    record: r
  }) => {
    let isLeaf = false;
    if (!_isUndefined(r.get('tenantId'))) {
      isLeaf = true;
    }
    return {
      isLeaf
    };
  };
  const onPagingChange = (page, pageSize) => {
    var _tableDataRef$current;
    setPageData({
      ...pageData,
      pageSize,
      page
    });
    const data = (_tableDataRef$current = tableDataRef.current) === null || _tableDataRef$current === void 0 ? void 0 : _tableDataRef$current.content.slice((page - 1) * pageSize, page * pageSize);
    selectedDistributeDS.loadData(organizationTreeToArray(data));
  };
  const onSearch = useCallback(e => {
    var _tableDataRef$current2, _tableDataRef$current3;
    const content = (_tableDataRef$current2 = tableDataRef.current) === null || _tableDataRef$current2 === void 0 ? void 0 : (_tableDataRef$current3 = _tableDataRef$current2.content) === null || _tableDataRef$current3 === void 0 ? void 0 : _tableDataRef$current3.filter(v => {
      var _v$name, _v$name$includes;
      return v === null || v === void 0 ? void 0 : (_v$name = v.name) === null || _v$name === void 0 ? void 0 : (_v$name$includes = _v$name.includes) === null || _v$name$includes === void 0 ? void 0 : _v$name$includes.call(_v$name, e.target.value);
    });
    selectedDistributeDS.loadData(organizationTreeToArray(content));
  }, [selectedDistributeDS]);
  const renderDataRange = () => {
    if (!(record !== null && record !== void 0 && record.get(PolicyFieldsNameTypes.GRANT_RANGE)) && (!(record !== null && record !== void 0 && record.get('groupTenantList')) || toJS(record === null || record === void 0 ? void 0 : record.get('groupTenantList')).length === 0)) {
      return null;
    }
    return /*#__PURE__*/React.createElement(_Output, {
      name: PolicyFieldsNameTypes.GRANT_RANGE,
      renderer: ({
        value
      }) => value ? intl.get('hmde.bo.businessObject.allTenants').d('全部租户') : intl.get('hmde.bo.businessObject.specifiedrange').d('指定范围')
    });
  };
  return useObserver(() => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, intl.get('hmde.bo.businessObject.Grantscope').d('授予范围')), /*#__PURE__*/React.createElement(_Form, {
    dataSet: distributePermissionDs
    // useColon={false}
    ,
    columns: 2
  }, renderDataRange()), hasInitPageData || selectedDistributeDS.totalCount > 0 ? /*#__PURE__*/React.createElement("div", {
    className: styles.wrapper
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.operation
  }, /*#__PURE__*/React.createElement(_TextField, {
    className: styles.search,
    prefix: /*#__PURE__*/React.createElement(_Icon, {
      type: "search",
      style: {
        color: '#D0D0D0'
      }
    }),
    placeholder: intl.get('hmde.bo.domain.search.keywords').d('请搜索关键词'),
    onEnterDown: onSearch
  }), handleDistributeRange && /*#__PURE__*/React.createElement(_Button, {
    icon: "add",
    funcType: "link",
    onClick: () => handleDistributeRange(selectedDistributeDS)
  }, intl.get('hmde.bo.businessObject.allocation').d('分配'))), /*#__PURE__*/React.createElement(_Table, {
    key: "code",
    mode: "tree",
    defaultRowExpanded: true,
    dataSet: selectedDistributeDS,
    onRow: onRow,
    columns: columns,
    highLightRow: false,
    style: {
      height: 'calc(100vh - 54px - 120px - 64px - 60px - 140px)'
    }
  }), /*#__PURE__*/React.createElement(_Pagination, _extends({
    style: {
      float: 'right',
      marginTop: '18px'
    },
    onChange: onPagingChange
  }, pageData))) : /*#__PURE__*/React.createElement(Empty, {
    subTitle: handleDistributeRange && intl.get('hmde.bo.businessObject.belowtoallocate').d('请点击下方按钮进行分配'),
    extra: handleDistributeRange && /*#__PURE__*/React.createElement(_Button, {
      color: "primary",
      onClick: () => handleDistributeRange(selectedDistributeDS)
    }, intl.get('hmde.bo.businessObject.allocation').d('分配'))
  })));
});
export default RangeContent;