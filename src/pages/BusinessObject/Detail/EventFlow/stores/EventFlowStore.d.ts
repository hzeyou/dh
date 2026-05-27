import React, { ReactNode } from 'react';
declare const Store: React.Context<any>;
export default Store;
interface IStoreProps {
    match: any;
    location: any;
    children: ReactNode;
}
declare const StoreProvider: (props: IStoreProps) => React.JSX.Element;
export { StoreProvider };
