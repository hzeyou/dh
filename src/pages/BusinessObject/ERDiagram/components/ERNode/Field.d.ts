import React from 'react';
import { BusinessObject, BusinessObjectField } from '../../types/bo';
import { NodeExtraProps } from '../../types/node';
interface Props {
    businessObjectField: BusinessObjectField;
    fieldType: any;
    data?: BusinessObject & NodeExtraProps;
}
declare const _default: React.FunctionComponent<Props>;
export default _default;
