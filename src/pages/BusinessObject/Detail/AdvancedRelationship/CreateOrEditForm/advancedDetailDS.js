import _DataSet from "choerodon-ui/pro/lib/data-set";
import React from 'react';
import intl from 'utils/intl';
// import { nanoid } from 'nanoid';
import { isTenantRoleLevel, getCurrentOrganizationId } from 'utils/utils';
import { DataToJSON, DataSetSelection } from 'choerodon-ui/pro/lib/data-set/enum';
import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';
import moment from 'moment';
import { isBracketsValid } from "hzero-front-hmde/lib/routes/Modeler/utils/utils";
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import LabelTitleRender from "hzero-front-hmde/lib/businessComponents/LabelTitleRender";
import { lowcodeOrganizationURL, stringToEntity, entityToString } from "hzero-front-hmde/lib/utils/common";
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import { PhysicalModelType } from "hzero-front-hmde/lib/constants/businessObject";
import { FN } from "./type";
const isTenant = isTenantRoleLevel();
const tenantId = getCurrentOrganizationId();
const hasRepeat = (advancedListDs, preStr, currentNumber, businessObjectCode) => {
  const res = advancedListDs === null || advancedListDs === void 0 ? void 0 : advancedListDs.some(ele => (ele === null || ele === void 0 ? void 0 : ele.get('associateCode')) === `${businessObjectCode}_${isTenant ? 'C' : 'S'}_${preStr}${currentNumber}`);
  return res;
};
const getNoRepeatValue = (advancedListDs, preStr, businessObjectCode) => {
  let currentNumber = (advancedListDs === null || advancedListDs === void 0 ? void 0 : advancedListDs.totalCount) + 1;
  while (hasRepeat(advancedListDs, preStr, currentNumber, businessObjectCode)) {
    currentNumber++;
  }
  return `${preStr}${currentNumber}`;
};

// const dealIdAndParentId = (list) => {
//   const arr: any = [];
//   const _dealIdAndParentId = (_list, parentId?) => {
//     if (Array.isArray(_list)) {
//       _list.forEach((i) => {
//         const children = i?.validRuleFields || [];
//         if (!i?.businessObjectFieldCode && !i?.ruleCode) {
//           arr.push({
//             ...children[0],
//             id: nanoid(),
//             parentId: null,
//             ruleName: children[0]?.businessObjectFieldName,
//             ruleCode: 'PRIMARY_KEY',
//           });
//         } else {
//           // 包裹主键的后端构造的规则对象
//           Object.assign(i, {
//             id: nanoid(),
//             parentId,
//             ruleName: i?.ruleName || i?.businessObjectFieldName,
//             ruleCode: i?.ruleCode || i?.businessObjectFieldCode,
//           });
//           arr.push(i);
//           if (Array.isArray(i?.validRuleFields)) {
//             _dealIdAndParentId(i?.validRuleFields, i.id);
//           }
//         }
//       });
//     }
//   };
//   _dealIdAndParentId(list);
//   return arr;
// };

export default (({
  type,
  businessObjectCode,
  advancedListDs,
  baseInfoDS
}) => {
  var _baseInfoDS$current;
  const physicalModelType = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('physicalModelType');
  return {
    autoCreate: true,
    autoQuery: false,
    paging: false,
    transport: {
      read: ({
        dataSet,
        params
      }) => {
        const businessObjectAssociateId = dataSet === null || dataSet === void 0 ? void 0 : dataSet.getState('businessObjectAssociateId');
        const showVersion = dataSet === null || dataSet === void 0 ? void 0 : dataSet.getState('showVersion');
        return {
          url: `${lowcodeOrganizationURL({
            route: HZERO_HMDE
          })}/business-object-associates/${businessObjectAssociateId}`,
          method: 'GET',
          params: {
            ...params,
            version: showVersion
          }
        };
      }
    },
    fields: [{
      name: FN.MASTER_BUSINESS_OBJECT_ID,
      // 当前业务对象id
      type: 'string'
    }, {
      name: FN.ASSOCIATE_NAME,
      type: 'intl',
      label: intl.get('hmde.bo.businessObject.associateName').d('关系名称'),
      required: true
    }, {
      name: FN.ASSOCIATE_CODE,
      type: 'string',
      label: intl.get('hmde.bo.businessObject.associateCode').d('关系编码'),
      pattern: /^[a-zA-Z0-9_]*$/,
      format: 'uppercase',
      defaultValidationMessages: {
        patternMismatch: intl.get('hmde.bo.businessObject.patternValidation').d('支持大写字母、数字及下划线组合')
      },
      dynamicProps: {
        required: () => type === 'create',
        defaultValue: () => {
          const defaultValue = getNoRepeatValue(advancedListDs, `RELATION`, businessObjectCode);
          return defaultValue;
        }
      }
    }, {
      name: FN.MASTER_BUSINESS_OBJECT_NAME,
      type: 'string',
      label: intl.get('hmde.bo.businessObject.currentBusinessObject').d('当前对象')
    }, {
      name: FN.MASTER_BUSINESS_OBJECT_CODE,
      type: 'string'
    }, {
      name: FN.MASTER_BUSINESS_OBJECT,
      label: intl.get('hmde.common.relevanceObject').d('关联对象'),
      required: true,
      type: 'object',
      ignore: 'always',
      textField: 'businessObjectName',
      valueField: 'businessObjectId',
      lovCode: isTenant ? 'HMDE.BUSINESS_OBJECT' : 'HMDE.BUSINESS_OBJECT.SITE',
      lovPara: {
        masterBusinessObjectCode: businessObjectCode,
        physicalModelType: physicalModelType === PhysicalModelType.API ? '' : [PhysicalModelType.SQL, PhysicalModelType.TABLE].join(','),
        domainEnabledFlag: true
      },
      dynamicProps: {
        help: ({
          record
        }) => record === null || record === void 0 ? void 0 : record.get('usedInfo'),
        disabled: ({
          record
        }) => !!(record !== null && record !== void 0 && record.get('usedInfo'))
      }
    },
    // 高级关系是否被引用标识
    {
      name: 'usedInfo',
      type: 'string',
      ignore: 'always'
    }, {
      name: FN.ASSOCIATE_BUSINESS_OBJECT_ID,
      type: 'string',
      bind: 'associateBusinessObject.businessObjectId'
    }, {
      name: FN.ASSOCIATE_BUSINESS_OBJECT_CODE,
      type: 'string',
      bind: 'associateBusinessObject.businessObjectCode'
    }, {
      name: FN.ASSOCIATE_BUSINESS_OBJECT_NAME,
      // label: intl.get('hmde.bo.businessObject.associateBusinessObject').d('目标对象'),
      type: 'string',
      bind: 'associateBusinessObject.businessObjectName'
    }, {
      name: FN.ASSOCIATE_TYPE,
      type: 'string',
      defaultValue: 'LINK',
      required: true
    }, {
      name: FN.OPTION_TYPE,
      type: 'string',
      defaultValue: 'BUSINESS_OBJECT_OPTION'
    }, {
      name: FN.REFERENCE_LIST,
      label: intl.get('hmde.bo.businessObject.referenceList').d('引用值列表'),
      help: intl.get('hmde.bo.businessObject.referenceList.help').d('被关联字段为单字段时，可配置引用值列表；被关联字段为多字段时，禁止配置引用值列表'),
      type: 'object',
      ignore: 'always',
      dynamicProps: {
        textField: ({
          record
        }) => {
          if ((record === null || record === void 0 ? void 0 : record.get('optionType')) === 'BUSINESS_OBJECT_OPTION') {
            return 'businessObjectOptionName';
          } else if ((record === null || record === void 0 ? void 0 : record.get('optionType')) === 'LOV_VIEW') {
            return 'viewName';
          }
        },
        lovCode: ({
          record
        }) => {
          if ((record === null || record === void 0 ? void 0 : record.get('optionType')) === 'BUSINESS_OBJECT_OPTION') {
            return isTenant ? 'HMDE.BUSINESS_OBJECT_FIELD.AVAILABLE.OPTION' : 'HMDE.BUSINESS_OBJECT_FIELD.AVAILABLE.OPTION.SITE';
          }
          return 'HMDE.LOV_VIEW';
        },
        disabled: ({
          record,
          dataSet
        }) => {
          return !(record !== null && record !== void 0 && record.get('associateBusinessObjectId')) || dataSet.children.businessObjectAssociateFieldList.length > 1;
        },
        lovPara: ({
          record
        }) => ({
          tenantId,
          businessObjectCode: record === null || record === void 0 ? void 0 : record.get('associateBusinessObjectCode')
        })
      }
    }, {
      name: FN.OPTION_DISPLAY_FIELD_OBJECT,
      type: 'object',
      textField: 'businessObjectFieldName',
      valueField: 'businessObjectFieldCode',
      lovCode: isTenant ? 'HMDE.BUSINESS_OBJECT_FIELD' : 'HMDE.BUSINESS_OBJECT_FIELD.SITE',
      dynamicProps: {
        lovPara: ({
          record
        }) => {
          var _baseInfoDS$current2, _baseInfoDS$current3;
          return {
            tenantId,
            businessObjectId: (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : _baseInfoDS$current2.get('physicalModelType')) === 'API' ? baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current3 = baseInfoDS.current) === null || _baseInfoDS$current3 === void 0 ? void 0 : _baseInfoDS$current3.get('businessObjectId') : record === null || record === void 0 ? void 0 : record.get('associateBusinessObjectId')
          };
        },
        // required: ({ record }) => {
        //   return !isTenant && record?.get('optionType') !== 'BUSINESS_OBJECT_OPTION';
        // },
        disabled: ({
          record
        }) => {
          return !(record !== null && record !== void 0 && record.get('associateBusinessObjectId'));
        }
      }
    }, {
      name: FN.OPTION_DISPLAY_FIELD_CODE,
      type: 'string',
      bind: 'optionDisplayFieldObject.businessObjectFieldCode'
    }, {
      name: FN.OPTION_DISPLAY_FIELD_NAME,
      type: 'string',
      bind: 'optionDisplayFieldObject.businessObjectFieldName'
    }, {
      name: FN.BUSINESS_OBJECT_OPTION_CODE,
      type: 'string',
      dynamicProps: {
        bind: ({
          record
        }) => {
          if ((record === null || record === void 0 ? void 0 : record.get('optionType')) === 'BUSINESS_OBJECT_OPTION') {
            return 'referenceList.businessObjectOptionCode';
          }
          return 'referenceList.viewCode';
        }
      }
    }, {
      name: FN.BUSINESS_OBJECT_OPTION_NAME,
      type: 'string',
      dynamicProps: {
        bind: ({
          record
        }) => {
          if ((record === null || record === void 0 ? void 0 : record.get('optionType')) === 'BUSINESS_OBJECT_OPTION') {
            return 'referenceList.businessObjectOptionName';
          }
          return 'referenceList.viewName';
        }
      }
    }, {
      name: FN.PREV_CONDITIONS,
      type: 'string',
      ignore: 'always'
    }, {
      name: FN.IS_SHOW_PREV_CONDITION_FIELDS,
      type: 'boolean',
      defaultValue: false,
      ignore: 'always'
    }, {
      name: FN.PREV_CONDITION_FIELDS,
      type: 'object',
      lookupCode: isTenant ? 'HMDE.BUSINESS_OBJECT_ASSOCIATE.AVAILABLE.FIELD' : 'HMDE.BUSINESS_OBJECT_ASSOCIATE.AVAILABLE.FIELD.SITE',
      textField: 'businessObjectFieldName',
      valueField: 'businessObjectFieldCode',
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: () => {
          var _baseInfoDS$current4;
          return {
            uniqueFlag: false,
            // 允许非查重字段
            ignorePrimary: true,
            // 忽略主键
            associateFieldType: 'CONSTANT',
            publishFlag: false,
            businessObjectId: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current4 = baseInfoDS.current) === null || _baseInfoDS$current4 === void 0 ? void 0 : _baseInfoDS$current4.get('businessObjectId')
          };
        },
        required: ({
          record
        }) => {
          return record === null || record === void 0 ? void 0 : record.get('isShowPrevConditionFields');
        }
      }
    }, {
      name: FN.COMPONENT_TYPE,
      bind: 'prevConditionFields.componentType'
    }, {
      name: FN.MASTER_BUSINESS_OBJECT_FIELD_CODE,
      bind: 'prevConditionFields.businessObjectFieldCode'
    }, {
      name: FN.MASTER_BUSINESS_OBJECT_FIELD_NAME,
      type: 'string',
      bind: 'prevConditionFields.businessObjectFieldName'
    }, {
      name: FN.ASSOCIATE_VALUE,
      validator: (val, _, record) => {
        var _record$get;
        const par = /\w+[@][a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)+/;
        if (val && (record === null || record === void 0 ? void 0 : (_record$get = record.get(FN.PREV_CONDITION_FIELDS)) === null || _record$get === void 0 ? void 0 : _record$get.componentType) === FieldComponentType.EMAIL) {
          if (!par.test(val)) {
            return intl.get('hmde.bo.businessObject.emailformat').d('请输入正确的邮箱格式');
          }
        }
      },
      transformRequest: (val, record) => {
        var _record$getField;
        let _val;
        const _type = record === null || record === void 0 ? void 0 : (_record$getField = record.getField('associateValue')) === null || _record$getField === void 0 ? void 0 : _record$getField.type;
        if (![undefined, 'number', 'boolean', 'intl', 'object', 'bigNumber'].includes(_type)) {
          var _val2;
          if (_type === 'date') {
            _val = moment(val).format('YYYY-MM-DD');
          } else {
            _val = val;
          }
          // eslint-disable-next-line no-useless-escape
          const pat =
          // eslint-disable-next-line no-useless-escape
          /[`~!\\@#$%^&*()_\-+=<>?\\:"{}|,.\/\\;'\\[\]·~！\\@#￥%……&*（）——\-+={}|《》\\？\\：“”【】、‘'，。、\\；]/gim;
          _val = (_val2 = _val) === null || _val2 === void 0 ? void 0 : _val2.replace(pat, r => stringToEntity(r, 0));
          // const _val = val?.replace(pat, (r) => encodeURI(r));
          return _val;
        }
        return val;
      },
      dynamicProps: {
        type: ({
          record
        }) => {
          switch (record === null || record === void 0 ? void 0 : record.get('componentType')) {
            case FieldComponentType.DATE_SELECTION_BOX:
              return 'date';
            case FieldComponentType.DATETIME_SELECTION_BOX:
              return 'dateTime';
            case FieldComponentType.NUMBER_FIELD:
            case FieldComponentType.FLOAT:
            case FieldComponentType.PERCENTAGE:
            case FieldComponentType.MONEY:
              return 'number';
            default:
              return 'string';
          }
        },
        transformResponse: ({
          record
        }) => {
          // eslint-disable-next-line no-useless-escape
          const pat = /\&(.*?)\;/g;
          switch (record === null || record === void 0 ? void 0 : record.get('componentType')) {
            case FieldComponentType.DATE_SELECTION_BOX:
              return val => moment(val === null || val === void 0 ? void 0 : val.replace(pat, r => entityToString(r)), 'YYYY-MM-DD');
            case FieldComponentType.NUMBER_FIELD:
            case FieldComponentType.FLOAT:
            case FieldComponentType.PERCENTAGE:
            case FieldComponentType.MONEY:
              return val => val;
            default:
              return val => val === null || val === void 0 ? void 0 : val.replace(pat, r => entityToString(r));
          }
        },
        required: ({
          record
        }) => {
          return record === null || record === void 0 ? void 0 : record.get('isShowPrevConditionFields');
        }
      }
    }, {
      name: FN.ASSOCIATE_VALUE_MEANING,
      type: 'string'
    }, {
      name: FN.LINK_RELATION_TYPE,
      type: 'string',
      label: /*#__PURE__*/React.createElement(LabelTitleRender, {
        value: intl.get('hmde.common.linkRelationType').d('关联关系'),
        customerDom: /*#__PURE__*/React.createElement(ImgIcon, {
          name: "association-way.svg",
          style: {
            height: 350,
            width: 300
          }
        })
      }),
      options: (() => {
        return new _DataSet({
          paging: false,
          selection: "single",
          data: [{
            meaning: '1 : N',
            value: 'ONE_TO_MANY'
          }, {
            meaning: '1 : 1',
            value: 'ONE_TO_ONE'
          }]
        });
      })(),
      dynamicProps: {
        required: ({
          record
        }) => (record === null || record === void 0 ? void 0 : record.get('associateType')) === 'SLAVE_MASTER'
      },
      defaultValue: 'ONE_TO_MANY'
    }, {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get('hmde.common.enabledFlag').d('启用状态'),
      defaultValue: true
    }, {
      name: FN.LOGIC_FORMULA,
      type: 'string',
      format: 'uppercase',
      validator: async (value = '', _, record) => {
        var _record$dataSet, _value$match, _value$match2, _value$match2$call, _value$match3, _value$match3$call, _value$match4, _value$match5, _value$match5$call;
        if (!(record !== null && record !== void 0 && (_record$dataSet = record.dataSet) !== null && _record$dataSet !== void 0 && _record$dataSet.getState('filterDsLength'))) return true;
        const regNum = new RegExp('[0-9]+', 'g');
        const regBrackets = new RegExp('[()]', 'g');
        const regStr = new RegExp('[A-Z ]+', 'g');
        const regBracketsPro = new RegExp('[{[}]|]', 'g');
        let message = true;
        if (value === null || value.trim().length === 0 || value && !(value !== null && value !== void 0 && (_value$match = value.match) !== null && _value$match !== void 0 && _value$match.call(value, regNum)) || value !== null && value !== void 0 && (_value$match2 = value.match) !== null && _value$match2 !== void 0 && (_value$match2$call = _value$match2.call(value, regNum)) !== null && _value$match2$call !== void 0 && _value$match2$call.some(_key => {
          var _record$get2;
          return Number(_key) > (record === null || record === void 0 ? void 0 : (_record$get2 = record.get('conditions')) === null || _record$get2 === void 0 ? void 0 : _record$get2.length);
        })) {
          message = intl.get('hmde.common.conditionalRelation.errorMes1').d('校验不通过，请按照参考示例输写筛选逻辑！');
        }
        if (value !== null && value !== void 0 && value.match(regStr) && !(value !== null && value !== void 0 && (_value$match3 = value.match) !== null && _value$match3 !== void 0 && (_value$match3$call = _value$match3.call(value, regStr)) !== null && _value$match3$call !== void 0 && _value$match3$call.every(str => str.trim() === 'AND' || str.trim() === 'OR'))) {
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
    }],
    children: {
      // 已有编码规则
      businessObjectAssociateFieldList: new _DataSet({
        primaryKey: 'masterBusinessObjectFieldCode',
        selection: false,
        paging: false,
        dataToJSON: "all",
        fields: [{
          name: 'relationField',
          type: 'object',
          label: intl.get('hmde.bo.businessObject.glField').d('关联字段'),
          help: intl.get('hmde.bo.businessObject.glTip1').d('可选择文本、下拉单选、下拉多选、单选、复选、电子邮箱、手机号码、自动编号、整数、开关、日期类型字段'),
          textField: 'businessObjectFieldName',
          valueField: 'businessObjectFieldCode',
          ignore: 'always',
          noCache: true,
          required: true,
          lookupCode: isTenant ? 'HMDE.BUSINESS_OBJECT_ASSOCIATE.AVAILABLE.FIELD' : 'HMDE.BUSINESS_OBJECT_ASSOCIATE.AVAILABLE.FIELD.SITE',
          dynamicProps: {
            lovPara: ({
              dataSet
            }) => {
              var _baseInfoDS$current5;
              const selectedFieldList = dataSet.toData().filter(field => field === null || field === void 0 ? void 0 : field.masterBusinessObjectFieldCode).map(item => item === null || item === void 0 ? void 0 : item.masterBusinessObjectFieldCode);
              return {
                uniqueFlag: false,
                // 允许非查重字段
                selectedFieldList: selectedFieldList.toString(),
                associateFieldType: 'FIELD',
                publishFlag: false,
                ignorePrimary: true,
                businessObjectId: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current5 = baseInfoDS.current) === null || _baseInfoDS$current5 === void 0 ? void 0 : _baseInfoDS$current5.get('businessObjectId')
              };
            }
          }
        }, {
          name: 'masterBusinessObjectFieldCode',
          type: 'string',
          bind: 'relationField.businessObjectFieldCode'
        }, {
          name: 'masterBusinessObjectFieldName',
          type: 'string',
          bind: 'relationField.businessObjectFieldName'
        }, {
          name: 'associateFieldType',
          type: 'string',
          defaultValue: 'FIELD'
        }, {
          name: 'associateBusinessObjectFieldName',
          label: intl.get('hmde.bo.businessObject.bGlField').d('被关联字段'),
          type: 'string'
        }, {
          name: 'associateBusinessObjectFieldCode',
          type: 'string',
          required: true
        }, {
          name: 'childReferenceList',
          label: intl.get('hmde.bo.businessObject.referenceList').d('引用值列表'),
          help: intl.get('hmde.bo.businessObject.glTip2').d('当关联字段为选项类或开关字段时，无需引用值列表，字段存储本身的独立值集值或自定义选项值；当关联字段字段非选项类或开关字段，且被关联字段非关联、从主字段或无条件单字段高级关系字段时，可引用关联对象的值列表；当关联字段字段非选项类或开关字段，且被关联字段为关联、从主字段或无条件单字段高级关系字段时，可引用被关联字段的关联对象的值列表'),
          type: 'object',
          ignore: 'always',
          textField: 'businessObjectOptionName',
          dynamicProps: {
            textField: ({
              record
            }) => {
              if ((record === null || record === void 0 ? void 0 : record.get('optionType')) === 'BUSINESS_OBJECT_OPTION') {
                return 'businessObjectOptionName';
              } else {
                return 'lovName';
              }
            },
            lovQueryUrl: ({
              record
            }) => {
              if ((record === null || record === void 0 ? void 0 : record.get('optionType')) === 'BUSINESS_OBJECT_OPTION') {
                return `${lowcodeOrganizationURL({
                  route: HZERO_HMDE
                })}/business-object-options/associate-field-cond/list`;
              }
            },
            lovCode: ({
              record
            }) => {
              if ((record === null || record === void 0 ? void 0 : record.get('optionType')) === 'BUSINESS_OBJECT_OPTION') {
                return isTenant ? 'HMDE.BUSINESS_OBJECT_FIELD.AVAILABLE.OPTION' : 'HMDE.BUSINESS_OBJECT_FIELD.AVAILABLE.OPTION.SITE';
              }
              return 'HMDE.LOV_VIEW';
            },
            disabled: ({
              dataSet,
              record
            }) => {
              var _dataSet$parent, _dataSet$parent$curre;
              return !(record !== null && record !== void 0 && record.get('associateBusinessObjectFieldCode')) || !(dataSet !== null && dataSet !== void 0 && (_dataSet$parent = dataSet.parent) !== null && _dataSet$parent !== void 0 && (_dataSet$parent$curre = _dataSet$parent.current) !== null && _dataSet$parent$curre !== void 0 && _dataSet$parent$curre.get('associateBusinessObjectCode'));
            },
            lovPara: ({
              dataSet,
              record
            }) => {
              var _dataSet$parent2, _dataSet$parent2$curr;
              return {
                businessObjectCode: dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$parent2 = dataSet.parent) === null || _dataSet$parent2 === void 0 ? void 0 : (_dataSet$parent2$curr = _dataSet$parent2.current) === null || _dataSet$parent2$curr === void 0 ? void 0 : _dataSet$parent2$curr.get('associateBusinessObjectCode'),
                businessObjectFieldCode: record === null || record === void 0 ? void 0 : record.get('associateBusinessObjectFieldCode'),
                multipleFieldFlag: (dataSet === null || dataSet === void 0 ? void 0 : dataSet.length) > 1
              };
            }
          }
        }, {
          name: 'optionCode',
          type: 'string',
          dynamicProps: {
            bind: ({
              record
            }) => {
              if ((record === null || record === void 0 ? void 0 : record.get('optionType')) === 'BUSINESS_OBJECT_OPTION') {
                return 'childReferenceList.businessObjectOptionCode';
              } else {
                return 'childReferenceList.viewCode';
              }
            }
          }
        }, {
          name: 'optionType',
          type: 'string',
          // bind: 'childReferenceList.businessObjectOptionType',
          lookupCode: 'HMDE.OPTION.TYPE',
          defaultValue: 'BUSINESS_OBJECT_OPTION',
          required: true
        }, {
          name: 'optionName',
          type: 'string',
          // bind: 'childReferenceList.businessObjectOptionName',
          dynamicProps: {
            bind: ({
              record
            }) => {
              if ((record === null || record === void 0 ? void 0 : record.get('optionType')) === 'BUSINESS_OBJECT_OPTION') {
                return 'childReferenceList.businessObjectOptionName';
              } else {
                return 'childReferenceList.lovName';
              }
            }
          }
        }, {
          name: 'refBusinessObjectCode',
          type: 'string'
          // bind: 'childReferenceList.businessObjectCode',
        }, {
          label: intl.get('hmde.bo.businessObject.displayField').d('显示字段'),
          name: 'optionDisplayFieldCode',
          type: 'string',
          textField: 'businessObjectFieldName',
          valueField: 'businessObjectFieldCode',
          help: intl.get('hmde.bo.businessObject.glTip3').d('不配置显示字段，查询时字段按引用的值列表的显示字段进行回显；配置显示字段，查询时字段按配置的显示字段进行回显'),
          dynamicProps: {
            lookupAxiosConfig: ({
              record,
              dataSet
            }) => {
              var _baseInfoDS$current6, _baseInfoDS$current7, _dataSet$parent3, _dataSet$parent3$curr;
              const bCode = (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current6 = baseInfoDS.current) === null || _baseInfoDS$current6 === void 0 ? void 0 : _baseInfoDS$current6.get('physicalModelType')) === 'API' ? baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current7 = baseInfoDS.current) === null || _baseInfoDS$current7 === void 0 ? void 0 : _baseInfoDS$current7.get('businessObjectCode') : (record === null || record === void 0 ? void 0 : record.get('refBusinessObjectCode')) || ((_dataSet$parent3 = dataSet.parent) === null || _dataSet$parent3 === void 0 ? void 0 : (_dataSet$parent3$curr = _dataSet$parent3.current) === null || _dataSet$parent3$curr === void 0 ? void 0 : _dataSet$parent3$curr.get('associateBusinessObjectCode'));
              if (!bCode) return {};
              return {
                url: `${lowcodeOrganizationURL({
                  route: HZERO_HMDE
                })}/business-object-fields/list-by-code`,
                method: 'GET',
                params: {
                  businessObjectCodeList: bCode,
                  primaryKeyFlag: true
                }
              };
            },
            disabled: ({
              record
            }) => {
              return !(record !== null && record !== void 0 && record.get('childReferenceList'));
            },
            required: ({
              record
            }) => {
              return (record === null || record === void 0 ? void 0 : record.get('optionType')) === 'LOV_VIEW';
            }
          }
        },
        // 被关联字段对象信息
        {
          name: 'associatedField',
          type: 'object',
          ignore: 'always'
        }]
      })
    },
    events: {
      update: ({
        name,
        dataSet,
        record,
        value
      }) => {
        // if (name === 'selectRule') {
        //   dataSet.children.businessObjectAssociateFieldList.loadData([]);
        //   // 选中主键
        //   if (!value?.parentId && !value?.validRuleFields) {
        //     dataSet.children.businessObjectAssociateFieldList.create({
        //       ...value,
        //       associateFieldMaxLength: value?.maxLength,
        //       associateFieldRequiredFlag: value?.requiredFlag,
        //       // 存储被关联字段的校验信息
        //       associatedField: {
        //         ...value,
        //         maxLength: value?.maxLength,
        //         requiredFlag: value?.requiredFlag,
        //         componentType: value?.componentType,
        //       },
        //       associateBusinessObjectFieldName: value?.businessObjectFieldName,
        //       associateBusinessObjectFieldCode: value?.businessObjectFieldCode,
        //       associateFieldType: 'FIELD',
        //     });
        //   } else {
        //     // 选中查重规则
        //     const fields = value?.validRuleFields;
        //     fields.forEach((field) => {
        //       dataSet.children.businessObjectAssociateFieldList.create({
        //         ...field,
        //         // 存储被关联字段的校验信息
        //         associatedField: {
        //           ...field,
        //           maxLength: field?.maxLength,
        //           requiredFlag: field?.requiredFlag,
        //           componentType: field?.componentType,
        //         },
        //         // 带出默认的引用值列表
        //         childReferenceList: {
        //           businessObjectOptionName: field?.businessObjectOptionName,
        //           businessObjectOptionCode: field?.businessObjectOptionCode,
        //         },
        //         associateBusinessObjectFieldName: field?.businessObjectFieldName,
        //         associateBusinessObjectFieldCode: field?.businessObjectFieldCode,
        //         associateFieldType: 'FIELD',
        //         optionDisplayFieldCode:
        //           baseInfoDS?.current?.get('physicalModelType') === 'API'
        //             ? undefined
        //             : field.optionDisplayFieldCode,
        //         optionDisplayFieldName:
        //           baseInfoDS?.current?.get('physicalModelType') === 'API'
        //             ? undefined
        //             : field.optionDisplayFieldName,
        //       });
        //     });
        //   }
        // }
        if (name === 'associateBusinessObject') {
          // record?.set('selectRule', null);
          // 高级关系自关联，选择自身业务对象时
          if ((value === null || value === void 0 ? void 0 : value.businessObjectId) === (record === null || record === void 0 ? void 0 : record.get('masterBusinessObjectId'))) {
            dataSet.setState('publishFlag', false);
          } else {
            dataSet.setState('publishFlag', true);
          }
        }
      }
    }
  };
});