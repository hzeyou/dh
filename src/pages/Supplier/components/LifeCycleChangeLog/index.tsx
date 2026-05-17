import React from 'react';
import { Form, Output } from 'choerodon-ui/pro';
import { Steps } from 'choerodon-ui';
import { Card } from 'hzero-ui';
import { ContentCard } from 'components/Page';
import styles from './index.less';


export default function Index({ds}:any) {

  return (
    <ContentCard title="生命周期变更历程">
      <Form dataSet={ds}>
        <Steps className={styles['my-steps']}>
          <Steps.Step
            style={{maxWidth: '300px'}}
            status="finish"
            icon={<span></span>}
            title={<Card type="inner" title="卡片标题">
              <Form.Item>
                <Output name="supplierName" />
              </Form.Item>
            </Card>}
          ></Steps.Step>
          <Steps.Step
            style={{maxWidth: '300px'}}
            icon={<span></span>}
            status="finish"
            title={<Card type="inner" title="卡片标题">
              <Form.Item>
                <Output name="supplierName" />
              </Form.Item>
            </Card>}
          />
          <Steps.Step
            style={{maxWidth: '300px'}}
            status="finish"
            icon={<span></span>}
            title={<Card type="inner" title="卡片标题">
              <Form.Item>
                <Output name="supplierName" />
              </Form.Item>
            </Card>}
          />
        </Steps>
      </Form>
    </ContentCard>
  );

}

