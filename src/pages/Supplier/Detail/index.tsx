import React, { useEffect, useMemo, useRef } from 'react';
import {
  Button,
  DataSet,
  DatePicker,
  Form,
  Lov,
  Modal,
  NumberField,
  Output,
  Select,
  Table,
  Tabs,
  TextArea,
  TextField,
} from 'choerodon-ui/pro';
import { observer } from 'mobx-react';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import {
  SelectionMode,
  TableButtonType,
} from 'choerodon-ui/pro/lib/table/enum';
import { Buttons } from 'choerodon-ui/pro/lib/table/Table';
import { Record } from 'choerodon-ui/dataset';
import { RecordStatus } from 'choerodon-ui/dataset/data-set/enum';
import { isNil } from 'lodash';

import { getCurrentUserId, intl } from 'utils/utils';
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
import { compose } from '@/utils/util';
import { RenderProps } from 'choerodon-ui/pro/lib/field/FormField';
import { Tag } from 'choerodon-ui';
import styles from '../index.less';
import { Anchor } from 'hzero-ui';
import { detailDSConf } from '@/pages/Supplier/stores/detailDS';
import { contactDSConf } from '@/pages/Supplier/stores/contactDS';
import { bankDSConf } from '@/pages/Supplier/stores/bankDS';
import { certDSConf } from '@/pages/Supplier/stores/certDS';
import { LabelLayout } from 'choerodon-ui/pro/lib/form/enum';

interface DetailProps {
  history: any;
  match: {
    params: {
      id: string;
    };
  };
}

function Detail(props: DetailProps) {
  const { history, match } = props;
  const {
    params: { id },
  } = match;

  console.log('actionHeaderId==', id);

  // 是否为创建
  const isCreate: boolean = id === 'create';

  // 定义ds
  const [detailDS, contactDS, bankDS, certDS] = useMemo(() => {
    const _detailDS = new DataSet(detailDSConf());
    const _contactDS = new DataSet(contactDSConf());
    const _bankDS = new DataSet(bankDSConf());
    const _certDS = new DataSet(certDSConf());

    if (!isCreate) {
      _detailDS.setQueryParameter('id', id);
      _detailDS.query();
    }

    return [_detailDS, _contactDS, _bankDS, _certDS];
  }, [id]);

  const contactColumns: Array<ColumnProps> = useMemo(
    () => [
      { name: 'name', editor: true },
      { name: 'phone', editor: true },
      { name: 'email', editor: true },
      { name: 'type', editor: true },
      { name: 'isMain', editor: true },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        renderer: ({ record }: RenderProps) => {
          if (record == null) return;
          return (
            <a onClick={() => contactDS?.delete(record)}>
              {intl.get('hzero.common.button.delete').d('删除')}
            </a>
          );
        },
      },
    ],
    [],
  );

  const bankColumns: Array<ColumnProps> = useMemo(
    () => [
      { name: 'sortCode', editor: true },
      { name: 'swiftCode', editor: true },
      { name: 'name', editor: true },
      { name: 'country', editor: true },
      { name: 'account', editor: true },
      { name: 'host', editor: true },
      { name: 'type', editor: true },
      { name: 'address', editor: true },
      { name: 'isTicket', editor: true },
      { name: 'attachment', editor: true },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        renderer: ({ record }: RenderProps) => {
          if (record == null) return;
          return (
            <a onClick={() => contactDS?.delete(record)}>
              {intl.get('hzero.common.button.delete').d('删除')}
            </a>
          );
        },
      },
    ],
    [],
  );

  const certColumns: Array<ColumnProps> = useMemo(
    () => [
      { name: 'type', editor: true },
      { name: 'name', editor: true },
      { name: 'number', editor: true },
      { name: 'effectiveDate', editor: true },
      { name: 'expiryDate', editor: true },
      { name: 'remark', editor: true },
      { name: 'attachment', editor: true },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        renderer: ({ record }: RenderProps) => {
          if (record == null) return;
          return (
            <a onClick={() => contactDS?.delete(record)}>
              {intl.get('hzero.common.button.delete').d('删除')}
            </a>
          );
        },
      },
    ],
    [],
  );

  const save = async () => {
    const base = await detailDS.validate();
    const contact = await contactDS.validate();
    const bank = await bankDS.validate();
    const cert = await certDS.validate();
    console.log(base, contact, bank, cert);
    if (base && contact && bank && cert) {
      console.log('contact==', contactDS.toJSONData(), contactDS.toData());
      detailDS.current?.set('contactInfo', JSON.stringify(contactDS.toData()));
      detailDS.current?.set('certificateInfo', JSON.stringify(certDS.toData()));
      const res = await detailDS.submit();
      console.log('res==', res);
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
                <Form
                  dataSet={detailDS}
                  columns={4}
                  labelLayout={LabelLayout.vertical}
                >
                  <Lov
                    name="supplierTypeId"
                    tableProps={{ queryFieldsLimit: 5 }}
                  />
                  <TextField name="supplierName" />
                  <TextField name="creditCode" />
                  <div></div>
                  <TextField name="shortName" />
                  <Lov name="level" tableProps={{ queryFieldsLimit: 5 }} />
                  <Lov
                    name="purchaserId"
                    tableProps={{ queryFieldsLimit: 5 }}
                  />
                  <Select name="currency" />
                  <Select name="country" />
                  <TextField name="region" />
                  <TextField name="detailAddress" />
                  <TextField name="returnAddress" />
                  <NumberField name="registeredCapital" />
                  <NumberField name="paidInCapital" />
                  <DatePicker name="establishmentDate" />
                  <DatePicker name="businessTerm" />
                  <TextField name="legalRepresentative" />
                  <Select name="electronicSignatureFlag" />
                  <TextField name="domesticSourceOrigin" />
                  <TextField name="overseasSourceOrigin" />
                  <Select name="securityCodeFlag" />
                  <TextField name="invoiceName" />
                  <TextField name="invoicePhone" />
                  <TextField name="invoiceAddress" />
                  <Select name="overseasFlag" />
                  <TextField name="taxRate" />
                  <Select name="accountCreatedFlag" />
                  <div></div>
                  <TextField name="businessScope" />
                  <TextArea name="companyProfile" colSpan={3} />
                  <NumberField name="annualCapacityQuantity" />
                  <NumberField name="annualCapacityAmount" />
                  <NumberField name="monthlyCapacityQuantity" />
                  <NumberField name="monthlyCapacityAmount" />
                  <NumberField name="lastYearTurnover" />
                  <NumberField name="twoYearsAgoTurnover" />
                  <NumberField name="threeYearsAgoTurnover" />
                  <NumberField name="employeeCount" />
                </Form>
              </Tabs.TabPane>

              <Tabs.TabPane tab="contact" title="联系人" forceRender>
                <Table
                  columns={contactColumns}
                  dataSet={contactDS}
                  buttons={[TableButtonType.add]}
                />
              </Tabs.TabPane>

              <Tabs.TabPane tab="bank" title="银行信息" forceRender>
                <Table
                  columns={bankColumns}
                  dataSet={bankDS}
                  buttons={[TableButtonType.add]}
                />
              </Tabs.TabPane>

              <Tabs.TabPane tab="cert" title="证书资质信息" forceRender>
                <Table
                  columns={certColumns}
                  dataSet={certDS}
                  buttons={[TableButtonType.add]}
                />
              </Tabs.TabPane>
            </Tabs>
          </ContentCard>
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
