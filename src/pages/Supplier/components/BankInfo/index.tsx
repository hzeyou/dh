import { TableButtonType } from 'choerodon-ui/pro/lib/table/enum';
import {DataSet, Lov, Table} from 'choerodon-ui/pro';
import React, { useMemo } from 'react';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { intl } from 'utils/utils';
import { RenderProps } from 'choerodon-ui/pro/lib/field/FormField';
import {ViewMode} from 'choerodon-ui/pro/lib/lov/enum';
import {LovSyncTable} from '@/utils/util';
import PermissionButton from 'components/Permission/Button';
import {lovBankDSConf} from '@/pages/Supplier/stores/lovBankDS';

export default function Index({ ds }) {

  const lovBankDS = useMemo(() => {
    const _lovBankDS = new DataSet(lovBankDSConf());
    return _lovBankDS;
  }, [ds]);

  const columns: Array<ColumnProps> = useMemo(
    () => [
      { name: 'sortCode', editor: true },
      { name: 'swiftCode', editor: true },
      { name: 'name', editor: true },
      { name: 'country', editor: true },
      { name: 'account', editor: true },
      { name: 'host', editor: true },
      { name: 'type', editor: true },
      { name: 'address', editor: true },
      { name: 'isTicket', editor: true },
      { name: 'attachment', editor: true },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        renderer: ({ record }: RenderProps) => {
          if (record == null) return;
          return (
            <a onClick={() => ds?.delete(record)}>
              {intl.get('hzero.common.button.delete').d('删除')}
            </a>
          );
        },
      },
    ],
    [],
  );

  // 境内银行
  // 联行号选择

  return (
    <Table
      columns={columns}
      dataSet={ds}
      buttons={[
        <PermissionButton
          key="btn-1"
          type="c7n-pro"
          // permissionList={[{ code: 'hzero.pts.execution-rate.work-order.ps.button.import' }]}
        >
          <Lov
            dataSet={lovBankDS}
            name="lov_supplier_code"
            clearButton={false}
            mode={ViewMode.button}
            onChange={(value) => {
              LovSyncTable.delete(value, ds, 'lov_supplier_code');
            }}
          >
            选择供应商
          </Lov>
        </PermissionButton>,
        TableButtonType.add
      ]}
    />
  );

}
