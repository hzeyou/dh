import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import intl from 'utils/intl';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import { getCurrentOrganizationId } from 'utils/utils';
import sexOptionDataSet from "@/pages/Demo/stores/sexOptionDataSet";
import {DataSet} from "choerodon-ui/pro";

const organizationId = getCurrentOrganizationId();

const intlPrefix = 'srm.rfq';

const SupplierDSConfig = (): DataSetProps => {
  return {
    // DataSet 不和后端交互时，自动新建一条数据，在表单场景下比较常见
    autoQuery: true,
    pageSize: 100,
    autoCreate: true,
    // 这里是与后端约定的，上传时用到的字段
    fields: [
      {
        name: 'supplier_code',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.supplier_code`).d('供应商编码'),
        required: true,
      },
      {
        name: 'supplier_name',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.supplier_name`).d('供应商名称'),
        required: true,
      },
      {
        name: 'supplier_status',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.supplier_status`).d('供应商状态'),
        required: true,
      },
      {
        name: 'buyer',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.buyer`).d('爱奇迹采购员'),
        required: true,
      },
      {
        name: 'payment_terms',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.payment_terms`).d('付款条件'),
      },
      {
        name: 'payment_method',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.payment_method`).d('付款方式'),
      },
    ],
    transport: {
      read: ({ dataSet, data }) => {
        return {
          params: data,  // query 参数
          url: `${process.env.SRM_DEV_HOST}/rfq/supplier`,
          method: 'GET',
        };
      },
      destroy: ({ dataSet, data }) => {
        const ids = data.map((item) => item.id);
        console.log('ids==', ids);
        return {
          // params: data,  // query 参数
          data: {ids},
          url: `${process.env.SRM_DEV_HOST}/rfq/supplier`,
          method: 'DELETE',
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


export { SupplierDSConfig };
