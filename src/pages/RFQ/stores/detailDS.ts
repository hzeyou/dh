import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import intl from 'utils/intl';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import { getCurrentOrganizationId } from 'utils/utils';
import sexOptionDataSet from "@/pages/Demo/stores/sexOptionDataSet";
import {DataSet} from "choerodon-ui/pro";

const organizationId = getCurrentOrganizationId();

const intlPrefix = 'srm.rfq';

const DetailDSConfig = (): DataSetProps => {
  return {
    // DataSet 不和后端交互时，自动新建一条数据，在表单场景下比较常见
    autoCreate: true,
    // 这里是与后端约定的，上传时用到的字段
    fields: [
      {
        name: 'business_type',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.business_type`).d('业务类型'),
        required: true,
      },
      {
        name: 'company',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.company`).d('公司'),
        required: true,
      },
      {
        name: 'rfq_type',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.rfq_type`).d('询价类型'),
        required: true,
      },
      {
        name: 'rfq_method',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.rfq_method`).d('询价方式'),
      },
      {
        name: 'category',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.category`).d('品类'),
      },
      {
        name: 'quotation_currency',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.quotation_currency`).d('报价币种'),
        required: true,
      },
      {
        name: 'quotation_tax',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.quotation_tax`).d('是否含税报价'),
        required: true,
      },
      {
        name: 'tax_rate',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.tax_rate`).d('是否含税报价'),
        required: true,
      },
      {
        name: 'inquiry_stop_date',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.inquiry_stop_date`).d('询价截止时间'),
        required: true,
      },
      {
        name: 'price_start_date',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.price_start_date`).d('价格有效期（开始）'),
        required: true,
      },
      {
        name: 'price_stop_date',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.price_stop_date`).d('价格有效期（结束）'),
        required: true,
      },
      {
        name: 'seal_control',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.seal_control`).d('密封控制'),
        required: true,
      },
      {
        name: 'purchasing_group',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.purchasing_group`).d('采购组'),
        required: true,
      },
      {
        name: 'product_manager_approved_by',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.product_manager_approved_by`).d('产品经理审核人'),
        required: true,
      },
      {
        name: 'procurement_cc',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.procurement_cc`).d('采购履行抄送人'),
      },
      {
        name: 'product_line',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.product_line`).d('产品线'),
      },
      {
        name: 'project_number',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.project_number`).d('项目编号'),
      },
      {
        name: 'project_mode',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.project_mode`).d('项目模式'),
      },
      {
        name: 'inquiry_title',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.inquiry_title`).d('询价标题'),
        required: true,
      },
      {
        name: 'remarks',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.remarks`).d('备注'),
      },
      {
        name: 'attachment',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.attachment`).d('附件上传'),
      },

    ],
    transport: {
      create: ({data, params, dataSet}) => {
        console.log(data, params, dataSet);
        return {
          data: data[0],  // body 参数
          url: `${process.env.SRM_DEV_HOST}/demo`,
          method: 'POST',
        };
      },
      submit: ({ dataSet, data }) => {
        if (data[0].id) {
          return {
            data: data[0],  // body 参数
            url: `${process.env.SRM_DEV_HOST}/demo/${data[0].id}`,
            method: 'PUT',
          };
        } else {
          return {
            data: data[0],  // body 参数
            url: `${process.env.SRM_DEV_HOST}/demo/`,
            method: 'POST',
          };
        }
      },
      read: ({ dataSet, data }) => {
        return {
          params: data,  // query 参数
          url: `${process.env.SRM_DEV_HOST}/demo/${data.id}`,
          method: 'GET',
        };
      },
      destroy: ({ dataSet, data }) => {
        const ids = data.map((item) => item.id);
        console.log('ids==', ids);
        return {
          // params: data,  // query 参数
          data: {ids},
          url: `${process.env.SRM_DEV_HOST}/demo`,
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


export { DetailDSConfig };
