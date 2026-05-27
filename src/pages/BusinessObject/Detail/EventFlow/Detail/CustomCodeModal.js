import _CodeArea from "@hzero-front-ui/c7n-ui/lib/CodeAreaPro";
import _Switch from "@hzero-front-ui/c7n-ui/lib/SwitchPro";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useState } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import FlowModalLayout from "../components/FlowModalLayout";
import styles from "../index.less?modules";
var CodeAreaTheme = /*#__PURE__*/function (CodeAreaTheme) {
  CodeAreaTheme["IDEA"] = "idea";
  CodeAreaTheme["MATERIAL"] = "material";
  return CodeAreaTheme;
}(CodeAreaTheme || {});
const Index = ({
  dataSet
}) => {
  const _useState = useState(CodeAreaTheme.IDEA),
    _useState2 = _slicedToArray(_useState, 2),
    theme = _useState2[0],
    setTheme = _useState2[1];
  return /*#__PURE__*/React.createElement(FlowModalLayout, {
    dataSet: dataSet,
    title: intl.get('hmde.bo.flow.title.pageCode').d('页面编码'),
    name: "customCodeName"
  }, /*#__PURE__*/React.createElement("header", {
    className: styles['code-area-header']
  }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.flow.title.codeArea').d('代码区')), /*#__PURE__*/React.createElement(_Switch, {
    defaultChecked: true,
    onChange: val => setTheme(val ? CodeAreaTheme.IDEA : CodeAreaTheme.MATERIAL)
  })), /*#__PURE__*/React.createElement(_CodeArea, {
    dataSet: dataSet,
    name: "customCodes",
    options: {
      theme
    },
    style: {
      height: 300
    }
  }));
};
export default formatterCollections({
  code: ['hmde.bo']
})(observer(Index));