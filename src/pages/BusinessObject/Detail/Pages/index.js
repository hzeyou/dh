import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Popconfirm from "@hzero-front-ui/c7n-ui/lib/Popconfirm";
import _Badge from "@hzero-front-ui/c7n-ui/lib/Badge";
import _Icon from "choerodon-ui/pro/lib/icon";
import _message from "@hzero-front-ui/c7n-ui/lib/Message";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _useModal from "choerodon-ui/pro/lib/use-modal";
// @ts-nocheck
import React, { useMemo, useRef, useState, useEffect } from 'react';
import intl from 'utils/intl';
// import { handleCopy } from '@hmde/utils/common';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import qs from 'querystring';
import { Tooltip as ToolTipEnum } from 'choerodon-ui/pro/lib/core/enum';
// import AsyncProgress, { IAsyncProgressRef } from 'hzero-front-apaas/lib/components/AsyncProgress';
// import { HZERO_HLOD } from '@apaas/utils/config';
import { PublishStatus } from "hzero-front-apaas/lib/constants/businessObject";
import { operatorRender } from 'utils/renderer';
import { ColumnLock, TableQueryBarType } from 'choerodon-ui/pro/lib/table/enum';
import { enableRender } from "hzero-front-apaas/lib/utils/render";
import notification from 'utils/notification';
import {
// getCurrentOrganizationId,
isTenantRoleLevel, getResponse, getCurrentUser } from 'utils/utils';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { pageLayoutPublish, pageLayoutPublishRouterList, newLockedService, newUnLockedService, getAllBusinessPages, newEnableBOPage, newDisableBOPage, disablePageCustom, enablePageCustom } from "hzero-front-hmde/lib/services/businessObjectService";
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import PageLayoutModalDS from "./components/AddNewPageLayout/ds";
import AddNewPageLayout from "./components/AddNewPageLayout";
import PublishedModalContent from "./components/PublishedModalContent";
import PublishPageSelection from "./components/PublishPageSelection";
import parentStyles from "../index.less?modules";
import styles from "./index.less?modules";
const Index = props => {
  const pageDS = props.pageDS,
    domainId = props.domainId,
    businessObjectCode = props.businessObjectCode,
    publishStatus = props.publishStatus,
    businessObjectName = props.businessObjectName;
  const Modal = _useModal();
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    createLoading = _useState2[0],
    setCreateLoading = _useState2[1];
  const _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    publishLoading = _useState4[0],
    setPublishLoading = _useState4[1];
  const addNewPageLayoutRef = useRef({});
  const editPageLayoutRef = useRef({});
  // const progressRef = useRef({} as IAsyncProgressRef);

  useEffect(() => {
    init();
  }, []);

  // 初始化
  const init = () => {
    if (businessObjectCode) {
      pageDS.setQueryParameter('businessObjectCode', businessObjectCode);
      pageDS.query();
    }
  };

  // 编辑详情
  const handleDetail = record => {
    //  跳转到编辑页面
    // http://localhost:8000/pub/hlod/render/bo-page-designer/canvas#?pageCode=34e598057f4f4f1791e77d26d2fa1f8e&businessObjectCode=zq_header
    window.open(`${process.env.BASE_PATH}pub/hlod/render/bo-page-designer/canvas#?${qs.stringify({
      businessObjectCode: record === null || record === void 0 ? void 0 : record.get('businessObjectCode'),
      businessObjectName,
      // pageCode: record?.get('enabledFlag'),
      pageCode: record === null || record === void 0 ? void 0 : record.get('pageCode'),
      pageType: 'UIPageDesigner',
      domainId,
      // businessObjectPageType: record?.get('businessObjectPageType'),
      // appId: record?.get('appId'),
      // lowcodePageCode: record?.get('lowcodePageCode'),
      tenantId: record === null || record === void 0 ? void 0 : record.get('tenantId')
    })}`);
  };

  // 字段删除
  const handleDelete = record => {
    pageDS.delete(record, false);
  };

  // 禁用/启用
  const handleEnable = (flag, data) => {
    if (flag) {
      newDisableBOPage({
        body: data === null || data === void 0 ? void 0 : data.toData()
      }, {
        'domain-id': domainId
      }).then(res => {
        if (getResponse(res)) {
          pageDS.query();
          notification.success({});
        }
      });
    } else {
      newEnableBOPage({
        body: data === null || data === void 0 ? void 0 : data.toData()
      }, {
        'domain-id': domainId
      }).then(res => {
        if (getResponse(res)) {
          pageDS.query();
          notification.success({});
        }
      });
    }
  };
  const handleLocked = (flag, data) => {
    if (flag) {
      newUnLockedService({
        body: data === null || data === void 0 ? void 0 : data.toData()
      }, {
        'domain-id': domainId
      }).then(res => {
        if (getResponse(res)) {
          pageDS.query();
          notification.success({});
        }
      });
    } else {
      newLockedService({
        body: data === null || data === void 0 ? void 0 : data.toData()
      }, {
        'domain-id': domainId
      }).then(res => {
        if (getResponse(res)) {
          pageDS.query();
          notification.success({});
        }
      });
    }
  };
  // 新建布局
  const handleAdd = () => {
    pageDS.current = undefined;
    const dataSet = new _DataSet(PageLayoutModalDS(businessObjectCode, domainId));
    dataSet.create();
    Modal.open({
      title: /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: '.16rem',
          fontWeight: 'bold'
        }
      }, intl.get('hmde.bo.button.modalLayoutTitle').d('新建交互视图')),
      confirmLoading: createLoading,
      businessObjectCode,
      destroyOnClose: true,
      // 关闭时是否销毁
      closable: true,
      // 显示右上角关闭按钮
      children: /*#__PURE__*/React.createElement(AddNewPageLayout, {
        ref: addNewPageLayoutRef,
        domainId: domainId,
        dataSet: dataSet
      }),
      onOk: async () => {
        setCreateLoading(true);
        const res = await addNewPageLayoutRef.current.save();
        setCreateLoading(false);
        if (!res) {
          return false;
        } else {
          init(); // 成功，刷新页面数据
        }
      },
      style: {
        width: 540
      }
    });
  };

  // 发布布局
  const handlePublish = async callback => {
    var _allPages$content;
    const queryObj = {
      page: 0,
      size: 0,
      businessObjectCode,
      enabledFlag: true,
      sourceType: 'BUSINESS_OBJECT'
    };
    if (isTenantRoleLevel()) {
      queryObj.pageType = 'CUSTOM';
    }
    const allPages = await getAllBusinessPages(queryObj, {
      'domain-id': domainId
    });
    if (!getResponse(allPages)) return;
    if (!(allPages !== null && allPages !== void 0 && (_allPages$content = allPages.content) !== null && _allPages$content !== void 0 && _allPages$content.length)) {
      _message.warning(intl.get('hmde.bo.view.nocustominteractive').d('租户层暂无自定义交互视图，请新建自定义视图后发布'), undefined, undefined, 'bottomRight');
      return;
    }
    const treeData = {
      businessObjectCode,
      businessObjectName,
      children: (allPages === null || allPages === void 0 ? void 0 : allPages.content) || []
    };
    let checkPageList = [];
    const handleSaveCheckPage = list => {
      checkPageList = [...list];
    };
    const handleOk = async () => {
      if (!checkPageList.length) {
        _message.warning(intl.get('hmde.bo.view.selecttheones').d('请选中需要发布的交互视图'), undefined, undefined, 'bottomRight');
        return false;
      }
      setPublishLoading(true);
      const res = await pageLayoutPublish({
        businessObjectCode,
        sourceType: 'BUSINESS_OBJECT'
      }, checkPageList, {
        'domain-id': domainId
      });
      if (!getResponse(res)) {
        setPublishLoading(false);
        return;
      }
      showRoutesModal(); // 暂时新加
      callback();
    };
    Modal.open({
      businessObjectCode,
      destroyOnClose: true,
      // 关闭时是否销毁
      closable: true,
      // 显示右上角关闭按钮
      children: /*#__PURE__*/React.createElement(PublishPageSelection, {
        handleSaveCheckPage: handleSaveCheckPage,
        data: treeData
      }),
      style: {
        width: 600
      },
      title: intl.get('hmde.bo.page.publishPages').d('发布交互视图'),
      okText: intl.get('hmde.common.publish').d('发布'),
      onOk: handleOk
    });
  };
  const showRoutesModal = async () => {
    const routerList = await pageLayoutPublishRouterList({
      businessObjectCode,
      sourceType: 'BUSINESS_OBJECT'
    }, {
      'domain-id': domainId
    });
    if (!getResponse(routerList)) {
      setPublishLoading(false);
      return;
    }
    Modal.open({
      businessObjectCode,
      destroyOnClose: true,
      // 关闭时是否销毁
      closable: true,
      // 显示右上角关闭按钮
      children: /*#__PURE__*/React.createElement(PublishedModalContent, {
        routerList: routerList
      }),
      style: {
        width: 807
      },
      afterClose: () => {
        init(); // 成功，刷新页面数据
      },
      title: /*#__PURE__*/React.createElement("div", {
        className: styles['success-wrap']
      }, /*#__PURE__*/React.createElement(_Icon, {
        type: "check_circle",
        style: {
          color: '#11D954',
          fontSize: 18,
          marginRight: 4
        }
      }), /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.page.publishSuccess').d('交互视图发布成功'))),
      footer: okBtn => /*#__PURE__*/React.createElement(React.Fragment, null, okBtn)
    });
    setPublishLoading(false);
  };

  // 编辑详情
  const handleEditDetail = record => {
    const title = intl.get('hmde.common.button.edit').d('编辑');
    const dataSet = new _DataSet(PageLayoutModalDS(businessObjectCode, domainId, true));
    dataSet.create(record.toData());
    return Modal.open({
      drawer: true,
      width: 520,
      closable: true,
      title,
      children: /*#__PURE__*/React.createElement(AddNewPageLayout, {
        dataSet: dataSet,
        isEdit: true,
        ref: editPageLayoutRef
      }),
      onOk: async () => {
        if (!dataSet.dirty) {
          // 没有编辑，那就不用返回 Promise 导致出来一个弹框的BUG
          return;
        }
        setCreateLoading(true);
        const res = await editPageLayoutRef.current.save();
        setCreateLoading(false);
        if (!res) {
          return false;
        } else {
          init(); // 成功，刷新页面数据
        }
      },
      onCancel: () => {
        record.reset();
      }
    });
  };

  // const copyInfo = (e, text: string, successMessage?: any) => {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   handleCopy(text, successMessage);
  // };

  const publishStatusRender = ({
    value
  }) => {
    const statusObj = {
      [PublishStatus.PUBLISHED]: {
        status: 'success',
        text: intl.get('hmde.common.status.published').d('已发布')
      },
      [PublishStatus.UNPUBLISHED]: {
        status: 'error',
        text: intl.get('hmde.common.status.unpublished').d('未发布')
      },
      [PublishStatus.MODIFIED]: {
        status: 'warning',
        text: intl.get('hmde.common.status.modified').d('已修改')
      }
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "bo-enable-render"
    }, /*#__PURE__*/React.createElement(_Badge, {
      status: statusObj[value].status,
      text: statusObj[value].text
    }));
  };

  // const lowcodePageRouteRender = ({ text = '' }) => {
  //   if (!text) {
  //     return;
  //   }

  //   const basePath = `${process.env.BASE_PATH}`;
  //   const path = basePath.endsWith('/') && text.startsWith('/') ? text.slice(1) : text; // 解决路径拼接出现双划线问题
  //   const showRouterUrl = `${window.location.protocol}//${window.location.host}${basePath}${path}`;
  //   return (
  //     <Tooltip title={text}>
  //       <a
  //         href="javascript: void(0)" // eslint-disable-line
  //         onClick={(e) => copyInfo(e, showRouterUrl)}
  //       >
  //         {text}
  //       </a>
  //     </Tooltip>
  //   );
  // };

  const handleIndividualization = async record => {
    const data = record.toData();
    const request = record !== null && record !== void 0 && record.get('customFlag') ? disablePageCustom : enablePageCustom;
    const res = await request(data, {
      'domain-id': domainId
    });
    if (getResponse(res)) {
      pageDS.query();
      notification.success({});
    }
  };
  const columns = useMemo(() => {
    return [{
      name: 'pageName',
      width: 200,
      renderer: ({
        value,
        record
      }) => /*#__PURE__*/React.createElement("a", {
        onClick: () => handleDetail(record)
      }, value)
    }, {
      name: 'pageCode',
      width: 180,
      tooltip: ToolTipEnum.overflow
    }, {
      name: 'publishStatus',
      width: 100,
      tooltip: ToolTipEnum.overflow,
      renderer: publishStatusRender
    },
    // {
    //   name: 'lowcodePageRoute',
    //   width: 180,
    //   // tooltip: Tooltip.overflow,
    //   renderer: lowcodePageRouteRender as Renderer,
    // },
    {
      name: 'pageType',
      renderer: ({
        text
      }) => text
    }, {
      name: 'pageCategory' // 交互视图类型
    }, {
      name: 'enabledFlag',
      renderer: ({
        value
      }) => enableRender(value)
    },
    // {
    //   name: 'businessObjectPageType',
    //   renderer: ({ text }) => text,
    // },
    {
      name: 'remark',
      width: 200
    }, {
      name: 'creator'
    }, {
      name: 'creationDate',
      width: 180
    }, {
      name: 'updater'
    }, {
      name: 'lastUpdateDate',
      width: 180
    }, {
      header: intl.get('hmde.common.table.column.operate').d('操作'),
      width: 150,
      renderer: ({
        record
      }) => {
        var _getCurrentUser;
        const isPredefinedFlag = (record === null || record === void 0 ? void 0 : record.get('pageType')) === 'DEFAULT';
        const enableStatus = record === null || record === void 0 ? void 0 : record.get('enabledFlag');
        const lockedStatus = record === null || record === void 0 ? void 0 : record.get('lockedFlag');
        const lockBy = record === null || record === void 0 ? void 0 : record.get('lockedBy');
        const lockByName = record === null || record === void 0 ? void 0 : record.get('lockedByUserName');
        const isLockedDisabled = lockedStatus && ((_getCurrentUser = getCurrentUser()) === null || _getCurrentUser === void 0 ? void 0 : _getCurrentUser.id) !== lockBy && lockBy;
        const disableFlag = isTenantRoleLevel() && (record === null || record === void 0 ? void 0 : record.get('tenantId')) === 0; // 租户层,禁用平台的交互视图操作按钮

        // 这里用行上【页面】的状态，不要跟【业务对象】的状态混了
        const publishStatusFlag = ['PUBLISHED', 'MODIFIED'].indexOf(record === null || record === void 0 ? void 0 : record.get('publishStatus')) > -1;
        let enableStatusTipsText = '';
        let deleteTipsText = '';
        let lockByText = '';
        // 根据状态不用，处理不同的操作提示
        if (publishStatusFlag) {
          // 页面已发布
          deleteTipsText = intl.get('hmde.bo.page.deletePublishedConfirm').d('删除会导致该交互视图取消发布。请确认是否删除该交互视图？');
          if (enableStatus) {
            enableStatusTipsText = intl.get('hmde.bo.page.disablePublishedConfirm').d('禁用会导致该交互视图取消发布。请确认是否禁用该交互视图？');
          } else {
            enableStatusTipsText = intl.get('hmde.bo.page.enableConfirm').d('确认启用该交互视图吗？');
          }
        } else {
          // 页面未发布
          deleteTipsText = intl.get('hmde.bo.page.deleteConfirm').d('请确认是否删除该交互视图？');
          if (enableStatus) {
            enableStatusTipsText = intl.get('hmde.bo.page.disableConfirm').d('确认禁用该交互视图吗？');
          } else {
            enableStatusTipsText = intl.get('hmde.bo.page.enableConfirm').d('确认启用该交互视图吗？');
          }
        }
        // 锁定
        if (lockedStatus) {
          lockByText = `${intl.get('hmde.bo.unLockViewMap').d('解锁后交互视图')}“${record === null || record === void 0 ? void 0 : record.get('pageName')}”${intl.get('hmde.bo.template.canEditByOthers').d('可被其他用户编辑，是否解锁？')}`;
        } else {
          lockByText = `${intl.get('hmde.bo.template.lockViewMap').d('锁定后交互视图')}“${record === null || record === void 0 ? void 0 : record.get('pageName')}”${intl.get('hmde.bo.template.cantEditByOthers').d('不可被其他用户编辑，是否锁定？')}`;
        }
        const customTipText = record !== null && record !== void 0 && record.get('customFlag') ? intl.get('hmde.bo.page.customTipText2').d('关闭后，租户不可再修改当前页面。已产生的租户个性化数据不受影响。') : intl.get('hmde.bo.page.customTipText1').d('开启后，租户将可以修改当前页面。修改仅对该租户生效。');
        const operators = [{
          key: 'edit',
          ele: /*#__PURE__*/React.createElement("a", {
            disabled: disableFlag || isLockedDisabled,
            onClick: () => handleEditDetail(record)
          }, intl.get('hmde.common.button.edit').d('编辑')),
          len: 2,
          // ele里面的中文长度是多少就写多少
          title: intl.get('hmde.common.button.edit').d('编辑') // title写国际化
        }, {
          key: 'locked',
          ele: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Tooltip, {
            title: lockedStatus ? `${intl.get('hmde.pd.processDefinition.lockedBy', {
              lockByName
            }).d('由【{lockUserName}】锁定')}` : intl.get('hmde.common.button.lock').d('锁定'),
            placement: "top"
          }, /*#__PURE__*/React.createElement(_Popconfirm, {
            placement: "top",
            onConfirm: () => handleLocked(lockedStatus, record),
            title: lockByText
          }, lockedStatus ? /*#__PURE__*/React.createElement("a", {
            hidden: isLockedDisabled
          }, intl.get('hmde.common.button.unlock').d('解锁')) : /*#__PURE__*/React.createElement("a", {
            disabled: isLockedDisabled
          }, intl.get('hmde.common.button.lock').d('锁定')))), /*#__PURE__*/React.createElement(_Tooltip, {
            title: lockedStatus ? `${intl.get('hmde.pd.processDefinition.lockedBy', {
              lockByName
            }).d('由【{lockUserName}】锁定')}` : intl.get('hmde.common.button.lock').d('锁定'),
            placement: "top"
          }, /*#__PURE__*/React.createElement("a", {
            hidden: !isLockedDisabled,
            style: {
              color: 'grey'
            }
          }, intl.get('hmde.common.button.unlock').d('解锁')))),
          len: 2,
          // ele里面的中文长度是多少就写多少
          noTooltip: true,
          title: lockedStatus ? intl.get('hmde.common.button.unlock').d('解锁') : intl.get('hmde.common.button.lock').d('锁定') // title写国际化
        }, {
          key: 'enabled',
          ele: /*#__PURE__*/React.createElement(_Popconfirm, {
            placement: "top",
            onConfirm: () => handleEnable(enableStatus, record),
            title: enableStatusTipsText
          }, /*#__PURE__*/React.createElement("a", {
            disabled: isPredefinedFlag || disableFlag || isLockedDisabled
          }, enableStatus ? intl.get('hmde.common.button.disable').d('禁用') : intl.get('hmde.common.button.enable').d('启用'))),
          len: 2,
          // ele里面的中文长度是多少就写多少
          title: enableStatus ? intl.get('hmde.common.button.disable').d('禁用') : intl.get('hmde.common.button.enable').d('启用') // title写国际化
        }, {
          key: 'delete',
          ele: /*#__PURE__*/React.createElement(_Popconfirm, {
            onConfirm: () => handleDelete(record),
            placement: "top",
            title: deleteTipsText
          }, /*#__PURE__*/React.createElement("a", {
            disabled: disableFlag || isLockedDisabled
          }, intl.get('hmde.common.button.delete').d('删除'))),
          len: 2,
          // ele里面的中文长度是多少就写多少
          title: intl.get('hmde.common.button.delete').d('删除') // title写国际化
        }, !isTenantRoleLevel() && {
          key: 'custom',
          ele: /*#__PURE__*/React.createElement(_Popconfirm, {
            onConfirm: () => handleIndividualization(record),
            placement: "top",
            title: customTipText
          }, /*#__PURE__*/React.createElement("a", {
            disabled: isLockedDisabled
          }, record !== null && record !== void 0 && record.get('customFlag') ? intl.get('hmde.common.button.close').d('关闭') : intl.get('hmde.common.button.open').d('开启'), intl.get('hmde.common.view.personalizedEvents').d('个性化'))),
          len: 5,
          // ele里面的中文长度是多少就写多少
          title: `${record !== null && record !== void 0 && record.get('customFlag') ? intl.get('hmde.common.button.close').d('关闭') : intl.get('hmde.common.button.open').d('开启')}${intl.get('hmde.common.view.personalizedEvents').d('个性化')}` // title写国际化
        }].filter(Boolean);
        return operatorRender(operators, record, {
          limit: 3
        });
      },
      lock: "right"
    }];
  }, []);
  const addBtn = /*#__PURE__*/React.createElement(_Button, {
    icon: "add",
    onClick: handleAdd,
    key: "add"
  }, intl.get('hmde.common.button.create').d('新建'));
  const publishBtn = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Button, {
    loading: publishLoading,
    color: "primary",
    funcType: "flat",
    icon: "publish2"
    // onClick={() => handlePublish(progressRef?.current?.handleQuery)}
    ,
    onClick: () => handlePublish(() => {})
  }, intl.get('hmde.common.publish').d('发布')));
  const buttons = [];
  if (isTenantRoleLevel()) {
    if ([PublishStatus.PUBLISHED, PublishStatus.MODIFIED].indexOf(publishStatus) > -1) {
      // 业务对象【已发布】和【已修改】 的状态才能新增和发布 交互视图
      buttons.push(addBtn);
      buttons.push(publishBtn);
    }
  } else {
    buttons.push(addBtn);
    if ([PublishStatus.PUBLISHED, PublishStatus.MODIFIED].indexOf(publishStatus) > -1) {
      // 业务对象【已发布】和【已修改】 的状态才能发布 交互视图
      buttons.push(publishBtn);
    }
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", {
    className: parentStyles.title,
    style: {
      marginBottom: '12px'
    }
  }, intl.get('hmde.bo.businessObject.tab.pages').d('交互视图')), publishStatus === 'UNPUBLISHED' ? /*#__PURE__*/React.createElement("div", {
    className: styles.empty
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "no-page.png",
    size: 140
  }), /*#__PURE__*/React.createElement("div", {
    className: styles.text
  }, /*#__PURE__*/React.createElement("p", null, intl.get('hmde.bo.page.none').d('暂无交互视图，')), /*#__PURE__*/React.createElement("p", null, intl.get('hmde.bo.page.none.help').d('请在发布业务对象后，查看编辑默认交互视图 或 新建自定义交互视图。')))) : /*#__PURE__*/React.createElement(_Table, {
    dataSet: pageDS,
    queryBar: "filterBar",
    columns: columns,
    buttons: buttons
  }));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Index));