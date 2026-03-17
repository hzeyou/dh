import {FieldType} from 'choerodon-ui/dataset/data-set/enum';
import {DataSet} from 'choerodon-ui/pro';

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
    {
      name: 'sheng',
      label: '省',
      valueField: 'codeValueId',
      defaultValue: 10206,
      options: new DataSet({
        data: [
          {
            _token: '0ac5c3561d43fb2755532be093e2b5f2',
            objectVersionNumber: 1,
            codeId: 10066,
            codeValueId: 10206,
            description: '北京',
            meaning: '北京',
            value: 'BJ',
            orderSeq: 10,
            tag: null,
            enabledFlag: 'Y',
            parentCodeValueId: null,
            parentCodeValue: null,
            parentCodeValueMeaning: null,
          },
          {
            _token: 'b205b085ad8457370f571330f83b13cf',
            objectVersionNumber: 1,
            codeId: 10066,
            codeValueId: 10207,
            description: '上海',
            meaning: '上海',
            value: 'SH',
            orderSeq: 10,
            tag: null,
            enabledFlag: 'Y',
            parentCodeValueId: null,
            parentCodeValue: null,
            parentCodeValueMeaning: null,
          },
        ]
      })
    },
    {
      name: 'shi',
      label: '市',
      valueField: 'codeValueId',
      cascadeMap: { parentCodeValueId: 'sheng' },
      options: new DataSet({
        data: [
          {
            _token: '383aa9f02290742d77bbb1200be8a95e',
            objectVersionNumber: 2,
            codeId: 10067,
            codeValueId: 10204,
            description: '青浦区',
            meaning: '青浦区',
            value: 'QP',
            orderSeq: null,
            tag: null,
            enabledFlag: 'Y',
            parentCodeValueId: 10207,
            parentCodeValue: 'SH',
            parentCodeValueMeaning: null,
          },
          {
            _token: '68db92966e875bdd16a9d38ef27e90d8',
            objectVersionNumber: 2,
            codeId: 10067,
            codeValueId: 10205,
            description: '徐汇区',
            meaning: '徐汇区',
            value: 'XH',
            orderSeq: null,
            tag: null,
            enabledFlag: 'Y',
            parentCodeValueId: 10207,
            parentCodeValue: 'SH',
            parentCodeValueMeaning: null,
          },
          {
            _token: '380ee41f753c1aa563dfdc48aded0309',
            objectVersionNumber: 1,
            codeId: 10067,
            codeValueId: 10208,
            description: '海定区',
            meaning: '海定区',
            value: 'HD',
            orderSeq: 10,
            tag: null,
            enabledFlag: 'Y',
            parentCodeValueId: 10206,
            parentCodeValue: 'BJ',
            parentCodeValueMeaning: null,
          },
          {
            _token: 'f5167255b276b5cdd677d175eee0a121',
            objectVersionNumber: 1,
            codeId: 10067,
            codeValueId: 10209,
            description: '朝阳区',
            meaning: '朝阳区',
            value: 'CY',
            orderSeq: 10,
            tag: null,
            enabledFlag: 'Y',
            parentCodeValueId: 10206,
            parentCodeValue: 'BJ',
            parentCodeValueMeaning: null,
          },
        ],
      })
    },
    {
      name: 'street',
      label: '街道',
      valueField: 'codeValueId',
      cascadeMap: { parentCodeValueId: 'shi' },
      options: new DataSet({
        data: [
          {
            _token: '383aa9f02290742d77bbb1200be8a95e1',
            objectVersionNumber: 3,
            codeId: 10068,
            codeValueId: 10210,
            description: '万寿路',
            meaning: '万寿路',
            value: 'WS',
            orderSeq: 10,
            tag: null,
            enabledFlag: 'Y',
            parentCodeValueId: 10208,
            parentCodeValue: 'HD',
            parentCodeValueMeaning: null,
          },
          {
            _token: '68db92966e875bdd16a9d38ef27e90d82',
            objectVersionNumber: 3,
            codeId: 10068,
            codeValueId: 10211,
            description: '羊坊店',
            meaning: '羊坊店',
            value: 'YF',
            orderSeq: 10,
            tag: null,
            enabledFlag: 'Y',
            parentCodeValueId: 10208,
            parentCodeValue: 'HD',
            parentCodeValueMeaning: null,
          },
          {
            _token: '380ee41f753c1aa563dfdc48aded03093',
            objectVersionNumber: 3,
            codeId: 10068,
            codeValueId: 10212,
            description: '甘家口',
            meaning: '甘家口',
            value: 'GJ',
            orderSeq: 10,
            tag: null,
            enabledFlag: 'Y',
            parentCodeValueId: 10208,
            parentCodeValue: 'HD',
            parentCodeValueMeaning: null,
          },
          {
            _token: '383aa9f02290742d77bbb1200be8a95e2',
            objectVersionNumber: 3,
            codeId: 10068,
            codeValueId: 10213,
            description: '无名路',
            meaning: '无名路',
            value: 'WM',
            orderSeq: 10,
            tag: null,
            enabledFlag: 'Y',
            parentCodeValueId: 10209,
            parentCodeValue: 'HD',
            parentCodeValueMeaning: null,
          },
        ],
      })
    },
  ]
};

export default selectDS;




