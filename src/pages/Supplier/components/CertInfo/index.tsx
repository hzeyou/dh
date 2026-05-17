import { TableButtonType } from 'choerodon-ui/pro/lib/table/enum';
import { Table } from 'choerodon-ui/pro';
import React, { useMemo } from 'react';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { intl } from 'utils/utils';
import { RenderProps } from 'choerodon-ui/pro/lib/field/FormField';

export default function Index({ ds }) {

  const columns: Array<ColumnProps> = useMemo(
    () => [
      { name: 'type', editor: true },
      { name: 'name', editor: true },
      { name: 'number', editor: true },
      { name: 'effectiveDate', editor: true },
      { name: 'expiryDate', editor: true },
      { name: 'remark', editor: true },
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

  return (
    <Table
      columns={columns}
      dataSet={ds}
      buttons={[TableButtonType.add]}
    />
  );

}
