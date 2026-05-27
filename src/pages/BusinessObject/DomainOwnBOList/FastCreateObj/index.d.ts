import React from 'react';
import { modalChildrenProps } from 'choerodon-ui/pro/lib/modal/interface';
import { IDomainItem } from './type';
interface Props {
    domain: IDomainItem;
    modal?: modalChildrenProps;
    tableQuery: () => void;
    tenantBusinessObjectPrefixRule?: string;
}
declare const _default: React.FunctionComponent<Props>;
export default _default;
export * from './type';
