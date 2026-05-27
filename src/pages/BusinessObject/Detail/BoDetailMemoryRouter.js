import React, { lazy } from 'react';
import { MemoryRouter, Route, Switch, Redirect } from 'react-router-dom';
import HmdeIntlProvider from "hzero-front-hmde/lib/components/HmdeIntlProvider";
import { StoreProvider } from "./stores";
const BoDetail = /*#__PURE__*/lazy(() => import("./index"));
const BoCreate = /*#__PURE__*/lazy(() => import("./FieldsList/AddField"));
const BoEdit = /*#__PURE__*/lazy(() => import("./FieldsList/EditField"));
const BoRely = /*#__PURE__*/lazy(() => import("./FieldsList/FieldRely"));
const BoEventFlowDetail = /*#__PURE__*/lazy(() => import("./EventFlow/Detail"));
const LineTriggerDetail = /*#__PURE__*/lazy(() => import("./LineTrigger/Detail"));
const BoRouter = ({
  match,
  location
}) => {
  const _ref = (match === null || match === void 0 ? void 0 : match.params) || {},
    id = _ref.id;
  return /*#__PURE__*/React.createElement(HmdeIntlProvider, null, /*#__PURE__*/React.createElement(StoreProvider, null, /*#__PURE__*/React.createElement(MemoryRouter, {
    initialEntries: [{
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state
    }]
  }, /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    path: "/hmde/business-object/detail/:id",
    component: BoDetail
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/hmde/business-object/field/create",
    component: BoCreate
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/hmde/business-object/field/edit",
    component: BoEdit
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/hmde/business-object/field/rely",
    component: BoRely
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/hmde/business-object/event-flow/:id/:code",
    component: BoEventFlowDetail
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/hmde/business-object/linetrigger-detail/:id",
    component: LineTriggerDetail
  }), /*#__PURE__*/React.createElement(Redirect, {
    to: `/hmde/business-object/detail/${id}`
  })))));
};
export default BoRouter;