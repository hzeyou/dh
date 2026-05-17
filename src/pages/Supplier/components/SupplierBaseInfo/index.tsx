import React from 'react';
import { DatePicker, Form, Lov, NumberField, Output, Select, TextArea, TextField } from 'choerodon-ui/pro';
import { ContentCard } from 'components/Page';
import { LabelLayout } from 'choerodon-ui/pro/lib/form/enum';

export default function Index({ds, isCreate}) {
  return (
    <Form
      dataSet={ds}
      columns={4}
      labelLayout={LabelLayout.vertical}
    >
      {
        isCreate ? (
          <>
            <Lov
              name="supplierTypeId"
              tableProps={{ queryFieldsLimit: 5 }}
            />
            <TextField name="supplierName" />
            <TextField name="creditCode" />
            <div></div>
            <TextField name="shortName" />
            <Lov name="level" tableProps={{ queryFieldsLimit: 5 }} />
            <Lov
              name="purchaserId"
              tableProps={{ queryFieldsLimit: 5 }}
            />
            <Select name="currency" />
            <Select name="country" />
            <TextField name="region" />
            <TextField name="detailAddress" />
            <TextField name="returnAddress" />
            <NumberField name="registeredCapital" />
            <NumberField name="paidInCapital" />
            <DatePicker name="establishmentDate" />
            <DatePicker name="businessTerm" />
            <TextField name="legalRepresentative" />
            <Select name="electronicSignatureFlag" />
            <TextField name="domesticSourceOrigin" />
            <TextField name="overseasSourceOrigin" />
            <Select name="securityCodeFlag" />
            <TextField name="invoiceName" />
            <TextField name="invoicePhone" />
            <TextField name="invoiceAddress" />
            <Select name="overseasFlag" />
            <TextField name="taxRate" />
            <Select name="accountCreatedFlag" />
            <div></div>
            <TextField name="businessScope" />
            <TextArea name="companyProfile" colSpan={3} />
            <NumberField name="annualCapacityQuantity" />
            <NumberField name="annualCapacityAmount" />
            <NumberField name="monthlyCapacityQuantity" />
            <NumberField name="monthlyCapacityAmount" />
            <NumberField name="lastYearTurnover" />
            <NumberField name="twoYearsAgoTurnover" />
            <NumberField name="threeYearsAgoTurnover" />
            <NumberField name="employeeCount" />
          </>
        ): (
          <>
            <Output name="shortName"/>
            <Output name="supplierTypeId"/>
            <Output name="purchaserId"/>
            <Output name="currency"/>
            <Output name="country"/>
            <Output name="region"/>
            <Output name="detailAddress"/>
            <Output name="returnAddress"/>
            <Output name="registeredCapital"/>
            <Output name="paidInCapital"/>
            <Output name="establishmentDate"/>
            <Output name="legalRepresentative"/>
            <Output name="businessTerm"/>
            <Output name="legalRepresentative"/>
            <Output name="electronicSignatureFlag"/>
            <Output name="domesticSourceOrigin"/>
            <Output name="overseasSourceOrigin"/>
            <Output name="securityCodeFlag"/>
            <Output name="invoiceName"/>
            <Output name="invoicePhone"/>
            <Output name="invoiceAddress"/>
            <Output name="overseasFlag"/>
            <Output name="taxRate"/>
            <Output name="accountCreatedFlag"/>
            <Output name="businessScope"/>
            <Output name="companyProfile"/>
            <Output name="annualCapacityQuantity"/>
            <Output name="annualCapacityAmount"/>
            <Output name="monthlyCapacityQuantity"/>
            <Output name="monthlyCapacityAmount"/>
            <Output name="lastYearTurnover"/>
            <Output name="twoYearsAgoTurnover"/>
            <Output name="threeYearsAgoTurnover"/>
            <Output name="employeeCount"/>
          </>
        )
      }
    </Form>
  );

}

