/**
 * ⚠️ 该模块被 apaas plugin 导出
 */
import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
interface Props {
    dataSet: DataSet;
    baseInfoDs: DataSet;
    readOnly?: boolean;
    customRangeContainerClassName?: string;
    pageEnter?: boolean;
    businessObjectCode?: string;
    sqlQueryFieldsDs?: DataSet;
    otherDrillParams?: object;
}
declare const _default: React.FunctionComponent<Props>;
export default _default;
