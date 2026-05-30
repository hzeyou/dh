import React from 'react';
import { DataSet, Tabs } from 'choerodon-ui/pro';
import { ContentCard } from 'components/Page';
import CertInfo from '@/components/CertInfo';
import styles from '@/pages/Supplier/index.less';
import BankInfo from '../BankInfo';
import ContactInfo from '../ContactInfo';
import SupplierBaseInfo from '../SupplierBaseInfo';

interface BusinessInfoProps {
  detailDS: DataSet;
  contactDS: DataSet;
  bankDS: DataSet;
  certDS: DataSet;
  editable: boolean;
}

export default function Index({
  detailDS,
  contactDS,
  bankDS,
  certDS,
  editable,
}: BusinessInfoProps) {
  return (
    <ContentCard title="基础信息">
      <Tabs
        className={[
          styles['pts-meeting-board-tabs'],
          styles['meeting-page-mg'],
        ].join(' ')}
      >
        <Tabs.TabPane tab="base" title="基础信息">
          <SupplierBaseInfo ds={detailDS} editable={editable} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="contact" title="联系人" forceRender>
          <ContactInfo ds={contactDS} editable={editable} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="bank" title="银行信息" forceRender>
          <BankInfo ds={bankDS} editable={editable} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="cert" title="证书资质信息" forceRender>
          <CertInfo ds={certDS} headColumns={[]} editable={editable} />
        </Tabs.TabPane>
      </Tabs>
    </ContentCard>
  );
}
