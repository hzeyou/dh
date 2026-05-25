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
import { ContentCard } from 'components/Page';

export default function Index({ ds, isCreate }) {

  const lovBankDS = useMemo(() => {
    const _lovBankDS = new DataSet(supplyCategoryLovDSConf());
    ds.setState('lovDS', _lovBankDS);
    return _lovBankDS;
  }, [ds]);

  const columns: Array<ColumnProps> = useMemo(
    () => [
      { name: 'agreementNo',  },
      { name: 'agreementName',  },
      { name: 'remark',  },
      { name: 'admissionRequirement',  },
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
    <ContentCard title="协议管理">
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
    </ContentCard>

  );

}
