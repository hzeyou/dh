import React from 'react';
import { Graph } from '@apaas/components/AntvX6';
import { DataSet } from 'choerodon-ui/pro';
import { IDomainItem } from '@hmde/routes/BusinessObject/DomainOwnBOList/type';
import { BusinessObjectER } from '../types/bo';
interface LocalStoreState {
    graph: Graph | null;
    isGraphLoading: boolean;
    selectedBOIds: string[];
    isShowMiniMap: boolean;
    isShowLegend: boolean;
    selectedNodeId: string;
    graphERData: BusinessObjectER;
    domain: IDomainItem | null;
    businessObjectCreatedFlag: boolean;
    updateGraphCells?: () => Promise<void | undefined> | undefined;
    boDs?: DataSet;
}
export interface ContextStore {
    state: LocalStoreState;
    setState: (<T extends keyof LocalStoreState>(key: T, value: LocalStoreState[T]) => void) & (<T extends keyof LocalStoreState>(key: {
        [k in T]: LocalStoreState[T];
    }) => void);
    getState: <T extends keyof LocalStoreState>(key: T, isToJs?: boolean) => LocalStoreState[T];
    resetState: () => void;
}
declare function StoreProvider(props: any): React.JSX.Element;
declare const useERStore: () => ContextStore;
export { StoreProvider, useERStore };
