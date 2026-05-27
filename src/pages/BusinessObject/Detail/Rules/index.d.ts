import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
interface IProps {
    ruleDS: DataSet;
    businessObjectName?: string;
    domainId?: string;
    businessRuleRef?: any;
    readOnlyFlag?: boolean;
    showVersion?: string;
    [x: string]: any;
}
declare const _default: React.FunctionComponent<IProps>;
export default _default;
