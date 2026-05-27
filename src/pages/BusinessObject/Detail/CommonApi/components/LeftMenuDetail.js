import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Menu from "@hzero-front-ui/c7n-ui/lib/MenuPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import React, { useMemo, useImperativeHandle } from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import intl from 'utils/intl';
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
import { renderModalConfirm } from "hzero-front-apaas/lib/utils/render";
import styles from "../index.less?modules";
import { leftListDataSet } from "../datasets";
const App = ({
  baseInfoDS,
  setActiveKey,
  activeKey,
  activeName,
  setActiveName,
  detailRef,
  dirtyRef
}) => {
  const boStore = useBoStore();
  const listDs = useMemo(() => {
    var _baseInfoDS$current, _boStore$getState;
    return new _DataSet(leftListDataSet(baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('businessObjectId'), boStore === null || boStore === void 0 ? void 0 : (_boStore$getState = boStore.getState) === null || _boStore$getState === void 0 ? void 0 : _boStore$getState.call(boStore, 'objVersionKey')));
  }, []);
  const handleClick = async v => {
    var _dirtyRef$current, _dirtyRef$current2, _dirtyRef$current3;
    const handleOnClickItem = () => {
      var _listDs$find;
      setActiveKey(v === null || v === void 0 ? void 0 : v.key);
      setActiveName(listDs === null || listDs === void 0 ? void 0 : (_listDs$find = listDs.find(item => (item === null || item === void 0 ? void 0 : item.get('apiType')) === (v === null || v === void 0 ? void 0 : v.key))) === null || _listDs$find === void 0 ? void 0 : _listDs$find.get('apiTypeMeaning'));
    };
    if (dirtyRef !== null && dirtyRef !== void 0 && (_dirtyRef$current = dirtyRef.current) !== null && _dirtyRef$current !== void 0 && _dirtyRef$current.modelDetailDs.dirty || dirtyRef !== null && dirtyRef !== void 0 && (_dirtyRef$current2 = dirtyRef.current) !== null && _dirtyRef$current2 !== void 0 && _dirtyRef$current2.inParamsDs.dirty || dirtyRef !== null && dirtyRef !== void 0 && (_dirtyRef$current3 = dirtyRef.current) !== null && _dirtyRef$current3 !== void 0 && _dirtyRef$current3.outParamsDs.dirty) {
      renderModalConfirm(intl.get('hmde.bo.businessObject.changeApiModel').d('当前接口维护未保存，切换将清空修改内容，请确认是否切换？'), {
        title: intl.get('hmde.common.isSwitch').d('是否切换'),
        cancelText: intl.get('hmde.common.button.close').d('关闭'),
        onOk: () => {
          handleOnClickItem();
        }
      });
      return;
    }
    handleOnClickItem();
  };
  useDataSetEvents(listDs, 'load', () => {
    var _listDs$get, _listDs$get2;
    setActiveKey(activeKey || (listDs === null || listDs === void 0 ? void 0 : (_listDs$get = listDs.get(0)) === null || _listDs$get === void 0 ? void 0 : _listDs$get.get('apiType')));
    setActiveName(activeName || (listDs === null || listDs === void 0 ? void 0 : (_listDs$get2 = listDs.get(0)) === null || _listDs$get2 === void 0 ? void 0 : _listDs$get2.get('apiTypeMeaning')));
  });
  const typeStyles = color => {
    switch (color) {
      case 'DELETE':
        return styles['left-icon-color-red'];
      case 'POST':
        return styles['left-icon-color-green'];
      default:
        return '';
    }
  };
  useImperativeHandle(detailRef, () => ({
    listDs
  }), [listDs]);
  return /*#__PURE__*/React.createElement("div", {
    className: styles['left-menu']
  }, /*#__PURE__*/React.createElement(_Spin, {
    dataSet: listDs
  }, /*#__PURE__*/React.createElement(_Menu, {
    mode: "vertical",
    onClick: handleClick,
    selectedKeys: [activeKey]
  }, listDs.map(value => /*#__PURE__*/React.createElement(_Menu.Item, {
    key: value === null || value === void 0 ? void 0 : value.get('apiType')
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['left-title']
  }, /*#__PURE__*/React.createElement("span", {
    className: styles['left-name']
  }, value === null || value === void 0 ? void 0 : value.get('apiTypeMeaning')), /*#__PURE__*/React.createElement("span", {
    className: `${styles['left-icon']} ${typeStyles(value === null || value === void 0 ? void 0 : value.get('apiRequestMethod'))}`
  }, value === null || value === void 0 ? void 0 : value.get('apiRequestMethod'))), /*#__PURE__*/React.createElement("div", {
    className: styles['left-url']
  }, (value === null || value === void 0 ? void 0 : value.get('apiStandardUrl')) || intl.get('hmde.bo.businessObject.UnassociatedAPImodel').d('未关联API模型')))))));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(App));