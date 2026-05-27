import _DataSet from "choerodon-ui/pro/lib/data-set";
import _isObject from "lodash/isObject";
import _forOwn from "lodash/forOwn";
import _set from "lodash/set";
import React, { createContext, useContext } from 'react';
import { useLocalStore } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { SourceType } from "hzero-front-apaas/lib/constants/businessObject";
const Store = /*#__PURE__*/createContext({});
function StoreProvider(props) {
  const children = props.children;
  const store = useLocalStore(() => ({
    state: {
      name: 'aPaaS',
      baseInfoDS: new _DataSet({}),
      businessObjectId: '',
      businessObjectCode: '',
      businessObjectName: '',
      showVersion: '',
      readOnlyFlag: false,
      baseInfoData: {},
      publishStatus: undefined,
      // 当前发布状态字符串
      isFromDomain: false,
      // 是否已修改或已发布
      published: false,
      // 是否预置对象
      get predefineDisabled() {
        var _this$baseInfoData;
        return ((_this$baseInfoData = this.baseInfoData) === null || _this$baseInfoData === void 0 ? void 0 : _this$baseInfoData.sourceType) === SourceType.PREDEFINE;
      },
      // 是否租户自定义对象
      get tenantCustomObject() {
        var _this$baseInfoData2;
        return ((_this$baseInfoData2 = this.baseInfoData) === null || _this$baseInfoData2 === void 0 ? void 0 : _this$baseInfoData2.sourceType) === SourceType.TENANT;
      },
      // 中间对象的标识
      get middleBusinessObjFlag() {
        var _this$baseInfoData3;
        return (this === null || this === void 0 ? void 0 : (_this$baseInfoData3 = this.baseInfoData) === null || _this$baseInfoData3 === void 0 ? void 0 : _this$baseInfoData3.businessObjectCategory) === 'MIDDLE';
      },
      // 租户对象的领域是否开启标准扩展模式或标准弹性域模式  控制是否显示选择扩展字段
      get domainEnabledFlag() {
        var _this$baseInfoData4, _this$baseInfoData5;
        return (this === null || this === void 0 ? void 0 : (_this$baseInfoData4 = this.baseInfoData) === null || _this$baseInfoData4 === void 0 ? void 0 : _this$baseInfoData4.extendTableEnabledFlag) || (this === null || this === void 0 ? void 0 : (_this$baseInfoData5 = this.baseInfoData) === null || _this$baseInfoData5 === void 0 ? void 0 : _this$baseInfoData5.flexFieldEnabledFlag);
      }
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
  }, children);
}
const useStore = () => {
  const store = useContext(Store);
  if (!store) {
    throw new Error('You have forgot to use StoreProvider.');
  }
  return store;
};
export { StoreProvider, useStore };