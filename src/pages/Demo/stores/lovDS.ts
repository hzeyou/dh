import {FieldType} from 'choerodon-ui/dataset/data-set/enum';
import {DataSet} from 'choerodon-ui/pro';




const lovDS = {
  autoCreate: true,
  fields: [
    {
      name: 'code',
      textField: 'code',
      type: FieldType.object,
      // lovCode: 'LOV_CODE',
      lovPara: { code: '111' },
      required: true,
      options: new DataSet({
        data: [
          {
            code: '1',
            description: '1'
          },
          {
            code: '2',
            description: '2'
          },
          {
            code: '3',
            description: '3'
          },
        ]
      })
    },
    {
      name: 'code_string',
      type: FieldType.object,
      lovCode: 'LOV_CODE',
      optionsProps: (dsProps) => {
        console.log(dsProps);
        return dsProps;
      },
      required: true,
    },
    { name: 'code_code', type: FieldType.string, bind: 'code.code' },
    { name: 'code_description', type: FieldType.string, bind: 'code.description' },
  ],
  events: {
    update: ({ record, name, value, oldValue }) => {
      console.log(
        '[dataset]',
        value,
        '[oldValue]',
        oldValue,
        `[record.get('${name}')]`,
        record.get(name),
      );
    },
  },
};

export default lovDS;




