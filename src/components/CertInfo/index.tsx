import {
  TableButtonType,
  TableQueryBarType,
} from 'choerodon-ui/pro/lib/table/enum';
import { DataSet, Table } from 'choerodon-ui/pro';
import React, { useMemo } from 'react';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { intl } from 'utils/utils';
import { RenderProps } from 'choerodon-ui/pro/lib/field/FormField';

export default function Index({
  ds,
  headColumns,
  editable = true,
}: {
  ds: DataSet;
  headColumns: ColumnProps[];
  editable?: boolean;
}) {
  const columns: Array<ColumnProps> = useMemo(() => {
    const baseColumns: Array<ColumnProps> = [
      { name: 'type', editor: false },
      { name: 'name', editor: false },
      { name: 'number', editor: false },
      { name: 'effectiveDate', editor: false },
      { name: 'expiryDate', editor: false },
      { name: 'remark', editor: editable },
      { name: 'attachment', editor: false },
      ...headColumns,
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
  }, [ds, editable, headColumns]);

  return (
    <Table
      queryBar={TableQueryBarType.filterBar}
      columns={columns}
      dataSet={ds}
      buttons={editable ? [TableButtonType.add] : []}
    />
  );
}
