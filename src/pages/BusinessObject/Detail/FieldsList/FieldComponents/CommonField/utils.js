import { getMiddleBo } from "hzero-front-hmde/lib/services/businessObjectService";
import { getResponse } from 'utils/utils';
export const GroupMapping = {
  head: ['businessObjectFieldName', 'inheritFieldName', 'templateFieldName', 'templateFieldCode', 'businessObjectFieldCode', 'inheritFieldCode', 'extendFieldCode', 'businessObjectField',
  // 'helpText',
  // 'remark',
  'displayFormat', 'maxLength',
  // 'maxFileCount',
  'minValue', 'maxValue'
  // 'fixDateTime',
  ],
  ret: ['readOnlyFlag', 'requiredFlag',
  // 'exportableFlag',
  // 'multiLanguageFlag',
  'attributeJson', 'meaningConfig'
  // 'defaultDisplayFieldFlag',
  // 'storageEncryptFlag',
  ],
  unRender: ['valueList', 'lovCode', 'falseMeaning', 'trueMeaning'],
  defaultValueType: ['defaultValueType'],
  defaultValueField: ['defaultValue'],
  // 其他属性
  otherProps: ['helpText', 'remark', 'storageEncryptFlag', 'multiLanguageFlag', 'exportableFlag', 'defaultDisplayFieldFlag', 'maxFileCount', 'fileTypes', 'maxFileSize', 'fileStorageType', 'fixDateTime', 'storageCodeObj', 'storageCode', 'storageBucketName', 'storageDirectory'],
  // 帮助文本/表述 (领域继承字段需要单独处理)
  fieldBehaviorProps: ['helpText', 'remark'],
  // 关系类型多选字段
  middleProps: ['middleBusinessObject_businessObjectName', 'middleBusinessObject.businessObjectCode', 'middleBusinessObject.physicalModelName', 'middleBusinessObject.extendsTableName', 'middleBusinessObject.customPrimaryKeyCode', 'firstField_businessObjectFieldName', 'firstField.businessObjectFieldCode', 'firstField.optionType', 'middlecurLovCodeView', 'firstField.businessObjectOptionName', 'firstField.businessObjectOptionCode', 'secondField_businessObjectFieldName', 'secondField.businessObjectFieldCode', 'secondField.optionType', 'secondField.businessObjectOptionName'],
  middleBoMasterRelationProps: ['masterFieldName', 'masterFieldCode', 'multiRelMasterBoName', 'masterOptionType', 'midBoMasterRelationOptionList', 'masterOptionName', 'masterOptionCode', 'midBoMasterRelationShowField', 'masterOptionDisplayFieldName', 'masterOptionDisplayFieldCode', 'masterRequiredFlag']
};
export const linkHaveMiddleObj = (midValue, CommonFieldDs, businessObjectCode, isTenant) => {
  getMiddleBo(midValue.businessObjectId).then(res => {
    if (getResponse(res)) {
      CommonFieldDs.current.set('middleBoId', midValue.businessObjectId);
      CommonFieldDs.current.setState('disabledMidProps', true);
      const curField = res === null || res === void 0 ? void 0 : res.find(v => v.masterBusinessObjectCode === businessObjectCode);
      const linkField = res === null || res === void 0 ? void 0 : res.find(v => v.masterBusinessObjectCode !== businessObjectCode);

      // 中间对象属性设置
      CommonFieldDs.current.set('middleBusinessObject_businessObjectName', midValue.businessObjectName);
      CommonFieldDs.current.set('middleBusinessObject.businessObjectCode', midValue.businessObjectCode);
      CommonFieldDs.current.set('middleBusinessObject.physicalModelName', midValue.physicalModelName);
      if (!isTenant) {
        CommonFieldDs.current.set('middleBusinessObject.extendsTableName', midValue.extendsTableName);
      }
      CommonFieldDs.current.set('middleBusinessObject.customPrimaryKeyCode', midValue.customPrimaryKeyCode);

      // 当前字段设置
      CommonFieldDs.current.set('firstField_businessObjectFieldName', curField.businessObjectFieldName);
      CommonFieldDs.current.set('firstField.businessObjectFieldCode', curField.businessObjectFieldCode);
      CommonFieldDs.current.set('firstField.optionType', curField.optionType);
      CommonFieldDs.current.set('middlecurLovCodeView', {
        businessObjectOptionCode: curField.businessObjectOptionCode,
        businessObjectOptionName: curField.businessObjectOptionName
      });
      // 关联字段设置
      CommonFieldDs.current.set('secondField_businessObjectFieldName', linkField.businessObjectFieldName);
      CommonFieldDs.current.set('secondField.businessObjectFieldCode', linkField.businessObjectFieldCode);
      CommonFieldDs.current.set('secondField.businessObjectFieldId', linkField.businessObjectFieldId);
      CommonFieldDs.current.set('optionType', linkField.optionType);
      CommonFieldDs.current.set('businessObjectOptionId', undefined);
      CommonFieldDs.current.set('businessObjectOptionCode', linkField.businessObjectOptionCode);
      CommonFieldDs.current.set('businessObjectOptionName', linkField.businessObjectOptionName);
      if (!CommonFieldDs.current.get('masterBusinessObjectId')) {
        CommonFieldDs.current.set('masterBusinessObjectId', linkField.masterBusinessObjectId);
        CommonFieldDs.current.set('masterBusinessObjectCode', linkField.masterBusinessObjectCode);
        CommonFieldDs.current.set('refBusinessObjectName', linkField.refBusinessObjectName);
        CommonFieldDs.current.set('masterPhysicalModelType', linkField.masterPhysicalModelType);
      }
    }
  });
};