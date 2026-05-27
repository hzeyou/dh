import { INode } from './type';
export default function layout(data: {
    nodes: INode[];
}, options: any): {
    nodes: INode[];
} | undefined;
