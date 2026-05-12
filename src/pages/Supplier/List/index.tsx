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

const intlPrefix = 'srm.supplier.model.supplier';

interface ListProps {
  history: any;
  listDS: DataSet;
}

function List(props: ListProps) {

  const { history, listDS } = props;

  const [status, setStatus] = useState('all');

  const tabList = useMemo(() => [
    { label: '全部', value: 'all' },
    { label: '注册', value: '1' },
    { label: '合格', value: '2' },
    { label: '冻结', value: '3' },
    { label: '淘汰', value: '4' },
  ], []);

  // 新建
  function handleCreate() {
    history.push('/srm/supplier/detail/create');
  }

  function handleEdit(record: Record) {
    history.push(`/srm/supplier/detail/${record.id}`);
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
          const operators:any = [];
          if (status === 'all') {
            operators.push({
              key: 'action1', // key
              ele: (
                <a onClick={() => {}}>
                  {intl.get('hzero.common.button.change').d('信息变更')}
                </a>
              ), // 操作栏的按钮
              len: 4,
            });
          }

          if (status === '1') {
            operators.push({
              key: 'action1', // key
              ele: (
                <a onClick={() => {}}>
                  {intl.get('hzero.common.button.change').d('发起准入')}
                </a>
              ), // 操作栏的按钮
              len: 4,
            }, {
              key: 'action2', // key
              ele: (
                <a onClick={() => {}}>
                  {intl.get('hzero.common.button.change').d('审核')}
                </a>
              ), // 操作栏的按钮
              len: 2,
            });
          }

          if (status === '2' || status === '3' || status === '4') {
            operators.push({
              key: 'action1', // key
              ele: (
                <a onClick={() => {}}>
                  {intl.get('hzero.common.button.change').d('同步SAP')}
                </a>
              ), // 操作栏的按钮
              len: 4,
            });
          }

          return operatorRender(operators, record, { limit: 6 });

        },
      },
    ];
  }, [status]);

  // 导出参数
  function getExportQueryParams() {
    const formData = listDS.queryDataSet?.current?.toJSONData() || {};
    return filterNullValueObject(formData);
  }

  const onChange = async (activeKey: string) => {
    setStatus(activeKey);
    await listDS.query(1, {status: activeKey});
  };

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

        {/* defaultActiveKey="all" */}
        <Tabs  activeKey={status} onChange={onChange}>
          {
            tabList.map(item => (
              <Tabs.TabPane
                tab={intl.get('pts.pbcBoard.view.tab.kpi').d(item.label)}
                key={item.value}
                style={{ height: `calc(100vh - 190px})` }}
              >
              </Tabs.TabPane>
            ))
          }
        </Tabs>

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
