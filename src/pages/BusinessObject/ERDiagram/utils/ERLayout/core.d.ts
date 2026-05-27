import { INode, IEdge } from './type';
export default function layout(data: {
    nodes: INode[];
    edges: IEdge[];
}, options: any): Promise<{
    nodes: INode[];
}>;
