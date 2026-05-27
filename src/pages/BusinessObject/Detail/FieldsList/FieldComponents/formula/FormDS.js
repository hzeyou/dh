import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import intl from 'utils/intl';
export let FieldNameTypes = /*#__PURE__*/function (FieldNameTypes) {
  FieldNameTypes["FIELD"] = "field";
  return FieldNameTypes;
}({});
export default (() => ({
  autoCreate: true,
  fields: [{
    name: FieldNameTypes.FIELD,
    type: "string",
    label: intl.get('hmde.common.field').d('字段')
  }]
}));