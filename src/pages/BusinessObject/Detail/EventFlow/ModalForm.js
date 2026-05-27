import _TextArea from "@hzero-front-ui/c7n-ui/lib/TextAreaPro";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import React, { useEffect, useMemo, useState } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getResponse } from 'utils/utils';
import { observer } from 'mobx-react-lite';
import { LabelAlign } from 'choerodon-ui/pro/lib/form/enum';
import { eventFlowDs } from "hzero-front-hmde/lib/stores/BusinessObject/EventFlowDS";
import uuid from 'uuid/v4';
import notification from 'utils/notification';
import styles from "./index.less?modules";
const Index = ({
  modal,
  businessObjectCode,
  flowId,
  flowCategory,
  tenantId,
  callback = () => {}
}) => {
  const dataSet = useMemo(() => new _DataSet(eventFlowDs({
    businessObjectCode,
    flowId,
    tenantId
  })), []);
  const _useState = useState(businessObjectCode),
    _useState2 = _slicedToArray(_useState, 2),
    flowCodePre = _useState2[0],
    setFlowCodePre = _useState2[1];
  const _useState3 = useState(uuid().substring(0, 5)),
    _useState4 = _slicedToArray(_useState3, 2),
    flowCodeSuf = _useState4[0],
    setFlowCodeSuf = _useState4[1];
  useEffect(() => {
    if (flowId) {
      dataSet.query();
    } else {
      dataSet.create({
        flowCategory
      });
    }
  }, [flowId]);
  modal.handleOk(async () => {
    if (!flowCodePre || !flowCodeSuf) {
      var _dataSet$current;
      await ((_dataSet$current = dataSet.current) === null || _dataSet$current === void 0 ? void 0 : _dataSet$current.set('flowCode', ''));
    } else {
      var _dataSet$current2;
      const flowCodeStr = `${flowCodePre}_${flowCodeSuf}`;
      if (flowCodeStr.length > 60) {
        notification.error({
          message: intl.get('hmde.common.tips').d('提示'),
          description: intl.get('hmde.bo.encodinglength.cannotexceed60').d('事件流编码长度不能超过60位')
        });
        return false;
      }
      await ((_dataSet$current2 = dataSet.current) === null || _dataSet$current2 === void 0 ? void 0 : _dataSet$current2.set('flowCode', `${flowCodePre}_${flowCodeSuf}`));
    }
    if (await dataSet.validate()) {
      const res = await dataSet.submit();
      if (getResponse(res)) {
        if (!flowId) {
          // 业务对象新建事件流成功跳转至事件流设计器
          const _res$content = _slicedToArray(res.content, 1),
            newRes = _res$content[0];
          callback(newRes.flowId, newRes.flowCode);
        }
        return true;
      }
    }
    return false;
  });
  const rendererFlowCode = () => {
    const validationRenderer = validationRes => {
      if (validationRes.ruleName === 'patternMismatch') {
        return intl.get('hmde.bo.text.imputTip1').d('仅支持大小写字母、数字及下划线');
      } else {
        return validationRes.validationMessage;
      }
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_TextField, {
      maxLength: 58,
      required: true,
      value: flowCodePre,
      pattern: /^\w+$/,
      validationRenderer: validationRenderer,
      onChange: async value => {
        var _dataSet$current3;
        setFlowCodePre(value);
        await ((_dataSet$current3 = dataSet.current) === null || _dataSet$current3 === void 0 ? void 0 : _dataSet$current3.set('flowCode', `${value}_${flowCodeSuf}`));
      }
    }), "_", /*#__PURE__*/React.createElement(_TextField, {
      maxLength: 58,
      required: true,
      value: flowCodeSuf,
      pattern: /^\w+$/,
      validationRenderer: validationRenderer,
      onChange: async value => {
        var _dataSet$current4;
        setFlowCodeSuf(value);
        await ((_dataSet$current4 = dataSet.current) === null || _dataSet$current4 === void 0 ? void 0 : _dataSet$current4.set('flowCode', `${flowCodePre}_${value}`));
      }
    }));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Form, {
    dataSet: dataSet,
    labelAlign: "left"
    // useColon={false}
    ,
    className: styles['create-event-flow-code']
  }, /*#__PURE__*/React.createElement(_TextField, {
    name: "flowName"
  }), !flowId && /*#__PURE__*/React.createElement(_Output, {
    label: intl.get('hmde.bo.businessObject.eventFlow.model.flowCode').d('事件流编码'),
    renderer: rendererFlowCode
  })), /*#__PURE__*/React.createElement(_Form, {
    dataSet: dataSet,
    labelAlign: "left"
    // useColon={false}
  }, flowId && /*#__PURE__*/React.createElement(_Output, {
    name: "flowCode"
  }), /*#__PURE__*/React.createElement(_TextArea, {
    name: "remark",
    rows: 2
  })));
};
export default formatterCollections({
  code: ['hmde.bo']
})(observer(Index));