import _isArray from "lodash/isArray";
import _intersection from "lodash/intersection";
import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { isResponse } from 'hzero-front-apaas/lib/utils/request';
import { usePrevious } from 'ahooks';
import { queryER } from "hzero-front-hmde/lib/services/businessObjectService";
import { executeERLayout } from "../../utils/graph";
import { formatBoDataToReactERGraph } from "../../utils/common";
import { CONTAINER_ID, MINI_MAP_ID } from "../../constants/graph";
import { NORMAL_SOURCE_EDGE_ATTR, SELECTED_SOURCE_EDGE_ATTR } from "../../constants/edge";
import { useERStore } from "../../stores";
import Legend from "../Legend";
import styles from "./index.less?modules";
import { ENCRYPT_FIELD } from "../../constants/common";
import { transformIdFields } from "../../utils/common";
const MainContainer = ({
  queryPublishBoProcess
}) => {
  const erStore = useERStore();
  const graph = erStore.getState('graph');
  const isShowMiniMap = erStore.getState('isShowMiniMap');
  const isShowLegend = erStore.getState('isShowLegend');
  const preSelectedBOIds = usePrevious(erStore.getState('selectedBOIds', true)) || [];
  const curNodeRef = useRef();
  const curEdgesRef = useRef([]);
  useEffect(() => {
    // 添加点击事件
    graph === null || graph === void 0 ? void 0 : graph.on('node:click', addNodeClickListener);
    // 点击空白区域事件
    graph === null || graph === void 0 ? void 0 : graph.on('blank:click', clearSelectedNode);
    // 按下删除按钮的时候,删除选中的节点
    graph === null || graph === void 0 ? void 0 : graph.bindKey(['backspace', 'delete'], deleteNode);
  }, [graph]);

  // 监听选中数据的变化
  useEffect(() => {
    // 判断是否为减少
    const selectedBOIds = erStore.getState('selectedBOIds', true);
    const selectedBOIdsIntersection = _intersection(selectedBOIds, preSelectedBOIds);
    let isDelete = false;
    if (selectedBOIds.length === selectedBOIdsIntersection.length && selectedBOIds.length < preSelectedBOIds.length) {
      isDelete = true;
    }
    updateGraphCells(isDelete);
  }, [erStore.getState('selectedBOIds')]);
  useEffect(() => {
    selectNode();
  }, [erStore.getState('selectedNodeId')]);
  function clearSelectedNode() {
    erStore.setState('selectedNodeId', '');
  }

  // 删除节点
  function deleteNode() {
    const selectedNodeId = erStore.getState('selectedNodeId');
    if (selectedNodeId) {
      const selectedBOIds = erStore.getState('selectedBOIds', true);
      selectedBOIds.splice(selectedBOIds.indexOf(selectedNodeId), 1);
      erStore.setState('selectedBOIds', selectedBOIds);
    }
  }

  // 选中一个节点
  function selectNode() {
    var _selectedNode$getData;
    const selectedNode = graph === null || graph === void 0 ? void 0 : graph.getCellById(erStore.getState('selectedNodeId'));
    const selectedNodeId = (selectedNode === null || selectedNode === void 0 ? void 0 : (_selectedNode$getData = selectedNode.getData()) === null || _selectedNode$getData === void 0 ? void 0 : _selectedNode$getData.businessObjectId) || '';

    // 还原上一个选中节点颜色
    if (curNodeRef.current) {
      var _curNodeRef$current;
      (_curNodeRef$current = curNodeRef.current) === null || _curNodeRef$current === void 0 ? void 0 : _curNodeRef$current.setData({
        ...curNodeRef.current.getData(),
        selectedNodeId
      });
    }
    // 还原边
    if (_isArray(curEdgesRef.current) && curEdgesRef.current.length > 0) {
      var _curEdgesRef$current;
      (_curEdgesRef$current = curEdgesRef.current) === null || _curEdgesRef$current === void 0 ? void 0 : _curEdgesRef$current.forEach(edge => {
        edge.attr('line/strokeWidth', NORMAL_SOURCE_EDGE_ATTR.strokeWidth);
        edge.attr('line/sourceMarker', {
          ...edge.getAttrs().line.sourceMarker,
          ...NORMAL_SOURCE_EDGE_ATTR.sourceMarker
        });
      });
    }
    if (selectedNode && graph) {
      // 设置选中状态
      selectedNode.toFront();
      selectedNode.setData({
        ...selectedNode.getData(),
        selectedNodeId
      });

      // 设置边宽度
      const edges = graph.getConnectedEdges(selectedNode);
      edges.forEach(edge => {
        edge.toFront();
        edge.attr('line/strokeWidth', SELECTED_SOURCE_EDGE_ATTR.strokeWidth);
        edge.attr('line/sourceMarker', {
          ...edge.getAttrs().line.sourceMarker,
          ...SELECTED_SOURCE_EDGE_ATTR.sourceMarker
        });
      });
      curNodeRef.current = selectedNode;
      curEdgesRef.current = edges;
    } else {
      curNodeRef.current = undefined;
      curEdgesRef.current = [];
    }
  }
  function updateSelectedNodeId(selectedIds) {
    erStore.setState('selectedBOIds', selectedIds);
  }

  // 更新画布数据
  function updateGraphCells(isDelete) {
    const ids = erStore.getState('selectedBOIds', true);
    const graphNodes = (graph === null || graph === void 0 ? void 0 : graph.getNodes()) || [];
    if (ids.length) {
      if (isDelete) {
        // 删除节点
        graphNodes.forEach(node => {
          const data = node.getData();
          if (data && ids.indexOf(data.businessObjectId) === -1) {
            graph === null || graph === void 0 ? void 0 : graph.removeCell(node);
          }
        });
        // 同步数据
        let res = erStore.getState('graphERData', true);
        res = res.map(item => {
          const businessObjectList = item.businessObjectList.filter(bo => ids.includes(bo.businessObjectId));
          return {
            ...item,
            businessObjectList
          };
        });
        erStore.setState('graphERData', res);
        return;
      }
      erStore.setState('isGraphLoading', true);
      return queryER(ids).then(async res => {
        if (graph && isResponse(res)) {
          // ⚠️兼容非主键加密的情况
          res = transformIdFields(res, ENCRYPT_FIELD);
          const graphData = formatBoDataToReactERGraph(res, {
            selectedNodeId: erStore.getState('selectedNodeId'),
            selectedBOIds: erStore.getState('selectedBOIds', true),
            isShowNonRelationalFields: true,
            updateGraphCells,
            updateSelectedNodeId,
            graph: erStore.getState('graph'),
            queryPublishBoProcess
          });
          const edges = [];
          const nodes = [];
          graphData.forEach(item => {
            if (item.shape === 'edge') {
              edges.push(item);
            } else {
              nodes.push({
                ...item
              });
            }
          });
          erStore.setState('graphERData', res);

          // 重新设置节点
          const cells = [];
          const graphNodeIds = graph.getNodes().map(item => item.id);
          let newNodeId = '';
          nodes.forEach(node => {
            if (graphNodeIds.indexOf(node.id) === -1) {
              // 新节点
              newNodeId = node.id;
              // 获取当前 graph 平移的位置, 添加节点到画布左上角(如果缩略图在展开,需要避开缩略图位置)
              const _clientToLocalPoint = graph.getPlugin('scroller').clientToLocalPoint(0, 0),
                x = _clientToLocalPoint.x,
                y = _clientToLocalPoint.y;
              let newX = isShowMiniMap ? x + 200 : x;
              let newY = isShowMiniMap ? y + 140 : y;
              // 当前画布上存在的节点的位置信息
              const curNodePositions = graph.getNodes().map(item => item.position());
              // cell 中已添加的节点位置信息
              const cellNodePositions = cells.map(cell => cell.position());
              const _nodePositions = `${[...curNodePositions, ...cellNodePositions].map(item => `${item.x},${item.y}`).join(';')};`;
              while (_nodePositions.indexOf(`${newX},${newY};`) !== -1) {
                newX += 20;
                newY += 20;
              }
              // eslint-disable-next-line no-param-reassign
              node.x = newX;
              // eslint-disable-next-line no-param-reassign
              node.y = newY;
              cells.push(graph.createNode(node));
            } else {
              // 旧节点
              const oldNode = graph.getCellById(node.id);
              cells.push(oldNode);
            }
          });
          edges.forEach(edge => {
            if (!graph.getCellById(edge.id)) {
              cells.push(graph.createEdge(edge));
            }
          });
          const oldGraphNodes = graph.getNodes();

          // 把节点和边设置到画布上
          graph.resetCells(cells);

          // 画布上没有内容,一次添加多个节点,使用自动布局
          if (oldGraphNodes.length < 1 && ids.length > 1) {
            await executeERLayout(graph);
          }

          // 如果是新的节点，放到画布层级最前面
          if (newNodeId) {
            const newNode = graph.getCellById(newNodeId);
            if (newNode) {
              newNode.toFront();
            }
          }
        }
      }).finally(() => {
        // 画布数据重置后重新选中节点
        selectNode();
        erStore.setState('isGraphLoading', false);
      });
    } else {
      // 清空画布
      graph === null || graph === void 0 ? void 0 : graph.resetCells([]);
      erStore.setState('graphERData', []);
    }
  }
  function addNodeClickListener({
    node
  }) {
    var _node$getData;
    if (!graph) return;
    erStore.setState('selectedNodeId', ((_node$getData = node.getData()) === null || _node$getData === void 0 ? void 0 : _node$getData.businessObjectId) || '');
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    id: CONTAINER_ID
  }), /*#__PURE__*/React.createElement("div", {
    id: MINI_MAP_ID,
    className: styles.mini,
    hidden: !isShowMiniMap
  }), /*#__PURE__*/React.createElement(Legend, {
    hidden: !isShowLegend
  }));
};
export default observer(MainContainer);