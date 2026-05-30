import DataSet, { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { DataToJSON, FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';
import Record from 'choerodon-ui/dataset/data-set/Record';

const intlPrefix = 'srm.supplier.model.supplier';

const typeOptionsDS = new DataSet({
  data: [
    { meaning: '邮件接收人', value: '1' },
    { meaning: '防伪码收件人', value: '2' },
    { meaning: '邮件抄送人', value: '3' },
  ],
});
const mainOptionsDS = new DataSet({
  data: [
    { meaning: '否', value: '0', disabled: false },
    { meaning: '是', value: '1', disabled: false },
  ],
});

export const contactDSConf = (): DataSetProps => ({
  autoCreate: true,
  dataToJSON: DataToJSON.normal,
  selection: false,
  fields: [
    {
      name: 'name',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.name`).d('联系人'),
      required: true,
    },
    {
      name: 'phone',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.phone`).d('联系人手机'),
      required: true,
    },
    {
      name: 'email',
      type: FieldType.email,
      label: intl.get(`${intlPrefix}.email`).d('联系人邮箱'),
      required: true,
    },
    {
      name: 'type',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.type`).d('联系人类型'),
      required: true,
      options: typeOptionsDS,
    },
    {
      name: 'isMain',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isMain`).d('是否主要联系人'),
      required: true,
      options: mainOptionsDS,
      validator: (_value, _name, record) => {
        if (!(record instanceof Record)) return true;

        let count = 0;
        record.dataSet?.forEach(item => {
          if (item.get('isMain') === '1') {
            ++count;
          }
        });
        if (count >= 2) return '主要联系人只能有一个';
        return true;
      },
    },
  ],
});
