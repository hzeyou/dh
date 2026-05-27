import _get from "lodash/get";
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import intl from 'utils/intl';
const ID_FIELD = 'businessObjectFieldId';
const TITLE_FIELD = 'businessObjectFieldName';
const MIDDLE_NODE = '_middleNode_';
export let FieldNameTypes = /*#__PURE__*/function (FieldNameTypes) {
  return FieldNameTypes;
}({});
export default (() => ({
  autoCreate: false,
  selection: false,
  autoLocateFirst: false,
  fields: [{
    name: 'colIndex',
    type: "number"
  }, {
    name: 'fieldObj',
    type: "object",
    defaultValue: {}
  }, {
    name: 'columnComponentType',
    type: "string"
  }, {
    name: 'field',
    type: "object",
    label: intl.get('hmde.common.condition.field').d('条件字段'),
    required: true,
    textField: TITLE_FIELD,
    valueField: ID_FIELD
  }, {
    name: 'condition',
    type: "object",
    label: intl.get('hmde.common.conditionType').d('条件类型'),
    required: true,
    textField: 'meaning',
    valueField: 'value',
    lookupCode: 'HMDE.FILTER_CONDITION'
  }, {
    name: 'conditionValue',
    label: intl.get('hmde.bo.businessObject.price').d('值'),
    dynamicProps: {
      required: ({
        record
      }) => {
        return (record === null || record === void 0 ? void 0 : record.get('condition')) !== 'IS_NULL';
      },
      type: ({
        record
      }) => {
        const _componentType = record === null || record === void 0 ? void 0 : record.get('columnComponentType');
        if (!_componentType) return "string";
        switch (_componentType) {
          case 'MONEY':
          case 'PERCENTAGE':
          case 'NUMBER_FIELD':
          case 'FLOAT':
            return "number";
          case 'SWITCH':
          case 'RADIO':
          case 'CHECKBOX':
          case 'SINGLE_SELECT':
          case 'MULTIPLE_SELECT':
            return "object";
          case 'DATETIME_SELECTION_BOX':
            return "dateTime";
          default:
            return "string";
        }
      }
    }
  }, {
    name: 'tempFieldSelect',
    type: "object",
    textField: 'meaning',
    valueField: 'value'
  }],
  events: {
    update: ({
      value,
      dataSet,
      name: _name
    }) => {
      if (`${_get(value, ['businessObjectFieldId'])}`.startsWith(MIDDLE_NODE)) {
        // 不允许选中支干节点
        dataSet.current.set(_name, undefined);
      }
    }
  }
}));