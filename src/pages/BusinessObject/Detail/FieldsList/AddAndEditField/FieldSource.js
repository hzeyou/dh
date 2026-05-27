import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import React, { useMemo } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { FieldType } from "hzero-front-apaas/lib/constants/businessObject";
import LabelTitleRender from "hzero-front-hmde/lib/businessComponents/LabelTitleRender";
const Index = ({
  fieldType
}) => {
  const renderSourceType = useMemo(() => {
    switch (fieldType) {
      case FieldType.PREDEFINED:
        return intl.get('hmde.common.field.presetField').d('预置字段');
      case FieldType.STANDARD:
        return intl.get('hmde.common.field.standardField').d('标准字段');
      case FieldType.EXTEND:
      case FieldType.EXTEND_TABLE:
      case FieldType.TENANT_CREATED:
      case FieldType.FLEX_FIELD:
        return intl.get('hmde.common.field.extendField').d('扩展字段');
      case FieldType.CUSTOM:
        return intl.get('hmde.common.field.customField').d('自定义字段');
      case FieldType.INHERIT:
        return intl.get('hmde.common.standardPersonalization').d('标准-个性化');
      default:
        break;
    }
  }, [fieldType]);
  return /*#__PURE__*/React.createElement(_Form, {
    // useColon={false}
    labelWidth: 100,
    labelAlign: 'left'
  }, /*#__PURE__*/React.createElement(_Output, {
    labelWidth: 120,
    label: /*#__PURE__*/React.createElement(LabelTitleRender, {
      value: intl.get('hmde.common.fleidSource').d('字段来源'),
      help: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.fleidSource.describe').d('字段来源为该字段的来源类型，包括预置、标准、扩展、自定义：')), /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.fleidSource.fieldtype.preset').d('预置字段为系统自动生成的字段；')), /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.fleidSource.fieldtype.standard').d('标准字段为平台创建的字段；')), /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.fleidSource.fieldtype.extend').d('扩展字段为平台创建的供租户个性化使用的字段；')), /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.fleidSource.fieldtype.custom').d('自定义字段为租户自定义业务对象创建的字段')))
    }),
    renderer: () => /*#__PURE__*/React.createElement("div", null, renderSourceType)
  }));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(Index);