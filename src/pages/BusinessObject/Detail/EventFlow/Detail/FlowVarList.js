import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _extends from "@babel/runtime/helpers/esm/extends";
import _Icon from "choerodon-ui/lib/icon";
import React, { useContext, useEffect } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { FormLayout, LabelLayout } from 'choerodon-ui/pro/lib/form/enum';
import DrillComponent from 'hzero-front-apaas/lib/components/DrillComponent';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import SpringTooltip from "hzero-front-hmde/lib/businessComponents/SpringTooltip";
import { getThemeColor } from "hzero-front-apaas/lib/utils/common";
import Store from "../stores/EventFlowStore";
import styles from "../index.less?modules";
const Index = props => {
  var _dataSet$data;
  const dataSet = props.dataSet;
  return /*#__PURE__*/React.createElement("div", {
    className: styles['flow-var-list']
  }, /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("strong", null, intl.get('hmde.bo.flow.title.flowVar').d('流程变量')), /*#__PURE__*/React.createElement("a", null, /*#__PURE__*/React.createElement(_Icon, {
    type: "add",
    onClick: async () => {
      if (await dataSet.validate()) {
        const record = dataSet.create({}, 0);
        dataSet.select(record);
      }
    }
  }))), /*#__PURE__*/React.createElement("div", null, (_dataSet$data = dataSet.data) === null || _dataSet$data === void 0 ? void 0 : _dataSet$data.map(record => /*#__PURE__*/React.createElement(FlowVarItem, _extends({}, props, {
    record: record
  })))));
};
const FlowVarItem = observer(({
  dataSet,
  businessObjectCode,
  record
}) => {
  const _ref = getThemeColor() || {},
    primary = _ref.primary,
    step1 = _ref.step1;
  const eleId = `flowVarItem${record === null || record === void 0 ? void 0 : record.id}`;
  const _ref2 = useContext(Store) || {},
    eventFlowStore = _ref2.eventFlowStore;
  const previousDS = eventFlowStore.previousDS;
  const fn1 = async e => {
    if (e._customFlag) {
      e._customFlag.set(eleId, 1);
    } else {
      e._customFlag = new Map();
      e._customFlag.set(eleId, 1);
    }
  };
  useEffect(() => {
    var _document$getElementB;
    const root = document.getElementById('root');
    const fn = async e => {
      if (e !== null && e !== void 0 && e._customFlag && (e === null || e === void 0 ? void 0 : e._customFlag.get(eleId)) !== 1 && (await record.validate(true))) {
        dataSet.unSelectAll();
      }
      if (!(e !== null && e !== void 0 && e._customFlag) && (await record.validate(true))) {
        dataSet.unSelectAll();
      }
    };
    if (root) {
      root.addEventListener('click', fn);
    }
    // eslint-disable-next-line no-unused-expressions
    (_document$getElementB = document.getElementById(eleId)) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.addEventListener('click', fn1);
    return () => {
      var _document, _document$getElementB2;
      if (root) {
        root.removeEventListener('click', fn);
      }
      // eslint-disable-next-line no-unused-expressions
      (_document = document) === null || _document === void 0 ? void 0 : (_document$getElementB2 = _document.getElementById(eleId)) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.removeEventListener('click', fn1);
      dataSet.unSelectAll();
    };
  }, []);
  useEffect(() => {
    if (record.isSelected) {
      previousDS.current = record;
    }
    return () => {
      previousDS.current = null;
    };
  }, [record.isSelected]);
  const hoverStyle = hoverRecord => {
    const style = {};
    if (hoverRecord.getState('hovered')) {
      Object.assign(style, {
        borderColor: primary,
        borderTopRightRadius: 0,
        boxShadow: '0 0 4px 0 rgba(0, 0, 0, .2)'
      });
    }
    return style;
  };
  return /*#__PURE__*/React.createElement("div", {
    id: eleId
  }, record.isSelected ? /*#__PURE__*/React.createElement(_Form, {
    record: record,
    className: styles['flow-var-item'],
    labelLayout: "none",
    layout: "none"
    // useColon={false}
    ,
    style: {
      gap: 4,
      borderColor: primary,
      boxShadow: '0 0 4px 0 rgba(0, 0, 0, .2)',
      borderTopRightRadius: 0
    },
    onMouseLeave: () => record.setState('hovered', false)
  }, /*#__PURE__*/React.createElement(_TextField, {
    name: "flowVarKey",
    placeholder: intl.get('hmde.bo.model.variablename').d('变量名')
  }), /*#__PURE__*/React.createElement(_Select, {
    name: "sourceType",
    placeholder: intl.get('hmde.bo.model.variableValueSource').d('变量值来源')
  }), (record === null || record === void 0 ? void 0 : record.get('sourceType')) === 'FIXED_VALUE' && /*#__PURE__*/React.createElement(_TextField, {
    name: "flowVarValue",
    placeholder: intl.get('hmde.bo.businessObject.variableValue').d('变量值')
  }), (record === null || record === void 0 ? void 0 : record.get('sourceType')) === 'BO_FIELD' && /*#__PURE__*/React.createElement(DrillComponent, {
    onOk: res => {
      record === null || record === void 0 ? void 0 : record.set('flowVarValue', res === null || res === void 0 ? void 0 : res.value);
    },
    name: "flowVarValue",
    businessObjectCode: businessObjectCode,
    initValue: (record === null || record === void 0 ? void 0 : record.get('flowVarValue')) || '',
    isWriteBack: true
  }), /*#__PURE__*/React.createElement("span", {
    className: styles['flow-var-item-delete'],
    style: {
      background: primary
    },
    onClick: () => dataSet.delete(record, false)
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "delete-B16@1x.svg",
    alt: "deleteFlowVar",
    size: 14
  }))) : /*#__PURE__*/React.createElement("div", {
    className: styles['flow-var-item'],
    style: {
      gap: 15,
      ...hoverStyle(record)
    },
    onClick: async () => {
      if (await record.validate()) {
        dataSet.select(record);
      }
    },
    onMouseEnter: () => record.setState('hovered', true),
    onMouseLeave: () => record.setState('hovered', false)
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(SpringTooltip, {
    title: record === null || record === void 0 ? void 0 : record.get('flowVarKey')
  }, stRef => /*#__PURE__*/React.createElement("span", {
    ref: stRef,
    style: {
      color: primary,
      background: step1,
      borderRadius: 1
    }
  }, record === null || record === void 0 ? void 0 : record.get('flowVarKey')))), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.model.variableValueSource').d('变量值来源')), /*#__PURE__*/React.createElement(_Output, {
    record: record,
    name: "sourceType",
    renderer: ({
      text
    }) => /*#__PURE__*/React.createElement(SpringTooltip, {
      title: text
    }, stRef => /*#__PURE__*/React.createElement("span", {
      ref: stRef
    }, text))
  })), (record === null || record === void 0 ? void 0 : record.get('sourceType')) === 'BO_FIELD' && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.variableValue').d('变量值')), /*#__PURE__*/React.createElement(SpringTooltip, {
    title: record === null || record === void 0 ? void 0 : record.get('flowVarValue')
  }, stRef => /*#__PURE__*/React.createElement("span", {
    ref: stRef
  }, /*#__PURE__*/React.createElement(DrillComponent, {
    name: "flowVarValue",
    businessObjectCode: businessObjectCode,
    initValue: (record === null || record === void 0 ? void 0 : record.get('flowVarValue')) || '',
    isWriteBack: true,
    readOnly: true
  })))), (record === null || record === void 0 ? void 0 : record.get('sourceType')) === 'FIXED_VALUE' && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.variableValue').d('变量值')), /*#__PURE__*/React.createElement(SpringTooltip, {
    title: record === null || record === void 0 ? void 0 : record.get('flowVarValue')
  }, stRef => /*#__PURE__*/React.createElement("span", {
    ref: stRef
  }, record === null || record === void 0 ? void 0 : record.get('flowVarValue')))), /*#__PURE__*/React.createElement("span", {
    className: styles['flow-var-item-delete'],
    style: {
      background: primary,
      display: record.getState('hovered') ? 'block' : 'none'
    },
    onClick: () => dataSet.delete(record, false)
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "delete-B16@1x.svg",
    alt: "deleteFlowVar",
    size: 14
  }))));
});
export default formatterCollections({
  code: ['hmde.bo']
})(observer(Index));