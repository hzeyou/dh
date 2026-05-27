import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
import C7NRecord from 'choerodon-ui/pro/lib/data-set/Record';
interface IProps {
    filterDs: DataSet;
    record: C7NRecord;
    index: number;
    deleteItem: (record: C7NRecord) => void;
    fieldData: any[];
    systemVariable: any[];
    readonly?: boolean;
    boCode?: string;
}
declare const _default: React.FunctionComponent<IProps>;
export default _default;
