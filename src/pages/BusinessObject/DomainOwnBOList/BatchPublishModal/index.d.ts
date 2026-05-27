import React from 'react';
import { modalChildrenProps } from 'choerodon-ui/pro/lib/modal/interface';
import { IDomainItem } from '../type';
interface IProps {
    publicType: string;
    domain?: IDomainItem;
    onRef?: any;
    modal?: modalChildrenProps;
    handleCascadePublish?: any;
}
declare const _default: React.FunctionComponent<IProps>;
export default _default;
