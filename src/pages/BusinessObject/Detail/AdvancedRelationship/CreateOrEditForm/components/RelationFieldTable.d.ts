import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
interface IProps {
    type: string;
    readOnlyFlag?: boolean;
    businessObjectAssociateId?: string;
    tableDs: DataSet;
    baseInfoDS?: DataSet;
    advanceDetailDs?: DataSet;
    conditionFilterFIelds?: any[];
    paramObjDisabledFlag?: boolean;
}
declare const _default: React.FunctionComponent<IProps>;
export default _default;
