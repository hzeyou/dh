import {FieldType} from 'choerodon-ui/dataset/data-set/enum';

const sexOptionDataSet = {

  fields: [
    {name: 'text', type: FieldType.string},
    {name: 'value', type: FieldType.string},
  ],

  data: [
    { text: '男', value: 'male' },
    { text: '女', value: 'female' },
  ]

};

export default sexOptionDataSet;
