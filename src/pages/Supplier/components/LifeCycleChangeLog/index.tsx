import React from 'react';
import { Form, Icon, Output } from 'choerodon-ui/pro';
import { ContentCard } from 'components/Page';
import styles from './index.less';
import { useHistory } from 'dva';

function Box({
  header,
  children,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.box}>
      <div className={styles.header}>
        <div>
          <Icon type="calendar_today-o" />
        </div>
        {header}
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}

export default function Index({ ds }: any) {

  const history = useHistory();

  const renderer = ({ text, record }) => {
    if (!text) return '无';
    return (
      <a
        onClick={() => {
          const id:number = record.get('id');
          const action:number = record.get('action');
          if (action === 2) {
            history.push(`/srm/supplier-admission/view/${id}`);
          }
          if (action === 3) {
            history.push(`/srm/supplier-business-change/view/${id}`);
          }
          if (action === 4) {
            history.push(`/srm/supplier-business-change/view/${id}`);
          }
        }}
      >
        {text}
      </a>
    );
  };

  return (
    <ContentCard title="生命周期变更历程">
      <div className={styles.container}>
        {ds.map((record, i) => (
          <div key={i} className={styles.boxOuter}>
            <div className={styles.boxInner}>
              <Form record={record} labelWidth="auto">
                <Box
                  header={
                    <>
                      <Output name="date" />
                      <Output name="typeMeaning" />
                    </>
                  }
                >
                  <>
                    <Form.Item>
                      <Output name="actionMeaning" />
                    </Form.Item>
                    <Form.Item>
                      <Output
                        name="code"
                        renderer={({ text }) => renderer({ text, record })}
                      />
                    </Form.Item>
                  </>
                </Box>
              </Form>
            </div>
          </div>
        ))}
      </div>
    </ContentCard>
  );
}
