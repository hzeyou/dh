import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
interface IOptionDetailProps {
    domainId: string;
    businessObjectId: string;
    businessObjectCode: string;
    businessObjectTenantId?: string | number;
    optionsListDs: DataSet;
    optionId?: string;
    title?: string;
    modal?: any;
    copy?: boolean;
    editFlag?: boolean;
    readOnlyFlag?: boolean;
    baseInfoDS?: DataSet;
    pageOpen?: any;
}
declare const _default: React.FunctionComponent<IOptionDetailProps>;
export default _default;
