import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
interface IProps {
    currentNodeData: any;
    treeSearch: string;
    dataSet: DataSet;
    errorMessage?: string;
    getFieldPath: (arg: any) => string | undefined;
}
declare const _default: React.FunctionComponent<IProps>;
export default _default;
