import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import intl from 'utils/intl';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import {DataSet} from 'choerodon-ui/pro';

const intlPrefix = 'srm.demo.model';

const optionsDS = {
  data: [
    {
      'meaning': '请选择',
      'value': 0,
      'disabled': true,
    },
    {
      'meaning': '灵活询价',
      'value': 1,
    },
    {
      'meaning': '竞争性谈判',
      'value': 2,
    },
    {
      'meaning': '单一询价',
      'value': 3,
    },
    {
      'meaning': '标准询价',
      'value': 4,
    }
  ]
};

const DetailDSConfig = (): DataSetProps => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'old_rfq_method',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.old_rfq_method`).d('原询价方式'),
        readOnly: true,
        options: new DataSet(optionsDS),
        defaultValue: 1,
      },
      {
        name: 'new_rfq_method',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.new_rfq_method`).d('现询价方式'),
        required: true,
        options: new DataSet(optionsDS),
        placeholder: intl.get(`${intlPrefix}.new_rfq_method`).d('请选择'),
      },
    ],
    transport: {
      submit: ({ data }) => {
        return {
          data: data[0],  // body 参数
          url: `${process.env.SRM_DEV_HOST}/demo/`,
          method: 'POST',
        };
      },
    },
    events: {
      load: ({dataSet}) => {
        console.log('加载完成', dataSet);
      }
    }
  };
};


export { DetailDSConfig };
