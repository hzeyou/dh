import _extends from "@babel/runtime/helpers/esm/extends";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _IntlField from "@hzero-front-ui/c7n-ui/lib/IntlFieldPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import React, { useEffect, useMemo } from 'react';
// import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
// import { LabelAlign } from 'choerodon-ui/pro/lib/form/enum';

import LovValuesList from "./LovValuesList";
import { lovDefineDS, lovValuesDS } from "./FormulaDS";
const Index = ({
  modal,
  valueList = [],
  businessObjectCode,
  selectDs,
  onResponse,
  valuesListProps
}) => {
  const lovDefineDs = useMemo(() => new _DataSet({
    ...lovDefineDS({
      businessObjectCode,
      selectDs
    }),
    children: {
      lovValues: new _DataSet(lovValuesDS())
    }
  }), []);
  useEffect(() => {
    lovDefineDs.children.lovValues.loadData(valueList);
  }, []);
  modal === null || modal === void 0 ? void 0 : modal.handleOk(async () => {
    const res = await lovDefineDs.submit();
    if (onResponse) {
      return onResponse(res);
    } else if (res && !(res !== null && res !== void 0 && res.failed)) {
      var _selectDs$current, _res$content, _selectDs$current2;
      (_selectDs$current = selectDs.current) === null || _selectDs$current === void 0 ? void 0 : _selectDs$current.set('valueList', res === null || res === void 0 ? void 0 : (_res$content = res.content) === null || _res$content === void 0 ? void 0 : _res$content[0]);
      (_selectDs$current2 = selectDs.current) === null || _selectDs$current2 === void 0 ? void 0 : _selectDs$current2.set('optionSettings', '_valueList');
      selectDs.children.customOptionList.removeAll();
    } else {
      return false;
    }
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Form, {
    dataSet: lovDefineDs,
    columns: 1
    // useColon={false} labelAlign={LabelAlign.center}
  }, /*#__PURE__*/React.createElement(_IntlField, {
    name: "lovName"
  }), /*#__PURE__*/React.createElement(_TextField, {
    name: "lovCode",
    maxLength: 60,
    showLengthInfo: true,
    clearButton: true
  })), /*#__PURE__*/React.createElement(LovValuesList, _extends({}, valuesListProps, {
    valueListDs: lovDefineDs.children.lovValues,
    operateHeaderFlag: true
  })));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Index));