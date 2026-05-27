import React, { ReactElement, Key, ReactNode } from 'react';
declare type ElementTag = keyof JSX.IntrinsicElements & keyof HTMLElementTagNameMap;
declare type ElementProps<T extends ElementTag> = Omit<React.ComponentProps<T>, 'ref' | 'children' | 'key'>;
declare type Props<T extends ElementTag> = {
    [P in keyof ElementProps<T>]?: (dom: HTMLElementTagNameMap[T]) => ElementProps<T>[P];
} & {
    key?: Key;
    children?: ReactNode;
};
declare function DomRender<T extends ElementTag = 'div'>(props: Props<T>): ReactElement<any, any> | null;
export default DomRender;
