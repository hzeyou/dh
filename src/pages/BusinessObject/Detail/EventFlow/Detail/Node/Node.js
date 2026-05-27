import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useContext, useMemo, useEffect, useState } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { LabelLayout } from 'choerodon-ui/pro/lib/form/enum';
import { pxWidth } from "hzero-front-apaas/lib/utils/common";
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import { getWorkFlowFields } from "hzero-front-hmde/lib/services/eventFlowService";
import { getBusinessObjectFieldListByCode } from "hzero-front-hmde/lib/services/businessObjectService";
import { fieldsMap, fieldsObjMap, nodes } from "./config";
import Store from "../../stores/EventFlowStore";
import styles from "../../index.less?modules";
const Index = props => {
  const _useContext = useContext(Store),
    eventFlowStore = _useContext.eventFlowStore;
  const previousDS = eventFlowStore.previousDS,
    setEditFn = eventFlowStore.setEditFn,
    activeCard = eventFlowStore.activeCard,
    nodeDS = eventFlowStore.nodeDS;
  const nodeCode = props.nodeCode,
    selectedNode = props.selectedNode,
    businessObjectCode = props.businessObjectCode;
  const flowCode = eventFlowStore.currentEventFlow.flowCode;
  const currentNodeData = eventFlowStore.getEventFlowNode(nodeCode) || {};
  const node = nodes.find(item => nodeCode.indexOf(item === null || item === void 0 ? void 0 : item.nodeCode) !== -1) || '';
  const _useState = useState(0),
    _useState2 = _slicedToArray(_useState, 2),
    updateFlag = _useState2[0],
    setUpdateFlag = _useState2[1];
  const fieldsArray = fieldsMap.get(node === null || node === void 0 ? void 0 : node.nodeCode) || [];
  const fields = fieldsArray.map(item => fieldsObjMap.get(item));
  fields.forEach(item => {
    if (item.name === 'businessKey') {
      // eslint-disable-next-line
      item.computedProps = {
        textField: () => 'businessObjectFieldName',
        valueField: () => 'businessObjectFieldCode',
        lookupAxiosConfig: () => ({
          url: `${lowcodeOrganizationURL({
            route: HZERO_HMDE
          })}/business-object-fields/list-by-code`,
          method: 'GET',
          params: {
            businessObjectCodeList: businessObjectCode,
            primaryKeyFlag: true
          }
        })
      };
    }
  });
  // 处理节点上attributeJson数据的回写，与store设置
  const handleAttributeJsonFields = record => {
    const attributeJsonFields = fields.filter(item => item.name === 'transactionFlow' || item.name === 'transactionFlowCode' || item.name === 'transactionFlowName' || item.name === 'workFlow' || item.name === 'workFlowCode' || item.name === 'workFlowName' || item.name === 'businessKey');
    const _record = record.toData();
    if (_record.attributeJson) {
      attributeJsonFields.forEach(item => {
        if (item.type !== 'object') {
          _record.attributeJson[item.name] = _record[item.name];
        }
      });
    } else {
      _record.attributeJson = {};
      attributeJsonFields.forEach(item => {
        if (item.type !== 'object') {
          _record.attributeJson[item.name] = _record[item.name];
        }
      });
    }
    attributeJsonFields.forEach(item => {
      delete _record[item.name];
    });
    return _record;
  };
  const dataSet = useMemo(() => {
    var _currentNodeData$attr, _currentNodeData$attr2, _currentNodeData$attr3, _currentNodeData$attr4, _currentNodeData$attr5;
    const ds = new _DataSet({
      autoCreate: true,
      fields,
      forceValidate: true,
      events: {
        update: ({
          name,
          record,
          value
        }) => {
          if (nodeCode) {
            eventFlowStore.setEventFlowNode(nodeCode, handleAttributeJsonFields(record));
          }
          if (name === 'nodeName') {
            selectedNode.attrs = {
              ...selectedNode.attrs,
              label: {
                text: value
              }
            };
            selectedNode.resize(Math.max(pxWidth(value, {
              fontFamily: 'Arial, helvetica, sans-serif'
            }) + 40, 100), 40);
          }
          if (name === 'workFlow') {
            if (value !== null && value !== void 0 && value.flowId) {
              // 选择了工作流
              getWorkFlowFields({
                flowId: value === null || value === void 0 ? void 0 : value.flowId
              }).then(res => {
                const _data = [];
                (res.processVariables || []).forEach(item => {
                  _data.push({
                    workFlowVarName: item === null || item === void 0 ? void 0 : item.variableName,
                    workFlowVarCode: item === null || item === void 0 ? void 0 : item.variableCode,
                    workFlowVarSource: 'FIXED_VALUE',
                    workFlowVarValue: null
                  });
                });
                eventFlowStore.setNodeWorkFlowVars(nodeCode, _data);
                setUpdateFlag(new Date().getTime());
              });
            }
          }
        },
        load: ({
          dataSet: _dataSet
        }) => {
          if (nodeCode) {
            eventFlowStore.setEventFlowNode(nodeCode, handleAttributeJsonFields(_dataSet.current));
            // 发起工作流节点，业务主键默认为业务对象的主键
            if ((nodeCode.startsWith('SWF') || nodeCode.startsWith('RWF')) && !_dataSet.current.get('businessKey')) {
              getBusinessObjectFieldListByCode(businessObjectCode, true).then(res => {
                if (res && Array.isArray(res)) {
                  var _res$find;
                  _dataSet.current.set('businessKey', (_res$find = res.find(item => item.primaryKeyFlag)) === null || _res$find === void 0 ? void 0 : _res$find.businessObjectFieldCode);
                }
              });
            }
          }
        }
      },
      data: [{
        ...currentNodeData,
        nodeCode,
        nodeType: node === null || node === void 0 ? void 0 : node.nodeType,
        flowCode,
        transactionFlowCode: currentNodeData === null || currentNodeData === void 0 ? void 0 : (_currentNodeData$attr = currentNodeData.attributeJson) === null || _currentNodeData$attr === void 0 ? void 0 : _currentNodeData$attr.transactionFlowCode,
        transactionFlowName: currentNodeData === null || currentNodeData === void 0 ? void 0 : (_currentNodeData$attr2 = currentNodeData.attributeJson) === null || _currentNodeData$attr2 === void 0 ? void 0 : _currentNodeData$attr2.transactionFlowName,
        workFlowCode: currentNodeData === null || currentNodeData === void 0 ? void 0 : (_currentNodeData$attr3 = currentNodeData.attributeJson) === null || _currentNodeData$attr3 === void 0 ? void 0 : _currentNodeData$attr3.workFlowCode,
        workFlowName: currentNodeData === null || currentNodeData === void 0 ? void 0 : (_currentNodeData$attr4 = currentNodeData.attributeJson) === null || _currentNodeData$attr4 === void 0 ? void 0 : _currentNodeData$attr4.workFlowName,
        businessKey: currentNodeData === null || currentNodeData === void 0 ? void 0 : (_currentNodeData$attr5 = currentNodeData.attributeJson) === null || _currentNodeData$attr5 === void 0 ? void 0 : _currentNodeData$attr5.businessKey
      }]
    });
    return ds;
  }, [nodeCode, selectedNode]);

  // 初始化，给nodeDS赋值
  useEffect(() => {
    nodeDS.current = dataSet;
    return () => {
      nodeDS.current = null;
    };
  }, [dataSet]);

  // 初始化给root元素增加点击事件
  useEffect(() => {
    var _document;
    const root = (_document = document) === null || _document === void 0 ? void 0 : _document.getElementById('root');
    const fn = e => {
      if (previousDS.current) {
        if (e !== null && e !== void 0 && e._customFlag && (e === null || e === void 0 ? void 0 : e._customFlag) !== activeCard.current) {
          // 点击了其他卡片
          previousDS.current.validate().then(res => {
            if (res) {
              setEditFn.current(false);
            } else {
              e.stopPropagation();
            }
          });
        }
        // 点击了外部区域
        if (!(e !== null && e !== void 0 && e._customFlag)) {
          previousDS.current.validate().then(res => {
            if (res) {
              setEditFn.current(false);
            } else {
              e.stopPropagation();
            }
          });
        }
        // previousDS.current.validate().then((res) => {
        //   if (res) {
        //     // 点击了其他卡片
        //     if (e?._customFlag && e?._customFlag !== activeCard.current) {
        //       setEditFn.current(false);
        //     }
        //     // 点击了外部区域
        //     if (!e?._customFlag) {
        //       setEditFn.current(false);
        //     }
        //   }
        //   // 组件必填字段未填写
        //   if (!res) {
        //     // 点击的其他组件
        //     if (e?._customFlag && e?._customFlag !== activeCard.current) {
        //       e.stopPropagation();
        //     }
        //     // 点击组件之外的区域
        //     if (!e?._customFlag) {
        //       e.stopPropagation();
        //     }
        //   }
        // });
      }
    };
    // eslint-disable-next-line
    root === null || root === void 0 ? void 0 : root.addEventListener('click', fn);
    return () => {
      previousDS.current = null;
      setEditFn.current = null;
      activeCard.current = null;
      // eslint-disable-next-line
      root === null || root === void 0 ? void 0 : root.removeEventListener('click', fn);
    };
  }, []);
  return nodeCode && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    className: styles.header
  }, /*#__PURE__*/React.createElement("strong", null, intl.get('hmde.pd.processDefinition.nodeProp').d('节点属性')), /*#__PURE__*/React.createElement("div", {
    className: styles['node-name']
  }, node === null || node === void 0 ? void 0 : node.nodeName)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_Form, {
    dataSet: dataSet
    // onBlurCapture={() => onBlur(record)}
    ,
    labelLayout: "vertical"
    // useColon={false}
  }, fields.filter(item => item.name !== 'dataVarList' && item.name !== 'flowVarList' && item.name !== 'workFlowVarList').map(item => item.render && item.render())), fields.filter(item => item.name === 'dataVarList').map(item => item.render(nodeCode)), fields.filter(item => item.name === 'flowVarList').map(item => item.render(nodeCode)), fields.filter(item => item.name === 'workFlowVarList').map(item => item.render(nodeCode, updateFlag))));
};
export default formatterCollections({
  code: ['hmde.bo']
})(observer(Index));