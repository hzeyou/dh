import React, { useEffect, useMemo, useState } from 'react';
import { Button, Spin, DataSet, Table, Tabs } from 'choerodon-ui/pro';
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
import { HG_PTS_API_PREFIX } from '@/utils/config';
import { compose } from '@/utils/util';
import { listDSConf } from '../stores/listDS';
import {operatorRender} from 'hzero-front/lib/utils/renderer';
import { Record } from 'choerodon-ui/dataset';
import openDetailModal from '../components/DetailModal';

const intlPrefix = 'srm.supplier.model.supplier';

interface ListProps {
  history: any;
  listDS: DataSet;
}

function List(props: ListProps) {

  const { history, listDS } = props;

  // 新建
  function handleCreate() {
    history.push('/srm/supplier/detail/create');
  }

  function handleEdit(record: Record) {
    openDetailModal({
      record,
      onSubmit: () => listDS.query(listDS.currentPage),
    });
  }

  // 表格列
  const columns: Array<ColumnProps> = useMemo(() => {
    return [
      { name: 'vendorCode', width: 140, renderer: ({ value, record }) => (
          <a onClick={() => handleEdit(record as Record)}>{value}</a>
        )
      },
      { name: 'vendorTypeName', width: 180 },
      { name: 'vendorStatus', width: 120 },
      { name: 'vendorErpCode', width: 140 },
      { name: 'isRegisterAudit', width: 120 },
      { name: 'isZiZhiAudit', width: 120 },
      { name: 'isXieYi', width: 120 },
      { name: 'isXianChangAudit', width: 120 },
      { name: 'isXianChangAudit1', width: 120 },
      { name: 'isXianChangAudit2', width: 120 },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        lock: ColumnLock.right,
        width: 200,
        align: ColumnAlign.center,
        renderer: ({record}) => {
          const operators:any = [
            {
              key: 'action1', // key
              ele: (
                <a onClick={() => {}}>
                  {intl.get('hzero.common.button.change').d('编辑')}
                </a>
              ), // 操作栏的按钮
              len: 2,
            },
            {
              key: 'action2', // key
              ele: (
                <a onClick={() => {}}>
                  {intl.get('hzero.common.button.change').d('重发')}
                </a>
              ), // 操作栏的按钮
              len: 4,
            },
            {
              key: 'action3', // key
              ele: (
                <a onClick={() => {}}>
                  {intl.get('hzero.common.button.change').d('关闭')}
                </a>
              ), // 操作栏的按钮
              len: 4,
            }
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

  // const onChange = async (activeKey: string) => {
  //   setStatus(activeKey);
  //   await listDS.query(1, {status: activeKey});
  // };

  return (
    <>
      <Header title={intl.get('srm.supplier.view.title').d('供应商类型')}>
        <Button icon="add" color={ButtonColor.primary} onClick={handleCreate}>
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        <ExcelExportPro
          defaultSelectAll
          modalProps={{closable: true}}
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
            fuzzyQueryPlaceholder: intl
              .get(`${intlPrefix}.vendorCode`)
              .d('类型编码'),
            dynamicFilterBar: {
              searchText: 'vendorCode',
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
