import React from 'react';
import { IAsyncProgressRef } from 'hzero-front-apaas/lib/components/AsyncProgress';
interface Props {
    businessObjectCode: string;
    setLoading: (flag: boolean) => void;
    setPublishPercent: (percent: number) => void;
}
export interface ResultRefType {
    progressRef: React.MutableRefObject<IAsyncProgressRef>;
}
declare const BOAsyncPublish: React.ForwardRefExoticComponent<Props & React.RefAttributes<ResultRefType>>;
export default BOAsyncPublish;
