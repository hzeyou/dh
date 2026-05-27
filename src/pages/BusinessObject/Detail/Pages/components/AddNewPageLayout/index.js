import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _TextArea from "@hzero-front-ui/c7n-ui/lib/TextAreaPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import React, { useImperativeHandle, useRef } from 'react';
import { observer } from 'mobx-react-lite';
// import { LabelAlign } from 'choerodon-ui/pro/lib/form/enum';
import { getResponse } from 'hzero-front/lib/utils/utils';
import notification from 'utils/notification';
import intl from 'utils/intl';
import { handleCopy } from "hzero-front-hmde/lib/utils/common";
import { enableRender } from "hzero-front-apaas/lib/utils/render";
export default observer(({
  modal,
  dataSet,
  isEdit
}, ref) => {
  var _dataSet$current2, _modal$props;
  useImperativeHandle(ref, () => ({
    save: async () => {
      var _dataSet$current;
      const flag = await (dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$current = dataSet.current) === null || _dataSet$current === void 0 ? void 0 : _dataSet$current.validate());
      if (!flag) {
        return false;
      }
      const res = await dataSet.submit();
      if (getResponse(res)) {
        return true;
      } else {
        notification.error({
          description: res.message
        });
        return false;
      }
    }
  }));
  const inputRef = useRef();
  const codeRef = useRef();
  const showCustom = ((_dataSet$current2 = dataSet.current) === null || _dataSet$current2 === void 0 ? void 0 : _dataSet$current2.get('pageCategory')) === 'BUSINESS_COMPONENT';
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_Form, {
    dataSet: dataSet
    // useColon={false} labelAlign={LabelAlign.left}
    ,
    labelWidth: 109
  }, /*#__PURE__*/React.createElement(_TextField, {
    name: "pageName",
    placeholder: intl.get('hmde.common.pleaseInput').d('请输入')
  }), isEdit ? /*#__PURE__*/React.createElement(_TextField, {
    disabled: true,
    name: "pageCode"
  }) : /*#__PURE__*/React.createElement(_TextField, {
    addonBefore: `${modal === null || modal === void 0 ? void 0 : (_modal$props = modal.props) === null || _modal$props === void 0 ? void 0 : _modal$props.businessObjectCode}_`,
    name: "pageCode",
    placeholder: intl.get('hmde.common.pleaseInput').d('请输入')
  }), !isEdit && /*#__PURE__*/React.createElement(_Select, {
    name: "pageCategory",
    placeholder: intl.get('hmde.bo.addNewPageLayout.placeholderSelect1').d('请选择')
  }), showCustom && /*#__PURE__*/React.createElement(_Select, {
    showHelp: 'label',
    name: "businessComponentDomain",
    placeholder: intl.get('hmde.bo.addNewPageLayout.placeholderSelect2').d('请选择域名'),
    noCache: true
  }), showCustom && /*#__PURE__*/React.createElement(_TextField, {
    showHelp: 'label',
    ref: inputRef,
    name: "businessComponentPath",
    placeholder: intl.get('hmde.bo.addNewPageLayout.placeholderSelect3').d('请输入业务组件路径地址'),
    suffix: /*#__PURE__*/React.createElement(_Icon, {
      type: "add_to_photos",
      onClick: () => {
        var _dataSet$current3, _dataSet$current3$get;
        inputRef.current.blur();
        handleCopy(((_dataSet$current3 = dataSet.current) === null || _dataSet$current3 === void 0 ? void 0 : (_dataSet$current3$get = _dataSet$current3.get) === null || _dataSet$current3$get === void 0 ? void 0 : _dataSet$current3$get.call(_dataSet$current3, 'businessComponentPath')) || '');
      }
    })
  }), showCustom && /*#__PURE__*/React.createElement(_TextField, {
    ref: codeRef,
    name: "businessComponentCode",
    showHelp: 'label',
    placeholder: intl.get('hmde.bo.addNewPageLayout.placeholderSelect4').d('请输入业务组件编码'),
    suffix: isEdit && /*#__PURE__*/React.createElement(_Icon, {
      type: "add_to_photos",
      onClick: () => {
        var _dataSet$current4, _dataSet$current4$get;
        codeRef.current.blur();
        handleCopy(((_dataSet$current4 = dataSet.current) === null || _dataSet$current4 === void 0 ? void 0 : (_dataSet$current4$get = _dataSet$current4.get) === null || _dataSet$current4$get === void 0 ? void 0 : _dataSet$current4$get.call(_dataSet$current4, 'businessComponentCode')) || '');
      }
    })
  }), /*#__PURE__*/React.createElement(_TextArea, {
    name: "remark"
  }), isEdit && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Output, {
    name: "enabledFlag",
    renderer: ({
      value
    }) => enableRender(value)
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "publishedDate"
  }))));
}, {
  forwardRef: true
});