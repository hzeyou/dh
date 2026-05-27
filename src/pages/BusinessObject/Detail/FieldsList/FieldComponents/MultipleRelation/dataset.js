import intl from 'hzero-front/lib/utils/intl';
import { isTenantRoleLevel, getCurrentOrganizationId } from 'utils/utils';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { HZERO_HPFM } from "hzero-front-apaas/lib/utils/config";
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import { PhysicalModelType } from "hzero-front-hmde/lib/constants/businessObject";
const isTenant = isTenantRoleLevel();
const tenantId = getCurrentOrganizationId();
export let FN = /*#__PURE__*/function (FN) {
  FN["masterBusinessObject"] = "masterBusinessObject";
  FN["masterBusinessObjectId"] = "masterBusinessObjectId";
  FN["masterBusinessObjectCode"] = "masterBusinessObjectCode";
  FN["masterBusinessObjectName"] = "masterBusinessObjectName";
  FN["midName"] = "middleBusinessObject.businessObjectName";
  FN["midNameLanguage"] = "middleBusinessObject_businessObjectName";
  FN["midCode"] = "middleBusinessObject.businessObjectCode";
  FN["publishStatus"] = "middleBusinessObject.publishStatus";
  FN["autoCreateFlag"] = "middleBusinessObject.autoCreateFlag";
  FN["refExtFieldFlag"] = "middleBusinessObject.refExtFieldFlag";
  FN["templateCodes"] = "middleBusinessObject.templateCodes";
  FN["physicalModelName"] = "middleBusinessObject.physicalModelName";
  FN["extendsTableName"] = "middleBusinessObject.extendsTableName";
  FN["physicalModel"] = "middleBusinessObject.physicalModel";
  FN["physicalModelId"] = "middleBusinessObject.physicalModelId";
  FN["extPhysicalModel"] = "middleBusinessObject.extPhysicalModel";
  FN["extendsTableId"] = "middleBusinessObject.extendsTableId";
  FN["checkedRelation"] = "middleBusinessObject.checkedRelation";
  FN["customPrimaryKeyCode"] = "middleBusinessObject.customPrimaryKeyCode";
  FN["sharedFlag"] = "middleBusinessObject.sharedFlag";
  FN["firstFieldName"] = "firstField.businessObjectFieldName";
  FN["firstFieldNameLanguage"] = "firstField_businessObjectFieldName";
  FN["firstFieldCode"] = "firstField.businessObjectFieldCode";
  FN["firstFieldOptionType"] = "firstField.optionType";
  FN["firstFieldLov1"] = "firstField.firstFieldLov1";
  FN["firstFieldBusinessObjectOptionName"] = "firstField.businessObjectOptionName";
  FN["firstFieldBusinessObjectOptionCode"] = "firstField.businessObjectOptionCode";
  FN["firstFieldShowField"] = "firstField.firstFieldShowField";
  FN["firstFieldOptionDisplayFieldName"] = "firstField.optionDisplayFieldName";
  FN["firstFieldOptionDisplayFieldCode"] = "firstField.optionDisplayFieldCode";
  FN["secondFieldName"] = "secondField.businessObjectFieldName";
  FN["secondFieldNameLanguage"] = "secondField_businessObjectFieldName";
  FN["secondFieldCode"] = "secondField.businessObjectFieldCode";
  FN["secondFieldOptionType"] = "secondField.optionType";
  FN["secondFieldLov1"] = "secondField.secondFieldLov1";
  FN["secondFieldBusinessObjectOptionName"] = "secondField.businessObjectOptionName";
  FN["secondFieldBusinessObjectOptionCode"] = "secondField.businessObjectOptionCode";
  FN["secondFieldShowField"] = "secondField.secondFieldShowField";
  FN["secondFieldOptionDisplayFieldName"] = "secondField.optionDisplayFieldName";
  FN["secondFieldOptionDisplayFieldCode"] = "secondField.optionDisplayFieldCode";
  FN["firstField_1_Name"] = "firstField.masterFieldName";
  FN["firstField_1_NameLanguage"] = "firstField_masterFieldName";
  FN["firstField_1_Code"] = "firstField.masterFieldCode";
  FN["firstField_1_OptionType"] = "firstField.masterOptionType";
  FN["firstField_1_Lov1"] = "firstField.firstField_1_Lov1";
  FN["firstField_1_BusinessObjectOptionName"] = "firstField.masterOptionName";
  FN["firstField_1_BusinessObjectOptionCode"] = "firstField.masterOptionCode";
  FN["firstField_1_ShowField"] = "firstField.firstField_1_ShowField";
  FN["firstField_1_OptionDisplayFieldName"] = "firstField.masterOptionDisplayFieldName";
  FN["firstField_1_OptionDisplayFieldCode"] = "firstField.masterOptionDisplayFieldCode";
  FN["firstField_1_MasterRequiredFlag"] = "firstField.masterRequiredFlag";
  FN["secondField_1_Name"] = "secondField.masterFieldName";
  FN["secondField_1_NameLanguage"] = "secondField_masterFieldName";
  FN["secondField_1_Code"] = "secondField.masterFieldCode";
  FN["secondField_1_OptionType"] = "secondField.masterOptionType";
  FN["secondField_1_Lov1"] = "secondField.secondField_1_Lov1";
  FN["secondField_1_BusinessObjectOptionName"] = "secondField.masterOptionName";
  FN["secondField_1_BusinessObjectOptionCode"] = "secondField.masterOptionCode";
  FN["secondField_1_ShowField"] = "secondField.secondField_1_ShowField";
  FN["secondField_1_OptionDisplayFieldName"] = "secondField.masterOptionDisplayFieldName";
  FN["secondField_1_OptionDisplayFieldCode"] = "secondField.masterOptionDisplayFieldCode";
  FN["secondField_1_MasterRequiredFlag"] = "secondField.masterRequiredFlag";
  return FN;
}({});
export const FormDS = ({
  baseInfoDS,
  extendFieldPrefixRule,
  isEditMode,
  domainCode
}) => {
  var _baseInfoDS$current, _baseInfoDS$current2, _baseInfoDS$current3, _baseInfoDS$current4;
  return {
    autoCreate: true,
    forceValidate: true,
    paging: false,
    transport: {
      tls: ({
        name,
        record
      }) => {
        let _token = '';
        let fieldName = '';
        if (name === 'middleBusinessObject_businessObjectName') {
          var _record$get;
          _token = record === null || record === void 0 ? void 0 : (_record$get = record.get('middleBusinessObject')) === null || _record$get === void 0 ? void 0 : _record$get._token;
          fieldName = 'businessObjectName';
        }
        if (name === 'firstField_businessObjectFieldName') {
          var _record$get2;
          _token = record === null || record === void 0 ? void 0 : (_record$get2 = record.get('firstField')) === null || _record$get2 === void 0 ? void 0 : _record$get2._token;
          fieldName = 'businessObjectFieldName';
        }
        if (name === 'firstField_masterFieldName') {
          var _record$get3;
          _token = record === null || record === void 0 ? void 0 : (_record$get3 = record.get('firstField')) === null || _record$get3 === void 0 ? void 0 : _record$get3._token;
          fieldName = 'masterFieldName';
        }
        if (name === 'secondField_businessObjectFieldName') {
          var _record$get4;
          _token = record === null || record === void 0 ? void 0 : (_record$get4 = record.get('secondField')) === null || _record$get4 === void 0 ? void 0 : _record$get4._token;
          fieldName = 'businessObjectFieldName';
        }
        if (name === 'secondField_masterFieldName') {
          var _record$get5;
          _token = record === null || record === void 0 ? void 0 : (_record$get5 = record.get('secondField')) === null || _record$get5 === void 0 ? void 0 : _record$get5._token;
          fieldName = 'masterFieldName';
        }
        if (!_token) {
          return {};
        }
        return {
          url: `${lowcodeOrganizationURL({
            route: HZERO_HPFM,
            isSite: true
          })}/multi-language`,
          params: {
            fieldName,
            _token
          }
        };
      }
    },
    fields: [{
      name: FN.masterBusinessObject,
      label: intl.get('hmde.common.relevanceMulObject').d('关联多选对象'),
      required: true,
      type: "object",
      ignore: 'always',
      textField: 'businessObjectName',
      lovCode: isTenant ? 'HMDE.BUSINESS_OBJECT' : 'HMDE.BUSINESS_OBJECT.SITE',
      lovPara: {
        masterBusinessObjectCode: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('businessObjectCode'),
        physicalModelType: [PhysicalModelType.TABLE, PhysicalModelType.SQL].join(),
        excludeBusinessObjectCodes: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : _baseInfoDS$current2.get('businessObjectCode'),
        domainEnabledFlag: true,
        includeCategory: 'STANDARD'
      }
    }, {
      name: FN.masterBusinessObjectId,
      type: "string",
      bind: `${FN.masterBusinessObject}.businessObjectId`
    }, {
      name: FN.masterBusinessObjectCode,
      type: "string",
      bind: `${FN.masterBusinessObject}.businessObjectCode`
    }, {
      name: FN.masterBusinessObjectName,
      type: "string",
      bind: `${FN.masterBusinessObject}.businessObjectName`,
      ignore: 'always'
    },
    // 中间对象信息--------------------------------------------------------------------------------------------------------------------------------------------------
    {
      type: "intl",
      label: intl.get('hmde.common.middleBusinessObjectName').d('中间对象名称'),
      name: FN.midNameLanguage,
      bind: FN.midName,
      required: true,
      maxLength: 60
    }, {
      type: "string",
      label: intl.get('hmde.bo.businessObject.middleObjectCode').d('中间对象编码'),
      name: FN.midCode,
      required: true,
      unique: true,
      format: 'uppercase',
      validator: value => {
        const pattern = /^[A-Z0-9_]*$/;
        if (!pattern.test(value)) {
          return intl.get('hmde.bo.businessObject.patternValidation').d('支持大写字母、数字及下划线组合');
        }
      },
      transformRequest: val => {
        if (val && !isEditMode) {
          return `${domainCode}${val}`;
        }
        return val;
      }
    }, {
      type: "string",
      label: intl.get('hmde.common.label.publishStatus').d('发布状态'),
      name: FN.publishStatus
    }, {
      label: intl.get('hmde.bo.businessObject.autoCreateFlag').d('关联物理模型'),
      name: FN.autoCreateFlag,
      type: "boolean",
      defaultValue: true
    }, {
      label: intl.get('hmde.bo.modeler.refExtFieldFlag').d('引用标准扩展字段'),
      name: FN.refExtFieldFlag,
      type: "boolean",
      defaultValue: true
    }, {
      label: intl.get('hmde.bo.businessObject.quoteTemp').d('引用预置模板'),
      name: FN.templateCodes,
      type: "auto",
      multiple: true,
      transformRequest: (value, record) => {
        return record !== null && record !== void 0 && record.get(FN.autoCreateFlag) ? value : undefined;
      }
    }, {
      label: intl.get('hmde.common.label.physicalModelName').d('物理模型名称'),
      help: intl.get('hmde.bo.businessObject.physicalModelName.help').d('若业务对象未关联物理模型，则物理模型名称允许编辑。业务对象发布成功后，将以该名称生成物理模型且名称不可编辑。'),
      name: FN.physicalModelName,
      bind: `${FN.physicalModel}.name`,
      type: "string",
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      format: 'lowercase',
      dynamicProps: {
        required: ({
          record
        }) => record === null || record === void 0 ? void 0 : record.get(FN.autoCreateFlag)
      },
      defaultValidationMessages: {
        patternMismatch: intl.get('hmde.bo.businessObject.patternValidationLower').d('需以字母开头，支持字母、数字及下划线组合')
      }
    }, {
      label: intl.get('hmde.bo.businessObject.extendsTableName').d('扩展物理模型名称'),
      name: FN.extendsTableName,
      bind: `${FN.extPhysicalModel}.name`,
      help: intl.get('hmde.bo.businessObject.extendsTableName.help').d('若业务对象关联物理模型，则扩展物理模型名称允许编辑和关联扩展物理模型；若业务对象未关联物理模型，则扩展物理模型名称仅允许编辑。业务对象维护扩展字段并发布成功后将以该名称生成扩展物理模型且名称不可编辑。'),
      type: "string",
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      format: 'lowercase',
      dynamicProps: {
        defaultValidationMessages: {
          patternMismatch: intl.get('hmde.bo.businessObject.patternValidationLower').d('需以字母开头，支持字母、数字及下划线组合')
        }
      }
    }, {
      label: intl.get('hmde.bo.businessObject.physicalModel').d('物理模型'),
      name: FN.physicalModel,
      type: "object",
      lovCode: isTenant ? 'HMDE.BUSINESS_OBJECT.REF_TABLE' : 'HMDE.BUSINESS_OBJECT.REF_TABLE.SITE',
      lovPara: {
        serviceCode: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current3 = baseInfoDS.current) === null || _baseInfoDS$current3 === void 0 ? void 0 : _baseInfoDS$current3.get('serviceCode'),
        tableCategoryList: 'STANDARD',
        tableTypeList: 'POSITIVE,REVERSE'
      },
      ignore: 'always',
      dynamicProps: {
        required: ({
          record
        }) => !(record !== null && record !== void 0 && record.get(FN.autoCreateFlag))
      }
    }, {
      name: FN.physicalModelId,
      type: "string",
      bind: `${FN.physicalModel}.id`
    }, {
      label: intl.get('hmde.bo.businessObject.extPhysicalModel').d('扩展物理模型'),
      name: FN.extPhysicalModel,
      type: "object",
      lovCode: isTenant ? 'HMDE.BUSINESS_OBJECT.REF_TABLE' : 'HMDE.BUSINESS_OBJECT.REF_TABLE.SITE',
      lovPara: {
        serviceCode: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current4 = baseInfoDS.current) === null || _baseInfoDS$current4 === void 0 ? void 0 : _baseInfoDS$current4.get('serviceCode'),
        tableCategoryList: 'REDUNDANT_INHERIT,REDUNDANT_X',
        tableTypeList: 'POSITIVE,REVERSE'
      },
      ignore: 'always'
    }, {
      name: FN.extendsTableId,
      type: "string",
      bind: `${FN.extPhysicalModel}.id`
    }, {
      label: intl.get('hmde.bo.businessObject.ysTempField').d('映射模板字段'),
      name: FN.checkedRelation,
      type: "auto",
      transformRequest: (value, record) => {
        return !(record !== null && record !== void 0 && record.get(FN.autoCreateFlag)) ? value : undefined;
      },
      help: intl.get('hmde.bo.businessObject.quoteTempTip').d('物理模型中存在字段与模板字段编码相同时，可选择映射模板字段')
    }, {
      label: intl.get('hmde.bo.businessObject.primaryKeyCode').d('主键编码'),
      name: FN.customPrimaryKeyCode,
      type: "string",
      pattern: /^[a-z][a-zA-Z0-9]*$/,
      defaultValidationMessages: {
        patternMismatch: intl.get('hmde.bo.businessObject.fieldCode.validation1').d('需以小写字母开头，中间支持大写字母、小写字母、数字组合，推荐使用小驼峰')
      }
    },
    // 关联当前对象的从主字段信息----------------------------------------------------------------------------------
    {
      label: intl.get('hmde.common.fieldName').d('字段名称'),
      type: "intl",
      name: FN.firstFieldNameLanguage,
      bind: FN.firstFieldName,
      required: true,
      maxLength: 30
    }, {
      label: intl.get('hmde.common.fieldCode').d('字段编码'),
      name: FN.firstFieldCode,
      type: "string",
      maxLength: 60,
      required: true,
      validator: (value, _, record) => {
        if (!(record !== null && record !== void 0 && record.get(FN.autoCreateFlag)) || isEditMode) {
          return true;
        }
        if (extendFieldPrefixRule) {
          const pattern1 = /^[A-Z][0-9a-zA-Z]{0,}$/;
          if (!pattern1.test(value)) {
            return intl.get('hmde.bo.businessObject.fieldCode.validation2').d('需以大写字母开头，中间支持大写字母、小写字母、数字组合，推荐使用小驼峰');
          }
        } else {
          const patternA = /^[a-z][a-zA-Z0-9]*$/;
          if (!patternA.test(value)) {
            return intl.get('hmde.bo.businessObject.fieldCode.validation1').d('需以小写字母开头，中间支持大写字母、小写字母、数字组合，推荐使用小驼峰');
          }
        }
      },
      transformRequest: value => {
        if (isEditMode) {
          return value;
        }
        return extendFieldPrefixRule ? extendFieldPrefixRule + value : value;
      }
    }, {
      name: FN.firstFieldOptionType,
      type: "string",
      label: intl.get('hmde.bo.businessObject.optionType').d('视图来源'),
      required: true,
      lookupCode: 'HMDE.OPTION.TYPE',
      defaultValue: 'BUSINESS_OBJECT_OPTION'
    }, {
      name: FN.firstFieldLov1,
      type: "object",
      ignore: 'always',
      computedProps: {
        textField: ({
          record
        }) => {
          if ((record === null || record === void 0 ? void 0 : record.get(FN.firstFieldOptionType)) === 'BUSINESS_OBJECT_OPTION') {
            return 'businessObjectOptionName';
          } else if ((record === null || record === void 0 ? void 0 : record.get(FN.firstFieldOptionType)) === 'LOV_VIEW') {
            return 'viewName';
          }
        },
        label: ({
          record
        }) => {
          return (record === null || record === void 0 ? void 0 : record.get(FN.firstFieldOptionType)) === 'LOV_VIEW' ? intl.get('hmde.bo.businessObject.valueSetView').d('值集视图') : intl.get('hmde.bo.businessObject.referenceList').d('引用值列表');
        },
        lovCode: ({
          record
        }) => {
          if ((record === null || record === void 0 ? void 0 : record.get(FN.firstFieldOptionType)) === 'BUSINESS_OBJECT_OPTION') {
            return isTenant ? 'HMDE.BUSINESS_OBJECT_FIELD.AVAILABLE.OPTION' : 'HMDE.BUSINESS_OBJECT_FIELD.AVAILABLE.OPTION.SITE';
          }
          return 'HMDE.LOV_VIEW';
        },
        lovPara: () => {
          var _baseInfoDS$current5;
          return {
            tenantId,
            businessObjectCode: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current5 = baseInfoDS.current) === null || _baseInfoDS$current5 === void 0 ? void 0 : _baseInfoDS$current5.get('businessObjectCode')
          };
        }
      }
    }, {
      name: FN.firstFieldBusinessObjectOptionName,
      type: "string",
      computedProps: {
        bind: ({
          record
        }) => {
          if ((record === null || record === void 0 ? void 0 : record.get(FN.firstFieldOptionType)) === 'BUSINESS_OBJECT_OPTION') {
            return `${FN.firstFieldLov1}.businessObjectOptionName`;
          }
          return `${FN.firstFieldLov1}.viewName`;
        }
      }
    }, {
      name: FN.firstFieldBusinessObjectOptionCode,
      type: "string",
      computedProps: {
        bind: ({
          record
        }) => {
          if ((record === null || record === void 0 ? void 0 : record.get(FN.firstFieldOptionType)) === 'BUSINESS_OBJECT_OPTION') {
            return `${FN.firstFieldLov1}.businessObjectOptionCode`;
          }
          return `${FN.firstFieldLov1}.viewCode`;
        }
      }
    }, {
      name: FN.firstFieldShowField,
      type: "object",
      label: intl.get('hmde.bo.businessObject.displayField').d('显示字段'),
      help: intl.get('hmde.bo.businessObject.optionDisplayField.help').d('显示字段编码需与值集视图displayfield值相同，否则可能会出现数据错误'),
      textField: 'businessObjectFieldName',
      valueField: 'businessObjectFieldCode',
      lovCode: isTenant ? 'HMDE.BUSINESS_OBJECT_FIELD' : 'HMDE.BUSINESS_OBJECT_FIELD.SITE',
      computedProps: {
        lovPara: () => {
          var _baseInfoDS$current6;
          return {
            tenantId,
            businessObjectId: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current6 = baseInfoDS.current) === null || _baseInfoDS$current6 === void 0 ? void 0 : _baseInfoDS$current6.get('businessObjectId')
          };
        },
        required: ({
          record
        }) => {
          return (record === null || record === void 0 ? void 0 : record.get(FN.firstFieldOptionType)) !== 'BUSINESS_OBJECT_OPTION';
        }
      }
    }, {
      name: FN.firstFieldOptionDisplayFieldName,
      type: 'string',
      bind: `${FN.firstFieldShowField}.businessObjectFieldName`
    }, {
      name: FN.firstFieldOptionDisplayFieldCode,
      type: 'string',
      bind: `${FN.firstFieldShowField}.businessObjectFieldCode`
    },
    // 关联业务对象【xx】的从主字段信息----------------------------------------------------------------------------------
    {
      label: intl.get('hmde.common.fieldName').d('字段名称'),
      type: "intl",
      name: FN.secondFieldNameLanguage,
      bind: FN.secondFieldName,
      required: true,
      maxLength: 30
    }, {
      label: intl.get('hmde.common.fieldCode').d('字段编码'),
      name: FN.secondFieldCode,
      type: "string",
      maxLength: 60,
      required: true,
      validator: (value, _, record) => {
        if (!(record !== null && record !== void 0 && record.get(FN.autoCreateFlag)) || isEditMode) {
          return true;
        }
        if (record !== null && record !== void 0 && record.getState('linkFieldExtendFieldPrefixRule')) {
          const pattern1 = /^[A-Z][0-9a-zA-Z]{0,}$/;
          if (!pattern1.test(value)) {
            return intl.get('hmde.bo.businessObject.fieldCode.validation2').d('需以大写字母开头，中间支持大写字母、小写字母、数字组合，推荐使用小驼峰');
          }
        } else {
          const patternA = /^[a-z][a-zA-Z0-9]*$/;
          if (!patternA.test(value)) {
            return intl.get('hmde.bo.businessObject.fieldCode.validation1').d('需以小写字母开头，中间支持大写字母、小写字母、数字组合，推荐使用小驼峰');
          }
        }
      },
      transformRequest: (value, record) => {
        if (isEditMode) {
          return value;
        }
        const mExtendFieldPrefixRule = record === null || record === void 0 ? void 0 : record.getState('linkFieldExtendFieldPrefixRule');
        return mExtendFieldPrefixRule ? mExtendFieldPrefixRule + value : value;
      }
    }, {
      name: FN.secondFieldOptionType,
      type: "string",
      label: intl.get('hmde.bo.businessObject.optionType').d('视图来源'),
      required: true,
      lookupCode: 'HMDE.OPTION.TYPE',
      defaultValue: 'BUSINESS_OBJECT_OPTION'
    }, {
      name: FN.secondFieldLov1,
      type: "object",
      ignore: 'always',
      computedProps: {
        textField: ({
          record
        }) => {
          if ((record === null || record === void 0 ? void 0 : record.get(FN.secondFieldOptionType)) === 'BUSINESS_OBJECT_OPTION') {
            return 'businessObjectOptionName';
          } else if ((record === null || record === void 0 ? void 0 : record.get(FN.secondFieldOptionType)) === 'LOV_VIEW') {
            return 'viewName';
          }
        },
        label: ({
          record
        }) => {
          return (record === null || record === void 0 ? void 0 : record.get(FN.secondFieldOptionType)) === 'LOV_VIEW' ? intl.get('hmde.bo.businessObject.valueSetView').d('值集视图') : intl.get('hmde.bo.businessObject.referenceList').d('引用值列表');
        },
        lovCode: ({
          record
        }) => {
          if ((record === null || record === void 0 ? void 0 : record.get(FN.secondFieldOptionType)) === 'BUSINESS_OBJECT_OPTION') {
            return isTenant ? 'HMDE.BUSINESS_OBJECT_FIELD.AVAILABLE.OPTION' : 'HMDE.BUSINESS_OBJECT_FIELD.AVAILABLE.OPTION.SITE';
          }
          return 'HMDE.LOV_VIEW';
        },
        lovPara: ({
          record
        }) => ({
          tenantId,
          businessObjectCode: record === null || record === void 0 ? void 0 : record.get(FN.masterBusinessObjectCode)
        })
      }
    }, {
      name: FN.secondFieldBusinessObjectOptionName,
      type: "string",
      computedProps: {
        bind: ({
          record
        }) => {
          if ((record === null || record === void 0 ? void 0 : record.get(FN.secondFieldOptionType)) === 'BUSINESS_OBJECT_OPTION') {
            return `${FN.secondFieldLov1}.businessObjectOptionName`;
          }
          return `${FN.secondFieldLov1}.viewName`;
        }
      }
    }, {
      name: FN.secondFieldBusinessObjectOptionCode,
      type: "string",
      computedProps: {
        bind: ({
          record
        }) => {
          if ((record === null || record === void 0 ? void 0 : record.get(FN.secondFieldOptionType)) === 'BUSINESS_OBJECT_OPTION') {
            return `${FN.secondFieldLov1}.businessObjectOptionCode`;
          }
          return `${FN.secondFieldLov1}.viewCode`;
        }
      }
    }, {
      name: FN.secondFieldShowField,
      type: "object",
      label: intl.get('hmde.bo.businessObject.displayField').d('显示字段'),
      help: intl.get('hmde.bo.businessObject.optionDisplayField.help').d('显示字段编码需与值集视图displayfield值相同，否则可能会出现数据错误'),
      textField: 'businessObjectFieldName',
      valueField: 'businessObjectFieldCode',
      lovCode: isTenant ? 'HMDE.BUSINESS_OBJECT_FIELD' : 'HMDE.BUSINESS_OBJECT_FIELD.SITE',
      computedProps: {
        lovPara: ({
          record
        }) => {
          return {
            tenantId,
            businessObjectId: record === null || record === void 0 ? void 0 : record.get(FN.masterBusinessObjectId)
          };
        },
        required: ({
          record
        }) => {
          return (record === null || record === void 0 ? void 0 : record.get(FN.secondFieldOptionType)) !== 'BUSINESS_OBJECT_OPTION';
        },
        disabled: ({
          record
        }) => !(record !== null && record !== void 0 && record.get(FN.masterBusinessObjectId))
      }
    }, {
      name: FN.secondFieldOptionDisplayFieldName,
      type: 'string',
      bind: `${FN.secondFieldShowField}.businessObjectFieldName`
    }, {
      name: FN.secondFieldOptionDisplayFieldCode,
      type: 'string',
      bind: `${FN.secondFieldShowField}.businessObjectFieldCode`
    },
    // 当前对象的关联多选字段信息 ------------------------------------------------
    {
      label: intl.get('hmde.common.fieldName').d('字段名称'),
      type: "intl",
      name: FN.firstField_1_NameLanguage,
      bind: FN.firstField_1_Name,
      required: true,
      maxLength: 30
    }, {
      label: intl.get('hmde.common.fieldCode').d('字段编码'),
      name: FN.firstField_1_Code,
      type: "string",
      maxLength: 60,
      required: true,
      validator: (value, _, record) => {
        if (isEditMode) {
          return true;
        }
        if (record !== null && record !== void 0 && record.getState('linkFieldExtendFieldPrefixRule')) {
          const pattern1 = /^[A-Z][0-9a-zA-Z]{0,}$/;
          if (!pattern1.test(value)) {
            return intl.get('hmde.bo.businessObject.fieldCode.validation2').d('需以大写字母开头，中间支持大写字母、小写字母、数字组合，推荐使用小驼峰');
          }
        } else {
          const patternA = /^[a-z][a-zA-Z0-9]*$/;
          if (!patternA.test(value)) {
            return intl.get('hmde.bo.businessObject.fieldCode.validation1').d('需以小写字母开头，中间支持大写字母、小写字母、数字组合，推荐使用小驼峰');
          }
        }
      },
      transformRequest: (value, record) => {
        const mExtendFieldPrefixRule = record === null || record === void 0 ? void 0 : record.getState('linkFieldExtendFieldPrefixRule');
        return mExtendFieldPrefixRule ? mExtendFieldPrefixRule + value : value;
      }
    }, {
      name: FN.firstField_1_OptionType,
      type: "string",
      label: intl.get('hmde.bo.businessObject.optionType').d('视图来源'),
      required: true,
      lookupCode: 'HMDE.OPTION.TYPE',
      defaultValue: 'BUSINESS_OBJECT_OPTION'
    }, {
      name: FN.firstField_1_Lov1,
      type: "object",
      ignore: 'always',
      computedProps: {
        textField: ({
          record
        }) => {
          if ((record === null || record === void 0 ? void 0 : record.get(FN.firstField_1_OptionType)) === 'BUSINESS_OBJECT_OPTION') {
            return 'businessObjectOptionName';
          } else if ((record === null || record === void 0 ? void 0 : record.get(FN.firstField_1_OptionType)) === 'LOV_VIEW') {
            return 'viewName';
          }
        },
        label: ({
          record
        }) => {
          return (record === null || record === void 0 ? void 0 : record.get(FN.firstField_1_OptionType)) === 'LOV_VIEW' ? intl.get('hmde.bo.businessObject.valueSetView').d('值集视图') : intl.get('hmde.bo.businessObject.referenceList').d('引用值列表');
        },
        lovCode: ({
          record
        }) => {
          if ((record === null || record === void 0 ? void 0 : record.get(FN.firstField_1_OptionType)) === 'BUSINESS_OBJECT_OPTION') {
            return isTenant ? 'HMDE.BUSINESS_OBJECT_FIELD.AVAILABLE.OPTION' : 'HMDE.BUSINESS_OBJECT_FIELD.AVAILABLE.OPTION.SITE';
          }
          return 'HMDE.LOV_VIEW';
        },
        lovPara: ({
          record
        }) => ({
          tenantId,
          businessObjectCode: record === null || record === void 0 ? void 0 : record.get(FN.masterBusinessObjectCode)
        })
      }
    }, {
      name: FN.firstField_1_BusinessObjectOptionName,
      type: "string",
      computedProps: {
        bind: ({
          record
        }) => {
          if ((record === null || record === void 0 ? void 0 : record.get(FN.firstField_1_OptionType)) === 'BUSINESS_OBJECT_OPTION') {
            return `${FN.firstField_1_Lov1}.businessObjectOptionName`;
          }
          return `${FN.firstField_1_Lov1}.viewName`;
        }
      }
    }, {
      name: FN.firstField_1_BusinessObjectOptionCode,
      type: "string",
      computedProps: {
        bind: ({
          record
        }) => {
          if ((record === null || record === void 0 ? void 0 : record.get(FN.firstField_1_OptionType)) === 'BUSINESS_OBJECT_OPTION') {
            return `${FN.firstField_1_Lov1}.businessObjectOptionCode`;
          }
          return `${FN.firstField_1_Lov1}.viewCode`;
        }
      }
    }, {
      name: FN.firstField_1_ShowField,
      type: "object",
      label: intl.get('hmde.bo.businessObject.displayField').d('显示字段'),
      help: intl.get('hmde.bo.businessObject.optionDisplayField.help').d('显示字段编码需与值集视图displayfield值相同，否则可能会出现数据错误'),
      textField: 'businessObjectFieldName',
      valueField: 'businessObjectFieldCode',
      lovCode: isTenant ? 'HMDE.BUSINESS_OBJECT_FIELD' : 'HMDE.BUSINESS_OBJECT_FIELD.SITE',
      computedProps: {
        lovPara: ({
          record
        }) => {
          return {
            tenantId,
            businessObjectId: record === null || record === void 0 ? void 0 : record.get(FN.masterBusinessObjectId)
          };
        },
        required: ({
          record
        }) => {
          return (record === null || record === void 0 ? void 0 : record.get(FN.firstField_1_OptionType)) !== 'BUSINESS_OBJECT_OPTION';
        },
        disabled: ({
          record
        }) => !(record !== null && record !== void 0 && record.get(FN.masterBusinessObjectId))
      }
    }, {
      name: FN.firstField_1_OptionDisplayFieldName,
      type: "string",
      bind: `${FN.firstField_1_ShowField}.businessObjectFieldName`
    }, {
      name: FN.firstField_1_OptionDisplayFieldCode,
      type: "string",
      bind: `${FN.firstField_1_ShowField}.businessObjectFieldCode`
    }, {
      label: intl.get('hmde.common.isRequired').d('是否必输'),
      name: FN.firstField_1_MasterRequiredFlag,
      type: "boolean",
      defaultValue: false
    },
    // 业务对象【xx】的关联多选字段信息-------------------------------------------
    {
      label: intl.get('hmde.common.fieldName').d('字段名称'),
      type: "intl",
      name: FN.secondField_1_NameLanguage,
      bind: FN.secondField_1_Name,
      required: true,
      maxLength: 30
    }, {
      label: intl.get('hmde.common.fieldCode').d('字段编码'),
      name: FN.secondField_1_Code,
      type: "string",
      maxLength: 60,
      required: true,
      validator: value => {
        if (isEditMode) {
          return true;
        }
        if (extendFieldPrefixRule) {
          const pattern1 = /^[A-Z][0-9a-zA-Z]{0,}$/;
          if (!pattern1.test(value)) {
            return intl.get('hmde.bo.businessObject.fieldCode.validation2').d('需以大写字母开头，中间支持大写字母、小写字母、数字组合，推荐使用小驼峰');
          }
        } else {
          const patternA = /^[a-z][a-zA-Z0-9]*$/;
          if (!patternA.test(value)) {
            return intl.get('hmde.bo.businessObject.fieldCode.validation1').d('需以小写字母开头，中间支持大写字母、小写字母、数字组合，推荐使用小驼峰');
          }
        }
      },
      transformRequest: value => {
        return extendFieldPrefixRule ? extendFieldPrefixRule + value : value;
      }
    }, {
      name: FN.secondField_1_OptionType,
      type: "string",
      label: intl.get('hmde.bo.businessObject.optionType').d('视图来源'),
      required: true,
      lookupCode: 'HMDE.OPTION.TYPE',
      defaultValue: 'BUSINESS_OBJECT_OPTION'
    }, {
      name: FN.secondField_1_Lov1,
      type: "object",
      ignore: 'always',
      computedProps: {
        textField: ({
          record
        }) => {
          if ((record === null || record === void 0 ? void 0 : record.get(FN.secondField_1_OptionType)) === 'BUSINESS_OBJECT_OPTION') {
            return 'businessObjectOptionName';
          } else if ((record === null || record === void 0 ? void 0 : record.get(FN.secondField_1_OptionType)) === 'LOV_VIEW') {
            return 'viewName';
          }
        },
        label: ({
          record
        }) => {
          return (record === null || record === void 0 ? void 0 : record.get(FN.secondField_1_OptionType)) === 'LOV_VIEW' ? intl.get('hmde.bo.businessObject.valueSetView').d('值集视图') : intl.get('hmde.bo.businessObject.referenceList').d('引用值列表');
        },
        lovCode: ({
          record
        }) => {
          if ((record === null || record === void 0 ? void 0 : record.get(FN.secondField_1_OptionType)) === 'BUSINESS_OBJECT_OPTION') {
            return isTenant ? 'HMDE.BUSINESS_OBJECT_FIELD.AVAILABLE.OPTION' : 'HMDE.BUSINESS_OBJECT_FIELD.AVAILABLE.OPTION.SITE';
          }
          return 'HMDE.LOV_VIEW';
        },
        lovPara: () => {
          var _baseInfoDS$current7;
          return {
            tenantId,
            businessObjectCode: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current7 = baseInfoDS.current) === null || _baseInfoDS$current7 === void 0 ? void 0 : _baseInfoDS$current7.get('businessObjectCode')
          };
        }
      }
    }, {
      name: FN.secondField_1_BusinessObjectOptionName,
      type: "string",
      computedProps: {
        bind: ({
          record
        }) => {
          if ((record === null || record === void 0 ? void 0 : record.get(FN.secondField_1_OptionType)) === 'BUSINESS_OBJECT_OPTION') {
            return `${FN.secondField_1_Lov1}.businessObjectOptionName`;
          }
          return `${FN.secondField_1_Lov1}.viewName`;
        }
      }
    }, {
      name: FN.secondField_1_BusinessObjectOptionCode,
      type: "string",
      computedProps: {
        bind: ({
          record
        }) => {
          if ((record === null || record === void 0 ? void 0 : record.get(FN.secondField_1_OptionType)) === 'BUSINESS_OBJECT_OPTION') {
            return `${FN.secondField_1_Lov1}.businessObjectOptionCode`;
          }
          return `${FN.secondField_1_Lov1}.viewCode`;
        }
      }
    }, {
      name: FN.secondField_1_ShowField,
      type: "object",
      label: intl.get('hmde.bo.businessObject.displayField').d('显示字段'),
      help: intl.get('hmde.bo.businessObject.optionDisplayField.help').d('显示字段编码需与值集视图displayfield值相同，否则可能会出现数据错误'),
      textField: 'businessObjectFieldName',
      valueField: 'businessObjectFieldCode',
      lovCode: isTenant ? 'HMDE.BUSINESS_OBJECT_FIELD' : 'HMDE.BUSINESS_OBJECT_FIELD.SITE',
      computedProps: {
        lovPara: () => {
          var _baseInfoDS$current8;
          return {
            tenantId,
            businessObjectId: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current8 = baseInfoDS.current) === null || _baseInfoDS$current8 === void 0 ? void 0 : _baseInfoDS$current8.get('businessObjectId')
          };
        },
        required: ({
          record
        }) => {
          return (record === null || record === void 0 ? void 0 : record.get(FN.secondField_1_OptionType)) !== 'BUSINESS_OBJECT_OPTION';
        }
      }
    }, {
      name: FN.secondField_1_OptionDisplayFieldName,
      type: 'string',
      bind: `${FN.secondField_1_ShowField}.businessObjectFieldName`
    }, {
      name: FN.secondField_1_OptionDisplayFieldCode,
      type: 'string',
      bind: `${FN.secondField_1_ShowField}.businessObjectFieldCode`
    }, {
      label: intl.get('hmde.common.isRequired').d('是否必输'),
      name: FN.secondField_1_MasterRequiredFlag,
      type: "boolean",
      defaultValue: false
    }].filter(Boolean)
  };
};