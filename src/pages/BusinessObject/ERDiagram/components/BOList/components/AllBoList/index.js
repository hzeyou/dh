import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Popover from "@hzero-front-ui/c7n-ui/lib/Popover";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _Lov from "@hzero-front-ui/c7n-ui/lib/LovPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _SelectBox from "@hzero-front-ui/c7n-ui/lib/SelectBoxPro";
import _useModal from "choerodon-ui/pro/lib/use-modal";
import React from 'react';
import { observer } from 'mobx-react-lite';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { isTenantRoleLevel } from 'utils/utils';
import { DataSetStatus } from 'choerodon-ui/dataset/data-set/enum';
import { ReactComponent as ImgClear } from "hzero-front-hmde/lib/assets/icon/clear.svg";
import CreateBOModal from "hzero-front-hmde/lib/routes/BusinessObject/DomainOwnBOList/CreateBOModal";
import { getTenantBusinessObjectPrefixRule } from "hzero-front-hmde/lib/routes/BusinessObject/DomainOwnBOList/utils";
import { BoFN } from "../../../../datasets/boDS";
import { DomainFN } from "../../../../datasets/domainDS";
import Item from "./Item";
import { useERStore } from "../../../../stores";
import styles from "./index.less?modules";
const AllBoList = ({
  boDs,
  domainDs
}) => {
  var _boDs$queryDataSet2;
  const erStore = useERStore();
  const domain = erStore.getState('domain');
  const businessObjectCreatedFlag = erStore.getState('businessObjectCreatedFlag');
  const Modal = _useModal();
  const isPreDomain = (domain === null || domain === void 0 ? void 0 : domain.domainCode) === 'SYS'; // 是否为预置领域

  const handleQuery = () => {
    boDs.query();
  };
  const renderForm = () => {
    const handleReset = () => {
      var _boDs$queryDataSet;
      (_boDs$queryDataSet = boDs.queryDataSet) === null || _boDs$queryDataSet === void 0 ? void 0 : _boDs$queryDataSet.reset();
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: 380
      }
    }, /*#__PURE__*/React.createElement(_Form, {
      dataSet: boDs.queryDataSet,
      labelWidth: "auto"
    }, /*#__PURE__*/React.createElement(_SelectBox, {
      name: BoFN.PUBLISH_STATUS
    }), /*#__PURE__*/React.createElement(_SelectBox, {
      name: BoFN.ENABLED_FLAG
    }), /*#__PURE__*/React.createElement(_SelectBox, {
      name: BoFN.CATEGORY
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(_Button, {
      onClick: handleReset
    }, intl.get('hmde.common.reset').d('重置')), /*#__PURE__*/React.createElement(_Button, {
      color: "primary",
      onClick: () => handleQuery()
    }, intl.get('hmde.common.button.query').d('查询'))));
  };
  const handleSelectAll = () => {
    boDs.selectAll();
  };
  const handleClearAll = () => {
    boDs.unSelectAll();
  };
  const handleCreateBO = () => {
    if (!domain) return null;
    const refreshBoList = res => {
      boDs.query().then(() => {
        if (res !== null && res !== void 0 && res.success) {
          var _res$content, _res$content$;
          const boId = res === null || res === void 0 ? void 0 : (_res$content = res.content) === null || _res$content === void 0 ? void 0 : (_res$content$ = _res$content[0]) === null || _res$content$ === void 0 ? void 0 : _res$content$.businessObjectId;
          const targetIndex = boDs.findIndex(record => record.get(BoFN.ID) === boId);
          if (targetIndex > -1) {
            boDs.select(targetIndex);
          }
        }
      });
    };
    Modal.open({
      title: intl.get('hmde.common.addBusObj').d('新建业务对象'),
      style: {
        width: '958px'
      },
      contentStyle: {
        maxHeight: '85%',
        display: 'flex',
        flexDirection: 'column'
      },
      closable: true,
      border: false,
      autoCenter: true,
      okText: intl.get('hmde.common.button.save').d('保存'),
      cancelText: intl.get('hmde.common.button.cancel').d('取消'),
      okFirst: false,
      children: /*#__PURE__*/React.createElement(CreateBOModal, {
        domain: domain,
        domainId: domain === null || domain === void 0 ? void 0 : domain.domainId,
        serviceCode: domain === null || domain === void 0 ? void 0 : domain.serviceCode,
        domainCode: domain === null || domain === void 0 ? void 0 : domain.domainCode,
        extendTableEnabledFlag: domain === null || domain === void 0 ? void 0 : domain.extendTableEnabledFlag,
        extendTableSuffix: domain === null || domain === void 0 ? void 0 : domain.extendTableSuffix,
        tenantBusinessObjectPrefixRule: getTenantBusinessObjectPrefixRule(domain === null || domain === void 0 ? void 0 : domain.tenantBusinessObjectPrefixRule),
        createSuccessCallback: refreshBoList
      })
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles.wrapper
  }, /*#__PURE__*/React.createElement(_Form, {
    dataSet: domainDs,
    columns: 1,
    labelWidth: 70
  }, /*#__PURE__*/React.createElement(_Lov, {
    name: DomainFN.DOMAIN_LOV,
    clearButton: false
  })), /*#__PURE__*/React.createElement("div", {
    className: styles['search-form']
  }, /*#__PURE__*/React.createElement(_TextField, {
    record: (_boDs$queryDataSet2 = boDs.queryDataSet) === null || _boDs$queryDataSet2 === void 0 ? void 0 : _boDs$queryDataSet2.current,
    name: BoFN.KEYWORD,
    prefix: /*#__PURE__*/React.createElement(_Icon, {
      type: "search",
      style: {
        color: '#D0D0D0'
      }
    }),
    placeholder: intl.get('hmde.bo.businessObject.objectModelPlaceholder').d('请搜索对象名称/编码'),
    clearButton: true,
    className: styles.input,
    onEnterDown: handleQuery,
    onClear: handleQuery
  }), /*#__PURE__*/React.createElement("div", {
    className: styles['more-action']
  }, /*#__PURE__*/React.createElement(_Popover, {
    overlayStyle: {
      zIndex: 11
    },
    trigger: "hover",
    placement: "bottomLeft",
    content: renderForm()
  }, /*#__PURE__*/React.createElement(_Button, {
    funcType: "raised",
    icon: "filter2"
  })))), /*#__PURE__*/React.createElement("div", {
    className: styles.operate
  }, /*#__PURE__*/React.createElement(_Button, {
    color: "primary",
    funcType: "link",
    icon: "add",
    disabled: !businessObjectCreatedFlag,
    style: {
      margin: '0 8px'
    },
    onClick: handleCreateBO,
    hidden: isTenantRoleLevel() && !(domain !== null && domain !== void 0 && domain.tenantBusinessObjectCreatedFlag) || isPreDomain
  }, intl.get('hmde.common.addBusObj').d('新建业务对象')), /*#__PURE__*/React.createElement(_Button, {
    color: "primary",
    funcType: "link",
    icon: "library_add_check-o",
    onClick: handleSelectAll,
    style: {
      marginRight: 8
    }
  }, intl.get('hmde.bo.businessObject.futureGenerations').d('全选')), /*#__PURE__*/React.createElement(_Button, {
    color: "primary",
    funcType: "link",
    onClick: handleClearAll
  }, /*#__PURE__*/React.createElement(ImgClear, {
    style: {
      marginRight: 4,
      position: 'relative',
      top: 2,
      fontSize: 12
    }
  }), intl.get('hmde.bo.businessObject.empty').d('清空'))), /*#__PURE__*/React.createElement("div", {
    className: styles.list
  }, /*#__PURE__*/React.createElement(_Spin, {
    spinning: erStore.getState('isGraphLoading') || boDs.status === "loading"
  }, boDs.records.map(record => /*#__PURE__*/React.createElement(Item, {
    key: record.get(BoFN.ID),
    boDs: boDs,
    record: record
  })), boDs.totalCount === 0 && /*#__PURE__*/React.createElement("div", {
    className: styles.empty
  }, intl.get('hmde.common.nodata').d('暂无数据')))));
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(AllBoList));