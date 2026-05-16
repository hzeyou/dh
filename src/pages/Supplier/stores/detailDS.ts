import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { DataToJSON, FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';
import { DataSet } from 'choerodon-ui/pro';

const intlPrefix = 'srm.supplier.model.supplier';

export const detailDSConf = (): DataSetProps => ({
  autoCreate: true,
  forceValidate: true,
  fields: [
    {
      name: 'supplierTypeId',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorCode`).d('供应商类型'),
      // required: true,
    },
    {
      name: 'supplierName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorTypeName`).d('供应商名称'),
      required: true,
    },
    {
      name: 'creditCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('统一社会信用代码'),
      lookupCode: 'SRM.ACTION.STATUS',
      required: true,
    },
    {
      name: 'shortName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isRegisterAudit`).d('简称'),
    },
    {
      name: 'level',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('供应商级别'),
    },
    {
      name: 'purchaserId',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXieYi`).d('爱奇迹采购员'),
    },
    {
      name: 'currency',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('交易币种'),
    },
    {
      name: 'country',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('国家'),
    },
    {
      name: 'region',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('所在地区'),
    },
    {
      name: 'detailAddress',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('详细地址'),
    },
    {
      name: 'returnAddress',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('退货地址'),
    },
    {
      name: 'registeredCapital',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('注册资本（万元）'),
    },
    {
      name: 'paidInCapital',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('实缴资本（万元）'),
    },
    {
      name: 'establishmentDate',
      type: FieldType.date,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('成立日期'),
    },
    {
      name: 'businessTerm',
      type: FieldType.date,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('营业期限'),
    },
    {
      name: 'legalRepresentative',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('法人代表'),
    },
    {
      name: 'electronicSignatureFlag',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('是否使用电子签章'),
      options: new DataSet({data: [{value: 0, meaning: '否'}, {value: 0, meaning: '是'}]}),
    },
    {
      name: 'domesticSourceOrigin',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('境内货源地'),
    },
    {
      name: 'overseasSourceOrigin',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('境外货源地'),
    },
    {
      name: 'securityCodeFlag',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('是否领用防伪码'),
      options: new DataSet({data: [{value: 0, meaning: '不领用'}, {value: 0, meaning: '领用'}]}),
    },
    {
      name: 'invoiceName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('开票公司名称'),
    },
    {
      name: 'invoicePhone',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('开票公司电话'),
    },
    {
      name: 'invoiceAddress',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('开票公司地址'),
    },
    {
      name: 'overseasFlag',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('采购主体是否境外'),
      options: new DataSet({data: [{value: 0, meaning: '境内'}, {value: 0, meaning: '境外'}, {value: 2, meaning: '境内&境外'}]}),
    },
    {
      name: 'taxRate',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('经营范围'),
    },
    {
      name: 'accountCreatedFlag',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('是否创建供应商账户'),
      options: new DataSet({data: [{value: 0, meaning: '不创建'}, {value: 0, meaning: '创建'}]}),
    },
    {
      name: 'businessScope',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('经营范围'),
    },
    {
      name: 'companyProfile',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('公司简介'),
      multiLine: true,
    },
    {
      name: 'annualCapacityQuantity',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('年生产能力（数量）'),
    },
    {
      name: 'annualCapacityAmount',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('年生产能力（金额万元）'),
    },
    {
      name: 'monthlyCapacityQuantity',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('月生产能力（数量）'),
    },
    {
      name: 'monthlyCapacityAmount',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('月生产能力（金额万元）'),
    },
    {
      name: 'lastYearTurnover',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('上一年年营业额（万元）'),
    },
    {
      name: 'twoYearsAgoTurnover',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('上两年年营业额（万元）'),
    },
    {
      name: 'threeYearsAgoTurnover',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('上三年年营业额（万元）'),
    },
    {
      name: 'employeeCount',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('职工总人数'),
    },
    {
      name: 'contactInfo',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('存联系人json'),
    },
    {
      name: 'certificateInfo',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('存证书json'),
    },
  ],
  transport: {
    read: ({ dataSet }): AxiosRequestConfig => {
      const supplierId = dataSet?.getState('supplierId');
      return {
        url: `${process.env.SRM_DEV_HOST}/srm/supplier/${supplierId}`,
        method: 'get',
      };
    },
    submit: ({ dataSet, data }): AxiosRequestConfig => {

      console.log('data123==', data);

      return {
        url: `${process.env.SRM_DEV_HOST}/srm/supplier123`,
        // method: isCreate ? 'post' : 'put',
        method: 'post',
        data: data[0],
      };
    },
  },
});
