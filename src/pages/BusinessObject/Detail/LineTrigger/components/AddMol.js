import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Switch from "@hzero-front-ui/c7n-ui/lib/SwitchPro";
import _Lov from "@hzero-front-ui/c7n-ui/lib/LovPro";
import _Alert from "@hzero-front-ui/c7n-ui/lib/Alert";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _IntlField from "@hzero-front-ui/c7n-ui/lib/IntlFieldPro";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useEffect, useState } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { IntlType } from 'choerodon-ui/pro/lib/intl-field/enum';
import { getResponse } from 'utils/utils';
import { LabelAlign } from 'choerodon-ui/pro/lib/form/enum';
import { observer } from 'mobx-react-lite';
import { useRequest } from 'ahooks';
import { FN } from "hzero-front-hmde/lib/stores/BusinessObject/LineTriggerDS";
import { getTypeList } from "../service";
const CreateEidtMol = prop => {
  var _data$filter, _data$filter$call, _data$filter$call$map, _data$filter2, _data$filter2$call, _data$filter2$call$ma, _ds$current3;
  const ds = prop.ds,
    modal = prop.modal,
    tableListDs = prop.tableListDs,
    type = prop.type;
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    loading = _useState2[0],
    setLoading = _useState2[1];
  const _useState3 = useState(''),
    _useState4 = _slicedToArray(_useState3, 2),
    oldTriggerType = _useState4[0],
    setOldTriggerType = _useState4[1];
  const _useRequest = useRequest(getTypeList, {
      cacheKey: 'HMDE.BUSINESS_OBJECT.TRIGGER.TYPE',
      staleTime: -1
    }),
    data = _useRequest.data;
  useEffect(() => {
    if (type === 'edit' || type === 'copy') {
      var _ds$current;
      setOldTriggerType(ds === null || ds === void 0 ? void 0 : (_ds$current = ds.current) === null || _ds$current === void 0 ? void 0 : _ds$current.get(FN.triggerType));
    }
  }, []);
  modal.handleOk(async () => {
    var _ds$current2;
    if (await (ds === null || ds === void 0 ? void 0 : (_ds$current2 = ds.current) === null || _ds$current2 === void 0 ? void 0 : _ds$current2.validate(true))) {
      setLoading(true);
      ds.submit().then(res => {
        if (getResponse(res)) {
          tableListDs.query();
          modal.close(true);
        }
      }).finally(() => {
        setLoading(false);
      });
    }
    return false;
  });
  return /*#__PURE__*/React.createElement(_Spin, {
    spinning: loading
  }, /*#__PURE__*/React.createElement(_Form, {
    dataSet: ds,
    columns: 1,
    labelAlign: "left"
  }, /*#__PURE__*/React.createElement(_IntlField, {
    name: FN.triggerName
  }), /*#__PURE__*/React.createElement(_Select, {
    name: FN.triggerType
  }, /*#__PURE__*/React.createElement(_Select.OptGroup, {
    label: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.tigger.typeTip').d('记录执行逐条触发')), /*#__PURE__*/React.createElement(_Tooltip, {
      title: intl.get('hmde.bo.businessObject.tigger.tooltip').d('调用API时，每条记录均触发一次触发器')
    }, /*#__PURE__*/React.createElement(_Icon, {
      type: "help_outline",
      style: {
        margin: '-3px 0 0 2px'
      }
    })))
  }, data === null || data === void 0 ? void 0 : (_data$filter = data.filter) === null || _data$filter === void 0 ? void 0 : (_data$filter$call = _data$filter.call(data, v => !v.value.startsWith('BATCH'))) === null || _data$filter$call === void 0 ? void 0 : (_data$filter$call$map = _data$filter$call.map) === null || _data$filter$call$map === void 0 ? void 0 : _data$filter$call$map.call(_data$filter$call, v => /*#__PURE__*/React.createElement(_Select.Option, {
    key: v.value,
    value: v.value
  }, v.meaning))), /*#__PURE__*/React.createElement(_Select.OptGroup, {
    label: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.tigger.typeTip2').d('记录执行仅触发一次')), /*#__PURE__*/React.createElement(_Tooltip, {
      title: intl.get('hmde.bo.businessObject.tigger.tooltip2').d('调用API时，仅触发一次触发器')
    }, /*#__PURE__*/React.createElement(_Icon, {
      type: "help_outline",
      style: {
        margin: '-3px 0 0 2px'
      }
    })))
  }, data === null || data === void 0 ? void 0 : (_data$filter2 = data.filter) === null || _data$filter2 === void 0 ? void 0 : (_data$filter2$call = _data$filter2.call(data, v => v.value.startsWith('BATCH'))) === null || _data$filter2$call === void 0 ? void 0 : (_data$filter2$call$ma = _data$filter2$call.map) === null || _data$filter2$call$ma === void 0 ? void 0 : _data$filter2$call$ma.call(_data$filter2$call, v => /*#__PURE__*/React.createElement(_Select.Option, {
    key: v.value,
    value: v.value
  }, v.meaning)))), oldTriggerType && oldTriggerType !== (ds === null || ds === void 0 ? void 0 : (_ds$current3 = ds.current) === null || _ds$current3 === void 0 ? void 0 : _ds$current3.get(FN.triggerType)) && /*#__PURE__*/React.createElement(_Alert, {
    message: intl.get('hmde.bo.businessObject.Aftermodifyingthetiming').d('修改时机后会清空触发条件，并可能导致使用到入参的节点不可用，请检查'),
    type: "warning",
    showIcon: true
  }), /*#__PURE__*/React.createElement(_Lov, {
    name: FN.domainObj
  }), /*#__PURE__*/React.createElement(_IntlField, {
    name: FN.remark,
    type: "multipleLine"
  }), /*#__PURE__*/React.createElement(_Switch, {
    name: FN.asyncFlag
  }), /*#__PURE__*/React.createElement(_Switch, {
    name: FN.enabledFlag
  })));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(CreateEidtMol));