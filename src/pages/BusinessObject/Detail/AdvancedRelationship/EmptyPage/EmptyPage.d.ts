import { FC } from 'react';
interface IStyle {
    imgWrapperWidth: number;
    imgWrapperMargin: string;
    marginLeft: number;
    helpFontSize?: string;
    helpColor?: string;
    messageFontSize: string;
    messageMarginTop?: number;
    color?: string;
}
interface IIndex {
    help?: string;
    message: any;
    styles?: IStyle;
}
declare const Index: FC<IIndex>;
export default Index;
