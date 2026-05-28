import { AxiosRequestConfig } from 'axios';
import DataSet, { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import {
  DataToJSON,
  FieldIgnore,
  FieldType,
} from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';
import { HG_SRM_API_PREFIX } from '@/utils/config';

const intlPrefix = 'srm.supplier.model.supplier';

import { detailDSConf as supplierDetailDSConf } from '@/pages/Supplier/stores/detailDS';
import { detailDSConf as supplierTypeDetailDSConf } from '@/pages/SupplierType/stores/detailDS';

export const detailDSConf = (): DataSetProps => {
  const _sDetailDS = new DataSet(supplierDetailDSConf());
  const _stDetailDS = new DataSet(supplierTypeDetailDSConf());

  return {
    autoCreate: true,
    primaryKey: 'id',
    idField: 'id',
    dataToJSON: DataToJSON.normal,
    fields: [
      {
        name: 'id',
        type: FieldType.number,
      },
      {
        name: 'assessmentCode',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.supplierCode`).d('准入及品类扩充单号'),
      },
      {
        name: 'supplierCodeLov',
        type: FieldType.object,
        label: intl.get(`${intlPrefix}.supplierCode`).d('供应商编码'),
        lovCode: 'SCM.SUPPLIER',
        textField: 'supplierShortName',
        valueField: 'supplierCode',
        ignore: FieldIgnore.always,
        required: true,
      },
      {
        name: 'supplierCode',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.supplierCode`).d('供应商编码'),
        bind: 'supplierCodeLov.supplierCode',
      },
      {
        name: 'supplierName',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.supplierName`).d('供应商名称'),
        bind: 'supplierCodeLov.supplierName',
      },
      {
        name: 'supplierTypeId',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.supplierTypeId`).d('供应商类型'),
        bind: 'supplierCodeLov.supplierType',
      },
      {
        name: 'status',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.vendorStatus`).d('当前生命周期阶段'),
        bind: 'supplierCodeLov.status',
      },
      {
        name: 'type',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.type`).d('单据类型'),
        lookupCode: 'SRM.SUPPLIERS_ADMISSIONS_TYPE',
        required: true,
      },
      {
        name: 'developmentPurpose',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.developmentPurpose`).d('开发供应商目的'),
      },
      {
        name: 'supplierProfile',
        type: FieldType.string,
        label: intl
          .get(`${intlPrefix}.supplierProfile`)
          .d('供应商基本情况描述'),
      },
      {
        name: 'factoryAuditBackground',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.factoryAuditBackground`).d('审厂背景'),
      },
      {
        name: 'remark',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.remark`).d('备注'),
      },
      {
        name: 'meetingMinutes',
        type: FieldType.attachment,
        label: intl.get(`${intlPrefix}.meetingMinutes`).d('供应商评审会议纪要'),
      },
      {
        name: 'attachment',
        type: FieldType.attachment,
        label: intl.get(`${intlPrefix}.attachment`).d('附件'),
      },

      {
        name: 'inspectionInfo',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.inspectionInfo`).d('现场审核信息'),
      },

      {
        name: 'agreementInfo',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.agreementInfo`).d('协议管理信息'),
      },

      {
        name: 'subsidiaryInfo',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.subsidiaryInfo`).d('子公司信息'),
      },

      {
        name: 'certificateInfo',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.certificateInfo`).d('子公司信息'),
      },
    ],
    data: [],
    transport: {
      read: ({ dataSet }): AxiosRequestConfig => {
        const id = dataSet?.getState('id');
        return {
          url: `${HG_SRM_API_PREFIX}/supplier-assessments/${id}`,
          method: 'get',
        };
      },
      submit: ({ dataSet, data }): AxiosRequestConfig => {
        return {
          url: `${HG_SRM_API_PREFIX}/supplier-assessments/save`,
          method: 'post',
          data: data[0],
        };
      },
    },
    events: {
      update: async ({ dataSet, record, name, value }) => {
        if (name === 'supplierCodeLov') {
          _sDetailDS.setState('supplierId', '18');
          _stDetailDS.setState('supplierId', '1');
          await Promise.all([
            _sDetailDS.query(undefined),
            _stDetailDS.query(undefined),
          ]);

          const list: any[] = _sDetailDS.toData();
          const certList = JSON.parse(list[0]?.certificateInfo) || [];

          const typeDetail: any = _stDetailDS.toData()[0];

          const set = new Set(typeDetail.requiredCertificateType.split(','));

          const flag = certList.some((cert: any) =>
            set.has(cert.type.toString()),
          );

          if (!flag) {
            certList.push({ type: typeDetail.sapCode });
          }

          console.log('certList==', certList);

          const _certDS: DataSet = dataSet.getState('certDS');
          _certDS.loadData(certList);
        }
      },
      load: async ({ dataSet }) => {
        console.log('load', dataSet.toData());
        //
        const _certDS: DataSet = dataSet.getState('certDS');
        const _supplyScopeDS: DataSet = dataSet.getState('supplyScopeDS');
        const _companyInfoDS: DataSet = dataSet.getState('companyInfoDS');
        const _siteInspectionDS: DataSet = dataSet.getState('siteInspectionDS');
        const _agreementManagementDS: DataSet = dataSet.getState(
          'agreementManagementDS',
        );

        _certDS.loadData(
          JSON.parse(
            '[{"type":1,"name":"证书名称","number":"证书号","effectiveDate":"2026-06-01","expiryDate":"2027-06-01","remark":"备注","status":1,"attachment":"wwww.cc.com","deleteFlag":0}]',
          ),
        );

        _companyInfoDS.loadData(
          JSON.parse('[{"subsidiaryId":"1","paymentTerms":"1"}]'),
        );

        _supplyScopeDS.loadData([
          {
            categoryId: '1',
            categoryName: '测试品类1',
            status: 1,
            categoryLevel: 1,
          },
          {
            categoryId: '2',
            categoryName: '测试品类2',
            status: 1,
            categoryLevel: 1,
          },
        ]);

        _siteInspectionDS.loadData(
          JSON.parse(
            '[{"reviewId":1,"categoryCode":"CAT001","categoryName":"品类名称","auditFormNo":"AUDIT001","auditDate":"2026-05-26","passingScore":80,"totalScore":90,"auditResult":1,"remark":"备注1111","admissionRequirement":"0","deleteFlag":0}]',
          ),
        );

        _agreementManagementDS.loadData(
          JSON.parse(
            '[{"agreementNo":"xy001","agreementName":"协议名称","remark":"备注1备注2备注3","admissionRequirement":"0","deleteFlag":"0"}]',
          ),
        );
      },
    },
  };
};
