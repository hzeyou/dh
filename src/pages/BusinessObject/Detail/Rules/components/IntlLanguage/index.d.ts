import React from 'react';
import C7NRecord from 'choerodon-ui/pro/lib/data-set/Record';
import { modalChildrenProps } from 'choerodon-ui/pro/lib/modal/interface';
interface Props {
    record: C7NRecord;
    disabled: boolean;
    domainCode: string;
    modal?: modalChildrenProps;
}
export declare enum ErrorInfoType {
    PLATFORM = "PLATFORM",
    CUSTOM = "CUSTOM"
}
declare const _default: React.FunctionComponent<Props>;
export default _default;
