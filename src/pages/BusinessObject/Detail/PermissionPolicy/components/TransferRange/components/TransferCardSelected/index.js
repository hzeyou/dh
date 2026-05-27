import _Card from "@hzero-front-ui/c7n-ui/lib/Card";
import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _Tag from "@hzero-front-ui/c7n-ui/lib/Tag";
import _Checkbox from "@hzero-front-ui/c7n-ui/lib/Checkbox";
import _isUndefined from "lodash/isUndefined";
import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { TableMode, SelectionMode } from 'choerodon-ui/pro/lib/table/enum';
import { observer } from 'mobx-react-lite';
import $ from 'jquery';
import intl from 'utils/intl';
import { FieldsNameTypes } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionDistributeDS";
import { useDataSetEvent } from 'utils/hooks';
import { isTenantRoleLevel } from 'utils/utils';
import { handleSetRecordsTotal } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/PermissionPolicy/utils/ds";
import styles from "./index.less?modules";
const isTenant = isTenantRoleLevel();
const TransferCardSelected = ({
  dataSet: cardDs,
  totalRecord
}) => {
  const tableRef = useRef(null);
  useEffect(() => {
    // 租户级角色禁止全选
    if (isTenant) {
      var _tableRef$current;
      $((_tableRef$current = tableRef.current) === null || _tableRef$current === void 0 ? void 0 : _tableRef$current.element).find('.c7n-pro-table-head').find('.c7n-pro-checkbox-wrapper').css('display', 'none');
    }
  }, []);
  const renderTitle = useMemo(() => {
    // 选中的租户数量
    const mSet = new Set();
    let organizationsSelected;
    // 总共租户的数据
    let organizationsTotal;
    if (isTenant) {
      organizationsSelected = totalRecord.current.filter(r => r.isSelected && r.get('tenantId')).length;
      organizationsTotal = totalRecord.current.filter(r => !_isUndefined(r.get('tenantId'))).length;
    } else {
      totalRecord.current.forEach(r => r.isSelected && mSet.add(r.get('tenantId') || r.get('id')));
      organizationsSelected = mSet.size;
      organizationsTotal = totalRecord.current.filter(r => _isUndefined(r.get('tenantId'))).length;
    }
    const totalCount = totalRecord.current.length;
    const selectedCount = totalRecord.current.filter(r => r.isSelected).length;
    const onCheckboxChange = e => {
      const checked = e.target.checked;
      if (checked) {
        cardDs.selectAll();
      } else {
        cardDs.unSelectAll();
      }
    };
    return /*#__PURE__*/React.createElement("div", {
      className: styles.title
    }, /*#__PURE__*/React.createElement("span", null, !isTenant && /*#__PURE__*/React.createElement(_Checkbox, {
      onChange: onCheckboxChange,
      checked: selectedCount !== 0 && selectedCount === totalCount,
      indeterminate: selectedCount > 0 && selectedCount < totalCount
    }), /*#__PURE__*/React.createElement("span", {
      className: styles.count
    }, organizationsSelected, "/", organizationsTotal, isTenant ? intl.get('hmde.bo.businessObject.characterCount').d('角色计数') : intl.get('hmde.bo.businessObject.TenantCount').d('租户计数'))), /*#__PURE__*/React.createElement(_Tag, {
      color: "#E6FFEA",
      style: {
        color: '#11D954'
      }
    }, intl.get('hmde.common.isBinding').d('已绑定')));
  }, [cardDs.selected.length, cardDs.totalCount]);

  // 选择租户的时候不自动选择子角色
  useDataSetEvent(cardDs, 'batchSelect', ({
    records,
    dataSet
  }) => {
    if (records.length === 1) {
      const record = records[0];
      // 如果是默认授予的情况，选择租户就选择全部角色
      if (record !== null && record !== void 0 && record.get(FieldsNameTypes.DEFAULT_GRANTED_FLAG)) {
        dataSet.treeSelect(record);
      }
    }
  });
  const onInputSearch = useCallback(e => {
    const value = e.target.value;
    cardDs.setState(FieldsNameTypes.SEARCH_CONTENT, value);
    handleSetRecordsTotal(cardDs, totalRecord);
  }, []);
  const columns = useMemo(() => {
    return [{
      name: FieldsNameTypes.NAME,
      width: 210
    }, {
      name: FieldsNameTypes.CODE,
      width: 110
    }, {
      name: FieldsNameTypes.DEFAULT_GRANTED_FLAG,
      renderer: ({
        value,
        record
      }) => {
        if (!_isUndefined(record === null || record === void 0 ? void 0 : record.get('tenantId'))) {
          return '';
        }
        return value ? intl.get('hmde.common.yes').d('是') : intl.get('hmde.common.no').d('否');
      }
    }];
  }, []);
  const onRow = ({
    record: r,
    dataSet
  }) => {
    let isLeaf = false;
    let isHidden = false;
    if (!_isUndefined(r.get('tenantId'))) {
      isLeaf = true;
      // 判断父级
      const parentIndex = dataSet.findIndex(v => _isUndefined(v.get('tenantId')) && v.get('id') === r.get('tenantId') && v.get('allowAllRoleFlag'));
      if (parentIndex !== -1) {
        isHidden = true;
      }
    }
    return {
      isLeaf,
      className: isHidden ? styles.hidden : null
    };
  };
  return /*#__PURE__*/React.createElement(_Card, {
    title: renderTitle,
    className: styles['card-wrapper']
  }, /*#__PURE__*/React.createElement(_TextField, {
    className: styles.search,
    prefix: /*#__PURE__*/React.createElement(_Icon, {
      type: "search",
      style: {
        color: '#D0D0D0'
      }
    }),
    placeholder: intl.get('hmde.bo.domain.search.keywords').d('请搜索关键词'),
    onEnterDown: onInputSearch,
    clearButton: true
  }), /*#__PURE__*/React.createElement(_Table, {
    key: "id"
    // treeAsync
    ,
    onRow: onRow,
    defaultRowExpanded: true,
    mode: "tree",
    selectionMode: "rowbox",
    dataSet: cardDs,
    columns: columns,
    highLightRow: false,
    style: {
      height: '350px'
    },
    ref: tableRef
  }));
};
export default observer(TransferCardSelected);