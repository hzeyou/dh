import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';
export let FN = /*#__PURE__*/function (FN) {
  FN["MASTER_BUSINESS_OBJECT_ID"] = "masterBusinessObjectId";
  FN["ASSOCIATE_NAME"] = "associateName";
  FN["ASSOCIATE_CODE"] = "associateCode";
  FN["MASTER_BUSINESS_OBJECT_NAME"] = "masterBusinessObjectName";
  FN["MASTER_BUSINESS_OBJECT_CODE"] = "masterBusinessObjectCode";
  FN["MASTER_BUSINESS_OBJECT"] = "associateBusinessObject";
  FN["ASSOCIATE_BUSINESS_OBJECT_ID"] = "associateBusinessObjectId";
  FN["ASSOCIATE_BUSINESS_OBJECT_CODE"] = "associateBusinessObjectCode";
  FN["ASSOCIATE_BUSINESS_OBJECT_NAME"] = "associateBusinessObjectName";
  FN["ASSOCIATE_TYPE"] = "associateType";
  FN["SELECT_RULE"] = "selectRule";
  FN["RULE_CODE"] = "ruleCode";
  FN["OPTION_TYPE"] = "optionType";
  FN["REFERENCE_LIST"] = "referenceList";
  FN["OPTION_DISPLAY_FIELD_OBJECT"] = "optionDisplayFieldObject";
  FN["OPTION_DISPLAY_FIELD_CODE"] = "optionDisplayFieldCode";
  FN["OPTION_DISPLAY_FIELD_NAME"] = "optionDisplayFieldName";
  FN["BUSINESS_OBJECT_OPTION_CODE"] = "businessObjectOptionCode";
  FN["BUSINESS_OBJECT_OPTION_NAME"] = "businessObjectOptionName";
  FN["PREV_CONDITIONS"] = "prevConditions";
  FN["IS_SHOW_PREV_CONDITION_FIELDS"] = "isShowPrevConditionFields";
  FN["PREV_CONDITION_FIELDS"] = "prevConditionFields";
  FN["COMPONENT_TYPE"] = "componentType";
  FN["MASTER_BUSINESS_OBJECT_FIELD_CODE"] = "masterBusinessObjectFieldCode";
  FN["MASTER_BUSINESS_OBJECT_FIELD_NAME"] = "masterBusinessObjectFieldName";
  FN["ASSOCIATE_VALUE"] = "associateValue";
  FN["ASSOCIATE_VALUE_MEANING"] = "associateValueMeaning";
  FN["LINK_RELATION_TYPE"] = "linkRelationType";
  FN["ENABLE_FLAG"] = "enabledFlag";
  FN["LOGIC_FORMULA"] = "logicFormula";
  return FN;
}({});

// 关系类型
export let AssociateType = /*#__PURE__*/function (AssociateType) {
  AssociateType["SLAVE_MASTER"] = "SLAVE_MASTER";
  AssociateType["LINK"] = "LINK";
  return AssociateType;
}({}); // 关联
export const textType = [FieldComponentType.TEXT_FIELD, FieldComponentType.SINGLE_SELECT, FieldComponentType.MULTIPLE_SELECT, FieldComponentType.RADIO, FieldComponentType.CHECKBOX, FieldComponentType.EMAIL, FieldComponentType.PHONE_NUMBER, FieldComponentType.CODE_RULE];

// 条件类型标识
export let ConditionType = /*#__PURE__*/function (ConditionType) {
  ConditionType["CONSTANT"] = "CONSTANT";
  ConditionType["FIELD"] = "FIELD";
  return ConditionType;
}({}); // 关系字段
export const numberType = [FieldComponentType.NUMBER_FIELD, FieldComponentType.SWITCH, FieldComponentType.LINK_RELATION, FieldComponentType.MASTER_RELATION];