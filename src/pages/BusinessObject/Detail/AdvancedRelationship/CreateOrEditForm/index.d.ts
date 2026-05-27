import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { modalChildrenProps } from 'choerodon-ui/pro/lib/modal/interface';
interface IProps {
    type: 'create' | 'edit';
    businessObjectId: string;
    businessObjectName: string;
    businessObjectCode: string;
    advancedListDs: DataSet;
    businessObjectAssociateId?: string;
    baseInfoDS?: DataSet;
    readOnlyFlag?: boolean;
    showVersion?: string;
    modal?: modalChildrenProps;
    okCallback?: () => void;
}
declare const _default: React.FunctionComponent<IProps>;
export default _default;
