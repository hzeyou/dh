import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { modalChildrenProps } from 'choerodon-ui/pro/lib/modal/interface';
interface Props {
    baseInfoDS: DataSet;
    listTableDS: DataSet;
    modal?: modalChildrenProps;
    /** 是否是扩展表 */
    isExtendTable?: boolean;
}
declare const _default: React.FunctionComponent<Props>;
export default _default;
