import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import intl from 'utils/intl';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();

const intlPrefix = 'srm.demo.model';

const DetailDSConfig = (): DataSetProps => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'title',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.title`).d('标题'),
      },
      {
        name: 'content',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.content`).d('内容'),
      },
    ],
    transport: {
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
        return {
          // params: data,  // query 参数
          data: {ids},
          url: `${process.env.SRM_DEV_HOST}/demo/${ids[0]}`,
          method: 'DELETE',
        };
      },
    },
  };
};


export { DetailDSConfig };
