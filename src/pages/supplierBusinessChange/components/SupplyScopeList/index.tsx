import { TableButtonType, TableQueryBarType } from 'choerodon-ui/pro/lib/table/enum';
import {DataSet, Lov, Table} from 'choerodon-ui/pro';
import React, { useMemo } from 'react';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { intl } from 'utils/utils';
import { RenderProps } from 'choerodon-ui/pro/lib/field/FormField';
import {ViewMode} from 'choerodon-ui/pro/lib/lov/enum';
import {LovSyncTable} from '@/utils/util';
import PermissionButton from 'components/Permission/Button';
import { FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { lovSupplyScopeDSConf } from '@/pages/SupplierBusinessChange/stores/lovSupplyScopeDS';

export default function Index({ ds, isCreate }) {

  const lovBankDS = useMemo(() => {
    const _lovBankDS = new DataSet(lovSupplyScopeDSConf());
    ds.setState('lovDS', _lovBankDS);
    return _lovBankDS;
  }, [ds]);

  const columns: Array<ColumnProps> = useMemo(
    () => [
      { name: 'field1',  },
      { name: 'field2',  },
      { name: 'field3',  },
      { name: 'field4',  },
      { name: 'field5',  },
      { name: 'field6', editor: true },
      { name: 'field7', editor: true },
      { name: 'field8', editor: true },
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
      buttons={[
        <PermissionButton
          key="btn-1"
          type="text"
          // permissionList={[{ code: 'hzero.pts.execution-rate.work-order.ps.button.import' }]}
        >
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
            新建
          </Lov>
        </PermissionButton>,
        TableButtonType.add
      ]}
    />
  );

}
