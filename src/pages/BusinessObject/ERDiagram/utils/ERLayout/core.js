/* eslint-disable no-param-reassign */
import { DagreLayout } from '@antv/layout';
import * as d3Force from 'd3-force';
import forceGrid from "./forceGrid";
import mysqlWorkbench from "./mysqlWorkbench";
export default function layout(data, options) {
  const nodes = data.nodes,
    edges = data.edges;
  const width = options.width,
    height = options.height;
  if (!(nodes !== null && nodes !== void 0 && nodes.length)) return Promise.resolve({
    nodes: []
  });

  // 筛选非叶子节点，做Dagre布局
  const noLeafNodes = [];
  nodes.forEach(node => {
    const relateEdges = edges.filter(edge => {
      return edge.source === node.id || edge.target === node.id;
    });
    if (relateEdges.length > 1) {
      const temp = {
        ...node
      };
      delete temp.size;
      noLeafNodes.push(temp);
    }
  });
  const noLeafEdge = [];
  edges.forEach(edge => {
    const sourceNode = noLeafNodes.find(node => node.id === edge.source);
    const targetNode = noLeafNodes.find(node => node.id === edge.target);
    if (sourceNode && targetNode) {
      noLeafEdge.push(edge);
    }
  });
  const dagreLayout = new DagreLayout({
    type: 'dagre',
    ranksep: options.nodeMinGap,
    nodesep: options.nodeMinGap
  });
  const _dagreLayout$layout = dagreLayout.layout({
      nodes: noLeafNodes,
      edges: noLeafEdge
    }),
    nodesTmp = _dagreLayout$layout.nodes;

  // 布局后，坐标同步
  nodes.forEach(n => {
    const found = (nodesTmp || []).find(temp => temp.id === n.id);
    // eslint-disable-next-line no-param-reassign
    n.x = (found === null || found === void 0 ? void 0 : found.x) || width / 2;
    n.y = (found === null || found === void 0 ? void 0 : found.y) || height / 2;
  });
  const copyNodes = JSON.parse(JSON.stringify(nodes));
  const copyEdges = JSON.parse(JSON.stringify(edges));
  const simulation = d3Force.forceSimulation().nodes(copyNodes).force('link', d3Force.forceLink(copyEdges).id(d => d.id).distance(d => {
    const edgeInfo = noLeafEdge.find(edge => edge.source === d.source && edge.target === d.target);
    if (edgeInfo) {
      return 50;
    }
    return 70;
  })).force('charge', d3Force.forceManyBody()).force('center', d3Force.forceCenter(width / 2, height / 2)).force('x', d3Force.forceX(width / 2)).force('y', d3Force.forceY(height / 2)).alpha(0.3).alphaDecay(0.08).alphaMin(0.001);
  const layoutPromise = new Promise(resolve => {
    simulation.on('end', () => {
      // 坐标信息同步到nodes,edges中
      nodes.forEach(node => {
        const nodeInfo = copyNodes.find(item => item.id === node.id);
        if (nodeInfo) {
          node.x = nodeInfo.x;
          node.y = nodeInfo.y;
        }
      });
      const minX = Math.min(...nodes.map(node => node.x));
      const maxX = Math.max(...nodes.map(node => node.x));
      const minY = Math.min(...nodes.map(node => node.y));
      const maxY = Math.max(...nodes.map(node => node.y));
      const scalex = width / (maxX - minX);
      const scaley = height / (maxY - minY);
      nodes.forEach(node => {
        if (node.x !== undefined && scalex < 1) {
          node.x = (node.x - minX) * scalex;
        }
        if (node.y !== undefined && scaley < 1) {
          node.y = (node.y - minY) * scaley;
        }
      });

      // 这一步就执行缩小空间。且不考虑节点size
      nodes.forEach(node => {
        node.sizeTemp = node.size;
        node.size = [10, 10];
      });
      mysqlWorkbench(nodes, edges);
      nodes.forEach(node => {
        node.size = node.sizeTemp || [];
        delete node.sizeTemp;
      });
      // 进行网格对齐+节点大小扩增
      forceGrid({
        nodes
      }, options);
      resolve({
        nodes
      });
    });
  });
  return layoutPromise;
}