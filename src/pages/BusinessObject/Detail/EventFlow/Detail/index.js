import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Breadcrumb from "@hzero-front-ui/c7n-ui/lib/Breadcrumb";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _Collapse from "@hzero-front-ui/c7n-ui/lib/Collapse";
import React, { useMemo, useRef, useEffect, useState, useContext } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { Dom } from "hzero-front-apaas/lib/components/AntvX6";
import { Dnd } from "hzero-front-apaas/lib/components/AntvX6/plugins";
import { getResponse, getCurrentOrganizationId } from 'utils/utils';
import uuid from 'uuid/v4';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import { Toolbar } from "hzero-front-hmde/lib/components/UiComponents/toolbar";
import { ToolbarGroup } from "hzero-front-hmde/lib/components/UiComponents/toolbar/group";
import { ToolbarItem } from "hzero-front-hmde/lib/components/UiComponents/toolbar/item";
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { getBOEventFlowDetail, createBOEventFlow } from "hzero-front-hmde/lib/services/eventFlowService";
import { pxWidth } from "hzero-front-apaas/lib/utils/common";
import { getBusinessObjectFieldListByCode } from "hzero-front-hmde/lib/services/businessObjectService";
import ConditionModal from "./ConditionModal";
import ConditionList from "./ConditionList";
import ConditionEdge from "./ConditionEdge";
import FlowVarList from "./FlowVarList";
import Node from "./Node/Node";
import { nodes, regularNode, conditionNode, endNode } from "./Node/config";
import init from "./init";
import Store, { StoreProvider } from "../stores/EventFlowStore";
import { conditionDs } from "../stores";
import styles from "../index.less?modules";
const Panel = _Collapse.Panel;
const conditionModalKey = _Modal.key();
const tenantId = getCurrentOrganizationId();
const Index = observer(props => {
  var _graph$current5;
  const _ref = props || {},
    history = _ref.history;
  const _useContext = useContext(Store),
    businessObjectCode = _useContext.businessObjectCode,
    businessObjectId = _useContext.businessObjectId,
    eventFlowStore = _useContext.eventFlowStore,
    flowVarDS = _useContext.flowVarDS;
  const nodeDS = eventFlowStore.nodeDS,
    previousDS = eventFlowStore.previousDS;
  const flowId = eventFlowStore.currentEventFlow.flowId;
  const dataOperateNodes = nodes.filter(item => item.category === 'DATA_OPERATE') || [];
  const flowDefinitionNodes = nodes.filter(item => item.category === 'FLOW_DEFINITION') || [];
  const graph = useRef();
  const dnd = useRef();
  const _useState = useState(),
    _useState2 = _slicedToArray(_useState, 2),
    nodeCode = _useState2[0],
    setNodeCode = _useState2[1];
  const _useState3 = useState(),
    _useState4 = _slicedToArray(_useState3, 2),
    selectedNode = _useState4[0],
    setSelectedNode = _useState4[1];
  const nodeCodeRef = useRef();
  const _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    loading = _useState6[0],
    setLoading = _useState6[1];
  const _useState7 = useState(''),
    _useState8 = _slicedToArray(_useState7, 2),
    flowName = _useState8[0],
    setFlowName = _useState8[1];
  const _useState9 = useState(false),
    _useState10 = _slicedToArray(_useState9, 2),
    isDisabled = _useState10[0],
    setIsDisabled = _useState10[1];
  useEffect(() => {
    nodeCodeRef.current = nodeCode;
  }, [nodeCode]);
  const _useMemo = useMemo(() => {
      var _eventFlowStore$getEv, _eventFlowStore$getEv2;
      return [new _DataSet((nodeCode === null || nodeCode === void 0 ? void 0 : nodeCode.indexOf('CONDITION')) !== -1 ? conditionDs((_eventFlowStore$getEv = eventFlowStore === null || eventFlowStore === void 0 ? void 0 : (_eventFlowStore$getEv2 = eventFlowStore.getEventFlowNode(nodeCode)) === null || _eventFlowStore$getEv2 === void 0 ? void 0 : _eventFlowStore$getEv2.conditions) !== null && _eventFlowStore$getEv !== void 0 ? _eventFlowStore$getEv : [], businessObjectCode) : {})];
    }, [nodeCode, businessObjectCode]),
    _useMemo2 = _slicedToArray(_useMemo, 1),
    conditionDS = _useMemo2[0];
  const getDetail = () => {
    getBOEventFlowDetail({
      flowId
    }).then(async res => {
      setLoading(false);
      if (getResponse(res)) {
        setFlowName(res === null || res === void 0 ? void 0 : res.flowName);
        // 平台
        if (tenantId === 0) {
          if ((res === null || res === void 0 ? void 0 : res.flowCategory) === 'STANDARD') {
            setIsDisabled(true);
          } else {
            setIsDisabled(false);
          }
        }
        if (tenantId !== 0) {
          // 租户
          if ((res === null || res === void 0 ? void 0 : res.flowCategory) === 'STANDARD' || (res === null || res === void 0 ? void 0 : res.flowCategory) === 'PREDEFINE') {
            setIsDisabled(true);
          } else {
            setIsDisabled(false);
          }
        }
        if (res !== null && res !== void 0 && res.displayJson) {
          graph.current.fromJSON(res === null || res === void 0 ? void 0 : res.displayJson);
          graph.current.centerContent();
        }
        graph.current.toJSON().cells.forEach(item => {
          eventFlowStore.cellsMap.set(item.id, item);
        });
        await eventFlowStore.loadData(res);
        // 初始化store里的开始结束节点数据
        const _startNode = graph.current.toJSON().cells.find(item => {
          var _item$nodeCode;
          return item === null || item === void 0 ? void 0 : (_item$nodeCode = item.nodeCode) === null || _item$nodeCode === void 0 ? void 0 : _item$nodeCode.startsWith('START');
        });
        const _endNode = graph.current.toJSON().cells.find(item => {
          var _item$nodeCode2;
          return item === null || item === void 0 ? void 0 : (_item$nodeCode2 = item.nodeCode) === null || _item$nodeCode2 === void 0 ? void 0 : _item$nodeCode2.startsWith('END');
        });
        if (_startNode.nodeCode && !eventFlowStore.getEventFlowNode(_startNode.nodeCode)) {
          eventFlowStore.setEventFlowNode(_startNode.nodeCode, {
            nodeName: intl.get('hmde.common.start').d('开始'),
            nodeCode: _startNode.nodeCode,
            nodeType: 'ROOT',
            flowCode: eventFlowStore.currentEventFlow.flowCode
          });
        }
        if (_endNode.nodeCode && !eventFlowStore.getEventFlowNode(_endNode.nodeCode)) {
          eventFlowStore.setEventFlowNode(_endNode.nodeCode, {
            nodeName: intl.get('hmde.se.scriptEvent.text.end').d('结束'),
            nodeCode: _endNode.nodeCode,
            nodeType: 'END',
            flowCode: eventFlowStore.currentEventFlow.flowCode
          });
        }
        setNodeCode('');
      }
    }).catch(() => {});
  };
  const pageInit = () => {
    setLoading(true);
    // 初始化graph对象
    graph.current = init();
    graph.current.centerContent();
    // 初始化拖拽对象
    dnd.current = new Dnd({
      target: graph.current,
      // eslint-disable-line
      scaled: false,
      validateNode(droppingNode, options) {
        eventFlowStore.addNode(droppingNode === null || droppingNode === void 0 ? void 0 : droppingNode.toJSON());
        return droppingNode.shape === 'html' ? new Promise(resolve => {
          const draggingNode = options.draggingNode,
            draggingGraph = options.draggingGraph;
          const view = draggingGraph.findView(draggingNode);
          const contentElem = view === null || view === void 0 ? void 0 : view.findOne('foreignObject > body > div');
          if (contentElem) {
            Dom.addClass(contentElem, 'validating');
            setTimeout(() => {
              Dom.removeClass(contentElem, 'validating');
              resolve(true);
            }, 3000);
          }
        }) : true;
      }
    });
    // 节点、边点击事件
    // graph.current.on('cell:mousedown', async ({e}) => {
    //   console.log('鼠标按下');
    //   if (previousDS.current && !(await previousDS.current.validate())) {
    //     e.stopPropagation();
    //   }
    // });
    // 节点点击事件
    graph.current.on('node:click', async _props => {
      var _nodeDS$current, _nodeDS$current$valid;
      const excute = () => {
        const node = _props.node;
        const jsonData = node.toJSON() || {};
        if ((jsonData === null || jsonData === void 0 ? void 0 : jsonData.nodeCode.indexOf('START')) === -1 && (jsonData === null || jsonData === void 0 ? void 0 : jsonData.nodeCode.indexOf('END')) === -1) {
          if (jsonData !== null && jsonData !== void 0 && jsonData.nodeCode && !eventFlowStore.getEventFlowNode(jsonData === null || jsonData === void 0 ? void 0 : jsonData.nodeCode)) {
            eventFlowStore.setEventFlowNode(jsonData === null || jsonData === void 0 ? void 0 : jsonData.nodeCode, {});
          }
          setNodeCode(jsonData === null || jsonData === void 0 ? void 0 : jsonData.nodeCode);
          setSelectedNode(node);
        }
      };
      if ((await flowVarDS.validate()) && ((await ((_nodeDS$current = nodeDS.current) === null || _nodeDS$current === void 0 ? void 0 : (_nodeDS$current$valid = _nodeDS$current.validate) === null || _nodeDS$current$valid === void 0 ? void 0 : _nodeDS$current$valid.call(_nodeDS$current))) || !nodeDS.current)) {
        if (previousDS.current) {
          previousDS.current.validate(true).then(r => {
            if (r) {
              excute();
            }
          });
        } else {
          excute();
        }
      }
    });
    // 边点击事件
    // 如果不是条件节点的边，点击没有反应
    graph.current.on('edge:click', async ({
      edge
    }) => {
      const excute = () => {
        var _edge$getSourceNode, _edge$getSourceNode$c;
        const parentNode = edge === null || edge === void 0 ? void 0 : (_edge$getSourceNode = edge.getSourceNode) === null || _edge$getSourceNode === void 0 ? void 0 : (_edge$getSourceNode$c = _edge$getSourceNode.call(edge)) === null || _edge$getSourceNode$c === void 0 ? void 0 : _edge$getSourceNode$c.toJSON(); // 获取父节点数据. 不使用store里cellsMap的原因是取不到未保存的节点数据
        if ((parentNode === null || parentNode === void 0 ? void 0 : parentNode.nodeType) === 'CONDITION') {
          setNodeCode(`EDGE-${edge === null || edge === void 0 ? void 0 : edge.id}`);
        }
      };
      excute();
    });
    // 条件节点流出边移除事件: 清除条件分支数据
    graph.current.on('edge:removed', async ({
      edge
    }) => {
      const excute = () => {
        var _graph$current, _graph$current$getCel;
        const parentNode = (_graph$current = graph.current) === null || _graph$current === void 0 ? void 0 : (_graph$current$getCel = _graph$current.getCellById(edge === null || edge === void 0 ? void 0 : edge.getSourceCellId())) === null || _graph$current$getCel === void 0 ? void 0 : _graph$current$getCel.toJSON(); // 获取父节点数据
        if ((parentNode === null || parentNode === void 0 ? void 0 : parentNode.nodeType) === 'CONDITION') {
          var _ref2, _graph$current2, _ref3, _conditionNodeData$at;
          if (nodeCode === `EDGE-${edge === null || edge === void 0 ? void 0 : edge.id}`) {
            setNodeCode('');
          }
          const childrenNodeCodes = (_ref2 = ((_graph$current2 = graph.current) === null || _graph$current2 === void 0 ? void 0 : _graph$current2.getOutgoingEdges(edge === null || edge === void 0 ? void 0 : edge.getSourceCellId())) || []) === null || _ref2 === void 0 ? void 0 : _ref2.map(cell => {
            var _cell$getTargetCell, _cell$getTargetCell$c, _cell$getTargetCell$c2, _cell$getTargetCell$c3;
            return cell === null || cell === void 0 ? void 0 : (_cell$getTargetCell = cell.getTargetCell) === null || _cell$getTargetCell === void 0 ? void 0 : (_cell$getTargetCell$c = _cell$getTargetCell.call(cell)) === null || _cell$getTargetCell$c === void 0 ? void 0 : (_cell$getTargetCell$c2 = _cell$getTargetCell$c.toJSON) === null || _cell$getTargetCell$c2 === void 0 ? void 0 : (_cell$getTargetCell$c3 = _cell$getTargetCell$c2.call(_cell$getTargetCell$c)) === null || _cell$getTargetCell$c3 === void 0 ? void 0 : _cell$getTargetCell$c3.nodeCode;
          });
          const conditionNodeData = eventFlowStore.getEventFlowNode(parentNode.nodeCode) || {};
          const childrenConditionList = (_ref3 = (conditionNodeData === null || conditionNodeData === void 0 ? void 0 : (_conditionNodeData$at = conditionNodeData.attributeJson) === null || _conditionNodeData$at === void 0 ? void 0 : _conditionNodeData$at.childrenConditionList) || []) === null || _ref3 === void 0 ? void 0 : _ref3.filter(c => childrenNodeCodes.includes(c.childNodeCode));
          eventFlowStore.setNodeData(parentNode.nodeCode, 'attributeJson', {
            ...conditionNodeData.attributeJson,
            childrenConditionList
          });
        }
      };
      excute();
    });
    graph.current.on('node:removed', async ({
      node
    }) => {
      const excute = () => {
        const nodeData = node.toJSON();
        if (nodeCodeRef.current === (nodeData === null || nodeData === void 0 ? void 0 : nodeData.nodeCode)) {
          setNodeCode('');
        }
      };
      if (await flowVarDS.validate()) {
        excute();
      }
    });
    graph.current.on('blank:click', async () => {
      const excute = () => {
        setNodeCode('');
      };
      if (nodeDS.current) {
        // 说明当前节点面板是打开状态
        nodeDS.current.validate().then(async res => {
          if (res) {
            if (await flowVarDS.validate()) {
              if (previousDS.current) {
                previousDS.current.validate(true).then(r => {
                  if (r) {
                    excute();
                  }
                });
              } else {
                excute();
              }
            }
          }
        });
      }
      if (!nodeDS.current) {
        if (await flowVarDS.validate()) {
          excute();
        }
      }
    });
    getDetail();
  };
  useEffect(() => {
    pageInit();
  }, []);
  const openConditionModal = async enabledDrillFlag => {
    var _eventFlowStore$getEv3;
    conditionDS.loadData((eventFlowStore === null || eventFlowStore === void 0 ? void 0 : (_eventFlowStore$getEv3 = eventFlowStore.getEventFlowNode(nodeCode)) === null || _eventFlowStore$getEv3 === void 0 ? void 0 : _eventFlowStore$getEv3.conditions) || []);
    let businessObjectFieldList = await getBusinessObjectFieldListByCode(businessObjectCode);
    if (getResponse(businessObjectFieldList)) {
      var _businessObjectFieldL;
      businessObjectFieldList = (_businessObjectFieldL = businessObjectFieldList) === null || _businessObjectFieldL === void 0 ? void 0 : _businessObjectFieldL.map(({
        businessObjectFieldName,
        businessObjectFieldCode
      }) => ({
        meaning: businessObjectFieldName,
        value: businessObjectFieldCode
      }));
    } else {
      businessObjectFieldList = [];
    }
    _Modal.open({
      key: conditionModalKey,
      title: intl.get('hmde.bo.businessObject.condition').d('条件'),
      drawer: true,
      style: {
        width: '66.5%'
      },
      bodyStyle: {
        paddingTop: 0
      },
      border: false,
      closable: true,
      children: /*#__PURE__*/React.createElement(ConditionModal, {
        dataSet: conditionDS,
        businessObjectCode: businessObjectCode,
        enabledDrillFlag: enabledDrillFlag,
        businessObjectFieldList: businessObjectFieldList
      }),
      onOk: async () => {
        if (await conditionDS.validate()) {
          var _conditionDS$toData, _ref4, _conditionNodeData$at2, _graph$current3, _graph$current3$getCe, _graph$current3$getCe2, _graph$current3$getCe3;
          const conditionData = (_conditionDS$toData = conditionDS.toData()) === null || _conditionDS$toData === void 0 ? void 0 : _conditionDS$toData.map(item => ({
            ...item,
            nodeCode
          }));
          eventFlowStore.setNodeData(nodeCode, 'conditions', conditionData);
          // 条件客户端删除条件后应该同步删除线上的条件绑定，先解决数据
          const conditionNodeData = eventFlowStore.getEventFlowNode(nodeCode) || {};

          /** 绑定删除条件的子节点编码 */
          let delChildNodeCode = '';
          const childrenConditionList = (_ref4 = (conditionNodeData === null || conditionNodeData === void 0 ? void 0 : (_conditionNodeData$at2 = conditionNodeData.attributeJson) === null || _conditionNodeData$at2 === void 0 ? void 0 : _conditionNodeData$at2.childrenConditionList) || []) === null || _ref4 === void 0 ? void 0 : _ref4.filter(cc => {
            const bool = conditionData.some(c => c.conditionCode === cc.conditionCode);
            if (!bool) {
              delChildNodeCode = cc === null || cc === void 0 ? void 0 : cc.childNodeCode;
            }
            return bool;
          });
          eventFlowStore.setNodeData(nodeCode, 'attributeJson', {
            ...conditionNodeData.attributeJson,
            childrenConditionList
          });
          // 再解决画布
          /** 条件节点 */
          const conditionCell = (_graph$current3 = graph.current) === null || _graph$current3 === void 0 ? void 0 : (_graph$current3$getCe = _graph$current3.getCells) === null || _graph$current3$getCe === void 0 ? void 0 : (_graph$current3$getCe2 = _graph$current3$getCe.call(_graph$current3)) === null || _graph$current3$getCe2 === void 0 ? void 0 : (_graph$current3$getCe3 = _graph$current3$getCe2.find) === null || _graph$current3$getCe3 === void 0 ? void 0 : _graph$current3$getCe3.call(_graph$current3$getCe2, cell => {
            var _cell$store, _cell$store$data;
            return (cell === null || cell === void 0 ? void 0 : (_cell$store = cell.store) === null || _cell$store === void 0 ? void 0 : (_cell$store$data = _cell$store.data) === null || _cell$store$data === void 0 ? void 0 : _cell$store$data.nodeCode) === nodeCode;
          });
          if (conditionCell && delChildNodeCode) {
            var _graph$current4, _graph$current4$getCe, _graph$current4$getCe2, _graph$current4$getCe3;
            /** 绑定删除条件的目标节点 */
            const delChildCell = (_graph$current4 = graph.current) === null || _graph$current4 === void 0 ? void 0 : (_graph$current4$getCe = _graph$current4.getCells) === null || _graph$current4$getCe === void 0 ? void 0 : (_graph$current4$getCe2 = _graph$current4$getCe.call(_graph$current4)) === null || _graph$current4$getCe2 === void 0 ? void 0 : (_graph$current4$getCe3 = _graph$current4$getCe2.find) === null || _graph$current4$getCe3 === void 0 ? void 0 : _graph$current4$getCe3.call(_graph$current4$getCe2, cell => {
              var _cell$store2, _cell$store2$data;
              return (cell === null || cell === void 0 ? void 0 : (_cell$store2 = cell.store) === null || _cell$store2 === void 0 ? void 0 : (_cell$store2$data = _cell$store2.data) === null || _cell$store2$data === void 0 ? void 0 : _cell$store2$data.nodeCode) === delChildNodeCode;
            });
            /** 条件节点的输出边 */
            const conditionEdges = graph.current.getOutgoingEdges(conditionCell) || [];
            conditionEdges.forEach(edge => {
              var _edge$getTargetCell, _edge$getTargetCell$c;
              if ((edge === null || edge === void 0 ? void 0 : (_edge$getTargetCell = edge.getTargetCell) === null || _edge$getTargetCell === void 0 ? void 0 : (_edge$getTargetCell$c = _edge$getTargetCell.call(edge)) === null || _edge$getTargetCell$c === void 0 ? void 0 : _edge$getTargetCell$c.id) === (delChildCell === null || delChildCell === void 0 ? void 0 : delChildCell.id)) {
                edge.removeLabelAt(0);
              }
            });
          }
        } else {
          return false;
        }
      },
      onCancel: () => {
        conditionDS.reset();
      }
    });
  };

  // toolbar操作
  const handleClickToolbar = name => {
    const cells = graph.current.getSelectedCells();
    const map = new Map();
    // 清空复制节点的nodeId
    cells.forEach(item => {
      map.set(item.store.data.nodeId, item.store.data.nodeId);
    });
    switch (name) {
      case 'undo':
        if (graph.current.history.canUndo()) {
          graph.current.history.undo();
        }
        break;
      case 'redo':
        if (graph.current.history.canRedo()) {
          graph.current.history.redo();
        }
        break;
      case 'copy':
        if (cells && cells.length) {
          // 先删除flowNodeId
          cells.forEach(item => {
            delete item.store.data.nodeId; // eslint-disable-line
          });
          graph.current.copy(cells);
          // 还原flowNodeId;
          cells.forEach(item => {
            item.store.data.nodeId = map.get(item.store.data.nodeId); // eslint-disable-line
          });
        } else {
          notification.warning({
            message: intl.get('hmde.common.text.selectbeforecopying').d('请先选中节点再复制')
          });
        }
        break;
      case 'paste':
        if (graph.current.isClipboardEmpty()) {
          notification.warning({
            message: intl.get('hmde.common.text.emptycannotasted').d('剪切板为空，不可粘贴')
          });
        } else {
          graph.current.paste();
          graph.current.cleanSelection();
        }
        break;
      case 'delete':
        graph.current.removeCells(cells);
        break;
      case 'zoomIn':
        graph.current.zoom(-0.1);
        break;
      case 'zoomOut':
        graph.current.zoom(0.1);
        break;
      default:
        break;
    }
  };
  const startDrag = (e, item) => {
    const nodeType = item.nodeType,
      _nodeName = item.nodeName,
      icon = item.icon;
    let _nodeCode = item.nodeCode;
    let node = {};
    _nodeCode = `${_nodeCode}-${uuid()}`;
    if (nodeType === 'EVENT') {
      const _regularNode = regularNode(icon);
      _regularNode.nodeCode = _nodeCode;
      _regularNode.nodeType = nodeType;
      _regularNode.nodeName = _nodeName;
      _regularNode.attrs.label.text = _nodeName;
      node = graph.current.createNode(_regularNode);
    }
    if (nodeType === 'CONDITION') {
      conditionNode.nodeCode = _nodeCode;
      conditionNode.nodeType = nodeType;
      conditionNode.nodeName = _nodeName;
      conditionNode.attrs.label.text = _nodeName;
      node = graph.current.createNode(conditionNode);
    }
    if (nodeType === 'END') {
      endNode.nodeCode = _nodeCode;
      endNode.nodeType = nodeType;
      endNode.nodeName = _nodeName;
      node = graph.current.createNode(endNode);
    }
    dnd.current.start(node, e.nativeEvent);
  };

  // 保存
  const save = async () => {
    const excute = () => {
      const graphJson = graph.current.toJSON();
      eventFlowStore.setDisplayJson(graphJson);
      const currentEventFlow = eventFlowStore.getCurrentEventFlow();
      const conditionNodes = currentEventFlow.eventFlowNodes.filter(({
        nodeType
      }) => nodeType === 'CONDITION');
      if (conditionNodes.some(({
        attributeJson,
        childrenNodeCode
      }) => {
        var _attributeJson$childr, _childrenNodeCode$spl;
        return (attributeJson === null || attributeJson === void 0 ? void 0 : (_attributeJson$childr = attributeJson.childrenConditionList) === null || _attributeJson$childr === void 0 ? void 0 : _attributeJson$childr.length) !== (childrenNodeCode === null || childrenNodeCode === void 0 ? void 0 : (_childrenNodeCode$spl = childrenNodeCode.split(',')) === null || _childrenNodeCode$spl === void 0 ? void 0 : _childrenNodeCode$spl.length);
      })) {
        notification.error({
          message: intl.get('hmde.common.saveError').d('保存失败'),
          description: intl.get('hmde.bo.text.subordinatenodes').d('条件节点到下级节点的连线需要绑定条件')
        });
        return false;
      }
      setLoading(true);
      createBOEventFlow({
        body: currentEventFlow
      }).then(res => {
        setLoading(false);
        if (getResponse(res)) {
          notification.success({
            message: '操作成功'
          });
          getDetail();
        }
      });
    };
    if (nodeDS.current) {
      // 说明当前节点面板是打开状态
      if ((await nodeDS.current.validate()) && (!previousDS.current || (await previousDS.current.validate(true)))) {
        excute();
      }
    } else {
      // 节点面板没打开，不校验节点必填
      excute();
    }
  };

  // 获取标题
  const getTitle = () => {
    return /*#__PURE__*/React.createElement(_Breadcrumb, {
      style: {
        marginLeft: '10px'
      }
    }, /*#__PURE__*/React.createElement(_Breadcrumb.Item, {
      style: {
        cursor: 'pointer'
      },
      onClick: () => history === null || history === void 0 ? void 0 : history.push({
        pathname: `/hmde/business-object/detail/${businessObjectId}`,
        state: {
          originKey: 'eventFlow'
        }
      })
    }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.busniessObject').d('业务对象'))), /*#__PURE__*/React.createElement(_Breadcrumb.Item, null, /*#__PURE__*/React.createElement("span", null, " ", flowName)));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Header, {
    title: getTitle()
  }, /*#__PURE__*/React.createElement(_Button, {
    color: "primary",
    onClick: () => save(),
    disabled: isDisabled
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "baochun.svg",
    size: 16,
    style: {
      margin: '0px 4px'
    }
  }), "\u4FDD\u5B58")), /*#__PURE__*/React.createElement(Content, null, /*#__PURE__*/React.createElement(_Spin, {
    spinning: loading,
    wrapperClassName: styles['spin-box']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.panel
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['left-panel']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['left-panel-tabs']
  }, /*#__PURE__*/React.createElement("div", null, intl.get('hmde.pd.processDefinition.node').d('节点'))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_Collapse, {
    bordered: false,
    defaultActiveKey: ['1', '2']
  }, /*#__PURE__*/React.createElement(Panel, {
    header: intl.get('hmde.pd.nodeClassification.dataHandle').d('数据操作'),
    key: "1",
    className: styles['node-panel']
  }, dataOperateNodes.map(item => /*#__PURE__*/React.createElement("div", {
    className: styles['node-item'],
    onMouseDown: e => startDrag(e, item)
  }, /*#__PURE__*/React.createElement("img", {
    src: item.icon,
    alt: item.nodeCode,
    style: {
      margin: '0px 4px'
    }
  }), item.nodeName))), /*#__PURE__*/React.createElement(Panel, {
    header: intl.get('hmde.pd.nodeClassification.processDefinition').d('流程定义'),
    key: "2",
    className: styles['node-panel']
  }, flowDefinitionNodes.map(item => /*#__PURE__*/React.createElement("div", {
    className: styles['node-item'],
    onMouseDown: e => startDrag(e, item)
  }, /*#__PURE__*/React.createElement("img", {
    src: item.icon,
    alt: item.nodeCode,
    style: {
      margin: '0px 4px'
    }
  }), item.nodeName)))))), /*#__PURE__*/React.createElement("div", {
    className: styles['right-panel']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['app-toolbar']
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Toolbar, {
    size: "big",
    onClick: handleClickToolbar
  }, /*#__PURE__*/React.createElement(ToolbarGroup, null, /*#__PURE__*/React.createElement(ToolbarItem, {
    name: "undo",
    tooltip: intl.get('hmde.bo.text.withdraw').d('撤回'),
    icon: /*#__PURE__*/React.createElement(ImgIcon, {
      name: "undo@v4.0.svg",
      size: 16
    })
  }), /*#__PURE__*/React.createElement(ToolbarItem, {
    name: "redo",
    tooltip: intl.get('hmde.bo.sqlEditor.redo').d('重做'),
    icon: /*#__PURE__*/React.createElement(ImgIcon, {
      name: "redo@v4.0.svg",
      size: 16
    })
  })), /*#__PURE__*/React.createElement(ToolbarGroup, null, /*#__PURE__*/React.createElement(ToolbarItem, {
    name: "copy",
    tooltip: intl.get('hmde.common.copy').d('复制'),
    icon: /*#__PURE__*/React.createElement(ImgIcon, {
      name: "copy@v4.0.svg",
      size: 16
    })
  }), /*#__PURE__*/React.createElement(ToolbarItem, {
    name: "paste",
    tooltip: intl.get('hmde.common.paste').d('粘贴'),
    icon: /*#__PURE__*/React.createElement(ImgIcon, {
      name: "paste@v4.0.svg",
      size: 16
    })
  }), /*#__PURE__*/React.createElement(ToolbarItem, {
    name: "delete",
    tooltip: intl.get('hmde.common.button.delete').d('删除'),
    icon: /*#__PURE__*/React.createElement(ImgIcon, {
      name: "delete@v4.0.svg",
      size: 16
    })
  })), /*#__PURE__*/React.createElement(ToolbarGroup, null, /*#__PURE__*/React.createElement(ToolbarItem, {
    name: "zoomIn",
    tooltip: intl.get('hmde.common.reduceMin').d('缩小'),
    icon: /*#__PURE__*/React.createElement(ImgIcon, {
      name: "narrow@v4.0.svg",
      size: 16
    })
  }), /*#__PURE__*/React.createElement(ToolbarItem, {
    name: "zoomOut",
    tooltip: intl.get('hmde.common.amplify').d('放大'),
    icon: /*#__PURE__*/React.createElement(ImgIcon, {
      name: "enlarge@v4.0.svg",
      size: 16
    })
  }))))), /*#__PURE__*/React.createElement("div", {
    id: "app-content",
    className: styles['app-content']
  }), /*#__PURE__*/React.createElement("div", {
    id: "app-minimap",
    className: styles['app-minimap']
  })), /*#__PURE__*/React.createElement("div", {
    className: styles['props-panel']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['suspend-button'],
    onClick: async () => {
      if (!nodeDS.current || (await nodeDS.current.validate())) {
        nodeDS.current = flowVarDS;
        setNodeCode('FLOW_VAR');
      }
    }
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "liuchen14.svg",
    size: 16,
    className: styles['suspend-button-icon'],
    style: {
      verticalAlign: 'text-top'
    }
  }), intl.get('hmde.bo.flow.title.flowVar').d('流程变量')), nodeCode && (nodeCode === null || nodeCode === void 0 ? void 0 : nodeCode.startsWith('CONDITION')) && /*#__PURE__*/React.createElement(ConditionList, {
    nodeData: eventFlowStore.getEventFlowNode(nodeCode),
    dataSet: conditionDS,
    handleChange: (key, value) => {
      eventFlowStore.setNodeData(nodeCode, key, value);
      if (key === 'nodeName' && value) {
        selectedNode.attrs = {
          ...selectedNode.attrs,
          label: {
            text: value
          }
        };
        selectedNode.resize(Math.max(pxWidth(value, {
          fontSize: '14px',
          fontFamily: 'Arial, helvetica, sans-serif'
        }) + 72, 100), 60);
      }
    },
    openConditionModal: openConditionModal
  }), nodeCode && (nodeCode === null || nodeCode === void 0 ? void 0 : nodeCode.startsWith('EDGE')) && /*#__PURE__*/React.createElement(ConditionEdge, {
    edge: ((_graph$current5 = graph.current) === null || _graph$current5 === void 0 ? void 0 : _graph$current5.getCellById(nodeCode === null || nodeCode === void 0 ? void 0 : nodeCode.slice(5))) || null,
    nodeCode: nodeCode
  }), nodeCode === 'FLOW_VAR' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FlowVarList, {
    dataSet: flowVarDS,
    businessObjectCode: businessObjectCode
  })), nodeCode && !(nodeCode !== null && nodeCode !== void 0 && nodeCode.startsWith('CONDITION')) && !(nodeCode !== null && nodeCode !== void 0 && nodeCode.startsWith('EDGE')) && nodeCode !== 'FLOW_VAR' && /*#__PURE__*/React.createElement(Node, {
    nodeCode: nodeCode,
    businessObjectCode: businessObjectCode,
    selectedNode: selectedNode
  }), !nodeCode && /*#__PURE__*/React.createElement("div", {
    className: styles['empty-panel']
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "emptyState.png",
    size: 140,
    style: {
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.text.Noattributes').d('暂无属性')), /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.text.viewtheattributes').d('请点击左侧节点查看属性'))))))));
});
const EventFlow = props => {
  return /*#__PURE__*/React.createElement(StoreProvider, props, /*#__PURE__*/React.createElement(Index, props));
};
export default formatterCollections({
  code: ['hmde.bo']
})(EventFlow);