import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
interface Props {
    sqlQueryParamsDs: DataSet;
    sql: string;
    serviceCode: string;
    sqlRunParamsDsRef: React.MutableRefObject<DataSet | null>;
}
declare const _default: React.FunctionComponent<Props>;
export default _default;
