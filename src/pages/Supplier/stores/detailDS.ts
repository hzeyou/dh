import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';
import { DataSet } from 'choerodon-ui/pro';
import { HG_SRM_API_PREFIX } from '@/utils/config';

const intlPrefix = 'srm.supplier.model.supplier';

type TableData = Record<string, unknown>;

function parseTableData(value: unknown): TableData[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value as TableData[];
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      return [];
    }
  }

  return [value as TableData];
}

function loadTableData(dataSet: DataSet, stateKey: string, fieldName: string) {
  const targetDS = dataSet.getState(stateKey);
  const data = Array.from(dataSet.current?.get(fieldName));

  if (targetDS && Array.isArray(data)) {
    targetDS.loadData(data);
  }
}

export const detailDSConf = (): DataSetProps => {
  return {
    autoCreate: true,
    forceValidate: true,
    fields: [
      {
        name: 'supplierCode',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.supplierCode`).d('供应商编码'),
      },
      {
        name: 'sapCode',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.sapCode`).d('SRM编码'),
      },
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
        name: 'typeName',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.typeName`).d('供应商类型'),
      },
      {
        name: 'statusMeaning',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.statusMeaning`).d('生命周期阶段'),
      },
      {
        name: 'updateRecord',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.updateRecord`).d('更新记录'),
      },
      {
        name: 'lastUpdateDate',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.lastUpdateDate`).d('最近更新时间'),
      },
      {
        name: 'shortName',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.shortName`).d('简称'),
      },
      {
        name: 'level',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.level`).d('供应商级别'),
      },
      {
        name: 'purchaserId',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.purchaserId`).d('爱奇迹采购员'),
      },
      {
        name: 'currency',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.currency`).d('交易币种'),
      },
      {
        name: 'country',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.country`).d('国家'),
      },
      {
        name: 'region',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.region`).d('所在地区'),
      },
      {
        name: 'detailAddress',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.detailAddress`).d('详细地址'),
      },
      {
        name: 'returnAddress',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.returnAddress`).d('退货地址'),
      },
      {
        name: 'registeredCapital',
        type: FieldType.number,
        label: intl.get(`${intlPrefix}.registeredCapital`).d('注册资本（万元）'),
      },
      {
        name: 'paidInCapital',
        type: FieldType.number,
        label: intl.get(`${intlPrefix}.paidInCapital`).d('实缴资本（万元）'),
      },
      {
        name: 'establishmentDate',
        type: FieldType.date,
        label: intl.get(`${intlPrefix}.establishmentDate`).d('成立日期'),
      },
      {
        name: 'businessTerm',
        type: FieldType.date,
        label: intl.get(`${intlPrefix}.businessTerm`).d('营业期限'),
      },
      {
        name: 'legalRepresentative',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.legalRepresentative`).d('法人代表'),
      },
      {
        name: 'electronicSignatureFlag',
        type: FieldType.number,
        label: intl.get(`${intlPrefix}.electronicSignatureFlag`).d('是否使用电子签章'),
        options: new DataSet({
          data: [
            { value: 0, meaning: '否' },
            { value: 0, meaning: '是' },
          ],
        }),
      },
      {
        name: 'domesticSourceOrigin',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.domesticSourceOrigin`).d('境内货源地'),
      },
      {
        name: 'overseasSourceOrigin',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.overseasSourceOrigin`).d('境外货源地'),
      },
      {
        name: 'securityCodeFlag',
        type: FieldType.number,
        label: intl.get(`${intlPrefix}.securityCodeFlag`).d('是否领用防伪码'),
        options: new DataSet({
          data: [
            { value: 0, meaning: '不领用' },
            { value: 0, meaning: '领用' },
          ],
        }),
      },
      {
        name: 'invoiceName',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.invoiceName`).d('开票公司名称'),
      },
      {
        name: 'invoicePhone',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.invoicePhone`).d('开票公司电话'),
      },
      {
        name: 'invoiceAddress',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.invoiceAddress`).d('开票公司地址'),
      },
      {
        name: 'overseasFlag',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.overseasFlag`).d('采购主体是否境外'),
        options: new DataSet({
          data: [
            { value: 0, meaning: '境内' },
            { value: 0, meaning: '境外' },
            { value: 2, meaning: '境内&境外' },
          ],
        }),
      },
      {
        name: 'taxRate',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.taxRate`).d('经营范围'),
      },
      {
        name: 'accountCreatedFlag',
        type: FieldType.string,
        label: intl
          .get(`${intlPrefix}.accountCreatedFlag`)
          .d('是否创建供应商账户'),
        options: new DataSet({
          data: [
            { value: 0, meaning: '不创建' },
            { value: 0, meaning: '创建' },
          ],
        }),
      },
      {
        name: 'businessScope',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.businessScope`).d('经营范围'),
      },
      {
        name: 'companyProfile',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.companyProfile`).d('公司简介'),
        multiLine: true,
      },
      {
        name: 'annualCapacityQuantity',
        type: FieldType.number,
        label: intl
          .get(`${intlPrefix}.annualCapacityQuantity`)
          .d('年生产能力（数量）'),
      },
      {
        name: 'annualCapacityAmount',
        type: FieldType.number,
        label: intl
          .get(`${intlPrefix}.annualCapacityAmount`)
          .d('年生产能力（金额万元）'),
      },
      {
        name: 'monthlyCapacityQuantity',
        type: FieldType.number,
        label: intl
          .get(`${intlPrefix}.monthlyCapacityQuantity`)
          .d('月生产能力（数量）'),
      },
      {
        name: 'monthlyCapacityAmount',
        type: FieldType.number,
        label: intl
          .get(`${intlPrefix}.monthlyCapacityAmount`)
          .d('月生产能力（金额万元）'),
      },
      {
        name: 'lastYearTurnover',
        type: FieldType.number,
        label: intl
          .get(`${intlPrefix}.lastYearTurnover`)
          .d('上一年年营业额（万元）'),
      },
      {
        name: 'twoYearsAgoTurnover',
        type: FieldType.number,
        label: intl
          .get(`${intlPrefix}.twoYearsAgoTurnover`)
          .d('上两年年营业额（万元）'),
      },
      {
        name: 'threeYearsAgoTurnover',
        type: FieldType.number,
        label: intl
          .get(`${intlPrefix}.threeYearsAgoTurnover`)
          .d('上三年年营业额（万元）'),
      },
      {
        name: 'employeeCount',
        type: FieldType.number,
        label: intl.get(`${intlPrefix}.employeeCount`).d('职工总人数'),
      },
      {
        name: 'contactInfo',
        type: FieldType.object,
        label: intl.get(`${intlPrefix}.contactInfo`).d('存联系人'),
        transformResponse: parseTableData,
      },
      {
        name: 'bankInfo',
        type: FieldType.object,
        label: intl.get(`${intlPrefix}.bankInfo`).d('银行'),
        transformResponse: parseTableData,
      },
      {
        name: 'categoryInfo',
        type: FieldType.object,
        label: intl.get(`${intlPrefix}.categoryInfo`).d('供货品类清单'),
      },
      {
        name: 'certificateInfo',
        type: FieldType.object,
        label: intl.get(`${intlPrefix}.certificateInfo`).d('存证书'),
        transformResponse: parseTableData,
      },
    ],
    events: {
      load: ({ dataSet }) => {
        loadTableData(dataSet, 'contactDS', 'contactInfo');
        loadTableData(dataSet, 'bankDS', 'bankInfo');
        loadTableData(dataSet, 'certDS', 'certificateInfo');
      },
    },
    transport: {
      read: ({ dataSet }): AxiosRequestConfig => {
        const id = dataSet?.getState('supplierId');
        return {
          url: `${HG_SRM_API_PREFIX}/suppliers/${id}`,
          method: 'get',
        };
      },
      submit: ({ data }): AxiosRequestConfig => {
        // TODO 需要联动接口
        return {
          url: `${HG_SRM_API_PREFIX}/suppliers/save`,
          method: 'post',
          data: data[0],
        };
      },
    },
  };
};
