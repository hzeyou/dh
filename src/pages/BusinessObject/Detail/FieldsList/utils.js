import _camelCase from "lodash/camelCase";
import _isArray from "lodash/isArray";
import { isTenantRoleLevel, getCurrentOrganizationId } from 'utils/utils';
import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';
import intl from 'utils/intl';
import { SourceType, FieldType } from "hzero-front-apaas/lib/constants/businessObject";
import { handleAttributeJson } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/FieldsList/AddAndEditField/utils";
import { PhysicalModelType } from "hzero-front-hmde/lib/constants/businessObject";
const isTenant = isTenantRoleLevel();
export const getInheritType = fieldObj => {
  // 租户层新建且未选扩展字段则为租户自建扩展字段
  if (isTenant && !(fieldObj !== null && fieldObj !== void 0 && fieldObj.businessObjectFieldId) && !(fieldObj !== null && fieldObj !== void 0 && fieldObj.extendFieldId)) {
    return FieldType.TENANT_CREATED;
  }
  // 领域的扩展表示和业务对象的扩展表示不一样
  const isExtensionField = [FieldType.EXTEND, FieldType.EXTEND_TABLE, FieldType.FLEX_FIELD, FieldType.TENANT_CREATED // 租户继承平台对象自建扩展字段
  ].includes((fieldObj === null || fieldObj === void 0 ? void 0 : fieldObj.fieldType) || (fieldObj === null || fieldObj === void 0 ? void 0 : fieldObj.sourceType)); // 是否为扩展字段
  return !isExtensionField ? FieldType.STANDARD : FieldType.EXTEND;
};

/**
 * 处理业务对象字段 得到需要的参数列表
 * @return Array<field>
 */

export const handleDealFields = (fieldList, options) => {
  const _ref = options || {},
    isFromDomain = _ref.isFromDomain,
    domainId = _ref.domainId,
    category = _ref.category,
    isExtensionField = _ref.isExtensionField;
  let commonAttribute = {};
  let commonJson = {};
  if (_isArray(fieldList)) {
    const _fieldList = fieldList.map(formValues => {
      var _commonAttribute;
      const inheritSourceType = getInheritType(formValues);
      // eslint-disable-next-line no-param-reassign
      // delete formValues.attributeJson;
      commonAttribute = {
        ...formValues,
        businessObjectCode: formValues === null || formValues === void 0 ? void 0 : formValues.businessObjectCode,
        codeDisabled: false,
        defaultDisplayFieldFlag: (formValues === null || formValues === void 0 ? void 0 : formValues.defaultDisplayFieldFlag) || false,
        defaultValueType: (formValues === null || formValues === void 0 ? void 0 : formValues.defaultValueType) || ((formValues === null || formValues === void 0 ? void 0 : formValues.componentType) === FieldComponentType.SWITCH ? 'NORMAL' : 'none'),
        exportableFlag: !!(formValues !== null && formValues !== void 0 && formValues.exportableFlag),
        readOnlyFlag: false,
        inheritSourceType,
        sourceType: (formValues === null || formValues === void 0 ? void 0 : formValues.fieldType) || (formValues === null || formValues === void 0 ? void 0 : formValues.sourceType)
      };
      if (isFromDomain) {
        Object.assign(commonAttribute, {
          domainId,
          category,
          inheritSourceType: undefined
        });
      } else if ((!isTenant || (formValues === null || formValues === void 0 ? void 0 : formValues.sourceType) === SourceType.TENANT) && isExtensionField) {
        Object.assign(commonAttribute, {
          extendCategory: formValues === null || formValues === void 0 ? void 0 : formValues.fieldType,
          tenantId: getCurrentOrganizationId()
        });
      } else if (isTenant && (formValues === null || formValues === void 0 ? void 0 : formValues.sourceType) !== SourceType.TENANT) {
        // 租户且不是来源于租户自定义对象
        Object.assign(commonAttribute, {
          inheritFieldCode: _camelCase(formValues === null || formValues === void 0 ? void 0 : formValues.businessObjectFieldCode),
          inheritFieldName: formValues === null || formValues === void 0 ? void 0 : formValues.businessObjectFieldName,
          businessObjectFieldCode: (formValues === null || formValues === void 0 ? void 0 : formValues.businessObjectFieldCode) || (formValues === null || formValues === void 0 ? void 0 : formValues.extendFieldCode)
          // businessObjectFieldCode: undefined,
          // businessObjectFieldName: undefined,
        });
      }
      commonJson = {
        componentType: formValues.componentType
      };
      switch (formValues === null || formValues === void 0 ? void 0 : formValues.componentType) {
        case FieldComponentType.TEXT_FIELD:
          Object.assign(formValues, {
            multiLanguageFlag: false,
            attributeJson: {
              ...commonJson,
              readOnlyFlag: false
            }
          });
          break;
        case FieldComponentType.RICH_TEXT:
          Object.assign(formValues, {
            attributeJson: {
              ...commonJson,
              readOnlyFlag: false
            }
          });
          break;
        case FieldComponentType.TEXT_AREA:
          Object.assign(formValues, {
            multiLanguageFlag: false,
            attributeJson: {
              ...commonJson,
              readOnlyFlag: false
            }
          });
          break;
        case FieldComponentType.NUMBER_FIELD:
        case FieldComponentType.PHONE_NUMBER:
        case FieldComponentType.CODE_RULE:
          Object.assign(formValues, {
            attributeJson: {
              ...commonJson,
              readOnlyFlag: false
            }
          });
          break;
        case FieldComponentType.PERCENTAGE:
          Object.assign(formValues, {
            attributeJson: {
              ...commonJson,
              readOnlyFlag: false
            },
            digitalAccuracy: formValues.digitalAccuracy || 2
          });
          break;
        case FieldComponentType.FLOAT:
        case FieldComponentType.MONEY:
          Object.assign(formValues, {
            attributeJson: {
              ...commonJson,
              readOnlyFlag: false
            },
            digitalAccuracy: 2
          });
          break;
        case FieldComponentType.DATETIME_SELECTION_BOX:
          Object.assign(formValues, {
            attributeJson: {
              ...commonJson
              // readOnlyFlag: false,
            }
          });
          break;
        case FieldComponentType.DATE_SELECTION_BOX:
          Object.assign(formValues, {
            displayFormat: 'YYYY-MM-DD',
            attributeJson: {
              ...commonJson,
              // readOnlyFlag: false,
              displayFormat: 'YYYY-MM-DD'
            }
          });
          break;
        case FieldComponentType.SINGLE_SELECT:
        case FieldComponentType.MULTIPLE_SELECT:
        case FieldComponentType.RADIO:
        case FieldComponentType.CHECKBOX:
          Object.assign(formValues, {
            defaultValue: '',
            exportableFlag: true,
            optionSettings: '_custom',
            attributeJson: {
              ...commonJson,
              readOnlyFlag: false,
              customOptionList: []
            }
          });
          break;
        case FieldComponentType.SWITCH:
          Object.assign(formValues, {
            defaultValue: '0',
            exportableFlag: true,
            falseMeaning: {
              zh_CN: '否',
              en_US: 'No'
            },
            trueMeaning: {
              zh_CN: '是',
              en_US: 'Yes'
            },
            optionSettings: '_custom',
            attributeJson: {
              ...commonJson,
              componentType: 'SWITCH',
              customOptionList: [{
                value: '0',
                orderSeq: 10,
                meaning: {
                  zh_CN: '否',
                  en_US: 'No'
                }
              }, {
                value: '1',
                orderSeq: 20,
                meaning: {
                  zh_CN: '是',
                  en_US: 'Yes'
                }
              }]
            }
          });
          break;
        case FieldComponentType.MASTER_RELATION:
          Object.assign(formValues, {
            attributeJson: {
              ...commonJson,
              componentType: formValues === null || formValues === void 0 ? void 0 : formValues.componentType
            },
            optionType: 'BUSINESS_OBJECT_OPTION',
            linkRelationType: 'ONE_TO_MANY'
          });
          break;
        case FieldComponentType.LINK_RELATION:
        case FieldComponentType.MULTIPLE_RELATION:
          Object.assign(formValues, {
            attributeJson: {
              ...commonJson,
              componentType: formValues === null || formValues === void 0 ? void 0 : formValues.componentType
            },
            optionType: 'BUSINESS_OBJECT_OPTION'
          });
          break;
        default:
          Object.assign(formValues, {
            attributeJson: {
              ...commonJson
            }
          });
          break;
      }

      // 编辑态的时候 错误数据兼容
      if ((_commonAttribute = commonAttribute) !== null && _commonAttribute !== void 0 && _commonAttribute.attributeJson) {
        commonAttribute.attributeJson.componentType = commonAttribute.componentType;
        if (commonAttribute.attributeJson.componentType === 'DATE_SELECTION_BOX') {
          commonAttribute.attributeJson.displayFormat = 'YYYY-MM-DD';
          commonAttribute.attributeJson.readOnlyFlag = undefined;
        }
        if (commonAttribute.attributeJson.componentType === 'DATETIME_SELECTION_BOX') {
          commonAttribute.attributeJson.readOnlyFlag = undefined;
        }
      }
      const newValue = {
        ...formValues,
        ...commonAttribute
      };
      return handleAttributeJson(newValue, isExtensionField || false);
    });
    return _fieldList;
  }
  return fieldList;
};

/**
 * 自定义校验长度和必输
 * @param res 校验自带信息
 * @param fieldName 当前字段中文名称
 * @returns string
 */
export const validationRenderer = (res, fieldName) => {
  var _res$validationProps, _res$validationProps2;
  if (res !== null && res !== void 0 && (_res$validationProps = res.validationProps) !== null && _res$validationProps !== void 0 && _res$validationProps.required) {
    return `${intl.get('hmde.common.pleaseInput').d('请输入')}${fieldName}`;
  } else if (res !== null && res !== void 0 && (_res$validationProps2 = res.validationProps) !== null && _res$validationProps2 !== void 0 && _res$validationProps2.maxLength) {
    var _res$validationProps3;
    return `
      ${fieldName} ${intl.get('hmde.bo.businessObject.limitationLength').d('长度不能超过')} ${res === null || res === void 0 ? void 0 : (_res$validationProps3 = res.validationProps) === null || _res$validationProps3 === void 0 ? void 0 : _res$validationProps3.maxLength}
    `;
  }
};

// 非空效验
export const handleCheckError = ({
  records = [],
  type,
  isSql
}) => {
  let errorFlag = false;
  records.forEach(v => {
    var _v$get;
    if ((v === null || v === void 0 ? void 0 : v.get('componentType')) === FieldComponentType.FORMULA && !(v !== null && v !== void 0 && v.get('formula'))) {
      errorFlag = true;
    }
    if ((v === null || v === void 0 ? void 0 : v.get('componentType')) === FieldComponentType.CODE_RULE && !(v !== null && v !== void 0 && (_v$get = v.get('ruleListDS')) !== null && _v$get !== void 0 && _v$get.length) && !(v !== null && v !== void 0 && v.get('businessObjectFieldId')) && !(v !== null && v !== void 0 && v.get('inheritFieldId'))) {
      errorFlag = true;
    }
    if ((v === null || v === void 0 ? void 0 : v.get('componentType')) === FieldComponentType.REFERENCE_FIELD && !(v !== null && v !== void 0 && v.get('formula'))) {
      errorFlag = true;
    }

    // sql对象 关联重组 显示字段必输
    if (isSql && [FieldComponentType.MASTER_RELATION, FieldComponentType.LINK_RELATION].includes(v === null || v === void 0 ? void 0 : v.get('componentType')) && !v.get('optionDisplayFieldCode')) {
      errorFlag = true;
    }
    type === 'save' && (v === null || v === void 0 ? void 0 : v.setState('showErrorMes', errorFlag));
  });
  return errorFlag;
};
export const componentTypeFilter = (option, record, physicalModelType, baseInfoDS) => {
  var _baseInfoDS$current, _baseInfoDS$current2;
  // sql 对象去除 公式/引用/自动编号
  if (physicalModelType === PhysicalModelType.SQL) {
    const rules = [FieldComponentType.FORMULA, FieldComponentType.REFERENCE_FIELD, FieldComponentType.CODE_RULE];
    if (rules.includes(option === null || option === void 0 ? void 0 : option.get('value'))) {
      return false;
    }
  }

  // 关联关系多选字段 不能互相切换
  if ((record === null || record === void 0 ? void 0 : record.get('componentType')) === FieldComponentType.MULTIPLE_RELATION) {
    return (option === null || option === void 0 ? void 0 : option.get('value')) === FieldComponentType.MULTIPLE_RELATION;
  } else if ((option === null || option === void 0 ? void 0 : option.get('value')) === FieldComponentType.MULTIPLE_RELATION) {
    return false;
  }
  if (record !== null && record !== void 0 && record.get('componentModifiedFlag') && !isTenant || record !== null && record !== void 0 && record.get('componentModifiedFlag') && isTenant && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('sourceType')) === SourceType.TENANT || record !== null && record !== void 0 && record.get('componentModifiedFlag') && isTenant && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : _baseInfoDS$current2.get('sourceType')) === SourceType.INHERIT && !(record !== null && record !== void 0 && record.get('extendFieldId'))) {
    return true;
  }
  if (record !== null && record !== void 0 && record.get('businessObjectFieldId') || record !== null && record !== void 0 && record.get('inheritFieldId')) {
    const textType = [FieldComponentType.TEXT_FIELD,
    // 文本
    FieldComponentType.PHONE_NUMBER,
    // 手机号码
    FieldComponentType.SINGLE_SELECT,
    // 下拉单选
    FieldComponentType.MULTIPLE_SELECT,
    // 下拉多选
    FieldComponentType.RADIO,
    // 单选框
    FieldComponentType.CHECKBOX,
    // 复选
    FieldComponentType.APPENDIX,
    // 附件
    FieldComponentType.EMAIL,
    // 电子邮箱
    FieldComponentType.CODE_RULE];
    // 不可修改
    const cannotChangeType = [
    // 'TEXT_AREA', // 多行文本
    // 'RICH_TEXT', // 富文本
    // 'NUMBER_FIELD', // 整数
    FieldComponentType.SWITCH,
    // 开关
    FieldComponentType.FORMULA,
    // 公式
    FieldComponentType.DATE_SELECTION_BOX,
    // 日期
    FieldComponentType.DATETIME_SELECTION_BOX,
    // 日期时间
    FieldComponentType.REFERENCE_FIELD,
    // 引用关系
    FieldComponentType.SINGLE_APPENDIX,
    // 单附件
    // FieldComponentType.LOCATION, // 地图
    FieldComponentType.MULTIPLE_RELATION // 关联关系多选
    ];
    // 关联 从组 可互相切换
    const relationChangeType = [FieldComponentType.LINK_RELATION,
    // 关联关系
    FieldComponentType.MASTER_RELATION // 从主关系
    ];
    // 浮点类型
    const floatType = [FieldComponentType.FLOAT, FieldComponentType.PERCENTAGE, FieldComponentType.MONEY];
    const intType = [FieldComponentType.NUMBER_FIELD, FieldComponentType.LINK_RELATION, FieldComponentType.MASTER_RELATION]; // 整数
    const multiplyTextType = [FieldComponentType.TEXT_AREA, FieldComponentType.RICH_TEXT, FieldComponentType.LOCATION]; // 多行文本类型

    if ((record === null || record === void 0 ? void 0 : record.get('componentType')) === FieldComponentType.TEXT_FIELD) {
      textType.push(FieldComponentType.TEXT_AREA, FieldComponentType.RICH_TEXT, FieldComponentType.LOCATION);
    }
    const initComponentType = (record === null || record === void 0 ? void 0 : record.get('componentType')) || (record === null || record === void 0 ? void 0 : record.getState('oldComponentTypeValue'));
    const value = option === null || option === void 0 ? void 0 : option.get('value');
    if (initComponentType && textType.includes(initComponentType)) {
      return textType.includes(value);
    } else if (initComponentType && cannotChangeType.includes(initComponentType)) {
      return [initComponentType].includes(value);
    } else if (initComponentType && floatType.includes(initComponentType)) {
      return floatType.includes(value);
    } else if (initComponentType === FieldComponentType.NUMBER_FIELD) {
      return intType.includes(value);
    } else if (initComponentType && multiplyTextType.includes(initComponentType)) {
      return multiplyTextType.includes(value);
    } else if (initComponentType && relationChangeType.includes(initComponentType)) {
      return relationChangeType.includes(value);
    }
    return false;
  } else {
    return true;
  }
};
export const handleReferenceField = (ds, getAddonBefore) => {
  ds === null || ds === void 0 ? void 0 : ds.forEach(v => {
    var _v$get2;
    if ((v === null || v === void 0 ? void 0 : v.get('componentType')) === FieldComponentType.REFERENCE_FIELD && !(v !== null && v !== void 0 && v.get('businessObjectFieldId')) && (v === null || v === void 0 ? void 0 : (_v$get2 = v.get('refBusinessObject')) === null || _v$get2 === void 0 ? void 0 : _v$get2.refType) === 'FIELD') {
      const linkFieldCode = v === null || v === void 0 ? void 0 : v.get('refBusinessObjectFieldCode');
      const curLink = ds.find(item => {
        const c = getAddonBefore ? `${getAddonBefore}${item === null || item === void 0 ? void 0 : item.get('businessObjectFieldCode')}` : item === null || item === void 0 ? void 0 : item.get('businessObjectFieldCode');
        return c === linkFieldCode && [FieldComponentType.LINK_RELATION, FieldComponentType.MASTER_RELATION].includes(item === null || item === void 0 ? void 0 : item.get('componentType'));
      });
      if (!curLink || (v === null || v === void 0 ? void 0 : v.get('refBusinessObjectCode')) !== (curLink === null || curLink === void 0 ? void 0 : curLink.get('masterBusinessObjectCode'))) {
        v === null || v === void 0 ? void 0 : v.set('formula', '');
        v === null || v === void 0 ? void 0 : v.set('refBusinessObject', null);
        v === null || v === void 0 ? void 0 : v.set('refBusinessObjectCode', '');
        v === null || v === void 0 ? void 0 : v.set('refBusinessObjectFieldCode', '');
        v === null || v === void 0 ? void 0 : v.set('refBusinessObjectFieldId', '');
        v === null || v === void 0 ? void 0 : v.set('refBusinessObjectFieldName', '');
        v === null || v === void 0 ? void 0 : v.set('refBusinessObjectId', '');
      }
    }
  });
};