import React from 'react';
import { IFlowVariableParams } from '@hmde/routes/ProcessDefinition/Designer/NewFlowContext/type';
interface IProps {
    data: any[];
    fieldData: any[];
    logicFormula: string;
    filterCacheRef: any;
    disabled?: boolean;
    boCode?: string;
    newFlowVariableParams?: IFlowVariableParams;
}
declare const _default: React.FunctionComponent<IProps>;
export default _default;
