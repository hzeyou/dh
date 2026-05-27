import React from 'react';
import { IErrorInfo } from './type';
interface IProps {
    modal?: any;
    dataSource: IErrorInfo[];
    publicObjectSave?: Function;
    cb?: Function;
    _extendList?: string[];
}
declare const _default: React.FunctionComponent<IProps>;
export default _default;
