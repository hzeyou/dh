import DataSet, { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';


export const lifeCycleChangeLogDSConf = (): DataSetProps => ({
  autoCreate: false,
  fields: [
    {
      name: 'actionMeaning',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.actionMeaning`).d('动作'),
    },
    {
      name: 'action',
      type: FieldType.number,
    },
    {
      name: 'code',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.code`).d('单据'),
    },
    {
      name: 'date',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.date`).d('日期'),
    },
    {
      name: 'type',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.type`).d('类型'),
    },
    {
      name: 'typeMeaning',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.typeMeaning`).d('类型'),
    },
  ],
  // TODO 模拟数据, 不一定是当前字段
  data: [
    { actionMeaning: '建立合作伙伴关系', action: 1, code: '', date: '2026-4-2', type: 1, typeMeaning: '注册' },
    { actionMeaning: '供应商准入', action: 2, id: 3, code: 'ZR20260403001', date: '2026-4-2', type: 0, typeMeaning: '' },
    { actionMeaning: '供应商冻结', action: 3, id: 8, code: 'YWBG20260404001', date: '2026-4-2', type: 0, typeMeaning: '' },
    { actionMeaning: '供应商淘汰', action: 3, id: 8, code: 'YWBG20260405001', date: '2026-4-2', type: 0, typeMeaning: '' },
  ],
});
