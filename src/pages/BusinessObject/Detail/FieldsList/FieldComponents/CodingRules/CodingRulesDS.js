import _DataSet from "choerodon-ui/pro/lib/data-set";
import _upperFirst from "lodash/upperFirst";
import React from 'react';
import intl from 'hzero-front/lib/utils/intl';
import { isTenantRoleLevel, getCurrentOrganizationId } from 'utils/utils';

// import notification from 'utils/notification';

import { DataToJSON } from 'choerodon-ui/pro/lib/data-set/enum';
import { HZERO_HMDE, HZERO_HPFM } from "hzero-front-apaas/lib/utils/config";
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import LabelTitleRender from "hzero-front-hmde/lib/businessComponents/LabelTitleRender";
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
const isTenant = isTenantRoleLevel();
const _validator = (value, customPrimaryKeyCode, isExtensionField, extendFieldPrefixRule, record) => {
  // const pattern = /^[_a-z][0-9a-zA-Z]{0,}([0-9a-zA-Z]{0,}|[_]{0,})$/;
  const pattern = /^[a-z][0-9a-zA-Z]{0,}$/;
  const pattern1 = /^[A-Z][0-9a-zA-Z]{0,}$/;
  if (!extendFieldPrefixRule && !pattern.test(value)) {
    return intl.get('hmde.bo.businessObject.fieldCode.validation1').d(
    // '支持小写字母或“_”开头，字母/数字或“_”结尾，编码中间支持使用大写字母/小写字母且不支持使用“_”'
    '需以小写字母开头，中间支持大写字母、小写字母、数字组合，推荐使用小驼峰');
  } else if (extendFieldPrefixRule && !pattern1.test(value)) {
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
const dismissValidateBg = dataSet => {
  setTimeout(() => {
    // 解决某种场景问题：
    // 1. 用户先选了【流水号】然后什么都不填写，然后直接点击保存，这个时候页面上所有的输入框都是校验标红的情况；
    // 2. 然后切换到【日期】类型，就会发现后面有两个红；
    // 3. 然后为了消除切换后产生的红框，重新调一下校验接口，让上次的红框消失！！！！
    dataSet.validate();
  }, 20);
};
const tenantId = getCurrentOrganizationId();
// 已有和创建编码规则编码列表配置属性
const commonListConfig = disabled => ({
  selection: false,
  dataToJSON: "all",
  paging: false,
  fields: [{
    name: 'addRuleList',
    label: intl.get('hmde.bo.businessObject.addRuleOptions').d('添加规则选项'),
    type: 'object',
    required: true,
    textField: 'meaning',
    valueField: 'value',
    lookupCode: 'HMDE.BUSINESS_OBJECT.CODE_RULE.LINE_TYPE'
  }, {
    name: 'fieldType',
    // 字段类型
    type: 'string'
    // bind: 'addRuleList.value',
  }, {
    // 拖动排序的序号
    name: 'orderSeq',
    type: 'number',
    transformRequest: (_, record) => {
      return record.index + 1;
    }
  }, {
    name: 'firstInputTitle',
    type: 'string',
    ignore: 'always'
  }, {
    name: 'firstInput',
    ignore: 'always',
    required: true,
    validator: (value, _, record) => {
      if ((record === null || record === void 0 ? void 0 : record.get('fieldType')) === SEQUENCE) {
        if (value < 1 || value > 20) {
          return `1<=${intl.get('hmde.bo.businessObject.serialnumber').d('流水号位数')}<=20`;
        }
      }
    },
    dynamicProps: {
      required: ({
        record
      }) => !!(!disabled && record !== null && record !== void 0 && record.get('fieldType')),
      lookupCode: ({
        record
      }) => {
        const fieldType = record === null || record === void 0 ? void 0 : record.get('fieldType');
        if ([UUID, DATE].includes(fieldType)) {
          switch (fieldType) {
            case UUID:
              return 'HMDE.BO_FIELD.CODE_RULE.UUID_DIGIT';
            case DATE:
              return 'HMDE.BUSINESS_OBJECT.CODE_RULE.DATE_MASK';
            case VARIABLE:
              return 'HMDE.BUSINESS_OBJECT.CODE_RULE.VARIABLE_TYPE';
            default:
              break;
          }
        }
      },
      type: ({
        record
      }) => {
        const fieldType = record === null || record === void 0 ? void 0 : record.get('fieldType');
        if ([SEQUENCE, UUID, DATE, VARIABLE].includes(fieldType)) {
          switch (fieldType) {
            case SEQUENCE:
              return 'number';
            case UUID:
            case DATE:
            case VARIABLE:
              return 'string';
            default:
              break;
          }
        }
      },
      valueField: ({
        record
      }) => {
        const fieldType = record === null || record === void 0 ? void 0 : record.get('fieldType');
        if ([SEQUENCE, UUID, DATE, VARIABLE].includes(fieldType)) {
          switch (fieldType) {
            case UUID:
            case DATE:
            case VARIABLE:
              return 'value';
            default:
              break;
          }
        }
      }
    }
  }, {
    name: 'secondInputTitle',
    type: 'string',
    ignore: 'always'
  }, {
    name: 'secondInput',
    ignore: 'always',
    type: 'string',
    dynamicProps: {
      type: ({
        record
      }) => {
        if ([SEQUENCE].includes(record === null || record === void 0 ? void 0 : record.get('fieldType'))) {
          return 'number';
        }
        return 'string';
      },
      required: ({
        record
      }) => {
        if ([SEQUENCE, VARIABLE].includes(record === null || record === void 0 ? void 0 : record.get('fieldType'))) {
          return true;
        }
        return false;
      },
      lookupCode: ({
        record
      }) => {
        if ([VARIABLE].includes(record === null || record === void 0 ? void 0 : record.get('fieldType')) && (record === null || record === void 0 ? void 0 : record.get('firstInput')) === 'VARIABLE') {
          // return 'HMDE.BO_FIELD.CODE_RULE.ENV_VARIABLE';
          return 'HMDE.BUSINESS_OBJECT.CODE_RULE.VARIABLE_TYPE';
        }
      }
    },
    validator: (value, name, record) => {
      var _value$toString;
      if ((record === null || record === void 0 ? void 0 : record.get('fieldType')) === SEQUENCE && ((_value$toString = value.toString()) === null || _value$toString === void 0 ? void 0 : _value$toString.length) > (record === null || record === void 0 ? void 0 : record.get('firstInput'))) {
        // notification.error({
        //   message: intl.get('hmde.common.status.error').d('失败'),
        //   description: intl
        //     .get('hmde.bo.businessObject.sequenceValidate')
        //     .d('起始流水长度不能大于位数的值'),
        //   placement: 'bottomRight',
        // });
        return intl.get('hmde.bo.businessObject.sequenceValidate').d('起始流水长度不能大于位数的值');
      }
    }
  }, {
    name: 'thirdInputTitle',
    type: 'string',
    ignore: 'always'
  }, {
    name: 'thirdInput',
    type: 'string',
    ignore: 'always',
    // lookupCode: 'HPFM.CODE_RULE.RESET_FREQUENCY',
    tooltip: 'overflow',
    dynamicProps: {
      required: ({
        record
      }) => {
        if ([VARIABLE].includes(record === null || record === void 0 ? void 0 : record.get('fieldType')) && record !== null && record !== void 0 && record.get('secondInput') || (record === null || record === void 0 ? void 0 : record.get('fieldType')) === SEQUENCE) {
          return true;
        }
        return false;
      },
      lookupCode: ({
        record
      }) => {
        switch (record === null || record === void 0 ? void 0 : record.get('fieldType')) {
          case SEQUENCE:
            return 'HPFM.CODE_RULE.RESET_FREQUENCY';
          case VARIABLE:
            return 'HMDE.BO_FIELD.CODE_RULE.ENV_VARIABLE';
          default:
            break;
        }
      }
    }
  }],
  events: {
    update: ({
      record,
      name,
      value,
      dataSet
    }) => {
      // 添加规则选项
      if (name === 'addRuleList') {
        record === null || record === void 0 ? void 0 : record.set('fieldType', value === null || value === void 0 ? void 0 : value.value);
        if ((value === null || value === void 0 ? void 0 : value.value) !== VARIABLE && record !== null && record !== void 0 && record.get('variableKey')) {
          record === null || record === void 0 ? void 0 : record.set('variableKey', null);
        }
        if (record !== null && record !== void 0 && record.get('firstInput')) {
          record === null || record === void 0 ? void 0 : record.set('firstInput', null);
        }
        if (record !== null && record !== void 0 && record.get('secondInput')) {
          record === null || record === void 0 ? void 0 : record.set('secondInput', null);
        }
        if (record !== null && record !== void 0 && record.get('thirdInput')) {
          record === null || record === void 0 ? void 0 : record.set('thirdInput', null);
        }
      }
      // 流水号
      if ((record === null || record === void 0 ? void 0 : record.get('fieldType')) === SEQUENCE) {
        record === null || record === void 0 ? void 0 : record.addField('encryptedFlag', {
          type: 'number',
          defaultValue: 0
        }); // 设置是否加密字段
        record === null || record === void 0 ? void 0 : record.addField('seqLength', {
          type: 'number'
        }); // 设置位数
        record === null || record === void 0 ? void 0 : record.addField('resetFrequency', {
          type: 'string'
        }); // 设置重置策略
        record === null || record === void 0 ? void 0 : record.addField('startValue', {
          type: 'number',
          defaultValue: 1
        }); // 设置起始流水
        if (name === 'firstInput') {
          record === null || record === void 0 ? void 0 : record.set('seqLength', value);
          record === null || record === void 0 ? void 0 : record.set('firstInput', value);
        }
        if (name === 'secondInput') {
          record === null || record === void 0 ? void 0 : record.set('startValue', value);
        }
        if (name === 'thirdInput') {
          record === null || record === void 0 ? void 0 : record.set('resetFrequency', value);
        }
        record === null || record === void 0 ? void 0 : record.set('firstInputTitle', intl.get('hmde.bo.businessObject.digit').d('位数'));
        record === null || record === void 0 ? void 0 : record.set('secondInputTitle', intl.get('hmde.bo.businessObject.initialFlow').d('起始流水'));
        record === null || record === void 0 ? void 0 : record.set('thirdInputTitle', intl.get('hmde.bo.businessObject.resetFrequency').d('重置频率'));
      }
      // 固定字符
      if ((record === null || record === void 0 ? void 0 : record.get('fieldType')) === CONSTANT) {
        record === null || record === void 0 ? void 0 : record.addField('fieldValue', {
          type: 'string'
        });
        if (name === 'firstInput') {
          record === null || record === void 0 ? void 0 : record.set('fieldValue', value);
        }
        record === null || record === void 0 ? void 0 : record.set('firstInputTitle', intl.get('hmde.common.fixedValue').d('固定值'));
        record === null || record === void 0 ? void 0 : record.set('secondInputTitle', null);
        record === null || record === void 0 ? void 0 : record.set('thirdInputTitle', null);
        dismissValidateBg(dataSet);
      }
      // 变量
      if ((record === null || record === void 0 ? void 0 : record.get('fieldType')) === VARIABLE) {
        record === null || record === void 0 ? void 0 : record.addField('variableKey', {
          type: 'string'
        });
        record === null || record === void 0 ? void 0 : record.addField('variableType', {
          type: 'string'
        });
        record === null || record === void 0 ? void 0 : record.addField('fieldValue', {
          type: 'string'
        });
        const variableArr = dataSet.filter(i => i.get('fieldType') === VARIABLE);
        record === null || record === void 0 ? void 0 : record.set('variableKey', `variable${variableArr.length}`);
        record === null || record === void 0 ? void 0 : record.set('firstInput', `variable${variableArr.length}`);
        if (name === 'secondInput') {
          record === null || record === void 0 ? void 0 : record.set('variableType', value);
        }
        if (name === 'thirdInput') {
          record === null || record === void 0 ? void 0 : record.set('fieldValue', value);
        }
        record === null || record === void 0 ? void 0 : record.set('firstInputTitle', intl.get('hmde.bo.businessObject.variableKey').d('段值'));
        record === null || record === void 0 ? void 0 : record.set('secondInputTitle', intl.get('hmde.bo.businessObject.variableType').d('变量类型'));
        record === null || record === void 0 ? void 0 : record.set('thirdInputTitle', intl.get('hmde.bo.businessObject.variableValue').d('变量值'));
        dismissValidateBg(dataSet);
      }
      // UUID
      if ((record === null || record === void 0 ? void 0 : record.get('fieldType')) === UUID) {
        record === null || record === void 0 ? void 0 : record.addField('seqLength', {
          type: 'string'
        }); // 设置位数
        if (name === 'firstInput') {
          record === null || record === void 0 ? void 0 : record.set('seqLength', value);
        }
        record === null || record === void 0 ? void 0 : record.set('firstInputTitle', intl.get('hmde.bo.businessObject.digit').d('位数'));
        record === null || record === void 0 ? void 0 : record.set('secondInputTitle', null);
        record === null || record === void 0 ? void 0 : record.set('thirdInputTitle', null);
        dismissValidateBg(dataSet);
      }
      // 日期
      if ((record === null || record === void 0 ? void 0 : record.get('fieldType')) === DATE) {
        record === null || record === void 0 ? void 0 : record.addField('dateMask', {
          type: 'string'
        });
        if (name === 'firstInput') {
          record === null || record === void 0 ? void 0 : record.set('dateMask', value);
        }
        record === null || record === void 0 ? void 0 : record.set('firstInputTitle', intl.get('hmde.bo.businessObject.dateFormat').d('日期格式'));
        record === null || record === void 0 ? void 0 : record.set('secondInputTitle', null);
        record === null || record === void 0 ? void 0 : record.set('thirdInputTitle', null);
        dismissValidateBg(dataSet);
      }
      if (name === 'variableType') {
        record === null || record === void 0 ? void 0 : record.set('thirdInput', '');
      }
    }
  }
});

// 创建表单配置
const createFormConfig = () => ({
  autoCreate: true,
  dataToJSON: "all",
  fields: [{
    label: intl.get('hmde.bo.businessObject.ruleName').d('规则名称'),
    name: 'ruleName',
    type: 'intl',
    required: true,
    validator: value => {
      if ((value === null || value === void 0 ? void 0 : value.length) > 60) {
        return intl.get('hmde.bo.businessObject.maxLength60').d(`字段编码长度不能超过60`);
      }
    }
  }, {
    label: intl.get('hmde.bo.businessObject.ruleCode').d('规则编码'),
    name: 'ruleCode',
    type: 'intl',
    pattern: /^[A-Z0-9][A-Z0-9-_./]*$/,
    format: 'uppercase',
    defaultValidationMessages: {
      patternMismatch: intl.get('hmde.bo.businessObject.patternValidation1').d('需以大写字母、数字开头，支持大写字母、数字及字符(-_./)组合')
    },
    required: true
  }, {
    name: 'sequenceIsolationLevel',
    label: intl.get('hmde.bo.businessObject.sequenceIsolationLevel').d('流水号规则'),
    type: 'string',
    lookupCode: 'HMDE.BUSINESS_OBJECT.FIELD.CODE_RULE_LEVEL',
    dynamicProps: {
      required: ({
        dataSet
      }) => {
        var _dataSet$parent, _dataSet$parent$child, _dataSet$parent$child2;
        return dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$parent = dataSet.parent) === null || _dataSet$parent === void 0 ? void 0 : (_dataSet$parent$child = _dataSet$parent.children) === null || _dataSet$parent$child === void 0 ? void 0 : (_dataSet$parent$child2 = _dataSet$parent$child.ruleListDS) === null || _dataSet$parent$child2 === void 0 ? void 0 : _dataSet$parent$child2.find(v => (v === null || v === void 0 ? void 0 : v.get('fieldType')) === 'SEQUENCE');
      }
    },
    defaultValue: 'TENANT'
  }, {
    name: 'isolationVariables',
    label: intl.get('hmde.bo.businessObject.isolationVariables').d('流水号规则变量'),
    type: 'string',
    dynamicProps: {
      required: ({
        record,
        dataSet
      }) => {
        var _dataSet$parent2, _dataSet$parent2$chil, _dataSet$parent2$chil2;
        return (record === null || record === void 0 ? void 0 : record.get('sequenceIsolationLevel')) === 'TENANT_VARIABLE' && (dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$parent2 = dataSet.parent) === null || _dataSet$parent2 === void 0 ? void 0 : (_dataSet$parent2$chil = _dataSet$parent2.children) === null || _dataSet$parent2$chil === void 0 ? void 0 : (_dataSet$parent2$chil2 = _dataSet$parent2$chil.ruleListDS) === null || _dataSet$parent2$chil2 === void 0 ? void 0 : _dataSet$parent2$chil2.find(v => (v === null || v === void 0 ? void 0 : v.get('fieldType')) === 'SEQUENCE'));
      }
    }
  }]
});

// 自动编码字段ds
export default (({
  isExtensionField,
  isEditMode,
  customPrimaryKeyCode,
  componentType,
  businessObjectId,
  disabled,
  boSourceType,
  extendFieldCreatedFlag,
  isApiCustomType
}) => ({
  autoCreate: true,
  dataToJSON: "all",
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
    name: 'useFlag',
    type: 'boolean'
  }, {
    // 回显attributeJson时 对应绑定了此对象的字段自动回显
    name: 'attributeJson',
    type: 'object'
  }, {
    name: 'businessObjectFieldId',
    type: 'string',
    ignore: 'always'
  }, {
    name: 'ruleCode',
    type: 'string'
  }, isTenant && boSourceType !== 'TENANT' && isExtensionField && {
    name: 'inheritFieldName',
    type: 'intl',
    label: intl.get('hmde.common.fieldName').d('字段名称'),
    dynamicProps: {
      required: () => isTenant && boSourceType !== 'TENANT' && isExtensionField
    },
    maxLength: 30
  }, !isExtensionField && {
    name: 'businessObjectFieldName',
    type: 'intl',
    label: intl.get('hmde.common.fieldName').d('字段名称'),
    // required: true,
    maxLength: 30,
    dynamicProps: {
      required: () => !isExtensionField
    }
  }, isExtensionField && {
    name: 'businessObjectField',
    label: intl.get('hmde.bo.businessObject.extendField.select').d('选择扩展字段'),
    type: 'object',
    unique: true,
    ignore: 'always',
    lovCode: 'HMDE.EXTEND_FIELD',
    dynamicProps: {
      required: () => isExtensionField && !isEditMode && boSourceType !== 'TENANT' && !extendFieldCreatedFlag
    },
    lovPara: {
      componentType,
      businessObjectId
    },
    lovQueryAxiosConfig: {
      url: `${lowcodeOrganizationURL({
        route: HZERO_HMDE
      })}/business-object-extend-field/extend-fields/list`,
      method: 'GET'
    }
  }, isExtensionField && {
    name: 'extendFieldId',
    type: 'string',
    bind: 'businessObjectField.extendFieldId'
  }, isTenant && boSourceType !== 'TENANT' && isExtensionField && {
    name: 'inheritFieldCode',
    type: 'string',
    label: intl.get('hmde.common.fieldCode').d('字段编码'),
    dynamicProps: {
      required: () => isTenant && boSourceType !== 'TENANT' && isExtensionField
    },
    validator: (value, name, record) => {
      var _record$dataSet;
      const extendFieldPrefixRule = record === null || record === void 0 ? void 0 : (_record$dataSet = record.dataSet) === null || _record$dataSet === void 0 ? void 0 : _record$dataSet.getState('extendFieldPrefixRule');
      return _validator(value, customPrimaryKeyCode, isExtensionField, extendFieldPrefixRule, record);
    },
    transformRequest: (val, record) => {
      if (val) {
        var _record$dataSet2;
        const extendFieldPrefixRule = record === null || record === void 0 ? void 0 : (_record$dataSet2 = record.dataSet) === null || _record$dataSet2 === void 0 ? void 0 : _record$dataSet2.getState('extendFieldPrefixRule');
        if (extendFieldPrefixRule) {
          return `${extendFieldPrefixRule}${_upperFirst(val)}`;
        }
        return val;
      }
    }
  }, !isExtensionField && {
    name: 'businessObjectFieldCode',
    type: 'string',
    label: intl.get('hmde.common.fieldCode').d('字段编码'),
    dynamicProps: {
      required: () => !isExtensionField
    },
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
          return `${extendFieldPrefixRule}${_upperFirst(val)}`;
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
    defaultValue: 240
  }, {
    name: 'optionSettings',
    type: 'string',
    label: intl.get('hmde.common.ruleCode').d('编码规则'),
    defaultValue: '_createCodeRule',
    bind: 'attributeJson.optionSettings'
  }, {
    name: 'optionTitle',
    type: 'string',
    ignore: 'always',
    label: intl.get('hmde.common.ruleCode').d('编码规则'),
    defaultValue: '已有编码规则'
  }, {
    name: 'readOnlyFlag',
    type: 'boolean',
    ignore: 'always',
    defaultValue: true,
    transformRequest: val => {
      return val !== null && val !== void 0 ? val : true;
    },
    label: intl.get('hmde.bo.businessObject.readOnlyFlag').d('字段只读'),
    bind: 'attributeJson.readOnlyFlag'
  }, {
    name: 'requiredFlag',
    type: 'boolean',
    trueValue: true,
    falseValue: false,
    defaultValue: true,
    label: intl.get('hmde.bo.businessObject.requiredFlag').d('字段必输')
    // required: true,
  }, {
    name: 'exportableFlag',
    type: 'boolean',
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
  }, !isExtensionField && {
    name: 'defaultDisplayFieldFlag',
    type: 'boolean',
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
  },
  // 放置不会被切换delete的字段 用于切换回显
  {
    name: 'codeRuleVO',
    type: 'object',
    ignore: 'always'
  }, {
    name: 'sequenceIsolationLevel',
    type: 'object',
    ignore: 'always'
  }, {
    name: 'storageEncryptFlag',
    type: 'boolean',
    transformResponse: value => Boolean(value)
  }],
  events: {
    update: ({
      name,
      value,
      record
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
            }
          });
        }
      }
      if (name === 'businessObjectFieldCode' && value) {
        // record?.set('businessObjectFieldCode', camelCase(value));
      }
    },
    load: ({
      dataSet
    }) => {
      var _dataSet$current;
      if (!dataSet.current.get('maxLength') && dataSet.current.get('maxLength') !== 0) {
        dataSet.current.set('maxLength', 240);
      }
      const data = dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$current = dataSet.current) === null || _dataSet$current === void 0 ? void 0 : _dataSet$current.toData();
      if (isExtensionField && data !== null && data !== void 0 && data.extendFieldMaxLength) {
        var _dataSet$current2, _dataSet$current2$get;
        // eslint-disable-next-line no-unused-expressions
        dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$current2 = dataSet.current) === null || _dataSet$current2 === void 0 ? void 0 : (_dataSet$current2$get = _dataSet$current2.getField('maxLength')) === null || _dataSet$current2$get === void 0 ? void 0 : _dataSet$current2$get.set('validator', recordValue => {
          if (recordValue || recordValue === 0) {
            if (recordValue > (data === null || data === void 0 ? void 0 : data.extendFieldMaxLength) || recordValue < 1) {
              return `
                    ${intl.get('hmde.bo.businessObject.range.minmax').d(`可填范围为`)}
                    ${1 - (data === null || data === void 0 ? void 0 : data.extendFieldMaxLength)}
                  `;
            }
          }
        });
      }
      if (!isExtensionField && isTenant && boSourceType !== 'TENANT' && isEditMode) {
        var _dataSet$current3, _dataSet$current3$get;
        // eslint-disable-next-line no-unused-expressions
        dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$current3 = dataSet.current) === null || _dataSet$current3 === void 0 ? void 0 : (_dataSet$current3$get = _dataSet$current3.getField('maxLength')) === null || _dataSet$current3$get === void 0 ? void 0 : _dataSet$current3$get.set('validator', recordValue => {
          if (recordValue || recordValue === 0) {
            if (recordValue > (data === null || data === void 0 ? void 0 : data.platformFieldMaxLength) || recordValue < 1) {
              return `
                    ${intl.get('hmde.bo.businessObject.range.minmax').d(`可填范围为`)}
                    ${1 - (data === null || data === void 0 ? void 0 : data.platformFieldMaxLength)}
                  `;
            }
          }
        });
      }
    }
  },
  children: {
    // 已有编码规则
    ruleListDS: new _DataSet({
      ...commonListConfig(disabled)
    }),
    // 新建编码规则form表单
    ruleFormDS: new _DataSet({
      ...createFormConfig()
    })
  }
}));
const lovDS = () => ({
  autoCreate: true,
  autoQuery: false,
  transport: {
    // 根据lov选出的ruleCode查询详情
    read: {
      url: `${lowcodeOrganizationURL({
        route: HZERO_HMDE
      })}/business-object-fields/code-rule/detail`,
      method: 'get'
    }
  },
  fields: [{
    name: 'ruleCodeInfo',
    type: 'object'
  }, {
    name: 'selectCodeRule',
    type: 'object',
    label: intl.get('hmde.common.ruleCode').d('编码规则'),
    required: true,
    textField: 'ruleName',
    valueField: 'ruleCode',
    lovCode: isTenant ? 'HMDE.CODE_RULE' : 'HMDE.CODE_RULE.SITE',
    lovPara: {
      tenantId
    }
  }, {
    name: 'ruleName',
    type: 'string',
    bind: 'selectCodeRule.ruleName'
  }, {
    name: 'ruleCode',
    type: 'string',
    bind: 'selectCodeRule.ruleCode'
  }]
});
export { lovDS };