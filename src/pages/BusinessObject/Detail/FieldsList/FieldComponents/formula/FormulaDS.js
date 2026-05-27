import _DataSet from "choerodon-ui/pro/lib/data-set";
import _upperFirst from "lodash/upperFirst";
import _camelCase from "lodash/camelCase";
import intl from 'hzero-front/lib/utils/intl';
import { isTenantRoleLevel, getCurrentOrganizationId } from 'utils/utils';
import React from 'react';
import { DataToJSON } from 'choerodon-ui/pro/lib/data-set/enum';
import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import LabelTitleRender from "hzero-front-hmde/lib/businessComponents/LabelTitleRender";
import { typeMapConvert } from "./utils";
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
export default ((isExtensionField, isFromDomain, customPrimaryKeyCode, boSourceType) => ({
  autoCreate: true,
  transport: {
    tls: isTenant && boSourceType !== 'TENANT' ? ({
      dataSet,
      name
    }) => {
      return {
        url: `${lowcodeOrganizationURL({
          route: HZERO_HMDE
        })}/business-object-fields/multi-language`,
        params: {
          ...(dataSet === null || dataSet === void 0 ? void 0 : dataSet.getState('tlsParams')),
          fieldName: name
        }
      };
    } : undefined
  },
  fields: [{
    name: 'attributeJson',
    type: 'object'
  }, !isFromDomain && isTenant && boSourceType !== 'TENANT' && isExtensionField && {
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
  }, !isFromDomain && isTenant && boSourceType !== 'TENANT' && isExtensionField && {
    name: 'inheritFieldCode',
    type: 'string',
    label: intl.get('hmde.common.fieldCode').d('字段编码'),
    required: true,
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
  }, !isFromDomain && !isExtensionField && {
    name: 'businessObjectFieldCode',
    type: 'string',
    label: intl.get('hmde.common.fieldCode').d('字段编码'),
    required: true,
    validator: (value, name, record) => {
      var _record$dataSet3;
      const extendFieldPrefixRule = record === null || record === void 0 ? void 0 : (_record$dataSet3 = record.dataSet) === null || _record$dataSet3 === void 0 ? void 0 : _record$dataSet3.getState('extendFieldPrefixRule');
      return _validator(`${value}`, customPrimaryKeyCode, isExtensionField, extendFieldPrefixRule, record);
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
  }, isFromDomain && {
    name: 'templateFieldCode',
    type: 'string',
    label: intl.get('hmde.common.fieldCode').d('字段编码'),
    required: true,
    validator: (value, name, record) => {
      var _record$dataSet5;
      const extendFieldPrefixRule = record === null || record === void 0 ? void 0 : (_record$dataSet5 = record.dataSet) === null || _record$dataSet5 === void 0 ? void 0 : _record$dataSet5.getState('extendFieldPrefixRule');
      return _validator(`${extendFieldPrefixRule}${value}`, customPrimaryKeyCode, isExtensionField, extendFieldPrefixRule, record);
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
  }, {
    name: 'helpText',
    type: 'object',
    label: /*#__PURE__*/React.createElement(LabelTitleRender, {
      value: intl.get('hmde.common.helpText').d('帮助文本'),
      help: intl.get('hmde.bo.businessObject.defaultshowflagnew.help').d('当用户悬停在此字段旁的问号图标时，会在表单字段下方显示该提示文本内容')
    }),
    bind: 'attributeJson.helpText',
    ignore: 'always'
  }, {
    name: 'remark',
    type: 'intl',
    label: intl.get('hmde.common.remark').d('描述')
  }, {
    name: 'resultComponentType',
    bind: 'attributeJson.resultComponentType',
    ignore: 'always',
    type: 'string',
    transformRequest: (value, record) => {
      return typeMapConvert(record === null || record === void 0 ? void 0 : record.get('resultType'));
    }
  }, {
    name: 'resultType',
    type: 'string',
    label: intl.get('hmde.bo.businessObject.resultType').d('返回值类型'),
    required: true,
    options: new _DataSet({
      paging: false,
      data: [{
        value: 'Long',
        meaning: intl.get('hmde.common.numberField').d('整数')
      }, {
        value: 'BigDecimal',
        meaning: intl.get('hmde.common.float').d('浮点数')
      }, {
        value: 'String',
        meaning: intl.get('hmde.common.textField').d('文本')
      }, {
        value: 'LocalDate',
        meaning: intl.get('hmde.common.date').d('日期')
      }, {
        value: 'ZonedDateTime',
        meaning: intl.get('hmde.common.dateTime').d('日期时间')
      }, {
        value: 'Boolean',
        meaning: intl.get('hmde.common.switch').d('开关')
      }, {
        value: FieldComponentType.SINGLE_SELECT,
        meaning: intl.get('hmde.common.singleSelect').d('下拉单选')
      }, {
        value: FieldComponentType.MULTIPLE_SELECT,
        meaning: intl.get('hmde.common.multipleSelect').d('下拉多选')
      }]
    }),
    bind: 'attributeJson.resultType',
    ignore: 'always',
    transformResponse: (value, object) => {
      var _object$attributeJson, _object$attributeJson2;
      if ((object === null || object === void 0 ? void 0 : (_object$attributeJson = object.attributeJson) === null || _object$attributeJson === void 0 ? void 0 : _object$attributeJson.resultComponentType) === FieldComponentType.SINGLE_SELECT || (object === null || object === void 0 ? void 0 : (_object$attributeJson2 = object.attributeJson) === null || _object$attributeJson2 === void 0 ? void 0 : _object$attributeJson2.resultComponentType) === FieldComponentType.MULTIPLE_SELECT) {
        var _object$attributeJson3;
        return object === null || object === void 0 ? void 0 : (_object$attributeJson3 = object.attributeJson) === null || _object$attributeJson3 === void 0 ? void 0 : _object$attributeJson3.resultComponentType;
      }
      return value;
    }
  }, {
    name: 'digitalAccuracy',
    type: 'number',
    label: intl.get('hmde.bo.businessObject.accuracy').d('精度'),
    max: 8,
    min: 0,
    step: 1,
    computedProps: {
      required: ({
        record
      }) => (record === null || record === void 0 ? void 0 : record.get('resultType')) === 'BigDecimal'
    },
    transformRequest: (value, record) => {
      if ((record === null || record === void 0 ? void 0 : record.get('resultType')) !== 'BigDecimal') {
        return null;
      }
      return value;
    }
  },
  // {
  //   name: 'thousandsFlag',
  //   type: 'boolean',
  //   label: intl.get('hmde.bo.field.thousands').d('显示千分位'),
  //   trueValue: true,
  //   falseValue: false,
  //   defaultValue: false,
  //   bind: 'attributeJson.thousandsFlag',
  //   transformResponse: (value) => {
  //     if (value === undefined || value === null) {
  //       return false;
  //     } else {
  //       return value;
  //     }
  //   },
  //   ignore: 'always',
  // },
  // {
  //   name: 'displayFormat',
  //   type: 'string',
  //   label: intl.get('hmde.bo.field.displayFormat').d('显示格式'),
  //   options: new DataSet({
  //     data: [
  //       {
  //         meaning: intl.get('hmde.common.format.yyyy-mm-dd').d('年-月-日（YYYY-MM-DD）'),
  //         value: 'YYYY-MM-DD',
  //       },
  //       {
  //         value: 'MM-DD',
  //         meaning: intl.get('hmde.common.format.mmdd').d('月-日（MM-DD）'),
  //       },
  //       {
  //         value: 'DD',
  //         meaning: intl.get('hmde.common.format.dd').d('日（DD）'),
  //       },
  //     ],
  //   }),
  //   bind: 'attributeJson.displayFormat',
  //   ignore: 'always',
  // },
  {
    name: 'formula',
    type: 'string',
    label: intl.get('hmde.common.express').d('表达式')
    // required: true,
  }, {
    name: 'requiredFlag',
    type: 'boolean',
    defaultValue: false
    // transformResponse: (value) => {
    //   if (value === undefined || value === null) {
    //     return true;
    //   } else {
    //     return value;
    //   }
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
  },
  // 选项设置 板块
  {
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
    name: 'valueList',
    type: 'object',
    label: intl.get('hmde.common.valueList').d('值集'),
    ignore: 'always',
    lovCode: isTenant ? 'HMDE.LOV_IDP' : 'HMDE.SITE.LOV_IDP',
    valueField: 'lovCode',
    textField: 'lovName',
    dynamicProps: {
      required: ({
        record
      }) => {
        const isSelectField = [FieldComponentType.SINGLE_SELECT, FieldComponentType.MULTIPLE_SELECT, 'Boolean'].includes(record === null || record === void 0 ? void 0 : record.get('resultType'));
        return (record === null || record === void 0 ? void 0 : record.get('optionSettings')) === '_valueList' && isSelectField;
      }
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
  }].filter(Boolean),
  children: {
    customOptionList: new _DataSet({
      ...lovValuesDS('_custom')
    }),
    lovValues: new _DataSet({
      ...lovValuesDS('_valueList')
    })
  },
  events: {
    update: ({
      name,
      value,
      record
    }) => {
      if (name === 'businessObjectFieldCode' && value) {
        record === null || record === void 0 ? void 0 : record.set('businessObjectFieldCode', _camelCase(value));
      }
    }
  }
}));
export const lovValuesDS = optionSettings => ({
  autoCreate: false,
  selection: false,
  dataToJSON: "normal",
  fields: [{
    label: intl.get('hmde.common.meaningShow').d('含义（用于显示）'),
    name: 'meaning',
    type: 'intl',
    dynamicProps: {
      required: ({
        dataSet
      }) => {
        var _dataSet$parent, _dataSet$parent$curre;
        if (!optionSettings) {
          return true;
        }
        return optionSettings === (dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$parent = dataSet.parent) === null || _dataSet$parent === void 0 ? void 0 : (_dataSet$parent$curre = _dataSet$parent.current) === null || _dataSet$parent$curre === void 0 ? void 0 : _dataSet$parent$curre.get('optionSettings'));
      }
    }
  }, {
    label: intl.get('hmde.common.value').d('值（用于储存）'),
    name: 'value',
    type: 'string',
    unique: true,
    dynamicProps: {
      required: ({
        dataSet
      }) => {
        var _dataSet$parent2, _dataSet$parent2$curr;
        if (!optionSettings) {
          return true;
        }
        return optionSettings === (dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$parent2 = dataSet.parent) === null || _dataSet$parent2 === void 0 ? void 0 : (_dataSet$parent2$curr = _dataSet$parent2.current) === null || _dataSet$parent2$curr === void 0 ? void 0 : _dataSet$parent2$curr.get('optionSettings'));
      }
    }
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
  }]
});
export const lovDefineDS = ({
  businessObjectCode,
  selectDs
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
      pattern: /^[A-Z0-9][A-Z0-9_]*$/,
      required: true,
      format: 'uppercase',
      defaultValidationMessages: {
        patternMismatch: intl.get('hmde.bo.businessObject.patternValidation2').d('需以大写字母、数字开头，支持大写字母、数字及下划线组合')
      }
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