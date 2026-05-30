import React, { useMemo } from 'react';
import { DataSet, Table } from 'choerodon-ui/pro';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import {
  ColumnAlign,
  ColumnLock,
  TableAutoHeightType,
  TableQueryBarType,
} from 'choerodon-ui/pro/lib/table/enum';
import { observer } from 'mobx-react';
import { operatorRender } from 'hzero-front/lib/utils/renderer';
import { Record } from 'choerodon-ui/dataset';

import { Header, Content } from 'components/Page';
import ExcelExportPro from 'components/ExcelExportPro';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { filterNullValueObject } from 'utils/utils';
import withProps from 'utils/withProps';
import { HG_SRM_API_PREFIX } from '@/utils/config';
import { compose } from '@/utils/util';
import { listDSConf } from '../stores/listDS';

const intlPrefix = 'srm.supplier.model.supplier';
const editableStatusList = [1];

interface HistoryLike {
  push(path: string): void;
}

interface ListProps {
  history: HistoryLike;
  listDS: DataSet;
}

function List(props: ListProps) {
  const { history, listDS } = props;

  function getChangeId(record: Record) {
    return record.get('changeId') || record.id;
  }

  function handleViewSupplier(record: Record) {
    history.push(`/srm/supplier/view/${record.get('supplierId')}`);
  }

  function handleEdit(record: Record) {
    history.push(`/srm/supplier-change/update/${getChangeId(record)}`);
  }

  async function handleCancel(record: Record) {
    const res = await listDS.delete(
      record,
      intl.get('srm.supplier.message.confirm.cancel').d('是否确认取消？'),
    );

    if (res === false) return;

    await listDS.query(listDS.currentPage);
  }

  function canEdit(record?: Record) {
    if (!record) return false;
    return editableStatusList.includes(Number(record.get('status')));
  }

  // 表格列
  const columns: Array<ColumnProps> = useMemo(() => {
    return [
      {
        name: 'changeNo',
        width: 180,
        renderer: ({ value, record }) => (
          <a onClick={() => handleViewSupplier(record as Record)}>{value}</a>
        ),
      },
      { name: 'supplierCode', width: 140 },
      { name: 'supplierName', width: 200 },
      { name: 'shortName', width: 140 },
      { name: 'statusMeaning', width: 120, align: ColumnAlign.center },
      { name: 'createdByName', width: 120 },
      { name: 'creationDateStr', width: 180 },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        lock: ColumnLock.right,
        width: 120,
        align: ColumnAlign.center,
        renderer: ({ record }) => {
          const currentRecord = record as Record;

          if (!canEdit(currentRecord)) return null;

          const operators: Array<{
            key: string;
            ele: React.ReactNode;
            len: number;
          }> = [
            {
              key: 'edit',
              ele: (
                <a onClick={() => handleEdit(currentRecord)}>
                  {intl.get('hzero.common.button.edit').d('编辑')}
                </a>
              ),
              len: 2,
            },
            {
              key: 'cancel',
              ele: (
                <a onClick={() => handleCancel(currentRecord)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
              ),
              len: 2,
            },
          ];

          return operatorRender(operators, record, { limit: 6 });
        },
      },
    ];
  }, []);

  // 导出参数
  function getExportQueryParams() {
    const formData = listDS.queryDataSet?.current?.toJSONData() || {};
    return filterNullValueObject(formData);
  }

  return (
    <>
      <Header
        title={intl
          .get('srm.supplier.view.title.supplierChange')
          .d('供应商变更列表')}
      >
        <ExcelExportPro
          defaultSelectAll
          modalProps={{ closable: true }}
          requestUrl={`${HG_SRM_API_PREFIX}/supplier-changes/export`}
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
            fuzzyQueryPlaceholder: intl
              .get(`${intlPrefix}.changeNo`)
              .d('变更单号'),
            dynamicFilterBar: {
              searchText: 'changeNo',
            },
          }}
          autoHeight={{ type: TableAutoHeightType.minHeight, diff: 88 }}
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
