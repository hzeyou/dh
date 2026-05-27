import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import { getCurrentLanguage } from 'utils/utils';
const languageDiyDS = (supportLanguage = []) => {
  return {
    autoCreate: true,
    fields: supportLanguage.map(item => ({
      name: item.code,
      type: "string",
      label: item.name,
      required: item.code === getCurrentLanguage()
    }))
  };
};
export default languageDiyDS;