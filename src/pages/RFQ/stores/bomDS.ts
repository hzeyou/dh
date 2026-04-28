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
    autoQuery: true,
    pageSize: 100,
    autoCreate: true,
    // 这里是与后端约定的，上传时用到的字段
    fields: [
      {
        name: 'material_code',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.material_code`).d('物料编码'),
        required: true,
      },
      {
        name: 'material_name',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.material_name`).d('物料名称'),
        required: true,
      },
      {
        name: 'spec_description',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.spec_description`).d('规格描述（品牌、规格、型号）'),
        required: true,
      },
      {
        name: 'pricing_unit',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.pricing_unit`).d('定价单位'),
        required: true,
      },
      {
        name: 'demand_quantity',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.demand_quantity`).d('需求数量'),
      },
      {
        name: 'cost_structure',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.cost_structure`).d('成本结构'),
      },
      {
        name: 'cost_structure_total',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.cost_structure_total`).d('成本结构总价'),
        required: true,
      },
      {
        name: 'bom_version',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.bom_version`).d('BOM版本'),
        required: true,
      },
      {
        name: 'bom_quotation',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.bom_quotation`).d('BOM报价'),
        required: true,
      },
      {
        name: 'bom_total_price',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.bom_total_price`).d('BOM总价'),
        required: true,
      },
      {
        name: 'inquiry_remark',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.inquiry_remark`).d('询价备注'),
        required: true,
      },
      {
        name: 'inquiry_attachment',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.inquiry_attachment`).d('询价附件'),
        required: true,
      },
      {
        name: 'latest_quotation',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.latest_quotation`).d('最近一次报价'),
        required: true,
      },
      {
        name: 'lowest_historical_quotation',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.lowest_historical_quotation`).d('历史最低报价'),
        required: true,
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
          url: `${process.env.SRM_DEV_HOST}/rfq/bom`,
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
