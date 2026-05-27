import _DataSet from "choerodon-ui/pro/lib/data-set";
import intl from 'utils/intl';
export const flowVarDs = () => ({
  autoCreate: false,
  autoQuery: true,
  dataToJSON: 'normal',
  selection: 'single',
  fields: [{
    label: intl.get('hmde.bo.model.variablename').d('变量名'),
    name: 'flowVarKey',
    type: 'string',
    unique: true,
    required: true,
    maxLength: 16,
    pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
    defaultValidationMessages: {
      patternMismatch: intl.get('hmde.bo.text.imputTip2').d('仅支持大小写字母、数字及下划线，且不支持以数字开头')
    }
  }, {
    label: intl.get('hmde.bo.model.variableValueSource').d('变量值来源'),
    name: 'sourceType',
    type: 'string',
    required: true,
    defaultValue: 'FIXED_VALUE',
    options: new _DataSet({
      paging: false,
      data: [{
        meaning: intl.get('hmde.common.fixedValue').d('固定值'),
        value: 'FIXED_VALUE'
      }, {
        meaning: intl.get('hmde.common.busObjField').d('业务对象字段'),
        value: 'BO_FIELD'
      }, {
        meaning: intl.get('hmde.bo.flow.title.empty').d('空'),
        value: 'IS_NULL'
      }]
    })
  }, {
    label: intl.get('hmde.bo.businessObject.variableValue').d('变量值'),
    name: 'flowVarValue',
    type: 'string',
    computedProps: {
      required: ({
        record
      }) => (record === null || record === void 0 ? void 0 : record.get('sourceType')) !== 'IS_NULL'
    }
  }]
});