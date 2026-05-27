import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Icon from "choerodon-ui/lib/icon";
import _Progress from "@hzero-front-ui/c7n-ui/lib/ProgressPro";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _isNil from "lodash/isNil";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Header, ListContent, ListItem } from 'components/Page';
import { Graph } from "hzero-front-apaas/lib/components/AntvX6";
import { Scroller, MiniMap, Keyboard } from "hzero-front-apaas/lib/components/AntvX6/plugins";
import { observer } from 'mobx-react-lite';
import { useEventListener } from 'ahooks';
import intl from 'utils/intl';
import useX6DevTools from 'hzero-front-apaas/lib/hooks/useX6DevTools';
import PublishComponent from "hzero-front-hmde/lib/routes/BusinessObject/DomainOwnBOList/components/PublishComponent";
import { PublicTypeList } from "hzero-front-hmde/lib/routes/BusinessObject/DomainOwnBOList/type";
import useThemeColor from "hzero-front-apaas/lib/hooks/useThemeColor";
import { RouterName } from "hzero-front-hmde/lib/constants/x6";
import MainContainer from "./components/MainContainer";
import Toolbar from "./components/Toolbar";
import BOList from "./components/BOList";
import BOAsyncPublish from "./components/BOAsyncPublish";
import { registerERRouter, registerReactERNode } from "./utils/graph";
import { CONTAINER_ID, MINI_MAP_ID } from "./constants/graph";
import { useERStore } from "./stores";
import styles from "./index.less?modules";
const ERDiagram = () => {
  const erStore = useERStore();
  const themColor = useThemeColor();
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    publishFlag = _useState2[0],
    setPublishFlag = _useState2[1];
  const _useState3 = useState(0),
    _useState4 = _slicedToArray(_useState3, 2),
    publishPercent = _useState4[0],
    setPublishPercent = _useState4[1];
  const _useState5 = useState(PublicTypeList.publicObject),
    _useState6 = _slicedToArray(_useState5, 2),
    publicType = _useState6[0],
    setPublicType = _useState6[1];
  const _useState7 = useState(false),
    _useState8 = _slicedToArray(_useState7, 2),
    loading = _useState8[0],
    setLoading = _useState8[1];
  const _useState9 = useState(''),
    _useState10 = _slicedToArray(_useState9, 2),
    businessObjectCode = _useState10[0],
    setBusinessObjectCode = _useState10[1]; // 当前发布的业务对象编码

  const progressRef = useRef({});
  const boPublishProgressRef = useRef(null);
  const wrapperRef = useRef(null);
  const isGraphLoading = erStore.getState('isGraphLoading');
  const domain = erStore.getState('domain');
  useX6DevTools(erStore === null || erStore === void 0 ? void 0 : erStore.getState('graph'));
  useEventListener('resize', () => {
    var _wrapperRef$current, _wrapperRef$current2;
    const graph = erStore.getState('graph');
    graph === null || graph === void 0 ? void 0 : graph.resize(((_wrapperRef$current = wrapperRef.current) === null || _wrapperRef$current === void 0 ? void 0 : _wrapperRef$current.clientWidth) || 0, ((_wrapperRef$current2 = wrapperRef.current) === null || _wrapperRef$current2 === void 0 ? void 0 : _wrapperRef$current2.clientHeight) || 0);
  });
  useEffect(() => {
    var _wrapperRef$current3, _wrapperRef$current4;
    // 注册 react ER 图节点
    registerReactERNode();
    // 注册 ER 路由
    const erRouteDispose = registerERRouter();

    // 仅做初始化布局
    const graph = new Graph({
      container: document.getElementById(CONTAINER_ID),
      width: ((_wrapperRef$current3 = wrapperRef.current) === null || _wrapperRef$current3 === void 0 ? void 0 : _wrapperRef$current3.clientWidth) || 0,
      height: ((_wrapperRef$current4 = wrapperRef.current) === null || _wrapperRef$current4 === void 0 ? void 0 : _wrapperRef$current4.clientHeight) || 0,
      grid: {
        visible: true,
        size: 20,
        args: {
          color: '#f0f0f0',
          thickness: 3
        }
      },
      background: {
        color: '#f8f8f8'
      },
      interacting: {
        nodeMovable: true // 仅允许节点移动
      },
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta']
      },
      // 允许鼠标滚轮缩放画布
      connecting: {
        router: {
          name: RouterName.ER_ROUTER,
          args: {
            direction: 'H'
          }
        },
        allowEdge: false,
        allowPort: false,
        allowBlank: false,
        allowLoop: false,
        allowMulti: false,
        allowNode: false
      }
    });

    // 滚动
    graph.use(new Scroller({
      enabled: true,
      className: styles['graph-scroller'],
      pannable: {
        enabled: true,
        eventTypes: ['leftMouseDown']
      },
      autoResize: true
    }));

    // 小地图
    graph.use(new MiniMap({
      container: document.getElementById(MINI_MAP_ID),
      width: 205,
      height: 128,
      padding: 0
    }));

    // 快捷键
    graph.use(new Keyboard({
      enabled: true
    }));
    erStore.setState('graph', graph);
    return () => {
      graph.dispose();
      erRouteDispose();
    };
  }, []);
  const successCallback = () => {
    var _erStore$getState;
    (_erStore$getState = erStore.getState('updateGraphCells')) === null || _erStore$getState === void 0 ? void 0 : _erStore$getState();
  };
  const publishComProps = {
    setPublishPercent,
    progressRef,
    publicType,
    setLoading,
    setPublicType,
    publishFlag,
    setPublishFlag,
    domain: domain,
    // 把当前选择的领域也传过去
    successCallback
  };

  // 发布单个业务对象
  const queryPublishBoProcess = useCallback(boCode => {
    setBusinessObjectCode(boCode);
    setTimeout(() => {
      var _boPublishProgressRef, _boPublishProgressRef2;
      (_boPublishProgressRef = boPublishProgressRef.current) === null || _boPublishProgressRef === void 0 ? void 0 : (_boPublishProgressRef2 = _boPublishProgressRef.progressRef.current) === null || _boPublishProgressRef2 === void 0 ? void 0 : _boPublishProgressRef2.handleQuery();
    });
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Header, {
    title: intl.get('hmde.bo.businessObject.erDiagram').d('业务对象 ER 图')
  }, !_isNil(domain) && /*#__PURE__*/React.createElement(PublishComponent, publishComProps)), /*#__PURE__*/React.createElement(ListContent, {
    className: styles.list
  }, /*#__PURE__*/React.createElement(_Spin, {
    // prefixCls="c7n-er-bo-publish-spin"
    className: styles['spin-publish'],
    spinning: loading,
    indicator: /*#__PURE__*/React.createElement("div", {
      className: styles['spin-inner-content']
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        marginRight: 20
      }
    }, /*#__PURE__*/React.createElement(_Progress, {
      value: publishPercent,
      status: 'active',
      strokeColor: themColor === null || themColor === void 0 ? void 0 : themColor.primary
    })), /*#__PURE__*/React.createElement("a", {
      onClick: e => {
        var _progressRef$current;
        e.preventDefault();
        if (progressRef !== null && progressRef !== void 0 && (_progressRef$current = progressRef.current) !== null && _progressRef$current !== void 0 && _progressRef$current.openAsyncDetail) {
          // 打开发布过程的详情
          progressRef.current.openAsyncDetail();
        }
      }
    }, /*#__PURE__*/React.createElement(_Icon, {
      type: "visibility-o"
    }), "\xA0", /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.button.viewDetail').d('查看详情'))))
  }, /*#__PURE__*/React.createElement(BOList, null), /*#__PURE__*/React.createElement(ListItem, {
    className: styles.content
  }, /*#__PURE__*/React.createElement(_Spin, {
    spinning: isGraphLoading
  }, /*#__PURE__*/React.createElement(Toolbar, null), /*#__PURE__*/React.createElement("div", {
    className: styles.wrapper,
    ref: wrapperRef
  }, /*#__PURE__*/React.createElement(MainContainer, {
    queryPublishBoProcess: queryPublishBoProcess
  })))))), /*#__PURE__*/React.createElement(BOAsyncPublish, {
    key: businessObjectCode,
    setLoading: setLoading,
    businessObjectCode: businessObjectCode,
    setPublishPercent: setPublishPercent,
    ref: boPublishProgressRef
  }));
};
export default observer(ERDiagram);