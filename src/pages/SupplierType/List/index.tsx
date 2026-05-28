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
import { HG_SRM_API_PREFIX } from '@/utils/config';
import { compose } from '@/utils/util';
import openSupplierTypeModal from '../components/SupplierTypeModal';
import { listDSConf } from '../stores/listDS';

const intlPrefix = 'srm.supplierType.model';

interface ListProps {
  listDS: DataSet;
}

function List(props: ListProps) {
  const { listDS } = props;

  // 编辑
  function handleEdit(record: Record | null) {
    openSupplierTypeModal({
      record,
      onSubmit: () => {
        listDS.query(listDS.currentPage);
      },
    });
  }

  // 表格列
  const columns: Array<ColumnProps> = [
    {
      name: 'sapCode',
      width: 140,
    },
    { name: 'typeName', width: 180 },
    { name: 'status', width: 120 },
    { name: 'registrationReviewMeaning', width: 120, align: ColumnAlign.center, },
    { name: 'certificateMeaning', width: 120, align: ColumnAlign.center, },
    { name: 'agreementMeaning', width: 120, align: ColumnAlign.center, },
    { name: 'onsiteAuditMeaning', width: 120, align: ColumnAlign.center, },
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
        <ExcelExportPro
          defaultSelectAll
          modalProps={{ closable: true }}
          requestUrl={`${HG_SRM_API_PREFIX}/supplier-types/export`}
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
            // fuzzyQueryPlaceholder: intl.get(`${intlPrefix}.status`).d('状态'),
            // dynamicFilterBar: {
            //   searchText: 'status',
            // },
          }}
          autoHeight={{ type: TableAutoHeightType.minHeight, diff: 33 }}
        />
      </Content>
    </>
  );
}

export default compose(
  formatterCollections({
    code: ['srm.supplierType'],
  }),
  withProps(() => {
    const listDS = new DataSet(listDSConf());
    return {
      listDS,
    };
  }),
  observer,
)(List);
