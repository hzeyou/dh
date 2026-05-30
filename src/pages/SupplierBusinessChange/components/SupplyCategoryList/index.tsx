import React, { useMemo } from 'react';
import { DataSet, Lov, Table } from 'choerodon-ui/pro';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { TableQueryBarType } from 'choerodon-ui/pro/lib/table/enum';
import { RenderProps } from 'choerodon-ui/pro/lib/field/FormField';
import { ViewMode } from 'choerodon-ui/pro/lib/lov/enum';
import { FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { observer } from 'mobx-react';

import { intl } from 'utils/utils';
import PermissionButton from 'components/Permission/Button';
import { LovSyncTable } from '@/utils/util';
import { supplyCategoryLovDSConf } from '@/pages/SupplierBusinessChange/stores/supplyCategoryLovDS';

interface SupplyCategoryListProps {
  ds: DataSet;
  detailDS: DataSet;
  isCreate: boolean;
  isUpdate: boolean;
  isView?: boolean;
}

function Index(props: SupplyCategoryListProps) {
  const { ds, detailDS, isCreate, isUpdate, isView } = props;
  const isEditor = !isView && (isCreate || isUpdate);

  const supplyLovDS = useMemo(() => {
    const _supplyLovDS = new DataSet(supplyCategoryLovDSConf());
    ds.setState('lovDS', _supplyLovDS);
    return _supplyLovDS;
  }, [ds]);

  const isChange = detailDS?.current?.get('type') === '4';

  const columns: Array<ColumnProps> = useMemo(() => {
    const nextColumns: Array<ColumnProps> = [
      { name: 'supplierCode' },
      { name: 'supplierName' },
      { name: 'supplierTypeId' },
      { name: 'categoryId' },
      { name: 'categoryName' },
      { name: 'level' },
    ];

    if (isChange) {
      nextColumns.push({ name: 'newLevel', editor: isEditor });
    }

    nextColumns.push(
      { name: 'reson', editor: isEditor },
      { name: 'remark', editor: isEditor },
      { name: 'attachment', editor: isEditor },
    );

    if (isEditor) {
      nextColumns.push({
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

    return nextColumns;
  }, [ds, isChange, isEditor]);

  const buttons: React.ReactElement[] = [];

  if (isEditor) {
    buttons.push(
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
    );
  }

  return (
    <Table
      queryBar={TableQueryBarType.filterBar}
      columns={columns}
      dataSet={ds}
      buttons={buttons}
    />
  );
}

export default observer(Index);
