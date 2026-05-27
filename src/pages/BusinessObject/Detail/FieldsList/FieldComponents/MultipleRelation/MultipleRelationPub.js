import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Progress from "@hzero-front-ui/c7n-ui/lib/ProgressPro";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _isFunction from "lodash/isFunction";
import React, { useRef, useState, useImperativeHandle } from 'react';
import AsyncProgress from 'hzero-front-apaas/lib/components/AsyncProgress';
import { getCurrentTenant, getResponse } from 'utils/utils';
import notification from 'utils/notification';
import intl from 'utils/intl';
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import useThemeColor from "hzero-front-apaas/lib/hooks/useThemeColor";
import { usePublicBusinessObjects } from "hzero-front-apaas/lib/hooks/PublicObject";
import styles from "./index.less?modules";
const MultipleRelationPub = ({
  children,
  pubRef,
  handleSaveResult,
  businessObjectCode
}) => {
  var _getCurrentTenant;
  const themColor = useThemeColor();
  const progressRef = useRef({});
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    publishFlag = _useState2[0],
    setPublishFlag = _useState2[1];
  const _useState3 = useState(0),
    _useState4 = _slicedToArray(_useState3, 2),
    publishPercent = _useState4[0],
    setPublishPercent = _useState4[1];
  const _useState5 = useState(''),
    _useState6 = _slicedToArray(_useState5, 2),
    boId = _useState6[0],
    setBoId = _useState6[1];
  const _useState7 = useState(businessObjectCode),
    _useState8 = _slicedToArray(_useState7, 2),
    boCode = _useState8[0],
    setBoCode = _useState8[1];
  const _useState9 = useState(''),
    _useState10 = _slicedToArray(_useState9, 2),
    token = _useState10[0],
    setToken = _useState10[1];
  const _usePublicBusinessObj = usePublicBusinessObjects({
      _businessObjectId: boId,
      setPublishFlag,
      token
    }),
    handlePublicObject = _usePublicBusinessObj.handlePublicObject;
  useImperativeHandle(pubRef, () => ({
    handlePublish
  }));
  const handlePublish = (id, code, _token) => {
    var _progressRef$current;
    setBoId(id);
    setBoCode(code);
    setToken(_token);
    const cb = progressRef === null || progressRef === void 0 ? void 0 : (_progressRef$current = progressRef.current) === null || _progressRef$current === void 0 ? void 0 : _progressRef$current.handleQuery;
    setPublishFlag(true);
    handlePublicObject(undefined, cb, {
      validateAfterPublish: false
    }).then(res => {
      if (!res) {
        setPublishFlag(false);
      }
      if (getResponse(res)) {
        if (_isFunction(cb)) {
          cb();
        }
      }
      return res;
    });
  };
  const handleSuccess = () => {
    setPublishFlag(false);
    handleSaveResult();
  };
  const onError = async callback => {
    var _await$callback, _await$callback$;
    setPublishFlag(false);
    notification.warning({
      message: intl.get('hmde.common.publishingFailed').d('发布失败'),
      description: (_await$callback = await (callback === null || callback === void 0 ? void 0 : callback())) === null || _await$callback === void 0 ? void 0 : (_await$callback$ = _await$callback[0]) === null || _await$callback$ === void 0 ? void 0 : _await$callback$.message,
      placement: 'bottomRight'
    });
  };
  return /*#__PURE__*/React.createElement(_Spin, {
    spinning: publishFlag,
    indicator: /*#__PURE__*/React.createElement("div", {
      className: styles['spin-inner-content']
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        marginRight: 10
      }
    }, /*#__PURE__*/React.createElement(_Progress, {
      value: publishPercent,
      status: 'active',
      strokeColor: themColor === null || themColor === void 0 ? void 0 : themColor.primary
    }))),
    wrapperClassName: styles['spin-inner-content-box']
  }, children, /*#__PURE__*/React.createElement(AsyncProgress, {
    _ref: progressRef,
    jobCode: "businessObjectPublish" // 任务编码 - 固定的
    ,
    businessKey: `${boCode}_${(_getCurrentTenant = getCurrentTenant()) === null || _getCurrentTenant === void 0 ? void 0 : _getCurrentTenant.tenantId}` // 业务主键
    ,
    route: HZERO_HMDE // 服务路由
    ,
    timeInterval: 500 // 轮询时间间隔
    ,
    onSuccess: handleSuccess,
    onStart: () => {
      setPublishFlag(true);
    },
    onError: async callback => onError(callback),
    onChange: percent => {
      setPublishPercent(percent);
    },
    style: {
      width: '12px'
    },
    hidden: true // 界面不显示，但是需要这个功能，通过 ref 操控
    ,
    backgroundRefresh: true
  }));
};
export default MultipleRelationPub;