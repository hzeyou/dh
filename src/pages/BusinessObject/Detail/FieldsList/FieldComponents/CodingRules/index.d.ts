import React from 'react';
import { IChildren } from '@hmde/businessComponents/IconPicker/enums';
interface IProps {
    childrenComRef: any;
    disabled?: boolean;
    selectedExampleInfo?: IChildren;
    isEditMode?: boolean;
    isExtensionField?: boolean;
    businessObjectCode: string;
    businessObjectId?: string;
    customPrimaryKeyCode?: string;
    isEditCurField?: boolean;
    boSourceType?: string;
    domainEnabledFlag?: boolean;
    extendFieldCreatedFlag?: boolean;
    extendFieldPrefixRule?: string;
    isApiCustomType?: boolean;
    fastCreateEnter?: boolean;
    detailData?: any;
    inheritFieldId?: string;
    businessObjectFieldId?: string;
    inheritId?: string;
    physicalModelType?: string;
}
declare const _default: React.FunctionComponent<IProps>;
export default _default;
