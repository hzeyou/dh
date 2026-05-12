import React, { useEffect } from 'react';
import { Button, DataSet, Table } from 'choerodon-ui/pro';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { Record } from 'choerodon-ui/dataset';
import {
  ColumnAlign,
  ColumnLock,
  TableAutoHeightType,
  TableQueryBarType,
} from 'choerodon-ui/pro/lib/table/enum';
import { observer } from 'mobx-react';

import { Header, Content } from 'components/Page';
import ExcelExportPro from 'components/ExcelExportPro';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { filterNullValueObject } from 'utils/utils';
import withProps from 'utils/withProps';
import { HG_PTS_API_PREFIX } from '@/utils/config';
import { compose } from '@/utils/util';
import openSupplierTypeModal from '../components/SupplierTypeModal';
import { listDSConf } from '../stores/listDS';

const intlPrefix = 'srm.supplier.model.supplier';

interface ListProps {
  listDS: DataSet;
}

function List(props: ListProps) {
  const { listDS } = props;

  // 编辑
  function handleEdit(record: Record | null) {
    openSupplierTypeModal({
      record,
      onSubmit: () => listDS.query(listDS.currentPage),
    });
  }

  // 表格列
  const columns: Array<ColumnProps> = [
    {
      name: 'vendorCode',
      width: 140,
      renderer: ({ value, record }) => (
        <a onClick={() => handleEdit(record as Record)}>{value}</a>
      ),
    },
    { name: 'vendorTypeName', width: 180 },
    { name: 'vendorStatus', width: 120 },
    { name: 'isRegisterAudit', width: 120 },
    { name: 'isZiZhiAudit', width: 120 },
    { name: 'isXieYi', width: 120 },
    { name: 'isXianChangAudit', width: 120 },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      lock: ColumnLock.right,
      width: 120,
      align: ColumnAlign.center,
      renderer: ({ record }) => (
        <a onClick={() => handleEdit(record as Record)}>
          {intl.get('hzero.common.button.edit').d('编辑')}
        </a>
      ),
    },
  ];

  // 导出参数
  function getExportQueryParams() {
    const formData = listDS.queryDataSet?.current?.toJSONData() || {};
    return filterNullValueObject(formData);
  }

  // didMount
  useEffect(() => {
    listDS.query(listDS.currentPage);
  }, []);

  return (
    <>
      <Header title={intl.get('srm.supplier.view.title').d('供应商类型')}>
        <Button
          icon="add"
          color={ButtonColor.primary}
          onClick={() => handleEdit(null)}
        >
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        {/* todo ExcelExportPro url替换 */}
        <ExcelExportPro
          defaultSelectAll
          modalProps={{ closable: true }}
          requestUrl={`${HG_PTS_API_PREFIX}/action-headers/export`}
          queryParams={getExportQueryParams}
          exportAsync
        />
      </Header>
      <Content>
        <Table
          virtual
          virtualCell
          dataSet={listDS}
          columns={columns}
          searchCode="srm.supplier.list.table"
          queryBar={TableQueryBarType.filterBar}
          queryFields={{}}
          queryBarProps={{
            queryFieldsLimit: 3,
            fuzzyQueryPlaceholder: intl
              .get(`${intlPrefix}.vendorCode`)
              .d('类型编码'),
            dynamicFilterBar: {
              searchText: 'vendorCode',
            },
          }}
          autoHeight={{ type: TableAutoHeightType.minHeight, diff: 33 }}
        />
      </Content>
    </>
  );
}

export default compose(
  formatterCollections({
    code: ['srm.supplier'],
  }),
  withProps(() => {
    const listDS = new DataSet(listDSConf());
    return {
      listDS,
    };
  }),
  observer,
)(List);
