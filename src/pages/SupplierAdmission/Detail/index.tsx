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
      type: string;
      id: string;
    };
  };
}

function Detail(props: DetailProps) {
  const { history, match } = props;
  const {
    params: { type, id },
  } = match;

  // 是否为创建
  const isCreate: boolean = type === 'create';
  const isUpdate: boolean = type === 'update';
  const isView: boolean = type === 'view';

  console.log('id==', id);

  // 定义ds
  const [detailDS, supplyScopeDS, companyInfoDS, certDS, siteInspectionDS, agreementManagementDS] = useMemo(() => {

    const _detailDS = new DataSet(detailDSConf());

    const _supplyScopeDS = new DataSet(supplyScopeDSConf());
    const _companyInfoDS = new DataSet(companyInfoDSConf());
    const _certDS = new DataSet(certDSConf());
    const _siteInspectionDS = new DataSet(siteInspectionDSConf());
    const _agreementManagementDS = new DataSet(agreementManagementDSConf());

    _detailDS.setState('supplyScopeDS', _supplyScopeDS);
    _detailDS.setState('companyInfoDS', _companyInfoDS);
    _detailDS.setState('certDS', _certDS);
    _detailDS.setState('siteInspectionDS', _siteInspectionDS);
    _detailDS.setState('agreementManagementDS', _agreementManagementDS);

    if (isUpdate || isView) {
      _detailDS.setState('id', id);
      _detailDS.query();
    }

    return [_detailDS, _supplyScopeDS, _companyInfoDS, _certDS, _siteInspectionDS, _agreementManagementDS];
  }, [id]);

  const save = async () => {
    const base = await detailDS.validate();
    const supplyScope = await supplyScopeDS.validate();
    const siteInspection: boolean = await siteInspectionDS.validate();
    let companyInfo = true;
    let cert = true;
    let agreementManagement = true;
    if (detailDS?.current?.get('type') === '1') {
      companyInfo = await companyInfoDS.validate();
      cert = await certDS.validate();
      agreementManagement = await agreementManagementDS.validate();
    }

    console.log('companyInfo==', base, supplyScope, companyInfo, cert, siteInspection, agreementManagement);

    if (base && supplyScope && companyInfo && cert && siteInspection && agreementManagement) {
      detailDS.current?.set('categoryInfo', JSON.stringify(supplyScopeDS.toData()));
      detailDS.current?.set('inspectionInfo', JSON.stringify(siteInspectionDS.toData()));
      if (detailDS?.current?.get('type') === '1') {
        detailDS.current?.set('certificateInfo', JSON.stringify(certDS.toData()));
        detailDS.current?.set('subsidiaryInfo', JSON.stringify(companyInfoDS.toData()));
        detailDS.current?.set('agreementInfo', JSON.stringify(agreementManagementDS.toData()));
      }
      const res = await detailDS.submit();
      console.log('res==', res);
    }
  };

  const isSupplier = detailDS?.current?.get('type') === '1';
  const isCategory = detailDS?.current?.get('type') === '2';

  return (
    <>
      <Header
        title={intl.get('srm.supplier.detail.title').d('准入及品类扩充')}
        backPath="/srm/supplier-admission/list"
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
            isView={isView}
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
            detailDS={detailDS}
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
