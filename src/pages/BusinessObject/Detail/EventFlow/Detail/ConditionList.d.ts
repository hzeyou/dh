import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
interface IIndex {
    nodeData: any;
    dataSet: DataSet;
    handleChange: (key: string, val: any) => void;
    openConditionModal: (enabledDrillFlag: boolean) => void;
}
declare const _default: React.FunctionComponent<IIndex>;
export default _default;
