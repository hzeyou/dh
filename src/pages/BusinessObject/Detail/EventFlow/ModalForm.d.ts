import React from 'react';
interface IEventFlowModal {
    /** 弹窗内置对象 */
    modal?: any;
    /** 业务对象编码 */
    businessObjectCode: string;
    /** 租户ID */
    tenantId: string | number;
    /** 事件流ID，仅编辑态传 */
    flowId?: string;
    /** 事件流分类，仅新建态传 */
    flowCategory?: string;
    /** 回调事件，新增事件流成功直接跳转 */
    callback?: (id: any, code: any) => void;
}
declare const _default: React.FunctionComponent<IEventFlowModal>;
export default _default;
