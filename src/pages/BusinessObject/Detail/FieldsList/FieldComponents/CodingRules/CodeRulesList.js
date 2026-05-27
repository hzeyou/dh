import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import React, { useState } from 'react';
// import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { getResponse } from 'utils/utils';
import { TableColumnTooltip } from 'choerodon-ui/pro/lib/table/enum';
import DrillComponent from 'hzero-front-apaas/lib/components/DrillComponent';
// import DrillComponent from '@hmde/businessComponents/DrillComponent';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import { queryMapIdpValue } from "hzero-front-hmde/lib/services/commonService";
import styles from "./index.less?modules";
const Column = _Table.Column;
const SEQUENCE = 'SEQUENCE',
  // 流水号
  CONSTANT = 'CONSTANT',
  // 固定字符
  VARIABLE = 'VARIABLE',
  // 变量
  UUID = 'UUID',
  // 随机变量uuid
  DATE // 日期
  = 'DATE';
const Index = ({
  ruleListDs,
  disabled,
  businessObjectCode,
  curFieldCode,
  useFlag
}) => {
  const _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    digitList = _useState2[0],
    setDigitList = _useState2[1];
  const _useState3 = useState([]),
    _useState4 = _slicedToArray(_useState3, 2),
    dateFormatList = _useState4[0],
    setDateFormatList = _useState4[1];
  const _useState5 = useState([]),
    _useState6 = _slicedToArray(_useState5, 2),
    variableTypeList = _useState6[0],
    setVariableTypeList = _useState6[1];
  const _useState7 = useState([]),
    _useState8 = _slicedToArray(_useState7, 2),
    variableValueList = _useState8[0],
    setVariableValueList = _useState8[1];
  const _useState9 = useState([]),
    _useState10 = _slicedToArray(_useState9, 2),
    resetFrequencyList = _useState10[0],
    setResetFrequencyList = _useState10[1];
  React.useEffect(() => {
    queryMapIdpValue(['HMDE.BO_FIELD.CODE_RULE.UUID_DIGIT',
    // 位数
    'HMDE.BUSINESS_OBJECT.CODE_RULE.DATE_MASK',
    // 日期格式
    'HMDE.BUSINESS_OBJECT.CODE_RULE.VARIABLE_TYPE',
    // 变量类型
    'HMDE.BO_FIELD.CODE_RULE.ENV_VARIABLE',
    // 变量值
    'HPFM.CODE_RULE.RESET_FREQUENCY' // 重置频率
    ]).then(res => {
      if (getResponse(res)) {
        setDigitList(res[0]);
        setDateFormatList(res[1]);
        setVariableTypeList(res[2]);
        setVariableValueList(res[3]);
        setResetFrequencyList(res[4]);
      }
    });
  }, []);
  const handleOk = (params, record) => {
    record === null || record === void 0 ? void 0 : record.set('thirdInput', params === null || params === void 0 ? void 0 : params.value);
  };
  /**
   * 获取drill数据，回写到editor
   * @param dataSet drill的dataSet
   */
  const drillRenderer = record => {
    const res = record === null || record === void 0 ? void 0 : record.get('secondInput');
    const _businessObjectCode = res === 'CONTEXT' ? businessObjectCode : 'SYS_USER';
    return /*#__PURE__*/React.createElement(DrillComponent, {
      onOk: params => handleOk(params, record),
      name: "thirdInput",
      businessObjectCode: _businessObjectCode,
      isWriteBack: true,
      readOnly: useFlag,
      initValue: record === null || record === void 0 ? void 0 : record.get('thirdInput'),
      curFieldCode: curFieldCode,
      onClear: () => {
        record === null || record === void 0 ? void 0 : record.set('fieldValue', undefined);
        record === null || record === void 0 ? void 0 : record.set('thirdInput', undefined);
      }
    });
  };
  const getOptions = type => {
    let data = [];
    switch (type) {
      case 'digit':
        // 位数
        data = digitList;
        break;
      case 'dateFormat':
        // 日期格式
        data = dateFormatList;
        break;
      case 'variableType':
        // 变量类型
        data = variableTypeList;
        break;
      case 'variableValue':
        // 变量值
        data = variableValueList;
        break;
      case 'resetFrequency':
        // 重置频率
        data = resetFrequencyList;
        break;
      default:
        data = [];
        break;
    }
    return new _DataSet({
      paging: false,
      data
    });
  };
  const getMeaning = (record, arr, name) => {
    const item = arr.find(i => (i === null || i === void 0 ? void 0 : i.value) === (record === null || record === void 0 ? void 0 : record.get(name)));
    return item === null || item === void 0 ? void 0 : item.meaning;
  };
  return /*#__PURE__*/React.createElement(_Table, {
    dataSet: ruleListDs,
    dragColumnAlign: 'left',
    rowDraggable: !disabled,
    pagination: false,
    highLightRow: false,
    filter: record => !record.isRemoved,
    className: styles['row-custom-table']
  }, /*#__PURE__*/React.createElement(Column, {
    name: "addRuleList",
    width: 120,
    tooltip: "overflow",
    editor: () => {
      if (useFlag || disabled) {
        return false;
      } else {
        return /*#__PURE__*/React.createElement(_Select, {
          optionsFilter: record => {
            const fieldType = record === null || record === void 0 ? void 0 : record.get('value');
            if (fieldType === SEQUENCE) {
              const fieldTypeArray = ruleListDs === null || ruleListDs === void 0 ? void 0 : ruleListDs.map(_record => _record.get('fieldType'));
              return !fieldTypeArray.includes(SEQUENCE);
            } else {
              return true;
            }
          }
        });
      }
    }
  }), /*#__PURE__*/React.createElement(Column, {
    name: "firstInputTitle",
    width: 80,
    tooltip: "overflow"
  }), /*#__PURE__*/React.createElement(Column, {
    name: "firstInput",
    tooltip: "overflow",
    editor: record => {
      if (useFlag || disabled) {
        return false;
      }
      if (!disabled && [CONSTANT, SEQUENCE].includes(record === null || record === void 0 ? void 0 : record.get('fieldType'))) {
        return true;
      }
      switch (record === null || record === void 0 ? void 0 : record.get('fieldType')) {
        case DATE:
          return /*#__PURE__*/React.createElement(_Select, {
            name: "firstInput",
            options: getOptions('dateFormat'),
            disabled: disabled
          });
        case UUID:
          return /*#__PURE__*/React.createElement(_Select, {
            name: "firstInput",
            options: getOptions('digit'),
            disabled: disabled
          });
        case VARIABLE:
          return false;
        default:
          return /*#__PURE__*/React.createElement(_TextField, {
            name: "firstInput",
            disabled: disabled
          });
      }
    }
    // width={120}
    ,
    renderer: ({
      record
    }) => {
      switch (record === null || record === void 0 ? void 0 : record.get('fieldType')) {
        case CONSTANT:
        case SEQUENCE:
        case VARIABLE:
          return record === null || record === void 0 ? void 0 : record.get('firstInput');
        case DATE:
          return getMeaning(record, dateFormatList, 'firstInput');
        case UUID:
          return getMeaning(record, digitList, 'firstInput');
        default:
          break;
      }
    }
  }), /*#__PURE__*/React.createElement(Column, {
    name: "secondInputTitle",
    width: 80,
    tooltip: "overflow"
  }), /*#__PURE__*/React.createElement(Column, {
    name: "secondInput",
    tooltip: "overflow"
    // width={120}
    ,
    editor: record => {
      if (disabled || useFlag) {
        return false;
      }
      if ([SEQUENCE].includes(record === null || record === void 0 ? void 0 : record.get('fieldType'))) {
        return true;
      } else if ([VARIABLE].includes(record === null || record === void 0 ? void 0 : record.get('fieldType'))) {
        return /*#__PURE__*/React.createElement(_Select, {
          name: "secondInput",
          options: getOptions('variableType')
        });
      }
      return false;
    },
    renderer: ({
      record
    }) => {
      switch (record === null || record === void 0 ? void 0 : record.get('fieldType')) {
        case SEQUENCE:
          return record === null || record === void 0 ? void 0 : record.get('secondInput');
        case VARIABLE:
          return getMeaning(record, variableTypeList, 'secondInput');
        default:
          break;
      }
    }
  }), /*#__PURE__*/React.createElement(Column, {
    name: "thirdInputTitle",
    tooltip: "overflow",
    width: 80
  }), /*#__PURE__*/React.createElement(Column
  // width={120}
  , {
    name: "thirdInput"
    // tooltip={TableColumnTooltip.overflow}
    ,
    editor: record => {
      if (disabled || useFlag) return false;
      if ([SEQUENCE].includes(record === null || record === void 0 ? void 0 : record.get('fieldType')) || [VARIABLE].includes(record === null || record === void 0 ? void 0 : record.get('fieldType')) && (record === null || record === void 0 ? void 0 : record.get('secondInput')) === 'VARIABLE') {
        return true;
      }
      return false;
    },
    renderer: ({
      record
    }) => {
      switch (record === null || record === void 0 ? void 0 : record.get('fieldType')) {
        case SEQUENCE:
          return getMeaning(record, resetFrequencyList, 'thirdInput');
        case VARIABLE:
          if ((record === null || record === void 0 ? void 0 : record.get('secondInput')) === 'CONTEXT') {
            return /*#__PURE__*/React.createElement(_Output, {
              name: "thirdInput",
              renderer: drillRenderer.bind(null, record)
            });
          }
          return getMeaning(record, variableValueList, 'thirdInput');
        default:
          break;
      }
    }
  }), /*#__PURE__*/React.createElement(Column, {
    lock: 'right',
    align: 'center',
    width: 50,
    renderer: ({
      record,
      dataSet
    }) => /*#__PURE__*/React.createElement("a", {
      disabled: disabled
      // style={{ border: 'none' }}
      ,
      hidden: useFlag || disabled,
      onClick: () => {
        if (dataSet && record) {
          dataSet.remove(record);
        }
      }
    }, /*#__PURE__*/React.createElement(ImgIcon, {
      name: "delete_template.svg",
      size: 14,
      style: {
        visibility: 'visible'
      }
    }))
  }));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Index));