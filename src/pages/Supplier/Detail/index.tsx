import React, { useMemo } from 'react';
import { Button, DataSet } from 'choerodon-ui/pro';
import { observer } from 'mobx-react';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';

import { intl } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';

import { Header, ListContent, ListItem } from 'components/Page';

import { compose } from '@/utils/util';

import { detailDSConf } from '@/pages/Supplier/stores/detailDS';
import { contactDSConf } from '@/pages/Supplier/stores/contactDS';
import { bankDSConf } from '@/pages/Supplier/stores/bankDS';
import { certDSConf } from '@/stores/certDS';
import CompanyInfo from '@/pages/Supplier/components/CompanyInfo';
import LifeCycleChangeLog from '@/pages/Supplier/components/LifeCycleChangeLog';
import BusinessInfo from '@/pages/Supplier/components/BusinessInfo';
import { lifeCycleChangeLogDSConf } from '@/pages/Supplier/stores/lifeCycleChangeLogDS';

interface DetailProps {
  match: {
    params: {
      id: string;
      type: string;
    };
  };
}

function Detail(props: DetailProps) {
  const { match } = props;
  const {
    params: { type, id },
  } = match;

  // 是否为创建
  const isCreate: boolean = type === 'create';
  const isUpdate: boolean = type === 'update';
  const editable: boolean = isCreate || isUpdate;

  // 定义ds
  const [detailDS, contactDS, bankDS, certDS, lifeCycleChangeLog] = useMemo(() => {
    const _contactDS = new DataSet(contactDSConf());
    const _bankDS = new DataSet(bankDSConf());
    const _certDS = new DataSet(certDSConf());
    const _lifeCycleChangeLogDS = new DataSet(lifeCycleChangeLogDSConf());

    const _detailDS = new DataSet(detailDSConf());

    _detailDS.setState('contactDS', _contactDS);
    _detailDS.setState('bankDS', _bankDS);
    _detailDS.setState('certDS', _certDS);

    if (id) {
      _detailDS.setState('supplierId', id);
      _detailDS.query();
    }

    return [_detailDS, _contactDS, _bankDS, _certDS, _lifeCycleChangeLogDS];
  }, [id]);

  const save = async () => {
    const base = await detailDS.validate();
    const contact = await contactDS.validate();
    const bank = await bankDS.validate();
    const cert = await certDS.validate();
    if (base && contact && bank && cert) {
      detailDS.current?.set('contactInfo', JSON.stringify(contactDS.toData()));
      detailDS.current?.set('bankInfo', JSON.stringify(bankDS.toData()));
      detailDS.current?.set('certificateInfo', JSON.stringify(certDS.toData()));
      await detailDS.submit();
    }
  };

  return (
    <>
      <Header
        title={intl.get('srm.supplier.detail.title').d('供应商详情')}
        backPath="/srm/supplier/list"
        isChange={editable && detailDS.dirty}
      >
        {editable && (
          <Button icon="save" onClick={save} color={ButtonColor.primary}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        )}
      </Header>
      <ListContent>
        <ListItem>
          {!isCreate ? (
            <>
              <CompanyInfo ds={detailDS} />

              <LifeCycleChangeLog ds={lifeCycleChangeLog} />
            </>
          ) : null}

          <BusinessInfo
            detailDS={detailDS}
            certDS={certDS}
            contactDS={contactDS}
            bankDS={bankDS}
            editable={editable}
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
