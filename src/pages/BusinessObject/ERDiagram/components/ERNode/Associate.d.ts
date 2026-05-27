import React from 'react';
import { NodeExtraProps } from '../../types/node';
import { BusinessObject, BusinessObjectAssociate } from '../../types/bo';
interface Props {
    associate: BusinessObjectAssociate;
    fieldType: any;
    data?: BusinessObject & NodeExtraProps;
}
declare const _default: React.FunctionComponent<Props>;
export default _default;
