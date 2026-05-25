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
import PermissionButton from 'components/Permission/Button';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import withProps from 'utils/withProps';
import { compose } from '@/utils/util';
import { listDSConf } from '../stores/listDS';
import { operatorRender } from 'hzero-front/lib/utils/renderer';
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
    openDetailModal({
      data: { onSubmit: () => listDS.query(listDS.currentPage) },
    });
  }

  // 导出
  function handleExports() {
    listDS.export();
  }

  function handleEdit(record: Record) {
    openDetailModal({
      data: {
        id: record.get('registrationId'),
        onSubmit: () => listDS.query(listDS.currentPage),
      },
    });
  }

  // 表格列
  const columns: Array<ColumnProps> = useMemo(() => {
    return [
      {
        name: 'supplierCode',
        width: 140,
        renderer: ({ value, record }) => (
          <a onClick={() => handleEdit(record as Record)}>{value}</a>
        ),
      },
      { name: 'statusMeaning', width: 180 },
      { name: 'supplierName', width: 200 },
      { name: 'supplierCode', width: 140 },
      { name: 'levelMeaning', width: 120 },
      { name: 'email', width: 120 },
      { name: 'remark', width: 120 },
      { name: 'inviterCode', width: 120 },
      { name: 'creationDateStr', width: 200 },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        lock: ColumnLock.right,
        width: 200,
        align: ColumnAlign.center,
        renderer: ({ record }) => {
          const operators: any = [
            {
              key: 'action1', // key
              ele: (
                <a onClick={() => handleEdit(record as Record)}>
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
            },
          ];

          return operatorRender(operators, record, { limit: 6 });
        },
      },
    ];
  }, []);

  return (
    <>
      <Header title={intl.get('srm.supplier.view.title').d('供应商类型')}>
        <PermissionButton
          icon="add"
          type={ButtonColor.primary}
          onClick={handleCreate}
          // TODO 需要配置权限
          // permissionList={[{ code: 'hzero.pts.execution-rate.work-order.ps.button.import' }]}
        >
          {intl.get('hzero.common.button.create').d('新建')}
        </PermissionButton>
        <PermissionButton
          icon="launch"
          color={ButtonColor.default}
          onClick={handleExports}
          // TODO 需要配置权限
          // permissionList={[{ code: 'hzero.pts.execution-rate.work-order.ps.button.import' }]}
        >
          {intl.get('hzero.common.button.exports').d('导出')}
        </PermissionButton>
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
              .get(`${intlPrefix}.vendorTypeName`)
              .d('供应商名称'),
            dynamicFilterBar: {
              searchText: 'vendorTypeName',
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
