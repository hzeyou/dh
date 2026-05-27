import _DataSet from "choerodon-ui/pro/lib/data-set";
import intl from 'utils/intl';
import { getCurrentLanguage } from 'utils/utils';
import moment from 'moment';
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import { isBracketsValid } from "hzero-front-hmde/lib/routes/Modeler/utils/utils";
import uuid from 'uuid/v4';
import { ConditionMode } from "hzero-front-apaas/lib/constants/businessObject";
export const conditionDs = (data, businessObjectCode) => ({
  dataToJSON: 'normal',
  fields: [{
    name: 'conditionName',
    type: 'string',
    unique: true,
    required: true
  }, {
    name: 'orderSeq',
    type: 'number'
  }, {
    name: 'defaultFlag',
    type: 'boolean',
    defaultValue: false
  }, {
    name: 'conditionCode',
    type: 'string'
  }, {
    label: intl.get('hmde.bo.flow.model.conditionMode').d('创建方式'),
    name: 'conditionMode',
    type: 'string',
    defaultValue: ConditionMode.simple,
    textField: 'meaning',
    valueField: 'value',
    options: new _DataSet({
      data: [{
        value: ConditionMode.simple,
        meaning: intl.get('hmde.bo.businessObject.apiCreateSimple').d('简易模式')
      }, {
        value: ConditionMode.expression,
        meaning: intl.get('hmde.bo.flow.condition.model.expression').d('表达式模式')
      }]
    })
  }, {
    name: 'conditionLines',
    type: 'auto'
  }, {
    label: intl.get('hmde.common.conditionalRelation').d('条件关系'),
    name: 'conditionLineRelation',
    type: 'string',
    format: 'uppercase',
    validator: async (value = '', _, record) => {
      var _value$match, _value$match2, _value$match2$call, _value$match3, _value$match3$call, _value$match4, _value$match5, _value$match5$call;
      const regNum = new RegExp('[0-9]+', 'g');
      const regBrackets = new RegExp('[()]', 'g');
      const regStr = new RegExp('[A-Z ]+', 'g');
      const regBracketsPro = new RegExp('[{[}]|]', 'g');
      let message = true;
      if (value && !(value !== null && value !== void 0 && (_value$match = value.match) !== null && _value$match !== void 0 && _value$match.call(value, regNum)) || value !== null && value !== void 0 && (_value$match2 = value.match) !== null && _value$match2 !== void 0 && (_value$match2$call = _value$match2.call(value, regNum)) !== null && _value$match2$call !== void 0 && _value$match2$call.some(_key => {
        var _get;
        return Number(_key) > (record === null || record === void 0 ? void 0 : (_get = record.get('conditions')) === null || _get === void 0 ? void 0 : _get.length);
      })) {
        message = intl.get('hmde.common.conditionalRelation.errorMes1').d('校验不通过，请按照参考示例输写筛选逻辑！');
      }
      if (value !== null && value !== void 0 && value.match(regStr) && !(value !== null && value !== void 0 && (_value$match3 = value.match) !== null && _value$match3 !== void 0 && (_value$match3$call = _value$match3.call(value, regStr)) !== null && _value$match3$call !== void 0 && _value$match3$call.every(str => str === ' AND ' || str === ' OR '))) {
        message = intl.get('hmde.common.conditionalRelation.errorMes1').d('校验不通过，请按照参考示例输写筛选逻辑！');
      }
      if (regBracketsPro.test(value)) {
        message = intl.get('hmde.common.conditionalRelation.errorMes2').d('校验不通过，请按照参考示例输写，当前仅支持“()”');
      }
      if (value !== null && value !== void 0 && (_value$match4 = value.match) !== null && _value$match4 !== void 0 && _value$match4.call(value, regBrackets) && !isBracketsValid(value === null || value === void 0 ? void 0 : (_value$match5 = value.match) === null || _value$match5 === void 0 ? void 0 : (_value$match5$call = _value$match5.call(value, regBrackets)) === null || _value$match5$call === void 0 ? void 0 : _value$match5$call.join())) {
        message = intl.get('hmde.common.conditionalRelation.errorMes3').d('校验不通过，你输入的括号匹配错误！');
      }
      return message;
    }
  }, {
    name: 'conditionExpression',
    // 条件表达式
    type: 'string'
  }],
  children: {
    conditionLines: new _DataSet({
      dataToJSON: 'normal',
      fields: [{
        name: 'orderSeq',
        type: 'number'
      }, {
        name: 'conditionLineId',
        type: 'string'
      }, {
        name: 'conditionHeaderId',
        type: 'string'
      }, {
        name: 'leftValueType',
        type: 'string',
        defaultValue: 'CURRENT_FIELD',
        textField: 'meaning',
        valueField: 'value',
        options: new _DataSet({
          data: [{
            meaning: intl.get('hmde.bo.flow.condition.associationField').d('关联业务对象字段'),
            value: 'BO_FIELD'
          }, {
            meaning: intl.get('hmde.bo.flow.condition.currentField').d('当前对象字段'),
            value: 'CURRENT_FIELD'
          }]
        })
      }, {
        name: 'leftValue',
        type: 'string',
        required: true,
        computedProps: {
          textField: ({
            record
          }) => {
            if ((record === null || record === void 0 ? void 0 : record.get('leftValueType')) === 'CURRENT_FIELD') {
              return 'businessObjectFieldName';
            }
          },
          valueField: ({
            record
          }) => {
            if ((record === null || record === void 0 ? void 0 : record.get('leftValueType')) === 'CURRENT_FIELD') {
              return 'businessObjectFieldCode';
            }
          },
          lookupAxiosConfig: ({
            record
          }) => {
            if ((record === null || record === void 0 ? void 0 : record.get('leftValueType')) === 'CURRENT_FIELD') {
              return {
                url: `${lowcodeOrganizationURL({
                  route: HZERO_HMDE
                })}/business-object-fields/list-by-code`,
                method: 'GET',
                params: {
                  businessObjectCodeList: businessObjectCode
                }
              };
            }
          }
        }
      }, {
        name: 'operatorType',
        type: 'string',
        textField: 'meaning',
        valueField: 'value',
        // lookupCode: 'HMDE.FILTER_CONDITION',
        computedProps: {
          required: ({
            record
          }) => record === null || record === void 0 ? void 0 : record.get('leftValue'),
          options: ({
            record
          }) => (record === null || record === void 0 ? void 0 : record.get('leftValue')) && new _DataSet({
            paging: false,
            data: [{
              meaning: intl.get('hmde.common.equal').d('等于'),
              value: 'EQUAL'
            }, {
              meaning: intl.get('hmde.common.notEqual').d('不等于'),
              value: 'NOT_EQUAL'
            }, {
              meaning: intl.get('hmde.common.greaterThanOrEqualTo').d('大于等于'),
              value: 'GREATER_THAN_OR_EQUAL_TO'
            }, {
              meaning: intl.get('hmde.common.greaterThan').d('大于'),
              value: 'GREATER_THAN'
            }, {
              meaning: intl.get('hmde.common.lessThan').d('小于'),
              value: 'LESS_THAN'
            }, {
              meaning: intl.get('hmde.common.lessThanOrEqualTo').d('小于等于'),
              value: 'LESS_THAN_OR_EQUAL_TO'
            }, {
              meaning: intl.get('hmde.common.isNull').d('为空'),
              value: 'IS_NULL'
            }, {
              meaning: intl.get('hmde.common.isNotNull').d('非空'),
              value: 'IS_NOT_NULL'
            }]
          })
        }
      }, {
        name: 'rightValueType',
        type: 'string',
        textField: 'meaning',
        valueField: 'value',
        computedProps: {
          options: ({
            record
          }) => (record === null || record === void 0 ? void 0 : record.get('operatorType')) && new _DataSet({
            paging: false,
            data: [{
              meaning: intl.get('hmde.common.fixedValue').d('固定值'),
              value: 'FIXED'
            }, {
              meaning: intl.get('hmde.bo.flow.condition.associationField').d('关联业务对象字段'),
              value: 'BO_FIELD'
            }, {
              meaning: intl.get('hmde.bo.flow.condition.currentField').d('当前对象字段'),
              value: 'CURRENT_FIELD'
            }]
          }),
          required: ({
            record
          }) => (record === null || record === void 0 ? void 0 : record.get('operatorType')) && !['IS_NULL', 'IS_NOT_NULL', 'IS_TRUE', 'IS_FALSE'].includes(record === null || record === void 0 ? void 0 : record.get('operatorType'))
        }
      }, {
        name: 'rightValue',
        type: 'auto',
        computedProps: {
          textField: ({
            record
          }) => {
            if ((record === null || record === void 0 ? void 0 : record.get('rightValueType')) === 'CURRENT_FIELD') {
              return 'businessObjectFieldName';
            }
          },
          valueField: ({
            record
          }) => {
            if ((record === null || record === void 0 ? void 0 : record.get('rightValueType')) === 'CURRENT_FIELD') {
              return 'businessObjectFieldCode';
            }
          },
          lookupAxiosConfig: ({
            record
          }) => {
            if ((record === null || record === void 0 ? void 0 : record.get('rightValueType')) === 'CURRENT_FIELD') {
              return {
                url: `${lowcodeOrganizationURL({
                  route: HZERO_HMDE
                })}/business-object-fields/list-by-code`,
                method: 'GET',
                params: {
                  businessObjectCodeList: businessObjectCode
                }
              };
            }
          },
          required: ({
            record
          }) => record === null || record === void 0 ? void 0 : record.get('rightValueType'),
          lookupCode: ({
            record
          }) => {
            if (record && ((record === null || record === void 0 ? void 0 : record.get('optionSettings')) === '_valueList' || record !== null && record !== void 0 && record.get('lovCode')) && (record === null || record === void 0 ? void 0 : record.get('rightValueType')) === 'FIXED') {
              return record === null || record === void 0 ? void 0 : record.get('lovCode');
            }
          },
          options: ({
            record
          }) => {
            if (record && ((record === null || record === void 0 ? void 0 : record.get('optionSettings')) === '_custom' || !!(record !== null && record !== void 0 && record.get('customOptionList'))) && (record === null || record === void 0 ? void 0 : record.get('rightValueType')) === 'FIXED') {
              var _ref;
              return new _DataSet({
                paging: false,
                data: (_ref = (record === null || record === void 0 ? void 0 : record.get('customOptionList')) || []) === null || _ref === void 0 ? void 0 : _ref.map(item => {
                  var _item$meaning;
                  return {
                    meaning: item === null || item === void 0 ? void 0 : (_item$meaning = item.meaning) === null || _item$meaning === void 0 ? void 0 : _item$meaning[getCurrentLanguage()],
                    value: item === null || item === void 0 ? void 0 : item.value,
                    order: item === null || item === void 0 ? void 0 : item.order
                  };
                })
              });
            }
            if (record && (record === null || record === void 0 ? void 0 : record.get('componentType')) === 'SWITCH' && (record === null || record === void 0 ? void 0 : record.get('rightValueType')) === 'FIXED') {
              return new _DataSet({
                paging: false,
                data: [{
                  meaning: intl.get('hmde.common.button.open').d('开启'),
                  value: 1
                }, {
                  meaning: intl.get('hmde.common.button.close').d('关闭'),
                  value: 0
                }]
              });
            }
          },
          format: ({
            record
          }) => {
            const componentType = record === null || record === void 0 ? void 0 : record.get('componentType');
            const rightValueType = record === null || record === void 0 ? void 0 : record.get('rightValueType');
            if (rightValueType === 'FIXED') {
              if (componentType === 'DATE_SELECTION_BOX') {
                return 'YYYY-MM-DD';
              } else if (componentType === 'DATETIME_SELECTION_BOX') {
                return 'YYYY-MM-DD HH:mm:ss';
              }
            }
          }
        },
        transformRequest: (value, record) => {
          if (Array.isArray(value)) {
            return value.map(item => {
              if (moment.isMoment(item)) {
                const componentType = record === null || record === void 0 ? void 0 : record.get('componentType');
                return item.format(componentType === 'DATE_SELECTION_BOX' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss');
              } else {
                return item;
              }
            }).join(',');
          }
          if (moment.isMoment(value)) {
            const componentType = record === null || record === void 0 ? void 0 : record.get('componentType');
            return value.format(componentType === 'DATE_SELECTION_BOX' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss');
          }
          return value;
        },
        transformResponse: (value, object) => {
          const _ref2 = object || {},
            componentType = _ref2.componentType,
            rightValueType = _ref2.rightValueType,
            operatorType = _ref2.operatorType;
          if (['DATE_SELECTION_BOX', 'DATETIME_SELECTION_BOX'].includes(componentType) && rightValueType === 'FIXED') {
            if (['BETWEEN', 'NOT_BETWEEN'].includes(operatorType)) {
              var _value$split;
              return value === null || value === void 0 ? void 0 : (_value$split = value.split(',')) === null || _value$split === void 0 ? void 0 : _value$split.map(item => moment(item, componentType === 'DATE_SELECTION_BOX' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'));
            } else {
              return moment(value, componentType === 'DATE_SELECTION_BOX' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss');
            }
          } else if (['RADIO', 'SINGLE_SELECT', 'CHECKBOX', 'MULTIPLE_SELECT'].includes(componentType) && rightValueType === 'FIXED') {
            if (['WHEREIN', 'NOT_WHEREIN'].includes(operatorType)) {
              return value === null || value === void 0 ? void 0 : value.split(',');
            }
          }
          return value;
        }
      }, {
        name: 'attributeJson',
        type: 'object',
        ignore: 'always'
      }, {
        name: 'optionSettings',
        type: 'string',
        bind: 'attributeJson.optionSettings',
        ignore: 'always'
      }, {
        name: 'lovCode',
        type: 'string',
        ignore: 'always'
      }, {
        name: 'customOptionList',
        type: 'object',
        bind: 'attributeJson.customOptionList',
        ignore: 'always'
      }],
      events: {
        create: ({
          record
        }) => {
          record === null || record === void 0 ? void 0 : record.set('orderSeq', record.index + 1);
        },
        update: ({
          record,
          name,
          value
        }) => {
          if (name === 'leftValueType') {
            record === null || record === void 0 ? void 0 : record.set('leftValue', undefined);
          }
          if (name === 'leftValue') {
            record === null || record === void 0 ? void 0 : record.set('operatorType', undefined);
            if (value) {
              var _record$getField, _record$getField$call, _record$getField$call2;
              const _ref3 = (record === null || record === void 0 ? void 0 : (_record$getField = record.getField) === null || _record$getField === void 0 ? void 0 : (_record$getField$call = _record$getField.call(record, name)) === null || _record$getField$call === void 0 ? void 0 : (_record$getField$call2 = _record$getField$call.getLookupData) === null || _record$getField$call2 === void 0 ? void 0 : _record$getField$call2.call(_record$getField$call, value)) || {},
                componentType = _ref3.componentType,
                attributeJson = _ref3.attributeJson,
                lovCode = _ref3.lovCode;
              if (componentType) {
                record === null || record === void 0 ? void 0 : record.set('componentType', componentType);
                if (['RADIO', 'SINGLE_SELECT', 'CHECKBOX', 'MULTIPLE_SELECT'].includes(componentType)) {
                  record === null || record === void 0 ? void 0 : record.set('attributeJson', attributeJson);
                  record === null || record === void 0 ? void 0 : record.set('lovCode', lovCode);
                }
              }
            }
          }
          if (name === 'operatorType') record === null || record === void 0 ? void 0 : record.set('rightValueType', undefined);
          if (name === 'rightValueType') record === null || record === void 0 ? void 0 : record.set('rightValue', undefined);
        }
      }
    })
  },
  data,
  events: {
    create: ({
      record
    }) => {
      record === null || record === void 0 ? void 0 : record.set('orderSeq', record.index + 1);
      record === null || record === void 0 ? void 0 : record.set('conditionCode', uuid());
    },
    update: async ({
      name,
      record,
      value,
      oldValue
    }) => {
      if (name === 'conditionMode' && value === ConditionMode.expression) {
        var _record$dataSet, _record$dataSet$child, _conditionLineDS$vali;
        const conditionLineDS = (_record$dataSet = record.dataSet) === null || _record$dataSet === void 0 ? void 0 : (_record$dataSet$child = _record$dataSet.children) === null || _record$dataSet$child === void 0 ? void 0 : _record$dataSet$child.conditionLines;
        if (await (conditionLineDS === null || conditionLineDS === void 0 ? void 0 : (_conditionLineDS$vali = conditionLineDS.validate) === null || _conditionLineDS$vali === void 0 ? void 0 : _conditionLineDS$vali.call(conditionLineDS))) {
          const conditionLineRelation = (record === null || record === void 0 ? void 0 : record.get('conditionLineRelation')) || '';
          if (conditionLineRelation && !(record !== null && record !== void 0 && record.get('conditionExpression'))) {
            const lineDataList = conditionLineDS.toData() || [];
            const conditionExpression = conditionLineRelation.replace(/[\d]+/g, number => {
              var _lineDataList$find;
              const lineData = lineDataList === null || lineDataList === void 0 ? void 0 : (_lineDataList$find = lineDataList.find) === null || _lineDataList$find === void 0 ? void 0 : _lineDataList$find.call(lineDataList, ({
                orderSeq
              }) => String(orderSeq) === number);
              if (lineData) {
                var _operatorTypeMap$get;
                const _ref4 = lineData || {},
                  leftValueType = _ref4.leftValueType,
                  operatorType = _ref4.operatorType,
                  rightValueType = _ref4.rightValueType;
                let _ref5 = lineData || {},
                  leftValue = _ref5.leftValue,
                  rightValue = _ref5.rightValue;
                if (leftValueType === 'CURRENT_FIELD') {
                  leftValue = `#${leftValue}# `;
                }
                if (rightValueType === 'CURRENT_FIELD') {
                  rightValue = `#${rightValue}# `;
                }
                if (operatorType === 'IS_NULL') {
                  return `_isEmpty(${leftValue})`;
                } else if (operatorType === 'IS_NOT_NULL') {
                  return `isNotEmpty(${leftValue})`;
                }
                const operatorTypeMap = new Map([['EQUAL', '=='], ['NOT_EQUAL', '!='], ['GREATER_THAN', '>'], ['GREATER_THAN_OR_EQUAL_TO', '>='], ['LESS_THAN', '<'], ['LESS_THAN_OR_EQUAL_TO', '<=']]);
                return `( ${leftValue} ${(_operatorTypeMap$get = operatorTypeMap.get(operatorType)) !== null && _operatorTypeMap$get !== void 0 ? _operatorTypeMap$get : operatorType} ${rightValue} )`;
              } else {
                return ``;
              }
            }).replace('AND', '&&').replace('OR', '||');
            record === null || record === void 0 ? void 0 : record.set('conditionExpression', conditionExpression);
          }
        } else {
          record === null || record === void 0 ? void 0 : record.set(name, oldValue);
        }
      }
    },
    validate: async ({
      dataSet,
      result
    }) => {
      if (await result) {
        dataSet.data.sort((a, b) => a.get('orderSeq') - b.get('orderSeq') || a.get('defaultFlag') - b.get('defaultFlag')).forEach((record, index) => {
          record === null || record === void 0 ? void 0 : record.set('orderSeq', index + 1);
        });
      }
    }
  }
});