import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import intl from 'utils/intl';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import { getCurrentOrganizationId } from 'utils/utils';
import {AxiosRequestConfig} from 'axios';

const organizationId = getCurrentOrganizationId();

const intlPrefix = 'srm.demo.model';

const ListDSConfig = (): DataSetProps => {
  return {
    autoQuery: true,
    pageSize: 100,
    queryFields: [
      {
        label: intl.get(`${intlPrefix}.title`).d('姓名'),
        name: 'name',
        type: FieldType.string,
      },
      {
        label: intl.get(`${intlPrefix}.content`).d('年龄'),
        name: 'age',
        type: FieldType.number,
        max: 100,
        step: 1
      },
      {
        label: intl.get(`${intlPrefix}.content`).d('邮箱'),
        name: 'email',
        type: FieldType.email,
        help: '用户邮箱，可以自动补全',
      },
    ],
    fields: [
      {
        name: 'name',
        type: FieldType.string,
        label: '姓名',
        // required: true,
      },
      {
        name: 'age',
        type: FieldType.number,
        label: '年龄',
        max: 100,
        step: 1,
        computedProps: {
          required: ({ record }) => record.get('age') > 18,
        },
      },
      {
        name: 'email',
        type: FieldType.string,
        label: '邮箱',
        help: '用户邮箱，可以自动补全',
        // required: true,

      },
    ],
    // data: [
    //   {title: '标题1', content: '内容1', id: 1},
    //   {title: '标题2', content: '内容2', id: 2},
    //   {title: '标题3', content: '内容3', id: 3},
    //   {title: '标题4', content: '内容4', id: 4},
    // ],
    transport: {
      read: (): AxiosRequestConfig => {
        return {
          url: `${process.env.SRM_DEV_HOST}/demo`,
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
