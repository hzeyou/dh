import _Card from "@hzero-front-ui/c7n-ui/lib/Card";
import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _Tag from "@hzero-front-ui/c7n-ui/lib/Tag";
import _Checkbox from "@hzero-front-ui/c7n-ui/lib/Checkbox";
import _isUndefined from "lodash/isUndefined";
import React, { useCallback, useMemo } from 'react';
import { TableMode, SelectionMode } from 'choerodon-ui/pro/lib/table/enum';
import { observer } from 'mobx-react-lite';
import { useDataSetEvent } from 'utils/hooks';
import intl from 'utils/intl';
import { FieldsNameTypes } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionDistributeDS";
import { isTenantRoleLevel } from 'utils/utils';
import { handleSetRecordsTotal } from "../../../../utils/ds";
import styles from "./index.less?modules";
const isTenant = isTenantRoleLevel();
const TransferCardOptional = ({
  dataSet: cardDs,
  totalRecord
}) => {
  // 默认授予字段被点击
  useDataSetEvent(cardDs, 'update', ({
    dataSet,
    record
  }) => {
    const defaultAuthFlag = record === null || record === void 0 ? void 0 : record.get(FieldsNameTypes.DEFAULT_GRANTED_FLAG);
    if (defaultAuthFlag) {
      dataSet.treeSelect(record);
    }
  });

  // 选择租户的时候不自动选择子角色
  useDataSetEvent(cardDs, 'batchSelect', ({
    records
  }) => {
    if (records.length === 0) return;
    if (records.length === 1) {
      if (!_isUndefined(records[0].get('tenantId'))) {
        // 如果是子集, 选择子级的父级
        const parentRecord = records[0].parent;
        Object.assign(parentRecord, {
          isSelected: true
        });
      }
    }
    records.forEach(record => {
      Object.assign(record, {
        isSelected: true
      });
    });
  });

  // 取消行的时候判断是否有对应的默认授权
  useDataSetEvent(cardDs, 'batchUnSelect', ({
    records
  }) => {
    if (records.length === 0) return;
    if (records.length === 1) {
      const parentRecord = records[0].parent;
      if (parentRecord) {
        // 如果是子集, 取消子级的父级
        parentRecord.set(FieldsNameTypes.DEFAULT_GRANTED_FLAG, false);
      } else {
        var _records$, _records$$children;
        // // 如果是父级, 必须取消全部子级才能取消
        // const flag = records[0].children.filter((r) => r.selectable && r.isSelected);
        // if (flag.length > 0) {
        //   Object.assign(records[0], { isSelected: true });
        // }
        records === null || records === void 0 ? void 0 : (_records$ = records[0]) === null || _records$ === void 0 ? void 0 : (_records$$children = _records$.children) === null || _records$$children === void 0 ? void 0 : _records$$children.forEach(v => {
          if (v.selectable) {
            Object.assign(v, {
              isSelected: false
            });
          }
        });
        records[0].set(FieldsNameTypes.DEFAULT_GRANTED_FLAG, false);
      }
    }
  });
  const renderTitle = useMemo(() => {
    // 选中的租户数量
    let organizationsSelected;
    // 总共租户的数据
    let organizationsTotal;
    if (isTenant) {
      organizationsSelected = totalRecord.current.filter(r => !_isUndefined(r.get('tenantId')) && r.isSelected).length;
      organizationsTotal = totalRecord.current.filter(r => !_isUndefined(r.get('tenantId'))).length;
    } else {
      organizationsSelected = totalRecord.current.filter(r => _isUndefined(r.get('tenantId')) && r.isSelected && r.selectable).length;
      organizationsTotal = totalRecord.current.filter(r => _isUndefined(r.get('tenantId'))).length;
    }

    // 可选的总记录数
    const totalCount = totalRecord.current.filter(r => _isUndefined(r.get('tenantId')) && r.selectable).length;
    // 排除租户级已选择的数量
    const selectedCount = totalRecord.current.filter(r => _isUndefined(r.get('tenantId')) && r.isSelected).length;
    const onCheckboxChange = e => {
      const checked = e.target.checked;
      if (checked && selectedCount < totalCount) {
        cardDs.selectAll();
      } else {
        cardDs.unSelectAll();
      }
    };
    return /*#__PURE__*/React.createElement("div", {
      className: styles.title
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(_Checkbox, {
      onChange: onCheckboxChange,
      checked: selectedCount !== 0 && selectedCount === totalCount,
      indeterminate: selectedCount > 0 && selectedCount < totalCount
    }), /*#__PURE__*/React.createElement("span", {
      className: styles.count
    }, organizationsSelected, "/", organizationsTotal, isTenant ? intl.get('hmde.bo.businessObject.characterCount').d('角色计数') : intl.get('hmde.bo.businessObject.TenantCount').d('租户计数'))), /*#__PURE__*/React.createElement(_Tag, {
      color: "#FFF0F0",
      style: {
        color: '#F23A50'
      }
    }, intl.get('hmde.common.noBind').d('未绑定')));
  }, [cardDs.selected.length, cardDs.totalCount]);
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
      editor(record) {
        if (record.getState('defaultGrantedDisabled')) {
          return false;
        }
        return _isUndefined(record === null || record === void 0 ? void 0 : record.get('tenantId'));
      }
      // renderer({ record }) {
      //   if (!isUndefined(record?.get('tenantId'))) {
      //     return '';
      //   }
      // },
    }];
  }, []);
  const onRow = ({
    record: r
  }) => {
    let isLeaf = false;
    // 如果是子集
    if (!_isUndefined(r.get('tenantId'))) {
      isLeaf = true;
    }
    return {
      isLeaf,
      className: isLeaf ? styles['default-hidden'] : null
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
    defaultRowExpanded: !!isTenantRoleLevel(),
    mode: "tree",
    selectionMode: "rowbox",
    dataSet: cardDs,
    columns: columns,
    highLightRow: false,
    style: {
      height: '350px'
    }
    // treeLoadData={handleLoadTreeData}
  }));
};
export default observer(TransferCardOptional);