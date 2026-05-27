import React, { ReactNode, CSSProperties } from 'react';
import { ResultProps } from 'choerodon-ui/lib/result';
interface Props extends ResultProps {
    imgSrc?: string;
    title?: ReactNode;
    subTitle?: ReactNode;
    imgStyle?: CSSProperties;
    style?: CSSProperties;
    align?: 'center';
}
declare const _default: React.FC<Props>;
export default _default;
