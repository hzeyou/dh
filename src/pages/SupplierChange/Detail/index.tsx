import React, { useEffect, useMemo, useRef } from 'react';
import { Button, DataSet } from 'choerodon-ui/pro';
import { observer } from 'mobx-react';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';

import { getCurrentUserId, intl } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';

import {
  Header,
  Content,
  ListContent,
  ListItem,
  ContentCard,
} from 'components/Page';

import { compose } from '@/utils/util';

import { detailDSConf } from '@/pages/Supplier/stores/detailDS';
import { contactDSConf } from '@/pages/Supplier/stores/contactDS';
import { bankDSConf } from '@/pages/Supplier/stores/bankDS';
import { certDSConf } from '@/pages/Supplier/stores/certDS';
import CompanyInfo from '@/pages/Supplier/components/CompanyInfo';
import LifeCycleChangeLog from '@/pages/Supplier/components/LifeCycleChangeLog';
import BusinessInfo from '@/pages/Supplier/components/BusinessInfo';

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
          { !isCreate ? (
            <>
              <CompanyInfo ds={detailDS} />

              <LifeCycleChangeLog ds={detailDS} />
            </>
          ) : null}

          <BusinessInfo
            detailDS={detailDS}
            certDS={certDS}
            contactDS={contactDS}
            bankDS={bankDS}
            isCreate={isCreate}
          />

        </ListItem>
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
