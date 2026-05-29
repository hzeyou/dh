import { AxiosRequestConfig } from 'axios';
import DataSet, { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';

const optionsDS = new DataSet({
  data: [
    { meaning: '是', value: '1' },
    { meaning: '否', value: '2' },
  ],
});

export const certDSConf = (): DataSetProps => ({
  autoCreate: false,
  selection: false,
  fields: [
    {
      name: 'type',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.type`).d('证书类型'),
      required: true,
    },
    {
      name: 'name',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.name`).d('证书名称'),
      // dynamicProps: {
      //   required: ({ record }) =>
      //     record?.get('registrationReview') === checkedValue,
      // },
      required: true,
    },
    {
      name: 'number',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.number`).d('证书号'),
      required: true,
    },
    {
      name: 'effectiveDate',
      type: FieldType.date,
      label: intl.get(`${intlPrefix}.effectiveDate`).d('证书生效日期'),
    },
    {
      name: 'expiryDate',
      type: FieldType.date,
      label: intl.get(`${intlPrefix}.expiryDate`).d('证书失效日期'),
    },
    {
      name: 'remark',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.remark`).d('备注'),
    },
    {
      name: 'attachment',
      type: FieldType.attachment,
      label: intl.get(`${intlPrefix}.attachment`).d('附件'),
    },
    {
      name: 'admissionRequirement',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.attachment`).d('准入要求'),
      options: optionsDS,
    },
  ],
});
