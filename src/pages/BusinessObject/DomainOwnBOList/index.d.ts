import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
interface Props extends RouteComponentProps {
    isWorkbenchEnter?: boolean;
    workbenchEnterdomainId?: string;
    workbenchEnterdomainCode?: any;
    workbenchEnterdomainName?: any;
    headRef?: any;
    /** 工作台带过来的查询参数 */
    businessObjectKeyword?: string;
    workbenchEnterdomainObj?: any;
}
declare const _default: React.ComponentClass<Pick<Props, "businessObjectKeyword" | "isWorkbenchEnter" | "workbenchEnterdomainId" | "headRef" | "workbenchEnterdomainObj" | "workbenchEnterdomainCode" | "workbenchEnterdomainName">, any> & import("react-router").WithRouterStatics<React.FunctionComponent<Props>>;
export default _default;
