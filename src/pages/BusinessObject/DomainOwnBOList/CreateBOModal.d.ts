import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { modalChildrenProps } from 'choerodon-ui/pro/lib/modal/interface';
import { IDomainItem } from './type';
interface ICreateBOModal {
    modal?: modalChildrenProps;
    dataSet?: DataSet;
    domain?: IDomainItem;
    domainId?: string;
    serviceCode?: string;
    domainCode?: string;
    extendTableEnabledFlag?: boolean;
    extendTableSuffix?: string;
    isWorkbenchEnter?: boolean;
    createSuccessCallback?: Function;
    tenantBusinessObjectPrefixRule?: string;
}
declare const _default: React.FunctionComponent<ICreateBOModal>;
export default _default;
