import _DataSet from "choerodon-ui/pro/lib/data-set";
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import intl from 'utils/intl';
export let FN = /*#__PURE__*/function (FN) {
  FN["TYPE"] = "type";
  return FN;
}({}); // 自定义/选择模板
export let LanguageType = /*#__PURE__*/function (LanguageType) {
  LanguageType["CUSTOM"] = "CUSTOM";
  LanguageType["PLATFORM"] = "PLATFORM";
  return LanguageType;
}({}); // 选择模板
const languageDS = () => {
  return {
    autoCreate: true,
    fields: [{
      name: FN.TYPE,
      type: "string",
      options: new _DataSet({
        data: [{
          value: LanguageType.CUSTOM,
          meaning: intl.get('hzero.common.custom').d('自定义')
        }, {
          value: LanguageType.PLATFORM,
          meaning: intl.get('hmde.bo.view.selectTemplate').d('选择模板')
        }]
      }),
      defaultValue: LanguageType.CUSTOM
    }]
  };
};
export default languageDS;