import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { modalChildrenProps } from 'choerodon-ui/pro/lib/modal/interface';
import { ICustomOptionList, IValuesListProps } from '../type';
interface IProps {
    modal?: modalChildrenProps;
    valueList: ICustomOptionList[];
    businessObjectCode?: string;
    businessObjectId?: string;
    parentOptionField?: string;
    selectDs: DataSet;
    onResponse?: (res: any) => false | undefined;
    valuesListProps?: IValuesListProps;
    handleDefaultValueFocus?: Function;
    businessObjectFieldId?: string;
    isFromDomain?: boolean;
}
declare const _default: React.FunctionComponent<IProps>;
export default _default;
