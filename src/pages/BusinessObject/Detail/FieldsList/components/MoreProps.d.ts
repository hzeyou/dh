import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
import C7NRecord from 'choerodon-ui/pro/lib/data-set/Record';
interface Props {
    record: C7NRecord;
    baseInfoDS?: DataSet;
    type?: string;
    addAndEditFieldProps?: any;
    tenantSqlObjectDisabled?: boolean;
}
declare const _default: React.FunctionComponent<Props>;
export default _default;
