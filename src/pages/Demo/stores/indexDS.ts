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
        label: intl.get(`${intlPrefix}.title`).d('标题'),
        name: 'title',
        type: FieldType.string,
      },
      {
        label: intl.get(`${intlPrefix}.content`).d('内容'),
        name: 'content',
        type: FieldType.string,
      },
    ],
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
      destroy: ({ data }): AxiosRequestConfig => {
        const ids = data.map((item) => item.id);
        return {
          data: {ids},
          url: `${process.env.SRM_DEV_HOST}/demo/${ids[0]}`,
          method: 'DELETE',
        };
      },
    },
  };
};


export { ListDSConfig };
