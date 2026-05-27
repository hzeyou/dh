import { BusinessObject, BusinessObjectER } from '../types/bo';
import { NodeExtraProps } from '../types/node';
/**
 * 格式化业务对象数据为ER 图数据
 */
export declare function formatBoDataToReactERGraph(boData: BusinessObjectER, extraNodeData: NodeExtraProps): any[];
export declare function getLinkRelation(type: string): "" | "1:N" | "1:1";
export declare function getNodeHeight(data: BusinessObject, isShowNonRelationalFields: any): number;
/**
 * 可选的领域
 */
export declare function getDomainOptional(data: BusinessObjectER): {
    domainId: string;
    domainName: string;
    domainCode: string;
}[];
/**
 * 计算连接桩 y 轴方向偏移值
 * @param index
 */
export declare function getPortRefY(index: number): number;
/**
 * 把数据中以 id 或 Id 为结尾的数据，值为数字的转换为字符串（针对主键加密场景临时处理）
 * @param data
 * @param keys
 */
export declare function transformIdFields(data: any, keys?: string[]): any;
