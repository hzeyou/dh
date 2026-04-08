import { compose } from '@/utils/util';
import formatterCollections from 'utils/intl/formatterCollections';
import withProps from 'utils/withProps';
import { Button, DataSet, DateTimePicker, Modal, Table } from 'choerodon-ui/pro';
import { operatorRender } from 'hzero-front/lib/utils/renderer';
import { observer } from 'mobx-react';
import intl from 'utils/intl';
import { Content, Header } from 'components/Page';
import { ListProps } from '@/typings';
import { Record } from 'choerodon-ui/dataset';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import {ColumnLock, TableButtonType, TableQueryBarType} from 'choerodon-ui/pro/lib/table/enum';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import React from 'react';
import TitleCom from '@/pages/Demo/Index/TitleCom';
import {AutoComplete} from 'choerodon-ui/pro';
import { useEmailAutoComplete } from '@/hooks/useEmailAutoComplete';
import ExcelExportPro from 'components/ExcelExportPro';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import PermissionButton from 'components/Permission/Button';
import { ListDSConfig } from '../stores/indexDS';
import { useModal } from 'components/Import';
import { openModalHelper } from '@/utils/modalHelper';
import DetailOpen from '@/components/Detail';

const intlPrefix = 'srm.demo';

const Index = (props: ListProps) => {

  // const _useUrlHistory = useUrlHistory();
  // const urlHistory = _useUrlHistory.urlHistory;

  // console.log('urlHistory==', urlHistory);

  const { history, listDS } = props;

  console.log('组件 Page');

  // Modal - 使用工具函数简化

  const queryFn = () => {
    listDS.query(listDS.currentPage);
  };

  function toDetail(mode: 'view' | 'edit' | 'delete', record?: Record | null) {
    if (mode === 'view') {
      // history.push('/srm/demo/detail');
      DetailOpen({ data: {onSubmit: queryFn}});
      return;
    }
    const id = record?.get('id');
    DetailOpen({data: {id, onSubmit: queryFn}});
  }

  async function delItem(record) {

    const res = await listDS.delete(record);

    // 刷新
    if (res === false) return;

    await listDS.query(listDS.currentPage);

  }

  const { emailOptionDS, handleValueChange } = useEmailAutoComplete();

  const columns: Array<ColumnProps> = [
    {
      width: 200,
      name: 'name',
      help: '主键，区分用户',
    },
    {
      width: 200,
      name: 'age',
      sortable: true,
    },
    {
      width: 200,
      name: 'email',
    },
    {
      name: 'action',
      title: intl.get('hzero.common.button.action').d('操作'),
      width: 120,
      lock: ColumnLock.right,
      renderer: ({ record }) => {
        const operators = [
          {
            key: 'edit', // key
            ele: (
              <a onClick={() => toDetail('edit', record)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            ), // 操作栏的按钮
            len: 2, // 该按钮占相应中文数的宽度
            title: intl.get('hzero.common.button.edit').d('编辑'), // 文字提示的显示文本
          },
          {
            key: 'view', // key
            ele: (
              <a onClick={() => toDetail('edit', record)}>
                {intl.get('hzero.common.button.view').d('查看')}
              </a>
            ), // 操作栏的按钮
            len: 2, // 该按钮占相应中文数的宽度
            title: intl.get('hzero.common.button.view').d('查看'), // 文字提示的显示文本
          },
          {
            key: 'delete', // key
            ele: (
              <a onClick={() => delItem(record)}>
                {intl.get('hzero.common.button.delete').d('删除')}
              </a>
            ), // 操作栏的按钮
            len: 2, // 该按钮占相应中文数的宽度
            title: intl.get('hzero.common.button.delete').d('删除'), // 文字提示的显示文本
          },
        ];
        return operatorRender(operators, record, { limit: 3 }); // operatorRender接受三个参数，第一个是操作列数组，第二个是当前行数据，第三个是配置
      },
    },
  ];

  function getExportQueryParams() {
    // 勾选导出
    if (listDS.selected.length > 0) {
      return {
        actionHeaderIds: listDS.selected.map((record) => record.get('actionHeaderId')).join(','),
        needPerControl: '1',
      };
    }

    // 参数导出
    const formData = listDS.queryDataSet?.current?.toJSONData() || {};

    console.log('formData==', formData);

    return filterNullValueObject({
      ...formData,
      actionDesc: listDS.getQueryParameter('actionDesc'),
      needPerControl: '1',
    });
  }

  return (
    <>
      <Header title={intl.get(`${intlPrefix}.view.demo`).d('例子')}>
        <Button
          icon="save"
          onClick={() => toDetail('view')}
          color={ButtonColor.primary}
        >
          {intl.get('hzero.common.button.add').d('新增')}
        </Button>
        <ExcelExportPro
          defaultSelectAll
          requestUrl={`/hpts/v1/${getCurrentOrganizationId()}/action-headers/export`}
          queryParams={getExportQueryParams}
          modalProps={{closable: true}}
          exportAsync
        />
        <PermissionButton
          key="add-2"
          disabled={!listDS.selected.length}
          onClick={(event) => {
            listDS['delete'](listDS.selected);
          }}
          type="c7n-pro"
          // permissionList={[{ code: 'hzero.pts.execution-rate.work-order.ps.button.import' }]}
        >
          删除
        </PermissionButton>
      </Header>
      <Content>
        <Table
          dataSet={listDS}
          columns={columns}
          queryBar={TableQueryBarType.professionalBar}
          queryBarProps={{
            queryFieldsLimit: 2,
            fuzzyQueryPlaceholder: intl
              .get(`${intlPrefix}.view.purchaseCode`)
              .d('模糊筛选...'),
            dynamicFilterBar: {
              searchText: 'condition_key',
            },
          }}
          queryFields={{
            email: <AutoComplete
              onFocus={handleValueChange}
              onInput={handleValueChange}
              options={emailOptionDS}
            />
          }}
        />
      </Content>
    </>
  );

};


export default compose(
  formatterCollections({
    code: [`${intlPrefix}`],
  }),
  withProps(() => {
    const listDS = new DataSet(ListDSConfig());
    console.log('withProps==', listDS);
    return {
      listDS,
    };
  }),
  observer,
)(Index);
