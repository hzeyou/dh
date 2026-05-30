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
// TODO 1 新建，2 审批中，3 已审批 4 删除，缺失驳回状态
const editableStatusList = [1,];

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
    history.push('/srm/supplier-business-change/create');
  }

  function handleView(record: Record) {
    history.push(
      `/srm/supplier-business-change/update/${record.get('businessChangeId')}`,
    );
  }

  function handleEdit(record: Record) {
    history.push(
      `/srm/supplier-business-change/update/${record.get('businessChangeId')}`,
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

  function canEdit(record?: Record) {
    if (!record) return false;
    return editableStatusList.includes(record.get('status'));
  }

  // 表格列
  const columns: Array<ColumnProps> = useMemo(() => {
    return [
      {
        name: 'businessChangeNo',
        width: 180,
        renderer: ({ value, record }) => (
          <a onClick={() => handleView(record as Record)}>{value}</a>
        ),
      },
      { name: 'statusMeaning', width: 120 },
      { name: 'typeMeaning', width: 140 },
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
              key: 'delete',
              ele: (
                <a onClick={() => handleDelete(currentRecord)}>
                  {intl.get('hzero.common.button.delete').d('删除')}
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

  return (
    <>
      <Header title={intl.get('srm.supplier.view.title').d('供应商业务变更')}>
        <Button icon="add" color={ButtonColor.primary} onClick={handleCreate}>
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        <ExcelExportPro
          defaultSelectAll
          modalProps={{ closable: true }}
          requestUrl={`${HG_SRM_API_PREFIX}/supplier-business-changes/export`}
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
              .get(`${intlPrefix}.changeCode`)
              .d('业务变更单'),
            dynamicFilterBar: {
              searchText: 'changeCode',
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
