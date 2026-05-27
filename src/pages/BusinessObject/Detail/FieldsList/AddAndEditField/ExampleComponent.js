import React from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import styles from "./index.less?modules";
const ExampleComponent = ({
  hoverExampleInfo,
  selectedExampleInfo,
  componentType,
  isApiCustomType
}) => {
  const getOtherDescription = () => {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, intl.get('hmde.common.linkRelation').d('关联关系')), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("p", null, "1\uFF1AN"), /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.businessObject.associationRelationTips.oneToN').d('·关联对象一条记录对应当前对象多条记录。'))), /*#__PURE__*/React.createElement("div", {
      className: styles['example-label-wrapper']
    }, /*#__PURE__*/React.createElement(ImgIcon, {
      name: "example1-N@2x.png",
      style: {
        height: 188,
        width: '100%'
      }
    }))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("p", null, "1\uFF1A1"), /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.businessObject.associationRelationship.oneToOne').d('·关联对象一条记录对应当前对象单条记录。'))), /*#__PURE__*/React.createElement("div", {
      className: styles['example-label-wrapper']
    }, /*#__PURE__*/React.createElement(ImgIcon, {
      name: "example1-1@2x.png",
      style: {
        height: 98,
        width: '100%'
      }
    }))));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles['component-example'],
    style: {
      marginTop: isApiCustomType ? '42px' : 0
    }
  }, /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("p", null, intl.get('hmde.bo.businessObject.example').d('示例')), /*#__PURE__*/React.createElement("div", {
    className: styles['example-label-wrapper']
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: (hoverExampleInfo === null || hoverExampleInfo === void 0 ? void 0 : hoverExampleInfo.exampleIconName) || (selectedExampleInfo === null || selectedExampleInfo === void 0 ? void 0 : selectedExampleInfo.exampleIconName) || '',
    style: (hoverExampleInfo === null || hoverExampleInfo === void 0 ? void 0 : hoverExampleInfo.style) || (selectedExampleInfo === null || selectedExampleInfo === void 0 ? void 0 : selectedExampleInfo.style)
  }))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("p", null, intl.get('hmde.common.remark').d('描述')), /*#__PURE__*/React.createElement("span", null, (hoverExampleInfo === null || hoverExampleInfo === void 0 ? void 0 : hoverExampleInfo.description) || (selectedExampleInfo === null || selectedExampleInfo === void 0 ? void 0 : selectedExampleInfo.description))), componentType === 'MASTER_RELATION' ? getOtherDescription() : null);
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(ExampleComponent);