import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
export interface IProps {
    valueListDs: DataSet;
    operateHeaderFlag: boolean;
    disabled?: boolean;
    defaultValueMultipleFlag?: boolean;
    operationColumnHidden?: boolean;
    readonlyFields?: string[];
    parentOptionField?: any;
}
declare const _default: React.FunctionComponent<IProps>;
export default _default;
