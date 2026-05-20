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

import { detailDSConf } from '@/pages/SupplierAdmission/stores/detailDS';
import { agreementManagementDSConf } from '@/pages/SupplierAdmission/stores/agreementManagementDS';
import { companyInfoDSConf } from '@/pages/SupplierAdmission/stores/companyInfoDS';
import { siteInspectionDSConf } from '@/pages/SupplierAdmission/stores/siteInspectionDS';
import { supplyScopeDSConf } from '@/pages/SupplierBusinessChange/stores/supplyScopeDS';
import SupplyScopeList from '@/pages/SupplierBusinessChange/components/SupplyScopeList';
import PhaseChange from '@/pages/SupplierAdmission/components/PhaseChange';
import CompanyInfo from '@/pages/SupplierAdmission/components/CompanyInfo';
import SiteInspection from '@/pages/SupplierAdmission/components/SiteInspection';
import AgreementManagement from '@/pages/SupplierAdmission/components/AgreementManagement';

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
  const [detailDS, companyInfoDS, siteInspectionDS, agreementManagementDS] = useMemo(() => {

    const _detailDS = new DataSet(detailDSConf());

    const _companyInfoDS = new DataSet(companyInfoDSConf());
    const _siteInspectionDS = new DataSet(siteInspectionDSConf());
    const _agreementManagementDS = new DataSet(agreementManagementDSConf());

    if (!isCreate) {
      _detailDS.setQueryParameter('id', id);
      _detailDS.query();
    }

    return [_detailDS, _companyInfoDS, _siteInspectionDS, _agreementManagementDS];
  }, [id]);

  const save = async () => {
    const base = await detailDS.validate();
    if (base) {
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

          <PhaseChange
            ds={detailDS}
            isCreate={isCreate}
          />

          <SupplyScopeList
            ds={detailDS}
            isCreate={isCreate}
          />

          <CompanyInfo
            ds={companyInfoDS}
            isCreate={isCreate}
          />

          <SiteInspection
            ds={siteInspectionDS}
            isCreate={isCreate}
          />

          <AgreementManagement
            ds={agreementManagementDS}
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
