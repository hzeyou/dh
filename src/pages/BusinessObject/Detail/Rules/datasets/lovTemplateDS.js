import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
export let FN = /*#__PURE__*/function (FN) {
  FN["CODE"] = "code";
  return FN;
}({});
const lovTemplateDS = () => {
  return {
    autoCreate: true,
    fields: [{
      name: FN.CODE,
      type: "object",
      lovCode: 'HMDE.BO.RULE.PLATFORM_RESPONSE_MESSAGE'
    }]
  };
};
export default lovTemplateDS;