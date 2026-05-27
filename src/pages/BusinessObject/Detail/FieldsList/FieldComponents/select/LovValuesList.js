import _CheckBox from "@hzero-front-ui/c7n-ui/lib/CheckBoxPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import React from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
const Column = _Table.Column;
const Index = ({
  valueListDs,
  operateHeaderFlag,
  disabled,
  defaultValueMultipleFlag,
  readonlyFields = [],
  operationColumnHidden,
  parentOptionField
}) => {
  const defaultValueHandle = record => {
    var _valueListDs$parent2, _valueListDs$parent2$;
    if (defaultValueMultipleFlag) {
      var _valueListDs$parent, _valueListDs$parent$c;
      // eslint-disable-next-line no-unused-expressions
      (_valueListDs$parent = valueListDs.parent) === null || _valueListDs$parent === void 0 ? void 0 : (_valueListDs$parent$c = _valueListDs$parent.current) === null || _valueListDs$parent$c === void 0 ? void 0 : _valueListDs$parent$c.set('defaultValue', valueListDs.filter(v => v.get('defaultFlag')).map(d => d.get('value')));
    } else if ((record === null || record === void 0 ? void 0 : record.get('value')) === ((_valueListDs$parent2 = valueListDs.parent) === null || _valueListDs$parent2 === void 0 ? void 0 : (_valueListDs$parent2$ = _valueListDs$parent2.current) === null || _valueListDs$parent2$ === void 0 ? void 0 : _valueListDs$parent2$.get('defaultValue'))) {
      var _valueListDs$parent3, _valueListDs$parent3$;
      (_valueListDs$parent3 = valueListDs.parent) === null || _valueListDs$parent3 === void 0 ? void 0 : (_valueListDs$parent3$ = _valueListDs$parent3.current) === null || _valueListDs$parent3$ === void 0 ? void 0 : _valueListDs$parent3$.set('defaultValue', '');
    }
  };
  const handleDragEnd = dataSet => {
    dataSet.forEach((v, i) => {
      v === null || v === void 0 ? void 0 : v.set('orderSeq', (i + 1) * 10);
    });
  };
  const buttons = [!operationColumnHidden && operateHeaderFlag && /*#__PURE__*/React.createElement(_Button, {
    disabled: disabled,
    onClick: async () => {
      if (await valueListDs.validate()) {
        valueListDs.create({});
      }
    },
    icon: "add"
  }, intl.get('hmde.bo.businessObject.createCodeField').d('新建编码字段'))];
  return /*#__PURE__*/React.createElement(_Table, {
    dataSet: valueListDs,
    dragColumnAlign: 'left',
    rowDraggable: !disabled,
    pagination: false,
    highLightRow: false,
    filter: record => !record.isRemoved,
    parityRow: false,
    onDragEnd: handleDragEnd,
    buttons: buttons,
    style: {
      marginTop: 16
    }
    // clipboard={{ paste: true }}
  }, /*#__PURE__*/React.createElement(Column, {
    name: "value",
    editor: record => {
      if (disabled || readonlyFields !== null && readonlyFields !== void 0 && readonlyFields.includes('value')) return false;
      return record.isNew || operateHeaderFlag ? /*#__PURE__*/React.createElement(_TextField, {
        name: "value"
      }) : record === null || record === void 0 ? void 0 : record.get('value');
    }
  }), /*#__PURE__*/React.createElement(Column, {
    name: "meaning",
    editor: !disabled
  }), !!parentOptionField && /*#__PURE__*/React.createElement(Column, {
    name: "parentValue",
    editor: !disabled ? /*#__PURE__*/React.createElement(_Select, {
      name: "parentValue"
    }) : false
  }), !operateHeaderFlag && /*#__PURE__*/React.createElement(Column, {
    name: "defaultFlag",
    editor: record => {
      if (disabled || readonlyFields !== null && readonlyFields !== void 0 && readonlyFields.includes('defaultFlag')) return false;
      return /*#__PURE__*/React.createElement(_CheckBox, {
        name: "defaultFlag",
        onChange: val => {
          if (defaultValueMultipleFlag) {
            var _valueListDs$parent4, _valueListDs$parent4$;
            // eslint-disable-next-line no-unused-expressions
            (_valueListDs$parent4 = valueListDs.parent) === null || _valueListDs$parent4 === void 0 ? void 0 : (_valueListDs$parent4$ = _valueListDs$parent4.current) === null || _valueListDs$parent4$ === void 0 ? void 0 : _valueListDs$parent4$.set('defaultValue', valueListDs.filter(v => v.get('defaultFlag')).map(d => d.get('value')));
          } else {
            var _valueListDs$parent5, _valueListDs$parent5$;
            valueListDs.forEach(d => {
              if (val && d.get('value') !== (record === null || record === void 0 ? void 0 : record.get('value'))) {
                d.set('defaultFlag', false);
              }
            });
            // eslint-disable-next-line no-unused-expressions
            (_valueListDs$parent5 = valueListDs.parent) === null || _valueListDs$parent5 === void 0 ? void 0 : (_valueListDs$parent5$ = _valueListDs$parent5.current) === null || _valueListDs$parent5$ === void 0 ? void 0 : _valueListDs$parent5$.set('defaultValue', record !== null && record !== void 0 && record.get('defaultFlag') ? record === null || record === void 0 ? void 0 : record.get('value') : '');
          }
        }
      });
    },
    width: 80
  }), !operationColumnHidden && /*#__PURE__*/React.createElement(Column, {
    header: operateHeaderFlag ? /*#__PURE__*/React.createElement(React.Fragment, null) : intl.get('hmde.common.table.column.operate').d('操作'),
    align: 'right',
    lock: 'right',
    renderer: ({
      record,
      dataSet
    }) => !disabled ? /*#__PURE__*/React.createElement(_Button, {
      disabled: disabled,
      style: {
        border: 'none',
        maxWidth: 32,
        minWidth: 32,
        padding: 0
      },
      onClick: () => {
        if (dataSet && record) {
          dataSet.delete(record, false).then(() => {
            defaultValueHandle(record);
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
    })) : null
  }));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Index));