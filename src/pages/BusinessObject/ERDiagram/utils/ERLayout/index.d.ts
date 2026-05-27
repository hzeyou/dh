import { Base } from '@antv/layout/lib/layout/base';
export interface ERLayoutOptions {
    type: 'er';
    width?: number;
    height?: number;
    nodeMinGap?: number;
}
export default class ERLayout extends Base {
    width: number;
    height: number;
    nodeMinGap: number;
    constructor(options?: any);
    /** 迭代结束的回调函数 */
    onLayoutEnd: () => void;
    getDefaultCfg(): {
        width: number;
        height: number;
        nodeMinGap: number;
    };
    /**
     * 执行布局
     */
    execute(): Promise<void | {
        nodes: import("./type").INode[];
    }>;
    getType(): string;
}
