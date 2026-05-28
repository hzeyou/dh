import React, { useMemo } from 'react';
import { Button, DataSet, Table } from 'choerodon-ui/pro';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
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
import { HG_SRM_API_PREFIX } from '@/utils/config';
import { compose } from '@/utils/util';
import { operatorRender } from 'hzero-front/lib/utils/renderer';
import { Record } from 'choerodon-ui/dataset';
import { listDSConf } from '../stores/listDS';

const intlPrefix = 'srm.supplier.model.supplier';
const newStatusList = [0, '0', 'NEW', 'new', 'DRAFT', 'draft', '新建'];

interface HistoryLike {
  push(path: string): void;
}

interface ListProps {
  history: HistoryLike;
  listDS: DataSet;
}

function List(props: ListProps) {
  const { history, listDS } = props;

  // 新建
  function handleCreate() {
    history.push('/srm/supplier-admission/detail/create');
  }

  function handleEdit(record: Record, type: string) {
    history.push(
      `/srm/supplier-admission/detail/${type}/${record.get('assessmentId')}`,
    );
  }

  async function handleDelete(record: Record) {
    const res = await listDS.delete(
      record,
      intl.get('hzero.common.message.confirm.delete').d('是否确认删除？'),
    );

    if (res === false) return;

    await listDS.query(listDS.currentPage);
  }

  function isNewStatus(record?: Record) {
    if (!record) return false;
    return (
      newStatusList.includes(record.get('status')) ||
      newStatusList.includes(record.get('statusMeaning'))
    );
  }

  // 表格列
  const columns: Array<ColumnProps> = useMemo(() => {
    return [
      {
        name: 'assessmentCode',
        width: 180,
        renderer: ({ value, record }) => (
          <a onClick={() => handleEdit(record as Record, 'view')}>{value}</a>
        ),
      },
      { name: 'assessmentTypeMeaning', width: 140 },
      { name: 'supplierTypeMeaning', width: 140 },
      { name: 'statusMeaning', width: 120 },
      { name: 'supplierCode', width: 140 },
      { name: 'supplierName', width: 200 },
      { name: 'exportCreatedBy', width: 120 },
      { name: 'exportCreationDate', width: 180 },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        lock: ColumnLock.right,
        width: 200,
        align: ColumnAlign.center,
        renderer: ({ record }) => {
          const currentRecord = record as Record;
          const operators: Array<{
            key: string;
            ele: React.ReactNode;
            len: number;
          }> = [
            {
              key: 'edit',
              ele: (
                <a onClick={() => handleEdit(currentRecord, 'update')}>
                  {intl.get('hzero.common.button.edit').d('编辑')}
                </a>
              ),
              len: 2,
            },
          ];

          if (isNewStatus(currentRecord)) {
            operators.push({
              key: 'delete',
              ele: (
                <a onClick={() => handleDelete(currentRecord)}>
                  {intl.get('hzero.common.button.delete').d('删除')}
                </a>
              ),
              len: 2,
            });
          }

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
          .get('srm.supplier.view.title.supplierAdmission')
          .d('准入及品类扩充')}
      >
        <Button icon="add" color={ButtonColor.primary} onClick={handleCreate}>
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        <ExcelExportPro
          defaultSelectAll
          modalProps={{ closable: true }}
          requestUrl={`${HG_SRM_API_PREFIX}/supplier-assessments/export`}
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
              .get(`${intlPrefix}.supplierName`)
              .d('供应商名称'),
            dynamicFilterBar: {
              searchText: 'supplierName',
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
