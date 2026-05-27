import React, { lazy } from 'react';
import LowcodeModalProvider from 'hzero-front-apaas/lib/components/LowcodeModalProvider';
import HmdeIntlProvider from "hzero-front-hmde/lib/components/HmdeIntlProvider";
import { StoreProvider } from "./stores";
const ERDiagram = /*#__PURE__*/lazy(() => import("./ERDiagram"));
const Index = () => {
  return /*#__PURE__*/React.createElement(LowcodeModalProvider, null, /*#__PURE__*/React.createElement(HmdeIntlProvider, null, /*#__PURE__*/React.createElement(StoreProvider, null, /*#__PURE__*/React.createElement(ERDiagram, null))));
};
export default Index;