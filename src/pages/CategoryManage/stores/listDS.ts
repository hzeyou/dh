import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import {
  DataSetSelection,
  FieldTrim,
  FieldType,
} from 'choerodon-ui/dataset/data-set/enum';
import { HG_MDMF_API_PREFIX } from '@/utils/config';
import intl from 'utils/intl';

import {
  categoryFields,
  levelOptions,
  statusOptions,
} from './commonDS';

export {
  CATEGORY_LEVEL,
  CATEGORY_STATUS,
  getCategoryRows,
  getChildLevel,
  getLevelMeaning,
  getStatusMeaning,
} from './commonDS';

const intlPrefix = 'mdmf.categoryManager.model.category';

export const queryFields = () => [
  {
    name: 'level',
    type: FieldType.number,
    label: intl.get(`${intlPrefix}.level`).d('目录层级'),
    options: levelOptions(),
  },
  {
    name: 'code',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.code`).d('编码'),
    trim: FieldTrim.both,
  },
  {
    name: 'name',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.name`).d('目录名称'),
    trim: FieldTrim.both,
  },
  {
    name: 'status',
    type: FieldType.number,
    label: intl.get(`${intlPrefix}.status`).d('状态'),
    options: statusOptions(),
  },
];

export const treeDSConf = (): DataSetProps => ({
  paging: false,
  selection: DataSetSelection.single,
  primaryKey: 'id',
  idField: 'id',
  parentField: 'parentId',
  fields: categoryFields(),
  transport: {
    read: (): AxiosRequestConfig => ({
      url: `${HG_MDMF_API_PREFIX}/directories/list`,
      method: 'get',
    }),
  },
});

export const listDSConf = (): DataSetProps => ({
  selection: false,
  autoQuery: true,
  primaryKey: 'id',
  idField: 'id',
  pageSize: 20,
  combineSort: true,
  queryFields: queryFields(),
  fields: categoryFields(),
  transport: {
    read: ({ data, dataSet }): AxiosRequestConfig => {
      const currentId = dataSet?.getState('currentId');

      return {
        url: `${HG_MDMF_API_PREFIX}/directories/list`,
        method: 'get',
        data: {
          ...data,
          ...(currentId ? { currentId } : {}),
        },
      };
    },
  },
});
