import React, { useEffect, useMemo } from 'react';
import { DataSet, Table, Form, Lov, Button, Select, TextField, Tooltip, Spin, DatePicker, Modal, NumberField, Output } from 'choerodon-ui/pro';
import { Tooltip as TooltipType } from 'choerodon-ui/pro/lib/core/enum';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { isEmpty, isNil } from 'lodash';
import { Record } from 'choerodon-ui/dataset';
import { Tag } from 'choerodon-ui';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { SelectionMode, TableButtonType, TableMode } from 'choerodon-ui/pro/lib/table/enum';
import { DataSetStatus } from 'choerodon-ui/dataset/data-set/enum';

const permissionCode = 'hzero.srm.purchase.detail.button';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import { getSession, setSession } from 'utils/utils';
import { detailDSConf } from '../stores/detailDS';
import { ListDSConfig } from '../stores/indexDS';
import { useCheckRoleTag } from '@/hooks/hook';
import Title from '@/components/Title';

interface DetailProps {
  history: any;
  purchaseId?: string | number; // 指标地图不通过参数传入，通过props
  showHeader?: boolean;
  viewPage?: boolean;
  match: {
    params: {
      purchaseId: string | number;
    }
  }
}

const Detail: React.FC<DetailProps> = (props) => {

  const { history, match, showHeader = true, viewPage = false } = props;
  const { params } = match;
  const purchaseId = props.purchaseId || params.purchaseId;
  const isCreate = purchaseId === 'create';
  //是否是SRM管理员
  const isHSrmAdmin = useCheckRoleTag('HSRM_ADMIN');
  const isReadOnly = !isHSrmAdmin || viewPage;


  // 定义ds
  const [headerDS, lineDS] = useMemo(() => {
    const _headerDS = new DataSet(detailDSConf());
    const _lineDS = new DataSet(ListDSConfig());

    _headerDS.setState('lineDS', _lineDS);
    _lineDS.setState('headerDS', _headerDS);

    if (!isCreate) {
      _headerDS.setState('purchaseId', purchaseId);
      _lineDS.setState('purchaseId', purchaseId);
      _headerDS.query();
      _lineDS.query();
    }
    return [_headerDS, _lineDS];
  }, [purchaseId]);

  // 保存
  const handleSave = async () => {
    headerDS.current?.set('__update', !headerDS.current?.get('__update'));
    headerDS.setState('action', 'save');
    const res = await headerDS.forceSubmit();
    if (isCreate) {
      const newPurchaseId = res?.content?.[0]?.purchaseId;
      headerDS.setState('indicatorId', newPurchaseId);
      lineDS.setState('indicatorId', newPurchaseId);
      history.replace(`/srm/indicator-dictionary/detail/${newPurchaseId}`); // 替换路由
    }
    headerDS.query();
    lineDS.query();
  };

  // 行编辑器
  const editor = (record: Record, name) => {
    if (name === 'handlerUserLov') {
      // 有一行有值，则其它行不可编辑
      const hasValueRecord: Record | undefined = lineDS.find(r => !isNil(r.get('handlerUserId')));

      if (hasValueRecord) {
        // 有一行有值，则该行可编辑，其它行不可编辑
        if (hasValueRecord.id === record.id) {
          return <Lov name={name} record={record} tableProps={{ queryFieldsLimit: 6 }} />;
        } else {
          return false;
        }
      } {
        // 都无值，则都可编辑
        return <Lov name={name} record={record} tableProps={{ queryFieldsLimit: 6 }} />;
      }
    }
    return true;
  };

  const columns = [
    { name: 'productId', editor },
    { name: 'productName', editor },
    { name: 'orderQty', editor },
  ];

  // 创建行
  const handleCreateLine = () => {
    lineDS.create({}, 0);
  };

  // didMount 处理创建带入的初始值
  useEffect(() => {
    if (isCreate) {
      const createData = getSession('_purchaseCreateData');
      if (!isEmpty(createData)) {
        headerDS.current?.set(createData);
        setSession('_purchaseCreateData', null);
      }

    }
  }, []);

  // 页面加载状态
  const rootLoading =
    [DataSetStatus.loading, DataSetStatus.submitting].includes(headerDS.status)
    || [DataSetStatus.loading, DataSetStatus.submitting].includes(lineDS.status);

  return (
    <>
      {showHeader && (
        <Header
          title={isCreate
            ? intl.get('srm.purchase.view.title.create').d('新建采购单')
            : intl.get('srm.purchase.view.title.edit').d('采购单详情')}
          backPath="/srm/purchase"
        >
          {
            <>
              <Button
                icon="save"
                onClick={handleSave}
              >
                {intl.get('hzero.common.button.save').d('保存')}
              </Button>
            </>
          }
        </Header>
      )}
      <Content>
        <Spin spinning={rootLoading}>
          <Form dataSet={headerDS} columns={3}>
            {!isReadOnly ? (
              <>
                <TextField name="purchaseCode" />
                <TextField name="supplierName" />
              </>
            ) : (
              <>
                <Output name="purchaseCode" />
                <Output name="supplierName" />
              </>
            )}
          </Form>
          <Title title={intl.get('pts.indicatorDictionary.view.title.line').d('行信息')} top={36} />
          <Table
            dataSet={lineDS}
            columns={columns}
            buttons={
              !isReadOnly ? [
                TableButtonType.delete,
                [TableButtonType.add, { onClick: handleCreateLine }],
              ] : []}
            selectionMode={!isReadOnly ? SelectionMode.rowbox : SelectionMode.none}
          />
        </Spin>
      </Content>
    </>
  );
};

export default formatterCollections({
  code: ['srm.purchase']
})(withRouter(observer(Detail)));
