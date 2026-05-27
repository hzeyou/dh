import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { IAsyncProgressRef } from 'hzero-front-apaas/lib/components/AsyncProgress';
import { PublicTypeList, IDomainItem } from '../../type';
interface IProps {
    setPublishPercent: Function;
    progressRef: {
        current: IAsyncProgressRef;
    };
    publicType: PublicTypeList;
    setLoading: Function;
    setPublicType: Function;
    publishFlag: boolean;
    setPublishFlag: Function;
    boTableDs?: DataSet;
    domain?: IDomainItem;
    successCallback?: Function;
}
declare const _default: React.FunctionComponent<IProps>;
export default _default;
