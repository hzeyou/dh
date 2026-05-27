import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
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
// import qs from 'querystring';
import { Tooltip as ToolTipEnum } from 'choerodon-ui/pro/lib/core/enum';
// import AsyncProgress, { IAsyncProgressRef } from 'hzero-front-apaas/lib/components/AsyncProgress';
// import { HZERO_HLOD } from '@apaas/utils/config';
import { PublishStatus } from "hzero-front-apaas/lib/constants/businessObject";
import { operatorRender } from 'utils/renderer';
import { ColumnLock, TableQueryBarType } from 'choerodon-ui/pro/lib/table/enum';
// import Popconfirm from '@hmde/components/Popconfirm';
import LowcodePopconfirm from "hzero-front-apaas/lib/components/LowcodePopconfirm";
import { enableRender } from "hzero-front-apaas/lib/utils/render";
import notification from 'utils/notification';
import {
// getCurrentOrganizationId,
isTenantRoleLevel, getResponse, getCurrentUser } from 'utils/utils';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { pageLayoutPublish,
// pageLayoutPublishRouterList,
newLockedService, newUnLockedService, getAllBusinessPages, newEnableBOPage, newDisableBOPage } from "hzero-front-hmde/lib/services/businessObjectService";
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import { redirectToPageDesignerUrl } from "hzero-front-apaas/lib/utils/common";
import mobileIcon from "hzero-front-hmde/lib/routes/BusinessObject/Detail/CompTemplate/assets/icon/mobile_icon.svg";
import pcIcon from "hzero-front-hmde/lib/routes/BusinessObject/Detail/CompTemplate/assets/icon/pc_icon.svg";
import { useDependenceQuery } from "./components/DependenceQuery/useDependence";
import PageLayoutModalDS from "./components/AddNewPageLayout/ds";
import AddNewPageLayout from "./components/AddNewPageLayout";
import PublishPageTable from "./components/PublishPageTable";
import parentStyles from "../index.less?modules";
import styles from "./index.less?modules";
import { platformType } from "./commonCode";
import { publishStatusRender } from "./components/common";
const Index = props => {
  const pageDS = props.pageDS,
    domainId = props.domainId,
    domainCode = props.domainCode,
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
      const presetPageCode = localStorage.getItem('presetPageCode');
      if (presetPageCode) {
        pageDS.queryDataSet.current.set('pageCode', presetPageCode);
        localStorage.removeItem('presetPageCode');
      }
      pageDS.setQueryParameter('businessObjectCode', businessObjectCode);
      pageDS.query();
      // 不打开弹窗
      // .then(() => {
      //   if (presetPageCode) {
      //     // 调整过来默认打开弹窗
      //     const r = pageDS.find((f) => f.get('pageCode') === presetPageCode);
      //     r && handleEditDetail(r);
      //   }
      // });
    }
  };

  // 进入模板设计器
  const handleTemplateDetail = record => {
    //  跳转到编辑页面
    // http://localhost:8000/pub/hlod/render/bo-page-designer/canvas#?pageCode=34e598057f4f4f1791e77d26d2fa1f8e&businessObjectCode=zq_header

    const params = {
      businessObjectCode: record === null || record === void 0 ? void 0 : record.get('businessObjectCode'),
      businessObjectName,
      // pageCode: record?.get('enabledFlag'),
      pageCode: record === null || record === void 0 ? void 0 : record.get('pageCode'),
      pageType: 'TemplateDesigner',
      domainId,
      domainCode,
      // businessObjectPageType: record?.get('businessObjectPageType'),
      // appId: record?.get('appId'),
      // lowcodePageCode: record?.get('lowcodePageCode'),
      tenantId: record === null || record === void 0 ? void 0 : record.get('tenantId'),
      platform: record === null || record === void 0 ? void 0 : record.get('platform')
    };
    const designerUrl = redirectToPageDesignerUrl(params);

    // 跳转到单模板设计器
    window.open(designerUrl);

    // window.open(
    //   `${process.env.BASE_PATH}pub/hlod/render/bo-page-designer/canvas#?${qs.stringify({
    //     businessObjectCode: record?.get('businessObjectCode'),
    //     businessObjectName,
    //     // pageCode: record?.get('enabledFlag'),
    //     pageCode: record?.get('pageCode'),
    //     pageType: 'TemplateDesigner',
    //     domainId,
    //     domainCode,
    //     // businessObjectPageType: record?.get('businessObjectPageType'),
    //     // appId: record?.get('appId'),
    //     // lowcodePageCode: record?.get('lowcodePageCode'),
    //     tenantId: record?.get('tenantId'),
    //     platform: record?.get('platform'),
    //   })}`,
    // );
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
  // 新建预设页面
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
      }, intl.get('hmde.bo.button.modalCompTemplateTitle').d('新建预设页面')),
      confirmLoading: createLoading,
      businessObjectCode,
      destroyOnClose: true,
      // 关闭时是否销毁
      closable: true,
      // 显示右上角关闭按钮
      children: /*#__PURE__*/React.createElement(AddNewPageLayout, {
        ref: addNewPageLayoutRef,
        domainId: domainId,
        dataSet: dataSet,
        businessObjectCode: businessObjectCode
      }),
      onOk: async () => {
        setCreateLoading(true);
        const res = await addNewPageLayoutRef.current.save();
        setCreateLoading(false);
        if (!res) {
          return false;
        } else {
          init(); // 成功，刷新页面数据
          const result = res[0];
          // 如果同时新建了PC和移动端则不跳转
          if (!result || res.length > 1) return;
          const params = {
            businessObjectCode: result.businessObjectCode,
            businessObjectName,
            // pageCode: record?.get('enabledFlag'),
            pageCode: result.pageCode,
            pageType: 'TemplateDesigner',
            domainId,
            domainCode,
            // businessObjectPageType: record?.get('businessObjectPageType'),
            // appId: record?.get('appId'),
            // lowcodePageCode: record?.get('lowcodePageCode'),
            tenantId: result.tenantId,
            platform: result.platform
          };
          const designerUrl = redirectToPageDesignerUrl(params);

          // 跳转到单模板设计器
          window.open(designerUrl);

          // window.open(
          //   `${process.env.BASE_PATH}pub/hlod/render/bo-page-designer/canvas#?${qs.stringify({
          //     businessObjectCode: result.businessObjectCode,
          //     businessObjectName,
          //     // pageCode: record?.get('enabledFlag'),
          //     pageCode: result.pageCode,
          //     pageType: 'TemplateDesigner',
          //     domainId,
          //     domainCode,
          //     // businessObjectPageType: record?.get('businessObjectPageType'),
          //     // appId: record?.get('appId'),
          //     // lowcodePageCode: record?.get('lowcodePageCode'),
          //     tenantId: result.tenantId,
          //     platform: result.platform,
          //   })}`,
          // );
        }
      },
      style: {
        width: 958
      }
    });
  };

  // 发布预设页面
  const handlePublish = async callback => {
    var _allPages$content;
    const queryObj = {
      page: 0,
      size: 0,
      businessObjectCode,
      enabledFlag: true,
      publishStatus: `${PublishStatus.MODIFIED}, ${PublishStatus.UNPUBLISHED}`,
      sourceType: 'COMPONENT_TEMPLATE'
    };
    if (isTenantRoleLevel()) {
      queryObj.pageType = 'CUSTOM';
    }
    const allPages = await getAllBusinessPages(queryObj, {
      'domain-id': domainId
    });
    if (!getResponse(allPages)) return;
    if (!pageDS.length) {
      _message.warning(isTenantRoleLevel() ? intl.get('hmde.bo.businessObject.waringHelp1').d('租户层暂无自定义预设页面，请新建预设页面后发布') : intl.get('hmde.bo.businessObject.waringHelp2').d('暂无预设页面，请新建预设页面后发布'), undefined, undefined, 'bottomRight');
      return;
    } else if (!(allPages !== null && allPages !== void 0 && (_allPages$content = allPages.content) !== null && _allPages$content !== void 0 && _allPages$content.length)) {
      _message.warning(isTenantRoleLevel() ? intl.get('hmde.bo.businessObject.waringHelp3').d('租户层暂无可发布的预设页面') : intl.get('hmde.bo.businessObject.waringHelp4').d('暂无可发布的预设页面'), undefined, undefined, 'bottomRight');
      return;
    }

    // const treeData = {
    //   businessObjectCode,
    //   businessObjectName,
    //   children: allPages?.content || [],
    // };

    let checkPageList = [];
    const handleSaveCheckPage = list => {
      checkPageList = [...list];
    };
    const handleOk = async () => {
      if (!checkPageList.length) {
        _message.warning(intl.get('hmde.bo.view.selecttheonestemplate').d('请选中需要发布的预设页面'), undefined, undefined, 'bottomRight');
        return false;
      }
      setPublishLoading(true);
      const checkPageCodeList = checkPageList.map(i => i.pageCode);
      const res = await pageLayoutPublish({
        businessObjectCode,
        sourceType: 'COMPONENT_TEMPLATE'
      }, checkPageCodeList, {
        'domain-id': domainId
      });
      if (!getResponse(res)) {
        setPublishLoading(false);
        return;
      }
      const publishedPages = checkPageList.map(i => ({
        ...i,
        publishStatus: PublishStatus.PUBLISHED
      }));
      showRoutesModal(publishedPages); // 暂时新加
      callback();
    };
    Modal.open({
      businessObjectCode,
      destroyOnClose: true,
      // 关闭时是否销毁
      closable: true,
      // 显示右上角关闭按钮
      children: /*#__PURE__*/React.createElement(PublishPageTable, {
        businessObjectCode: businessObjectCode,
        domainId: domainId,
        handleSaveCheckPage: handleSaveCheckPage,
        data: (allPages === null || allPages === void 0 ? void 0 : allPages.content) || [],
        isPublished: false
      }),
      style: {
        width: 650
      },
      title: intl.get('hmde.bo.page.publishTemplatePages').d('发布预设页面'),
      okText: intl.get('hmde.bo.button.publish').d('发布'),
      onOk: handleOk
    });
  };
  const showRoutesModal = async publishedPages => {
    // const routerList = await pageLayoutPublishRouterList(
    //   { businessObjectCode, sourceType: 'COMPONENT_TEMPLATE' },
    //   { 'domain-id': domainId }
    // );
    // if (!getResponse(routerList)) {
    //   setPublishLoading(false);
    //   return;
    // }

    Modal.open({
      businessObjectCode,
      destroyOnClose: true,
      // 关闭时是否销毁
      closable: true,
      // 显示右上角关闭按钮
      children: /*#__PURE__*/React.createElement(PublishPageTable, {
        businessObjectCode: businessObjectCode,
        domainId: domainId,
        data: publishedPages || [],
        isPublished: true
      }),
      style: {
        width: 650
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
      }), /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.template.publishSuccess').d('预设页面发布成功'))),
      footer: okBtn => /*#__PURE__*/React.createElement(React.Fragment, null, okBtn)
    });
    setPublishLoading(false);
  };

  // 编辑详情
  const handleEditDetail = record => {
    const title = intl.get('hmde.common.button.edit').d('编辑');
    const dataSet = new _DataSet(PageLayoutModalDS(businessObjectCode, domainId, true));
    dataSet.create(record.toData());
    dataSet.current.status = 'update';
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

  const _useDependenceQuery = useDependenceQuery(),
    handleOpenDependence = _useDependenceQuery.handleOpenDependence;
  const handleDependence = record => {
    handleOpenDependence(record.toData());
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

  const columns = useMemo(() => {
    return [{
      name: 'pageName',
      width: 200,
      renderer: ({
        value,
        record
      }) => /*#__PURE__*/React.createElement("a", {
        onClick: () => handleTemplateDetail(record)
      }, value)
    }, {
      name: 'pageCode',
      width: 180,
      tooltip: ToolTipEnum.overflow
    }, {
      name: 'platform',
      width: 100,
      renderer: ({
        value
      }) => {
        if (value === platformType.MOBILE) {
          return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("img", {
            style: {
              height: '14px',
              marginRight: '6px'
            },
            src: mobileIcon,
            alt: "icon"
          }), intl.get('hmde.common.platformMobile').d('移动端'));
        }
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("img", {
          style: {
            height: '14px',
            marginRight: '6px'
          },
          src: pcIcon,
          alt: "icon"
        }), intl.get('hmde.common.platformPc').d('PC端'));
      }
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
        // const enableStatusTipsText = enableStatus
        //   ? intl.get('hmde.bo.disableConfirm').d('请确认是否禁用该预设页面') + '？'
        //   : intl.get('hmde.bo.enableConfirm').d('请确认是否启用该预设页面') + '？';
        // const deleteTipsText =
        //   intl.get('hmde.bo.deleteConfirm').d('请确认是否删除该预设页面') + '？';
        let lockByText = '';
        // 根据状态不用，处理不同的操作提示
        // if (publishStatusFlag) {
        //   // 页面已发布
        //   deleteTipsText = intl
        //     .get('hmde.bo.template.deletePublishedConfirm')
        //     .d('删除会导致该预设页面取消发布。请确认是否删除该预设页面？');
        //   if (enableStatus) {
        //     enableStatusTipsText = intl
        //       .get('hmde.bo.template.disablePublishedConfirm')
        //       .d('禁用会导致该预设页面取消发布。请确认是否禁用该预设页面？');
        //   } else {
        //     enableStatusTipsText = intl
        //       .get('hmde.bo.template.enableConfirm')
        //       .d('确认启用该预设页面吗？');
        //   }
        // } else {
        //   // 页面未发布
        //   deleteTipsText = intl
        //     .get('hmde.bo.template.deleteConfirm')
        //     .d('请确认是否删除该预设页面？');
        //   if (enableStatus) {
        //     enableStatusTipsText = intl
        //       .get('hmde.bo.template.disableConfirm')
        //       .d('确认禁用该预设页面吗？');
        //   } else {
        //     enableStatusTipsText = intl
        //       .get('hmde.bo.template.enableConfirm')
        //       .d('确认启用该预设页面吗？');
        //   }
        // }
        // 锁定
        if (lockedStatus) {
          lockByText = `${intl.get('hmde.bo.prePageAfterUnlock').d('解锁后预设页面')}”${record === null || record === void 0 ? void 0 : record.get('pageName')}”${intl.get('hmde.bo.canUnlockByOtherUser').d('可被其他用户编辑，是否解锁')}` + '？';
        } else {
          lockByText = `${intl.get('hmde.bo.prePageBeforeUnlock').d('锁定后预设页面')}“${record === null || record === void 0 ? void 0 : record.get('pageName')}”${intl.get('hmde.bo.canNotUnlockByOtherUser').d('不可被其他用户编辑，是否锁定')}` + '？';
        }
        const operators = [!disableFlag && {
          key: 'edit',
          ele: /*#__PURE__*/React.createElement("a", {
            disabled: disableFlag || isLockedDisabled,
            onClick: () => handleEditDetail(record)
          }, intl.get('hmde.common.button.edit').d('编辑')),
          len: 2,
          // ele里面的中文长度是多少就写多少
          title: intl.get('hmde.common.button.edit').d('编辑') // title写国际化
        }, !disableFlag && {
          key: 'locked',
          ele: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Tooltip, {
            title: lockedStatus ? `${intl.get('hmde.pd.processDefinition.lockedBy', {
              lockByName
            }).d('由【{lockUserName}】锁定')}` : intl.get('hmde.common.button.lock').d('锁定'),
            placement: "top"
          }, /*#__PURE__*/React.createElement(LowcodePopconfirm, {
            title: lockedStatus ? intl.get('hmde.bo.businessObject.page.is').d('是否') + intl.get('hmde.common.button.unlock').d('解锁') : intl.get('hmde.bo.businessObject.page.is').d('是否') + intl.get('hmde.common.button.lock').d('锁定'),
            onConfirm: () => handleLocked(lockedStatus, record),
            content: lockByText
          }, lockedStatus ? /*#__PURE__*/React.createElement("a", {
            hidden: isLockedDisabled
          }, intl.get('hmde.common.button.unlock').d('解锁')) : /*#__PURE__*/React.createElement("a", {
            disabled: isLockedDisabled
          }, intl.get('hmde.common.button.lock').d('锁定')))), /*#__PURE__*/React.createElement(_Tooltip, {
            title: lockedStatus ? intl.get('hmde.bo.businessObject.page.lockBy', {
              user: lockByName
            }).d(`由{user}锁定`) : intl.get('hmde.common.button.lock').d('锁定'),
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
        }, !disableFlag && {
          key: 'enabled',
          ele: /*#__PURE__*/React.createElement(LowcodePopconfirm, {
            title: enableStatus ? intl.get('hmde.bo.businessObject.page.is').d('是否') + intl.get('hmde.common.button.disable').d('禁用') : intl.get('hmde.bo.businessObject.page.is').d('是否') + intl.get('hmde.common.button.enable').d('启用'),
            onConfirm: () => handleEnable(enableStatus, record)
            // content={enableStatusTipsText}
          }, /*#__PURE__*/React.createElement("a", {
            disabled: isPredefinedFlag || disableFlag || isLockedDisabled
          }, enableStatus ? intl.get('hmde.common.button.disable').d('禁用') : intl.get('hmde.common.button.enable').d('启用')))
          // <Popconfirm
          //   placement="top"
          //   onConfirm={() => handleEnable(enableStatus, record)}
          //   title={enableStatusTipsText}
          // >
          //   <a disabled={isPredefinedFlag || disableFlag || isLockedDisabled}>
          //     {enableStatus
          //       ? intl.get('hmde.common.button.disable').d('禁用')
          //       : intl.get('hmde.common.button.enable').d('启用')}
          //   </a>
          // </Popconfirm>
          ,
          len: 2,
          // ele里面的中文长度是多少就写多少
          title: enableStatus ? intl.get('hmde.common.button.disable').d('禁用') : intl.get('hmde.common.button.enable').d('启用') // title写国际化
        }, (!publishStatusFlag || !enableStatus) && !(record !== null && record !== void 0 && record.get('referencedFlag')) && (!isTenantRoleLevel() || isTenantRoleLevel() && (record === null || record === void 0 ? void 0 : record.get('pageType')) === 'CUSTOM') && {
          key: 'delete',
          ele: /*#__PURE__*/React.createElement(LowcodePopconfirm, {
            title: intl.get('hmde.bo.businessObject.deletetip').d('是否删除'),
            onConfirm: () => handleDelete(record)
            // content={deleteTipsText}
          }, /*#__PURE__*/React.createElement("a", {
            disabled: isPredefinedFlag || disableFlag || isLockedDisabled
          }, intl.get('hmde.common.button.delete').d('删除'))),
          len: 2,
          // ele里面的中文长度是多少就写多少
          title: intl.get('hmde.common.button.delete').d('删除') // title写国际化
        }, {
          key: 'dependence',
          ele: /*#__PURE__*/React.createElement("a", {
            onClick: () => handleDependence(record)
          }, intl.get('hmde.common.dependenceFind').d('依赖查询')),
          len: 4,
          // ele里面的中文长度是多少就写多少
          title: intl.get('hmde.common.dependenceFind').d('依赖查询') // title写国际化
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
  }, intl.get('hmde.bo.businessObject.tab.template').d('预设页面')), publishStatus === 'UNPUBLISHED' ? /*#__PURE__*/React.createElement("div", {
    className: styles.empty
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "no-page.png",
    size: 140
  }), /*#__PURE__*/React.createElement("div", {
    className: styles.text
  }, /*#__PURE__*/React.createElement("p", null, intl.get('hmde.bo.noPresetPage').d('暂无预设页面'), "\uFF0C"), /*#__PURE__*/React.createElement("p", null, intl.get('hmde.bo.createNewPageAfterPublished').d('请在发布业务对象后，新建预设页面'), "\u3002"))) : /*#__PURE__*/React.createElement(_Table, {
    dataSet: pageDS,
    queryBar: "filterBar",
    columns: columns,
    buttons: buttons,
    queryBarProps: {
      queryFieldsLimit: 4,
      fuzzyQueryPlaceholder: intl.get('hmde.common.template.fuzzyQueryPlaceholder1').d('请输入名称、编码、描述')
    }
  }));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Index));