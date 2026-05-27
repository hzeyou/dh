import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
export interface IFieldProps {
    businessObjectFieldCode: string;
    businessObjectFieldName: string;
    displayName: string;
    componentType: string;
    tableFieldWidth: number;
    queryFieldFlag: boolean;
    orderSeq: number;
    queryOrderSeq: number;
    uuid: string;
    baseInfoDS: DataSet;
}
declare const _default: React.FunctionComponent<{
    inquireDs: any;
    modal: any;
    optionFieldDs: any;
    businessObjectCode: any;
    baseInfoDS: any;
}>;
export default _default;
