import { SourceType } from '@apaas/constants/businessObject';
export interface IObj {
    businessObjectName: string;
    businessObjectCode: string;
    autoCreateFlag: boolean;
    isRelevanceFlag: boolean;
    physicalModelName: string;
    physicalModel: object;
    extPhysicalModel: object;
    extendsTableName: string;
    id: string;
}
export declare enum FN {
    BUSINESS_OBJECT_NAME = "businessObjectName",
    BUSINESS_OBJECT_CODE = "businessObjectCode",
    AUTO_CREATE_FLAG = "autoCreateFlag",
    IS_RELEVANCE_FLAG = "isRelevanceFlag",
    PHYSICAL_MODEL_NAME = "physicalModelName",
    PHYSICAL_MODEL = "physicalModel",
    PHYSICAL_MODEL_ID = "physicalModelId",
    LOV_MULTIPLE = "LovMultiple",
    EXT_PHYSICAL_MODEL = "extPhysicalModel",
    EXTEND_STABLE_NAME = "extendsTableName",
    EXTEND_STABLE_ID = "extendsTableId"
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
}
