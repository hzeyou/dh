import _isArray from "lodash/isArray";
import _cloneDeepWith from "lodash/cloneDeepWith";
import _isNumber from "lodash/isNumber";
import _isString from "lodash/isString";
import { FieldComponentType, AssociateType } from 'hzero-front-apaas/lib/constants/businessObject';
import { ReactNodeShape } from "hzero-front-hmde/lib/constants/x6";
import { LinkRelationType, NORMAL_SOURCE_EDGE_ATTR } from "../constants/edge";
import { ER_LINE_HEIGHT, ER_NODE_WIDTH, ER_PADDING, ER_TITLE_HEIGHT } from "../constants/graph";
import { RELATION_TYPE } from "../constants/port";
const ASSOCIATE_CONDITION_FLAG = 'ASSOCIATE_CONDITION_FLAG'; // 高级关系条件

/**
 * 格式化业务对象数据为ER 图数据
 */
export function formatBoDataToReactERGraph(boData, extraNodeData) {
  const businessObjects = boData.flatMap(item => item.businessObjectList);
  const nodesData = [];
  const edgesData = [];
  const generatePorts = (id, attrs) => {
    return {
      id,
      markup: [{
        tagName: 'rect',
        selector: 'portBody'
      }],
      args: {
        position: 'top'
      },
      attrs: {
        portBody: {
          width: ER_NODE_WIDTH,
          strokeWidth: 1,
          stroke: 'rgba(0,0,0,0)',
          fill: 'rgba(0,0,0,0)',
          magnet: true,
          transform: 'matrix(1,0,0,1,0,0)',
          ...attrs
        }
      },
      zIndex: -1
    };
  };
  const getEdgeLine = lineType => {
    switch (lineType) {
      // 关联关系
      case FieldComponentType.LINK_RELATION:
      case AssociateType.LINK:
        return {
          stroke: '#0840F8',
          strokeWidth: NORMAL_SOURCE_EDGE_ATTR.strokeWidth,
          targetMarker: 'classic',
          sourceMarker: {
            tagName: 'circle',
            fill: '#fff',
            stroke: '#0840F8',
            ...NORMAL_SOURCE_EDGE_ATTR.sourceMarker
          }
        };
      // 主从关系
      case FieldComponentType.MASTER_RELATION:
      case AssociateType.SLAVE_MASTER:
        return {
          stroke: '#F23A50',
          strokeWidth: NORMAL_SOURCE_EDGE_ATTR.strokeWidth,
          targetMarker: 'classic',
          sourceMarker: {
            tagName: 'circle',
            fill: '#fff',
            stroke: '#F23A50',
            ...NORMAL_SOURCE_EDGE_ATTR.sourceMarker
          }
        };
      case ASSOCIATE_CONDITION_FLAG:
        return {
          stroke: 'rgba(0,0,0,0.45)',
          strokeWidth: NORMAL_SOURCE_EDGE_ATTR.strokeWidth,
          targetMarker: 'classic',
          sourceMarker: {
            tagName: 'circle',
            fill: '#fff',
            stroke: 'rgba(0,0,0,0.45)',
            ...NORMAL_SOURCE_EDGE_ATTR.sourceMarker
          }
        };
      default:
        return {};
    }
  };
  const getEdgeLabels = lineType => {
    return [{
      attrs: {
        label: {
          text: getLinkRelation(lineType),
          fill: 'rgba(0,0,0,0.65)'
        }
      }
    }];
  };
  businessObjects === null || businessObjects === void 0 ? void 0 : businessObjects.forEach(item => {
    var _item$businessObjectA, _item$businessObjectA2;
    const domainData = boData.find(domain => domain.domainId === item.domainId);
    const _ref = domainData || {},
      domainCode = _ref.domainCode,
      flexFieldEnabledFlag = _ref.flexFieldEnabledFlag,
      extendTableEnabledFlag = _ref.extendTableEnabledFlag;
    const node = {
      id: item.businessObjectId,
      shape: ReactNodeShape.ER_NODE,
      component: ReactNodeShape.ER_NODE,
      width: ER_NODE_WIDTH,
      height: getNodeHeight(item, extraNodeData.isShowNonRelationalFields),
      data: {
        ...item,
        ...extraNodeData,
        domainCode,
        flexFieldEnabledFlag,
        extendTableEnabledFlag
      }
    };
    // 设置连接桩
    const ports = [];
    // 设置标题连接桩
    ports.push(generatePorts(item.businessObjectId, {
      height: ER_LINE_HEIGHT,
      refY: 2
    }));
    // 设置业务对象字段连接桩
    item.businessObjectFields.forEach((field, index) => {
      if (RELATION_TYPE.includes(field.componentType)) {
        ports.push(generatePorts(field.businessObjectFieldId, {
          height: ER_LINE_HEIGHT,
          refY: getPortRefY(index)
        }));
      }
    });
    // 设置高级关系连接桩
    (_item$businessObjectA = item.businessObjectAssociateList) === null || _item$businessObjectA === void 0 ? void 0 : _item$businessObjectA.forEach((associate, index) => {
      ports.push(generatePorts(associate.businessObjectAssociateId, {
        height: ER_LINE_HEIGHT,
        refY: getPortRefY(item.businessObjectFields.length + index)
      }));
    });
    node.ports = ports;
    // 设置普通字段箭头
    item.businessObjectFields.forEach(field => {
      if (field.linkRelationType) {
        const edge = {
          shape: 'edge',
          source: {
            cell: item.businessObjectId,
            port: field.businessObjectFieldId
          },
          target: {
            cell: field.masterBusinessObjectId,
            port: field.masterBusinessObjectId
          },
          attrs: {
            line: getEdgeLine(field.componentType)
          },
          labels: getEdgeLabels(field.linkRelationType)
        };
        edgesData.push(edge);
      }
    });
    // 设置高级关系箭头
    (_item$businessObjectA2 = item.businessObjectAssociateList) === null || _item$businessObjectA2 === void 0 ? void 0 : _item$businessObjectA2.forEach(associate => {
      const edge = {
        shape: 'edge',
        source: {
          cell: item.businessObjectId,
          port: associate.businessObjectAssociateId
        },
        target: {
          cell: associate.associateBusinessObjectId,
          port: associate.associateBusinessObjectId
        },
        attrs: {
          line: getEdgeLine(associate.preConditionFlag ? ASSOCIATE_CONDITION_FLAG : associate.associateType)
        },
        labels: getEdgeLabels(associate.linkRelationType)
      };
      edgesData.push(edge);
    });
    nodesData.push(node);
  });
  // 过滤掉两边有一边不存在的箭头
  for (let i = 0; i < edgesData.length; i++) {
    var _nodesData$find;
    const edge = edgesData[i];
    const _edge$target = edge.target,
      cell = _edge$target.cell,
      port = _edge$target.port;
    if (nodesData.findIndex(item => item.id === cell) === -1) {
      edgesData.splice(i, 1);
      i--;
    }
    if (((_nodesData$find = nodesData.find(item => item.id === cell)) === null || _nodesData$find === void 0 ? void 0 : _nodesData$find.ports.findIndex(item => item.id === port)) === -1) {
      edgesData.splice(i, 1);
      i--;
    }
  }
  return nodesData.concat(edgesData);
}
export function getLinkRelation(type) {
  switch (type) {
    case LinkRelationType.ONE_TO_MANY:
      return '1:N';
    case LinkRelationType.ONE_TO_ONE:
      return '1:1';
    default:
      return '';
  }
}
export function getNodeHeight(data, isShowNonRelationalFields) {
  var _data$businessObjectA;
  const padding = ER_PADDING * 2;
  const businessObjectFieldsLength = data.businessObjectFields.filter(field => {
    if (isShowNonRelationalFields) {
      return true;
    } else {
      return RELATION_TYPE.includes(field.componentType);
    }
  }).length;
  let height = padding + ER_TITLE_HEIGHT + (businessObjectFieldsLength + (data.businessObjectAssociateList || []).length) * ER_LINE_HEIGHT;
  if ((_data$businessObjectA = data.businessObjectAssociateList) !== null && _data$businessObjectA !== void 0 && _data$businessObjectA.length) {
    height += 1;
  }
  return height;
}

/**
 * 可选的领域
 */
export function getDomainOptional(data) {
  return data.map(v => ({
    domainId: v.domainId,
    domainName: v.domainName,
    domainCode: v.domainCode
  }));
}

/**
 * 计算连接桩 y 轴方向偏移值
 * @param index
 */
export function getPortRefY(index) {
  return ER_TITLE_HEIGHT + ER_PADDING + ER_LINE_HEIGHT * index;
}

/**
 * 把数据中以 id 或 Id 为结尾的数据，值为数字的转换为字符串（针对主键加密场景临时处理）
 * @param data
 * @param keys
 */
export function transformIdFields(data, keys) {
  return _cloneDeepWith(data, (value, key) => {
    // 检查键名是否以 'id' 或 'Id' 结尾
    if (_isString(key) && (key.endsWith('id') || key.endsWith('Id')) && _isNumber(value)) {
      if (_isArray(keys) && keys !== null && keys !== void 0 && keys.length) {
        return keys.includes(key) ? String(value) : value;
      }
      return String(value);
    }
  });
}