import React from 'react';
import { SharedComponent } from "../../../../../customize";
export default function HlodWrapper({
  loadSuccess
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SharedComponent, {
    componentCode: "HlodModuleImportFlag",
    componentProps: {
      loadSuccess
    }
  }));
}