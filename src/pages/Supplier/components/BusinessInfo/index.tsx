import React from 'react';
import { DatePicker, Form, Lov, NumberField, Output, Select, Table, Tabs, TextArea, TextField } from 'choerodon-ui/pro';
import { ContentCard } from 'components/Page';
import styles from '@/pages/Supplier/index.less';
import { LabelLayout } from 'choerodon-ui/pro/lib/form/enum';
import { TableButtonType } from 'choerodon-ui/pro/lib/table/enum';
import ContactInfo from '../ContactInfo';
import CertInfo from '../CertInfo';
import BankInfo from '../BankInfo';
import SupplierBaseInfo from '../SupplierBaseInfo';

export default function Index({detailDS, contactDS, bankDS, certDS, isCreate}) {

  return (
    <ContentCard title="基础信息">
      <Tabs
        className={[
          styles['pts-meeting-board-tabs'],
          styles['meeting-page-mg'],
        ].join(' ')}
      >
        <Tabs.TabPane tab="base" title="基础信息">
          <SupplierBaseInfo ds={detailDS} isCreate={isCreate}/>
        </Tabs.TabPane>

        <Tabs.TabPane tab="contact" title="联系人" forceRender>
          <ContactInfo ds={contactDS}/>
        </Tabs.TabPane>

        <Tabs.TabPane tab="bank" title="银行信息" forceRender>
          <BankInfo ds={bankDS}/>
        </Tabs.TabPane>

        <Tabs.TabPane tab="cert" title="证书资质信息" forceRender>
          <CertInfo ds={certDS}/>
        </Tabs.TabPane>
      </Tabs>
    </ContentCard>
  );

}

