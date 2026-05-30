import React from 'react';
import { DataSet, Form, Output } from 'choerodon-ui/pro';
import { LabelLayout } from 'choerodon-ui/pro/lib/form/enum';
import { ContentCard } from 'components/Page';

interface CompanyInfoProps {
  ds: DataSet;
}

export default function Index({ ds }: CompanyInfoProps) {
  return (
    <ContentCard title="公司信息">
      <Form dataSet={ds} columns={4} labelLayout={LabelLayout.vertical}>
        <Output name="supplierName" colSpan={4} />
        <Output name="supplierCode" />
        <Output name="sapCode" />
        <Output name="typeName" />
        <Output name="creditCode" />
        <Output name="statusMeaning" />
        <Output name="updateRecord" />
        <Output name="lastUpdateDate" />
      </Form>
    </ContentCard>
  );
}
