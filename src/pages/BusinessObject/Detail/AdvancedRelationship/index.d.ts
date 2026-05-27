import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
interface IIndex {
    businessObjectCode: string;
    businessObjectId: string;
    businessObjectName: string;
    advancedListDs: DataSet;
    baseInfoDS: DataSet;
    sourceType: string;
    advancedRef?: any;
    readOnlyFlag?: boolean;
    showVersion?: string;
}
declare const _default: React.FunctionComponent<IIndex>;
export default _default;
