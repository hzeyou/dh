import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
import C7NRecord from 'choerodon-ui/pro/lib/data-set/Record';
import { modalChildrenProps } from 'choerodon-ui/pro/lib/modal/interface';
interface Props {
    record: C7NRecord;
    baseInfoDs: DataSet;
    modal?: modalChildrenProps;
    isModify?: boolean;
    disabled?: boolean;
    onSubmitSuccess?: () => void;
}
declare const _default: React.FunctionComponent<Props>;
export default _default;
