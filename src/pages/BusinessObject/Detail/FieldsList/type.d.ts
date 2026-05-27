import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';
import { FieldType } from '@apaas/constants/businessObject';
export interface IDataSource {
    businessObjectFieldName: string;
    businessObjectFieldCode?: string;
    extendFieldCode?: string;
    componentType: FieldComponentType;
    enabledFlag: boolean;
    masterBusinessObject?: object;
    masterBusinessObjectId?: string;
    masterBusinessObjectCode?: string;
    refBusinessObjectName?: string;
    requiredFlag: boolean;
    remark: string;
    sourceType: keyof typeof FieldType;
    attributeJson: object;
}
export interface IArgs {
    defaultValueType?: string;
    defaultDisplayFieldFlag?: boolean;
    exportableFlag?: boolean;
    attributeJson?: object;
    extendFieldCode?: string;
    extendFieldId?: string;
    businessObjectFieldCode?: string;
    businessObjectFieldName?: string;
    businessObjectId?: string;
    businessObjectCode?: string;
    sourceType?: string;
    extendCategory?: string;
    componentType: string;
    inheritSourceType?: string;
    fieldType?: string;
    digitalAccuracy?: number;
}
