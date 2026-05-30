import {
  TableButtonType,
  TableQueryBarType,
} from 'choerodon-ui/pro/lib/table/enum';
import { DataSet, Lov, Table } from 'choerodon-ui/pro';
import React, { useMemo } from 'react';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { intl } from 'utils/utils';
import { RenderProps } from 'choerodon-ui/pro/lib/field/FormField';
import { ViewMode } from 'choerodon-ui/pro/lib/lov/enum';
import { LovSyncTable } from '@/utils/util';
import PermissionButton from 'components/Permission/Button';
import { bankLovDSConf } from '@/pages/Supplier/stores/bankLovDS';
import { FuncType } from 'choerodon-ui/pro/lib/button/enum';

interface BankInfoProps {
  ds: DataSet;
  editable?: boolean;
}

export default function Index({ ds, editable = true }: BankInfoProps) {
  const lovBankDS = useMemo(() => {
    const _lovBankDS = new DataSet(bankLovDSConf());
    ds.setState('lovDS', _lovBankDS);
    return _lovBankDS;
  }, [ds]);

  const columns: Array<ColumnProps> = useMemo(() => {
    const baseColumns: Array<ColumnProps> = [
      { name: 'sortCode', editor: editable },
      { name: 'swiftCode', editor: editable },
      { name: 'name', editor: editable },
      { name: 'country', editor: editable },
      { name: 'account', editor: editable },
      { name: 'host', editor: editable },
      { name: 'type', editor: editable },
      { name: 'address', editor: editable },
      { name: 'isTicket', editor: editable },
      { name: 'attachment', editor: editable },
    ];

    if (editable) {
      baseColumns.push({
        header: intl.get('hzero.common.button.action').d('操作'),
        renderer: ({ record }: RenderProps) => {
          if (record == null) return;
          return (
            <a onClick={() => ds?.delete(record)}>
              {intl.get('hzero.common.button.delete').d('删除')}
            </a>
          );
        },
      });
    }

    return baseColumns;
  }, [ds, editable]);

  const buttons = editable
    ? [
      <PermissionButton key="btn-1" type="text">
        <Lov
          dataSet={lovBankDS}
          name="lovSortCode"
          clearButton={false}
          funcType={FuncType.flat}
          mode={ViewMode.button}
          onChange={() => {
            LovSyncTable.add(ds, lovBankDS, 'lovSortCode', 'supplierId');
          }}
        >
          境内银行联行号选择
        </Lov>
      </PermissionButton>,
      TableButtonType.add,
    ]
    : [];

  return (
    <Table
      queryBar={TableQueryBarType.filterBar}
      columns={columns}
      dataSet={ds}
      buttons={buttons}
    />
  );
}
