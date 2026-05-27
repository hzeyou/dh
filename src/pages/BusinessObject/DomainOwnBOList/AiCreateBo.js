import _Tabs from "@hzero-front-ui/c7n-ui/lib/TabsPro";
import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _IntlField from "@hzero-front-ui/c7n-ui/lib/IntlFieldPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _Divider from "@hzero-front-ui/c7n-ui/lib/Divider";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _TextArea from "@hzero-front-ui/c7n-ui/lib/TextAreaPro";
import _CheckBox from "@hzero-front-ui/c7n-ui/lib/CheckBoxPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Switch from "@hzero-front-ui/c7n-ui/lib/SwitchPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { isTenantRoleLevel, getResponse } from 'utils/utils';
import intl from 'utils/intl';
import { TableQueryBarType, ColumnAlign, TableColumnTooltip } from 'choerodon-ui/pro/lib/table/enum';
import axios from 'axios';
import { useUnmount } from 'ahooks';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import { aiCreateService } from "hzero-front-hmde/lib/services/businessObjectService";
import { aiCreateForm, AiCreateFN, aiCreateField, aisSearchMesS, aisSearchMesP, whoFieldDS } from "hzero-front-hmde/lib/stores/BusinessObject/BusinessObjectDS";
import tableRendererStyles from "hzero-front-hmde/lib/tableRenderer.less?modules";
import styles from "./index.less?modules";
// import WhoFieldModal from './components/WhoFieldModal';

const isTenant = isTenantRoleLevel();
const App = ({
  modal,
  tenantBusinessObjectPrefixRule = '',
  domainCode,
  domainId,
  boTableDs
}) => {
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    loading = _useState2[0],
    setLoading = _useState2[1];
  const _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    loadingCreate = _useState4[0],
    setLoadingCreate = _useState4[1];
  const _useState5 = useState('simple'),
    _useState6 = _slicedToArray(_useState5, 2),
    type = _useState6[0],
    setType = _useState6[1];
  const _useState7 = useState(true),
    _useState8 = _slicedToArray(_useState7, 2),
    createDis = _useState8[0],
    setCreateDis = _useState8[1];
  const cancelRequestRef = useRef(axios.CancelToken.source());
  const searchDsS = useMemo(() => new _DataSet(aisSearchMesS()), []);
  const searchDsP = useMemo(() => new _DataSet(aisSearchMesP()), []);
  const nameCodeDsP = useMemo(() => new _DataSet(aiCreateForm()), []);
  const nameCodeDsS = useMemo(() => new _DataSet(aiCreateForm()), []);
  const fieldDsS = useMemo(() => new _DataSet(aiCreateField()), []);
  const fieldDsP = useMemo(() => new _DataSet(aiCreateField()), []);
  const whoFieldDs = useMemo(() => new _DataSet(whoFieldDS(domainId)), []);

  // 对象编码前缀
  const getAddonBefore = useMemo(() => {
    if (!domainCode) {
      return isTenant && tenantBusinessObjectPrefixRule ? `${tenantBusinessObjectPrefixRule}_` : '_';
    }
    return isTenant && tenantBusinessObjectPrefixRule ? `${domainCode}_${tenantBusinessObjectPrefixRule}_` : `${domainCode}_`;
  }, [domainCode, tenantBusinessObjectPrefixRule, isTenant]);
  const aiGetDs = useMemo(() => new _DataSet({
    autoQuery: false,
    autoCreate: true,
    paging: false,
    transport: {
      read: ({
        data
      }) => {
        return {
          url: `${lowcodeOrganizationURL({
            route: HZERO_HMDE
          })}/aigc/business-object/create/${type === 'pro' ? 'pro' : 'simple'}`,
          method: 'POST',
          body: data,
          cancelToken: cancelRequestRef.current.token
        };
      }
    }
  }), [type]);
  useDataSetEvents(whoFieldDs, 'load', () => {
    var _fieldDsS$getField, _fieldDsP$getField;
    const handleValidator = (value, name, record) => {
      var _dataSet, _dataSet$some;
      const pattern = /^[a-z][0-9a-zA-Z]{0,}$/;
      if (!pattern.test(value)) {
        return intl.get('hmde.bo.businessObject.fieldCode.validation1').d('需以小写字母开头，中间支持大写字母、小写字母、数字组合，推荐使用小驼峰');
      }
      if (record !== null && record !== void 0 && (_dataSet = record.dataSet) !== null && _dataSet !== void 0 && (_dataSet$some = _dataSet.some) !== null && _dataSet$some !== void 0 && _dataSet$some.call(_dataSet, v => (v === null || v === void 0 ? void 0 : v.get(AiCreateFN.FIELD_CODE)) === value && v.index !== (record === null || record === void 0 ? void 0 : record.index))) {
        return intl.get('hmde.bo.businessObject.code.patternValidation5').d('字段编码不能重复');
      }
      // const repeatFlag = whoFieldDs.find((r) => r?.get('templateFieldCode') === value);
      // if (repeatFlag) {
      //   return intl.get('hmde.bo.aiCreate.repeatTips').d('与【系统】模板字段编码重复');
      // }
    };
    fieldDsS === null || fieldDsS === void 0 ? void 0 : (_fieldDsS$getField = fieldDsS.getField(AiCreateFN.FIELD_CODE)) === null || _fieldDsS$getField === void 0 ? void 0 : _fieldDsS$getField.set('validator', handleValidator);
    fieldDsP === null || fieldDsP === void 0 ? void 0 : (_fieldDsP$getField = fieldDsP.getField(AiCreateFN.FIELD_CODE)) === null || _fieldDsP$getField === void 0 ? void 0 : _fieldDsP$getField.set('validator', handleValidator);
  });
  useDataSetEvents(nameCodeDsP, 'update', () => {
    isDis();
  });
  useDataSetEvents(nameCodeDsS, 'update', () => {
    isDis();
  });

  // 接口请求取消
  useUnmount(() => {
    cancelRequestRef.current.cancel();
  });
  const handleOptionsFilter = (option, record) => {
    if (record !== null && record !== void 0 && record.get('templateCode')) {
      return true;
    }
    return ['TEXT_FIELD', 'FLOAT', 'NUMBER_FIELD', 'DATE_SELECTION_BOX', 'DATETIME_SELECTION_BOX'].includes(option === null || option === void 0 ? void 0 : option.get('value'));
  };
  const columns = useMemo(() => {
    return [{
      name: AiCreateFN.FIELD_NAME,
      align: "left",
      tooltip: "overflow",
      // editor: true,
      editor: record => !(record !== null && record !== void 0 && record.get('templateCode'))
    }, {
      name: AiCreateFN.FIELD_CODE,
      align: "left",
      tooltip: "overflow",
      // editor: true,
      editor: record => !(record !== null && record !== void 0 && record.get('templateCode'))
    }, {
      name: AiCreateFN.FIELD_TYPE,
      align: "left",
      tooltip: "overflow",
      className: tableRendererStyles.column,
      // editor: (
      //   <Select
      //     name={AiCreateFN.FIELD_TYPE}
      //     optionsFilter={(options) => handleOptionsFilter(options)}
      //   />
      // ),
      renderer: ({
        record
      }) => /*#__PURE__*/React.createElement(_Select, {
        record: record,
        disabled: !!(record !== null && record !== void 0 && record.get('templateCode')),
        name: AiCreateFN.FIELD_TYPE,
        optionsFilter: options => handleOptionsFilter(options, record)
      })
    }, {
      name: AiCreateFN.FIELD_REQUIRED,
      align: "left",
      tooltip: "overflow",
      // editor: <Switch name={AiCreateFN.FIELD_REQUIRED} />,
      renderer: ({
        record
      }) => /*#__PURE__*/React.createElement(_Switch, {
        record: record,
        disabled: !!(record !== null && record !== void 0 && record.get('templateCode')),
        name: AiCreateFN.FIELD_REQUIRED
      }),
      with: 100
    }].filter(Boolean);
  }, []);
  useEffect(() => {
    modal.update({
      footer: (_, cancelBtn) => /*#__PURE__*/React.createElement(React.Fragment, null, cancelBtn, /*#__PURE__*/React.createElement("span", {
        onClick: handleCreate,
        style: {
          marginLeft: '8px'
        }
      }, /*#__PURE__*/React.createElement(_Button, {
        loading: loadingCreate,
        color: "primary",
        disabled: createDis || loading
      }, intl.get('hmde.bo.businessObject.create').d('创建'))))
    });
  }, [loading, type, createDis, loadingCreate]);
  useEffect(() => {
    isDis();
  }, [type, loading]);
  const isDis = () => {
    if (type === 'simple') {
      var _nameCodeDsS$current, _nameCodeDsS$current2;
      setCreateDis(!(nameCodeDsS !== null && nameCodeDsS !== void 0 && (_nameCodeDsS$current = nameCodeDsS.current) !== null && _nameCodeDsS$current !== void 0 && _nameCodeDsS$current.get('modelName')) || !(nameCodeDsS !== null && nameCodeDsS !== void 0 && (_nameCodeDsS$current2 = nameCodeDsS.current) !== null && _nameCodeDsS$current2 !== void 0 && _nameCodeDsS$current2.get('modelCode')));
    } else if (type === 'pro') {
      var _nameCodeDsP$current, _nameCodeDsP$current2;
      setCreateDis(!(nameCodeDsP !== null && nameCodeDsP !== void 0 && (_nameCodeDsP$current = nameCodeDsP.current) !== null && _nameCodeDsP$current !== void 0 && _nameCodeDsP$current.get('modelName')) || !(nameCodeDsP !== null && nameCodeDsP !== void 0 && (_nameCodeDsP$current2 = nameCodeDsP.current) !== null && _nameCodeDsP$current2 !== void 0 && _nameCodeDsP$current2.get('modelCode')));
    } else {
      setCreateDis(true);
    }
  };

  // 获取
  const handleGetDetail = async () => {
    var _ds$current, _ds$current2, _ds$current3, _ds$current4;
    const ds = type === 'pro' ? searchDsP : searchDsS;
    if (!(await ds.validate())) return;
    setLoading(true);
    const param = type === 'pro' ? {
      content: ds === null || ds === void 0 ? void 0 : (_ds$current = ds.current) === null || _ds$current === void 0 ? void 0 : _ds$current.get(AiCreateFN.CONTENT),
      domainId
    } : {
      nameContent: ds === null || ds === void 0 ? void 0 : (_ds$current2 = ds.current) === null || _ds$current2 === void 0 ? void 0 : _ds$current2.get(AiCreateFN.NAME_CONTENT),
      fieldContent: ds === null || ds === void 0 ? void 0 : (_ds$current3 = ds.current) === null || _ds$current3 === void 0 ? void 0 : _ds$current3.get(AiCreateFN.FIELD_CONTENT),
      fieldAutoCompletion: ds === null || ds === void 0 ? void 0 : (_ds$current4 = ds.current) === null || _ds$current4 === void 0 ? void 0 : _ds$current4.get(AiCreateFN.FIELD_AUTO_COMPLENTION),
      domainId
    };
    aiGetDs.query(1, param).then(res => {
      if (getResponse(res)) {
        (type === 'pro' ? fieldDsP : fieldDsS).loadData((res === null || res === void 0 ? void 0 : res.fieldList) || []);
        (type === 'pro' ? nameCodeDsP : nameCodeDsS).loadData([{
          [AiCreateFN.BUSINESS_OBJECT_NAME]: res === null || res === void 0 ? void 0 : res.modelName,
          [AiCreateFN.BUSINESS_OBJECT_CODE]: res === null || res === void 0 ? void 0 : res.modelCode
        }]);
      }
      (type === 'pro' ? fieldDsP : fieldDsS).forEach(i => {
        Object.assign(i, {
          selectable: !(i !== null && i !== void 0 && i.get('templateCode'))
        });
      });
    }).finally(() => {
      setLoading(false);
    });
  };

  // 生成
  const handleCreate = async () => {
    const formDs = type === 'pro' ? nameCodeDsP : nameCodeDsS;
    const fieldDs = type === 'pro' ? fieldDsP : fieldDsS;
    if ((await formDs.validate()) && (await (fieldDs === null || fieldDs === void 0 ? void 0 : fieldDs.validate()))) {
      var _formDs$current, _fieldDs$selected;
      const formData = formDs === null || formDs === void 0 ? void 0 : (_formDs$current = formDs.current) === null || _formDs$current === void 0 ? void 0 : _formDs$current.toData();
      setLoadingCreate(true);
      aiCreateService({
        ...formData,
        modelCode: `${getAddonBefore}${formData.modelCode}`,
        fieldList: (fieldDs === null || fieldDs === void 0 ? void 0 : (_fieldDs$selected = fieldDs.selected) === null || _fieldDs$selected === void 0 ? void 0 : _fieldDs$selected.map(v => v === null || v === void 0 ? void 0 : v.toData())) || []
      }, domainId).then(res => {
        if (getResponse(res)) {
          var _boTableDs$query;
          modal.close();
          boTableDs === null || boTableDs === void 0 ? void 0 : (_boTableDs$query = boTableDs.query) === null || _boTableDs$query === void 0 ? void 0 : _boTableDs$query.call(boTableDs);
        }
      }).finally(() => {
        setLoadingCreate(false);
      });
    }
  };

  // 打开系统模版字段
  // const openWhoFieldDetail = () => {
  //   Modal.open({
  //     title: intl.get('hmde.bo.aiCreate.tempFieldDetail').d('模板字段预览'),
  //     children: <WhoFieldModal ds={whoFieldDs} />,
  //     closable: true,
  //     with: 595,
  //     footer: (_, cancelBtn) => cancelBtn,
  //     cancelText: intl.get('hmde.common.button.close').d('关闭'),
  //   });
  // };

  return /*#__PURE__*/React.createElement("div", {
    className: styles.aiCreateBo
  }, /*#__PURE__*/React.createElement(_Tabs, {
    defaultActiveKey: type,
    onChange: v => setType(v)
  }, /*#__PURE__*/React.createElement(_Tabs.TabPane, {
    dataSet: aiGetDs,
    tab: intl.get('hmde.bo.businessObject.apiCreateSimple').d('简易模式'),
    key: "simple"
  }, /*#__PURE__*/React.createElement(_Form, {
    labelWidth: 150,
    columns: 2,
    labelAlign: 'right',
    dataSet: searchDsS
  }, /*#__PURE__*/React.createElement(_TextField, {
    name: AiCreateFN.NAME_CONTENT,
    placeholder: intl.get('hmde.bo.businessObject.apiCreate.help').d('请输入相关业务场景的对象名称，例如：采购订单')
  }), /*#__PURE__*/React.createElement(_CheckBox, {
    name: AiCreateFN.FIELD_AUTO_COMPLENTION
  }), /*#__PURE__*/React.createElement(_TextArea, {
    style: {
      width: '100%'
    },
    name: AiCreateFN.FIELD_CONTENT,
    placeholder: `${intl.get('hmde.bo.businessObject.apiCreate.help1').d('请输入相关业务场景的字段信息。您可以直接从excel中复制字段到此处，比如：')}
${intl.get('hmde.bo.businessObject.apiCreate.help2').d('供应商名称  vendorName  文本  必输')}
${intl.get('hmde.bo.businessObject.apiCreate.help3').d('请审批时间  approveDate  日期  必输')}`,
    colSpan: 2
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.getButtons
  }, /*#__PURE__*/React.createElement("span", {
    onClick: handleGetDetail
  }, /*#__PURE__*/React.createElement(_Button, {
    loading: loading,
    disabled: loadingCreate,
    color: "primary"
  }, intl.get('hmde.bo.businessObject.apiCreateSut').d('生成')))), /*#__PURE__*/React.createElement(_Divider, null), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '20px'
    }
  }, intl.get('hmde.bo.businessObject.apiCreate.help4').d('根据您提供的场景描述，为您推荐如下的业务对象及相关字段，您可以根据业务需求进行编辑并选择字段生成业务对象')), /*#__PURE__*/React.createElement(_Form, {
    dataSet: nameCodeDsS,
    columns: 2
  }, /*#__PURE__*/React.createElement(_IntlField, {
    name: AiCreateFN.BUSINESS_OBJECT_NAME,
    suffix: /*#__PURE__*/React.createElement(_Icon, {
      type: "language"
    })
  }), /*#__PURE__*/React.createElement(_TextField, {
    name: AiCreateFN.BUSINESS_OBJECT_CODE,
    addonBefore: getAddonBefore && /*#__PURE__*/React.createElement(_Tooltip, {
      title: getAddonBefore
    }, getAddonBefore),
    maxLength: 56 - getAddonBefore.length,
    showLengthInfo: true
  })), /*#__PURE__*/React.createElement(_Table, {
    dataSet: fieldDsS,
    queryBar: "none",
    columns: columns
  })), /*#__PURE__*/React.createElement(_Tabs.TabPane, {
    dataSet: aiGetDs,
    tab: intl.get('hmde.bo.businessObject.apiCreatePro').d('专业模式'),
    key: "pro"
  }, /*#__PURE__*/React.createElement("p", null, intl.get('hmde.bo.businessObject.apiCreate.help5').d('请描述业务场景，将根据输入内容提供符合要求的业务对象及字段信息')), /*#__PURE__*/React.createElement(_Form, {
    dataSet: searchDsP
  }, /*#__PURE__*/React.createElement(_TextArea, {
    name: AiCreateFN.CONTENT,
    placeholder: intl.get('hmde.bo.businessObject.apiCreate.help6').d('请输入业务场景描述，例如：零售行业的采购订单，包含订单编号、供应商名称以及其他采购订单相关的字段')
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.getButtons
  }, /*#__PURE__*/React.createElement("span", {
    onClick: handleGetDetail
  }, /*#__PURE__*/React.createElement(_Button, {
    loading: loading,
    disabled: loadingCreate,
    color: "primary"
  }, intl.get('hmde.bo.businessObject.apiCreateSut').d('生成')))), /*#__PURE__*/React.createElement(_Divider, null), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '20px'
    }
  }, intl.get('hmde.bo.businessObject.apiCreate.help4').d('根据您提供的场景描述，为您推荐如下的业务对象及相关字段，您可以根据业务需求进行编辑并选择字段生成业务对象')), /*#__PURE__*/React.createElement(_Form, {
    dataSet: nameCodeDsP,
    columns: 2
  }, /*#__PURE__*/React.createElement(_IntlField, {
    name: AiCreateFN.BUSINESS_OBJECT_NAME,
    suffix: /*#__PURE__*/React.createElement(_Icon, {
      type: "language"
    })
  }), /*#__PURE__*/React.createElement(_TextField, {
    name: AiCreateFN.BUSINESS_OBJECT_CODE,
    addonBefore: getAddonBefore && /*#__PURE__*/React.createElement(_Tooltip, {
      title: getAddonBefore
    }, getAddonBefore),
    maxLength: 56 - getAddonBefore.length,
    showLengthInfo: true
  })), /*#__PURE__*/React.createElement(_Table, {
    dataSet: fieldDsP,
    queryBar: "none",
    columns: columns
  }))));
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(App));