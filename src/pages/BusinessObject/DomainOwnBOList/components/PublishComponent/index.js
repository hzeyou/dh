import _Dropdown from "@hzero-front-ui/c7n-ui/lib/DropdownPro";
import _Icon from "choerodon-ui/lib/icon";
import _Menu from "@hzero-front-ui/c7n-ui/lib/Menu";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _useModal from "choerodon-ui/pro/lib/use-modal";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _isFunction from "lodash/isFunction";
import _isEmpty from "lodash/isEmpty";
import React, { useState, useRef, useEffect, useMemo } from 'react';
import intl from 'utils/intl';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import AsyncProgress from 'hzero-front-apaas/lib/components/AsyncProgress';
import { getCurrentOrganizationId, getResponse } from 'utils/utils';
import notification from 'utils/notification';
import { observer } from 'mobx-react-lite';
import formatterCollections from 'utils/intl/formatterCollections';
import { clearCache } from 'ahooks';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import { HZERO_HMDE, HZERO_HLOD } from "hzero-front-apaas/lib/utils/config";
import { businessObjectBatchPublish, batchFixPhysical, viewBatchPublish, queryPageDesignConfig, getOBTabFlag } from "hzero-front-hmde/lib/services/businessObjectService";
import PublishDetailModal from "hzero-front-apaas/lib/components/PublishDetailModal/BatchPublishDetail";
import { handleGetProgressRes } from "hzero-front-apaas/lib/components/PublishDetailModal/service";
import { batchPublishTableDs } from "hzero-front-hmde/lib/stores/BusinessObject/BusinessObjectDS";
import BatchPublishModal from "../../BatchPublishModal";
import PublishFailed from "../../PublishFailed";
import PublishWarning from "./components/PublishErrorInfoModal";
import { PublicTypeList } from "../../type";
import styles from "./index.less?modules";
import CascadePublishList from "./cascadePublishList";
const tenantId = getCurrentOrganizationId();
const Index = ({
  publicType,
  progressRef,
  setPublishPercent,
  setLoading,
  boTableDs,
  setPublicType,
  publishFlag,
  setPublishFlag,
  domain,
  successCallback
}) => {
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    iconShow = _useState2[0],
    setIconShow = _useState2[1];
  const _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    interactiveView = _useState4[0],
    setInteractiveView = _useState4[1];
  const _useState5 = useState(''),
    _useState6 = _slicedToArray(_useState5, 2),
    asyncProgressStatus = _useState6[0],
    setAsyncProgressStatus = _useState6[1];
  const batchPublishModalRef = useRef();
  const failedModel = useRef();
  const publishFailedRef = useRef();
  const CModal = _useModal();

  // 是否有交互视图
  useEffect(() => {
    const initPermission = async () => {
      const res = await getOBTabFlag();
      if (getResponse(res)) {
        const isHzeroLowcode = res.content.find(item => item.serviceCode === 'hzero-lowcode');
        // 装了飞搭服务才进行调用
        if (isHzeroLowcode) {
          queryPageDesignConfig().then(data => {
            if (getResponse(data)) {
              if (data.businessObjectPageEnabledFlag === '1') {
                setInteractiveView(true);
              }
            }
          });
        }
      }
    };
    initPermission();
  }, []);
  const publicViewSave = (list, cb) => {
    setLoading(true);
    setPublishFlag(true);
    viewBatchPublish(list).then(res => {
      if (res && res.failed) {
        setPublishFlag(false);
        setLoading(false);
      }
      if (getResponse(res)) {
        // TABLE 物理模型/扩展物理模型不存在 FIELD 物理模型/扩展物理模型与当前业务对象字段属性存在差异 DOMAIN 无更新物理模型权限
        if (['TABLE', 'FIELD', 'DOMAIN', 'API'].includes(res === null || res === void 0 ? void 0 : res.errorType)) {
          openWarningModal({
            errorMessage: res === null || res === void 0 ? void 0 : res.errorMessage,
            cb,
            type: res === null || res === void 0 ? void 0 : res.errorType
          });
          setLoading(false);
          setPublishFlag(false);
          return false;
        } else if (_isFunction(cb)) {
          cb();
        }
      }
    });
  };

  /**
   * @description: 视图发布
   * @param {*} cb   handleQuery 开始查询进度事件
   * @param {*} thisModal 批量发布的大弹窗
   */
  const publicView = (cb, thisModal) => {
    var _batchPublishModalRef, _batchPublishModalRef2, _batchPublishModalRef3;
    if (((_batchPublishModalRef = batchPublishModalRef.current) === null || _batchPublishModalRef === void 0 ? void 0 : (_batchPublishModalRef2 = _batchPublishModalRef.treeSelected) === null || _batchPublishModalRef2 === void 0 ? void 0 : _batchPublishModalRef2.length) === 0) {
      notification.warning({
        message: intl.get('hmde.common.tips').d('提示'),
        description: intl.get('hmde.bo.businessObject.choosePublishView').d('请选择需要发布的视图'),
        placement: 'bottomRight'
      });
      return;
    }
    const list = {};
    (_batchPublishModalRef3 = batchPublishModalRef.current) === null || _batchPublishModalRef3 === void 0 ? void 0 : _batchPublishModalRef3.treeSelected.forEach(item => {
      const p = item.get('parentCode');
      if (p) {
        if (!list[p]) {
          list[p] = [];
        }
        list[p].push(item.get('objectViewCode'));
      }
    });
    _Modal.confirm({
      children: /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.releaseViewConfirm').d('请确认是否批量发布已选择交互视图？')),
      okText: intl.get('hmde.common.button.sure').d('确定'),
      onOk: () => {
        publicViewSave(list, cb);
        thisModal.close();
      }
    });
  };

  /**
   * 发布失败打开失败(修复)或警告(同步)弹窗
   */
  const openWarningModal = ({
    errorMessage = [],
    cb,
    type,
    extendList = []
  }) => {
    var _failedModel$current;
    (_failedModel$current = failedModel.current) === null || _failedModel$current === void 0 ? void 0 : _failedModel$current.update();
    const _extendList = extendList;
    let data;
    let children;
    let footer;
    let list = [];
    let style = {
      width: 595
    };
    switch (type) {
      case 'TABLE':
        data = (errorMessage === null || errorMessage === void 0 ? void 0 : errorMessage.map(item => {
          var _item$businessObject;
          return {
            ...item,
            businessObjectName: item === null || item === void 0 ? void 0 : (_item$businessObject = item.businessObject) === null || _item$businessObject === void 0 ? void 0 : _item$businessObject.businessObjectName,
            message: item === null || item === void 0 ? void 0 : item.message
          };
        })) || [];
        footer = (_, cancelBtn, modal) => /*#__PURE__*/React.createElement(React.Fragment, null, cancelBtn, /*#__PURE__*/React.createElement(_Button, {
          color: "primary",
          onClick: () => {
            var _publishFailedRef$cur;
            // eslint-disable-next-line no-unused-expressions
            const body = ((_publishFailedRef$cur = publishFailedRef.current) === null || _publishFailedRef$cur === void 0 ? void 0 : _publishFailedRef$cur.tableDs.toData().map(item => item === null || item === void 0 ? void 0 : item.businessObject)) || data.map(item => item === null || item === void 0 ? void 0 : item.businessObject);
            batchFixPhysical(body).then(res => {
              // 修复接口
              if (getResponse(res)) {
                if (_isFunction(cb)) {
                  publicObjectSave(cb, _extendList, false);
                }
                modal.close();
              }
            });
          }
        }, intl.get('hmde.bo.businessObject.repairAndRelease').d('修复并发布')));
        children = /*#__PURE__*/React.createElement(PublishFailed, {
          data: data,
          modalRef: publishFailedRef,
          type: type
        });
        break;
      case 'FIELD':
      case 'API':
        // eslint-disable-next-line no-unused-expressions
        errorMessage === null || errorMessage === void 0 ? void 0 : errorMessage.forEach(item => {
          var _item$errorList, _item$validateRuleErr;
          const _errorList = (item === null || item === void 0 ? void 0 : (_item$errorList = item.errorList) === null || _item$errorList === void 0 ? void 0 : _item$errorList.map(field => ({
            ...field,
            ...(item === null || item === void 0 ? void 0 : item.businessObject)
          }))) || [];
          const _validateRuleErrorList = (item === null || item === void 0 ? void 0 : (_item$validateRuleErr = item.validateRuleErrorList) === null || _item$validateRuleErr === void 0 ? void 0 : _item$validateRuleErr.map(field => ({
            ...field,
            ...(item === null || item === void 0 ? void 0 : item.businessObject)
          }))) || [];
          list = list.concat(_errorList, _validateRuleErrorList);
        });
        footer = (_, cancelBtn, modal) => /*#__PURE__*/React.createElement(React.Fragment, null, cancelBtn, /*#__PURE__*/React.createElement(_Button, {
          color: "primary"
          // disabled={
          //   list.filter((i) => i?.level === 'ERROR' || i?.errorLevel === 'ERROR').length > 0
          // }
          ,
          onClick: () => {
            if (_isFunction(cb)) {
              publicObjectSave(cb, _extendList, false);
            }
            modal.close();
          }
        }, intl.get('hmde.common.publish').d('发布')));
        style = {
          width: 957
        };
        data = list;
        children = /*#__PURE__*/React.createElement(PublishWarning, {
          dataSource: data,
          publicObjectSave: publicObjectSave,
          cb: cb,
          _extendList: _extendList
        });
        break;
      case 'DOMAIN':
        footer = okBtn => /*#__PURE__*/React.createElement(React.Fragment, null, okBtn);
        data = (errorMessage === null || errorMessage === void 0 ? void 0 : errorMessage.map(item => ({
          ...item,
          ...(item === null || item === void 0 ? void 0 : item.businessObject)
        }))) || [];
        children = /*#__PURE__*/React.createElement(PublishFailed, {
          data: data,
          modalRef: publishFailedRef,
          type: type
        });
        break;
      default:
        break;
    }
    failedModel.current = _Modal.open({
      title: intl.get('hmde.common.publishDetail').d('发布详情'),
      key: _Modal.key(),
      style,
      resizable: true,
      destroyOnClose: true,
      children,
      footer
    });
  };

  // 批量发布保存

  const publicObjectSave = (cb, extendList = [], firstPublish = true) => {
    let businessObjectIdList = [];
    setLoading(true);
    setPublishFlag(true);
    if (!_isEmpty(extendList)) {
      var _batchPublishModalRef4, _businessObjectItem$f;
      const businessObjectItem = (_batchPublishModalRef4 = batchPublishModalRef.current) === null || _batchPublishModalRef4 === void 0 ? void 0 : _batchPublishModalRef4.toData();
      businessObjectIdList = businessObjectItem === null || businessObjectItem === void 0 ? void 0 : (_businessObjectItem$f = businessObjectItem.filter(item => !(extendList !== null && extendList !== void 0 && extendList.includes(item === null || item === void 0 ? void 0 : item.businessObjectId)))) === null || _businessObjectItem$f === void 0 ? void 0 : _businessObjectItem$f.map(record => record.businessObjectId);
    } else {
      var _batchPublishModalRef5;
      businessObjectIdList = ((_batchPublishModalRef5 = batchPublishModalRef.current) === null || _batchPublishModalRef5 === void 0 ? void 0 : _batchPublishModalRef5.map(record => record === null || record === void 0 ? void 0 : record.get('businessObjectId'))) || [];
    }
    const query = {
      ignoreWarning: !firstPublish
    };
    if (batchPublishDs !== null && batchPublishDs !== void 0 && batchPublishDs.length) {
      businessObjectIdList = [...businessObjectIdList, ...(batchPublishDs === null || batchPublishDs === void 0 ? void 0 : batchPublishDs.map(record => record === null || record === void 0 ? void 0 : record.get('businessObjectId')))];
    }
    businessObjectBatchPublish(businessObjectIdList, query).then(res => {
      if (res && res.failed) {
        setPublishFlag(false);
        setLoading(false);
      }
      if (getResponse(res)) {
        // FIXME 目前无法获取准确的缓存 key, 发布完业务对象，清除全部 useRequest 缓存
        clearCache();
        // TABLE 物理模型/扩展物理模型不存在 FIELD 物理模型/扩展物理模型与当前业务对象字段属性存在差异 DOMAIN 无更新物理模型权限
        if (['TABLE', 'FIELD', 'DOMAIN', 'API'].includes(res === null || res === void 0 ? void 0 : res.errorType)) {
          openWarningModal({
            errorMessage: res === null || res === void 0 ? void 0 : res.errorMessage,
            cb,
            type: res === null || res === void 0 ? void 0 : res.errorType,
            extendList
          });
          setLoading(false);
          setPublishFlag(false);
          return false;
        } else if (_isFunction(cb)) {
          cb();
        }
      }
    });
  };

  /**
   * @description: 业务对象发布二次确认弹窗
   * @param {*} cb   handleQuery 开始查询进度事件
   * @param {*} key 业务对象或者交互视图
   * @param {*} thisModal 批量发布的大弹窗
   * @return {*} 返回false不关闭大弹窗
   */
  const publicObject = (cb, key, thisModal, type, cascadeModal) => {
    var _batchPublishModalRef6, _batchPublishModalRef7;
    if (key === PublicTypeList.publicView) {
      publicView(cb, thisModal);
      return false;
    }
    if (((_batchPublishModalRef6 = batchPublishModalRef.current) === null || _batchPublishModalRef6 === void 0 ? void 0 : (_batchPublishModalRef7 = _batchPublishModalRef6.toData()) === null || _batchPublishModalRef7 === void 0 ? void 0 : _batchPublishModalRef7.length) === 0) {
      notification.warning({
        message: intl.get('hmde.common.tips').d('提示'),
        description: intl.get('hmde.common.chooseObjPub').d('请选择需要发布的对象'),
        placement: 'bottomRight'
      });
      return false;
    }
    if (type) {
      publicObjectSave(cb, undefined, undefined);
      cascadeModal === null || cascadeModal === void 0 ? void 0 : cascadeModal.close();
      thisModal.close();
      return;
    }
    _Modal.confirm({
      children: /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.modeler.releaseConfirm').d('请确认是否批量发布已选择业务对象？')),
      okText: intl.get('hmde.common.button.sure').d('确定'),
      onOk: () => {
        publicObjectSave(cb, undefined, undefined);
        cascadeModal === null || cascadeModal === void 0 ? void 0 : cascadeModal.close();
        thisModal.close();
      }
    });
    return false;
  };

  // 级联发布
  const batchPublishDs = useMemo(() => new _DataSet(batchPublishTableDs()), []);
  const handleCascadePublish = (k, m) => {
    var _batchPublishModalRef8;
    batchPublishDs.query(1, {
      selectList: (_batchPublishModalRef8 = batchPublishModalRef.current) === null || _batchPublishModalRef8 === void 0 ? void 0 : _batchPublishModalRef8.map(record => record === null || record === void 0 ? void 0 : record.get('businessObjectId'))
    }).then(res => {
      if (getResponse(res)) {
        if (res !== null && res !== void 0 && res.length) {
          const handlePub = () => publish(k, m, 'cascade', cascadeModal);
          const cascadeModal = CModal.open({
            title: intl.get('hmde.bo.businessObject.cascadePublishList').d('级联发布对象列表'),
            className: 'batch-publish-modal',
            style: {
              overflow: 'auto',
              width: 957
            },
            closable: true,
            children: /*#__PURE__*/React.createElement(CascadePublishList, {
              tableDs: batchPublishDs
            }),
            onOk: () => handlePub()
          });
        } else {
          publish(k, m, 'cascade');
        }
      }
    });
  };

  /**
   * @description: 打开批量发布弹窗
   * @param {*} key 业务对象或者交互视图
   */
  const publishModalShow = key => {
    setPublicType(key);
    const thisModal = CModal.open({
      title: intl.get('hmde.common.button.batchRelease').d('批量发布'),
      className: 'batch-publish-modal',
      style: {
        overflow: 'auto',
        width: 1200
      },
      closable: true,
      children: /*#__PURE__*/React.createElement(BatchPublishModal, {
        publicType: key,
        onRef: ref => {
          batchPublishModalRef.current = ref;
        },
        domain: domain,
        handleCascadePublish: () => handleCascadePublish(key, thisModal)
      }),
      okText: intl.get('hmde.common.publish').d('发布'),
      onOk: () => publish(key, thisModal)
    });
  };

  /**
   * 发布
   */
  const publish = (key, thisModal, type, cascadeModal) => {
    var _progressRef$current;
    setPublishPercent(0);
    return publicObject(progressRef === null || progressRef === void 0 ? void 0 : (_progressRef$current = progressRef.current) === null || _progressRef$current === void 0 ? void 0 : _progressRef$current.handleQuery, key, thisModal, type, cascadeModal);
  };

  /**
   * 发布成功回调
   */
  const onSuccess = () => {
    setPublishFlag(false);
    setLoading(false);
    boTableDs === null || boTableDs === void 0 ? void 0 : boTableDs.query();
    successCallback === null || successCallback === void 0 ? void 0 : successCallback();
    // const closeKey = `open${Date.now()}`;

    // 修改回调逻辑, 如果有失败项, 直接弹出 发布详情的弹窗
    if (publicType === PublicTypeList.publicObject) {
      var _progressRef$current2, _progressRef$current3;
      handleGetProgressRes({
        businessKey: progressRef === null || progressRef === void 0 ? void 0 : (_progressRef$current2 = progressRef.current) === null || _progressRef$current2 === void 0 ? void 0 : _progressRef$current2.detailData.businessKey,
        jobCode: progressRef === null || progressRef === void 0 ? void 0 : (_progressRef$current3 = progressRef.current) === null || _progressRef$current3 === void 0 ? void 0 : _progressRef$current3.detailData.jobCode
      }).then(res => {
        if (getResponse(res)) {
          var _res$jobStatistics, _res$jobStatistics$fa;
          if (res !== null && res !== void 0 && (_res$jobStatistics = res.jobStatistics) !== null && _res$jobStatistics !== void 0 && (_res$jobStatistics$fa = _res$jobStatistics.failList) !== null && _res$jobStatistics$fa !== void 0 && _res$jobStatistics$fa.length) {
            notification.error({
              duration: 3,
              message: intl.get('hmde.common.publishingFailed').d('发布失败'),
              placement: 'bottomRight'
            });
            openPublishDetailModal();
          } else {
            notification.success({
              duration: 3,
              message: intl.get('hmde.common.successfullyPublished').d('发布成功'),
              placement: 'bottomRight'
            });
          }
        }
      });
      return;
    }
    notification.success({
      duration: 3,
      message: intl.get('hmde.common.successfullyPublished').d('发布成功'),
      placement: 'bottomRight'
    });
  };

  /**
   * 发布失败回调
   */
  const onError = async callback => {
    var _await$callback$;
    setPublishFlag(false);
    setLoading(false);
    notification.warning({
      message: intl.get('hmde.common.publishingFailed').d('发布失败'),
      description: (_await$callback$ = (await (callback === null || callback === void 0 ? void 0 : callback()))[0]) === null || _await$callback$ === void 0 ? void 0 : _await$callback$.message,
      placement: 'bottomRight'
    });
  };

  /**
   * 发布进度条变化回调
   */
  const onProgressChange = (percent, status) => {
    setPublishPercent(percent);
    setAsyncProgressStatus(status);
    publishDataDs === null || publishDataDs === void 0 ? void 0 : publishDataDs.setState('percent', percent);
    publishDataDs === null || publishDataDs === void 0 ? void 0 : publishDataDs.setState('status', status);
  };

  /**
   * 交互视图发布情况
   */
  // const interactivePublishInfo = () => {
  //   if (progressRef?.current?.openAsyncDetail) {
  //     // react18可能要更改下
  //     setTimeout(() => {
  //       setPublicType(PublicTypeList.publicView);
  //       progressRef.current.openAsyncDetail();
  //     });
  //   }
  // };

  /**
   * 业务对象发布情况
   */
  const boPublishInfo = () => {
    var _progressRef$current4;
    if (progressRef !== null && progressRef !== void 0 && (_progressRef$current4 = progressRef.current) !== null && _progressRef$current4 !== void 0 && _progressRef$current4.openAsyncDetail) {
      // react18可能要更改下
      setTimeout(() => {
        setPublicType(PublicTypeList.publicObject);
        progressRef.current.openAsyncDetail();
      });
    }
  };

  // 发布存储数据ds
  const publishDataDs = useMemo(() => new _DataSet({}), []);
  // 发布详情弹窗
  const isOpenFlag = useRef(false);
  const openPublishDetailModal = () => {
    if (isOpenFlag !== null && isOpenFlag !== void 0 && isOpenFlag.current) return;
    isOpenFlag.current = true;
    _Modal.open({
      title: intl.get('hmde.common.publishDetail').d('发布详情'),
      key: _Modal.key(),
      destroyOnClose: true,
      style: {
        width: '957px'
      },
      children: /*#__PURE__*/React.createElement(PublishDetailModal, {
        progressRef: progressRef,
        publishDataDs: publishDataDs
      }),
      onOk: () => {
        isOpenFlag.current = false;
      },
      onCancel: () => {
        isOpenFlag.current = false;
      }
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, interactiveView && /*#__PURE__*/React.createElement(_Dropdown, {
    className: styles.primarybtn,
    disabled: publishFlag,
    onHiddenChange: hidden => {
      setIconShow(!hidden);
    },
    overlay: /*#__PURE__*/React.createElement(_Menu, {
      onClick: ({
        key
      }) => {
        setIconShow(false);
        publishModalShow(key);
      }
    }, /*#__PURE__*/React.createElement(_Menu.Item, {
      key: PublicTypeList.publicObject
    }, intl.get('hmde.bo.businessObject.batchReleaseView').d('批量发布业务对象')))
  }, /*#__PURE__*/React.createElement(_Button, {
    color: "primary"
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "send_publish.svg",
    size: 14,
    style: {
      marginRight: 10
    }
  }), intl.get('hmde.common.button.batchRelease').d('批量发布'), /*#__PURE__*/React.createElement(_Icon, {
    type: "expand_less",
    style: {
      marginLeft: 4
    },
    className: !iconShow && styles.expand_less
  }))), /*#__PURE__*/React.createElement(AsyncProgress, {
    _ref: progressRef,
    jobCode: publicType === PublicTypeList.publicView ? 'businessObjectPageBatchPublishJob' : 'businessObjectBatchPublish' // 任务编码 - 固定的
    ,
    businessKey: `${publicType === PublicTypeList.publicView ? 'businessObjectPageBatchPublishJob' : 'businessObjectBatchPublish'}_${tenantId}` // 业务主键
    ,
    route: publicType === PublicTypeList.publicView ? HZERO_HLOD : HZERO_HMDE // 服务路由
    ,
    timeInterval: 500 // 轮询时间间隔
    ,
    hidden: true,
    style: {
      width: '12px'
    },
    onStart: () => setLoading(true),
    onSuccess: onSuccess,
    onError: onError,
    onChange: onProgressChange,
    openCustomAsyncDetail: publicType === PublicTypeList.publicObject ? openPublishDetailModal : undefined
  }), !interactiveView && /*#__PURE__*/React.createElement(_Button, {
    color: 'primary',
    disabled: publishFlag,
    onClick: () => {
      publishModalShow(PublicTypeList.publicObject);
    },
    className: styles.btn_icon
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "send_publish.svg",
    size: 14,
    style: {
      marginRight: 10
    }
  }), intl.get('hmde.bo.businessObject.batchReleaseView').d('批量发布业务对象')), /*#__PURE__*/React.createElement(_Button, {
    icon: "visibility-o",
    disabled: publishFlag,
    hidden: !asyncProgressStatus,
    onClick: boPublishInfo,
    className: styles.btn_icon
  }, intl.get('hmde.bo.businessObject.releaseBoDetail').d('业务对象发布情况')));
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(Index));