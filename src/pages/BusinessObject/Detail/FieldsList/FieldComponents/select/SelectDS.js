import _DataSet from "choerodon-ui/pro/lib/data-set";
import React from 'react';
import intl from 'hzero-front/lib/utils/intl';
// import { camelCase } from 'lodash';
import { isTenantRoleLevel, getCurrentOrganizationId, getCurrentLanguage } from 'utils/utils';
import { DataToJSON } from 'choerodon-ui/pro/lib/data-set/enum';
import { HZERO_HMDE, HZERO_HPFM } from "hzero-front-apaas/lib/utils/config";
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import LabelTitleRender from "hzero-front-hmde/lib/businessComponents/LabelTitleRender";
const isTenantRole = isTenantRoleLevel();
const language = getCurrentLanguage();
const _validator = (value, customPrimaryKeyCode, isExtensionField, extendFieldPrefixRule, record) => {
  // const pattern = /^[_a-z][0-9a-zA-Z]{0,}([0-9a-zA-Z]{0,}|[_]{0,})$/;
  const pattern = /^[a-z][0-9a-zA-Z]{0,}$/;
  const pattern1 = /^[A-Z][0-9a-zA-Z]{0,}$/;
  if (!extendFieldPrefixRule && !pattern.test(value)) {
    return intl.get('hmde.bo.businessObject.fieldCode.validation1').d(
    // '支持小写字母或“_”开头，字母/数字或“_”结尾，编码中间支持使用大写字母/小写字母且不支持使用“_”'
    '需以小写字母开头，中间支持大写字母、小写字母、数字组合，推荐使用小驼峰');
  } else if (extendFieldPrefixRule && !pattern1.test(value)) {
    // 编辑的时候直接过  编辑态下 压根就无法修改编码
    if (record !== null && record !== void 0 && record.get('businessObjectFieldId') || record !== null && record !== void 0 && record.get('inheritFieldId')) {
      return true;
    }
    return intl.get('hmde.bo.businessObject.fieldCode.validation2').d('需以大写字母开头，中间支持大写字母、小写字母、数字组合，推荐使用小驼峰');
  } else if (!isExtensionField && customPrimaryKeyCode && value === customPrimaryKeyCode) {
    return intl.get('hmde.bo.businessObject.fieldCode.validation3').d('字段编码和业务对象的基础信息的“自定义主键编码”不能相同');
  } else if (!isExtensionField && !customPrimaryKeyCode && value.toLowerCase() === 'id') {
    return `${intl.get('hmde.bo.businessObject.fieldCode.validation4').d('字段编码不能等于')}id`;
  }
};

// 选项类 最大长度 和值集/自定义 value长度挂钩
const maxLengthValidator = (record, value) => {
  var _record$dataSet, _record$dataSet$child, _record$dataSet2, _record$dataSet2$chil;
  const customDs = (record === null || record === void 0 ? void 0 : (_record$dataSet = record.dataSet) === null || _record$dataSet === void 0 ? void 0 : (_record$dataSet$child = _record$dataSet.children) === null || _record$dataSet$child === void 0 ? void 0 : _record$dataSet$child.customOptionList) || [];
  const lovDs = (record === null || record === void 0 ? void 0 : (_record$dataSet2 = record.dataSet) === null || _record$dataSet2 === void 0 ? void 0 : (_record$dataSet2$chil = _record$dataSet2.children) === null || _record$dataSet2$chil === void 0 ? void 0 : _record$dataSet2$chil.lovValues) || [];
  let manL = 0;
  if ((record === null || record === void 0 ? void 0 : record.get('optionSettings')) === '_custom' && customDs !== null && customDs !== void 0 && customDs.length) {
    customDs === null || customDs === void 0 ? void 0 : customDs.forEach(v => {
      var _v$get;
      const valueLength = (v === null || v === void 0 ? void 0 : (_v$get = v.get('value')) === null || _v$get === void 0 ? void 0 : _v$get.length) || 0;
      valueLength > manL && (manL = valueLength);
    });
  }
  if ((record === null || record === void 0 ? void 0 : record.get('optionSettings')) === '_valueList' && lovDs !== null && lovDs !== void 0 && lovDs.length) {
    lovDs === null || lovDs === void 0 ? void 0 : lovDs.forEach(v => {
      var _v$get2;
      const valueLength = (v === null || v === void 0 ? void 0 : (_v$get2 = v.get('value')) === null || _v$get2 === void 0 ? void 0 : _v$get2.length) || 0;
      valueLength > manL && (manL = valueLength);
    });
  }
  if (value < manL) {
    return intl.get('hmde.bo.businessObject.fieldCode.validation5').d('存在选项的值长度超过设置的最大长度，请重新设置最大长度');
  }
};

// const language = window.dvaApp?._store?.getState?.()?.global?.language;
export default (({
  isExtensionField,
  type,
  isEditMode,
  businessObjectId,
  isFromDomain,
  customPrimaryKeyCode,
  boSourceType,
  extendFieldCreatedFlag,
  isApiCustomType
}) => ({
  autoCreate: true,
  forceValidate: true,
  transport: {
    tls: ({
      dataSet,
      name,
      record
    }) => {
      if (isTenantRoleLevel() && !isApiCustomType) {
        return {
          url: `${lowcodeOrganizationURL({
            route: HZERO_HMDE
          })}/business-object-fields/multi-language`,
          params: {
            ...(dataSet === null || dataSet === void 0 ? void 0 : dataSet.getState('tlsParams')),
            fieldName: name
          }
        };
      } else {
        let fieldName = name;
        //  api进来 自定义的时候 需要特殊处理
        if (isApiCustomType && name === 'businessObjectFieldName') {
          fieldName = 'fieldName';
        }
        return {
          url: `${lowcodeOrganizationURL({
            route: HZERO_HPFM,
            isSite: true
          })}/multi-language`,
          params: {
            fieldName,
            _token: record === null || record === void 0 ? void 0 : record.get('_token')
          }
        };
      }
    }
  },
  fields: [{
    // 回显attributeJson时 对应绑定了此对象的字段自动回显
    name: 'attributeJson',
    type: 'object'
  }, !isFromDomain && isExtensionField && {
    name: 'inheritFieldName',
    type: 'intl',
    label: intl.get('hmde.common.fieldName').d('字段名称'),
    required: true,
    maxLength: 30
  }, !isFromDomain && !isExtensionField && {
    name: 'businessObjectFieldName',
    type: 'intl',
    label: intl.get('hmde.common.fieldName').d('字段名称'),
    required: true,
    maxLength: 30
  }, isFromDomain && {
    name: 'templateFieldName',
    type: 'intl',
    label: intl.get('hmde.common.fieldName').d('字段名称'),
    required: true,
    maxLength: 30
  }, isExtensionField && {
    name: 'businessObjectField',
    label: intl.get('hmde.bo.businessObject.extendField.select').d('选择扩展字段'),
    type: 'object',
    // required: boSourceType !== 'TENANT',
    unique: true,
    ignore: 'always',
    lovCode: 'HMDE.EXTEND_FIELD',
    lovPara: {
      componentType: type,
      businessObjectId
    },
    lovQueryAxiosConfig: {
      url: `${lowcodeOrganizationURL({
        route: HZERO_HMDE
      })}/business-object-extend-field/extend-fields/list`,
      method: 'GET'
    },
    dynamicProps: {
      required: () => boSourceType !== 'TENANT' && !extendFieldCreatedFlag
    }
  }, isExtensionField && {
    name: 'extendFieldId',
    type: 'string',
    ignore: 'never',
    bind: 'businessObjectField.extendFieldId'
  }, !isFromDomain && isExtensionField && {
    name: 'inheritFieldCode',
    type: 'string',
    label: intl.get('hmde.common.fieldCode').d('字段编码'),
    required: true,
    validator: (value, name, record) => {
      var _record$dataSet3;
      const extendFieldPrefixRule = record === null || record === void 0 ? void 0 : (_record$dataSet3 = record.dataSet) === null || _record$dataSet3 === void 0 ? void 0 : _record$dataSet3.getState('extendFieldPrefixRule');
      return _validator(value, customPrimaryKeyCode, isExtensionField, extendFieldPrefixRule, record);
    },
    transformRequest: (val, record) => {
      if (val) {
        var _record$dataSet4;
        const extendFieldPrefixRule = record === null || record === void 0 ? void 0 : (_record$dataSet4 = record.dataSet) === null || _record$dataSet4 === void 0 ? void 0 : _record$dataSet4.getState('extendFieldPrefixRule');
        if (extendFieldPrefixRule) {
          return `${extendFieldPrefixRule}${val}`;
        }
        return val;
      }
    }
  }, !isFromDomain && !isExtensionField && {
    name: 'businessObjectFieldCode',
    type: 'string',
    label: intl.get('hmde.common.fieldCode').d('字段编码'),
    required: true,
    validator: (value, name, record) => {
      var _record$dataSet5;
      const extendFieldPrefixRule = record === null || record === void 0 ? void 0 : (_record$dataSet5 = record.dataSet) === null || _record$dataSet5 === void 0 ? void 0 : _record$dataSet5.getState('extendFieldPrefixRule');
      return _validator(value, customPrimaryKeyCode, isExtensionField, extendFieldPrefixRule, record);
    },
    transformRequest: (val, record) => {
      if (val) {
        var _record$dataSet6;
        const extendFieldPrefixRule = record === null || record === void 0 ? void 0 : (_record$dataSet6 = record.dataSet) === null || _record$dataSet6 === void 0 ? void 0 : _record$dataSet6.getState('extendFieldPrefixRule');
        if (extendFieldPrefixRule) {
          return `${extendFieldPrefixRule}${val}`;
        }
        return val;
      }
    }
  }, isFromDomain && {
    name: 'templateFieldCode',
    type: 'string',
    label: intl.get('hmde.common.fieldCode').d('字段编码'),
    required: true,
    validator: (value, name, record) => {
      var _record$dataSet7;
      const extendFieldPrefixRule = record === null || record === void 0 ? void 0 : (_record$dataSet7 = record.dataSet) === null || _record$dataSet7 === void 0 ? void 0 : _record$dataSet7.getState('extendFieldPrefixRule');
      return _validator(value, customPrimaryKeyCode, isExtensionField, extendFieldPrefixRule, record);
    },
    transformRequest: (val, record) => {
      if (val) {
        var _record$dataSet8;
        const extendFieldPrefixRule = record === null || record === void 0 ? void 0 : (_record$dataSet8 = record.dataSet) === null || _record$dataSet8 === void 0 ? void 0 : _record$dataSet8.getState('extendFieldPrefixRule');
        if (extendFieldPrefixRule) {
          return `${extendFieldPrefixRule}${val}`;
        }
        return val;
      }
    }
  }, {
    name: 'helpText',
    type: 'object',
    ignore: 'always',
    label: /*#__PURE__*/React.createElement(LabelTitleRender, {
      value: intl.get('hmde.common.helpText').d('帮助文本'),
      help: intl.get('hmde.bo.businessObject.defaultshowflagnew.help').d('当用户悬停在此字段旁的问号图标时，会在表单字段下方显示该提示文本内容')
    }),
    bind: 'attributeJson.helpText'
  }, {
    name: 'remark',
    type: 'intl',
    label: intl.get('hmde.common.remark').d('描述')
  }, {
    name: 'maxLength',
    type: 'number',
    label: intl.get('hmde.common.manLength').d('最大长度'),
    required: true,
    step: 1,
    min: 1,
    max: 4000,
    defaultValue: 30,
    validator: (value, name, record) => {
      return maxLengthValidator(record, value);
    }
  }, {
    name: 'optionSettings',
    type: 'string',
    ignore: 'always',
    label: intl.get('hmde.bo.businessObject.optionSettings').d('选项设置'),
    defaultValue: '_valueList',
    transformResponse: (_, object) => {
      return object !== null && object !== void 0 && object.lovCode ? '_valueList' : '_custom';
    },
    bind: 'attributeJson.optionSettings'
  }, {
    name: 'valueList',
    type: 'object',
    label: intl.get('hmde.common.valueList').d('值集'),
    ignore: 'always',
    lovCode: isTenantRole ? 'HMDE.LOV_IDP' : 'HMDE.SITE.LOV_IDP',
    valueField: 'lovCode',
    textField: 'lovName',
    dynamicProps: {
      required: ({
        record
      }) => (record === null || record === void 0 ? void 0 : record.get('optionSettings')) === '_valueList'
    },
    lovQueryAxiosConfig: function lovQueryAxiosConfig(_, __, {
      params
    }) {
      return {
        url: `${lowcodeOrganizationURL({
          route: HZERO_HMDE
        })}/lov/query-idp?lovTypeCode=IDP`,
        method: 'GET',
        params: {
          ...params,
          enabledFlag: 1,
          tenantId: getCurrentOrganizationId()
        }
      };
    }
  }, {
    name: 'lovCode',
    type: 'string',
    bind: 'valueList.lovCode',
    transformRequest: (value, record) => {
      if ((record === null || record === void 0 ? void 0 : record.get('optionSettings')) === '_valueList') {
        return value;
      } else {
        return undefined;
      }
    }
  }, {
    name: 'lovName',
    type: 'string',
    bind: 'valueList.lovName',
    transformRequest: (value, record) => {
      if ((record === null || record === void 0 ? void 0 : record.get('optionSettings')) === '_valueList') {
        return value;
      } else {
        return undefined;
      }
    }
  }, {
    name: 'customOptionList',
    type: 'object',
    transformRequest: (value, record) => {
      if ((record === null || record === void 0 ? void 0 : record.get('optionSettings')) === '_valueList') {
        return undefined;
      } else {
        return value;
      }
    },
    bind: 'attributeJson.customOptionList'
  }, {
    name: 'defaultValue',
    type: 'string',
    label: intl.get('hmde.common.defatulValue').d('默认值'),
    transformRequest: value => {
      if (Array.isArray(value)) {
        return value.filter(v => v !== '').join(',');
      } else {
        return value;
      }
    },
    transformResponse: (value = '', object) => {
      const _ref = object || {},
        componentType = _ref.componentType;
      if (componentType === 'MULTIPLE_SELECT' || componentType === 'CHECKBOX') {
        return `${value}`.split(',');
      } else {
        return value;
      }
    }
  }, {
    name: 'readOnlyFlag',
    type: 'boolean',
    ignore: 'always',
    trueValue: true,
    falseValue: false,
    defaultValue: 0,
    label: intl.get('hmde.bo.businessObject.readOnlyFlag').d('字段只读'),
    bind: 'attributeJson.readOnlyFlag',
    transformResponse: value => {
      if (value === undefined || value === null) {
        return false;
      } else {
        return value;
      }
    }
  }, {
    name: 'requiredFlag',
    type: 'boolean',
    trueValue: true,
    falseValue: false,
    defaultValue: 0,
    label: intl.get('hmde.bo.businessObject.requiredFlag').d('字段必输')
    // required: true,
    // dynamicProps: {
    //   readOnly: ({ record }) => {
    //     // 租户编辑平台标准字段必输时如果是必输不能改成非必输
    //     if (isTenantRoleLevel() && isEditMode && !isExtensionField) {
    //       return !record?.get('requiredFlagUpdated') && record?.get('tenantRequiredControl');
    //     }
    //     return false;
    //   },
    // },
  }, {
    name: 'exportableFlag',
    type: 'boolean',
    // label: (
    //   <LabelTitleRender
    //     value={intl.get('hmde.bo.businessObject.exportableFlag').d('是否可导出')}
    //     help={intl
    //       .get('hmde.bo.businessObject.exportableFlag.help')
    //       .d('该属性默认开启，关闭后，该字段的数据将不允许导出')}
    //   />
    // ),
    label: intl.get('hmde.bo.businessObject.exportableFlag').d('是否可导出'),
    help: intl.get('hmde.bo.businessObject.exportableFlag.help').d('该属性默认开启，关闭后，该字段的数据将不允许导出'),
    defaultValue: true,
    // required: true,
    transformResponse: value => {
      if (value === undefined || value === null) {
        return true;
      } else {
        return value;
      }
    }
  }, !isFromDomain && !isExtensionField && {
    name: 'defaultDisplayFieldFlag',
    type: 'boolean',
    // label: (
    //   <LabelTitleRender
    //     value={intl.get('hmde.bo.businessObject.defaultshowflagnew').d('默认显示字段')}
    //     help={intl
    //       .get('hmde.bo.businessObject.defaultshowflagnew.help2')
    //       .d('开启后，该字段将作为值列表默认的显示字段')}
    //   />
    // ),
    label: intl.get('hmde.bo.businessObject.defaultshowflagnew').d('默认显示字段'),
    help: intl.get('hmde.bo.businessObject.defaultshowflagnew.help2').d('开启后，该字段将作为值列表默认的显示字段'),
    defaultValue: false,
    transformResponse: value => {
      if (value === undefined || value === null) {
        return false;
      } else {
        return value;
      }
    }
  }, {
    name: 'parentOptionField',
    label: intl.get('hmde.common.superiorSelectField').d('上级选项字段'),
    type: 'string',
    bind: 'attributeJson.parentOptionField',
    textField: 'businessObjectFieldName',
    valueField: 'businessObjectFieldCode',
    lookupCode: isTenantRole ? 'HMDE.BUSINESS_OBJECT_FIELD' : 'HMDE.BUSINESS_OBJECT_FIELD.SITE',
    noCache: true,
    dynamicProps: {
      lovPara: ({
        record
      }) => ({
        businessObjectId,
        componentTypes: 'SINGLE_SELECT,MULTIPLE_SELECT,RADIO,CHECKBOX',
        a: record === null || record === void 0 ? void 0 : record.get('businessObjectFieldId')
      })
    }
  }, {
    name: 'parentLovCode',
    bind: 'attributeJson.parentLovCode'
  }].filter(Boolean),
  events: {
    update: ({
      name,
      value,
      record,
      dataSet
    }) => {
      if (name === 'businessObjectField' && value) {
        record === null || record === void 0 ? void 0 : record.set('inheritFieldCode', value.extendFieldCode);
        record === null || record === void 0 ? void 0 : record.set('remark', value.remark);
        if (value !== null && value !== void 0 && value.maxLength) {
          record === null || record === void 0 ? void 0 : record.set('maxLength', value === null || value === void 0 ? void 0 : value.maxLength);
          record === null || record === void 0 ? void 0 : record.getField('maxLength').set('validator', recordValue => {
            if (recordValue || recordValue === 0) {
              if (recordValue > (value === null || value === void 0 ? void 0 : value.maxLength) || recordValue < 1) {
                return `
                    ${intl.get('hmde.bo.businessObject.range.minmax').d(`可填范围为`)}
                    ${1 - (value === null || value === void 0 ? void 0 : value.maxLength)}
                  `;
              }
              return maxLengthValidator(dataSet === null || dataSet === void 0 ? void 0 : dataSet.current, recordValue);
            }
          });
        }
      } else if (name === 'valueList') {
        record === null || record === void 0 ? void 0 : record.set('defaultValue', '');
      }
      if (name === 'businessObjectFieldCode' && value) {
        // 前面已经处理过了
        // record?.set('businessObjectFieldCode', camelCase(value));
      }
      if (name === 'optionSettings' && value) {
        dataSet.getField('maxLength').checkValidity(record);
      }
    },
    load: ({
      dataSet
    }) => {
      var _dataSet$current3;
      if (isTenantRoleLevel() && isEditMode && !isExtensionField) {
        var _dataSet$current, _dataSet$current2;
        // eslint-disable-next-line no-unused-expressions
        dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$current = dataSet.current) === null || _dataSet$current === void 0 ? void 0 : _dataSet$current.init('tenantRequiredControl', dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$current2 = dataSet.current) === null || _dataSet$current2 === void 0 ? void 0 : _dataSet$current2.get('requiredFlag'));
      }
      const data = dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$current3 = dataSet.current) === null || _dataSet$current3 === void 0 ? void 0 : _dataSet$current3.toData();
      if (isExtensionField && data !== null && data !== void 0 && data.extendFieldMaxLength) {
        var _dataSet$current4, _dataSet$current4$get;
        // eslint-disable-next-line no-unused-expressions
        dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$current4 = dataSet.current) === null || _dataSet$current4 === void 0 ? void 0 : (_dataSet$current4$get = _dataSet$current4.getField('maxLength')) === null || _dataSet$current4$get === void 0 ? void 0 : _dataSet$current4$get.set('validator', recordValue => {
          if (recordValue || recordValue === 0) {
            if (recordValue > (data === null || data === void 0 ? void 0 : data.extendFieldMaxLength) || recordValue < 1) {
              return `
                    ${intl.get('hmde.bo.businessObject.range.minmax').d(`可填范围为`)}
                    ${1 - (data === null || data === void 0 ? void 0 : data.extendFieldMaxLength)}
                  `;
            }
            return maxLengthValidator(dataSet === null || dataSet === void 0 ? void 0 : dataSet.current, recordValue);
          }
        });
      }
      if (!isExtensionField && isTenantRole && isEditMode) {
        var _dataSet$current5, _dataSet$current5$get;
        // eslint-disable-next-line no-unused-expressions
        dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$current5 = dataSet.current) === null || _dataSet$current5 === void 0 ? void 0 : (_dataSet$current5$get = _dataSet$current5.getField('maxLength')) === null || _dataSet$current5$get === void 0 ? void 0 : _dataSet$current5$get.set('validator', recordValue => {
          if (recordValue || recordValue === 0) {
            if (recordValue > (data === null || data === void 0 ? void 0 : data.platformFieldMaxLength) || recordValue < 1) {
              return `
                  ${intl.get('hmde.bo.businessObject.range.minmax').d(`可填范围为`)}
                  ${1 - (data === null || data === void 0 ? void 0 : data.platformFieldMaxLength)}
                `;
            }
            return maxLengthValidator(dataSet === null || dataSet === void 0 ? void 0 : dataSet.current, recordValue);
          }
        });
      }
    }
  },
  children: {
    customOptionList: new _DataSet({
      ...lovValuesDS(),
      events: {
        validate: async ({
          dataSet,
          result
        }) => {
          var _dataSet$parent, _dataSet$parent$curre;
          const res = await result;
          if (!res && dataSet !== null && dataSet !== void 0 && (_dataSet$parent = dataSet.parent) !== null && _dataSet$parent !== void 0 && (_dataSet$parent$curre = _dataSet$parent.current) !== null && _dataSet$parent$curre !== void 0 && _dataSet$parent$curre.set) {
            dataSet.parent.current.set('optionSettings', '_custom');
          }
        },
        update: ({
          dataSet
        }) => {
          var _dataSet$parent2;
          // 修改父dataset状态，才能触发父dataset的validate()
          Object.assign((dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$parent2 = dataSet.parent) === null || _dataSet$parent2 === void 0 ? void 0 : _dataSet$parent2.current) || {}, {
            status: 'update'
          });
        }
      }
    }),
    lovValues: new _DataSet({
      ...lovValuesDS(),
      events: {
        update: ({
          dataSet
        }) => {
          var _dataSet$parent3;
          // 修改父dataset状态，才能触发父dataset的validate()
          Object.assign((dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$parent3 = dataSet.parent) === null || _dataSet$parent3 === void 0 ? void 0 : _dataSet$parent3.current) || {}, {
            status: 'update'
          });
        }
      }
    })
  }
}));
export const lovValuesDS = () => ({
  autoCreate: false,
  selection: false,
  dataToJSON: "normal",
  pageSize: 100,
  fields: [{
    label: intl.get('hmde.common.meaningShow').d('含义（用于显示）'),
    name: 'meaning',
    type: 'intl',
    required: true,
    transformResponse: val => {
      if (typeof val === 'string') {
        return val;
      }
      return val === null || val === void 0 ? void 0 : val[language];
    }
  }, {
    label: intl.get('hmde.common.value').d('值（用于储存）'),
    name: 'value',
    type: 'string',
    unique: true,
    required: true
  }, {
    name: 'orderSeq',
    type: 'number',
    transformRequest: (value, record) => {
      return (record.index + 1) * 10;
    }
  }, {
    label: intl.get('hmde.common.defatulValue').d('默认值'),
    name: 'defaultFlag',
    type: 'boolean',
    ignore: 'always'
  }, {
    name: '_tls',
    type: 'object',
    ignore: 'always',
    transformResponse: (value, object) => {
      if (value && Object.prototype.toString.call(value) === '[object Object]') {
        return value;
      } else {
        return {
          meaning: object.meaning
        };
      }
    }
  }, {
    label: intl.get('hmde.common.superiorSelect').d('上级选项'),
    name: 'parentValue',
    type: 'string',
    textField: 'meaning',
    valueField: 'value'
  }]
});
export const lovDefineDS = ({
  businessObjectCode,
  selectDs,
  businessObjectId,
  clearCacheNum
}) => {
  var _selectDs$current, _selectDs$current2, _selectDs$current3, _selectDs$current4, _selectDs$current5, _selectDs$current6, _businessObjectCode$t, _fieldCode$toUpperCas;
  const fieldName = (selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$current = selectDs.current) === null || _selectDs$current === void 0 ? void 0 : _selectDs$current.get('inheritFieldName')) || (selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$current2 = selectDs.current) === null || _selectDs$current2 === void 0 ? void 0 : _selectDs$current2.get('businessObjectFieldName')) || (selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$current3 = selectDs.current) === null || _selectDs$current3 === void 0 ? void 0 : _selectDs$current3.get('templateFieldName'));
  const fieldCode = (selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$current4 = selectDs.current) === null || _selectDs$current4 === void 0 ? void 0 : _selectDs$current4.get('inheritFieldCode')) || (selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$current5 = selectDs.current) === null || _selectDs$current5 === void 0 ? void 0 : _selectDs$current5.get('businessObjectFieldCode')) || (selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$current6 = selectDs.current) === null || _selectDs$current6 === void 0 ? void 0 : _selectDs$current6.get('templateFieldCode'));
  return {
    autoCreate: true,
    transport: {
      create: ({
        data
      }) => ({
        url: `${lowcodeOrganizationURL({
          route: HZERO_HMDE
        })}/lov/create`,
        method: 'POST',
        data: {
          ...data[0],
          displayField: 'meaning',
          valueField: 'value'
        }
      })
    },
    fields: [{
      label: intl.get('hmde.bo.businessObject.valueList.code').d('值集编码'),
      name: 'lovCode',
      type: 'string',
      defaultValue: fieldCode ? `${businessObjectCode === null || businessObjectCode === void 0 ? void 0 : (_businessObjectCode$t = businessObjectCode.toUpperCase) === null || _businessObjectCode$t === void 0 ? void 0 : _businessObjectCode$t.call(businessObjectCode)}_${fieldCode === null || fieldCode === void 0 ? void 0 : (_fieldCode$toUpperCas = fieldCode.toUpperCase) === null || _fieldCode$toUpperCas === void 0 ? void 0 : _fieldCode$toUpperCas.call(fieldCode)}` : '',
      pattern: /^[A-Z0-9][A-Z0-9_.]*$/,
      required: true,
      format: 'uppercase',
      defaultValidationMessages: {
        patternMismatch: intl.get('hmde.bo.businessObject.patternValidation2').d('需以大写字母、数字开头，支持大写字母、数字及下划线组合')
      }
    }, {
      name: 'parentOptionField',
      label: intl.get('hmde.common.superiorSelectField').d('上级选项字段'),
      type: 'string',
      textField: 'businessObjectFieldName',
      valueField: 'businessObjectFieldCode',
      lookupCode: isTenantRole ? 'HMDE.BUSINESS_OBJECT_FIELD' : 'HMDE.BUSINESS_OBJECT_FIELD.SITE',
      noCache: true,
      lovPara: {
        businessObjectId,
        componentTypes: 'SINGLE_SELECT,MULTIPLE_SELECT,RADIO,CHECKBOX',
        b: clearCacheNum
      },
      ignore: 'always'
    }, {
      label: intl.get('hmde.bo.businessObject.valueList.name').d('值集名称'),
      name: 'lovName',
      type: 'intl',
      required: true,
      defaultValue: fieldName
    }, {
      name: 'lovTypeCode',
      type: 'string',
      defaultValue: 'IDP'
    }, {
      name: 'lovValues',
      type: 'auto'
    }]
  };
};