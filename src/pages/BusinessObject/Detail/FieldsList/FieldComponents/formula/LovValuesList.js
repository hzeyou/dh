import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import React from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { FuncType } from 'choerodon-ui/pro/lib/button/enum';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
const Column = _Table.Column;
const Index = ({
  valueListDs,
  operateHeaderFlag,
  disabled,
  readonlyFields = [],
  operationColumnHidden,
  resultType
}) => {
  const handleDragEnd = dataSet => {
    dataSet.forEach((v, i) => {
      v === null || v === void 0 ? void 0 : v.set('orderSeq', (i + 1) * 10);
    });
  };
  return /*#__PURE__*/React.createElement(_Table, {
    dataSet: valueListDs,
    dragColumnAlign: 'left',
    rowDraggable: !disabled && resultType !== 'Boolean',
    pagination: false,
    highLightRow: false,
    filter: record => !record.isRemoved,
    parityRow: false,
    onDragEnd: handleDragEnd
  }, /*#__PURE__*/React.createElement(Column, {
    name: "value",
    editor: record => {
      if (disabled || readonlyFields !== null && readonlyFields !== void 0 && readonlyFields.includes('value')) return false;
      return (record.isNew || operateHeaderFlag) && resultType !== 'Boolean' ? /*#__PURE__*/React.createElement(_TextField, {
        name: "value"
      }) : record === null || record === void 0 ? void 0 : record.get('value');
    }
  }), /*#__PURE__*/React.createElement(Column, {
    name: "meaning",
    editor: !disabled
  }), !operationColumnHidden && resultType !== 'Boolean' && /*#__PURE__*/React.createElement(Column, {
    header: operateHeaderFlag && /*#__PURE__*/React.createElement(_Button, {
      disabled: disabled,
      onClick: () => valueListDs.create({}),
      funcType: "flat",
      icon: "add"
    }, intl.get('hmde.bo.businessObject.createCodeField').d('新建编码字段')),
    align: 'right',
    lock: 'right',
    renderer: ({
      record,
      dataSet
    }) => /*#__PURE__*/React.createElement(_Button, {
      disabled: disabled,
      style: {
        border: 'none',
        maxWidth: 32,
        minWidth: 32,
        padding: 0
      },
      onClick: () => {
        if (dataSet && record) {
          dataSet.delete(record, false).finally(() => {
            dataSet.validate();
          });
        }
      }
    }, /*#__PURE__*/React.createElement(ImgIcon, {
      disabled: disabled,
      name: "delete_template.svg",
      size: 18,
      style: {
        visibility: 'visible'
      }
    }))
  }));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Index));