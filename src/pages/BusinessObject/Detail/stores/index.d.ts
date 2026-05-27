import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { TAB_KEYS } from '@hmde/routes/BusinessObject/Detail/TabItemList';
interface LocalStoreState {
    hasPermission: boolean;
    objVersionKey: string;
    baseInfoDS: DataSet | null;
    boDetailTabActiveKey: TAB_KEYS;
    beforePublicOperate?: {
        isSaveChanged: boolean;
        handleSave: () => Promise<boolean | undefined>;
        handleUpdate: () => void;
    };
}
export interface BOStore {
    state: LocalStoreState;
    setState: (<T extends keyof LocalStoreState>(key: T, value: LocalStoreState[T]) => void) & (<T extends keyof LocalStoreState>(key: {
        [k in T]: LocalStoreState[T];
    }) => void);
    getState: <T extends keyof LocalStoreState>(key: T, isToJs?: boolean) => LocalStoreState[T];
}
declare function StoreProvider(props: any): React.JSX.Element;
declare const useBoStore: () => BOStore | undefined;
export { StoreProvider, useBoStore };
