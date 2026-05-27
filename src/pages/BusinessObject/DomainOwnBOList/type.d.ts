import { SourceType } from '@apaas/constants/businessObject';
export declare enum FN {
    BUSINESS_OBJECT_NAME = "businessObjectName",
    BUSINESS_OBJECT_CODE = "businessObjectCode",
    BO_FOCK = "boFock",
    BUSINESS_OBJECT_CATEGORY = "businessObjectCategory",
    SOURCE_TYPE = "sourceType",
    PUBLISH_STATUS = "publishStatus",
    REMARK = "remark",
    ENABLED_FLAG = "enabledFlag",
    PHYSICAL_MODEL_TYPE = "physicalModelType"
}
export interface Common {
    _token: string;
}
export interface IPublicObjectItem extends Common {
    objectVersionNumber: number;
    businessObjectId: string;
    domainId: string;
    businessObjectCode: string;
    businessObjectName: string;
    sourceType: string;
    enabledFlag: boolean;
    publishStatus: string;
    remark: string;
    businessObjectCategory: string;
    tenantName: string;
    skipResetPhysicalSyncFlag: boolean;
    extendFieldCreatedFlag: boolean;
}
export declare enum PublicTypeList {
    publicObject = "publicObject",
    publicView = "publicView"
}
export interface IDomainItem extends Object {
    domainId: string;
    domainCode: string;
    domainName: string;
    icon: string;
    serviceCode: string;
    sourceType?: SourceType;
    extendTableEnabledFlag?: boolean;
    businessObjectCode?: string;
    selectedFlag?: boolean;
    extendTableSuffix?: string;
    flexFieldEnabledFlag?: boolean;
    tenantBusinessObjectPrefixRule?: string;
    tenantBusinessObjectCreatedFlag?: boolean;
    businessObjectCreatedFlag?: boolean;
}
export declare enum MAPFN {
    TEMPLATE_NAME = "templateName",
    TEMPLATE_CODE = "templateCode",
    TEMPLATE_FIELD_NAME = "templateFieldName",
    TEMPLATE_FIELD_CODE = "templateFieldCode",
    COMPONENT_TYPE_MEADING = "componentTypeMeaning",
    FIELD_BEHAVIORR_MEANING = "fieldBehaviorMeaning",
    TYPE_C = "typeC"
}
