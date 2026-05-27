import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
interface IProps {
    activeKey: string;
    tableDs: DataSet;
    cb?: Function;
    publicObjectSave?: Function;
    modal?: any;
    _extendList?: string[];
}
declare const _default: React.FunctionComponent<IProps>;
export default _default;
