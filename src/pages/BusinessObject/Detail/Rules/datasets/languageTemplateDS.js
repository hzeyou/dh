import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import { getCurrentLanguage } from 'utils/utils';
import { CODE } from 'utils/regExp';
import intl from 'utils/intl';
import { HZERO_HMDE } from 'hzero-front-apaas/lib/utils/config';
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import { buildLanguageTemplate } from "../utils";
export let FN = /*#__PURE__*/function (FN) {
  FN["ERROR_INFO"] = "errorInfo";
  FN["TYPE"] = "type";
  FN["RESPONSE_MESSAGES"] = "responseMessages";
  return FN;
}({});
const languageTemplateDS = (supportLanguage = [], codeBefore = '') => {
  return {
    autoCreate: false,
    fields: supportLanguage.map(item => ({
      name: item.code,
      type: "string",
      label: item.name,
      required: item.code === getCurrentLanguage()
    })).concat([{
      name: FN.ERROR_INFO,
      type: "string",
      label: intl.get('hmde.bo.view.messageCode').d('消息代码'),
      required: true,
      pattern: CODE,
      defaultValidationMessages: {
        patternMismatch: intl.get('hmde.se.scriptEvent.validation.code').d('大小写及数字，必须以字母、数字开头，可包含“-”、“_”、“.”、“/”')
      }
    }, {
      name: FN.TYPE,
      type: "string",
      label: intl.get('hmde.bo.view.messageType').d('消息类型'),
      defaultValue: 'error'
    }]),
    transport: {
      submit: ({
        data
      }) => {
        const _data = buildLanguageTemplate(data[0], codeBefore);
        return {
          url: `${lowcodeOrganizationURL({
            route: HZERO_HMDE
          })}/response-message`,
          method: 'POST',
          data: _data
        };
      }
    }
  };
};
export default languageTemplateDS;