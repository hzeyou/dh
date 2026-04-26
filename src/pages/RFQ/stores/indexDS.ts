import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import intl from 'utils/intl';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import { getCurrentOrganizationId } from 'utils/utils';
import {AxiosRequestConfig} from 'axios';
import { DataSet } from 'choerodon-ui/pro';

const organizationId = getCurrentOrganizationId();

const intlPrefix = 'srm.rfq';

const ListDSConfig = (): DataSetProps => {
  return {
    autoQuery: true,
    pageSize: 100,
    queryFields: [
      {
        label: intl.get(`${intlPrefix}.rfq_number`).d('询价单号'),
        name: 'rfq_number',
        type: FieldType.string,
        placeholder: '请输入',
      },
      {
        label: intl.get(`${intlPrefix}.rfq_title`).d('询价标题'),
        name: 'rfq_title',
        type: FieldType.string,
        placeholder: '请输入',
      },
      {
        label: intl.get(`${intlPrefix}.bom_code`).d('物料编码/名称'),
        name: 'bom_code',
        type: FieldType.string,
        placeholder: '请输入',
      },
      {
        label: intl.get(`${intlPrefix}.rfq_type`).d('询价类型'),
        name: 'rfq_type',
        type: FieldType.string,
        placeholder: '请选择',
        options: new DataSet({
          data: [{
            meaning: '公开询价',
            value: 1,
          },{
            meaning: '邀请询价',
            value: 2,
          }]
        })
      },
      {
        label: intl.get(`${intlPrefix}.supplier_code`).d('供应商编码/名称'),
        name: 'supplier_code',
        type: FieldType.string,
        placeholder: '请输入',
      },
      {
        label: intl.get(`${intlPrefix}.category_code`).d('品类编码/品类名称'),
        name: 'category_code',
        type: FieldType.string,
        placeholder: '请输入',
      },
      {
        label: intl.get(`${intlPrefix}.procurement_entity`).d('采购主体'),
        name: 'procurement_entity',
        type: FieldType.string,
      },
      {
        label: intl.get(`${intlPrefix}.business_type`).d('业务类型'),
        name: 'business_type',
        type: FieldType.string,
        placeholder: '请输入',
      },
      {
        label: intl.get(`${intlPrefix}.start_end_date`).d('起止日期'),
        name: 'start_end_date',
        type: FieldType.string,
      },
      {
        label: intl.get(`${intlPrefix}.rfq_method`).d('询价方式'),
        name: 'rfq_method',
        type: FieldType.string,
      },
      {
        label: intl.get(`${intlPrefix}.current_round`).d('当前轮次'),
        name: 'current_round',
        type: FieldType.string,
      },
      {
        label: intl.get(`${intlPrefix}.receipt_status`).d('单据状态'),
        name: 'receipt_status',
        type: FieldType.string,
      },
      {
        label: intl.get(`${intlPrefix}.supplier_response_status`).d('供应商参与状态'),
        name: 'supplier_response_status',
        type: FieldType.string,
      },
      {
        label: intl.get(`${intlPrefix}.approval_status`).d('审批状态'),
        name: 'approval_status',
        type: FieldType.string,
      },
    ],
    fields: [
      {
        name: 'rfq_number',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.title`).d('询价单号'),
      },
      {
        name: 'pricing_number',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.pricing_number`).d('定价单号'),
      },
      {
        name: 'company',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.company`).d('公司'),
      },
      {
        name: 'business_type',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.business_type`).d('业务类型'),
      },
      {
        name: 'rfq_title',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.rfq_title`).d('询价标题'),
      },
      {
        name: 'rfq_status',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.rfq_status`).d('询价状态'),
      },
      {
        name: 'supplier_response_status',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.supplier_response_status`).d('供应商参与状态'),
      },
      {
        name: 'rfq_type',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.rfq_type`).d('询价类型'),
      },
    ],
    transport: {
      read: (): AxiosRequestConfig => {
        return {
          url: `${process.env.SRM_DEV_HOST}/rfq/list`,
          method: 'GET',
        };
      },
      submit: ({ dataSet, data }) => {
        console.log('submit==', data);
        return {
          data: data[0],  // body 参数
          url: `${process.env.SRM_DEV_HOST}/demo/`,
          method: 'POST',
        };
      },
      destroy: ({ data }): AxiosRequestConfig => {
        const ids = data.map((item) => item.id);
        return {
          data: {ids},
          url: `${process.env.SRM_DEV_HOST}/demo`,
          method: 'DELETE',
        };
      },
    },
    events: {
      load: ({ dataSet }) => {
        console.log('load', dataSet);
      },
      query: ({ params, data }) => {
        console.log('query', params, data);
      },
    },
  };
};


export { ListDSConfig };
