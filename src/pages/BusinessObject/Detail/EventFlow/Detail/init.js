import { Graph, Shape } from "hzero-front-apaas/lib/components/AntvX6";
import uuid from 'uuid/v4';
import { Selection, Clipboard, History, Keyboard, MiniMap } from "hzero-front-apaas/lib/components/AntvX6/plugins";
export default function init(graphData) {
  const width = window.innerWidth - 623;
  const height = window.innerHeight - 220;
  let data = {
    // 节点
    nodes: [{
      nodeCode: `START-${uuid()}`,
      x: width / 2,
      // Number，必选，节点位置的 x 值
      y: 40,
      // Number，必选，节点位置的 y 值
      width: 26,
      // Number，可选，节点大小的 width 值
      height: 26,
      // Number，可选，节点大小的 height 值
      shape: 'circle',
      attrs: {
        body: {
          fill: '#C8EBE0',
          stroke: '#59CFAA',
          strokeWidth: 2,
          cursor: 'pointer'
        }
      },
      ports: {
        groups: {
          start: {
            position: 'bottom'
          }
        },
        items: [{
          id: 'start',
          group: 'start',
          attrs: {
            circle: {
              r: 5,
              magnet: true,
              stroke: '#0840F8',
              strokeWidth: 1,
              fill: '#ffffff'
            }
          }
        }]
      }
    }, {
      nodeCode: `END-${uuid()}`,
      x: width / 2,
      // Number，必选，节点位置的 x 值
      y: 500,
      // Number，必选，节点位置的 y 值
      width: 26,
      // Number，可选，节点大小的 width 值
      height: 26,
      // Number，可选，节点大小的 height 值
      shape: 'circle',
      attrs: {
        cursor: 'pointer',
        body: {
          fill: '#FAC4C4',
          stroke: '#FF4C4C',
          strokeWidth: 2,
          cursor: 'pointer'
        }
      },
      ports: {
        groups: {
          end: {
            position: 'top'
          }
        },
        items: [{
          id: 'end',
          group: 'end',
          attrs: {
            circle: {
              r: 5,
              magnet: true,
              stroke: '#0840F8',
              strokeWidth: 1,
              fill: '#ffffff'
            }
          }
        }]
      }
    }]
  };
  if (graphData) {
    data = graphData;
  }

  // 控制节点连接桩显示/隐藏
  const handleShowPorts = (ports, show) => {
    for (let i = 0; i < (ports === null || ports === void 0 ? void 0 : ports.length); i++) {
      // eslint-disable-next-line no-param-reassign
      ports[i].style.visibility = show ? 'visible' : 'hidden';
    }
  };
  const graph = new Graph({
    container: document.getElementById('app-content'),
    width,
    height,
    panning: true,
    mousewheel: {
      enabled: true,
      minScale: 0.3
    },
    background: {
      color: '#f7f7f7'
    },
    grid: {
      size: 20,
      visible: true
    },
    connecting: {
      allowBlank: false,
      // 是否允许连接到空白位置
      allowMulti: false,
      // 是否允许在相同的其实和终止节点间创建多条边
      allowLoop: false,
      // 是否允许创建循环连线
      allowNode: false,
      // 是否允许边连接到节点上
      router: 'manhattan',
      connector: {
        name: 'rounded',
        args: {
          radius: 8
        }
      },
      anchor: 'center',
      connectionPoint: 'anchor',
      snap: {
        radius: 30
      },
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: '#ccd0db',
              strokeWidth: 2,
              targetMarker: {
                name: 'block',
                width: 12,
                height: 8
              }
            }
          },
          zIndex: 0
        });
      },
      validateConnection({
        targetMagnet
      }) {
        return !!targetMagnet;
      }
    },
    highlighting: {
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            stroke: '#ABCAFF'
          }
        }
      }
    }
  });

  // 选择
  graph.use(new Selection({
    enabled: true
  }));

  // 复制粘贴
  graph.use(new Clipboard({
    enabled: true,
    useLocalStorage: true
  }));

  // 历史记录
  graph.use(new History({
    enabled: true,
    ignoreAdd: false,
    ignoreRemove: false,
    ignoreChange: false,
    beforeAddCommand(event, args) {
      // 忽略删除控件的动作
      if ((args === null || args === void 0 ? void 0 : args.key) === 'tools') {
        return false;
      }
      // 忽略点击动作
      if ((args === null || args === void 0 ? void 0 : args.key) === 'zIndex') {
        return false;
      }
      if (args !== null && args !== void 0 && args.options) {
        return args.options.ignore !== false;
      }
    }
  }));

  // 快捷键
  graph.use(new Keyboard({
    enabled: true
  }));

  // 小地图
  graph.use(new MiniMap({
    container: document.getElementById('app-minimap')
  }));
  graph.fromJSON(data);
  graph.on('node:mouseenter', ({
    node
  }) => {
    var _nodeCode;
    const container = document.getElementById('app-content');
    const ports = container === null || container === void 0 ? void 0 : container.querySelectorAll('.x6-port-body');
    handleShowPorts(ports, true);
    const nodeJson = node.toJSON();
    if ((nodeJson === null || nodeJson === void 0 ? void 0 : (_nodeCode = nodeJson.nodeCode) === null || _nodeCode === void 0 ? void 0 : _nodeCode.indexOf('START')) === -1) {
      var _nodeCode2;
      if ((nodeJson === null || nodeJson === void 0 ? void 0 : (_nodeCode2 = nodeJson.nodeCode) === null || _nodeCode2 === void 0 ? void 0 : _nodeCode2.indexOf('CONDITION')) === -1) {
        node.addTools({
          name: 'button-remove',
          args: {
            x: '100%',
            y: 0
          }
        });
      } else {
        node.addTools({
          name: 'button-remove',
          args: {
            x: '75%',
            y: '25%'
          }
        });
      }
    }
  });
  graph.on('edge:mouseenter', ({
    edge
  }) => {
    edge.addTools({
      name: 'button-remove',
      args: {
        x: 0,
        y: 0,
        offset: {
          x: 0,
          y: 0
        }
      }
    });
  });
  graph.on('node:mouseleave', ({
    node
  }) => {
    const container = document.getElementById('app-content');
    const ports = container === null || container === void 0 ? void 0 : container.querySelectorAll('.x6-port-body');
    handleShowPorts(ports, false);
    node.removeTools();
  });
  graph.on('edge:mouseleave', ({
    edge
  }) => {
    edge.removeTools();
  });

  // delete
  graph.bindKey('backspace', () => {
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.removeCells(cells);
    }
  });
  return graph;
}