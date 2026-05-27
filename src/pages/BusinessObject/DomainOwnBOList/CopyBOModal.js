import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _SelectBox from "@hzero-front-ui/c7n-ui/lib/SelectBoxPro";
import _Collapse from "@hzero-front-ui/c7n-ui/lib/Collapse";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Switch from "@hzero-front-ui/c7n-ui/lib/SwitchPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _IntlField from "@hzero-front-ui/c7n-ui/lib/IntlFieldPro";
import _Lov from "@hzero-front-ui/c7n-ui/lib/LovPro";
import _Alert from "@hzero-front-ui/c7n-ui/lib/Alert";
import _Icon from "choerodon-ui/pro/lib/icon";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useEffect, useMemo, useState, useRef } from 'react';
import intl from 'utils/intl';
import { getResponse, isTenantRoleLevel } from 'utils/utils';
import request from 'utils/request';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { useRequest } from 'ahooks';
import { IntlType } from 'choerodon-ui/pro/lib/intl-field/enum';
import { ShowHelp } from 'choerodon-ui/pro/lib/field/enum';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';

// import ImgIcon from '@hmde/utils/ImgIcon';
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import { CustomTemplateDS } from "hzero-front-hmde/lib/stores/Domain/DomainDS";
import LabelTitleRender from "hzero-front-hmde/lib/businessComponents/LabelTitleRender";
import BusinessObjectDataSet, { apiModelTableDs } from "hzero-front-hmde/lib/stores/BusinessObject/BusinessObjectDS";
import LovToBoDetail from "hzero-front-hmde/lib/businessComponents/LovToBoDetail";
import DimensionConfig from "hzero-front-hmde/lib/businessComponents/DimensionConfig";
import { fetchDomainDetail } from "hzero-front-hmde/lib/services/businessObjectService";
// import { queryIntlMultiLanguageService } from '@hmde/services/commonService';

import CopyBODs, { FN } from "../../../stores/BusinessObject/BusinessObjectCopyDS";
import { getBaseMinObDetail, apiModelDataService } from "../../../services/businessObjectService";
import styles from "./index.less?modules";
import ShowExtendsFieldDetail from "./ShowExtendsFieldDetail";
import CreateApiModelTable from "./CreateApiModelTable";
import { checkObjectCodePrefix } from "./utils";
import CopyBoErrorModal from "./components/CopyBoErrorModal";
const isTenant = isTenantRoleLevel();
const EditBOModal = ({
  modal,
  domain,
  record,
  copySuccess,
  oldTenantBusinessObjectPrefixRule = '',
  businessObjectCreatedFlag
}) => {
  var _boFormDs$current13, _boFormDs$current14, _boFormDs$current15, _boFormDs$current16, _boFormDs$current17, _boFormDs$current18, _boFormDs$current19;
  const _ref = domain || {},
    domainCode = _ref.domainCode,
    _ref$extendTableSuffi = _ref.extendTableSuffix,
    extendTableSuffix = _ref$extendTableSuffi === void 0 ? 'EXT' : _ref$extendTableSuffi,
    extendTableEnabledFlag = _ref.extendTableEnabledFlag,
    flexFieldEnabledFlag = _ref.flexFieldEnabledFlag,
    domainId = _ref.domainId;
  const _useState = useState(domainCode),
    _useState2 = _slicedToArray(_useState, 2),
    NdomainCode = _useState2[0],
    setNdomainCode = _useState2[1];
  const _useState3 = useState(domainId),
    _useState4 = _slicedToArray(_useState3, 2),
    NdomainId = _useState4[0],
    setNdomainId = _useState4[1];
  const _useState5 = useState(''),
    _useState6 = _slicedToArray(_useState5, 2),
    tenantBusinessObjectPrefixRule = _useState6[0],
    setTenantBusinessObjectPrefixRule = _useState6[1];
  const _useState7 = useState(''),
    _useState8 = _slicedToArray(_useState7, 2),
    extendFieldPrefixRule = _useState8[0],
    setExtendFieldPrefixRule = _useState8[1];

  // 扩展表模式
  const _useState9 = useState(extendTableEnabledFlag),
    _useState10 = _slicedToArray(_useState9, 2),
    extendTableEnabled = _useState10[0],
    setExtendTableEnabled = _useState10[1];
  // 弹性域模式
  const _useState11 = useState(flexFieldEnabledFlag),
    _useState12 = _slicedToArray(_useState11, 2),
    flexFieldEnabled = _useState12[0],
    setFlexFieldEnabled = _useState12[1];
  const baseInfoDS = useMemo(() => {
    return new _DataSet({
      ...BusinessObjectDataSet({
        boId: record === null || record === void 0 ? void 0 : record.get('businessObjectId')
      }),
      autoQuery: false
    });
  }, []);
  const boFormDs = useMemo(() => {
    return new _DataSet(CopyBODs());
  }, []);
  const _useState13 = useState(false),
    _useState14 = _slicedToArray(_useState13, 2),
    loading = _useState14[0],
    setLoading = _useState14[1];

  // 参数对象ref
  const dRef = useRef();

  // 查询租户业务对象自定义前缀
  const _useRequest = useRequest(() => fetchDomainDetail(NdomainId), {
      manual: true
    }),
    domainDetailObj = _useRequest.data,
    runAsync = _useRequest.runAsync;
  useEffect(() => {
    NdomainId && isTenant && runAsync();
  }, [NdomainId]);
  useEffect(() => {
    if (domainDetailObj !== null && domainDetailObj !== void 0 && domainDetailObj.tenantBusinessObjectPrefixRule) {
      setTenantBusinessObjectPrefixRule(JSON.parse(domainDetailObj === null || domainDetailObj === void 0 ? void 0 : domainDetailObj.tenantBusinessObjectPrefixRule));
    }
    if (domainDetailObj !== null && domainDetailObj !== void 0 && domainDetailObj.extendFieldPrefixRule) {
      setExtendFieldPrefixRule(JSON.parse(domainDetailObj === null || domainDetailObj === void 0 ? void 0 : domainDetailObj.extendFieldPrefixRule));
    }
  }, [domainDetailObj]);

  // 对象编码前缀
  const getAddonBefore = useMemo(() => {
    if (!NdomainCode) {
      return tenantBusinessObjectPrefixRule ? `${tenantBusinessObjectPrefixRule}_` : '_';
    }
    return tenantBusinessObjectPrefixRule ? `${NdomainCode}_${tenantBusinessObjectPrefixRule}_` : `${NdomainCode}_`;
  }, [NdomainCode, tenantBusinessObjectPrefixRule]);
  useEffect(() => {
    checkObjectCodePrefix(getAddonBefore);
  }, [getAddonBefore]);

  // api模型类型业务对象 关联数据
  const apiModelDs = useMemo(() => {
    return new _DataSet(apiModelTableDs());
  }, []);

  // 请求改业务对象数据，给表单赋予初始值
  useEffect(() => {
    baseInfoDS === null || baseInfoDS === void 0 ? void 0 : baseInfoDS.query().then(res => {
      if (getResponse(res)) {
        var _res$businessObjectCo, _boFormDs$current2;
        boFormDs.loadData([res]);
        if (extendTableEnabledFlag) {
          var _boFormDs$current;
          boFormDs === null || boFormDs === void 0 ? void 0 : (_boFormDs$current = boFormDs.current) === null || _boFormDs$current === void 0 ? void 0 : _boFormDs$current.set({
            [FN.EXTENDSTABLE_NAME]: `${res === null || res === void 0 ? void 0 : res.businessObjectCode}_${extendTableSuffix}`
            // [FN.AUTOCREATE_EXTEND_FLAG]: true,
          });
        }
        // 处理对象编码
        let copyBoCode = res === null || res === void 0 ? void 0 : (_res$businessObjectCo = res.businessObjectCode) === null || _res$businessObjectCo === void 0 ? void 0 : _res$businessObjectCo.replace(`${domainCode}_`, '');
        if (isTenant && oldTenantBusinessObjectPrefixRule) {
          var _copyBoCode;
          copyBoCode = (_copyBoCode = copyBoCode) === null || _copyBoCode === void 0 ? void 0 : _copyBoCode.replace(`${oldTenantBusinessObjectPrefixRule}_`, '');
        }
        boFormDs === null || boFormDs === void 0 ? void 0 : (_boFormDs$current2 = boFormDs.current) === null || _boFormDs$current2 === void 0 ? void 0 : _boFormDs$current2.set({
          [FN.DOMAIN]: businessObjectCreatedFlag ? domain : {},
          // [FN.TARGET_DOMAIN_ID]: domain?.domainId,
          [FN.BUSINESSOBJECT_NAME]: `${res === null || res === void 0 ? void 0 : res.businessObjectName}_${intl.get('hmde.bo.view.copyItem').d('副本')}`,
          [FN.PHYSICALMODEL_NAME]: res === null || res === void 0 ? void 0 : res.businessObjectCode,
          [FN.BUSINESSOBJECT_CODE]: copyBoCode,
          [FN.AUTOCREATE_FLAG]: true,
          [FN.REFEXTFIELD_FLAG]: true
        });
        if ((record === null || record === void 0 ? void 0 : record.get(FN.BUSINESSOBJECT_CATEGORY)) === 'MIDDLE') {
          getBaseMinObDetail({
            boId: record === null || record === void 0 ? void 0 : record.get('businessObjectId')
          }).then(midRes => {
            if (getResponse(midRes)) {
              var _boFormDs$current3, _midRes$, _midRes$2;
              boFormDs === null || boFormDs === void 0 ? void 0 : (_boFormDs$current3 = boFormDs.current) === null || _boFormDs$current3 === void 0 ? void 0 : _boFormDs$current3.set({
                [FN.MIDDLE_LINK_BUSINESSOBJECTS]: midRes,
                [FN.FIRST]: midRes === null || midRes === void 0 ? void 0 : (_midRes$ = midRes[0]) === null || _midRes$ === void 0 ? void 0 : _midRes$.first,
                [FN.SECOND]: midRes === null || midRes === void 0 ? void 0 : (_midRes$2 = midRes[0]) === null || _midRes$2 === void 0 ? void 0 : _midRes$2.second
              });
            }
          });
        }
        if (res.physicalModelType === 'API') {
          apiModelDataService(res.businessObjectId).then(res1 => {
            if (getResponse(res1)) {
              const apiListData = res1.filter(v1 => v1.relatedApiFlag) || [];
              apiModelDs.loadData(apiListData.map(v2 => {
                return {
                  type: v2.apiType,
                  relatedApiId: v2.apiId,
                  relatedApiName: v2.apiName
                };
              }));
            }
          });
        }
      }
    });
  }, []);

  // 引用预置模板
  const customTemplateDS = useMemo(() => new _DataSet(CustomTemplateDS({
    domainId
  })), []);
  useEffect(() => {
    if (NdomainId && boFormDs.length) {
      customTemplateDS.setQueryParameter('domainId', NdomainId);
      customTemplateDS.setQueryParameter('positiveEnabledFlag', true);
      customTemplateDS.query().then(res => {
        var _boFormDs$current4;
        const arr = [];
        res === null || res === void 0 ? void 0 : res.forEach(v => {
          v.defaultFlag && arr.push(v === null || v === void 0 ? void 0 : v.templateCode);
        });
        boFormDs === null || boFormDs === void 0 ? void 0 : (_boFormDs$current4 = boFormDs.current) === null || _boFormDs$current4 === void 0 ? void 0 : _boFormDs$current4.set('templateCodes', arr);
      });
    }
  }, [NdomainId, boFormDs.length]);
  // 引用预置模板 阅览
  const handleExtendsDetail = () => {
    var _boFormDs$current5;
    _Modal.open({
      title: intl.get('hmde.bo.businessObject.tempView').d('模板字段预览'),
      style: {
        width: 702
      },
      key: _Modal.key(),
      closable: true,
      autoCenter: true,
      children: /*#__PURE__*/React.createElement(ShowExtendsFieldDetail, {
        domainId: NdomainId,
        templateCodes: boFormDs === null || boFormDs === void 0 ? void 0 : (_boFormDs$current5 = boFormDs.current) === null || _boFormDs$current5 === void 0 ? void 0 : _boFormDs$current5.get('templateCodes')
      }),
      footer: (okBtn, cancelBtn) => /*#__PURE__*/React.createElement("div", null, cancelBtn)
    });
  };

  // 给表单添加上update事件
  useDataSetEvents(boFormDs, 'update', ({
    name,
    value
  }) => {
    if (name === FN.BUSINESSOBJECT_CODE && value) {
      var _boFormDs$current6, _boFormDs$current6$ge, _boFormDs$current7;
      const busName = NdomainCode || (boFormDs === null || boFormDs === void 0 ? void 0 : (_boFormDs$current6 = boFormDs.current) === null || _boFormDs$current6 === void 0 ? void 0 : (_boFormDs$current6$ge = _boFormDs$current6.get(FN.EXTENDSTABLE_NAME)) === null || _boFormDs$current6$ge === void 0 ? void 0 : _boFormDs$current6$ge.split('_')[0]);
      boFormDs === null || boFormDs === void 0 ? void 0 : (_boFormDs$current7 = boFormDs.current) === null || _boFormDs$current7 === void 0 ? void 0 : _boFormDs$current7.set({
        [FN.EXTENDSTABLE_NAME]: `${busName}_${value}_${extendTableSuffix}`,
        [FN.PHYSICALMODEL_NAME]: `${busName}_${value}`
      });
    }
    if (name === FN.DOMAIN && value) {
      var _boFormDs$current8;
      setNdomainCode(value.domainCode);
      setNdomainId(value.domainId);
      setExtendTableEnabled(value === null || value === void 0 ? void 0 : value.extendTableEnabledFlag);
      setFlexFieldEnabled(value === null || value === void 0 ? void 0 : value.flexFieldEnabledFlag);
      boFormDs === null || boFormDs === void 0 ? void 0 : (_boFormDs$current8 = boFormDs.current) === null || _boFormDs$current8 === void 0 ? void 0 : _boFormDs$current8.set({
        [FN.EXTENDSTABLE_NAME]: `${value.domainCode}_${boFormDs === null || boFormDs === void 0 ? void 0 : boFormDs.current.get(FN.BUSINESSOBJECT_CODE)}_${extendTableSuffix}`,
        [FN.PHYSICALMODEL_NAME]: `${value.domainCode}_${boFormDs === null || boFormDs === void 0 ? void 0 : boFormDs.current.get(FN.BUSINESSOBJECT_CODE)}`
      });
      // if (value?.extendTableEnabledFlag) {
      //   boFormDs?.current?.set(FN.AUTOCREATE_EXTEND_FLAG, false);
      // }
    }
  });

  // 弹窗确定事件
  modal === null || modal === void 0 ? void 0 : modal.handleOk(async () => {
    var _boFormDs$current9, _boFormDs$current10, _boFormDs$current11, _data, _boFormDs$current12;
    let apiValues = true;
    let dimensionFlag = true;
    const isDimension = (boFormDs === null || boFormDs === void 0 ? void 0 : (_boFormDs$current9 = boFormDs.current) === null || _boFormDs$current9 === void 0 ? void 0 : _boFormDs$current9.get('businessObjectCategory')) === 'DIMENSION';
    if ((boFormDs === null || boFormDs === void 0 ? void 0 : (_boFormDs$current10 = boFormDs.current) === null || _boFormDs$current10 === void 0 ? void 0 : _boFormDs$current10.get('physicalModelType')) === 'API') {
      apiValues = await apiModelDs.validate();
    }
    if (isDimension) {
      var _dRef$current, _dRef$current$ds;
      dimensionFlag = dRef === null || dRef === void 0 ? void 0 : (_dRef$current = dRef.current) === null || _dRef$current === void 0 ? void 0 : (_dRef$current$ds = _dRef$current.ds) === null || _dRef$current$ds === void 0 ? void 0 : _dRef$current$ds.validate();
    }
    if (!checkObjectCodePrefix(getAddonBefore)) return false;
    const formValues = await boFormDs.validate();
    if (!formValues || !apiValues || !dimensionFlag) {
      // 检验表单
      return false;
    }
    if (isDimension) {
      var _dRef$current2, _dRef$current2$save;
      dRef === null || dRef === void 0 ? void 0 : (_dRef$current2 = dRef.current) === null || _dRef$current2 === void 0 ? void 0 : (_dRef$current2$save = _dRef$current2.save) === null || _dRef$current2$save === void 0 ? void 0 : _dRef$current2$save.call(_dRef$current2);
    }
    setLoading(true);
    modal === null || modal === void 0 ? void 0 : modal.update({
      okProps: {
        disabled: true
      },
      cancelProps: {
        disabled: true
      }
    });

    // 查询业务对象下的字段列表
    const res = await request(`${lowcodeOrganizationURL({
      route: HZERO_HMDE
    })}/business-object-fields`, {
      method: 'GET',
      params: {
        businessObjectId: (_boFormDs$current11 = boFormDs.current) === null || _boFormDs$current11 === void 0 ? void 0 : _boFormDs$current11.get('businessObjectId')
      }
    }).catch(() => {});
    let _boFormDs$toData = boFormDs.toData(),
      _boFormDs$toData2 = _slicedToArray(_boFormDs$toData, 1),
      data = _boFormDs$toData2[0];
    const businessObjectFields = getResponse(res) ? res.filter(item => item.sourceType !== 'PREDEFINED') : [];
    data = {
      ...data,
      // businessObjectFields,
      businessObjectCode: `${getAddonBefore}${(_data = data) === null || _data === void 0 ? void 0 : _data.businessObjectCode}`
    };
    if ((boFormDs === null || boFormDs === void 0 ? void 0 : (_boFormDs$current12 = boFormDs.current) === null || _boFormDs$current12 === void 0 ? void 0 : _boFormDs$current12.get('physicalModelType')) === 'API') {
      data = {
        ...data,
        apiList: apiModelDs === null || apiModelDs === void 0 ? void 0 : apiModelDs.map(v => {
          return {
            type: v === null || v === void 0 ? void 0 : v.get('type'),
            relatedApiId: v === null || v === void 0 ? void 0 : v.get('relatedApiId'),
            relatedApiName: v === null || v === void 0 ? void 0 : v.get('relatedApiName')
          };
        })
      };
    }

    // 打包数据，发送请求
    request(`${lowcodeOrganizationURL({
      route: HZERO_HMDE
    })}/business-objects/copy`, {
      data,
      method: 'POST'
    }).then(_res => {
      // 复制成功，弹窗提示
      if (_res && _res.businessObjectId) {
        notification.success({});
        modal.close();
        // 打开新复制的业务对象
        copySuccess({
          businessObjectCode: _res[FN.BUSINESSOBJECT_CODE],
          businessObjectName: _res[FN.BUSINESSOBJECT_NAME],
          businessObjectId: _res.businessObjectId
        });
      } else if (_res.failed === true && _res.code === 'hmde.business_object.copy.fail') {
        // 业务字段字段重复
        modal.close();
        _Modal.open({
          title: /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement(_Icon, {
            type: "info",
            style: {
              fontSize: 20,
              color: '#FBAD00'
            }
          }), intl.get('hmde.common.view.title.warn').d('警告')),
          key: _Modal.key(),
          style: {
            width: '958px'
          },
          children: /*#__PURE__*/React.createElement(CopyBoErrorModal, {
            boFormDs: boFormDs,
            data: data,
            copyWarningList: _res.copyWarningList,
            fieldsList: businessObjectFields,
            copySuccess: copySuccess,
            extendTableSuffix: extendTableSuffix,
            extendTableEnabledFlag: extendTableEnabledFlag,
            extendFieldPrefixRule: extendFieldPrefixRule
          })
        });
      } else {
        getResponse(_res);
      }
    }).catch(error => {
      console.error(error);
    }).finally(() => {
      setLoading(false);
      modal.update({
        okProps: {
          disabled: false
        },
        cancelProps: {
          disabled: false
        }
      });
    });
    return false;
  });
  return /*#__PURE__*/React.createElement(_Spin, {
    spinning: loading
  }, /*#__PURE__*/React.createElement(_Alert, {
    style: {
      margin: '4px 0 12px 0'
    },
    message: intl.get('hmde.bo.businessObject.copyBoHelpTipNew').d('复制业务对象，将原业务对象的字段列表、业务规则等一并复制，请谨慎操作。'),
    type: "info",
    showIcon: true
  }), /*#__PURE__*/React.createElement(_Form, {
    labelWidth: 130,
    dataSet: boFormDs
    // useColon={false}
    ,
    columns: 2,
    showHelp: "label",
    className: styles['copy-form']
  }, /*#__PURE__*/React.createElement(_Lov, {
    name: FN.DOMAIN,
    colSpan: 1
  }), /*#__PURE__*/React.createElement(_IntlField, {
    name: FN.BUSINESSOBJECT_NAME,
    newLine: true,
    colSpan: 1,
    suffix: /*#__PURE__*/React.createElement(_Icon, {
      type: "language"
    })
  }), /*#__PURE__*/React.createElement(_TextField, {
    name: FN.BUSINESSOBJECT_CODE,
    colSpan: 1,
    addonBefore: getAddonBefore && /*#__PURE__*/React.createElement(_Tooltip, {
      title: getAddonBefore
    }, getAddonBefore),
    maxLength: 56 - getAddonBefore.length,
    showLengthInfo: true
  }), /*#__PURE__*/React.createElement(_Select, {
    name: FN.BUSINESSOBJECT_CATEGORY,
    colSpan: 1,
    disabled: true
  }), /*#__PURE__*/React.createElement(_Switch, {
    name: FN.ENABLED_FLAG,
    colSpan: 1
  }), /*#__PURE__*/React.createElement(_IntlField, {
    name: FN.REMARK,
    colSpan: 2,
    type: "multipleLine",
    suffix: /*#__PURE__*/React.createElement(_Icon, {
      type: "language"
    })
  })), /*#__PURE__*/React.createElement(_Collapse, {
    ghost: true,
    defaultActiveKey: ['objRelationConfig', 'dimensionConfig'],
    className: styles['copy-collapse']
  }, ((_boFormDs$current13 = boFormDs.current) === null || _boFormDs$current13 === void 0 ? void 0 : _boFormDs$current13.get('businessObjectCategory')) === 'DIMENSION' && /*#__PURE__*/React.createElement(_Collapse.Panel, {
    key: "dimensionConfig",
    header: /*#__PURE__*/React.createElement("span", {
      className: styles['modal-title']
    }, intl.get('hmde.bo.businessObject.dimensionConfig').d('维度配置'))
  }, /*#__PURE__*/React.createElement(_Alert, {
    style: {
      margin: '4px 0 12px 0'
    },
    message: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.businessObject.dimensionConfig.alert1').d('配置参数的维度及维度值来源，维护参数时可指定参数生效的维度及维度值；')), /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.businessObject.dimensionConfig.alert2').d('维度判断存在优先级，按配置顺序由上至下依次判断。'))),
    type: "info",
    showIcon: true
  }), /*#__PURE__*/React.createElement(DimensionConfig, {
    ds: boFormDs,
    dRef: dRef,
    type: "copy",
    businessObjectId: record === null || record === void 0 ? void 0 : record.get('businessObjectId')
  })), (boFormDs === null || boFormDs === void 0 ? void 0 : (_boFormDs$current14 = boFormDs.current) === null || _boFormDs$current14 === void 0 ? void 0 : _boFormDs$current14.get(FN.BUSINESSOBJECT_CATEGORY)) === 'MIDDLE' && /*#__PURE__*/React.createElement(_Collapse.Panel, {
    key: "objRelationConfig",
    header: /*#__PURE__*/React.createElement("span", {
      className: styles['modal-title']
    }, intl.get('hmde.bo.businessObject.relationConfig').d('对象关系配置'))
  }, /*#__PURE__*/React.createElement(_Alert, {
    style: {
      margin: '4px 0 12px 0'
    },
    message: intl.get('hmde.bo.modeler.objRelationConfig.tip').d('维护关联字段分别与目标对象建立关系，关联字段生成从主关系类型字段'),
    type: "info",
    showIcon: true
  }), /*#__PURE__*/React.createElement(_Form, {
    labelWidth: 130,
    dataSet: boFormDs
    // useColon={false}
    ,
    columns: 2
  }, /*#__PURE__*/React.createElement(LovToBoDetail, {
    name: FN.FIRST,
    record: boFormDs === null || boFormDs === void 0 ? void 0 : boFormDs.current,
    colSpan: 1,
    style: {
      width: '100%'
    },
    tooltip: 'none',
    disabled: true
  }), /*#__PURE__*/React.createElement(LovToBoDetail, {
    name: FN.SECOND,
    record: boFormDs === null || boFormDs === void 0 ? void 0 : boFormDs.current,
    colSpan: 1,
    tooltip: 'none',
    style: {
      width: '100%'
    },
    disabled: true,
    tableProps: {
      queryFieldsLimit: 4
    }
  }))), /*#__PURE__*/React.createElement(_Collapse.Panel, {
    key: "advanced",
    header: /*#__PURE__*/React.createElement("span", {
      className: styles['modal-title']
    }, intl.get('hmde.common.advancedConfig').d('高级配置'))
  }, /*#__PURE__*/React.createElement(_Form, {
    labelWidth: 130,
    dataSet: boFormDs,
    columns: 2
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_SelectBox, {
    name: "physicalModelType",
    colSpan: 1,
    disabled: true
  }, /*#__PURE__*/React.createElement(_SelectBox.Option, {
    value: "TABLE"
  }, intl.get('hmde.bo.businessObject.physicalModel').d('物理模型')), /*#__PURE__*/React.createElement(_SelectBox.Option, {
    value: "API"
  }, intl.get('hmde.bo.apiModel.title').d('API模型')), /*#__PURE__*/React.createElement(_SelectBox.Option, {
    value: "SQL"
  }, "SQL")), ((_boFormDs$current15 = boFormDs.current) === null || _boFormDs$current15 === void 0 ? void 0 : _boFormDs$current15.get('physicalModelType')) === 'SQL' && /*#__PURE__*/React.createElement(_Switch, {
    name: "sharedFlag",
    colSpan: 1
  }))), ((_boFormDs$current16 = boFormDs.current) === null || _boFormDs$current16 === void 0 ? void 0 : _boFormDs$current16.get('physicalModelType')) === 'TABLE' && /*#__PURE__*/React.createElement(_Form, {
    labelWidth: 130,
    dataSet: boFormDs,
    columns: 2
    // useColon={false}
  }, /*#__PURE__*/React.createElement(_SelectBox, {
    name: FN.AUTOCREATE_FLAG,
    colSpan: 1,
    disabled: true
  }, /*#__PURE__*/React.createElement(_SelectBox.Option, {
    value: false
  }, intl.get('hmde.common.link').d('关联')), /*#__PURE__*/React.createElement(_SelectBox.Option, {
    value: true
  }, intl.get('hmde.common.status.notRelation').d('未关联'))), !isTenant && (flexFieldEnabled || extendTableEnabled) && ((_boFormDs$current17 = boFormDs.current) === null || _boFormDs$current17 === void 0 ? void 0 : _boFormDs$current17.get('businessObjectCategory')) !== 'DIMENSION' && /*#__PURE__*/React.createElement(_SelectBox, {
    name: FN.REFEXTFIELD_FLAG,
    colSpan: 1,
    help: intl.get('hmde.bo.businessObject.refExtFieldFlagHelp').d('引用领域定义的标准扩展/弹性域字段, 自动生成对应的业务对象扩展/弹性域字段')
  }, /*#__PURE__*/React.createElement(_SelectBox.Option, {
    value: true
  }, intl.get('hmde.common.yes').d('是')), /*#__PURE__*/React.createElement(_SelectBox.Option, {
    value: false
  }, intl.get('hmde.common.no').d('否'))), ((_boFormDs$current18 = boFormDs.current) === null || _boFormDs$current18 === void 0 ? void 0 : _boFormDs$current18.get('businessObjectCategory')) !== 'DIMENSION' &&
  /*#__PURE__*/
  // 引用预置模板
  React.createElement(_Select, {
    name: FN.TEMPLATE_CODES,
    colSpan: 1,
    addonAfter: /*#__PURE__*/React.createElement(_Icon, {
      type: "visibility-o",
      style: {
        cursor: 'pointer'
      },
      onClick: handleExtendsDetail
    }),
    clearButton: false
  }, customTemplateDS === null || customTemplateDS === void 0 ? void 0 : customTemplateDS.map(v => /*#__PURE__*/React.createElement(_Select.Option, {
    value: v.get('templateCode'),
    disabled: v.get('defaultFlag')
  }, v.get('templateName')))), /*#__PURE__*/React.createElement(_TextField, {
    name: FN.PHYSICALMODEL_NAME,
    colSpan: 1,
    maxLength: 56,
    showLengthInfo: true
  }), extendTableEnabled && !isTenant && /*#__PURE__*/React.createElement(_TextField, {
    name: FN.EXTENDSTABLE_NAME,
    colSpan: 1,
    maxLength: 56,
    showLengthInfo: true
  }), /*#__PURE__*/React.createElement(_TextField, {
    name: FN.CUSTOM_PRIMARY_KEYCODE,
    colSpan: 1,
    label: /*#__PURE__*/React.createElement(LabelTitleRender, {
      value: intl.get('hmde.bo.businessObject.primaryKeyCode').d('主键编码')
    }),
    help: intl.get('hmde.bo.businessObject.customPrimaryKeyCode.help').d('仅支持小驼峰'),
    maxLength: 60,
    showLengthInfo: true
  }), /*#__PURE__*/React.createElement(_Switch, {
    name: FN.SHARED_FLAG,
    colSpan: 1,
    help: intl.get('hmde.bo.businessObject.sharedOrNotHelp').d('当前对象默认在所属领域应用中使用，若选择“是”，允许在其他领域应用的页面使用此对象，此配置不影响从主关联字段的关联对象')
  })), ((_boFormDs$current19 = boFormDs.current) === null || _boFormDs$current19 === void 0 ? void 0 : _boFormDs$current19.get('physicalModelType')) === 'API' && /*#__PURE__*/React.createElement(CreateApiModelTable, {
    ds: apiModelDs,
    type: "copy"
  }))));
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(EditBOModal));