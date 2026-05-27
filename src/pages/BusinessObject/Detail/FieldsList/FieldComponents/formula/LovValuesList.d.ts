import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
export interface IProps {
    valueListDs: DataSet;
    operateHeaderFlag: boolean;
    disabled?: boolean;
    operationColumnHidden?: boolean;
    readonlyFields?: string[];
    resultType?: string;
}
declare const _default: React.FunctionComponent<IProps>;
export default _default;
