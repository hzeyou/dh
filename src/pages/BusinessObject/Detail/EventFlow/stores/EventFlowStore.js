import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _difference from "lodash/difference";
import _compact from "lodash/compact";
import React, { createContext, useState, useMemo } from 'react';
import { getCurrentOrganizationId } from 'utils/utils';
import { useLocalStore } from 'mobx-react-lite';
import { toJS } from 'mobx';
import qs from 'querystring';
import uuid from 'uuid/v4';
import intl from 'utils/intl';
import { ConditionMode } from "hzero-front-apaas/lib/constants/businessObject";
import { flowVarDs } from "./FlowVarDS";
const Store = /*#__PURE__*/createContext(undefined);
export default Store;
const StoreProvider = props => {
  var _search$split;
  const _props$match$params = props.match.params,
    flowId = _props$match$params.id,
    flowCode = _props$match$params.code,
    _props$location$searc = props.location.search,
    search = _props$location$searc === void 0 ? '' : _props$location$searc,
    children = props.children;
  const _qs$parse = qs.parse((search === null || search === void 0 ? void 0 : (_search$split = search.split('?')) === null || _search$split === void 0 ? void 0 : _search$split[1]) || {}),
    businessObjectCode = _qs$parse.businessObjectCode,
    businessObjectId = _qs$parse.businessObjectId;
  const tenantId = getCurrentOrganizationId();
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isLoading = _useState2[0],
    setIsLoading = _useState2[1];
  const flowVarDS = useMemo(() => new _DataSet({
    ...flowVarDs(),
    events: {
      update: ({
        name,
        record
      }) => {
        if (name === 'sourceType') {
          record === null || record === void 0 ? void 0 : record.set('flowVarValue', undefined);
        }
      },
      validate: async ({
        dataSet,
        result
      }) => {
        if (await result) {
          eventFlowStore.currentEventFlow.eventFlowVars = dataSet.toJSONData();
        }
      }
    }
  }), []);

  // 事件流数据存储 Store
  const eventFlowStore = useLocalStore(() => ({
    currentEventFlow: {
      flowId,
      flowCode,
      businessObjectCode: '',
      eventFlowNodes: new Map([]),
      eventFlowVars: [],
      displayJson: '',
      eventFlowConditions: new Map([])
    },
    nodeDataVars: new Map([]),
    nodeFlowVars: new Map([]),
    nodeWorkFlowVars: new Map([]),
    cellsMap: new Map(),
    activeCard: {
      current: null
    },
    // 上次卡片的DS
    previousDS: {
      current: null
    },
    nodeDS: {
      current: null
    },
    setEditFn: {
      current: null
    },
    // 更新当前事件流的数据
    updateCurrentEventFlow(data) {
      eventFlowStore.currentEventFlow = {
        ...data
      };
    },
    loadData(data) {
      // 加载当前事件流数据
      const eventFlowNodesMap = new Map();
      if (data.eventFlowNodes) {
        data.eventFlowNodes.forEach(item => {
          var _item$attributeJson, _item$attributeJson2, _item$attributeJson3;
          const nodeData = {
            ...item
          };
          // 条件节点行数据当前对象字段由后端钻取格式转为字段编码格式
          if (nodeData.nodeType === 'CONDITION') {
            nodeData.conditions = nodeData.conditions.map(condition => ({
              ...condition,
              conditionLines: (condition.conditionLines || []).map(line => {
                let _ref = line || {},
                  leftValue = _ref.leftValue,
                  rightValue = _ref.rightValue;
                if (line.leftValueType === 'CURRENT_FIELD') {
                  const reg = new RegExp('(?<=CASCADE\\(\\w*\\.).*\\w*(?=\\))');
                  if (reg.test(leftValue)) {
                    var _leftValue$match;
                    leftValue = (_leftValue$match = leftValue.match(reg)) === null || _leftValue$match === void 0 ? void 0 : _leftValue$match[0];
                  }
                  if (line.rightValueType === 'CURRENT_FIELD' && reg.test(rightValue)) {
                    var _rightValue$match;
                    rightValue = (_rightValue$match = rightValue.match(reg)) === null || _rightValue$match === void 0 ? void 0 : _rightValue$match[0];
                  }
                }
                return {
                  ...line,
                  leftValue,
                  rightValue
                };
              })
            }));
          }
          eventFlowNodesMap.set(item.nodeCode, nodeData);
          eventFlowStore.nodeDataVars.set(item.nodeCode, item === null || item === void 0 ? void 0 : (_item$attributeJson = item.attributeJson) === null || _item$attributeJson === void 0 ? void 0 : _item$attributeJson.dataVarList);
          eventFlowStore.nodeFlowVars.set(item.nodeCode, item === null || item === void 0 ? void 0 : (_item$attributeJson2 = item.attributeJson) === null || _item$attributeJson2 === void 0 ? void 0 : _item$attributeJson2.flowVarList);
          eventFlowStore.nodeWorkFlowVars.set(item.nodeCode, item === null || item === void 0 ? void 0 : (_item$attributeJson3 = item.attributeJson) === null || _item$attributeJson3 === void 0 ? void 0 : _item$attributeJson3.workFlowVarList);
        });
      }
      if (data.eventFlowVars) {
        flowVarDS.loadData([...data.eventFlowVars]);
        // data.eventFlowVars.forEach((item) => {
        //   eventFlowStore.nodeFlowVars.set(item.nodeCode, item.flowVarList);
        // });
      }
      const eventFlowConditionsMap = new Map();
      if (data.eventFlowConditions) {
        data.eventFlowConditions.forEach(item => {
          eventFlowConditionsMap.set(item.nodeCode, item);
        });
      }
      eventFlowStore.currentEventFlow = {
        ...data,
        eventFlowNodes: eventFlowNodesMap,
        eventFlowVars: data.eventFlowVars,
        eventFlowConditions: eventFlowConditionsMap
      };
    },
    setEventFlowNode(nodeCode, data) {
      if (eventFlowStore.currentEventFlow.eventFlowNodes) {
        eventFlowStore.currentEventFlow.eventFlowNodes.set(nodeCode, data);
      } else {
        eventFlowStore.currentEventFlow.eventFlowNodes = new Map();
        eventFlowStore.currentEventFlow.eventFlowNodes.set(nodeCode, data);
      }
    },
    getEventFlowNode(nodeCode) {
      var _eventFlowStore$curre, _eventFlowStore$curre2;
      return toJS(eventFlowStore === null || eventFlowStore === void 0 ? void 0 : (_eventFlowStore$curre = eventFlowStore.currentEventFlow) === null || _eventFlowStore$curre === void 0 ? void 0 : (_eventFlowStore$curre2 = _eventFlowStore$curre.eventFlowNodes) === null || _eventFlowStore$curre2 === void 0 ? void 0 : _eventFlowStore$curre2.get(nodeCode)) || '';
    },
    deleteEventFlowNode(nodeCode) {
      var _eventFlowStore$curre3, _eventFlowStore$curre4;
      if (eventFlowStore !== null && eventFlowStore !== void 0 && (_eventFlowStore$curre3 = eventFlowStore.currentEventFlow) !== null && _eventFlowStore$curre3 !== void 0 && (_eventFlowStore$curre4 = _eventFlowStore$curre3.eventFlowNodes) !== null && _eventFlowStore$curre4 !== void 0 && _eventFlowStore$curre4.delete) {
        eventFlowStore.currentEventFlow.eventFlowNodes.delete(nodeCode);
      }
    },
    get cells() {
      var _eventFlowStore$curre5, _eventFlowStore$curre6;
      return (eventFlowStore === null || eventFlowStore === void 0 ? void 0 : (_eventFlowStore$curre5 = eventFlowStore.currentEventFlow) === null || _eventFlowStore$curre5 === void 0 ? void 0 : (_eventFlowStore$curre6 = _eventFlowStore$curre5.displayJson) === null || _eventFlowStore$curre6 === void 0 ? void 0 : _eventFlowStore$curre6.cells) || [];
    },
    // 构建保存入参
    getCurrentEventFlow() {
      // 根据当前节点筛选，删除掉已经删除的元素
      const nodeCodes = eventFlowStore.cells.map(item => item.nodeCode) || [];
      const storeNodeCodes = [...(eventFlowStore.currentEventFlow.eventFlowNodes.keys() || [])];
      const array = _difference(storeNodeCodes, nodeCodes);
      array.forEach(item => {
        eventFlowStore.deleteEventFlowNode(item);
        eventFlowStore.deleteNodeDataVars(item);
        eventFlowStore.deleteNodeFlowVars(item);
      });
      const eventFlowNodes = _compact([...toJS(eventFlowStore.currentEventFlow.eventFlowNodes.values())]);
      eventFlowNodes.forEach(item => {
        const nodeDataVars = eventFlowStore.nodeDataVars.get(item === null || item === void 0 ? void 0 : item.nodeCode);
        if (nodeDataVars) {
          if (!item.attributeJson) {
            item.attributeJson = {}; // eslint-disable-line
          }
          item.attributeJson.dataVarList = nodeDataVars; // eslint-disable-line
        }
        const nodeFlowVars = eventFlowStore.nodeFlowVars.get(item === null || item === void 0 ? void 0 : item.nodeCode);
        if (nodeFlowVars) {
          if (!item.attributeJson) {
            item.attributeJson = {}; // eslint-disable-line
          }
          item.attributeJson.flowVarList = nodeFlowVars; // eslint-disable-line
        }
        const nodeWorkFlowVars = eventFlowStore.nodeWorkFlowVars.get(item === null || item === void 0 ? void 0 : item.nodeCode);
        if (nodeWorkFlowVars) {
          if (!item.attributeJson) {
            item.attributeJson = {}; // eslint-disable-line
          }
          item.attributeJson.workFlowVarList = nodeWorkFlowVars; // eslint-disable-line
        }
        const childrenNodeCode = [];
        eventFlowStore.cells.filter(i => i.shape === 'edge').forEach(i => {
          // 先通过nodeCode找到那条数据，再通过id找到下级节点
          const currentCell = eventFlowStore.cells.find(c => c.nodeCode === item.nodeCode);
          if (currentCell && currentCell.id === i.source.cell) {
            const _nodeCode = eventFlowStore.cellsMap.get(i.target.cell).nodeCode;
            if (eventFlowStore.cellsMap.get(i.target.cell).nodeCode) {
              childrenNodeCode.push(_nodeCode);
            }
          }
        });
        item.childrenNodeCode = childrenNodeCode.join(','); // eslint-disable-line
      });
      return {
        ...eventFlowStore.currentEventFlow,
        eventFlowNodes,
        eventFlowVars: _compact([...toJS(eventFlowStore.currentEventFlow.eventFlowVars)]),
        eventFlowConditions: [...toJS(eventFlowStore.currentEventFlow.eventFlowConditions.values())]
      };
    },
    setDisplayJson(data) {
      data.cells.forEach(item => {
        if (item.nodeName) {
          var _item$attrs, _item$attrs$label;
          item.nodeName = item === null || item === void 0 ? void 0 : (_item$attrs = item.attrs) === null || _item$attrs === void 0 ? void 0 : (_item$attrs$label = _item$attrs.label) === null || _item$attrs$label === void 0 ? void 0 : _item$attrs$label.text; // eslint-disable-line
        }
        eventFlowStore.cellsMap.set(item.id, item);
      });
      eventFlowStore.currentEventFlow.displayJson = data;
    },
    setNodeDataVars(nodeCode, data) {
      if (eventFlowStore.nodeDataVars) {
        eventFlowStore.nodeDataVars.set(nodeCode, data);
      } else {
        eventFlowStore.nodeDataVars = new Map();
        eventFlowStore.nodeDataVars.set(nodeCode, data);
      }
    },
    getNodeDataVars(nodeCode) {
      var _eventFlowStore$nodeD;
      return eventFlowStore === null || eventFlowStore === void 0 ? void 0 : (_eventFlowStore$nodeD = eventFlowStore.nodeDataVars) === null || _eventFlowStore$nodeD === void 0 ? void 0 : _eventFlowStore$nodeD.get(nodeCode);
    },
    deleteNodeDataVars(nodeCode) {
      var _eventFlowStore$nodeD2;
      return eventFlowStore === null || eventFlowStore === void 0 ? void 0 : (_eventFlowStore$nodeD2 = eventFlowStore.nodeDataVars) === null || _eventFlowStore$nodeD2 === void 0 ? void 0 : _eventFlowStore$nodeD2.delete(nodeCode);
    },
    setNodeFlowVars(nodeCode, data) {
      if (eventFlowStore.nodeFlowVars) {
        eventFlowStore.nodeFlowVars.set(nodeCode, data);
      } else {
        eventFlowStore.nodeFlowVars = new Map();
        eventFlowStore.nodeFlowVars.set(nodeCode, data);
      }
    },
    getNodeFlowVars(nodeCode) {
      var _eventFlowStore$nodeF;
      return eventFlowStore === null || eventFlowStore === void 0 ? void 0 : (_eventFlowStore$nodeF = eventFlowStore.nodeFlowVars) === null || _eventFlowStore$nodeF === void 0 ? void 0 : _eventFlowStore$nodeF.get(nodeCode);
    },
    deleteNodeFlowVars(nodeCode) {
      var _eventFlowStore$nodeD3;
      return eventFlowStore === null || eventFlowStore === void 0 ? void 0 : (_eventFlowStore$nodeD3 = eventFlowStore.nodeDataVars) === null || _eventFlowStore$nodeD3 === void 0 ? void 0 : _eventFlowStore$nodeD3.delete(nodeCode);
    },
    setNodeWorkFlowVars(nodeCode, data) {
      if (eventFlowStore.nodeWorkFlowVars) {
        eventFlowStore.nodeWorkFlowVars.set(nodeCode, data);
      } else {
        eventFlowStore.nodeWorkFlowVars = new Map();
        eventFlowStore.nodeWorkFlowVars.set(nodeCode, data);
      }
    },
    getNodeWorkFlowVars(nodeCode) {
      var _eventFlowStore$nodeW;
      return eventFlowStore === null || eventFlowStore === void 0 ? void 0 : (_eventFlowStore$nodeW = eventFlowStore.nodeWorkFlowVars) === null || _eventFlowStore$nodeW === void 0 ? void 0 : _eventFlowStore$nodeW.get(nodeCode);
    },
    get flowVars() {
      return flowVarDS.toData().slice();
    },
    addNode(node) {
      const nodeData = {
        flowCode,
        nodeCode: node.nodeCode,
        nodeName: node.nodeName,
        nodeType: node.nodeType,
        enabledDrillFlag: false,
        tenantId,
        childrenNodeCode: '',
        attributeJson: {
          nodeType: node.nodeType,
          dataVarList: [],
          flowVarList: []
        }
      };
      if (node.nodeType === 'CONDITION') {
        Object.assign(nodeData, {
          conditions: [{
            conditionId: '',
            conditionCode: uuid(),
            conditionName: intl.get('hmde.bo.flow.defaultCondition').d('默认条件'),
            nodeCode: node.nodeCode,
            orderSeq: 1,
            conditionLineRelation: '',
            conditionMode: ConditionMode.simple,
            // conditionExpression: '',
            defaultFlag: true,
            tenantId,
            conditionLines: []
          }]
        });
        nodeData.nodeName = '条件';
        nodeData.attributeJson.childrenConditionList = [];
      }
      eventFlowStore.setEventFlowNode(node.nodeCode, nodeData);
    },
    setNodeData(nodeCode, key, value) {
      const nodeData = eventFlowStore.getEventFlowNode(nodeCode);
      if (nodeData) {
        eventFlowStore.currentEventFlow.eventFlowNodes.set(nodeCode, {
          ...nodeData,
          [key]: value
        });
      }
    }
  }));
  const value = {
    eventFlowStore,
    // graphDataStore,
    businessObjectCode,
    businessObjectId,
    isLoading,
    setIsLoading,
    flowVarDS,
    ...props
  };
  return /*#__PURE__*/React.createElement(Store.Provider, {
    value: value
  }, children);
};
export { StoreProvider };