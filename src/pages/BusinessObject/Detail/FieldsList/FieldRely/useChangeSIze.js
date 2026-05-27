import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from 'react';
export default function useChangeSize(setFourthLastIndex) {
  var _window$dvaApp, _window$dvaApp$_store, _window$dvaApp$_store2, _window$dvaApp$_store3, _window$dvaApp$_store4, _window$dvaApp$_store5;
  const _useState = useState(document.documentElement.clientWidth),
    _useState2 = _slicedToArray(_useState, 2),
    size = _useState2[0],
    setSize = _useState2[1];
  const onReSize = useCallback(() => {
    setFourthLastIndex(undefined);
    setSize(document.documentElement.clientWidth);
  }, []);
  useEffect(() => {
    window.addEventListener('resize', _debounce(onReSize, 300, {
      trailing: true
    }));
    return () => {
      window.removeEventListener('resize', onReSize);
    };
  }, []);
  return {
    size,
    collapsed: (_window$dvaApp = window.dvaApp) === null || _window$dvaApp === void 0 ? void 0 : (_window$dvaApp$_store = _window$dvaApp._store) === null || _window$dvaApp$_store === void 0 ? void 0 : (_window$dvaApp$_store2 = _window$dvaApp$_store.getState) === null || _window$dvaApp$_store2 === void 0 ? void 0 : (_window$dvaApp$_store3 = _window$dvaApp$_store2.call(_window$dvaApp$_store)) === null || _window$dvaApp$_store3 === void 0 ? void 0 : (_window$dvaApp$_store4 = _window$dvaApp$_store3.global) === null || _window$dvaApp$_store4 === void 0 ? void 0 : (_window$dvaApp$_store5 = _window$dvaApp$_store4.collapsed) === null || _window$dvaApp$_store5 === void 0 ? void 0 : _window$dvaApp$_store5.collapsed
  };
}