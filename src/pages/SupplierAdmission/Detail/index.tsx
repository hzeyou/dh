import React, { useEffect, useMemo, useRef } from 'react';
import { Button, DataSet } from 'choerodon-ui/pro';
import { observer } from 'mobx-react';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';

import { getCurrentUserId, intl, getCurrentTenant, getCurrentUser } from 'utils/utils';
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
import { supplyScopeDSConf } from '@/pages/SupplierAdmission/stores/supplyScopeDS';
import { certDSConf } from '@/stores/certDS';
import SupplyScopeList from '@/pages/SupplierAdmission/components/SupplyScopeList';
import PhaseChange from '@/pages/SupplierAdmission/components/PhaseChange';
import CompanyInfo from '@/pages/SupplierAdmission/components/CompanyInfo';
import SiteInspection from '@/pages/SupplierAdmission/components/SiteInspection';
import AgreementManagement from '@/pages/SupplierAdmission/components/AgreementManagement';
import CertInfo from '@/components/CertInfo';

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

  console.log('getCurrentTenant==', getCurrentTenant());
  console.log('getCurrentUser==', getCurrentUser());

  // 是否为创建
  const isCreate: boolean = id === 'create';
  const isUpdate: boolean = id === 'update';

  // 定义ds
  const [detailDS, supplyScopeDS, companyInfoDS, certDS, siteInspectionDS, agreementManagementDS] = useMemo(() => {

    const _detailDS = new DataSet(detailDSConf());

    const _supplyScopeDS = new DataSet(supplyScopeDSConf());
    const _companyInfoDS = new DataSet(companyInfoDSConf());
    const _certDS = new DataSet(certDSConf());
    const _siteInspectionDS = new DataSet(siteInspectionDSConf());
    const _agreementManagementDS = new DataSet(agreementManagementDSConf());

    if (!isCreate) {
      _detailDS.setQueryParameter('id', id);
      _detailDS.query();
    }

    return [_detailDS, _supplyScopeDS, _companyInfoDS, _certDS, _siteInspectionDS, _agreementManagementDS];
  }, [id]);

  const save = async () => {
    const base = await detailDS.validate();
    if (base) {
      const res = await detailDS.submit();
      console.log('res==', res);
    }
  };

  const isSupplier = detailDS?.current?.get('type') === '1';
  const isCategory = detailDS?.current?.get('type') === '2';

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
        {
          isUpdate ? (
            <Button icon="save" onClick={save} color={ButtonColor.primary}>
              {intl.get('hzero.common.button.save').d('提交')}
            </Button>
          ) : null
        }
      </Header>
      <ListContent>
        <ListItem>

          <PhaseChange
            ds={detailDS}
            isCreate={isCreate}
            isUpdate={isUpdate}
          />

          <SupplyScopeList
            ds={supplyScopeDS}
            isCreate={isCreate}
          />

          {
            isSupplier ? (
              <>
                <CompanyInfo
                  ds={companyInfoDS}
                  isCreate={isCreate}
                />
                <ContentCard title="证书资质信息">
                  <CertInfo ds={certDS} headColumns={[{ name: 'admissionRequirement', editor: true },]}/>
                </ContentCard>
              </>
            ) : null
          }


          <SiteInspection
            ds={siteInspectionDS}
            isCreate={isCreate}
          />

          {
            isSupplier ? (
              <AgreementManagement
                ds={agreementManagementDS}
                isCreate={isCreate}
              />
            ) : null
          }


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
