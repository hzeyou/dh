import { Graph } from '@apaas/components/AntvX6';
export interface NodeExtraProps {
    selectedNodeId: string;
    isShowNonRelationalFields: boolean;
    updateGraphCells: () => Promise<void | undefined> | undefined;
    selectedBOIds: string[];
    updateSelectedNodeId: (ids: string[]) => void;
    graph: Graph | null;
    queryPublishBoProcess: (boCode: string) => void;
}
