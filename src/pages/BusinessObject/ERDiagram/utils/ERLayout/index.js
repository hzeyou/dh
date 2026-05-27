import _isFunction from "lodash/isFunction";
import _isArray from "lodash/isArray";
import { Base } from '@antv/layout/lib/layout/base';
import layout from "./core";
export default class ERLayout extends Base {
  constructor(options) {
    super();
    this.width = 300;
    this.height = 300;
    this.nodeMinGap = 50;
    /** 迭代结束的回调函数 */
    this.onLayoutEnd = () => {};
    if (options) {
      this.updateCfg(options);
    }
  }
  getDefaultCfg() {
    return {
      width: 300,
      height: 300,
      nodeMinGap: 50
    };
  }

  /**
   * 执行布局
   */
  execute() {
    var _nodes, _edges;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    let nodes = self.nodes,
      edges = self.edges;
    // 节点初始化，兼容 size 数据
    // @ts-ignore
    nodes = (_nodes = nodes) === null || _nodes === void 0 ? void 0 : _nodes.map(node => {
      var _node$position, _node$position2;
      let size = [214, 50];
      if (_isArray(node.size)) {
        size = node.size;
      } else if (_isFunction(node.size)) {
        var _node$size, _node$size2;
        size = [(_node$size = node.size()) === null || _node$size === void 0 ? void 0 : _node$size.width, (_node$size2 = node.size()) === null || _node$size2 === void 0 ? void 0 : _node$size2.height];
      }
      return {
        size,
        id: node.id,
        shape: node.shape,
        x: (_node$position = node.position()) === null || _node$position === void 0 ? void 0 : _node$position.x,
        y: (_node$position2 = node.position()) === null || _node$position2 === void 0 ? void 0 : _node$position2.y
      };
    });
    // 边初始化, 兼容 source, target 数据
    // @ts-ignore
    edges = (_edges = edges) === null || _edges === void 0 ? void 0 : _edges.map(edge => {
      return {
        source: edge.source.cell,
        target: edge.target.cell
      };
    });
    const data = {
      nodes,
      edges
    };
    return layout(data, {
      width: this.width,
      height: this.height,
      nodeMinGap: this.nodeMinGap
    }).then(res => {
      if (self.onLayoutEnd) self.onLayoutEnd();
      return res;
    }).catch(e => {
      console.error(e);
      if (self.onLayoutEnd) self.onLayoutEnd();
    });
  }
  getType() {
    return 'er';
  }
}