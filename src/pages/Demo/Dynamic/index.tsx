import { compose } from '@/utils/util';
import formatterCollections from 'utils/intl/formatterCollections';
import withProps from 'utils/withProps';
import {Button, DataSet, Table, Tabs} from 'choerodon-ui/pro';
import { operatorRender } from 'hzero-front/lib/utils/renderer';
import { observer } from 'mobx-react';
import intl from 'utils/intl';
import { Content, Header } from 'components/Page';
import { ListProps } from '@/typings';
import { Record } from 'choerodon-ui/dataset';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import {ColumnLock, TableButtonType, TableQueryBarType} from 'choerodon-ui/pro/lib/table/enum';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { ListDSConfig as HeadDSConfig } from '../stores/dynamicHeadDS';


const intlPrefix = 'srm.demo';

const Index = (props: ListProps) => {

  const { history } = props;

  const [value, setValue] = useState(1);

  const headDS = useState(new DataSet(HeadDSConfig()));

  const [listDS, setListDS] = useState<DataSet|null>(null);

  useEffect(() => {
    // fetch(`/dynamic/${value}`).then(res => res.json()).then((res) => {
    //   setListDS(new DataSet();
    // })
  }, [value]);

  console.log('组件 Demo');

  function toDetail(mode: 'view' | 'edit' | 'delete', record?: Record | null) {
    if (mode === 'view') {
      history.push('/srm/demo/detail');
      return;
    }
    const id = record?.get('id');
    history.push(`/srm/demo/detail/${id}`);
  }

  async function delItem(record) {

    const res = await listDS?.delete(record, intl.get('srm.demo.list.delete.single').d('是否确认删除？'));

    // 刷新
    if (res === false) return;

    listDS?.query(listDS?.currentPage);

  }

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
        <Button
          icon="save"
          onClick={() => setValue(1)}
          color={ButtonColor.primary}
        >
          选择 1
        </Button>
        <Button
          icon="save"
          onClick={() => setValue(2)}
          color={ButtonColor.primary}
        >
          选择 2
        </Button>

      </Header>
      <Content>
        {
          listDS ? (
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
            />
          ) : null
        }
      </Content>
    </>
  );

};


export default compose(
  formatterCollections({
    code: [`${intlPrefix}`],
  }),
  withProps(() => {
    console.log('withProps==');
    return {};
  }, {cacheState: false}),  // 不需要缓存
  observer,
)(Index);
