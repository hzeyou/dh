/**
 * 下拉刷新 上拉加载更多
 */
import React from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import "./TLoader.less";
const STATS = {
  init: '',
  pulling: 'pulling',
  enough: 'pulling enough',
  refreshing: 'refreshing',
  refreshed: 'refreshed',
  reset: 'reset',
  loading: 'loading' // loading more
};
const TLoaderMsg = new Map([['pullingMsg', intl.get('hmde.common.load.pullingMsg').d('下拉刷新')], ['pullingEnoughMsg', intl.get('hmde.common.load.pullingEnoughMsg').d('松开刷新')], ['refreshingMsg', intl.get('hmde.common.load.refreshingMsg').d('正在刷新...')], ['refreshedMsg', intl.get('hmde.common.load.refreshedMsg').d('刷新成功')], ['loadingMsg', intl.get('hmde.common.load.loadingMsg').d('正在加载...')], ['btnLoadMore', intl.get('hmde.common.load.btnLoadMore').d('点击加载更多')]]);

// 拖拽的缓动公式 - easeOutSine
function easing(distance) {
  // t: current time, b: begInnIng value, c: change In value, d: duration
  const t = distance;
  const b = 0;
  const d = window.screen.availHeight; // 允许拖拽的最大距离
  const c = d / 2.5; // 提示标签最大有效拖拽距离

  return c * Math.sin(t / d * (Math.PI / 2)) + b;
}

// pull to refresh
// tap bottom to load more
class Tloader extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      loaderState: STATS.init,
      pullHeight: 0,
      progressed: 0
    };
    this.touchStart = e => {
      if (!this.canRefresh()) return;
      if (e.touches.length === 1) {
        const panel = this.panel;
        this.initialTouch = {
          clientY: e.touches[0].clientY,
          scrollTop: panel.scrollTop
        };
      }
    };
    this.touchMove = e => {
      if (!this.canRefresh()) return;
      const panel = this.panel;
      const distanceToRefresh = this.props.distanceToRefresh;
      const scrollTop = panel.scrollTop;
      const distance = this.calculateDistance(e.touches[0]);
      if (distance > 0 && scrollTop <= 0) {
        let pullDistance = distance - this.initialTouch.scrollTop;
        if (pullDistance < 0) {
          // 修复 webview 滚动过程中 touchstart 时计算panel.scrollTop不准
          pullDistance = 0;
          this.initialTouch.scrollTop = distance;
        }
        const pullHeight = easing(pullDistance);
        if (pullHeight) e.preventDefault(); // 减弱滚动

        this.setState({
          loaderState: pullHeight > distanceToRefresh ? STATS.enough : STATS.pulling,
          pullHeight
        });
      }
    };
    this.touchEnd = () => {
      if (!this.canRefresh()) return;
      const endState = {
        loaderState: STATS.reset,
        pullHeight: 0
      };
      if (this.state.loaderState === STATS.enough) {
        // refreshing
        this.setState({
          loaderState: STATS.refreshing,
          pullHeight: 0
        });

        // trigger refresh action
        this.props.onRefresh(() => {
          // resolve
          this.setState({
            loaderState: STATS.refreshed,
            pullHeight: 0
          });
        }, () => {
          // reject
          this.setState(endState); // reset
        });
      } else this.setState(endState); // reset
    };
    this.loadMore = () => {
      this.setState({
        loaderState: STATS.loading
      });
      this.props.onLoadMore(() => {
        // resolve
        this.setState({
          loaderState: STATS.init
        });
      });
    };
    this.scroll = e => {
      if (this.props.autoLoadMore && this.props.hasMore && this.state.loaderState !== STATS.loading) {
        const panel = e.currentTarget;
        const scrollBottom = panel.scrollHeight - (panel === null || panel === void 0 ? void 0 : panel.clientHeight) - panel.scrollTop;
        if (scrollBottom < 5) this.loadMore();
      }
    };
    this.animationEnd = () => {
      const newState = {};
      if (this.state.loaderState === STATS.refreshed) newState.loaderState = STATS.init;
      if (this.props.initializing > 1) newState.progressed = 1;
      this.setState(newState);
    };
    this.initialTouch = void 0;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.initializing < 2) {
      this.setState({
        progressed: 0 // reset progress animation state
      });
    }
  }
  setInitialTouch(touch) {
    this.initialTouch = {
      clientY: touch.clientY
    };
  }
  calculateDistance(touch) {
    return touch.clientY - this.initialTouch.clientY;
  }
  canRefresh() {
    const onRefresh = this.props.onRefresh;
    const loaderState = this.state.loaderState;
    return onRefresh && [STATS.refreshing, STATS.loading].indexOf(loaderState) < 0;
  }
  render() {
    const _this$props = this.props,
      children = _this$props.children,
      className = _this$props.className,
      hasMore = _this$props.hasMore,
      initializing = _this$props.initializing;
    const _this$state = this.state,
      loaderState = _this$state.loaderState,
      pullHeight = _this$state.pullHeight,
      progressed = _this$state.progressed;
    const footer = hasMore ? /*#__PURE__*/React.createElement("div", {
      className: "tloader-footer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tloader-btn",
      onClick: this.loadMore
    }, TLoaderMsg.get('btnLoadMore')), /*#__PURE__*/React.createElement("div", {
      className: "tloader-loading"
    }, /*#__PURE__*/React.createElement("i", {
      className: "ui-loading"
    }), TLoaderMsg.get('loadingMsg'))) : null;
    const style = pullHeight ? {
      WebkitTransform: `translate3d(0,${pullHeight}px,0)`
    } : null;
    let progressClassName = '';
    if (!progressed) {
      if (initializing > 0) progressClassName += ' tloader-progress';
      if (initializing > 1) progressClassName += ' ed';
    }
    return /*#__PURE__*/React.createElement("div", {
      ref: el => {
        this.panel = el;
      },
      className: `tloader state-${loaderState} ${className}${progressClassName}`,
      onScroll: this.scroll,
      onTouchStart: this.touchStart,
      onTouchMove: this.touchMove,
      onTouchEnd: this.touchEnd,
      onAnimationEnd: this.animationEnd
    }, /*#__PURE__*/React.createElement("div", {
      className: "tloader-symbol"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tloader-msg"
    }, /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("div", {
      className: "tloader-loading"
    }, /*#__PURE__*/React.createElement("i", {
      className: "ui-loading"
    }), TLoaderMsg.get('loadingMsg'))), /*#__PURE__*/React.createElement("div", {
      className: "tloader-body",
      style: style
    }, children), footer);
  }
}
Tloader.defaultProps = {
  distanceToRefresh: 60,
  autoLoadMore: 1
};
export default formatterCollections({
  code: ['hmde.common']
})(Tloader);