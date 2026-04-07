import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import intl from 'utils/intl';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import { getCurrentOrganizationId } from 'utils/utils';
import sexOptionDataSet from "@/pages/Demo/stores/sexOptionDataSet";
import {DataSet} from "choerodon-ui/pro";

const organizationId = getCurrentOrganizationId();

const intlPrefix = 'srm.demo.model';

const DetailDSConfig = (): DataSetProps => {
  return {
    // DataSet 不和后端交互时，自动新建一条数据，在表单场景下比较常见
    autoCreate: false,
    // 这里是与后端约定的，上传时用到的字段
    fields: [
      {
        name: 'name',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.title`).d('标题'),
      },
      {
        name: 'age',
        type: FieldType.number,
        label: intl.get(`${intlPrefix}.content`).d('年龄'),
      },
      {
        name: 'email',
        type: FieldType.email,
        label: intl.get(`${intlPrefix}.content`).d('邮箱'),
      },
      {
        name: 'gender',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.content`).d('性别'),
        textField: 'text',
        valueField: 'value',
        options: new DataSet(sexOptionDataSet),
      },
    ],
    transport: {
      create: ({data, params, dataSet}) => {
        console.log(data, params, dataSet);
        return {
          data: data[0],  // body 参数
          url: `${process.env.SRM_DEV_HOST}/demo/`,
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
