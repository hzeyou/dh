import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _TextArea from "@hzero-front-ui/c7n-ui/lib/TextAreaPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _useDataSet from "choerodon-ui/pro/lib/use-data-set";
import _toLower from "lodash/toLower";
import _omit from "lodash/omit";
import _forOwn from "lodash/forOwn";
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import languageTemplateDS, { FN } from "../../../../datasets/languageTemplateDS";
import { LanguageType } from "../../../../datasets/languageDS";
import { buildLanguageTemplate } from "../../../../utils";
const CreateLanguageTemplate = ({
  fillLanguageTemplate,
  supportLanguage,
  modal,
  languageType,
  languageDiyDs,
  domainCode
}) => {
  const codeBefore = `${_toLower(domainCode)}.`;
  const languageTemplateDs = _useDataSet(() => ({
    ...languageTemplateDS(supportLanguage, codeBefore),
    autoCreate: true
  }), [supportLanguage]);
  useEffect(() => {
    // 自定义的时候点击新建模板,默认代入自定义的数据
    if (languageType === LanguageType.CUSTOM) {
      var _languageDiyDs$curren;
      const data = _omit((_languageDiyDs$curren = languageDiyDs.current) === null || _languageDiyDs$curren === void 0 ? void 0 : _languageDiyDs$curren.toData(), '__dirty');
      _forOwn(data, (value, key) => {
        var _languageTemplateDs$c;
        (_languageTemplateDs$c = languageTemplateDs.current) === null || _languageTemplateDs$c === void 0 ? void 0 : _languageTemplateDs$c.set(key, value);
      });
    }
  }, [languageType, languageDiyDs]);
  useEffect(() => {
    modal === null || modal === void 0 ? void 0 : modal.handleOk(async () => {
      const flag = await languageTemplateDs.submit();
      if (flag) {
        var _languageTemplateDs$c2;
        fillLanguageTemplate(buildLanguageTemplate((_languageTemplateDs$c2 = languageTemplateDs.current) === null || _languageTemplateDs$c2 === void 0 ? void 0 : _languageTemplateDs$c2.toData(), codeBefore));
      }
      return flag;
    });
  }, [modal]);
  return /*#__PURE__*/React.createElement(_Form, {
    dataSet: languageTemplateDs,
    columns: 1,
    labelWidth: "auto"
  }, /*#__PURE__*/React.createElement(_TextField, {
    addonBefore: codeBefore,
    name: FN.ERROR_INFO
  }), supportLanguage.map(item => /*#__PURE__*/React.createElement(_TextArea, {
    name: item.code,
    key: item.code
  })), /*#__PURE__*/React.createElement(_Output, {
    name: FN.TYPE
  }));
};
export default observer(CreateLanguageTemplate);