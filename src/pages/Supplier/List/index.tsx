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
import { HG_SRM_API_PREFIX } from '@/utils/config';
import { compose } from '@/utils/util';
import { listDSConf } from '../stores/listDS';
import { operatorRender } from 'hzero-front/lib/utils/renderer';
import { Record } from 'choerodon-ui/dataset';

const intlPrefix = 'srm.supplier.model.supplier';

interface ListProps {
  history: any;
  listDS: DataSet;
}

function List(props: ListProps) {
  const { history, listDS } = props;

  const [status, setStatus] = useState('all');

  const tabList = useMemo(
    () => [
      { label: '全部', value: 'all' },
      { label: '注册', value: '1' },
      { label: '合格', value: '2' },
      { label: '冻结', value: '3' },
      { label: '淘汰', value: '4' },
    ],
    [],
  );

  // 新建
  function handleCreate() {
    history.push('/srm/supplier/create');
  }

  function handleEdit(record: Record) {
    history.push(`/srm/supplier/view/${record.get('supplierId') || record.id}`);
  }

  // todo
  function goAdmissionDetail(record: Record) {
    history.push(`/srm/supplier/admission/${record.get('admissionNo')}`);
  }

  // 表格列
  const columns: Array<ColumnProps> = useMemo(() => {
    const baseColumns: Array<ColumnProps> = [
      {
        name: 'supplierCode',
        width: 140,
        renderer: ({ value, record }) => (
          <a onClick={() => handleEdit(record as Record)}>{value}</a>
        ),
      },
      { name: 'sapCode', width: 140 },
      { name: 'supplierName', width: 180 },
      { name: 'supplierTypeId', width: 140 },
      { name: 'levelMeaning', width: 300 },
      { name: 'status', width: 140, align: ColumnAlign.center },
      { name: 'itemTypes', width: 140 },
      { name: 'createdFrom', width: 120 },
    ];

    if (status === '1') {
      baseColumns.push(
        // 注册审核状态 缺字段 暂时registerAuditStatus
        { name: 'registerAuditStatus', width: 140 },
        {
          name: 'admissionNo',
          width: 140,
          renderer: ({ value, record }) => (
            <a onClick={() => goAdmissionDetail(record as Record)}>{value}</a>
          ),
        },
      );
    }

    if (status === '2' || status === '3' || status === '4') {
      baseColumns.push({ name: 'syncSapStatus', width: 140 });
    }

    return [
      ...baseColumns,
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        lock: ColumnLock.right,
        width: 200,
        align: ColumnAlign.center,
        renderer: ({ record }) => {
          const operators: any = [];
          if (status === '1') {
            operators.push({
              key: 'action1', // key
              ele: (
                <a onClick={() => undefined}>
                  {intl.get('hzero.common.button.change').d('发起准入')}
                </a>
              ), // 操作栏的按钮
              len: 4,
            });
          }

          if (status === '2' || status === '3') {
            operators.push({
              key: 'action1', // key
              ele: (
                <a onClick={() => undefined}>
                  {intl.get('hzero.common.button.change').d('同步SAP')}
                </a>
              ), // 操作栏的按钮
              len: 4,
            });
          }

          if (status === 'all') {
            operators.push({
              key: 'action1', // key
              ele: (
                <a onClick={() => undefined}>
                  {intl.get('hzero.common.button.change').d('信息变更')}
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
    return filterNullValueObject({
      ...formData,
      status: status === 'all' ? undefined : Number(status),
    });
  }

  const onChange = async (activeKey: string) => {
    setStatus(activeKey);
    await listDS.query(
      1,
      activeKey === 'all' ? {} : { status: Number(activeKey) },
    );
  };

  return (
    <>
      <Header title={intl.get('srm.supplier.view.title').d('供应商列表')}>
        <Button icon="add" color={ButtonColor.primary} onClick={handleCreate}>
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        <ExcelExportPro
          defaultSelectAll
          modalProps={{ closable: true }}
          requestUrl={`${HG_SRM_API_PREFIX}/suppliers/export`}
          queryParams={getExportQueryParams}
          exportAsync
        />
      </Header>
      <Content>
        <Tabs activeKey={status} onChange={onChange}>
          {tabList.map(item => (
            <Tabs.TabPane
              tab={intl.get('pts.pbcBoard.view.tab.kpi').d(item.label)}
              key={item.value}
            ></Tabs.TabPane>
          ))}
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
              .get(`${intlPrefix}.supplierCode`)
              .d('供应商编码'),
            dynamicFilterBar: {
              searchText: 'supplierCode',
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
