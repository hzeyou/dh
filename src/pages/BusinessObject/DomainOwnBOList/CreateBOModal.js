import _Divider from "@hzero-front-ui/c7n-ui/lib/Divider";
import _Alert from "@hzero-front-ui/c7n-ui/lib/Alert";
import _Switch from "@hzero-front-ui/c7n-ui/lib/SwitchPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _IntlField from "@hzero-front-ui/c7n-ui/lib/IntlFieldPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Lov from "@hzero-front-ui/c7n-ui/lib/LovPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Collapse from "@hzero-front-ui/c7n-ui/lib/Collapse";
import _SelectBox from "@hzero-front-ui/c7n-ui/lib/SelectBoxPro";
import _isPlainObject from "lodash/isPlainObject";
import _noop from "lodash/noop";
import _get from "lodash/get";
import _isArray from "lodash/isArray";
import _debounce from "lodash/debounce";
/*
 * @Descripttion: 创建业务对象弹窗
 * @Date: 2021-08-05 13:34:49
 * @Author: ZHIJIAN.XU@HAND-CHINA.COM
 * @version: 0.0.1
 * @copyright: Copyright (c) 2021, Hand
 * ⚠️ 该模块被 apaas plugin 导出
 */
import React, { useMemo, useEffect, useRef, useState } from 'react';
import intl from 'utils/intl';
import { getResponse, isTenantRoleLevel } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { IntlType } from 'choerodon-ui/pro/lib/intl-field/enum';
// import { FieldType, FieldIgnore } from 'choerodon-ui/pro/lib/data-set/enum';

import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import notification from 'utils/notification';
import { getReverseTableField, fetchDomainDetail } from "hzero-front-hmde/lib/services/businessObjectService";
import { extendsMapDs, apiModelTableDs, createBusinessObjectDS, CREATE_BO_FN } from "hzero-front-hmde/lib/stores/BusinessObject/BusinessObjectDS";
import { PublishStatus } from "hzero-front-apaas/lib/constants/businessObject";
import LabelTitleRender from "hzero-front-hmde/lib/businessComponents/LabelTitleRender";
import LovToBoDetail from "hzero-front-hmde/lib/businessComponents/LovToBoDetail";
import { EDomainDataType } from "hzero-front-hmde/lib/types/businessObject";
import DimensionConfig from "hzero-front-hmde/lib/businessComponents/DimensionConfig";
import { CustomTemplateDS } from "hzero-front-hmde/lib/stores/Domain/DomainDS";
import { BusinessObjectCategory } from "hzero-front-hmde/lib/constants/businessObject";
import { domainDsCreateBo } from "hzero-front-hmde/lib/stores/Domain/DomainDS";
import { customCamelCase } from "hzero-front-hmde/lib/utils/common";
import styles from "./index.less?modules";
import ShowExtendsFieldDetail from "./ShowExtendsFieldDetail";
import ShowExtendsFieldList from "./ShowExtendsFieldList";
import CreateApiModelTable from "./CreateApiModelTable";
import { checkObjectCodePrefix } from "./utils";
import { getBoCategoryHelp } from "./util";
const Option = _SelectBox.Option;
const Panel = _Collapse.Panel;
const formateDesc = (field, desc) => {
  if (!desc) return field;
  return `${desc}(${field})`;
};
const isTenant = isTenantRoleLevel();
const CreateBOModal = ({
  modal,
  dataSet,
  domain,
  domainId,
  serviceCode,
  domainCode,
  extendTableEnabledFlag,
  extendTableSuffix,
  isWorkbenchEnter,
  tenantBusinessObjectPrefixRule = '',
  createSuccessCallback = _noop
}) => {
  var _domainLov$current4, _domainLov$current12, _domainLov$current13, _createBusinessObject5, _domainLov$current16, _createBusinessObject45, _createBusinessObject46, _createBusinessObject47, _createBusinessObject48, _createBusinessObject49, _createBusinessObject50, _createBusinessObject51, _createBusinessObject52, _createBusinessObject54, _createBusinessObject55, _createBusinessObject56, _createBusinessObject57, _createBusinessObject58, _createBusinessObject59, _createBusinessObject60, _createBusinessObject61, _createBusinessObject62, _createBusinessObject63, _createBusinessObject64, _createBusinessObject65, _createBusinessObject66, _createBusinessObject67, _createBusinessObject68, _createBusinessObject69, _createBusinessObject70, _createBusinessObject71;
  // 反向建表的字段
  const _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    physicalModelFieldList = _useState2[0],
    setPhysicalModelFieldList = _useState2[1];
  // 领域是否开启 扩展表模式
  const _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    extendFlagBranchEnter = _useState4[0],
    setExtendFlagBranchEnter = _useState4[1];
  // 保存后属性表单
  const _useState5 = useState(1),
    _useState6 = _slicedToArray(_useState5, 2),
    savekey = _useState6[0],
    setSaveKey = _useState6[1];

  // 租户领域前缀 用于 工作台进来 配置 设置领域前缀
  const _useState7 = useState(''),
    _useState8 = _slicedToArray(_useState7, 2),
    tenantBotPrefixRule = _useState8[0],
    setTenantBotPrefixRule = _useState8[1];

  // 领域Lov ds
  const domainLov = useMemo(() => {
    return new _DataSet(domainDsCreateBo(isTenant, EDomainDataType));
  }, []);
  const lovUpdateCheck = async records => {
    let createdFlag = true;
    try {
      const res = await fetchDomainDetail(records === null || records === void 0 ? void 0 : records.get('domainId'));
      createdFlag = isTenant ? res === null || res === void 0 ? void 0 : res.tenantBusinessObjectCreatedFlag : res === null || res === void 0 ? void 0 : res.businessObjectCreatedFlag;
      if (res !== null && res !== void 0 && res.tenantBusinessObjectPrefixRule) {
        setTenantBotPrefixRule(JSON.parse(res === null || res === void 0 ? void 0 : res.tenantBusinessObjectPrefixRule));
      }
    } catch (error) {
      console.log(error);
    }
    if (createdFlag) {
      return true;
    } else {
      notification.error({
        message: intl.get('hmde.bo.businessObject.chooseDomainErrorTips').d('当前角色/用户暂无在所选领域下新建业务对象的权限，请重新选择所属领域！')
      });
      return false;
    }
  };
  const dRef = useRef();

  // 对象编码前缀
  const getAddonBefore = useMemo(() => {
    var _domainLov$current, _domainLov$current2, _domainLov$current3;
    const boPrefixRule = tenantBusinessObjectPrefixRule || tenantBotPrefixRule;
    if (!(domainLov !== null && domainLov !== void 0 && (_domainLov$current = domainLov.current) !== null && _domainLov$current !== void 0 && _domainLov$current.get('domainCode') || domainCode)) {
      return isTenant && boPrefixRule ? `${boPrefixRule}_` : '_';
    }
    return isTenant && boPrefixRule ? `${(domainLov === null || domainLov === void 0 ? void 0 : (_domainLov$current2 = domainLov.current) === null || _domainLov$current2 === void 0 ? void 0 : _domainLov$current2.get('domainCode')) || domainCode}_${boPrefixRule}_` : `${(domainLov === null || domainLov === void 0 ? void 0 : (_domainLov$current3 = domainLov.current) === null || _domainLov$current3 === void 0 ? void 0 : _domainLov$current3.get('domainCode')) || domainCode}_`;
  }, [domainLov === null || domainLov === void 0 ? void 0 : (_domainLov$current4 = domainLov.current) === null || _domainLov$current4 === void 0 ? void 0 : _domainLov$current4.get('domainCode'), domainCode, tenantBusinessObjectPrefixRule, isTenant, tenantBotPrefixRule]);
  useEffect(() => {
    modal === null || modal === void 0 ? void 0 : modal.update({
      footer: (okBtn, cancelBtn) => {
        return /*#__PURE__*/React.createElement(React.Fragment, null, cancelBtn, !isWorkbenchEnter && /*#__PURE__*/React.createElement(_Button, {
          onClick: async () => handleSave(1)
        }, intl.get('hmde.bo.businessObject.saveAndCreate').d('保存并新建')), okBtn);
      }
    });
  }, [savekey]);

  // api模型类型业务对象 关联数据
  const apiModelDs = useMemo(() => {
    return new _DataSet(apiModelTableDs());
  }, []);
  useEffect(() => {
    checkObjectCodePrefix(getAddonBefore);
  }, [getAddonBefore]);
  const createBusinessObjectDs = useMemo(() => {
    var _domainLov$current5, _domainLov$current6, _domainLov$current7;
    setExtendFlagBranchEnter((domainLov === null || domainLov === void 0 ? void 0 : (_domainLov$current5 = domainLov.current) === null || _domainLov$current5 === void 0 ? void 0 : _domainLov$current5.get('extendTableEnabledFlag')) || false);
    return new _DataSet(createBusinessObjectDS({
      serviceCode: (domainLov === null || domainLov === void 0 ? void 0 : (_domainLov$current6 = domainLov.current) === null || _domainLov$current6 === void 0 ? void 0 : _domainLov$current6.get('serviceCode')) || serviceCode,
      extendTableSuffix: (domainLov === null || domainLov === void 0 ? void 0 : (_domainLov$current7 = domainLov.current) === null || _domainLov$current7 === void 0 ? void 0 : _domainLov$current7.get('extendTableSuffix')) || extendTableSuffix
    }));
  }, []);
  useEffect(() => {
    if (createBusinessObjectDs.current) {
      createBusinessObjectDs.current.init({
        businessObjectName: '',
        businessObjectCode: '',
        businessObjectId: '',
        remark: '',
        sourceType: isTenant ? 'TENANT' : 'PLATFORM',
        enabledFlag: true,
        publishStatus: PublishStatus.UNPUBLISHED,
        autoCreateFlag: true,
        physicalModelName: ''
      });
    } else {
      createBusinessObjectDs.create({
        businessObjectName: '',
        businessObjectCode: '',
        businessObjectId: '',
        remark: '',
        sourceType: isTenant ? 'TENANT' : 'PLATFORM',
        enabledFlag: true,
        publishStatus: PublishStatus.UNPUBLISHED,
        autoCreateFlag: true,
        physicalModelName: ''
      });
    }
  }, [createBusinessObjectDs.current, savekey]);
  useEffect(() => {
    var _domainLov$current8, _domainLov$current9, _domainLov$current10;
    createBusinessObjectDs.setState('domainId', (domainLov === null || domainLov === void 0 ? void 0 : (_domainLov$current8 = domainLov.current) === null || _domainLov$current8 === void 0 ? void 0 : _domainLov$current8.get('domainId')) || domainId);
    createBusinessObjectDs.setState('domainCode', (domainLov === null || domainLov === void 0 ? void 0 : (_domainLov$current9 = domainLov.current) === null || _domainLov$current9 === void 0 ? void 0 : _domainLov$current9.get('domainCode')) || domainCode);
    createBusinessObjectDs.setState('getAddonBefore', getAddonBefore);
    createBusinessObjectDs.setState('extendTableEnabledFlag', extendTableEnabledFlag);
    createBusinessObjectDs.setState('extendFlagBranchEnter', extendFlagBranchEnter);
    if (domainLov !== null && domainLov !== void 0 && (_domainLov$current10 = domainLov.current) !== null && _domainLov$current10 !== void 0 && _domainLov$current10.get('domainId') || domainId) {
      var _domainLov$current11;
      customTemplateDS.setQueryParameter('domainId', (domainLov === null || domainLov === void 0 ? void 0 : (_domainLov$current11 = domainLov.current) === null || _domainLov$current11 === void 0 ? void 0 : _domainLov$current11.get('domainId')) || domainId);
      customTemplateDS.setQueryParameter('positiveEnabledFlag', true);
      customTemplateDS.query().then(res => {
        var _createBusinessObject;
        const arr = [];
        res === null || res === void 0 ? void 0 : res.forEach(v => {
          v.defaultFlag && arr.push(v === null || v === void 0 ? void 0 : v.templateCode);
        });
        createBusinessObjectDs === null || createBusinessObjectDs === void 0 ? void 0 : (_createBusinessObject = createBusinessObjectDs.current) === null || _createBusinessObject === void 0 ? void 0 : _createBusinessObject.set(CREATE_BO_FN.TEMPLATE_CODES, arr);
      });
    } else {
      var _customTemplateDS$rem;
      customTemplateDS === null || customTemplateDS === void 0 ? void 0 : (_customTemplateDS$rem = customTemplateDS.removeAll) === null || _customTemplateDS$rem === void 0 ? void 0 : _customTemplateDS$rem.call(customTemplateDS);
    }
  }, [domainLov === null || domainLov === void 0 ? void 0 : (_domainLov$current12 = domainLov.current) === null || _domainLov$current12 === void 0 ? void 0 : _domainLov$current12.get('domainId'), domainId, domainLov === null || domainLov === void 0 ? void 0 : (_domainLov$current13 = domainLov.current) === null || _domainLov$current13 === void 0 ? void 0 : _domainLov$current13.get('domainCode'), domainCode, createBusinessObjectDs, getAddonBefore, extendTableEnabledFlag, extendFlagBranchEnter]);

  // 引用预置模板 ds 数据
  const customTemplateDS = useMemo(() => new _DataSet(CustomTemplateDS({
    domainId
  })), []);

  // 引用预置模板 阅览
  const handleExtendsDetail = () => {
    var _domainLov$current14, _createBusinessObject2;
    _Modal.open({
      title: intl.get('hmde.bo.businessObject.tempView').d('模板字段预览'),
      style: {
        width: 702
      },
      key: _Modal.key(),
      closable: true,
      autoCenter: true,
      children: /*#__PURE__*/React.createElement(ShowExtendsFieldDetail, {
        domainId: (domainLov === null || domainLov === void 0 ? void 0 : (_domainLov$current14 = domainLov.current) === null || _domainLov$current14 === void 0 ? void 0 : _domainLov$current14.get('domainId')) || domainId,
        templateCodes: createBusinessObjectDs === null || createBusinessObjectDs === void 0 ? void 0 : (_createBusinessObject2 = createBusinessObjectDs.current) === null || _createBusinessObject2 === void 0 ? void 0 : _createBusinessObject2.get(CREATE_BO_FN.TEMPLATE_CODES)
      }),
      footer: (okBtn, cancelBtn) => /*#__PURE__*/React.createElement("div", null, cancelBtn)
    });
  };

  // 映射模板字段
  const extendsMappingDs = useMemo(() => new _DataSet(extendsMapDs(createBusinessObjectDs)), []);
  useEffect(() => {
    var _domainLov$current15, _createBusinessObject3;
    const dId = (domainLov === null || domainLov === void 0 ? void 0 : (_domainLov$current15 = domainLov.current) === null || _domainLov$current15 === void 0 ? void 0 : _domainLov$current15.get('domainId')) || domainId;
    if (createBusinessObjectDs !== null && createBusinessObjectDs !== void 0 && (_createBusinessObject3 = createBusinessObjectDs.current) !== null && _createBusinessObject3 !== void 0 && _createBusinessObject3.get(CREATE_BO_FN.PHYSICAL_MODEL_ID) && dId) {
      var _createBusinessObject4;
      extendsMappingDs.query(1, {
        domainId: dId,
        physicalModelId: createBusinessObjectDs === null || createBusinessObjectDs === void 0 ? void 0 : (_createBusinessObject4 = createBusinessObjectDs.current) === null || _createBusinessObject4 === void 0 ? void 0 : _createBusinessObject4.get(CREATE_BO_FN.PHYSICAL_MODEL_ID),
        repeatFlag: false
      });
    }
  }, [createBusinessObjectDs === null || createBusinessObjectDs === void 0 ? void 0 : (_createBusinessObject5 = createBusinessObjectDs.current) === null || _createBusinessObject5 === void 0 ? void 0 : _createBusinessObject5.get(CREATE_BO_FN.PHYSICAL_MODEL_ID), domainLov === null || domainLov === void 0 ? void 0 : (_domainLov$current16 = domainLov.current) === null || _domainLov$current16 === void 0 ? void 0 : _domainLov$current16.get('domainId'), domainId]);
  const handleExtendsList = () => {
    _Modal.open({
      title: intl.get('hmde.bo.businessObject.ysTempField').d('映射模板字段'),
      style: {
        width: 957
      },
      key: _Modal.key(),
      closable: true,
      autoCenter: true,
      children: /*#__PURE__*/React.createElement(ShowExtendsFieldList, {
        boFormDs: createBusinessObjectDs,
        extendsMappingDs: extendsMappingDs
      })
    });
  };
  useDataSetEvents(createBusinessObjectDs, 'update', ({
    name,
    oldValue,
    record,
    value
  }) => {
    const _autoCreateFlag = record.get('autoCreateFlag');
    const _businessObjectCategory = record.get('businessObjectCategory');
    const _physicalModelId = record.get(CREATE_BO_FN.PHYSICAL_MODEL_ID);
    if (!_autoCreateFlag && _physicalModelId && _businessObjectCategory === 'MIDDLE' && (name === CREATE_BO_FN.PHYSICAL_MODEL_ID || name === 'physicalModel' || name === 'businessObjectCategory')) {
      // 如果是反向建表，需要请求一个下拉值集的数据
      fetchReverseTableField.current(_physicalModelId);
    }
    if ((name === 'autoCreateFlag' || name === 'physicalModel') && _businessObjectCategory === 'MIDDLE') {
      var _createBusinessObject6, _createBusinessObject7, _createBusinessObject8;
      // 中间对象的更改
      if (createBusinessObjectDs !== null && createBusinessObjectDs !== void 0 && (_createBusinessObject6 = createBusinessObjectDs.children) !== null && _createBusinessObject6 !== void 0 && (_createBusinessObject7 = _createBusinessObject6.middleLinkBusinessObjects) !== null && _createBusinessObject7 !== void 0 && (_createBusinessObject8 = _createBusinessObject7.current) !== null && _createBusinessObject8 !== void 0 && _createBusinessObject8.set) {
        createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`name1`, '');
        createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`value1`, '');
        createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`name2`, '');
        createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`value2`, '');
        createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`name1_1`, '');
        createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`value1_1`, '');
        createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`name2_1`, '');
        createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`value2_1`, '');
        if (name === 'physicalModel') {
          createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`firstFieldList`, {});
          createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`secondFieldList`, {});
        }
      }
    }
    if (name === 'businessObjectCategory' && _businessObjectCategory === 'MIDDLE') {
      var _createBusinessObject9, _createBusinessObject10;
      if (!(createBusinessObjectDs !== null && createBusinessObjectDs !== void 0 && (_createBusinessObject9 = createBusinessObjectDs.children) !== null && _createBusinessObject9 !== void 0 && (_createBusinessObject10 = _createBusinessObject9.middleLinkBusinessObjects) !== null && _createBusinessObject10 !== void 0 && _createBusinessObject10.length)) {
        var _createBusinessObject11, _createBusinessObject12;
        // 如果没有数据，需要新建一行
        // eslint-disable-next-line no-unused-expressions
        createBusinessObjectDs === null || createBusinessObjectDs === void 0 ? void 0 : (_createBusinessObject11 = createBusinessObjectDs.children) === null || _createBusinessObject11 === void 0 ? void 0 : (_createBusinessObject12 = _createBusinessObject11.middleLinkBusinessObjects) === null || _createBusinessObject12 === void 0 ? void 0 : _createBusinessObject12.create({});
      }
    }
    if (name === 'businessObjectCategory' && _businessObjectCategory === 'MIDDLE') {
      var _createBusinessObject13;
      createBusinessObjectDs === null || createBusinessObjectDs === void 0 ? void 0 : (_createBusinessObject13 = createBusinessObjectDs.current) === null || _createBusinessObject13 === void 0 ? void 0 : _createBusinessObject13.set(CREATE_BO_FN.PHYSICAL_MODEL_TYPE, 'TABLE');
    }

    // 描述取 对象名称
    if (name === 'businessObjectName' && oldValue === (record === null || record === void 0 ? void 0 : record.get('remark'))) {
      record === null || record === void 0 ? void 0 : record.set('remark', value);
    }
    if (name === 'businessObjectCategory' && _businessObjectCategory === 'DIMENSION') {
      record === null || record === void 0 ? void 0 : record.set(CREATE_BO_FN.PHYSICAL_MODEL_TYPE, 'TABLE');
      record === null || record === void 0 ? void 0 : record.set('refExtFieldFlag', true);
      record === null || record === void 0 ? void 0 : record.set('autoCreateFlag', true);
    }
  });

  // 获取反向建表字段
  const fetchReverseTableField = useRef(_debounce(tableId => {
    const _tableId = _isPlainObject !== null && _isPlainObject !== void 0 && _isPlainObject(tableId) ? tableId.id : tableId;
    if (!_tableId) return;
    getReverseTableField({
      tableId: _tableId
    }).then(res => {
      if (_isArray(res)) {
        setPhysicalModelFieldList(res);
      }
    });
  }));

  // 处理LOV 改变
  const handleMiddleObjChange = (val, index, omitName) => {
    var _createBusinessObject14, _createBusinessObject15, _createBusinessObject19, _createBusinessObject20, _createBusinessObject21, _createBusinessObject25, _createBusinessObject26, _createBusinessObject27;
    if (!((_createBusinessObject14 = createBusinessObjectDs.current) !== null && _createBusinessObject14 !== void 0 && (_createBusinessObject15 = _createBusinessObject14.get) !== null && _createBusinessObject15 !== void 0 && _createBusinessObject15.call(_createBusinessObject14, 'autoCreateFlag'))) return; // 关联物理模型，不需要联动更新

    if (!val) {
      var _createBusinessObject16, _createBusinessObject17, _createBusinessObject18;
      // 清空
      if (createBusinessObjectDs !== null && createBusinessObjectDs !== void 0 && (_createBusinessObject16 = createBusinessObjectDs.children) !== null && _createBusinessObject16 !== void 0 && (_createBusinessObject17 = _createBusinessObject16.middleLinkBusinessObjects) !== null && _createBusinessObject17 !== void 0 && (_createBusinessObject18 = _createBusinessObject17.current) !== null && _createBusinessObject18 !== void 0 && _createBusinessObject18.set) {
        createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`name${index}`, '');
        createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`value${index}`, '');
        createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`name${index === '1' ? 2 : 1}_1`, '');
        createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`value${index === '1' ? 2 : 1}_1`, '');
      }
      return;
    }

    // first second 不能选择同一个对象
    let another = {};
    if (createBusinessObjectDs !== null && createBusinessObjectDs !== void 0 && (_createBusinessObject19 = createBusinessObjectDs.children) !== null && _createBusinessObject19 !== void 0 && (_createBusinessObject20 = _createBusinessObject19.middleLinkBusinessObjects) !== null && _createBusinessObject20 !== void 0 && (_createBusinessObject21 = _createBusinessObject20.current) !== null && _createBusinessObject21 !== void 0 && _createBusinessObject21.get) {
      var _createBusinessObject22, _createBusinessObject23, _createBusinessObject24;
      another = (createBusinessObjectDs === null || createBusinessObjectDs === void 0 ? void 0 : (_createBusinessObject22 = createBusinessObjectDs.children) === null || _createBusinessObject22 === void 0 ? void 0 : (_createBusinessObject23 = _createBusinessObject22.middleLinkBusinessObjects) === null || _createBusinessObject23 === void 0 ? void 0 : (_createBusinessObject24 = _createBusinessObject23.current) === null || _createBusinessObject24 === void 0 ? void 0 : _createBusinessObject24.get(omitName)) || {};
    }
    const businessObjectCode = val.businessObjectCode,
      businessObjectName = val.businessObjectName;
    if (createBusinessObjectDs !== null && createBusinessObjectDs !== void 0 && (_createBusinessObject25 = createBusinessObjectDs.children) !== null && _createBusinessObject25 !== void 0 && (_createBusinessObject26 = _createBusinessObject25.middleLinkBusinessObjects) !== null && _createBusinessObject26 !== void 0 && (_createBusinessObject27 = _createBusinessObject26.current) !== null && _createBusinessObject27 !== void 0 && _createBusinessObject27.set && another.businessObjectCode !== businessObjectCode) {
      createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`name${index}`, `${businessObjectName}ID`);
      createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`value${index}`, `${customCamelCase(businessObjectCode, ['_', '-'])}Id`);
      createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`name${index === '1' ? 2 : 1}_1`, `${intl.get('hmde.common.checkboxType').d('多选')}${businessObjectName}`);
      createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`value${index === '1' ? 2 : 1}_1`, customCamelCase(`multi_${businessObjectCode}`, ['_', '-']));
    }
  };
  const handleSave = async type => {
    var _createBusinessObject28, _dRef$current, _dRef$current$ds, _createBusinessObject29;
    // if (!checkObjectCodePrefix(getAddonBefore)) return false;
    // if (
    //   (!(await domainLov.validate()) && isWorkbenchEnter) ||
    //   !(
    //     (await dRef?.current?.ds?.validate()) ||
    //     createBusinessObjectDs?.current?.get('businessObjectCategory') !== 'DIMENSION'
    //   )
    // ) {
    //   return false;
    // }

    // 工作台进来 校验领域LOV 没校验通过则停止提交
    if (isWorkbenchEnter && !(await domainLov.validate())) {
      return false;
    }
    // 参数对象 校验维度配置 没校验通过则停止提交
    if ((createBusinessObjectDs === null || createBusinessObjectDs === void 0 ? void 0 : (_createBusinessObject28 = createBusinessObjectDs.current) === null || _createBusinessObject28 === void 0 ? void 0 : _createBusinessObject28.get('businessObjectCategory')) === 'DIMENSION' && !(await (dRef === null || dRef === void 0 ? void 0 : (_dRef$current = dRef.current) === null || _dRef$current === void 0 ? void 0 : (_dRef$current$ds = _dRef$current.ds) === null || _dRef$current$ds === void 0 ? void 0 : _dRef$current$ds.validate()))) {
      return false;
    }
    const formValues = await createBusinessObjectDs.validate();
    let apiValues = true;
    if ((createBusinessObjectDs === null || createBusinessObjectDs === void 0 ? void 0 : (_createBusinessObject29 = createBusinessObjectDs.current) === null || _createBusinessObject29 === void 0 ? void 0 : _createBusinessObject29.get(CREATE_BO_FN.PHYSICAL_MODEL_TYPE)) === 'API') {
      apiValues = await apiModelDs.validate();
    }
    if (formValues && apiValues) {
      var _createBusinessObject30, _dRef$current2, _dRef$current2$save;
      if ((createBusinessObjectDs === null || createBusinessObjectDs === void 0 ? void 0 : (_createBusinessObject30 = createBusinessObjectDs.current) === null || _createBusinessObject30 === void 0 ? void 0 : _createBusinessObject30.get(CREATE_BO_FN.PHYSICAL_MODEL_TYPE)) === 'API') {
        var _createBusinessObject31;
        createBusinessObjectDs === null || createBusinessObjectDs === void 0 ? void 0 : (_createBusinessObject31 = createBusinessObjectDs.current) === null || _createBusinessObject31 === void 0 ? void 0 : _createBusinessObject31.set('apiList', apiModelDs === null || apiModelDs === void 0 ? void 0 : apiModelDs.map(v => {
          return {
            type: v === null || v === void 0 ? void 0 : v.get('type'),
            relatedApiId: v === null || v === void 0 ? void 0 : v.get('relatedApiId'),
            relatedApiName: v === null || v === void 0 ? void 0 : v.get('relatedApiName')
          };
        }));
      }
      dRef === null || dRef === void 0 ? void 0 : (_dRef$current2 = dRef.current) === null || _dRef$current2 === void 0 ? void 0 : (_dRef$current2$save = _dRef$current2.save) === null || _dRef$current2$save === void 0 ? void 0 : _dRef$current2$save.call(_dRef$current2);
      const res = await createBusinessObjectDs.submit();
      if (getResponse(res)) {
        createSuccessCallback === null || createSuccessCallback === void 0 ? void 0 : createSuccessCallback(res);
        if (!isWorkbenchEnter) {
          await (dataSet === null || dataSet === void 0 ? void 0 : dataSet.query());
        }

        // 保存并新建
        if (type === 1) {
          setSaveKey(+new Date());
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    modal === null || modal === void 0 ? void 0 : modal.handleOk(async () => {
      return handleSave();
    });
  }, []);

  /**
   * 新建对象时，对象字段名称需要有长度限制，最大不超过30，若果选的是关联物理模型，则带出的字段名称可能会超过30单前端看不到校验，因此需要手动截取
   * @param description
   * @param physicalModelName
   * @param index
   * @returns
   */
  function truncateString(description, physicalModelName, index) {
    const name = description || `${physicalModelName}ID`;
    if (description) {
      // 判断字符串长度是否超过30
      if (name.length > 30) {
        // 截取前30个字符
        return name.substring(0, 30);
      } else {
        // 如果长度不超过30，直接返回原字符串
        return name;
      }
    } else {
      if (name.length > 30) {
        // 截取前30个字符
        return name.substring(0, 29) + index;
      } else {
        // 如果长度不超过30，直接返回原字符串
        return name + index;
      }
    }
  }
  const relationRender = ([name, index, omitName]) => {
    return /*#__PURE__*/React.createElement(_Select, {
      required: true,
      key: name,
      name: name,
      style: {
        width: '100%'
      },
      optionsFilter: record => {
        var _createBusinessObject32, _createBusinessObject33, _createBusinessObject34;
        // 两个字段不允许一样
        let another = '';
        if (createBusinessObjectDs !== null && createBusinessObjectDs !== void 0 && (_createBusinessObject32 = createBusinessObjectDs.children) !== null && _createBusinessObject32 !== void 0 && (_createBusinessObject33 = _createBusinessObject32.middleLinkBusinessObjects) !== null && _createBusinessObject33 !== void 0 && (_createBusinessObject34 = _createBusinessObject33.current) !== null && _createBusinessObject34 !== void 0 && _createBusinessObject34.get) {
          var _createBusinessObject35, _createBusinessObject36, _createBusinessObject37;
          another = createBusinessObjectDs === null || createBusinessObjectDs === void 0 ? void 0 : (_createBusinessObject35 = createBusinessObjectDs.children) === null || _createBusinessObject35 === void 0 ? void 0 : (_createBusinessObject36 = _createBusinessObject35.middleLinkBusinessObjects) === null || _createBusinessObject36 === void 0 ? void 0 : (_createBusinessObject37 = _createBusinessObject36.current) === null || _createBusinessObject37 === void 0 ? void 0 : _createBusinessObject37.get(omitName);
        }
        return another !== (record === null || record === void 0 ? void 0 : record.get('value'));
      },
      onChange: val => {
        var _createBusinessObject41, _createBusinessObject42, _createBusinessObject43;
        if (!val) {
          var _createBusinessObject38, _createBusinessObject39, _createBusinessObject40;
          if (createBusinessObjectDs !== null && createBusinessObjectDs !== void 0 && (_createBusinessObject38 = createBusinessObjectDs.children) !== null && _createBusinessObject38 !== void 0 && (_createBusinessObject39 = _createBusinessObject38.middleLinkBusinessObjects) !== null && _createBusinessObject39 !== void 0 && (_createBusinessObject40 = _createBusinessObject39.current) !== null && _createBusinessObject40 !== void 0 && _createBusinessObject40.set) {
            createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`name${index}`, '');
            createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`value${index}`, '');
          }
          return;
        }
        const selectItem = physicalModelFieldList.find(o => o.camelCaseName === val.value);
        if (selectItem && createBusinessObjectDs !== null && createBusinessObjectDs !== void 0 && (_createBusinessObject41 = createBusinessObjectDs.children) !== null && _createBusinessObject41 !== void 0 && (_createBusinessObject42 = _createBusinessObject41.middleLinkBusinessObjects) !== null && _createBusinessObject42 !== void 0 && (_createBusinessObject43 = _createBusinessObject42.current) !== null && _createBusinessObject43 !== void 0 && _createBusinessObject43.set) {
          var _createBusinessObject44;
          const physicalModelName = _get((_createBusinessObject44 = createBusinessObjectDs.current) === null || _createBusinessObject44 === void 0 ? void 0 : _createBusinessObject44.get('physicalModel'), ['name'], '');
          const nameStr = truncateString(selectItem.description, `${physicalModelName}ID`, index);
          createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`name${index}`, nameStr);
          createBusinessObjectDs.children.middleLinkBusinessObjects.current.set(`value${index}`, selectItem.camelCaseName);
        }
      }
    }, physicalModelFieldList.map(o => {
      return /*#__PURE__*/React.createElement(_Select.Option, {
        key: o.camelCaseName,
        value: o.camelCaseName
      }, formateDesc(o.camelCaseName, o.description));
    }));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, isWorkbenchEnter && /*#__PURE__*/React.createElement(_Form, {
    labelWidth: 130,
    dataSet: domainLov
    // useColon={false}
    ,
    columns: 2
  }, /*#__PURE__*/React.createElement(_Lov, {
    name: "dominObj",
    autoSelectSingle: false,
    onBeforeSelect: lovUpdateCheck
  })), /*#__PURE__*/React.createElement(_Form, {
    labelWidth: 130,
    dataSet: createBusinessObjectDs
    // useColon={false}
    ,
    columns: 2,
    className: styles['create-form']
  }, /*#__PURE__*/React.createElement(_IntlField, {
    name: CREATE_BO_FN.BUSINESS_OBJECT_NAME,
    colSpan: 1,
    suffix: /*#__PURE__*/React.createElement(_Icon, {
      type: "language"
    })
  }), /*#__PURE__*/React.createElement(_TextField, {
    name: CREATE_BO_FN.BUSINESS_OBJECT_CODE,
    colSpan: 1,
    addonBefore: getAddonBefore && /*#__PURE__*/React.createElement(_Tooltip, {
      title: getAddonBefore
    }, getAddonBefore),
    maxLength: 56 - getAddonBefore.length,
    showLengthInfo: true,
    onChange: () => createBusinessObjectDs.setState('businessObjectCodeEditFlag', true)
  }), /*#__PURE__*/React.createElement(_Select, {
    name: CREATE_BO_FN.BUSINESS_OBJECT_CATEGORY,
    colSpan: 1,
    optionRenderer: ({
      text,
      value
    }) => {
      return /*#__PURE__*/React.createElement(React.Fragment, null, text, getBoCategoryHelp(value));
    }
  }), /*#__PURE__*/React.createElement(_Switch, {
    name: CREATE_BO_FN.ENABLED_FLAG,
    colSpan: 1
  }), /*#__PURE__*/React.createElement(_IntlField, {
    name: CREATE_BO_FN.REMARK,
    colSpan: 1,
    type: "multipleLine",
    suffix: /*#__PURE__*/React.createElement(_Icon, {
      type: "language"
    })
  })), /*#__PURE__*/React.createElement(_Collapse, {
    ghost: true,
    defaultActiveKey: ['objRelationConfig', 'advanced', 'dimensionConfig']
  }, ((_createBusinessObject45 = createBusinessObjectDs.current) === null || _createBusinessObject45 === void 0 ? void 0 : _createBusinessObject45.get('businessObjectCategory')) === 'DIMENSION' && /*#__PURE__*/React.createElement(Panel, {
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
    ds: createBusinessObjectDs,
    dRef: dRef
  })), ((_createBusinessObject46 = createBusinessObjectDs.current) === null || _createBusinessObject46 === void 0 ? void 0 : _createBusinessObject46.get('businessObjectCategory')) === 'MIDDLE' ? /*#__PURE__*/React.createElement(Panel, {
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
    columns: 2,
    labelWidth: 130
    // useColon={false}
    ,
    dataSet: createBusinessObjectDs.children.middleLinkBusinessObjects,
    style: {
      marginTop: '12px'
    }
  }, /*#__PURE__*/React.createElement(LovToBoDetail, {
    name: CREATE_BO_FN.FIRST,
    record: createBusinessObjectDs === null || createBusinessObjectDs === void 0 ? void 0 : (_createBusinessObject47 = createBusinessObjectDs.children) === null || _createBusinessObject47 === void 0 ? void 0 : (_createBusinessObject48 = _createBusinessObject47.middleLinkBusinessObjects) === null || _createBusinessObject48 === void 0 ? void 0 : _createBusinessObject48.current,
    colSpan: 1,
    style: {
      width: '100%'
    },
    tooltip: 'none',
    onChange: val => handleMiddleObjChange(val, '1', 'second'),
    tableProps: {
      queryFieldsLimit: 4
    }
  }), /*#__PURE__*/React.createElement(LovToBoDetail, {
    name: CREATE_BO_FN.SECOND,
    record: createBusinessObjectDs === null || createBusinessObjectDs === void 0 ? void 0 : (_createBusinessObject49 = createBusinessObjectDs.children) === null || _createBusinessObject49 === void 0 ? void 0 : (_createBusinessObject50 = _createBusinessObject49.middleLinkBusinessObjects) === null || _createBusinessObject50 === void 0 ? void 0 : _createBusinessObject50.current,
    colSpan: 1,
    style: {
      width: '100%'
    },
    tooltip: 'none',
    onChange: val => handleMiddleObjChange(val, '2', 'first'),
    tableProps: {
      queryFieldsLimit: 4
    }
  }))) : null, /*#__PURE__*/React.createElement(Panel, {
    key: "advanced",
    header: /*#__PURE__*/React.createElement("span", {
      className: styles['modal-title']
    }, intl.get('hmde.common.advancedConfig').d('高级配置'))
  }, /*#__PURE__*/React.createElement(_Form, {
    labelWidth: 130,
    dataSet: createBusinessObjectDs,
    columns: 2
  }, /*#__PURE__*/React.createElement(_SelectBox, {
    name: CREATE_BO_FN.PHYSICAL_MODEL_TYPE,
    colSpan: 1,
    disabled: ((_createBusinessObject51 = createBusinessObjectDs.current) === null || _createBusinessObject51 === void 0 ? void 0 : _createBusinessObject51.get('businessObjectCategory')) === 'MIDDLE' || ((_createBusinessObject52 = createBusinessObjectDs.current) === null || _createBusinessObject52 === void 0 ? void 0 : _createBusinessObject52.get('businessObjectCategory')) === 'DIMENSION',
    optionsFilter: optionRecord => {
      var _createBusinessObject53;
      // 如有基础对象由 SQL 数据类型
      if (((_createBusinessObject53 = createBusinessObjectDs.current) === null || _createBusinessObject53 === void 0 ? void 0 : _createBusinessObject53.get('businessObjectCategory')) !== BusinessObjectCategory.STANDARD && optionRecord.get('value') === 'SQL') {
        return false;
      }
      return true;
    }
  }), ((_createBusinessObject54 = createBusinessObjectDs.current) === null || _createBusinessObject54 === void 0 ? void 0 : _createBusinessObject54.get(CREATE_BO_FN.PHYSICAL_MODEL_TYPE)) === 'SQL' && /*#__PURE__*/React.createElement(_Switch, {
    name: CREATE_BO_FN.SHARED_FLAG,
    colSpan: 1
  })), ((_createBusinessObject55 = createBusinessObjectDs.current) === null || _createBusinessObject55 === void 0 ? void 0 : _createBusinessObject55.get(CREATE_BO_FN.PHYSICAL_MODEL_TYPE)) === 'TABLE' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Form, {
    labelWidth: 130,
    dataSet: createBusinessObjectDs,
    columns: 2
  }, /*#__PURE__*/React.createElement(_SelectBox, {
    name: CREATE_BO_FN.AUTO_CREATE_FLAG,
    colSpan: 1,
    disabled: ((_createBusinessObject56 = createBusinessObjectDs.current) === null || _createBusinessObject56 === void 0 ? void 0 : _createBusinessObject56.get('businessObjectCategory')) === 'DIMENSION'
  }, /*#__PURE__*/React.createElement(Option, {
    value: false
  }, intl.get('hmde.common.link').d('关联')), /*#__PURE__*/React.createElement(Option, {
    value: true
  }, intl.get('hmde.common.status.notRelation').d('未关联'))), !isTenant && ((_createBusinessObject57 = createBusinessObjectDs.current) === null || _createBusinessObject57 === void 0 ? void 0 : (_createBusinessObject58 = _createBusinessObject57.get) === null || _createBusinessObject58 === void 0 ? void 0 : _createBusinessObject58.call(_createBusinessObject57, 'autoCreateFlag')) && ((domain === null || domain === void 0 ? void 0 : domain.extendTableEnabledFlag) || (domain === null || domain === void 0 ? void 0 : domain.flexFieldEnabledFlag)) && ((_createBusinessObject59 = createBusinessObjectDs.current) === null || _createBusinessObject59 === void 0 ? void 0 : _createBusinessObject59.get('businessObjectCategory')) !== 'DIMENSION' && /*#__PURE__*/React.createElement(_SelectBox, {
    name: CREATE_BO_FN.REF_EXT_FIELD_FLAG,
    colSpan: 1,
    label: /*#__PURE__*/React.createElement(LabelTitleRender, {
      value: intl.get('hmde.bo.modeler.refExtFieldFlag').d('引用标准扩展字段'),
      help: intl.get('hmde.bo.businessObject.refExtFieldFlagHelp').d('引用领域定义的标准扩展/弹性域字段, 自动生成对应的业务对象扩展/弹性域字段')
    })
  }, /*#__PURE__*/React.createElement(Option, {
    value: true
  }, intl.get('hmde.common.yes').d('是')), /*#__PURE__*/React.createElement(Option, {
    value: false
  }, intl.get('hmde.common.no').d('否'))), !!((_createBusinessObject60 = createBusinessObjectDs.current) !== null && _createBusinessObject60 !== void 0 && (_createBusinessObject61 = _createBusinessObject60.get) !== null && _createBusinessObject61 !== void 0 && _createBusinessObject61.call(_createBusinessObject60, 'autoCreateFlag')) && ((_createBusinessObject62 = createBusinessObjectDs.current) === null || _createBusinessObject62 === void 0 ? void 0 : _createBusinessObject62.get('businessObjectCategory')) !== 'DIMENSION' && /*#__PURE__*/React.createElement(_Select, {
    name: CREATE_BO_FN.TEMPLATE_CODES,
    colSpan: 1,
    addonAfter: /*#__PURE__*/React.createElement(_Icon, {
      type: "visibility-o",
      style: {
        cursor: 'pointer'
      },
      onClick: handleExtendsDetail
    }),
    clearButton: false
  }, customTemplateDS === null || customTemplateDS === void 0 ? void 0 : customTemplateDS.map(v => /*#__PURE__*/React.createElement(Option, {
    value: v.get('templateCode'),
    disabled: v.get('defaultFlag')
  }, v.get('templateName')))), !((_createBusinessObject63 = createBusinessObjectDs.current) !== null && _createBusinessObject63 !== void 0 && (_createBusinessObject64 = _createBusinessObject63.get) !== null && _createBusinessObject64 !== void 0 && _createBusinessObject64.call(_createBusinessObject63, 'autoCreateFlag')) ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Lov, {
    name: CREATE_BO_FN.PHYSICAL_MODEL,
    colSpan: 1
  }), (extendTableEnabledFlag || extendFlagBranchEnter) && !((domain === null || domain === void 0 ? void 0 : domain.sourceType) === 'PLATFORM' && isTenant) && /*#__PURE__*/React.createElement(_Lov, {
    name: CREATE_BO_FN.EXT_PHYSICAL_MODEL,
    colSpan: 1
  }), /*#__PURE__*/React.createElement(_Button, {
    name: CREATE_BO_FN.CHECKED_RELATION,
    disabled: !(createBusinessObjectDs !== null && createBusinessObjectDs !== void 0 && (_createBusinessObject65 = createBusinessObjectDs.current) !== null && _createBusinessObject65 !== void 0 && _createBusinessObject65.get(CREATE_BO_FN.PHYSICAL_MODEL_ID)),
    icon: "edit-o",
    onClick: handleExtendsList,
    style: {
      width: 'auto'
    },
    className: `${styles['error-button']}`
  }, intl.get('hmde.bo.businessObject.setMapping').d('设置映射')), ";") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_TextField, {
    name: CREATE_BO_FN.PHYSICAL_MODEL_NAME,
    colSpan: 1,
    maxLength: 56,
    showLengthInfo: true,
    onChange: () => createBusinessObjectDs.setState('physicalModelNameEditFlag', true)
  }), !isTenant && (extendTableEnabledFlag || extendFlagBranchEnter) && /*#__PURE__*/React.createElement(_TextField, {
    name: CREATE_BO_FN.EXTENDS_TABLE_NAME,
    colSpan: 1,
    maxLength: 60,
    showLengthInfo: true,
    onChange: () => createBusinessObjectDs.setState('extendsTableNameEditFlag', true)
  })), /*#__PURE__*/React.createElement(_TextField, {
    name: CREATE_BO_FN.CUSTOM_PRIMARY_KEY_CODE,
    colSpan: 1,
    label: /*#__PURE__*/React.createElement(LabelTitleRender, {
      value: intl.get('hmde.bo.businessObject.primaryKeyCode').d('主键编码'),
      help: intl.get('hmde.bo.businessObject.customPrimaryKeyCode.help').d('仅支持小驼峰')
    }),
    maxLength: 60,
    showLengthInfo: true,
    disabled: !((_createBusinessObject66 = createBusinessObjectDs.current) !== null && _createBusinessObject66 !== void 0 && (_createBusinessObject67 = _createBusinessObject66.get) !== null && _createBusinessObject67 !== void 0 && _createBusinessObject67.call(_createBusinessObject66, 'autoCreateFlag'))
  })), ((_createBusinessObject68 = createBusinessObjectDs.current) === null || _createBusinessObject68 === void 0 ? void 0 : _createBusinessObject68.get('businessObjectCategory')) === 'MIDDLE' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Divider, null), /*#__PURE__*/React.createElement(_Form, {
    labelWidth: 130,
    columns: 2
    // useColon={false}
    ,
    dataSet: createBusinessObjectDs.children.middleLinkBusinessObjects
  }, !((_createBusinessObject69 = createBusinessObjectDs.current) !== null && _createBusinessObject69 !== void 0 && (_createBusinessObject70 = _createBusinessObject69.get) !== null && _createBusinessObject70 !== void 0 && _createBusinessObject70.call(_createBusinessObject69, 'autoCreateFlag')) ? /*#__PURE__*/React.createElement(React.Fragment, null, relationRender(['firstFieldList', '1', 'value2']), relationRender(['secondFieldList', '2', 'value1'])) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_IntlField, {
    name: CREATE_BO_FN.NAME1,
    placeholder: intl.get('hmde.common.fieldName').d('字段名称')
  }), /*#__PURE__*/React.createElement(_IntlField, {
    name: CREATE_BO_FN.NAME2,
    placeholder: intl.get('hmde.common.fieldName').d('字段名称')
  }), /*#__PURE__*/React.createElement(_TextField, {
    name: CREATE_BO_FN.VALUE1,
    maxLength: 60,
    showLengthInfo: true,
    placeholder: intl.get('hmde.common.fieldCode').d('字段编码')
  }), /*#__PURE__*/React.createElement(_TextField, {
    name: CREATE_BO_FN.VALUE2,
    maxLength: 60,
    showLengthInfo: true,
    placeholder: intl.get('hmde.common.fieldCode').d('字段编码')
  })), /*#__PURE__*/React.createElement(_IntlField, {
    name: CREATE_BO_FN.NAME1_1,
    placeholder: intl.get('hmde.common.fieldName').d('字段名称')
  }), /*#__PURE__*/React.createElement(_IntlField, {
    name: CREATE_BO_FN.NAME2_1,
    placeholder: intl.get('hmde.common.fieldName').d('字段名称')
  }), /*#__PURE__*/React.createElement(_TextField, {
    name: CREATE_BO_FN.VALUE1_1,
    maxLength: 60,
    showLengthInfo: true,
    placeholder: intl.get('hmde.common.fieldCode').d('字段编码')
  }), /*#__PURE__*/React.createElement(_TextField, {
    name: CREATE_BO_FN.VALUE2_1,
    maxLength: 60,
    showLengthInfo: true,
    placeholder: intl.get('hmde.common.fieldCode').d('字段编码')
  }))) : null, /*#__PURE__*/React.createElement(_Form, {
    labelWidth: 130,
    dataSet: createBusinessObjectDs,
    columns: 2
  }, /*#__PURE__*/React.createElement(_Switch, {
    name: CREATE_BO_FN.SHARED_FLAG,
    colSpan: 1
  }))), ((_createBusinessObject71 = createBusinessObjectDs.current) === null || _createBusinessObject71 === void 0 ? void 0 : _createBusinessObject71.get(CREATE_BO_FN.PHYSICAL_MODEL_TYPE)) === 'API' && /*#__PURE__*/React.createElement(CreateApiModelTable, {
    ds: apiModelDs
  }))));
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(CreateBOModal));