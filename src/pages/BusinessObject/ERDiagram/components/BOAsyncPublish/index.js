import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import intl from 'utils/intl';
import { useObserver } from 'mobx-react-lite';
import AsyncProgress from 'hzero-front-apaas/lib/components/AsyncProgress';
import { getCurrentTenant } from 'utils/utils';
import notification from 'utils/notification';
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { useERStore } from "../../stores";
const BOAsyncPublish = /*#__PURE__*/forwardRef(({
  businessObjectCode,
  setLoading,
  setPublishPercent
}, ref) => {
  const progressRef = useRef({});
  const erStore = useERStore();
  useImperativeHandle(ref, () => {
    return {
      progressRef
    };
  });
  return useObserver(() => {
    var _getCurrentTenant;
    return /*#__PURE__*/React.createElement(AsyncProgress, {
      _ref: progressRef,
      jobCode: "businessObjectPublish" // 任务编码 - 固定的
      ,
      businessKey: `${businessObjectCode}_${(_getCurrentTenant = getCurrentTenant()) === null || _getCurrentTenant === void 0 ? void 0 : _getCurrentTenant.tenantId}` // 业务主键
      ,
      route: HZERO_HMDE // 服务路由
      ,
      timeInterval: 500 // 轮询时间间隔
      ,
      hidden: true,
      style: {
        width: '12px'
      },
      onStart: () => setLoading(true),
      onSuccess: () => {
        var _erStore$getState;
        setLoading(false);
        (_erStore$getState = erStore.getState('updateGraphCells')) === null || _erStore$getState === void 0 ? void 0 : _erStore$getState();
      },
      onError: async callback => {
        var _await$callback, _await$callback$;
        setLoading(false);
        notification.warning({
          message: intl.get('hmde.common.publishingFailed').d('发布失败'),
          description: (_await$callback = await (callback === null || callback === void 0 ? void 0 : callback())) === null || _await$callback === void 0 ? void 0 : (_await$callback$ = _await$callback[0]) === null || _await$callback$ === void 0 ? void 0 : _await$callback$.message,
          placement: 'bottomRight'
        });
      },
      onChange: percent => {
        setPublishPercent(percent);
      }
    });
  });
});
export default BOAsyncPublish;