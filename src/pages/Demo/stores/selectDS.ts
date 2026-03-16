import {FieldType} from 'choerodon-ui/dataset/data-set/enum';
import {DataSet} from "choerodon-ui/pro";

const optionsDS = {
  data: [
    {
      'objectVersionNumber': 1,
      'codeId': 10001,
      'codeValueId': 10027,
      'description': '女性',
      'meaning': '女',
      'value': 'F',
      'orderSeq': 10,
      'tag': null,
      'enabledFlag': 'Y',
      'parentCodeValueId': null,
      'parentCodeValue': null,
      'parentCodeValueMeaning': null
    },
    {
      'objectVersionNumber': 1,
      'codeId': 10001,
      'codeValueId': 10028,
      'description': '男性',
      'meaning': '男',
      'value': 'M',
      'orderSeq': 20,
      'tag': null,
      'enabledFlag': 'Y',
      'parentCodeValueId': null,
      'parentCodeValue': null,
      'parentCodeValueMeaning': null
    }
  ]
};


const selectDS = {
  fields:[
    {
      name: 'sex',
      type: FieldType.string,
      // lookupCode: 'HR.EMPLOYEE_GENDER',
      options: new DataSet(optionsDS),
    },
    {
      name: 'account',
      multiple: true,
    },
  ]
};

export default selectDS;




