import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';
import { SourceType } from '@apaas/constants/businessObject';
export declare type BusinessObjectER = DomainAndBusinessObject[];
export interface DomainAndBusinessObject {
    _token: string;
    domainId: string;
    domainCode: string;
    domainName: string;
    flexFieldEnabledFlag: boolean;
    extendTableEnabledFlag: boolean;
    extendTableSuffix: string;
    businessObjectList: BusinessObject[];
}
export interface BusinessObject {
    _token: string;
    businessObjectId: string;
    businessObjectCode: string;
    businessObjectName: string;
    domainId: string;
    domainCode: string;
    publishStatus: string;
    businessObjectFields: BusinessObjectField[];
    skipResetPhysicalSyncFlag: boolean;
    extendFieldCreatedFlag: boolean;
    updatePhysicalFlag: boolean;
    sourceType: SourceType;
    businessObjectCategory: string;
    flexFieldEnabledFlag: boolean;
    extendTableEnabledFlag: boolean;
    objectVersionNumber: number;
    businessObjectAssociateList?: BusinessObjectAssociate[];
    relationBusinessObjectIds?: string[];
    extendFieldPrefixRule?: string;
    physicalModelType?: string;
}
export interface BusinessObjectField {
    businessObjectFieldId: string;
    businessObjectId: string;
    businessObjectFieldCode: string;
    businessObjectFieldName: string;
    requiredFlag: boolean;
    componentType: FieldComponentType;
    inheritSourceType: string;
    requiredFlagValue: string;
    masterBusinessObjectId?: string;
    linkRelationType?: string;
    relateType?: string;
}
export interface BusinessObjectAssociate {
    _token: string;
    businessObjectAssociateId: string;
    associateName: string;
    associateType: string;
    associateCode: string;
    linkRelationType: string;
    associateBusinessObjectId: string;
    preConditionFlag: boolean;
}
