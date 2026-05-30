import {
  TableButtonType,
  TableQueryBarType,
} from 'choerodon-ui/pro/lib/table/enum';
import { Table } from 'choerodon-ui/pro';
import React, { useMemo } from 'react';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { intl } from 'utils/utils';
import { RenderProps } from 'choerodon-ui/pro/lib/field/FormField';

export default function Index({ ds, editable = true }) {
  const columns: Array<ColumnProps> = useMemo(() => {
    const baseColumns: Array<ColumnProps> = [
      { name: 'name', editor: editable },
      { name: 'phone', editor: editable },
      { name: 'email', editor: editable },
      { name: 'type', editor: editable },
      { name: 'isMain', editor: editable },
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

  return (
    <Table
      queryBar={TableQueryBarType.filterBar}
      columns={columns}
      dataSet={ds}
      buttons={editable ? [TableButtonType.add] : []}
    />
  );
}
