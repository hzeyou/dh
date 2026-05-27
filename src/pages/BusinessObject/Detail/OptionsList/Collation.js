import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
// 记录排序规则
import React from 'react';
import { useMount } from 'ahooks';
import intl from 'utils/intl';
import uuid from 'uuid/v4';
import FieldSort from 'hzero-front-apaas/lib/components/FieldSort';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { getResponse, getCurrentTenant } from 'utils/utils';
import { fetchOrdersFieldsNew } from "hzero-front-hmde/lib/services/businessObjectService";
import { PhysicalModelType } from "hzero-front-hmde/lib/constants/businessObject";
import { SQL_PARAM_CATEGORY } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/SqlMaintenance/datasets/sqlParamsDS";
// import { objectFieldSearchMatcher } from '@hmde/utils/bo';

import styles from "./index.less?modules";
const Collation = ({
  collationDs,
  // businessObjectId,
  // businessObjectOptionId,
  readOnlyFlag,
  deleteFieldsList,
  businessObjectCode,
  physicalModelType
}) => {
  const handleDelete = record => {
    const newArr = collationDs.filter(ele => {
      if (ele !== null && ele !== void 0 && ele.get('businessObjectOptionOrderId')) {
        if ((ele === null || ele === void 0 ? void 0 : ele.get('businessObjectOptionOrderId')) !== (record === null || record === void 0 ? void 0 : record.get('businessObjectOptionOrderId'))) {
          return true;
        } else {
          ele === null || ele === void 0 ? void 0 : ele.set('deleteFlag', true);
          deleteFieldsList.current.push(ele.toData());
        }
      } else {
        if ((ele === null || ele === void 0 ? void 0 : ele.get('id')) !== (record === null || record === void 0 ? void 0 : record.get('id'))) {
          return true;
        }
        return false;
      }
      return false;
    });
    collationDs.loadData(newArr);
  };
  const handleConfirm = record => {
    _Modal.confirm({
      children: /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.fieldDeleteConfirm').d('是否确认删除选中字段？')),
      okText: intl.get('hmde.common.button.sure').d('确定'),
      onOk: async () => handleDelete(record)
    });
  };
  useMount(() => {
    // const query = {
    //   page: 0,
    //   size: 0,
    //   ignoreWhoFlag: false,
    //   businessObjectId,
    //   businessObjectOptionId,
    // };
    const query = {};
    // sql 对象补充过滤条件
    if (physicalModelType === PhysicalModelType.SQL) {
      query.useType = SQL_PARAM_CATEGORY.FIELD_PARAM;
    }
    fetchOrdersFieldsNew({
      businessObjectCode,
      query
    }).then(res => {
      if (getResponse(res)) {
        collationDs.setState('fieldList', (res === null || res === void 0 ? void 0 : res.map(v => {
          var _getCurrentTenant;
          return {
            tenantId: (_getCurrentTenant = getCurrentTenant()) === null || _getCurrentTenant === void 0 ? void 0 : _getCurrentTenant.tenantId,
            fieldCode: v === null || v === void 0 ? void 0 : v.code,
            fieldName: v === null || v === void 0 ? void 0 : v.name
          };
        })) || []);
      }
    });
    // collationDs.setState('businessObjectId', businessObjectId);
    // collationDs.setState('businessObjectOptionId', businessObjectOptionId);
  });
  const handleAdd = async () => {
    if (await collationDs.validate()) {
      collationDs.create({
        id: uuid(),
        orderSeq: (collationDs.length + 1) * 10
      });
    }
  };
  /**
   * 下拉选项禁用
   */
  const onOption = ({
    record
  }) => {
    return {
      disabled: collationDs === null || collationDs === void 0 ? void 0 : collationDs.some(v => v.get('fieldCode') === (record === null || record === void 0 ? void 0 : record.get('fieldCode')))
    };
  };
  const fieldSortProp = {
    fieldCodeName: 'fieldCode',
    directionName: 'direction',
    readOnlyFlag,
    sortDs: collationDs,
    handleOnLayoutChange,
    handleConfirm,
    sortHelpMsg: intl.get('hmde.bo.exportTemplate.highTypeFieldHelp').d('关联、从主字段若引用了值列表则按值列表显示字段值进行排序，若未引用值列表则按字段存储值进行排序；高级关系字段按存储值进行排序'),
    onOption
  };
  /**
   * 条件节点拖动，数据排序也要发生改变
   */
  function handleOnLayoutChange(res) {
    // dropped outside the list
    if (!res.destination) {
      return;
    }
    // a little function to help us with reordering the result
    const reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list);
      const _result$splice = result.splice(startIndex, 1),
        _result$splice2 = _slicedToArray(_result$splice, 1),
        removed = _result$splice2[0];
      result.splice(endIndex, 0, removed);
      return result;
    };
    const defaultItems = JSON.parse(JSON.stringify(collationDs.toData()));
    const items = reorder(defaultItems, res.source.index, res.destination.index);
    collationDs.loadData(items);
    // 排序权重
    collationDs.forEach((ele, index) => {
      ele === null || ele === void 0 ? void 0 : ele.set('orderSeq', (index + 1) * 10);
    });
    collationDs.validate();
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: styles['collation-header']
  }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.dataSort').d('数据排序')), /*#__PURE__*/React.createElement(_Button, {
    funcType: "flat",
    color: "primary",
    icon: "add",
    onClick: handleAdd,
    hidden: readOnlyFlag,
    disabled: collationDs.selected.length
  }, intl.get('hmde.common.button.createSort').d('新建排序'))), /*#__PURE__*/React.createElement(FieldSort, fieldSortProp));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Collation));