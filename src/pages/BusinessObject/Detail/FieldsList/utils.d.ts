import { DataSet } from 'choerodon-ui/pro';
import C7NRecord from 'choerodon-ui/pro/lib/data-set/Record';
import { FieldType } from '@apaas/constants/businessObject';
import { IArgs } from './type';
export declare const getInheritType: (fieldObj: any) => FieldType.STANDARD | FieldType.TENANT_CREATED | FieldType.EXTEND;
/**
 * 处理业务对象字段 得到需要的参数列表
 * @return Array<field>
 */
declare type IHandleDealFields = (args: IArgs[], args2?: {
    isFromDomain: boolean;
    domainId: string;
    category: string;
    isExtensionField: boolean;
}) => object;
export declare const handleDealFields: IHandleDealFields;
/**
 * 自定义校验长度和必输
 * @param res 校验自带信息
 * @param fieldName 当前字段中文名称
 * @returns string
 */
export declare const validationRenderer: (res: any, fieldName: any) => string | undefined;
export declare const handleCheckError: ({ records, type, isSql, }: {
    records?: DataSet | C7NRecord[] | undefined;
    type?: string | undefined;
    isSql?: boolean | undefined;
}) => boolean;
export declare const componentTypeFilter: (option: any, record: any, physicalModelType: any, baseInfoDS?: any) => boolean;
export declare const handleReferenceField: (ds: any, getAddonBefore: any) => void;
export {};
