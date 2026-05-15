import React, {useEffect, useMemo, useRef} from 'react';
import {
  Button,
  DataSet,
  DatePicker,
  Form,
  Lov,
  Modal, NumberField,
  Output,
  Select,
  Table,
  Tabs,
  TextArea,
  TextField,
} from 'choerodon-ui/pro';
import {observer} from 'mobx-react';
import {ButtonColor} from 'choerodon-ui/pro/lib/button/enum';
import {ColumnProps} from 'choerodon-ui/pro/lib/table/Column';
import {
  SelectionMode,
  TableButtonType,
} from 'choerodon-ui/pro/lib/table/enum';
import {Buttons} from 'choerodon-ui/pro/lib/table/Table';
import {Record} from 'choerodon-ui/dataset';
import {RecordStatus} from 'choerodon-ui/dataset/data-set/enum';
import {isNil} from 'lodash';

import {getCurrentUserId, intl} from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import {
  Header,
  Content,
  ListContent,
  ListItem,
  ContentCard,
} from 'components/Page';

import Title from '@/components/Title';
import {compose} from '@/utils/util';
import {RenderProps} from 'choerodon-ui/pro/lib/field/FormField';
import {Tag} from 'choerodon-ui';
import styles from '../index.less';
import {Anchor} from 'hzero-ui';
import {detailDSConf} from '@/pages/Supplier/stores/detailDS';
import {contactDSConf} from '@/pages/Supplier/stores/contactDS';
import {bankDSConf} from '@/pages/Supplier/stores/bankDS';
import {certDSConf} from '@/pages/Supplier/stores/certDS';

interface DetailProps {
  history: any;
  match: {
    params: {
      actionHeaderId: string;
    };
  };
}

function Detail(props: DetailProps) {
  const {history, match} = props;
  const {
    params: {actionHeaderId},
  } = match;

  // 是否为创建
  const isCreate: boolean = actionHeaderId === 'create';

  // 定义ds
  const [detailDS, contactDS, bankDS, certDS] = useMemo(() => {
    const _detailDS = new DataSet(detailDSConf());
    const _contactDS = new DataSet(contactDSConf());
    const _bankDS = new DataSet(bankDSConf());
    const _certDS = new DataSet(certDSConf());

    if (!isCreate) {
      _detailDS.setState('actionHeaderId', actionHeaderId);
      _detailDS.query();
    }

    return [_detailDS, _contactDS, _bankDS, _certDS];
  }, [actionHeaderId]);

  const contactColumns: Array<ColumnProps> = useMemo(() => [
    {name: 'name', editor: true},
    {name: 'phone', editor: true},
    {name: 'email', editor: true},
    {name: 'type', editor: true,},
    {name: 'isMain', editor: true},
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      renderer: ({record}: RenderProps) => {
        if (record == null) return;
        return (
          <a onClick={() => contactDS?.delete(record)}>
            {intl.get('hzero.common.button.delete').d('删除')}
          </a>
        );
      },
    },
  ], []);

  const bankColumns: Array<ColumnProps> = useMemo(() => [
    {name: 'sortCode', editor: true},
    {name: 'swiftCode', editor: true},
    {name: 'name', editor: true},
    {name: 'country', editor: true},
    {name: 'account', editor: true},
    {name: 'host', editor: true},
    {name: 'type', editor: true},
    {name: 'address', editor: true},
    {name: 'isTicket', editor: true},
    {name: 'attachment', editor: true},
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      renderer: ({record}: RenderProps) => {
        if (record == null) return;
        return (
          <a onClick={() => contactDS?.delete(record)}>
            {intl.get('hzero.common.button.delete').d('删除')}
          </a>
        );
      },
    },
  ], []);

  const certColumns: Array<ColumnProps> = useMemo(() => [
    {name: 'type', editor: true},
    {name: 'name', editor: true},
    {name: 'number', editor: true},
    {name: 'effectiveDate', editor: true},
    {name: 'expiryDate', editor: true},
    {name: 'remark', editor: true},
    {name: 'attachment', editor: true},
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      renderer: ({record}: RenderProps) => {
        if (record == null) return;
        return (
          <a onClick={() => contactDS?.delete(record)}>
            {intl.get('hzero.common.button.delete').d('删除')}
          </a>
        );
      },
    },
  ], []);

  const save = async () => {
    const base = await detailDS.validate();
    const contact = await contactDS.validate();
    const bank = await bankDS.validate();
    if (base && contact && bank) {
      contactDS.toJSONData();
      bankDS.toJSONData();
      await detailDS.submit();
    }
  };

  return (
    <>
      <Header
        title={intl.get('srm.supplier.detail.title').d('供应商')}
        backPath="/pts/action-item/list"
        isChange={detailDS.dirty}
      >
        <Button icon="save" onClick={save} color={ButtonColor.primary}>
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
      </Header>
      <ListContent>
        <ListItem>
          <ContentCard title="基础信息">
            <Tabs
              className={[
                styles['pts-meeting-board-tabs'],
                styles['meeting-page-mg'],
              ].join(' ')}
            >
              <Tabs.TabPane tab="base" title="基础信息">
                <Form dataSet={detailDS} columns={4}>
                  <Lov name="field" tableProps={{queryFieldsLimit: 5}}/>
                  <TextField name="field1"/>
                  <TextField name="field2"/>
                  <div></div>
                  <TextField name="field3"/>
                  <Lov name="field4" tableProps={{queryFieldsLimit: 5}}/>
                  <Lov name="field5" tableProps={{queryFieldsLimit: 5}}/>
                  <Select name="field6"/>
                  <Select name="field7"/>
                  <Select name="field8"/>
                  <TextField name="field9"/>
                  <TextField name="field10"/>
                  <NumberField name="field11"/>
                  <NumberField name="field12"/>
                  <DatePicker name="field13"/>
                  <DatePicker name="field14"/>
                  <TextField name="field15"/>
                  <Select name="field16"/>
                  <TextField name="field17"/>
                  <TextField name="field18"/>
                  <Select name="field19"/>
                  <TextField name="field20"/>
                  <TextField name="field21"/>
                  <TextField name="field22"/>
                  <TextField name="field23"/>
                  <TextArea name="field24" colSpan={3}/>
                  <Select name="field25"/>
                </Form>
              </Tabs.TabPane>

              <Tabs.TabPane tab="contact" title="联系人">
                <Table columns={contactColumns} dataSet={contactDS} buttons={[TableButtonType.add]}/>
              </Tabs.TabPane>

              <Tabs.TabPane tab="bank" title="银行信息">
                <Table columns={bankColumns} dataSet={bankDS} buttons={[TableButtonType.add]}/>
              </Tabs.TabPane>

              <Tabs.TabPane tab="cert" title="证书资质信息">
                <Table columns={certColumns} dataSet={certDS}/>
              </Tabs.TabPane>

            </Tabs>
          </ContentCard>

          <ContentCard title="列信息">
            <div style={{height: '300px'}}></div>
          </ContentCard>

          <div style={{height: '300px'}}></div>
        </ListItem>

        {/*<div ref={containerRef}></div>

        {
          containerRef.current ? (
            <Anchor
              affix={true}
              showInkInFixed={true}
              getContainer={() => containerRef.current?.closest('.page-content')}
            >
              <Anchor.Link href="#yellow" title="yellow" />
              <Anchor.Link href="#red" title="red" />
              <Anchor.Link href="#blue" title="blue" />
            </Anchor>
          ): (<div>123123</div>)
        }

        <Title
          id="yellow"
          title={intl
            .get('pts.actionItem.view.message.detail.basicInfo')
            .d('基本信息')}
        />

        <Title
          id="red"
          top={16}
          title={intl
            .get('pts.actionItem.view.message.detail.stageInfo')
            .d('里程碑明细')}
        />
        <div style={{ height: '500px' }}></div>

        <Title
          id="blue"
          top={16}
          title={intl
            .get('pts.actionItem.view.message.detail.stageInfo')
            .d('123123')}
        />
        */}
      </ListContent>
    </>
  );
}

export default compose(
  formatterCollections({
    code: [
      'pts.actionItem',
      'pts.operationHistory',
      'pts.common',
      'pts.common',
    ],
  }),
  observer,
)(Detail);
