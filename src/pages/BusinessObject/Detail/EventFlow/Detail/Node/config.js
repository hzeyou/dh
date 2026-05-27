import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _Lov from "@hzero-front-ui/c7n-ui/lib/LovPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import React from 'react';
import { FieldIgnore, FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { isTenantRoleLevel } from 'hzero-front/lib/utils/utils';
import intl from 'utils/intl';
import CREATEImg from "hzero-front-hmde/lib/assets/icon/xinzhen16.svg";
import DELETEImg from "hzero-front-hmde/lib/assets/icon/sancu16.svg";
import SAVEImg from "hzero-front-hmde/lib/assets/icon/xiugai16.svg";
import QUERYImg from "hzero-front-hmde/lib/assets/icon/chaxun16.svg";
// import VAImg from '@hmde/assets/icon/bianliang16.svg';
import CONDITIONImg from "hzero-front-hmde/lib/assets/icon/tiaojian16.svg";
import ENDImg from "hzero-front-hmde/lib/assets/icon/jiesu16.svg";
import RWFImg from "hzero-front-hmde/lib/assets/icon/chehui16.svg";
import SWFImg from "hzero-front-hmde/lib/assets/icon/faqi16.svg";
import TFImg from "hzero-front-hmde/lib/assets/icon/chuliliu16.svg";
import MODELER_CHECK_IMG from "hzero-front-hmde/lib/assets/icon/model-verification.svg";
import DataVarList from "../../components/DataVarList";
import FlowVarList from "../../components/FlowVarList";
import WorkFlowVarList from "../../components/WorkFlowVarList";
const nodes = [{
  id: 'node1',
  nodeName: intl.get('hmde.bo.text.addLine').d('新增行'),
  nodeCode: 'CREATE',
  category: 'DATA_OPERATE',
  nodeType: 'EVENT',
  icon: CREATEImg
}, {
  id: 'node2',
  nodeName: intl.get('hmde.pd.nodeClassification.delRecord').d('删除记录'),
  nodeCode: 'DELETE',
  category: 'DATA_OPERATE',
  nodeType: 'EVENT',
  icon: DELETEImg
}, {
  id: 'node3',
  nodeName: intl.get('hmde.bo.text.saverecord').d('保存记录'),
  nodeCode: 'SAVE',
  category: 'DATA_OPERATE',
  nodeType: 'EVENT',
  icon: SAVEImg
}, {
  id: 'node4',
  nodeName: intl.get('hmde.bo.text.queryrecord').d('查询记录'),
  nodeCode: 'QUERY',
  category: 'DATA_OPERATE',
  nodeType: 'EVENT',
  icon: QUERYImg
},
// {
//   id: 'node8',
//   nodeName: '变量赋值',
//   nodeCode: 'VA',
//   category: 'DATA_OPERATE',
//   nodeType: 'EVENT',
//   icon: VAImg,
// },
{
  nodeName: intl.get('hmde.bo.text.Initiateworkflow').d('发起工作流'),
  nodeCode: 'SWF',
  category: 'DATA_OPERATE',
  nodeType: 'EVENT',
  icon: SWFImg
}, {
  nodeName: intl.get('hmde.bo.text.Recallworkflow').d('撤回工作流'),
  nodeCode: 'RWF',
  category: 'DATA_OPERATE',
  nodeType: 'EVENT',
  icon: RWFImg
}, {
  nodeName: intl.get('hmde.common.eventFlow').d('事务处理流'),
  nodeCode: 'TF',
  category: 'DATA_OPERATE',
  nodeType: 'EVENT',
  icon: TFImg
}, {
  nodeName: intl.get('hmde.bo.text.modelchecking').d('模型校验'),
  nodeCode: 'MC',
  category: 'DATA_OPERATE',
  nodeType: 'EVENT',
  icon: MODELER_CHECK_IMG
}, {
  id: 'node5',
  nodeName: intl.get('hmde.bo.businessObject.condition').d('条件'),
  nodeCode: 'CONDITION',
  category: 'FLOW_DEFINITION',
  nodeType: 'CONDITION',
  icon: CONDITIONImg
}, {
  id: 'node6',
  nodeName: intl.get('hmde.se.scriptEvent.text.end').d('结束'),
  nodeCode: 'END',
  category: 'FLOW_DEFINITION',
  nodeType: 'END',
  icon: ENDImg
}];
const regularNode = image => ({
  width: 100,
  height: 40,
  nodeCode: '',
  nodeName: '',
  nodeType: '',
  markup: [{
    tagName: 'rect',
    selector: 'body'
  }, {
    tagName: 'image',
    selector: 'image'
  }, {
    tagName: 'text',
    selector: 'label'
  }],
  attrs: {
    image: {
      x: 10,
      refY: '50%',
      refY2: -9,
      // yAlign: 'middle',
      width: 16,
      'xlink:href': image
    },
    label: {
      x: 10,
      cursor: 'pointer',
      text: 'Rect',
      fill: '#1C1C1C',
      fontSize: 12
    },
    body: {
      stroke: '#D9D9D9',
      strokeWidth: 1,
      cursor: 'pointer'
    }
  },
  ports: {
    groups: {
      top: {
        position: 'top'
      },
      bottom: {
        position: 'bottom'
      }
    },
    items: [{
      group: 'top',
      attrs: {
        circle: {
          r: 5,
          magnet: true,
          stroke: '#0840F8',
          strokeWidth: 1,
          fill: '#ffffff'
        }
      }
    }, {
      group: 'bottom',
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
});
const conditionNode = {
  width: 100,
  height: 60,
  nodeCode: '',
  nodeName: '',
  nodeType: 'CONDITION',
  shape: 'polygon',
  markup: [{
    tagName: 'polygon',
    selector: 'body'
  }, {
    tagName: 'image',
    selector: 'image'
  }, {
    tagName: 'text',
    selector: 'label'
  }],
  attrs: {
    image: {
      x: 24,
      refY: '50%',
      refY2: -9,
      // yAlign: 'middle',
      width: 16,
      xlinkHref: CONDITIONImg
    },
    label: {
      x: 10,
      cursor: 'pointer',
      text: 'Rect',
      fill: '#333435',
      fontSize: 14
    },
    body: {
      cursor: 'pointer',
      strokeWidth: 1,
      fill: '#ffffff',
      stroke: '#D9D9D9',
      // 指定 refPoints 属性，多边形顶点随图形大小自动缩放
      // https://x6.antv.vision/zh/docs/api/registry/attr#refpointsresetoffset
      refPoints: '0,10 10,0 20,10 10,20'
    }
  },
  ports: {
    groups: {
      left: {
        position: 'left'
      },
      bottom: {
        position: 'bottom'
      },
      right: {
        position: 'right'
      },
      top: {
        position: 'top'
      }
    },
    items: [{
      id: 'pints1',
      group: 'left',
      attrs: {
        circle: {
          r: 5,
          magnet: true,
          stroke: '#0840F8',
          strokeWidth: 1,
          fill: '#ffffff'
        }
      }
    }, {
      id: 'pints2',
      group: 'bottom',
      attrs: {
        circle: {
          r: 5,
          magnet: true,
          stroke: '#0840F8',
          strokeWidth: 1,
          fill: '#ffffff'
        }
      }
    }, {
      id: 'pints3',
      group: 'right',
      attrs: {
        circle: {
          r: 5,
          magnet: true,
          stroke: '#0840F8',
          strokeWidth: 1,
          fill: '#ffffff'
        }
      }
    }, {
      id: 'pints4',
      group: 'top',
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
};
const endNode = {
  nodeCode: '',
  nodeName: '',
  nodeType: '',
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
};
const fieldsMap = new Map([['CREATE', ['nodeName', 'nodeCode', 'nodeType', 'flowCode']], ['DELETE', ['nodeName', 'nodeCode', 'nodeType', 'flowCode']], ['SAVE', ['nodeName', 'nodeCode', 'nodeType', 'flowCode']], ['QUERY', ['nodeName', 'nodeCode', 'nodeType', 'flowCode']], ['VA', ['nodeName', 'nodeCode', 'nodeType', 'flowCode', 'dataVarList', 'flowVarList']], ['SWF', ['nodeName', 'nodeCode', 'nodeType', 'flowCode', 'workFlow', 'workFlowCode', 'workFlowName', 'businessKey', 'workFlowVarList']], ['RWF', ['nodeName', 'nodeCode', 'nodeType', 'flowCode', 'workFlow', 'workFlowCode', 'workFlowName', 'businessKey']], ['TF', ['nodeName', 'nodeCode', 'nodeType', 'flowCode', 'transactionFlow', 'transactionFlowCode', 'transactionFlowName']], ['MC', ['nodeName', 'nodeCode', 'nodeType', 'flowCode']], ['CONDITION', ['nodeName', 'nodeCode', 'nodeType', 'flowCode', 'enabledDrillFlag', 'conditionList']], ['END', []]]);
const fieldsObjMap = new Map([['nodeName', {
  name: 'nodeName',
  type: "string",
  label: intl.get('hmde.common.name').d('名称'),
  required: true,
  render: () => /*#__PURE__*/React.createElement(_TextField, {
    name: "nodeName"
  })
}], ['nodeCode', {
  name: 'nodeCode',
  type: "string",
  label: 'nodeCode',
  required: true
}], ['nodeType', {
  name: 'nodeType',
  type: "string",
  label: 'nodeType',
  required: true
}], ['flowCode', {
  name: 'flowCode',
  type: "string",
  label: 'flowCode',
  required: true
}], ['workFlow', {
  name: 'workFlow',
  type: "object",
  label: intl.get('hmde.bo.view.Workflow').d('工作流'),
  required: true,
  lovCode: isTenantRoleLevel() ? 'HLOD.WORK_FLOW_SELF' : 'HLOD.WORK_FLOW_SELF.SITE',
  ignore: "always",
  render: () => /*#__PURE__*/React.createElement(_Lov, {
    key: "workFlow",
    name: "workFlow"
  })
}], ['workFlowCode', {
  name: 'workFlowCode',
  type: "string",
  label: `${intl.get('hmde.bo.view.Workflow').d('工作流')}Code`,
  bind: 'workFlow.flowCode'
}], ['workFlowName', {
  name: 'workFlowName',
  type: "string",
  label: `${intl.get('hmde.bo.view.Workflow').d('工作流')}Name`,
  bind: 'workFlow.flowName'
}], ['businessKey', {
  name: 'businessKey',
  type: "string",
  label: intl.get('hmde.bo.businessObjectAudit.naturalkey').d('业务主键'),
  required: true,
  render: () => /*#__PURE__*/React.createElement(_Select, {
    name: "businessKey",
    key: "businessKey"
  })
}], ['dataVarList', {
  name: 'dataVarList',
  type: "object",
  render: nodeCode => /*#__PURE__*/React.createElement(DataVarList, {
    key: nodeCode,
    nodeCode: nodeCode
  })
}], ['flowVarList', {
  name: 'flowVarList',
  type: "object",
  render: nodeCode => /*#__PURE__*/React.createElement(FlowVarList, {
    key: nodeCode,
    nodeCode: nodeCode
  })
}], ['workFlowVarList', {
  name: 'workFlowVarList',
  type: "object",
  render: (nodeCode, updateFlag) => /*#__PURE__*/React.createElement(WorkFlowVarList, {
    key: nodeCode,
    nodeCode: nodeCode,
    updateFlag: updateFlag
  })
}], ['transactionFlow', {
  name: 'transactionFlow',
  type: "object",
  label: intl.get('hmde.common.eventFlow').d('事务处理流'),
  required: true,
  lovCode: 'HMDE.EVENT_TRANSACTION',
  computedProps: {
    lovPara: () => ({
      scriptTypeCode: 'FLOW'
    })
  },
  ignore: "always",
  render: () => /*#__PURE__*/React.createElement(_Lov, {
    key: "transactionFlow",
    name: "transactionFlow"
  })
}], ['transactionFlowCode', {
  name: 'transactionFlowCode',
  type: "string",
  label: `${intl.get('hmde.common.eventFlow').d('事务处理流')}Code`,
  bind: 'transactionFlow.scriptCode'
}], ['transactionFlowName', {
  name: 'transactionFlowName',
  type: "string",
  label: `${intl.get('hmde.common.eventFlow').d('事务处理流')}Name`,
  bind: 'transactionFlow.scriptName'
}]]);

// 每个节点的相关配置，用于渲染出相应的组件
export { nodes, regularNode, conditionNode, endNode, fieldsMap, fieldsObjMap };