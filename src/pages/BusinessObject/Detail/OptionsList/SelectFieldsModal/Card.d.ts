import React, { ReactNode, ReactElement } from 'react';
interface ICardProps {
    title: string | Element | JSX.Element;
    icon?: string | ReactElement;
    description?: ReactNode;
    style?: React.CSSProperties;
    children: ReactNode;
    _ref?: any;
}
declare const _default: React.MemoExoticComponent<({ icon, title, description, style, children, _ref }: ICardProps) => React.JSX.Element>;
export default _default;
