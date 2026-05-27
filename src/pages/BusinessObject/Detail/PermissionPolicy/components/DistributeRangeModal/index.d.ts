import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { modalChildrenProps } from 'choerodon-ui/pro/lib/modal/interface';
import C7NRecord from 'choerodon-ui/pro/lib/data-set/Record';
interface Props {
    modal?: modalChildrenProps;
    record: C7NRecord;
    distributeDs: DataSet;
    distributePermissionDs: DataSet;
    usedPermissionDs: DataSet;
    baseInfoDs: DataSet;
}
declare const _default: React.FunctionComponent<Props>;
export default _default;
