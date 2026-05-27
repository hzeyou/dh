import _isObject from "lodash/isObject";
import _forOwn from "lodash/forOwn";
import _set from "lodash/set";
import React, { createContext, useContext } from 'react';
import { useLocalStore } from 'mobx-react-lite';
import { toJS } from 'mobx';
const Store = /*#__PURE__*/createContext({});
function StoreProvider(props) {
  const children = props.children;
  const initialState = {
    graph: null,
    isGraphLoading: false,
    selectedBOIds: [],
    isShowMiniMap: false,
    isShowLegend: true,
    selectedNodeId: '',
    graphERData: [],
    domain: null,
    businessObjectCreatedFlag: true
  };
  const store = useLocalStore(() => ({
    state: {
      ...initialState
    },
    setState(keys, value) {
      if (_isObject(keys)) {
        _forOwn(keys, (v, k) => {
          _set(store.state, k, v);
        });
      } else {
        _set(store.state, keys, value);
      }
    },
    getState(key, isToJs) {
      return isToJs ? toJS(store.state[key]) : store.state[key];
    },
    resetState() {
      store.state = {
        ...initialState
      };
    }
  }));
  return /*#__PURE__*/React.createElement(Store.Provider, {
    value: store
  }, children);
}
const useERStore = () => {
  const store = useContext(Store);
  if (!store) {
    throw new Error('You have forgot to use StoreProvider.');
  }
  return store;
};
export { StoreProvider, useERStore };