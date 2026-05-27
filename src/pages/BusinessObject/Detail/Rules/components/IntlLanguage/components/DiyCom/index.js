import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _TextArea from "@hzero-front-ui/c7n-ui/lib/TextAreaPro";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
const Diy = ({
  languageDiyDs
}) => {
  const _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    fields = _useState2[0],
    setFields = _useState2[1];
  useEffect(() => {
    const _fields = [];
    languageDiyDs.fields.forEach((value, key) => {
      _fields.push(key);
    });
    setFields(_fields);
  }, [languageDiyDs]);
  return /*#__PURE__*/React.createElement(_Form, {
    dataSet: languageDiyDs
  }, fields.map(field => /*#__PURE__*/React.createElement(_TextArea, {
    name: field,
    key: field
  })));
};
export default observer(Diy);