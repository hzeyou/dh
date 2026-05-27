import React from 'react';
import { IChildren } from '@hmde/businessComponents/IconPicker/enums';
interface IProps {
    childrenComRef: any;
    disabled?: boolean;
    selectedExampleInfo?: IChildren;
    isEditMode?: boolean;
    isExtensionField?: boolean;
    isFromDomain?: boolean;
    businessObjectCode?: string;
    businessObjectId?: string;
    customPrimaryKeyCode?: string;
    boSourceType?: string;
    language: string;
    componentType: string;
    domainEnabledFlag?: boolean;
    extendFieldCreatedFlag?: boolean;
    extendFieldPrefixRule?: string;
    isApiCustomType?: boolean;
    detailData?: any;
    inheritFieldId?: string;
    businessObjectFieldId?: string;
    inheritId?: string;
    dimensionFlag?: boolean;
}
declare function Index(props: IProps): React.JSX.Element;
declare const _default: typeof Index;
export default _default;
