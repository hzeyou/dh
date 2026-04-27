import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import intl from 'utils/intl';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

const intlPrefix = 'srm.demo.model';


const DetailDSConfig = (): DataSetProps => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'old_rfq_method',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.old_rfq_method`).d('原询价方式'),
        readOnly: true,
        required: true,
        lookupCode: 'SCM.DELIVERY_STATUS',
        defaultValue: 1,
      },
      {
        name: 'new_rfq_method',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.new_rfq_method`).d('现询价方式'),
        required: true,
        lookupCode: 'SCM.DELIVERY_STATUS',
        placeholder: intl.get(`${intlPrefix}.new_rfq_method`).d('请选择'),
      },
    ],
    transport: {
      submit: ({ data }) => {
        return {
          data: data[0],  // body 参数
          url: `${process.env.SRM_DEV_HOST}/demo`,
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
