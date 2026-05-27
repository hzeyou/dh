import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";
import _isArray from "lodash/isArray";
import _isNull from "lodash/isNull";
import _isUndefined from "lodash/isUndefined";
/* eslint-disable no-param-reassign */
import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';
import intl from 'utils/intl';
import { getResponse, getCurrentOrganizationId, isTenantRoleLevel } from 'utils/utils';
import { deltaToHtml } from "hzero-front-apaas/lib/utils/richTextTransform";
import { SourceType, FieldType } from "hzero-front-apaas/lib/constants/businessObject";
const isTenant = isTenantRoleLevel();

// 对拿到的后端数据进行修复
export function polyfillData(res) {
  // 预置关联关系字段-视图来源 默认设为业务对象值列表
  if (res.componentType === 'LINK_RELATION' && !res.optionType) {
    Object.assign(res, {
      optionType: 'BUSINESS_OBJECT_OPTION'
    });
  }
}

// 判断业务是否是查询类api入参
export const viewTypeApi = (apiModelRecord, apiType) => {
  return apiModelRecord.get('paramCategory') === 'INPUT' && ['PAGE', 'QUERY', 'LIST', 'COUNT', 'LANE_LIST', 'LANE_PAGE'].includes(apiType);
};
const attributeJsonArr = [{
  type: ['SINGLE_SELECT', 'MULTIPLE_SELECT', 'RADIO', 'CHECKBOX'],
  field: ['componentType', 'customOptionList', 'helpText', 'readOnlyFlag', 'parentOptionField', 'parentLovCode']
}, {
  type: ['DATETIME_SELECTION_BOX', 'EMAIL', 'LINK', 'REFERENCE_FIELD'],
  field: ['componentType', 'helpText']
}, {
  type: ['SWITCH'],
  field: ['componentType', 'customOptionList', 'helpText', 'readOnlyFlag']
}, {
  type: ['FORMULA'],
  field: ['componentType', 'customOptionList', 'displayFormat', 'helpText', 'resultType', 'resultComponentType', 'thousandsFlag']
}, {
  type: ['MONEY'],
  field: ['componentType', 'thousandsFlag', 'helpText', 'readOnlyFlag']
}, {
  type: ['DATE_SELECTION_BOX'],
  field: ['componentType', 'displayFormat', 'helpText']
}, {
  type: ['APPENDIX'],
  field: ['componentType', 'fileTypes', 'maxFileSize', 'fileStorageType', 'maxFileCount', 'helpText', 'multipleFlag', 'readOnlyFlag']
}, {
  type: ['LINK_RELATION', 'MASTER_RELATION'],
  field: ['componentType', 'lovDisplayType', 'helpText', 'readOnlyFlag']
}, {
  type: ['TEXT_FIELD', 'TEXT_AREA', 'RICH_TEXT', 'NUMBER_FIELD', 'FLOAT', 'PERCENTAGE', 'PHONE_NUMBER', 'LOCATION'],
  field: ['componentType', 'helpText', 'readOnlyFlag']
}, {
  type: ['CODE_RULE'],
  field: ['componentType', 'helpText', 'readOnlyFlag', 'codeRule']
}];
export const handleAttributeJson = (body, isExtensionField) => {
  var _body$attributeJson, _body$attributeJson3, _body$attributeJson5, _body$attributeJson7, _body$attributeJson10, _body$attributeJson11;
  if (body !== null && body !== void 0 && (_body$attributeJson = body.attributeJson) !== null && _body$attributeJson !== void 0 && _body$attributeJson.componentType) {
    const fields = attributeJsonArr.find(v => {
      var _body$attributeJson2;
      return v.type.includes(body === null || body === void 0 ? void 0 : (_body$attributeJson2 = body.attributeJson) === null || _body$attributeJson2 === void 0 ? void 0 : _body$attributeJson2.componentType);
    });
    if (fields !== null && fields !== void 0 && fields.field) {
      Object.keys(body.attributeJson || {}).forEach(key => {
        if (!(fields !== null && fields !== void 0 && fields.field.includes(key))) {
          // eslint-disable-next-line no-param-reassign
          delete body.attributeJson[key];
        }
      });
    }
  }

  // 处理2 下拉单选 下拉多选 复选 单选 特殊处理 默认值类型特殊处理
  if (['SINGLE_SELECT', 'MULTIPLE_SELECT', 'RADIO', 'CHECKBOX'].includes(body === null || body === void 0 ? void 0 : (_body$attributeJson3 = body.attributeJson) === null || _body$attributeJson3 === void 0 ? void 0 : _body$attributeJson3.componentType)) {
    var _body$attributeJson4, _body$attributeJson4$;
    if (!(body !== null && body !== void 0 && (_body$attributeJson4 = body.attributeJson) !== null && _body$attributeJson4 !== void 0 && (_body$attributeJson4$ = _body$attributeJson4.customOptionList) !== null && _body$attributeJson4$ !== void 0 && _body$attributeJson4$.length) && !(body !== null && body !== void 0 && body.lovCode)) {
      Object.assign(body, {
        defaultValueType: 'none',
        defaultValue: ''
      });
    }
  }

  // 非 关联/从主字段 清空关联对象相关数据
  if (![FieldComponentType.LINK_RELATION, FieldComponentType.MASTER_RELATION, FieldComponentType.MULTIPLE_RELATION].includes(body === null || body === void 0 ? void 0 : (_body$attributeJson5 = body.attributeJson) === null || _body$attributeJson5 === void 0 ? void 0 : _body$attributeJson5.componentType)) {
    delete body.masterBusinessObjectCode;
    delete body.masterBusinessObjectId;
    delete body.masterBusinessObjectName;
  }
  if (isExtensionField && !isTenantRoleLevel()) {
    var _body$attributeJson6;
    if ((body === null || body === void 0 ? void 0 : (_body$attributeJson6 = body.attributeJson) === null || _body$attributeJson6 === void 0 ? void 0 : _body$attributeJson6.componentType) !== FieldComponentType.TEXT_FIELD) {
      delete body.maxLength;
    }
  }

  // 附件
  if ((body === null || body === void 0 ? void 0 : (_body$attributeJson7 = body.attributeJson) === null || _body$attributeJson7 === void 0 ? void 0 : _body$attributeJson7.componentType) === FieldComponentType.APPENDIX) {
    var _body$attributeJson8;
    if (_isNull(body === null || body === void 0 ? void 0 : (_body$attributeJson8 = body.attributeJson) === null || _body$attributeJson8 === void 0 ? void 0 : _body$attributeJson8.maxFileCount)) {
      var _body$attributeJson9;
      body === null || body === void 0 ? true : (_body$attributeJson9 = body.attributeJson) === null || _body$attributeJson9 === void 0 ? true : delete _body$attributeJson9.maxFileCount;
      body === null || body === void 0 ? true : delete body.maxFileCount;
    }
  }

  // 非从主字段
  if ((body === null || body === void 0 ? void 0 : (_body$attributeJson10 = body.attributeJson) === null || _body$attributeJson10 === void 0 ? void 0 : _body$attributeJson10.componentType) !== FieldComponentType.MASTER_RELATION) {
    body === null || body === void 0 ? true : delete body.linkRelationType;
  }

  // 日期类型特殊处理
  if ((body === null || body === void 0 ? void 0 : (_body$attributeJson11 = body.attributeJson) === null || _body$attributeJson11 === void 0 ? void 0 : _body$attributeJson11.componentType) === FieldComponentType.DATE_SELECTION_BOX) {
    if ((body === null || body === void 0 ? void 0 : body.defaultValue) === 'CURRENT_DATE()') {
      body.defaultValueType = 'EXPRESSION';
    }
  }
  delete body._dirtyMy;
  return body;
};

// 字段切换 特殊处理
export const handleFieldChange = ({
  ds,
  value,
  businessObjectId,
  oType
}) => {
  var _ds$current13, _hasMaxLengthFieldLis, _ds$current23, _ds$current23$get, _ds$setState, _ds$current28, _ds$current28$set;
  // 切换到 日期/日期时间需要注意一下 他的默认值不太一样
  if ([FieldComponentType.DATETIME_SELECTION_BOX, FieldComponentType.DATE_SELECTION_BOX].includes(value)) {
    var _ds$current, _ds$current2;
    if (!(ds !== null && ds !== void 0 && (_ds$current = ds.current) !== null && _ds$current !== void 0 && _ds$current.get('fixDateTime')) || (ds === null || ds === void 0 ? void 0 : (_ds$current2 = ds.current) === null || _ds$current2 === void 0 ? void 0 : _ds$current2.get('fixDateTime')) === 'CURRENT_DATE()') {
      var _ds$current3;
      ds === null || ds === void 0 ? void 0 : (_ds$current3 = ds.current) === null || _ds$current3 === void 0 ? void 0 : _ds$current3.set('fixDateTime', 'none');
    }
  }
  // 处理日期类型 切到其他类型 返回值类型的bug
  if ([FieldComponentType.DATETIME_SELECTION_BOX, FieldComponentType.DATE_SELECTION_BOX].includes(oType) && ![FieldComponentType.DATETIME_SELECTION_BOX, FieldComponentType.DATE_SELECTION_BOX].includes(value)) {
    var _ds$current4, _ds$current5, _ds$current6;
    ds === null || ds === void 0 ? void 0 : (_ds$current4 = ds.current) === null || _ds$current4 === void 0 ? void 0 : _ds$current4.set('fixDateTime', undefined);
    ds === null || ds === void 0 ? void 0 : (_ds$current5 = ds.current) === null || _ds$current5 === void 0 ? void 0 : _ds$current5.set('defaultValueType', 'none');
    ds === null || ds === void 0 ? void 0 : (_ds$current6 = ds.current) === null || _ds$current6 === void 0 ? void 0 : _ds$current6.set('defaultValue', '');
  }

  // 切换到从主字段 那么需要初始化一下是否必输
  if (value === FieldComponentType.MASTER_RELATION) {
    var _ds$current7, _ds$current8, _ds$current9;
    ds === null || ds === void 0 ? void 0 : (_ds$current7 = ds.current) === null || _ds$current7 === void 0 ? void 0 : _ds$current7.set('requiredFlag', (ds === null || ds === void 0 ? void 0 : (_ds$current8 = ds.current) === null || _ds$current8 === void 0 ? void 0 : _ds$current8.get('masterBusinessObjectId')) !== businessObjectId);
    if (!(ds !== null && ds !== void 0 && (_ds$current9 = ds.current) !== null && _ds$current9 !== void 0 && _ds$current9.get('linkRelationType'))) {
      var _ds$current10;
      ds === null || ds === void 0 ? void 0 : (_ds$current10 = ds.current) === null || _ds$current10 === void 0 ? void 0 : _ds$current10.set('linkRelationType', 'ONE_TO_MANY');
    }
  }

  // 切换到 关联重组 如果试图来源为空需要添加试图来源默认值
  if ([FieldComponentType.LINK_RELATION, FieldComponentType.MASTER_RELATION].includes(value)) {
    var _ds$current11;
    if (!(ds !== null && ds !== void 0 && (_ds$current11 = ds.current) !== null && _ds$current11 !== void 0 && _ds$current11.get('optionType'))) {
      var _ds$current12;
      ds === null || ds === void 0 ? void 0 : (_ds$current12 = ds.current) === null || _ds$current12 === void 0 ? void 0 : _ds$current12.set('optionType', 'BUSINESS_OBJECT_OPTION');
    }
  }

  // 默认值类型 特殊处理
  if (!['none', 'NORMAL', 'EXPRESSION'].includes(ds === null || ds === void 0 ? void 0 : (_ds$current13 = ds.current) === null || _ds$current13 === void 0 ? void 0 : _ds$current13.get('defaultValueType')) && value !== FieldComponentType.SWITCH) {
    var _ds$current14;
    ds === null || ds === void 0 ? void 0 : (_ds$current14 = ds.current) === null || _ds$current14 === void 0 ? void 0 : _ds$current14.set('defaultValueType', 'none');
  }

  // 开关类型
  if (value === FieldComponentType.SWITCH) {
    var _ds$current15;
    if (!(ds !== null && ds !== void 0 && (_ds$current15 = ds.current) !== null && _ds$current15 !== void 0 && _ds$current15.get('meaningConfig'))) {
      var _ds$current16, _ds$current17, _ds$current18, _ds$current19;
      ds === null || ds === void 0 ? void 0 : (_ds$current16 = ds.current) === null || _ds$current16 === void 0 ? void 0 : _ds$current16.set('meaningConfig', 'selfConfig');
      ds === null || ds === void 0 ? void 0 : (_ds$current17 = ds.current) === null || _ds$current17 === void 0 ? void 0 : _ds$current17.set('valueList', '');
      ds === null || ds === void 0 ? void 0 : (_ds$current18 = ds.current) === null || _ds$current18 === void 0 ? void 0 : _ds$current18.set('defaultValue', '0');
      ds === null || ds === void 0 ? void 0 : (_ds$current19 = ds.current) === null || _ds$current19 === void 0 ? void 0 : _ds$current19.set('defaultValueType', '0');
    }
  }

  // 最大长度默认值处理
  if (hasMaxLengthFieldList !== null && hasMaxLengthFieldList !== void 0 && (_hasMaxLengthFieldLis = hasMaxLengthFieldList.includes) !== null && _hasMaxLengthFieldLis !== void 0 && _hasMaxLengthFieldLis.call(hasMaxLengthFieldList, value)) {
    // if (!ds?.current?.get?.('maxLength')) {
    setDefaultMaxLength === null || setDefaultMaxLength === void 0 ? void 0 : setDefaultMaxLength(ds === null || ds === void 0 ? void 0 : ds.current, value);
    // }
  } else {
    var _ds$current20, _ds$current20$set;
    ds === null || ds === void 0 ? void 0 : (_ds$current20 = ds.current) === null || _ds$current20 === void 0 ? void 0 : (_ds$current20$set = _ds$current20.set) === null || _ds$current20$set === void 0 ? void 0 : _ds$current20$set.call(_ds$current20, 'maxLength', null);
  }

  // 附件
  if (value === FieldComponentType.APPENDIX) {
    var _ds$current21;
    if (_isUndefined(ds === null || ds === void 0 ? void 0 : (_ds$current21 = ds.current) === null || _ds$current21 === void 0 ? void 0 : _ds$current21.get('maxFileCount'))) {
      var _ds$current22;
      ds === null || ds === void 0 ? void 0 : (_ds$current22 = ds.current) === null || _ds$current22 === void 0 ? void 0 : _ds$current22.set('maxFileCount', 1);
    }
  }

  // 兼容 手机号码/电子邮箱 的默认值效验不通过问题
  if ((ds === null || ds === void 0 ? void 0 : (_ds$current23 = ds.current) === null || _ds$current23 === void 0 ? void 0 : (_ds$current23$get = _ds$current23.get) === null || _ds$current23$get === void 0 ? void 0 : _ds$current23$get.call(_ds$current23, 'defaultValueType')) === 'none') {
    var _ds$current24, _ds$current24$set;
    ds === null || ds === void 0 ? void 0 : (_ds$current24 = ds.current) === null || _ds$current24 === void 0 ? void 0 : (_ds$current24$set = _ds$current24.set) === null || _ds$current24$set === void 0 ? void 0 : _ds$current24$set.call(_ds$current24, 'defaultValue', '');
  }

  // 引用字段
  if (value === FieldComponentType.REFERENCE_FIELD) {
    var _ds$current25;
    const formula = ds === null || ds === void 0 ? void 0 : (_ds$current25 = ds.current) === null || _ds$current25 === void 0 ? void 0 : _ds$current25.get('formula');
    if (!_isNil(formula)) {
      ds.current.set('formula', null);
    }
  }

  // 非浮点 和 金额 百分数 清空 小数位数
  if (![FieldComponentType.FLOAT, FieldComponentType.MONEY, FieldComponentType.PERCENTAGE].includes(value)) {
    var _ds$current26, _ds$current26$set;
    ds === null || ds === void 0 ? void 0 : (_ds$current26 = ds.current) === null || _ds$current26 === void 0 ? void 0 : (_ds$current26$set = _ds$current26.set) === null || _ds$current26$set === void 0 ? void 0 : _ds$current26$set.call(_ds$current26, 'digitalAccuracy', null);
  }

  // 非 文本 电子邮箱 手机号码 自动编号 存储加密需要置为false;
  if (![FieldComponentType.TEXT_FIELD, FieldComponentType.PHONE_NUMBER, FieldComponentType.EMAIL, FieldComponentType.CODE_RULE].includes(value)) {
    var _ds$current27, _ds$current27$set;
    ds === null || ds === void 0 ? void 0 : (_ds$current27 = ds.current) === null || _ds$current27 === void 0 ? void 0 : (_ds$current27$set = _ds$current27.set) === null || _ds$current27$set === void 0 ? void 0 : _ds$current27$set.call(_ds$current27, 'storageEncryptFlag', false);
  }

  // 设置已修改状态
  ds === null || ds === void 0 ? void 0 : (_ds$setState = ds.setState) === null || _ds$setState === void 0 ? void 0 : _ds$setState.call(ds, '_dirty', true);
  ds === null || ds === void 0 ? void 0 : (_ds$current28 = ds.current) === null || _ds$current28 === void 0 ? void 0 : (_ds$current28$set = _ds$current28.set) === null || _ds$current28$set === void 0 ? void 0 : _ds$current28$set.call(_ds$current28, '_dirtyMy', +new Date());
};

// 拥有最大长度的字段
export const hasMaxLengthFieldList = [FieldComponentType.TEXT_FIELD, FieldComponentType.TEXT_AREA, FieldComponentType.RICH_TEXT, FieldComponentType.SINGLE_SELECT, FieldComponentType.MULTIPLE_SELECT, FieldComponentType.RADIO, FieldComponentType.CHECKBOX, FieldComponentType.PHONE_NUMBER, FieldComponentType.EMAIL, FieldComponentType.CODE_RULE, FieldComponentType.APPENDIX, FieldComponentType.LOCATION];

// 设置最大长度默认值
export const setDefaultMaxLength = (record, value) => {
  if ([FieldComponentType.TEXT_AREA, FieldComponentType.RICH_TEXT].includes(value)) {
    record === null || record === void 0 ? void 0 : record.set('maxLength', null);
  } else if (value === FieldComponentType.PHONE_NUMBER) {
    record === null || record === void 0 ? void 0 : record.set('maxLength', 11);
  } else if ([FieldComponentType.SINGLE_SELECT, FieldComponentType.MULTIPLE_SELECT, FieldComponentType.RADIO, FieldComponentType.CHECKBOX].includes(value)) {
    record === null || record === void 0 ? void 0 : record.set('maxLength', 30);
  } else if ([FieldComponentType.LOCATION].includes(value)) {
    record === null || record === void 0 ? void 0 : record.set('maxLength', 480);
  } else {
    record === null || record === void 0 ? void 0 : record.set('maxLength', 240);
  }
};

// 字段保存前置方法
export const handleFieldSave = async ({
  formValues,
  componentType,
  childrenComRef,
  getInheritType,
  businessObjectCode,
  isExtensionField,
  businessObjectId,
  isApiCustomType,
  selectComponentName,
  apiModelRecord,
  apiType,
  handleCloseDetail,
  getAddonBefore,
  fastCreateEnter,
  businessObjectFieldId,
  fastCreateEnterRecord,
  fieldType,
  boSourceType,
  createPlateformExtensionBusinessObjectField,
  oldComponentType,
  isEditMode,
  modal,
  domainId,
  updateBusinessObjectField,
  createBusinessObjectField,
  isFromDomain,
  dominFieldExtendsDs,
  templateCode,
  editDomainTemplateField,
  createDomainTemplateField,
  updatePlateformExtensionBusinessObjectField,
  createTenantExtensionBusinessObjectField,
  handleDeleteCheckApi,
  dispatchService,
  type
}) => {
  if (formValues) {
    var _formValues, _formValues2;
    if (['none', 'EXPRESSION'].indexOf((_formValues = formValues) === null || _formValues === void 0 ? void 0 : _formValues.defaultValueType) === 0) {
      formValues.defaultValueType = 'none';
    }
    // 自定义取数据方法
    formValues.attributeJson = {
      ...((_formValues2 = formValues) === null || _formValues2 === void 0 ? void 0 : _formValues2.attributeJson),
      componentType
    };
    // 日期时间
    if (componentType === FieldComponentType.DATETIME_SELECTION_BOX) {
      switch (formValues.fixDateTime) {
        case 'none':
          delete formValues.defaultValue;
          formValues = {
            ...formValues,
            defaultValueType: 'none'
          };
          break;
        case 'CURRENT_TIMESTAMP':
          formValues = {
            ...formValues,
            defaultValue: formValues.fixDateTime,
            defaultValueType: 'NORMAL'
          };
          break;
        case 'fix':
          formValues = {
            ...formValues,
            defaultValue: formValues.defaultValue,
            defaultValueType: 'NORMAL'
          };
          break;
        case 'EXPRESSION':
          formValues = {
            ...formValues,
            defaultValue: formValues.defaultValue,
            defaultValueType: 'EXPRESSION'
          };
          break;
        default:
      }
    } else if (componentType === FieldComponentType.DATE_SELECTION_BOX) {
      var _formValues3, _formValues4, _formValues5;
      // 日期
      if (((_formValues3 = formValues) === null || _formValues3 === void 0 ? void 0 : _formValues3.defaultValue) === 'none' || ((_formValues4 = formValues) === null || _formValues4 === void 0 ? void 0 : _formValues4.fixDateTime) === 'none') {
        delete formValues.defaultValue;
        formValues = {
          ...formValues,
          defaultValueType: 'none'
        };
      }
      if (((_formValues5 = formValues) === null || _formValues5 === void 0 ? void 0 : _formValues5.defaultValueType) === 'NORMAL') {
        var _formValues6, _formValues6$defaultV;
        // 修复组件的BUG，组件返回值会默认带上时间。比如："2021-12-23 00:00:00" 这样的格式
        // 日期类型，不要时间，所以在这里切一刀
        formValues = {
          ...formValues,
          defaultValue: (_formValues6 = formValues) === null || _formValues6 === void 0 ? void 0 : (_formValues6$defaultV = _formValues6.defaultValue) === null || _formValues6$defaultV === void 0 ? void 0 : _formValues6$defaultV.split(' ')[0]
        };
      }
    } else if (componentType === FieldComponentType.LINK_RELATION || componentType === FieldComponentType.MASTER_RELATION || componentType === FieldComponentType.MULTIPLE_RELATION) {
      // 关系字段
      delete formValues.masterBusinessObject;
    } else if (componentType === FieldComponentType.REFERENCE_FIELD) {
      var _formValues7, _formValues8, _formValues8$attribut, _formValues9;
      // 引用字段
      ((_formValues7 = formValues) === null || _formValues7 === void 0 ? void 0 : _formValues7.attributeJson) && ((_formValues8 = formValues) === null || _formValues8 === void 0 ? true : (_formValues8$attribut = _formValues8.attributeJson) === null || _formValues8$attribut === void 0 ? true : delete _formValues8$attribut.readOnlyFlag);
      formValues = {
        ...formValues,
        formula: (_formValues9 = formValues) === null || _formValues9 === void 0 ? void 0 : _formValues9.newFormula
      };
    } else if (componentType === FieldComponentType.SWITCH) {
      // 开关
      if (formValues.meaningConfig === 'selfConfig') {
        var _formValues10;
        formValues.attributeJson = {
          ...formValues.values,
          ...(((_formValues10 = formValues) === null || _formValues10 === void 0 ? void 0 : _formValues10.attributeJson) || {}),
          componentType: FieldComponentType.SWITCH,
          customOptionList: [{
            value: '0',
            orderSeq: 10,
            meaning: formValues.falseMeaning
          }, {
            value: '1',
            orderSeq: 20,
            meaning: formValues.trueMeaning
          }]
        };
        delete formValues.valueList;
        delete formValues.lovCode;
        delete formValues.lovName;
        delete formValues.lovValues;
      } else {
        var _childrenComRef$curre, _childrenComRef$curre2, _childrenComRef$curre3, _childrenComRef$curre4;
        delete formValues.attributeJson.customOptionList;

        // 开关类型-值集-维护独立值集的列表
        formValues.lovValues = (childrenComRef === null || childrenComRef === void 0 ? void 0 : (_childrenComRef$curre = childrenComRef.current) === null || _childrenComRef$curre === void 0 ? void 0 : (_childrenComRef$curre2 = _childrenComRef$curre.lovValuesDsSwitch) === null || _childrenComRef$curre2 === void 0 ? void 0 : _childrenComRef$curre2.toData()) || [];
        formValues.updateLov = childrenComRef === null || childrenComRef === void 0 ? void 0 : (_childrenComRef$curre3 = childrenComRef.current) === null || _childrenComRef$curre3 === void 0 ? void 0 : (_childrenComRef$curre4 = _childrenComRef$curre3.lovValuesDsSwitch) === null || _childrenComRef$curre4 === void 0 ? void 0 : _childrenComRef$curre4.dirty;
        const _lovValues = formValues.lovValues.map(value => ({
          ...value,
          metadata: {
            _tls: value === null || value === void 0 ? void 0 : value._tls
          }
        }));
        formValues.lovValues = _lovValues;
      }
      if (formValues.defaultValueType !== 'EXPRESSION') {
        formValues.defaultValueType = 'NORMAL';
      }
    } else if (componentType === FieldComponentType.APPENDIX) {
      var _formValues$attribute;
      // 附件
      if (!((_formValues$attribute = formValues.attributeJson) !== null && _formValues$attribute !== void 0 && _formValues$attribute.maxFileSize)) {
        var _formValues$attribute2;
        (_formValues$attribute2 = formValues.attributeJson) === null || _formValues$attribute2 === void 0 ? true : delete _formValues$attribute2.maxFileSize;
      }
      // 这个后端做了校验，必须是一个数组，或则不传
      if (!_isArray(formValues.fileTypes)) {
        delete formValues.fileTypes;
      }
      if (!_isArray(formValues.attributeJson.fileTypes)) {
        delete formValues.attributeJson.fileTypes;
      }
    } else if (componentType === FieldComponentType.RICH_TEXT) {
      var _formValues11;
      // 富文本
      if (((_formValues11 = formValues) === null || _formValues11 === void 0 ? void 0 : _formValues11.defaultValueType) === 'NORMAL' && _isArray(formValues.defaultValue)) {
        formValues.defaultValue = formValues.defaultValue && deltaToHtml(formValues.defaultValue);
      }
    } else if (componentType === FieldComponentType.FORMULA) {
      var _formValues22, _formValues23, _formValues24, _formValues25, _formValues25$attribu;
      // 公式字段
      formValues.attributeJson.resultComponentType = formValues.resultComponentType;
      if ([FieldComponentType.SINGLE_SELECT, FieldComponentType.MULTIPLE_SELECT, 'Boolean'].includes(formValues.resultType)) {
        formValues.resultType !== 'Boolean' && (formValues.attributeJson.resultType = 'String');
        if (formValues.optionSettings === '_custom') {
          var _formValues12, _formValues13, _formValues14, _formValues15;
          formValues.attributeJson.customOptionList = formValues.customOptionList.map(item => {
            var _item$_tls, _window$dvaApp, _window$dvaApp$_store, _window$dvaApp$_store2, _window$dvaApp$_store3, _window$dvaApp$_store4, _window$dvaApp$_store5, _window$dvaApp$_store6, _window$dvaApp$_store7, _window$dvaApp$_store8;
            return {
              value: item === null || item === void 0 ? void 0 : item.value,
              orderSeq: item === null || item === void 0 ? void 0 : item.orderSeq,
              meaning: (item === null || item === void 0 ? void 0 : (_item$_tls = item._tls) === null || _item$_tls === void 0 ? void 0 : _item$_tls.meaning) || ((_window$dvaApp = window.dvaApp) === null || _window$dvaApp === void 0 ? void 0 : (_window$dvaApp$_store = _window$dvaApp._store) === null || _window$dvaApp$_store === void 0 ? void 0 : (_window$dvaApp$_store2 = _window$dvaApp$_store.getState) === null || _window$dvaApp$_store2 === void 0 ? void 0 : (_window$dvaApp$_store3 = _window$dvaApp$_store2.call(_window$dvaApp$_store)) === null || _window$dvaApp$_store3 === void 0 ? void 0 : (_window$dvaApp$_store4 = _window$dvaApp$_store3.global) === null || _window$dvaApp$_store4 === void 0 ? void 0 : (_window$dvaApp$_store5 = _window$dvaApp$_store4.supportLanguage) === null || _window$dvaApp$_store5 === void 0 ? void 0 : (_window$dvaApp$_store6 = _window$dvaApp$_store5.map) === null || _window$dvaApp$_store6 === void 0 ? void 0 : (_window$dvaApp$_store7 = _window$dvaApp$_store6.call(_window$dvaApp$_store5, ({
                value
              }) => ({
                [value]: item === null || item === void 0 ? void 0 : item.meaning
              }))) === null || _window$dvaApp$_store7 === void 0 ? void 0 : (_window$dvaApp$_store8 = _window$dvaApp$_store7.reduce) === null || _window$dvaApp$_store8 === void 0 ? void 0 : _window$dvaApp$_store8.call(_window$dvaApp$_store7, (obj, lang) => ({
                ...obj,
                ...lang
              }), {}))
            };
          });
          (_formValues12 = formValues) === null || _formValues12 === void 0 ? true : delete _formValues12.lovCode;
          (_formValues13 = formValues) === null || _formValues13 === void 0 ? true : delete _formValues13.lovName;
          (_formValues14 = formValues) === null || _formValues14 === void 0 ? true : delete _formValues14.valueList;
          (_formValues15 = formValues) === null || _formValues15 === void 0 ? true : delete _formValues15.lovValues;
        } else {
          var _formValues16, _formValues16$attribu, _childrenComRef$curre5, _childrenComRef$curre6;
          (_formValues16 = formValues) === null || _formValues16 === void 0 ? true : (_formValues16$attribu = _formValues16.attributeJson) === null || _formValues16$attribu === void 0 ? true : delete _formValues16$attribu.customOptionList;
          formValues.updateLov = childrenComRef === null || childrenComRef === void 0 ? void 0 : (_childrenComRef$curre5 = childrenComRef.current) === null || _childrenComRef$curre5 === void 0 ? void 0 : (_childrenComRef$curre6 = _childrenComRef$curre5.lovValuesDs) === null || _childrenComRef$curre6 === void 0 ? void 0 : _childrenComRef$curre6.dirty;
        }
      } else {
        var _formValues17, _formValues18, _formValues19, _formValues20, _formValues21, _formValues21$attribu;
        (_formValues17 = formValues) === null || _formValues17 === void 0 ? true : delete _formValues17.lovCode;
        (_formValues18 = formValues) === null || _formValues18 === void 0 ? true : delete _formValues18.lovName;
        (_formValues19 = formValues) === null || _formValues19 === void 0 ? true : delete _formValues19.valueList;
        (_formValues20 = formValues) === null || _formValues20 === void 0 ? true : delete _formValues20.lovValues;
        (_formValues21 = formValues) === null || _formValues21 === void 0 ? true : (_formValues21$attribu = _formValues21.attributeJson) === null || _formValues21$attribu === void 0 ? true : delete _formValues21$attribu.customOptionList;
      }
      (_formValues22 = formValues) === null || _formValues22 === void 0 ? true : delete _formValues22.resultType;
      (_formValues23 = formValues) === null || _formValues23 === void 0 ? true : delete _formValues23.resultComponentType;
      (_formValues24 = formValues) === null || _formValues24 === void 0 ? true : delete _formValues24.customOptionList;
      (_formValues25 = formValues) === null || _formValues25 === void 0 ? true : (_formValues25$attribu = _formValues25.attributeJson) === null || _formValues25$attribu === void 0 ? true : delete _formValues25$attribu.optionSettings;
    }

    // 非自动编号 去除 规则编码(兼容后端)
    if (componentType !== FieldComponentType.CODE_RULE) {
      var _formValues26;
      (_formValues26 = formValues) === null || _formValues26 === void 0 ? true : delete _formValues26.ruleCode;
    }

    // 非选项类 删除 lovCode
    if (![FieldComponentType.RADIO, FieldComponentType.CHECKBOX, FieldComponentType.MULTIPLE_SELECT, FieldComponentType.SINGLE_SELECT, FieldComponentType.SWITCH, FieldComponentType.FORMULA].includes(componentType)) {
      var _formValues27, _formValues28;
      (_formValues27 = formValues) === null || _formValues27 === void 0 ? true : delete _formValues27.lovCode;
      (_formValues28 = formValues) === null || _formValues28 === void 0 ? true : delete _formValues28.lovName;
    }

    // 构建提交的参数
    if (!_isEmpty(formValues)) {
      let body = {
        ...formValues,
        componentType,
        inheritSourceType: getInheritType(formValues),
        businessObjectCode
      };

      // 对 attributeJson 就行处理 防止 参数多余 导致后端报错
      body = handleAttributeJson(body, isExtensionField);
      let query = {
        businessObjectId // TODO: 待联调 需要父组件传递进来
      };

      // api类型业务对象 自定义属性 保存
      if (isApiCustomType) {
        var _childrenComRef$curre11, _childrenComRef$curre12;
        const currentDs = `${selectComponentName}Ds`;
        const apiMaxLength = (apiModelRecord === null || apiModelRecord === void 0 ? void 0 : apiModelRecord.get('maxLength')) || 240;
        if (!viewTypeApi(apiModelRecord, apiType)) {
          var _childrenComRef$curre7, _childrenComRef$curre8, _childrenComRef$curre9, _childrenComRef$curre10;
          (_childrenComRef$curre7 = childrenComRef.current) === null || _childrenComRef$curre7 === void 0 ? void 0 : (_childrenComRef$curre8 = _childrenComRef$curre7[currentDs]) === null || _childrenComRef$curre8 === void 0 ? void 0 : (_childrenComRef$curre9 = _childrenComRef$curre8.current) === null || _childrenComRef$curre9 === void 0 ? void 0 : (_childrenComRef$curre10 = _childrenComRef$curre9.getField('maxLength')) === null || _childrenComRef$curre10 === void 0 ? void 0 : _childrenComRef$curre10.set('validator', recordValue => {
            if (recordValue > apiMaxLength || recordValue < 1 || !recordValue) {
              return `
                  ${intl.get('hmde.bo.businessObject.errorValidator3').d(`映射API参数最大长度为`)}
                  ${apiMaxLength},
                  ${intl.get('hmde.bo.businessObject.errorValidator2').d(`字段允许修改范围为`)}
                  ${1 - apiMaxLength})
                `;
            }
          });
        }
        if (await ((_childrenComRef$curre11 = childrenComRef.current) === null || _childrenComRef$curre11 === void 0 ? void 0 : (_childrenComRef$curre12 = _childrenComRef$curre11[currentDs]) === null || _childrenComRef$curre12 === void 0 ? void 0 : _childrenComRef$curre12.validate())) {
          var _body, _body$_tls;
          body.fieldName = body.businessObjectFieldName;
          body.paramName = body.businessObjectFieldCode;
          delete body.businessObjectFieldName;
          delete body.businessObjectFieldCode;

          // api自定义保存的时候 字段名称多语言需要特殊处理
          if ((_body = body) !== null && _body !== void 0 && (_body$_tls = _body._tls) !== null && _body$_tls !== void 0 && _body$_tls.businessObjectFieldName) {
            var _body2, _body2$_tls, _body3, _body3$_tls;
            body._tls.fieldName = (_body2 = body) === null || _body2 === void 0 ? void 0 : (_body2$_tls = _body2._tls) === null || _body2$_tls === void 0 ? void 0 : _body2$_tls.businessObjectFieldName;
            (_body3 = body) === null || _body3 === void 0 ? true : (_body3$_tls = _body3._tls) === null || _body3$_tls === void 0 ? true : delete _body3$_tls.businessObjectFieldName;
          }
          apiModelRecord === null || apiModelRecord === void 0 ? void 0 : apiModelRecord.set('apiCustom', body);
          handleCloseDetail();
        }
        return;
      }

      // 字段列表 弹窗形式进来 自定义保存
      if (fastCreateEnter) {
        if (getAddonBefore) {
          var _body4, _body4$businessObject;
          body.businessObjectFieldCode = (_body4 = body) === null || _body4 === void 0 ? void 0 : (_body4$businessObject = _body4.businessObjectFieldCode) === null || _body4$businessObject === void 0 ? void 0 : _body4$businessObject.substring(getAddonBefore.length);
        }
        if (body.inheritFieldId) {
          body.businessObjectFieldName = body.inheritFieldName;
          if (getAddonBefore) {
            var _body5, _body5$inheritFieldCo;
            body.businessObjectFieldCode = (_body5 = body) === null || _body5 === void 0 ? void 0 : (_body5$inheritFieldCo = _body5.inheritFieldCode) === null || _body5$inheritFieldCo === void 0 ? void 0 : _body5$inheritFieldCo.substring(getAddonBefore.length);
          }
        }
        Object.keys(body).filter(it => !['__id', '_status', '_token'].includes(it)).forEach(key => {
          fastCreateEnterRecord === null || fastCreateEnterRecord === void 0 ? void 0 : fastCreateEnterRecord.set(key, body[key]);
        });
        fastCreateEnterRecord === null || fastCreateEnterRecord === void 0 ? void 0 : fastCreateEnterRecord.setState('editType', true);
        modal === null || modal === void 0 ? void 0 : modal.close();
        return;
      }

      // 平台标准字段新增编辑
      let serviceName = businessObjectFieldId ? updateBusinessObjectField : createBusinessObjectField;
      if (isFromDomain) {
        var _dominFieldExtendsDs$;
        const fieldBehavior = (dominFieldExtendsDs === null || dominFieldExtendsDs === void 0 ? void 0 : (_dominFieldExtendsDs$ = dominFieldExtendsDs.current) === null || _dominFieldExtendsDs$ === void 0 ? void 0 : _dominFieldExtendsDs$.get('extendsWhoField')) || null;
        serviceName = isEditMode ? editDomainTemplateField : createDomainTemplateField;
        query = {};
        body = {
          ...body,
          domainId,
          category: !isExtensionField ? FieldType.STANDARD : fieldType,
          fieldBehavior: !isExtensionField ? fieldBehavior : undefined,
          templateCode,
          inheritSourceType: undefined
        };
      } else {
        if ((!isTenant || boSourceType === SourceType.TENANT) && !isEditMode && isExtensionField) {
          // 平台新增扩展字段
          serviceName = createPlateformExtensionBusinessObjectField;
          body = {
            ...body,
            extendCategory: fieldType,
            tenantId: getCurrentOrganizationId(),
            businessObjectId
          };
        }
        if ((!isTenant || boSourceType === SourceType.TENANT) && isEditMode && isExtensionField) {
          // 平台编辑扩展字段（现在都是禁用的）
          serviceName = updatePlateformExtensionBusinessObjectField;
        }
        if (isTenant && boSourceType !== SourceType.TENANT) {
          // 租户且不是来源于租户自定义对象
          // 新增、更新 都是一个接口
          serviceName = createTenantExtensionBusinessObjectField;
          if (isEditMode && !isExtensionField) {
            // 编辑平台标准字段返回的是 businessObjectFieldCode | businessObjectFieldName
            body = {
              ...body,
              inheritFieldCode: body.businessObjectFieldCode,
              inheritFieldName: body.businessObjectFieldName,
              businessObjectFieldCode: undefined,
              businessObjectFieldName: undefined
            };
          }
        }
      }

      // 保存效验-编辑的时候-如果切换字段类型-需要提示
      if (oldComponentType && componentType !== oldComponentType) {
        handleDeleteCheckApi({
          businessObjectCode,
          businessObjectFieldCode: body.businessObjectFieldCode
        }).then(res => {
          if (getResponse(res)) {
            const _ref = res || {},
              ruleName = _ref.ruleName,
              ruleCode = _ref.ruleCode;
            if (ruleName && ruleCode) {
              _Modal.confirm({
                children: `${intl.get('hmde.bo.businessObject.checkMes1').d('该字段配置了正则业务规则')}【${ruleName}（${ruleCode}）】，${intl.get('hmde.bo.businessObject.checkMes2').d('更换字段类型后将删除相关正则业务规则，请确认是否修改类型')}`,
                onOk: () => {
                  dispatchService({
                    serviceName,
                    body,
                    query,
                    type,
                    isUpdate: !!businessObjectFieldId
                  });
                }
              });
            } else {
              return dispatchService({
                serviceName,
                body,
                query,
                type,
                isUpdate: !!businessObjectFieldId
              });
            }
          }
        });
      } else {
        return dispatchService({
          serviceName,
          body,
          query,
          type,
          isUpdate: !!businessObjectFieldId
        });
      }
    }
  }
};