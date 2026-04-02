import { compose } from '@/utils/util';
import formatterCollections from 'utils/intl/formatterCollections';
import withProps from 'utils/withProps';
import { Button, DataSet, DateTimePicker, Table } from 'choerodon-ui/pro';
import { operatorRender } from 'hzero-front/lib/utils/renderer';
import { observer } from 'mobx-react';
import intl from 'utils/intl';
import { Content, Header } from 'components/Page';
import { ListDSConfig } from '../stores/indexDS';
import { ListProps } from '@/typings';
import { Record } from 'choerodon-ui/dataset';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import {ColumnLock, TableButtonType, TableQueryBarType} from 'choerodon-ui/pro/lib/table/enum';
import {ButtonColor} from 'choerodon-ui/pro/lib/button/enum';
import React, {useCallback, useMemo, useState} from 'react';
import TitleCom from '@/pages/Demo/Index/TitleCom';
import {AutoComplete} from 'choerodon-ui/pro';
import {FieldType} from 'choerodon-ui/dataset/data-set/enum';

const intlPrefix = 'srm.demo';

const Index = (props: ListProps) => {

  const { history, listDS } = props;

  console.log('组件 Index');

  function toDetail(mode: 'view' | 'edit' | 'delete', record?: Record | null) {
    if (mode === 'view') {
      history.push('/srm/demo/detail');
      return;
    }
    const id = record?.get('id');
    history.push(`/srm/demo/detail/${id}`);
  }

  async function delItem(record) {

    const res = await listDS.delete(record, intl.get('srm.demo.list.delete.single').d('是否确认删除？'));

    // 刷新
    if (res === false) return;

    listDS.query(listDS.currentPage);
  }

  const emailOptionDS = useMemo(() => {
    return new DataSet({
      fields: [
        {
          name: 'value',
          type: FieldType.string,
        },
        {
          name: 'meaning',
          type: FieldType.string,
        },
      ],
    });
  }, []);

  const handleValueChange = useCallback((v) => {
    const { value } = v.target;
    const suffixList = ['@qq.com', '@163.com', '@hand-china.com'];
    if (value.indexOf('@') !== -1) {
      emailOptionDS.loadData([]);
    } else {
      emailOptionDS.loadData(suffixList.map(suffix => ({
        value: `${value}${suffix}`,
        meaning: `${value}${suffix}`,
      })));
    }
  }, [emailOptionDS]);

  const columns: Array<ColumnProps> = [
    {
      width: 200,
      name: 'name',
      editor: true,
      help: '主键，区分用户',
    },
    {
      width: 200,
      name: 'age',
      editor: true,
      sortable: true,
    },
    {
      width: 200,
      name: 'email',
      editor: () => {
        return (
          <AutoComplete
            onFocus={handleValueChange}
            onInput={handleValueChange}
            options={emailOptionDS}
          />
        );
      },
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
              <a onClick={() => toDetail('view', record)}>
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
        return operatorRender(operators, record, { limit: 2 }); // operatorRender接受三个参数，第一个是操作列数组，第二个是当前行数据，第三个是配置
      },
    },
  ];

  const [consoleValue, setConsoleValue]:any = useState('');

  const toDataButton = (
    <Button onClick={() => {
      // toData 转换成普通数据，不包含删除的数据
      setConsoleValue(listDS.toData());
      console.log(listDS.toData());
    }}>
      toData
    </Button>
  );

  const toJSONDataButton = (
    <Button onClick={() => {
      // toJSONData 转换成用于提交的 json 数据
      setConsoleValue(listDS.toJSONData());
      console.log(listDS.toJSONData());
    }}>
      toJSONData
    </Button>
  );

  // setQueryParameter 自定义查询参数
  const setQueryParamButton = (
    <Button onClick={() => listDS.setQueryParameter('customPara', 'test')}>
      设置查询参数
    </Button>
  );

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
          buttons={[
            TableButtonType.add,
            TableButtonType.query,
            TableButtonType.save,
            TableButtonType.delete,
            TableButtonType.reset,
            TableButtonType.expandAll,
            TableButtonType.collapseAll,
            TableButtonType.export,
            toDataButton,
            toJSONDataButton,
            setQueryParamButton,
          ]}
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
