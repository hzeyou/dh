import { Graph } from '@apaas/components/AntvX6';
/**
 * 注册 ER 图节点
 */
export declare function registerReactERNode(): void;
/**
 * 执行 ER 布局算法
 * @constructor
 */
export declare function executeERLayout(graph: Graph): Promise<void>;
export interface ErRouterOptions {
    min?: number;
    offset?: number | 'center';
    direction?: 'T' | 'B' | 'L' | 'R' | 'H' | 'V';
}
/**
 * 注册 ER 路由
 */
export declare function registerERRouter(): () => import("@antv/x6/lib/registry").Router.CommonDefinition | null;
