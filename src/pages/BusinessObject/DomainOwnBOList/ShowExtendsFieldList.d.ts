import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { modalChildrenProps } from 'choerodon-ui/pro/lib/modal/interface';
interface Props {
    modal?: modalChildrenProps;
    boFormDs: DataSet;
    extendsMappingDs: DataSet;
    fieldName?: string;
}
declare const _default: React.FunctionComponent<Props>;
export default _default;
