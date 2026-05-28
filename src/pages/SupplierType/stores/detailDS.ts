import { AxiosRequestConfig } from 'axios';
import DataSet, { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import { HG_SRM_API_PREFIX } from '@/utils/config';
import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';
const admissionRulePrefix = `${intlPrefix}.admissionRule`;
const checkedValue = 1;
const uncheckedValue = 0;

export const detailDSConf = (): DataSetProps => ({
  autoCreate: true,
  primaryKey: 'typeId',
  idField: 'typeId',
  fields: [
    {
      name: 'typeId',
      type: FieldType.number,
    },
    {
      name: 'sapCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.sap_code`).d('类型编码'),
      required: true,
    },
    {
      name: 'typeName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.type_name`).d('类型名称'),
      required: true,
    },
    {
      name: 'status',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.status`).d('状态'),
      lookupCode: 'SRM.SUPPLIER_TYPE_STATUS',
      defaultValue: 0,
      required: true,
    },
    {
      name: 'registrationReview',
      type: FieldType.boolean,
      label: intl.get(`${intlPrefix}.registration_review`).d('注册审核'),
      trueValue: checkedValue,
      falseValue: uncheckedValue,
      defaultValue: uncheckedValue,
    },
    {
      name: 'registrationReviewType',
      type: FieldType.string,
      label: intl
        .get(`${admissionRulePrefix}.registration_review_type`)
        .d('审核角色'),
      lookupCode: 'SRM.SUPPLIER_TYPE_ROLE',
      dynamicProps: {
        disabled: ({ record }) =>
          record?.get('registrationReview') !== checkedValue,
        required: ({ record }) =>
          record?.get('registrationReview') === checkedValue,
      },
    },
    {
      name: 'certificate',
      type: FieldType.boolean,
      label: intl.get(`${intlPrefix}.certificate`).d('资质证书'),
      trueValue: checkedValue,
      falseValue: uncheckedValue,
      defaultValue: uncheckedValue,
    },
    {
      name: 'requiredCertificateType',
      type: FieldType.string,
      label: intl
        .get(`${admissionRulePrefix}.required_certificate_type`)
        .d('资质证书类型'),
      lookupCode: 'SRM.CERTIFICATE',
      textField: 'meaning',
      multiple: ',',
      dynamicProps: {
        disabled: ({ record }) => record?.get('certificate') !== checkedValue,
        required: ({ record }) => record?.get('certificate') === checkedValue,
      },
    },
    {
      name: 'agreement',
      type: FieldType.boolean,
      label: intl.get(`${intlPrefix}.agreement`).d('协议管理'),
      trueValue: checkedValue,
      falseValue: uncheckedValue,
      defaultValue: uncheckedValue,
    },
    {
      name: 'onsiteAudit',
      type: FieldType.boolean,
      label: intl.get(`${intlPrefix}.onsite_audit`).d('现场审核'),
      trueValue: checkedValue,
      falseValue: uncheckedValue,
      defaultValue: uncheckedValue,
    },
  ],
  transport: {
    read: ({ dataSet }): AxiosRequestConfig => {
      const supplierId = dataSet?.getState('supplierId');
      return {
        url: `${HG_SRM_API_PREFIX}/supplier-types/${supplierId}`,
        method: 'get',
      };
    },
    submit: ({ DataSet, data }): AxiosRequestConfig => {
      return {
        url: `${HG_SRM_API_PREFIX}/supplier-types/save`,
        method: 'post',
        data: data[0],
      };
    },
  },
  events: {
    update: ({ record, name, value }) => {
      if (name === 'registrationReview' && value !== checkedValue) {
        record.set('registrationReviewType', undefined);
      }
      if (name === 'certificate' && value !== checkedValue) {
        record.set('requiredCertificateType', undefined);
      }
    },
  },
});
