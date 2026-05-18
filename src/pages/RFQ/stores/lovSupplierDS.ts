import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import intl from 'utils/intl';
import { FieldIgnore, FieldType } from 'choerodon-ui/dataset/data-set/enum';
import { getCurrentOrganizationId } from 'utils/utils';
import {LovSyncTable} from '@/utils/util';

const organizationId = getCurrentOrganizationId();

const intlPrefix = 'srm.rfq';

const LovSupplierDSConfig = (): DataSetProps => {
  return {
    // DataSet 不和后端交互时，自动新建一条数据，在表单场景下比较常见
    autoQuery: false,
    autoCreate: false,
    // 这里是与后端约定的，上传时用到的字段
    fields: [
      {
        name: 'lov_supplier_code',
        type: FieldType.object,
        lovCode: 'SCM.SUPPLIER',
        ignore: FieldIgnore.always,
        label: intl.get(`${intlPrefix}.lov_supplier_code`).d('选择供应商'),
        multiple: true,
      },
    ],
  };
};


export { LovSupplierDSConfig };
