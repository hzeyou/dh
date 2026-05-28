import { TableButtonType, TableQueryBarType } from 'choerodon-ui/pro/lib/table/enum';
import { DataSet, Table } from 'choerodon-ui/pro';
import React, { useMemo } from 'react';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { intl } from 'utils/utils';
import { RenderProps } from 'choerodon-ui/pro/lib/field/FormField';

export default function Index({ ds, headColumns }: { ds: DataSet, headColumns: any[]} ) {

  const columns: Array<ColumnProps> = useMemo(
    () => [
      { name: 'type', editor: false },
      { name: 'name', editor: false },
      { name: 'number', editor: false },
      { name: 'effectiveDate', editor: false },
      { name: 'expiryDate', editor: false },
      { name: 'remark', editor: true },
      { name: 'attachment', editor: false },
      ...headColumns,
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

  return (
    <Table
      queryBar={TableQueryBarType.filterBar}
      columns={columns}
      dataSet={ds}
      buttons={[TableButtonType.add]}
    />
  );

}
