import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useRef, useState, useImperativeHandle } from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import styles from "./index.less?modules";
import LeftMenuDetail from "./components/LeftMenuDetail";
import RightDetail from "./components/RightDetail";
const App = ({
  baseInfoDS,
  apiRef,
  optionsListDs,
  apiListCode = ''
}) => {
  const _useState = useState(apiListCode),
    _useState2 = _slicedToArray(_useState, 2),
    activeKey = _useState2[0],
    setActiveKey = _useState2[1];
  const _useState3 = useState(''),
    _useState4 = _slicedToArray(_useState3, 2),
    activeName = _useState4[0],
    setActiveName = _useState4[1];
  const detailRef = useRef();
  const dirtyRef = useRef();
  useImperativeHandle(apiRef, () => ({
    init: () => {
      if (activeKey) {
        var _detailRef$current, _detailRef$current$li, _detailRef$current$li2;
        setActiveKey('');
        detailRef === null || detailRef === void 0 ? void 0 : (_detailRef$current = detailRef.current) === null || _detailRef$current === void 0 ? void 0 : (_detailRef$current$li = _detailRef$current.listDs) === null || _detailRef$current$li === void 0 ? void 0 : (_detailRef$current$li2 = _detailRef$current$li.query) === null || _detailRef$current$li2 === void 0 ? void 0 : _detailRef$current$li2.call(_detailRef$current$li);
      }
    }
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: styles['common-api']
  }, /*#__PURE__*/React.createElement(LeftMenuDetail, {
    baseInfoDS: baseInfoDS,
    setActiveKey: setActiveKey,
    activeKey: activeKey,
    activeName: activeName,
    setActiveName: setActiveName,
    detailRef: detailRef,
    dirtyRef: dirtyRef
  }), /*#__PURE__*/React.createElement(RightDetail, {
    activeKey: activeKey,
    baseInfoDS: baseInfoDS,
    activeName: activeName,
    detailRef: detailRef,
    dirtyRef: dirtyRef,
    optionsListDs: optionsListDs
  }));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(App));