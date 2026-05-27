import { Graph, reactShape } from "hzero-front-apaas/lib/components/AntvX6";
import { ReactNodeShape, RouterName } from "hzero-front-hmde/lib/constants/x6";
import ERLayout from "./ERLayout";
import ERNode from "../components/ERNode";

/**
 * 注册 ER 图节点
 */
export function registerReactERNode() {
  reactShape.register({
    shape: ReactNodeShape.ER_NODE,
    effect: ['data'],
    component: ERNode
  });
}

/**
 * 执行 ER 布局算法
 * @constructor
 */
export function executeERLayout(graph) {
  const nodes = graph.getNodes();
  const edges = graph.getEdges();
  const width = graph.container.clientWidth;
  const height = graph.container.clientHeight;
  // 加载 ER 图布局
  const ERLayoutInstance = new ERLayout({
    nodes,
    edges,
    nodeMinGap: 20,
    width,
    height
  });
  return new Promise(resolve => {
    ERLayoutInstance.execute().then(({
      nodes: newNodes = []
    }) => {
      nodes.forEach(item => {
        const node = newNodes.find(n => n.id === item.id);
        if (node) {
          item.position(node.x || 0, node.y || 0);
        }
      });
      graph.zoomToFit({
        padding: 10,
        maxScale: 1
      });
      resolve();
    });
  });
}
/**
 * 注册 ER 路由
 */
export function registerERRouter() {
  Graph.registerRouter(RouterName.ER_ROUTER, (vertices, options, edgeView) => {
    const offsetRaw = options.offset || 32;
    const min = options.min == null ? 16 : options.min;
    let offset = 0;
    let direction = options.direction;
    const sourceBBox = edgeView.sourceBBox,
      targetBBox = edgeView.targetBBox;
    const sourcePoint = sourceBBox.getCenter();
    const targetPoint = targetBBox.getCenter();
    if (typeof offsetRaw === 'number') {
      offset = offsetRaw;
    }
    if (direction == null) {
      let dx = targetBBox.left - sourceBBox.right;
      let dy = targetBBox.top - sourceBBox.bottom;
      if (dx >= 0 && dy >= 0) {
        direction = dx >= dy ? 'L' : 'T';
      } else if (dx <= 0 && dy >= 0) {
        dx = sourceBBox.left - targetBBox.right;
        if (dx >= 0) {
          direction = dx >= dy ? 'R' : 'T';
        } else {
          direction = 'T';
        }
      } else if (dx >= 0 && dy <= 0) {
        dy = sourceBBox.top - targetBBox.bottom;
        if (dy >= 0) {
          direction = dx >= dy ? 'L' : 'B';
        } else {
          direction = 'L';
        }
      } else {
        dx = sourceBBox.left - targetBBox.right;
        dy = sourceBBox.top - targetBBox.bottom;
        if (dx >= 0 && dy >= 0) {
          direction = dx >= dy ? 'R' : 'B';
        } else if (dx <= 0 && dy >= 0) {
          direction = 'B';
        } else if (dx >= 0 && dy <= 0) {
          direction = 'R';
        } else {
          direction = Math.abs(dx) > Math.abs(dy) ? 'R' : 'B';
        }
      }
    }
    if (direction === 'H') {
      direction = targetPoint.x - sourcePoint.x >= 0 ? 'L' : 'R';
    } else if (direction === 'V') {
      direction = targetPoint.y - sourcePoint.y >= 0 ? 'T' : 'B';
    }
    if (offsetRaw === 'center') {
      if (direction === 'L') {
        offset = (targetBBox.left - sourceBBox.right) / 2;
      } else if (direction === 'R') {
        offset = (sourceBBox.left - targetBBox.right) / 2;
      } else if (direction === 'T') {
        offset = (targetBBox.top - sourceBBox.bottom) / 2;
      } else if (direction === 'B') {
        offset = (sourceBBox.top - targetBBox.bottom) / 2;
      }
    }
    let coord;
    let dim;
    let factor;
    const horizontal = direction === 'L' || direction === 'R';
    if (horizontal) {
      if (targetPoint.y === sourcePoint.y) {
        return [...vertices];
      }
      factor = direction === 'L' ? 1 : -1;
      coord = 'x';
      dim = 'width';
    } else {
      if (targetPoint.x === sourcePoint.x) {
        return [...vertices];
      }
      factor = direction === 'T' ? 1 : -1;
      coord = 'y';
      dim = 'height';
    }
    const source = sourcePoint.clone();
    const target = targetPoint.clone();
    source[coord] += factor * (sourceBBox[dim] / 2 + offset);
    target[coord] -= factor * (targetBBox[dim] / 2 + offset);
    if (horizontal) {
      const sourceX = source.x;
      const targetX = target.x;
      const sourceDelta = sourceBBox.width / 2 + min;
      const targetDelta = targetBBox.width / 2 + min;
      if (targetPoint.x > sourcePoint.x) {
        if (targetX <= sourceX) {
          source.x = Math.max(targetX, sourcePoint.x + sourceDelta);
          target.x = Math.min(sourceX, targetPoint.x - targetDelta);
        }
      } else if (targetX >= sourceX) {
        source.x = Math.min(targetX, sourcePoint.x - sourceDelta);
        target.x = Math.max(sourceX, targetPoint.x + targetDelta);
      }
    } else {
      const sourceY = source.y;
      const targetY = target.y;
      const sourceDelta = sourceBBox.height / 2 + min;
      const targetDelta = targetBBox.height / 2 + min;
      if (targetPoint.y > sourcePoint.y) {
        if (targetY <= sourceY) {
          source.y = Math.max(targetY, sourcePoint.y + sourceDelta);
          target.y = Math.min(sourceY, targetPoint.y - targetDelta);
        }
      } else if (targetY >= sourceY) {
        source.y = Math.min(targetY, sourcePoint.y - sourceDelta);
        target.y = Math.max(sourceY, targetPoint.y + targetDelta);
      }
    }

    // 如果是自己连自己
    if (sourcePoint.x === targetPoint.x) {
      target.x = source.x;
    }
    return [source.toJSON(), ...vertices, target.toJSON()];
  });
  return () => Graph.unregisterRouter(RouterName.ER_ROUTER);
}