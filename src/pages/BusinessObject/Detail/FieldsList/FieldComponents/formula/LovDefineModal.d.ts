import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { modalChildrenProps } from 'choerodon-ui/pro/lib/modal/interface';
import { IValuesListProps } from '../type';
interface IProps {
    modal?: modalChildrenProps;
    valueList?: object[];
    businessObjectCode: string | number | undefined;
    selectDs: DataSet;
    onResponse?: ((res: any) => false | undefined) | undefined;
    valuesListProps?: IValuesListProps;
}
declare const _default: React.FunctionComponent<IProps>;
export default _default;
