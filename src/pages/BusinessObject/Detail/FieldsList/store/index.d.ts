import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { PublishStatus } from '@apaas/constants/businessObject';
import { IBaseInfoData } from './type';
interface LocalStoreState {
    name: string;
    baseInfoDS: DataSet;
    baseInfoData: IBaseInfoData;
    businessObjectId: string;
    businessObjectCode: string;
    businessObjectName: string;
    readOnlyFlag: boolean;
    predefineDisabled: boolean;
    tenantCustomObject: boolean;
    middleBusinessObjFlag: boolean;
    domainEnabledFlag: boolean;
    publishStatus: keyof typeof PublishStatus | undefined;
    published: boolean;
    isFromDomain: boolean;
    showVersion: string | undefined;
}
export interface ScriptEventStore {
    state: LocalStoreState;
    setState: (<T extends keyof LocalStoreState>(key: T, value: LocalStoreState[T]) => void) & (<T extends keyof LocalStoreState>(key: {
        [k in T]: LocalStoreState[T];
    }) => void);
    getState: <T extends keyof LocalStoreState>(key: T, isToJs?: boolean) => LocalStoreState[T];
}
declare function StoreProvider(props: any): React.JSX.Element;
declare const useStore: () => ScriptEventStore;
export { StoreProvider, useStore };
