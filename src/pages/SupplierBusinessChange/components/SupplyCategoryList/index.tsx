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
import { supplyCategoryLovDSConf } from '@/pages/SupplierBusinessChange/stores/supplyCategoryLovDS';
import { observer } from 'mobx-react';

function Index({ ds, detailDS, isCreate }) {

  const supplyLovDS = useMemo(() => {
    const _supplyLovDS = new DataSet(supplyCategoryLovDSConf());
    ds.setState('lovDS', _supplyLovDS);
    return _supplyLovDS;
  }, [ds]);

  const isChange = detailDS?.current?.get('type') === '4';

  const columns: Array<ColumnProps> = useMemo(
    () => [
      { name: 'supplierCode',  },
      { name: 'supplierName',  },
      { name: 'supplierTypeId',  },
      { name: 'categoryId',  },
      { name: 'categoryLevel',  },
      ...(isChange ? [{ name: 'newLevel' }] : []),
      { name: 'reson', editor: true },
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
    [isChange],
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
            dataSet={supplyLovDS}
            name="supplyCodeLov"
            clearButton={false}
            funcType={FuncType.flat}
            mode={ViewMode.button}
            onChange={() => {
              LovSyncTable.add(ds, supplyLovDS, 'supplyCodeLov', 'supplierId');
            }}
          >
            新建
          </Lov>
        </PermissionButton>,
      ]}
    />
  );

}

export default observer(Index);
