import _extends from "@babel/runtime/helpers/esm/extends";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _SelectBox from "@hzero-front-ui/c7n-ui/lib/SelectBoxPro";
import React from 'react';
import { DragDropContext, Droppable, Draggable

// DragginStyle,
} from 'react-beautiful-dnd';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
// import {  } from 'choerodon-ui';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import { getThemeColor } from "hzero-front-apaas/lib/utils/common";
import styles from "../index.less?modules";
const Option = _SelectBox.Option;
const Index = ({
  nodeData,
  dataSet,
  handleChange,
  openConditionModal
}) => {
  const _ref = getThemeColor() || {},
    primary = _ref.primary,
    step1 = _ref.step1,
    step5 = _ref.step5;
  const _ref2 = nodeData || {},
    _ref2$nodeName = _ref2.nodeName,
    nodeName = _ref2$nodeName === void 0 ? '' : _ref2$nodeName,
    _ref2$enabledDrillFla = _ref2.enabledDrillFlag,
    enabledDrillFlag = _ref2$enabledDrillFla === void 0 ? false : _ref2$enabledDrillFla;
  const handleChangeDrillFlag = (val, oldVal) => {
    if (!val && dataSet.some(record => !(record !== null && record !== void 0 && record.get('defaultFlag')))) {
      _Modal.confirm('清空条件').then(button => {
        if (button === 'ok') {
          var _dataSet$toData;
          handleChange('conditions', (_dataSet$toData = dataSet.toData()) === null || _dataSet$toData === void 0 ? void 0 : _dataSet$toData.map(item => ({
            ...item,
            conditionLines: [],
            conditionLineRelation: '',
            conditionExpression: ''
          })));
          openConditionModal(val);
        } else {
          return handleChange('enabledDrillFlag', oldVal);
        }
      });
    }
    handleChange('enabledDrillFlag', val);
  };
  const onDragEnd = async res => {
    if (!res.destination) {
      return;
    }
    const dragRecord = dataSet.findRecordById(res.draggableId);
    const sourceIndex = res.source.index;
    const targetIndex = res.destination.index;
    if (sourceIndex === targetIndex) {
      return;
    } else if (sourceIndex < targetIndex) {
      for (let i = sourceIndex + 1; i <= targetIndex; i++) {
        const record = dataSet.find(item => item.get('orderSeq') === i);
        if (record) record === null || record === void 0 ? void 0 : record.set('orderSeq', i - 1);
      }
    } else if (sourceIndex > targetIndex && dragRecord) {
      for (let i = sourceIndex - 1; i >= targetIndex; i--) {
        const record = dataSet.find(item => item.get('orderSeq') === i);
        if (record) record === null || record === void 0 ? void 0 : record.set('orderSeq', i + 1);
      }
    }
    if (dragRecord) dragRecord.set('orderSeq', targetIndex);
    if (await dataSet.validate()) {
      handleChange('conditions', dataSet.toData());
    }
  };
  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? '#fafafa' : 'transparent'
  });
  const getItemStyle = (isDragging, draggableStyle) => ({
    display: 'flex',
    alignItems: 'center',
    height: 28,
    useSelect: 'none',
    background: '#ffffff',
    color: '#000',
    boxShadow: isDragging ? `0 2px 4px 0 ${step5}80` : 'none',
    ...draggableStyle
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("strong", null, intl.get('hmde.pd.processDefinition.nodeProp').d('节点属性')), /*#__PURE__*/React.createElement("span", {
    style: {
      color: primary,
      background: step1
    }
  }, intl.get('hmde.bo.businessObject.condition').d('条件'))), /*#__PURE__*/React.createElement(_Form, {
    labelLayout: 'vertical',
    labelAlign: 'left'
    // useColon={false}
  }, /*#__PURE__*/React.createElement(_TextField, {
    label: intl.get('hmde.common.name').d('名称'),
    value: nodeName,
    required: true,
    style: {
      width: '100%'
    },
    onChange: val => handleChange('nodeName', val)
  }), /*#__PURE__*/React.createElement(_SelectBox, {
    label: /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.support.associatedobjects').d('是否支持关联对象'), /*#__PURE__*/React.createElement(_Tooltip, {
      theme: "light",
      title: "\u5F00\u542F\u540E\uFF0C\u6761\u4EF6\u6267\u884C\u6548\u7387\u4F1A\u964D\u4F4E\uFF0C\u8BF7\u6839\u636E\u9700\u6C42\u8BBE\u7F6E\u662F\u5426\u9700\u8981\u83B7\u53D6\u5173\u8054\u5BF9\u8C61\u5B57\u6BB5\u8FDB\u884C\u6761\u4EF6\u5224\u65AD"
    }, /*#__PURE__*/React.createElement(ImgIcon, {
      name: "help@v4.0.svg",
      size: 12,
      style: {
        marginLeft: 5,
        marginTop: -1,
        verticalAlign: 'middle'
      }
    }))),
    value: enabledDrillFlag,
    mode: 'button',
    className: styles.enabledDrillFlag,
    onChange: handleChangeDrillFlag
  }, /*#__PURE__*/React.createElement(Option, {
    value: true
  }, "\u662F"), /*#__PURE__*/React.createElement(Option, {
    value: false
  }, "\u5426"))), /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("strong", null, intl.get('hmde.bo.businessObject.condition').d('条件'))), /*#__PURE__*/React.createElement(_Button, {
    onClick: () => openConditionModal(enabledDrillFlag),
    style: {
      width: '100%',
      marginBottom: 12
    }
  }, intl.get('hmde.bo.businessObject.condition').d('条件')), /*#__PURE__*/React.createElement(DragDropContext, {
    onDragEnd: onDragEnd
  }, /*#__PURE__*/React.createElement(Droppable, {
    droppableId: "droppable"
  }, (provided, snapshot) => {
    var _dataSet$data, _dataSet$data$filter, _dataSet$data$filter$;
    return /*#__PURE__*/React.createElement("div", _extends({}, provided.droppableProps, {
      ref: provided.innerRef,
      style: {
        ...getListStyle(snapshot.isDraggingOver)
      }
    }), (_dataSet$data = dataSet.data) === null || _dataSet$data === void 0 ? void 0 : (_dataSet$data$filter = _dataSet$data.filter(record => !(record !== null && record !== void 0 && record.get('defaultFlag')))) === null || _dataSet$data$filter === void 0 ? void 0 : (_dataSet$data$filter$ = _dataSet$data$filter.sort((a, b) => a.get('orderSeq') - b.get('orderSeq'))) === null || _dataSet$data$filter$ === void 0 ? void 0 : _dataSet$data$filter$.map((record, index) => /*#__PURE__*/React.createElement(Draggable, {
      key: record.key,
      draggableId: String(record.id),
      index: record === null || record === void 0 ? void 0 : record.get('orderSeq')
    }, (provided1, snapshot1) => /*#__PURE__*/React.createElement("div", _extends({
      ref: provided1.innerRef
    }, provided1.draggableProps, provided1.dragHandleProps, {
      style: {
        ...getItemStyle(snapshot1.isDragging, provided1.draggableProps.style),
        animation: snapshot1.dropAnimation
      }
    }), /*#__PURE__*/React.createElement(ImgIcon, {
      name: "drag_indicator_black.svg",
      size: 14,
      style: {
        height: '100%'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 16,
        height: 16,
        lineHeight: '16px',
        textAlign: 'center',
        margin: '0 4px',
        color: primary,
        background: step1,
        borderRadius: 2
      }
    }, index + 1), /*#__PURE__*/React.createElement(_Output, {
      record: record,
      name: "conditionName",
      style: {
        flex: 1,
        marginLeft: 4
      }
    })))), provided.placeholder);
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...getItemStyle(false, {}),
      paddingLeft: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      lineHeight: '16px',
      textAlign: 'center',
      margin: '0 4px',
      color: primary,
      background: step1,
      borderRadius: 2
    }
  }, dataSet.length), /*#__PURE__*/React.createElement(_Output, {
    record: dataSet.find(record => record === null || record === void 0 ? void 0 : record.get('defaultFlag')),
    name: "conditionName",
    style: {
      flex: 1,
      marginLeft: 4
    }
  }))));
};
export default formatterCollections({
  code: ['hmde.bo']
})(observer(Index));