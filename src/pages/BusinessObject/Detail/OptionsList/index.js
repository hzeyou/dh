import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Popconfirm from "@hzero-front-ui/c7n-ui/lib/Popconfirm";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _useModal from "choerodon-ui/pro/lib/use-modal";
/*
 * @Descripttion: 值列表列表
 * @Date: 2021-08-10 15:59:16
 * @Author: ZHIJIAN.XU@HAND-CHINA.COM
 * @version: 0.0.1
 * @copyright: Copyright (c) 2021, Hand
 */
import React, { useMemo, useEffect, useState } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { operatorRender, yesOrNoRender } from 'utils/renderer';
import { enableRender } from "hzero-front-apaas/lib/utils/render";
import { isTenantRoleLevel, getResponse } from 'utils/utils';
import notification from 'utils/notification';
import { observer } from 'mobx-react-lite';
import { TableQueryBarType, ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import { lowcodeRequest as request } from "hzero-front-hmde/lib/utils/lowcodeRequest"; // 权限的APPID添加
import { SourceType } from "hzero-front-apaas/lib/constants/businessObject";
import { disableOption, enableOption, apiInterFaceList } from "hzero-front-hmde/lib/services/businessObjectService";
import { FN } from "hzero-front-hmde/lib/stores/BusinessObject/OptionListDS";
import BOPermissionButton from "hzero-front-hmde/lib/routes/BusinessObject/Detail/components/BOPermissionButton";
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
import PopconfirmButton from "hzero-front-hmde/lib/components/PopconfirmButton";
import { renderPopConfirmTitle } from "hzero-front-apaas/lib/utils/render";
import ValueList from "./ValueList";
import OptionForm from "./OptionForm";
import styles from "./index.less?modules";
const isTenant = isTenantRoleLevel();
const OptionList = props => {
  var _boStore$getState;
  const businessObjectId = props.match.params.id,
    title = props.title,
    domainId = props.domainId,
    sourceType = props.sourceType,
    optionsListDs = props.optionsListDs,
    businessObjectCode = props.businessObjectCode,
    businessObjectTenantId = props.businessObjectTenantId,
    baseInfoDS = props.baseInfoDS,
    handleItemClick = props.handleItemClick;
  const Modal = _useModal();
  const boStore = useBoStore();
  const hasPermission = (_boStore$getState = boStore === null || boStore === void 0 ? void 0 : boStore.getState('hasPermission')) !== null && _boStore$getState !== void 0 ? _boStore$getState : true;
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    visible = _useState2[0],
    setVisible = _useState2[1];
  const _useState3 = useState(''),
    _useState4 = _slicedToArray(_useState3, 2),
    curId = _useState4[0],
    setCurId = _useState4[1];

  // 租户继承平台API对象 不能操作平台值集
  const tenantApiObjectDisabledFlag = record => {
    var _baseInfoDS$current;
    return isTenant && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('physicalModelType')) === 'API' && (record === null || record === void 0 ? void 0 : record.get('tenantId')) === 0;
  };
  useEffect(() => {
    initData();
  }, []);

  // 初始化数据
  const initData = () => {
    optionsListDs.query();
  };
  const disabledFlag = sourceType === SourceType.PREDEFINE; // 系统预置业务对象不能编辑

  const apicheck = async () => {
    var _baseInfoDS$current2;
    if ((baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : _baseInfoDS$current2.get('physicalModelType')) === 'API') {
      var _baseInfoDS$current3;
      const res = await apiInterFaceList(baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current3 = baseInfoDS.current) === null || _baseInfoDS$current3 === void 0 ? void 0 : _baseInfoDS$current3.get('businessObjectId'));
      if (getResponse(res)) {
        const pageItem = res === null || res === void 0 ? void 0 : res.find(v => v.apiType === 'PAGE');
        const listItem = res === null || res === void 0 ? void 0 : res.find(v => v.apiType === 'LIST');
        if (!pageItem.apiStandardUrl && !listItem.apiStandardUrl) {
          return Modal.open({
            title: intl.get('hmde.common.tips').d('提示'),
            style: {
              width: '595px'
            },
            closable: true,
            border: false,
            children: intl.get('hmde.bo.businessObject.setInterfacePage2').d('请先至【接口维护】中维护【分页查询】或【列表查询】通用API'),
            okText: intl.get('hmde.bo.businessObject.interfaceMain').d('接口维护'),
            cancelText: intl.get('hmde.common.button.cancel').d('取消'),
            onOk: () => {
              handleItemClick('commmonApi');
            }
          });
        }
        let pageOpen;
        // 如果只有分页查询接口：【是否分页】需要打开，并且不允许编辑
        if (pageItem.apiStandardUrl && !listItem.apiStandardUrl) {
          pageOpen = 1;
        }

        // 如果只有列表查询接口：【是否分页】需要关闭，并且不允许编辑
        if (!pageItem.apiStandardUrl && listItem.apiStandardUrl) {
          pageOpen = 2;
        }
        openCreateOptionModal(pageOpen);
      }
    } else {
      openCreateOptionModal();
    }
  };
  const openCreateOptionModal = pageOpen => {
    Modal.open({
      title: intl.get('hmde.bo.businessObject.createOptionList').d('新建值列表'),
      style: {
        width: '957px'
      },
      bodyStyle: {
        paddingTop: 0,
        maxHeight: 'calc(85vh - 106px)'
      },
      closable: true,
      border: false,
      autoCenter: true,
      children: /*#__PURE__*/React.createElement(OptionForm, {
        domainId: domainId,
        businessObjectId: businessObjectId,
        businessObjectCode: businessObjectCode,
        title: title,
        optionsListDs: optionsListDs,
        baseInfoDS: baseInfoDS,
        pageOpen: pageOpen,
        businessObjectTenantId: businessObjectTenantId
      }),
      okFirst: false
    });
  };
  const openEditOptionModal = (optionId, readOnlyFlag) => {
    Modal.open({
      title: intl.get('hmde.bo.businessObject.editOptionList').d('编辑值列表'),
      style: {
        width: '66.5%'
      },
      closable: true,
      border: false,
      drawer: true,
      children: /*#__PURE__*/React.createElement(OptionForm, {
        domainId: domainId,
        readOnlyFlag: readOnlyFlag || !hasPermission,
        businessObjectId: businessObjectId,
        businessObjectCode: businessObjectCode,
        optionId: optionId,
        businessObjectTenantId: businessObjectTenantId,
        optionsListDs: optionsListDs,
        editFlag: true,
        baseInfoDS: baseInfoDS
      }),
      okFirst: false,
      cancelText: intl.get('hmde.common.button.cancel').d('取消'),
      footer: (onOkBtn, cancelBtn) => {
        var _optionsListDs$curren;
        return /*#__PURE__*/React.createElement(React.Fragment, null, cancelBtn, isTenant && (optionsListDs === null || optionsListDs === void 0 ? void 0 : (_optionsListDs$curren = optionsListDs.current) === null || _optionsListDs$curren === void 0 ? void 0 : _optionsListDs$curren.get('tenantId')) === 0 ? null : onOkBtn);
      }
    });
  };
  const openCopyOptionModal = optionId => {
    Modal.open({
      // title: intl.get('hmde.bo.businessObject.copyOptionList').d('复制值列表'),
      title: intl.get('hmde.bo.businessObject.createOptionList').d('新建值列表'),
      style: {
        width: '66.5%'
      },
      closable: true,
      border: false,
      drawer: false,
      children: /*#__PURE__*/React.createElement(OptionForm, {
        domainId: domainId,
        businessObjectId: businessObjectId,
        businessObjectCode: businessObjectCode,
        optionId: optionId,
        businessObjectTenantId: businessObjectTenantId,
        optionsListDs: optionsListDs,
        copy: true,
        baseInfoDS: baseInfoDS
      }),
      okFirst: false
    });
  };
  const handleEnableOption = async data => {
    const res = await enableOption(data);
    if (res && res.failed) {
      notification.warning({
        message: intl.get('hmde.common.status.error').d('失败'),
        description: res.message
      });
    } else {
      notification.success({
        message: intl.get('hmde.common.handleSuccess').d('操作成功')
      });
      optionsListDs.query();
    }
  };
  const handleDisableOption = async data => {
    const res = await disableOption(data);
    if (res && res.failed) {
      notification.warning({
        message: intl.get('hmde.common.status.error').d('失败'),
        description: res.message
      });
    } else {
      notification.success({
        message: intl.get('hmde.common.handleSuccess').d('操作成功')
      });
      optionsListDs.query();
    }
  };
  const handleCheck = record => {
    setCurId('');
    request(`${lowcodeOrganizationURL({
      route: HZERO_HMDE
    })}/business-object-options?checkFlag=true`, {
      method: 'DELETE',
      data: record === null || record === void 0 ? void 0 : record.toData(),
      params: {
        businessObjectOptionId: record.get('businessObjectOptionId')
      }
    }).then(res => {
      if (getResponse(res)) {
        setVisible(true);
        setCurId(record === null || record === void 0 ? void 0 : record.get('businessObjectOptionId'));
      }
    });
  };
  const columns = useMemo(() => {
    return [{
      name: FN.BUSINESS_OBJECT_OPTION_NAME,
      renderer: ({
        value,
        record
      }) => /*#__PURE__*/React.createElement("a", {
        style: {
          verticalAlign: 'initial'
        },
        onClick: () => {
          const readOnlyFlag = isTenant && (record === null || record === void 0 ? void 0 : record.get('tenantId')) === 0; // 租户继承平台标准不能编辑
          return openEditOptionModal(record === null || record === void 0 ? void 0 : record.get('businessObjectOptionId'), readOnlyFlag || tenantApiObjectDisabledFlag(record));
        }
      }, value)
    }, {
      name: FN.BUSINESS_OBJECT_OPTION_CODE
    }, {
      name: FN.DISPLAY_FIELD_CODE
    }, {
      name: FN.BUSINESS_OBJECT_OPTION_TYPE
    }, {
      name: FN.REMARK,
      tooltip: 'overflow'
    }, {
      name: FN.ENABLED_FLAG,
      align: "left",
      renderer: ({
        value
      }) => enableRender(value, {
        wrapperStyle: {
          justifyContent: 'start'
        }
      })
    }, {
      name: FN.DEFAULT_FLAG,
      align: "left",
      renderer: ({
        value
      }) => yesOrNoRender(value ? 1 : 0)
    }, {
      header: intl.get('hmde.common.table.column.operate').d('操作'),
      align: "left",
      width: 180,
      renderer: ({
        record
      }) => {
        const operators = [];
        const readOnlyFlag = isTenant && (record === null || record === void 0 ? void 0 : record.get('tenantId')) === 0; // 租户继承平台标准不能编辑
        // FIXME: 值列表类型 “默认” 不一定为default，依据实际情况而定
        operators.push({
          key: 'preview',
          ele: /*#__PURE__*/React.createElement("a", null, /*#__PURE__*/React.createElement(ValueList, {
            record: record,
            disabled: tenantApiObjectDisabledFlag(record)
          })),
          len: 2,
          title: intl.get('hmde.bo.businessObject.preview').d('预览')
        });
        if (!readOnlyFlag) {
          if (record !== null && record !== void 0 && record.get('enabledFlag')) {
            operators.push({
              key: 'disable',
              ele: /*#__PURE__*/React.createElement(PopconfirmButton, {
                titleTips: intl.get('hmde.common.message.disableTips').d(`是否禁用`),
                text: intl.get('hmde.common.button.disable').d('禁用'),
                busLimits: true,
                onConfirm: () => handleDisableOption(record === null || record === void 0 ? void 0 : record.toData()),
                styles: {
                  verticalAlign: 'inherit',
                  marginLeft: '16px'
                },
                delUrl: "/business-object-options/disable?checkFlag=true",
                method: "PUT",
                data: record === null || record === void 0 ? void 0 : record.toData(),
                disabled: tenantApiObjectDisabledFlag(record)
              }),
              len: 2,
              title: intl.get('hmde.common.button.disable').d('禁用')
            });
          } else {
            operators.unshift({
              key: 'enable',
              ele: /*#__PURE__*/React.createElement(_Popconfirm, {
                title: renderPopConfirmTitle('', intl.get('hmde.common.isEnabled').d(`是否启用`)),
                okText: intl.get('hmde.common.button.sure').d('确定'),
                cancelText: intl.get('hmde.common.button.cancel').d('取消'),
                onConfirm: () => handleEnableOption(record === null || record === void 0 ? void 0 : record.toData())
              }, /*#__PURE__*/React.createElement(BOPermissionButton, {
                componentType: "a",
                disabled: tenantApiObjectDisabledFlag(record)
              }, intl.get('hmde.common.button.enable').d('启用'))),
              len: 2,
              title: intl.get('hmde.common.button.enable').d('启用')
            });
          }
          operators.push({
            key: 'delete',
            ele: /*#__PURE__*/React.createElement("a", {
              onClick: () => handleCheck(record),
              disabled: tenantApiObjectDisabledFlag(record)
            }, intl.get('hmde.common.button.delete').d('删除')),
            len: 2,
            title: intl.get('hmde.common.button.delete').d('删除')
          });
        }
        operators.push({
          key: 'copy',
          ele: /*#__PURE__*/React.createElement(BOPermissionButton, {
            componentType: "a",
            onClick: () => openCopyOptionModal(record === null || record === void 0 ? void 0 : record.get('businessObjectOptionId')),
            key: "copy"
          }, intl.get('hmde.common.copy').d('复制')),
          len: 2,
          title: intl.get('hmde.common.copy').d('复制')
        });
        return /*#__PURE__*/React.createElement(_Popconfirm, {
          title: renderPopConfirmTitle(intl.get('hmde.bo.businessObject.deleteOption.new').d('请确认是否删除该值列表，删除后相关数据会失效。'), intl.get('hmde.bo.businessObject.deletetip').d('是否删除')),
          onConfirm: () => {
            if (record) optionsListDs.delete(record, false);
          },
          onCancel: () => setVisible(false),
          visible: visible && (record === null || record === void 0 ? void 0 : record.get('businessObjectOptionId')) === curId
        }, operatorRender(operators, record, {
          limit: 3
        }));
      }
    }].filter(Boolean);
  }, [disabledFlag, businessObjectTenantId, curId, visible]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", {
    className: styles.title
  }, intl.get('hmde.bo.businessObject.tab.optionList').d('值列表')), /*#__PURE__*/React.createElement(_Table, {
    dataSet: optionsListDs,
    queryBar: "filterBar",
    queryBarProps: {
      fuzzyQueryPlaceholder: intl.get('hmde.bo.businessObject.valueListName').d('请输入值列表名称、编码等')
    },
    buttons: [/*#__PURE__*/React.createElement(BOPermissionButton, {
      color: "primary",
      onClick: () => apicheck(),
      icon: "add"
    }, intl.get('hmde.common.button.create').d('新建'))],
    columns: columns
  }));
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(OptionList));