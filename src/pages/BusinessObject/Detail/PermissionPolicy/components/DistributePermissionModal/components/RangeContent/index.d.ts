import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
import C7NRecord from 'choerodon-ui/pro/lib/data-set/Record';
interface Props {
    record: C7NRecord;
    handleDistributeRange?: (ds: DataSet) => void;
}
export interface ResultRefType {
    distributePermissionDs: DataSet;
}
declare const RangeContent: React.ForwardRefExoticComponent<Props & React.RefAttributes<ResultRefType>>;
export default RangeContent;
