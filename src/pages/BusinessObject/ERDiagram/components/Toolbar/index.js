import _Icon from "choerodon-ui/pro/lib/icon";
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import intl from 'utils/intl';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import { ReactComponent as ImgClear } from "hzero-front-hmde/lib/assets/icon/clear.svg";
import { useERStore } from "../../stores";
import { executeERLayout } from "../../utils/graph";
import ToolButton from "./components/ToolButton";
import styles from "./index.less?modules";
const Toolbar = () => {
  const erStore = useERStore();
  const graph = erStore.getState('graph');
  const isShowMiniMap = erStore.getState('isShowMiniMap');
  const isShowLegend = erStore.getState('isShowLegend');
  useEffect(() => {
    // 监听布局加载完成
    graph === null || graph === void 0 ? void 0 : graph.on('layout:stop', () => {});
  }, [graph]);
  const handleAutoLayout = async () => {
    if (graph) {
      erStore.setState('isGraphLoading', true);
      await executeERLayout(graph);
      erStore.setState('isGraphLoading', false);
    }
  };
  const handleShowMiniMap = () => {
    erStore.setState('isShowMiniMap', !isShowMiniMap);
  };
  const handleZoomIn = () => {
    graph === null || graph === void 0 ? void 0 : graph.zoom(-0.1);
  };
  const handleZoomOut = () => {
    graph === null || graph === void 0 ? void 0 : graph.zoom(0.1);
  };
  const handleShowLegend = () => {
    erStore.setState('isShowLegend', !isShowLegend);
  };
  const handleRefresh = () => {
    var _erStore$getState;
    (_erStore$getState = erStore.getState('updateGraphCells')) === null || _erStore$getState === void 0 ? void 0 : _erStore$getState();
  };
  const handleClear = () => {
    erStore.setState('selectedBOIds', []);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles.toolbar
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ToolButton, {
    onClick: handleShowMiniMap,
    tooltipText: intl.get('hmde.bo.businessObject.thumbnail').d('缩略图'),
    isShowBg: isShowMiniMap
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "minimap.svg",
    size: 16
  })), /*#__PURE__*/React.createElement(ToolButton, {
    onClick: handleZoomOut,
    tooltipText: intl.get('hmde.bo.businessObject.amplifierOperate').d('放大(ctrl+鼠标向上滚轮)')
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "enlarge@1x.svg",
    size: 16
  })), /*#__PURE__*/React.createElement(ToolButton, {
    onClick: handleZoomIn,
    tooltipText: intl.get('hmde.bo.businessObject.narrowOperate').d('缩小(ctrl+鼠标向下滚轮)')
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "narrow@1x.svg",
    size: 16
  })), /*#__PURE__*/React.createElement(ToolButton, {
    onClick: handleAutoLayout,
    tooltipText: intl.get('hmde.bo.businessObject.automaticLayout').d('自动布局')
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "dashboard-o",
    style: {
      fontSize: 16
    }
  })), /*#__PURE__*/React.createElement(ToolButton, {
    onClick: handleRefresh,
    tooltipText: intl.get('hmde.common.refreshed').d('刷新')
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "refresh",
    style: {
      fontSize: 16
    }
  })), /*#__PURE__*/React.createElement(ToolButton, {
    onClick: handleClear,
    tooltipText: intl.get('hmde.bo.businessObject.clearAll').d('清空全部')
  }, /*#__PURE__*/React.createElement(ImgClear, null))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ToolButton, {
    onClick: handleShowLegend,
    tooltipText: intl.get('hmde.bo.businessObject.legend').d('图例'),
    isShowBg: isShowLegend
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "legend.svg",
    size: 16
  }))));
};
export default observer(Toolbar);