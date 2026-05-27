import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
interface Props {
    dataSet: DataSet;
    readOnly?: boolean;
    disabledData?: any;
}
declare const RangeTable: React.FC<Props>;
export default RangeTable;
