import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { DataSetNode } from '@hmde/utils/validate';
interface IProps {
    baseInfoDs: DataSet;
    parentDs: DataSet;
    readOnly?: boolean;
    parentDataSetValidateNode?: DataSetNode;
}
declare const _default: React.FunctionComponent<IProps>;
export default _default;
