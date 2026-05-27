import React from 'react';
interface Props {
    value: string;
    isHover: boolean;
    handleHover: () => void;
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}
declare const _default: React.FunctionComponent<Props>;
export default _default;
