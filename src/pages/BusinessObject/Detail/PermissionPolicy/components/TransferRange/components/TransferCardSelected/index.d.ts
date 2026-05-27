import React, { MutableRefObject } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import C7NRecord from 'choerodon-ui/pro/lib/data-set/Record';
interface Props {
    dataSet: DataSet;
    isOptional?: boolean;
    totalRecord: MutableRefObject<C7NRecord[]>;
}
declare const _default: React.FunctionComponent<Props>;
export default _default;
