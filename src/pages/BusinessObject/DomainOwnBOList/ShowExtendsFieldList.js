import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Icon from "choerodon-ui/pro/lib/icon";
import React, { useLayoutEffect, useCallback } from 'react';
// import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { TableMode, TableQueryBarType } from 'choerodon-ui/pro/lib/table/enum';
import intl from 'utils/intl';
import $ from 'jquery';

// import ImgIcon from '@hmde/utils/ImgIcon';

import { MAPFN as FN } from "./type";
import styles from "./index.less?modules";
const ShowExtendsFieldDetail = ({
  modal,
  boFormDs,
  extendsMappingDs,
  fieldName
}) => {
  // 这里面可以控制node结点的判断来实现是否展示为叶结点
  const nodeCover = ({
    record
  }) => {
    const nodeProps = {
      isLeaf: false
    };
    if (!(record !== null && record !== void 0 && record.get('domainTemplateFields'))) {
      nodeProps.isLeaf = true;
    }
    return nodeProps;
  };
  useLayoutEffect(() => {
    $('.c7n-pro-table-thead .c7n-pro-checkbox-wrapper').hide();
    extendsMappingDs.forEach(v => {
      if (v !== null && v !== void 0 && v.get('isChecked')) {
        extendsMappingDs === null || extendsMappingDs === void 0 ? void 0 : extendsMappingDs.select(v);
      }
    });
  }, []);
  modal === null || modal === void 0 ? void 0 : modal.handleOk(async () => {
    var _extendsMappingDs$sel, _boFormDs$current;
    const checkedRelationObj = {};
    extendsMappingDs.forEach(v => v.set('isChecked', false));
    extendsMappingDs === null || extendsMappingDs === void 0 ? void 0 : (_extendsMappingDs$sel = extendsMappingDs.selected) === null || _extendsMappingDs$sel === void 0 ? void 0 : _extendsMappingDs$sel.forEach(v => {
      v.set('isChecked', true);
      const parentItem = extendsMappingDs.find(item => (item === null || item === void 0 ? void 0 : item.get('id')) === (v === null || v === void 0 ? void 0 : v.get('parentId')));
      checkedRelationObj[parentItem === null || parentItem === void 0 ? void 0 : parentItem.get(FN.TEMPLATE_FIELD_CODE)] = v === null || v === void 0 ? void 0 : v.get(FN.TEMPLATE_CODE);
    });
    boFormDs === null || boFormDs === void 0 ? void 0 : (_boFormDs$current = boFormDs.current) === null || _boFormDs$current === void 0 ? void 0 : _boFormDs$current.set(fieldName || 'checkedRelation', JSON.stringify(checkedRelationObj) === '{}' ? undefined : checkedRelationObj);
    modal === null || modal === void 0 ? void 0 : modal.close();
  });
  const columns = [{
    name: FN.TEMPLATE_FIELD_NAME,
    width: 200,
    renderer: ({
      record
    }) => {
      return /*#__PURE__*/React.createElement("div", {
        className: styles['extends-name']
      }, /*#__PURE__*/React.createElement("span", null, record === null || record === void 0 ? void 0 : record.get(FN.TEMPLATE_FIELD_NAME)));
    }
  }, {
    name: FN.TEMPLATE_FIELD_CODE,
    width: 150
  }, {
    name: FN.TYPE_C
  }, {
    name: FN.COMPONENT_TYPE_MEADING
  }, {
    name: FN.FIELD_BEHAVIORR_MEANING
  }, {
    name: FN.TEMPLATE_NAME
  }, {
    name: FN.TEMPLATE_CODE
  }];
  const expandIconRender = useCallback(({
    expandable,
    expanded,
    onExpand
  }) => {
    return /*#__PURE__*/React.createElement(_Icon, {
      onClick: onExpand,
      type: "arrow_drop_down",
      style: {
        transform: expanded ? '' : 'rotate(-90deg)',
        visibility: expandable ? 'visible' : 'hidden',
        fontSize: '0.2rem',
        cursor: 'pointer'
      }
    });
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, intl.get('hmde.bo.businessObject.ShowExtendsFieldList.title').d('关联物理模型中存在以下字段与领域反向模板字段类型、编码、最大长度、小数位数、是否必输等基础属性相匹配，请选择需要使用的模板字段进行映射')), /*#__PURE__*/React.createElement(_Table, {
    dataSet: extendsMappingDs,
    defaultRowExpanded: true,
    virtualCell: false,
    mode: "tree",
    queryBar: "none",
    columns: columns,
    onRow: nodeCover,
    selectionBoxRenderer: ({
      record,
      element
    }) => record !== null && record !== void 0 && record.get('parentId') ? element : null,
    expandIcon: expandIconRender
  }));
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(ShowExtendsFieldDetail));