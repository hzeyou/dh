import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldIgnore, FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';
import { billTypeOptionsDS, exitTypeOptionsDS } from '@/utils/config';
import Record from 'choerodon-ui/dataset/data-set/Record';
import { Form } from 'choerodon-ui/dataset/interface';

const intlPrefix = 'srm.supplier.model.supplier';

export const detailDSConf = (): DataSetProps => ({
  autoCreate: true,
  primaryKey: 'id',
  idField: 'id',
  fields: [
    {
      name: 'id',
      type: FieldType.number,
    },
    {
      name: 'changeCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorCode`).d('批量变更单号'),
    },
    {
      name: 'type',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.type`).d('单据类型'),
      required: true,
      options: billTypeOptionsDS,
    },
    {
      name: 'exitType',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.exitType`).d('退出类型'),
      options: exitTypeOptionsDS,
      dynamicProps: {
        required: ({ dataSet, record, name }) => {
          return record?.get('type') === '3';
        }
      },
    },
    {
      name: 'startDate',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.startDate`).d('冻结开始日期'),
      bind: 'startEndDate.start',
    },
    {
      name: 'endDate',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.endDate`).d('冻结结束日期'),
      bind: 'startEndDate.end',
    },
    {
      name: 'startEndDate',
      type: FieldType.date,
      label: intl.get(`${intlPrefix}.startEndDate`).d('冻结周期'),
      ignore: FieldIgnore.always,
      range: ['start', 'end'],
      dynamicProps: {
        required: ({ dataSet, record, name }) => {
          return record?.get('type') === '1';
        }
      },
    },
    {
      name: 'remark',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.remark`).d('申请说明'),
    },
    {
      name: 'applicant',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.applicant`).d('申请人'),
    },
  ],
  transport: {
    read: ({ dataSet }): AxiosRequestConfig => {
      const supplierId = dataSet?.getState('supplierId');
      return {
        url: `${process.env.SRM_DEV_HOST}/srm/supplier/${supplierId}`,
        method: 'get',
      };
    },
    submit: ({ dataSet, data }): AxiosRequestConfig => {

      console.log('data==', data);

      return {
        // url: `${process.env.SRM_DEV_HOST}/srm/supplier`,
        // method: 'post',
        // data: data[0],
      };
    },
  },
});
