import React from 'react';
import { ButtonProps } from 'choerodon-ui/pro/lib/button/Button';
interface NormalProps {
    componentType?: 'button' | 'a';
}
declare type Props = NormalProps & (React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> | ButtonProps);
declare const _default: React.FunctionComponent<Props>;
export default _default;
