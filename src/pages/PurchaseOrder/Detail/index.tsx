import React, { useMemo, useState } from 'react';
import { Button, DataSet, Form, Lov, Output, Table, TextField } from 'choerodon-ui/pro';
import { observer } from 'mobx-react';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { Button as ButtonPermission } from 'components/Permission';
import { intl } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import { compose } from '@/utils/util';
import { purchaseDetailDSConf } from '../stores/purchaseDetailDSConf';
import { submitApproval } from '@/services/purchaseApi';
import notification from 'utils/notification';
import { SelectionMode, TableAutoHeightType, TableButtonType } from 'choerodon-ui/pro/lib/table/enum';
import { Collapse } from 'choerodon-ui';


const intlPrefix = 'srm.purchase';
interface DetailProps {
  history: any;
  match: {
    params: {
      purchaseId: string;
    };
  };
}

const { Panel } = Collapse;
function Detail(props: DetailProps) {
  const { history, match } = props;
  const {
    params: { purchaseId },
  } = match;

  const isReadOnly = false;

  // 是否为创建
  const isCreate: boolean = purchaseId === 'create';
  // 明细行序号
  const [maxLineNo, setMaxLineNo] = useState(0);
  // 定义ds
  const [headerDS] = useMemo(() => {
    const _headerDS = new DataSet(purchaseDetailDSConf());
    if (!isCreate) {
      _headerDS.setState('purchaseId', purchaseId);
      _headerDS.query();
      console.log('_headerDS', _headerDS.toJSONData());
    }
    return [_headerDS];
  }, [purchaseId]);

  // 保存
  const handleSave = async () => {
    const validHeader = await headerDS.current?.validate(false, false);
    if (!validHeader) return;
    headerDS.setState('action', 'submit');
    await headerDS.submit();
  };

  const handSubmitApproval = async () => {
    if (headerDS.current?.dirty) {
      notification.warning({
        message: '数据未保存, 请先保存',
      });
      return;
    }

    const res = await submitApproval(headerDS.current?.get('purchaseId'));
    if (res.failed) {
      notification.warning({
        message: res.message,
      });
      return false;
    }
  };


  // 创建行
  const handleCreateLine = () => {
    headerDS.children.dtlList.create({lineNo: maxLineNo + 10,}, 0);
    setMaxLineNo(maxLineNo + 10);
  };

  const columns = [
    { name: 'productId', editor: !isReadOnly },
    { name: 'productName', editor: !isReadOnly },
    { name: 'orderQty', editor: !isReadOnly },
  ];

  return (
    <>
      <Header
        title={intl.get(`${intlPrefix}.purchase`).d('采购单详情')}
        backPath="/srm/purchase-order/list"
        isChange={headerDS.dirty}
      >
        <Button icon="save" onClick={handleSave} color={ButtonColor.primary}>
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
        <Button
          icon="delete"
          onClick={() => {
            console.log('delete');
          }}
        >
          {intl.get('hzero.common.button.delete').d('删除')}
        </Button>
        {/*todo*/}
        <ButtonPermission
          onClick={handSubmitApproval}
          permissionList={[
            {
              code: `${intlPrefix}.import`,
              type: 'button',
              meaning: '提交审批',
            },
          ]}
        >
          {intl.get('hzero.common.button.xxx').d('提交审批')}
        </ButtonPermission>
      </Header>
      <Content>
        <Collapse defaultActiveKey={['baseInfo', 'detailInfo']} bordered={false}>
          <Panel header="基本信息" key="baseInfo">
            <Form dataSet={headerDS} columns={3}>
              {isReadOnly ? (
                <>
                  <Output name="purchaseId" />
                  <Output name="purchaseCode" />
                  <Output name="supplierName" />
                  <Output name="supplierId" />
                </>
              ) : (
                <>
                  <TextField name="purchaseId" />
                  <TextField name="purchaseCode" />
                  <Lov name="supplierLov" />
                  <TextField name="supplierId" />
                </>
              )}
            </Form>
          </Panel>
          <Panel key="detailInfo" header="明细信息">
            {/*<Title title={intl.get('pts.indicatorDictionary.view.title.line').d('行信息')} top={36} />*/}
            <Table
              border
              autoHeight={{ type: TableAutoHeightType.maxHeight, diff: 33 }}
              dataSet={headerDS.children.dtlList}
              columns={columns}
              buttons={
                !isReadOnly ? [
                  TableButtonType.delete,
                  [TableButtonType.add, { onClick: handleCreateLine }],
                ] : []}
              selectionMode={!isReadOnly ? SelectionMode.rowbox : SelectionMode.none}
            />
          </Panel>
        </Collapse>
      </Content>
    </>
  );
}

export default compose(
  formatterCollections({
    code: [`${intlPrefix}`],
  }),
  observer,
)(Detail);
