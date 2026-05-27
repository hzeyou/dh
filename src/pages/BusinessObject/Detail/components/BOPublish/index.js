import _TextArea from "@hzero-front-ui/c7n-ui/lib/TextAreaPro";
import React from 'react';
import intl from 'utils/intl';
import { ResizeType } from 'choerodon-ui/pro/lib/text-area/enum';
const BOPublish = ({
  versionFlag,
  extendFlag,
  textRef,
  baseInfoDS
}) => {
  var _baseInfoDS$current, _baseInfoDS$current$g;
  return /*#__PURE__*/React.createElement(React.Fragment, null, versionFlag ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'black'
    }
  }, extendFlag ? intl.get('hmde.bo.businessObject.hasExtendFieldReleaseConfirmNew').d('业务对象已维护扩展字段，发布成功后将以扩展物理模型名称生成扩展物理模型且名称不可编辑。') : /*#__PURE__*/React.createElement(React.Fragment, null, (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : (_baseInfoDS$current$g = _baseInfoDS$current.get) === null || _baseInfoDS$current$g === void 0 ? void 0 : _baseInfoDS$current$g.call(_baseInfoDS$current, 'publishStatus')) !== 'UNPUBLISHED' && intl.get('hmde.common.message.publishBusinessObjectCheckNew').d('发布后可能影响其他功能，需检查依赖项并处理相关问题，确保配置同步或修改。')))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '15px',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.businessObject.versiondetail').d('版本描述'), "\uFF1A"), /*#__PURE__*/React.createElement(_TextArea, {
    ref: textRef,
    style: {
      width: '85%'
    },
    resize: "vertical",
    placeholder: intl.get('hmde.bo.businessObject.versiondetail.placeholder').d('请填写版本描述')
  }))) : /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.businessObject.releaseConfirm').d('请确认是否发布该业务对象？')));
};
export default BOPublish;