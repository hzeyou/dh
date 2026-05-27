export interface Column {
    objectVersionNumber: number;
    _token: string;
    id: string;
    metaTableId: string;
    name: string;
    code: string;
    type: string;
    jdbcType: number;
    dataSize: number;
    decimalDigits: number;
    description: string;
    requiredFlag: number;
    primaryFlag: number;
    tenantId: string;
}
export interface IErrorInfo {
    propertyType: string;
    errorLevel: string;
    level?: string;
    errorCode: string;
    message: string;
    physicsValue: string;
    businessValue: string;
    businessObjectId: string;
    column: Column;
    businessObjectFieldId: string;
    businessObjectFieldName: string;
    physicalModelType: string;
    fieldType: string;
    physicsModelName: string;
    functionType: string;
    functionName: string;
}
