import { FieldType, DataToJSON } from 'choerodon-ui/pro/lib/data-set/enum'; // FieldIgnore
import intl from 'utils/intl';
import { isTenantRoleLevel } from 'utils/utils';
import moment from 'moment';
const isTenant = isTenantRoleLevel();

// 过滤条件ds
export let FILTER_CONDITION_FN = /*#__PURE__*/function (FILTER_CONDITION_FN) {
  FILTER_CONDITION_FN["ORDER_SEQ"] = "orderSeq";
  FILTER_CONDITION_FN["VARIABLE_TYPE"] = "leftValueType";
  FILTER_CONDITION_FN["VARIABLE"] = "leftValue";
  FILTER_CONDITION_FN["VARIABLE_VALUE"] = "leftDrillExpression";
  FILTER_CONDITION_FN["OPERATOR_TYPE"] = "operatorType";
  FILTER_CONDITION_FN["VALUE_TYPE"] = "rightValueType";
  FILTER_CONDITION_FN["VALUE"] = "rightValue";
  FILTER_CONDITION_FN["RIGHT_VALUE"] = "rightDrillExpression";
  FILTER_CONDITION_FN["COMPONENT_TYPE"] = "componentType";
  FILTER_CONDITION_FN["LEFT_EXPRESS_NAME"] = "leftExpressName";
  FILTER_CONDITION_FN["LEFT_EXPRESS_TYPE"] = "leftExpressType";
  FILTER_CONDITION_FN["RIGHT_EXPRESS_NAME"] = "rightExpressName";
  return FILTER_CONDITION_FN;
}({});
export const filterConditionDs = () => {
  return {
    autoCreate: false,
    autoQuery: false,
    dataToJSON: "normal",
    forceValidate: true,
    fields: [{
      name: FILTER_CONDITION_FN.ORDER_SEQ,
      type: "number",
      transformRequest: (_, record) => {
        return record.index + 1;
      }
    },
    // 变量类型
    {
      name: FILTER_CONDITION_FN.VARIABLE_TYPE,
      type: "string",
      required: true,
      lookupCode: 'HMDE.FLOW_ASSIGNMENT_TYPE'
    },
    // 变量
    {
      name: FILTER_CONDITION_FN.VARIABLE,
      type: "string",
      required: true,
      computedProps: {
        lookupCode: ({
          record
        }) => {
          const zCode = isTenant ? 'HMDE.SYSTEM_VARIABLE' : 'HMDE.SYSTEM_VARIABLE.SITE';
          return (record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.VARIABLE_TYPE)) === 'SYSTEM_VARIABLE' ? zCode : undefined;
        },
        lovPara: ({
          record
        }) => {
          return (record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.VARIABLE_TYPE)) === 'SYSTEM_VARIABLE' ? {
            variableType: 'CODE'
          } : {};
        }
      }
    },
    // 变量值(钻取)
    {
      name: FILTER_CONDITION_FN.VARIABLE_VALUE,
      type: "string"
    },
    // 逻辑符
    {
      name: FILTER_CONDITION_FN.OPERATOR_TYPE,
      type: "string",
      required: true,
      textField: 'meaning',
      valueField: 'value',
      lookupCode: 'HMDE.FILTER_CONDITION'
    },
    // 取值类型
    {
      name: FILTER_CONDITION_FN.VALUE_TYPE,
      type: "string",
      required: true,
      lookupCode: 'HMDE.FLOW_ASSIGNMENT_TYPE',
      computedProps: {
        required: ({
          record
        }) => {
          return !['IS_NULL', 'IS_NOT_NULL'].includes(record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.OPERATOR_TYPE));
        }
      }
    },
    // 值
    {
      name: FILTER_CONDITION_FN.VALUE,
      type: "auto",
      transformRequest: (val, record) => {
        if (Array.isArray(val)) {
          // 兼容时间介于下的bug
          if (val.some(v => moment.isMoment(v))) {
            return val.map(item => {
              if (moment.isMoment(item)) {
                const componentType = record === null || record === void 0 ? void 0 : record.get('componentType');
                return item.format(componentType === 'DATE_SELECTION_BOX' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss');
              } else {
                return item;
              }
            }).join(',');
          }
          return val === null || val === void 0 ? void 0 : val.join();
        }
        return val;
      },
      transformResponse: (value, object) => {
        const _ref = object || {},
          rightValueType = _ref.rightValueType,
          operatorType = _ref.operatorType;
        if (rightValueType === 'CONSTANT') {
          if (['RANGE'].includes(operatorType)) {
            var _value;
            value = (_value = value) === null || _value === void 0 ? void 0 : _value.split(',');
          }
        }
        return value;
      },
      computedProps: {
        required: ({
          record
        }) => {
          return !['IS_NULL', 'IS_NOT_NULL'].includes(record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.OPERATOR_TYPE));
        },
        type: ({
          record
        }) => {
          const componentType = record === null || record === void 0 ? void 0 : record.get('componentType');
          if (componentType === 'DATE_SELECTION_BOX') {
            return "date";
          } else if (componentType === 'DATETIME_SELECTION_BOX') {
            return "dateTime";
          }
          return "auto";
        },
        lookupCode: ({
          record
        }) => {
          const zCode = isTenant ? 'HMDE.SYSTEM_VARIABLE' : 'HMDE.SYSTEM_VARIABLE.SITE';
          return (record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.VALUE_TYPE)) === 'SYSTEM_VARIABLE' ? zCode : undefined;
        },
        lovPara: ({
          record
        }) => {
          return (record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.VALUE_TYPE)) === 'SYSTEM_VARIABLE' ? {
            variableType: 'CODE'
          } : {};
        },
        multiple: ({
          record
        }) => {
          if (['IN', 'NOT_IN'].includes(record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.OPERATOR_TYPE)) && (record === null || record === void 0 ? void 0 : record.get(FILTER_CONDITION_FN.VARIABLE_TYPE)) === 'INPUT_PARAM') {
            return ',';
          } else {
            return false;
          }
        }
      }
    },
    // 值(关系字段钻取)
    {
      name: FILTER_CONDITION_FN.RIGHT_VALUE,
      type: "string"
    },
    // 表达式相关(左)的字段
    {
      name: FILTER_CONDITION_FN.LEFT_EXPRESS_NAME,
      type: "string"
    }, {
      name: FILTER_CONDITION_FN.LEFT_EXPRESS_TYPE,
      type: "string"
    },
    // 表达式相关(右)的字段
    {
      name: FILTER_CONDITION_FN.RIGHT_EXPRESS_NAME,
      type: "string"
    },
    // 字段类型
    {
      name: FILTER_CONDITION_FN.COMPONENT_TYPE,
      type: "string"
    }]
  };
};

// 条件关系ds
export const relationDs = filterDs => ({
  autoCreate: true,
  autoQuery: false,
  fields: [{
    name: 'logicFormula',
    type: "string",
    format: 'uppercase',
    validator: async (value = '', _, record) => {
      var _value$match, _value$match2, _value$match2$call, _value$match3, _value$match3$call, _value$match4;
      if (!filterDs.length) return true;
      const regNum = new RegExp('[0-9]+', 'g');
      const regBrackets = new RegExp('[()]', 'g');
      const regStr = new RegExp('[A-Z ]+', 'g');
      const regBracketsPro = new RegExp('[{[}]|]', 'g');
      let message = true;
      if (value === null || value.trim().length === 0 || value && !(value !== null && value !== void 0 && (_value$match = value.match) !== null && _value$match !== void 0 && _value$match.call(value, regNum)) || value !== null && value !== void 0 && (_value$match2 = value.match) !== null && _value$match2 !== void 0 && (_value$match2$call = _value$match2.call(value, regNum)) !== null && _value$match2$call !== void 0 && _value$match2$call.some(_key => {
        var _record$get;
        return Number(_key) > (record === null || record === void 0 ? void 0 : (_record$get = record.get('conditions')) === null || _record$get === void 0 ? void 0 : _record$get.length);
      })) {
        message = intl.get('hmde.common.conditionalRelation.errorMes1').d('校验不通过，请按照参考示例输写筛选逻辑！');
      }
      if (value !== null && value !== void 0 && value.match(regStr) && !(value !== null && value !== void 0 && (_value$match3 = value.match) !== null && _value$match3 !== void 0 && (_value$match3$call = _value$match3.call(value, regStr)) !== null && _value$match3$call !== void 0 && _value$match3$call.every(str => str.trim() === 'AND' || str.trim() === 'OR'))) {
        message = intl.get('hmde.common.conditionalRelation.errorMes1').d('校验不通过，请按照参考示例输写筛选逻辑！');
      }
      if (regBracketsPro.test(value)) {
        message = intl.get('hmde.common.conditionalRelation.errorMes2').d('校验不通过，请按照参考示例输写，当前仅支持“()”');
      }
      if (value !== null && value !== void 0 && (_value$match4 = value.match) !== null && _value$match4 !== void 0 && _value$match4.call(value, regBrackets)) {
        message = intl.get('hmde.common.conditionalRelation.errorMes3').d('校验不通过，你输入的括号匹配错误！');
      }
      return message;
    }
  }]
});