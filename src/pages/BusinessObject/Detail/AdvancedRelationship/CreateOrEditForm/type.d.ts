import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';
export declare enum FN {
    MASTER_BUSINESS_OBJECT_ID = "masterBusinessObjectId",
    ASSOCIATE_NAME = "associateName",
    ASSOCIATE_CODE = "associateCode",
    MASTER_BUSINESS_OBJECT_NAME = "masterBusinessObjectName",
    MASTER_BUSINESS_OBJECT_CODE = "masterBusinessObjectCode",
    MASTER_BUSINESS_OBJECT = "associateBusinessObject",
    ASSOCIATE_BUSINESS_OBJECT_ID = "associateBusinessObjectId",
    ASSOCIATE_BUSINESS_OBJECT_CODE = "associateBusinessObjectCode",
    ASSOCIATE_BUSINESS_OBJECT_NAME = "associateBusinessObjectName",
    ASSOCIATE_TYPE = "associateType",
    SELECT_RULE = "selectRule",
    RULE_CODE = "ruleCode",
    OPTION_TYPE = "optionType",
    REFERENCE_LIST = "referenceList",
    OPTION_DISPLAY_FIELD_OBJECT = "optionDisplayFieldObject",
    OPTION_DISPLAY_FIELD_CODE = "optionDisplayFieldCode",
    OPTION_DISPLAY_FIELD_NAME = "optionDisplayFieldName",
    BUSINESS_OBJECT_OPTION_CODE = "businessObjectOptionCode",
    BUSINESS_OBJECT_OPTION_NAME = "businessObjectOptionName",
    PREV_CONDITIONS = "prevConditions",
    IS_SHOW_PREV_CONDITION_FIELDS = "isShowPrevConditionFields",
    PREV_CONDITION_FIELDS = "prevConditionFields",
    COMPONENT_TYPE = "componentType",
    MASTER_BUSINESS_OBJECT_FIELD_CODE = "masterBusinessObjectFieldCode",
    MASTER_BUSINESS_OBJECT_FIELD_NAME = "masterBusinessObjectFieldName",
    ASSOCIATE_VALUE = "associateValue",
    ASSOCIATE_VALUE_MEANING = "associateValueMeaning",
    LINK_RELATION_TYPE = "linkRelationType",
    ENABLE_FLAG = "enabledFlag",
    LOGIC_FORMULA = "logicFormula"
}
export declare enum AssociateType {
    SLAVE_MASTER = "SLAVE_MASTER",
    LINK = "LINK"
}
export declare const textType: FieldComponentType[];
export declare enum ConditionType {
    CONSTANT = "CONSTANT",
    FIELD = "FIELD"
}
export declare const numberType: FieldComponentType[];
