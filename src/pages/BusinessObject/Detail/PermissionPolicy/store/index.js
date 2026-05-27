import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
const _excluded = ["children"];
import React, { createContext, useContext } from 'react';
const Store = /*#__PURE__*/createContext({});
const StoreProvider = props => {
  const children = props.children,
    values = _objectWithoutProperties(props, _excluded);
  return /*#__PURE__*/React.createElement(Store.Provider, {
    value: values
  }, children);
};
const useUsedPermissionStore = () => {
  const store = useContext(Store);
  if (!store) {
    throw new Error('You have forgot to use StoreProvider.');
  }
  return store;
};
const useBaseInfoStore = () => {
  const store = useContext(Store);
  if (!store) {
    throw new Error('You have forgot to use StoreProvider.');
  }
  return store.baseInfoDS;
};
export { StoreProvider, useUsedPermissionStore, useBaseInfoStore };