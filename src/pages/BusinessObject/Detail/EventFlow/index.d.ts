import React from 'react';
export declare enum EventFlowCategory {
    STANDARD = "STANDARD",
    PREDEFINE = "PREDEFINE",
    CUSTOM = "CUSTOM"
}
interface IProps {
    businessObjectCode: string;
    history: any;
    match: any;
    activeKey: any;
}
declare const _default: React.FunctionComponent<IProps>;
export default _default;
