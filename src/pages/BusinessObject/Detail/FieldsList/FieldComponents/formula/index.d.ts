import React from 'react';
interface IProps {
    childrenComRef: any;
    disabled?: boolean;
    businessObjectCode?: string | number;
    businessObjectName?: string;
    isExtensionField?: boolean;
    isFromDomain?: boolean;
    isEditMode: boolean;
    customPrimaryKeyCode?: string;
    businessObjectId?: string;
    boSourceType?: string;
    extendFieldPrefixRule?: string;
    detailData?: any;
    physicalModelType?: string;
    businessObjectFieldId?: string;
    inheritId?: string;
    inheritFieldId?: string;
}
declare const _default: React.FunctionComponent<IProps>;
export default _default;
