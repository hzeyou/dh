import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _TextArea from "@hzero-front-ui/c7n-ui/lib/TextAreaPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _Alert from "@hzero-front-ui/c7n-ui/lib/Alert";
import React from 'react';
import { observer } from 'mobx-react-lite';
import intl from 'utils/intl';
import Empty from "hzero-front-hmde/lib/components/Empty";
import { FN } from "../../../../datasets/languageTemplateDS";
import styles from "./index.less?modules";
const Template = ({
  languageTemplateDs,
  supportLanguage
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: styles.wrapper
  }, languageTemplateDs.length ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Alert, {
    message: intl.get('hmde.bo.language.templateHelp').d('修改模板的多语言信息，确定后将同步至平台多语言，影响所有使用该模板的属性'),
    type: "warning",
    showIcon: true
  }), /*#__PURE__*/React.createElement(_Form, {
    dataSet: languageTemplateDs,
    columns: 1,
    labelWidth: "auto"
  }, /*#__PURE__*/React.createElement(_Output, {
    name: FN.ERROR_INFO
  }), /*#__PURE__*/React.createElement(_Output, {
    name: FN.TYPE
  }), supportLanguage.map(item => /*#__PURE__*/React.createElement(_TextArea, {
    name: item.code,
    key: item.code
  })))) : /*#__PURE__*/React.createElement(Empty, {
    title: intl.get('hmde.bo.empty.selectTemplate').d('暂无数据, 请选择模板后查看')
  }));
};
export default observer(Template);