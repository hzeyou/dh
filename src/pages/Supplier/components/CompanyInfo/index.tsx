import React from 'react';
import { Form, Output } from 'choerodon-ui/pro';
import { ContentCard } from 'components/Page';

export default function Index({ds}) {

  return (
    <ContentCard title="公司信息">
      <Form dataSet={ds}>
        <Output name="phone"/>
        <Output name="supplierCode"/>
        <Output name="phone"/>
        <Output name="phone"/>
        <Output name="phone"/>
        <Output name="phone"/>
        <Output name="phone"/>
        <Output name="phone"/>
        <Output name="phone"/>
      </Form>
    </ContentCard>
  );

}

