import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _set from "lodash/set";
import _isObject from "lodash/isObject";
import _forOwn from "lodash/forOwn";
const _excluded = ["children"];
import React, { Children, createContext, useContext } from 'react';
import { useLocalStore } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { TAB_KEYS } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/TabItemList";
const Store = /*#__PURE__*/createContext(undefined);
function StoreProvider(props) {
  const children = props.children,
    rest = _objectWithoutProperties(props, _excluded);
  const store = useLocalStore(() => ({
    state: {
      hasPermission: true,
      objVersionKey: '',
      baseInfoDS: null,
      boDetailTabActiveKey: TAB_KEYS.fieldList
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
    }
  }));
  return /*#__PURE__*/React.createElement(Store.Provider, {
    value: store
  }, Children.map(children, child => {
    return /*#__PURE__*/React.cloneElement(child, {
      ...rest
    });
  }));
}
const useBoStore = () => {
  const store = useContext(Store);
  if (!store) {
    return undefined;
  }
  return store;
};
export { StoreProvider, useBoStore };