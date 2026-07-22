import React from 'react';
import { observer } from 'mobx-react-lite';
import { Content, Header } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { mapCustomize } from 'utils/customize';
const intlPrefix = 'hwkf.demo';
interface IProps {
  language: string;
  instanceId: string;
}
const loadWorkflowDetailPage = async () => {

  // if (
  //   mapCustomize.has({
  //     module: 'hzero-front-hwkf',
  //     feature: 'ApprovalButtons',
  //     key: 'ApprovalButtons',
  //   })
  // ) {
  //   const layout = mapCustomize.get({
  //     module: 'hzero-front-hwkf',
  //     feature: 'ApprovalButtons',
  //     key: 'ApprovalButtons',
  //   });
  //   console.log('layout==', layout);
  //   const { ApprovalButtons } = (await layout()) || {};
  //   return ApprovalButtons;
  // }
  // return null;

  // 以下注释掉的代码可以本地启动使用（要同时注释掉上面的）
  try {
    const res = await import('hzero-front-hwkf/lib/pages/personal-workflow/task/approval-buttons');
    // const res = await import('hzero-front-hwkf/lib/pages/personal-workflow/task/approve-comment');
    // const res = await import('hzero-front-hwkf/lib/routes/PageComponent');
    console.log('load========', { res, ApprovalButtons: res.ApprovalButtons });
    return res.ApprovalButtons;
  } catch (error) {
    console.error('load error', error);
  }
};
const DemoPage: React.FC<IProps> = (props) => {
  const { instanceId = '=_uWA3YUIlF971C9atypUbldnq73i3aerYlfMAh1wMJI==' } = props;
  const [workflowDetailPage, setWorkflowDetailPage] = React.useState(null);
  React.useEffect(() => {
    loadWorkflowDetailPage().then(setWorkflowDetailPage);
    const listener = ({ module, feature, key }) => {
      if (module === 'hzero-front-hwkf' && feature === 'ApprovalButtons' && key === 'ApprovalButtons') {
        loadWorkflowDetailPage().then(setWorkflowDetailPage);
      }
    };
    mapCustomize.on('set', listener);
    return () => {
      mapCustomize.off('set', listener);
    };
  }, []);
  const renderContent = React.useMemo(() => {
    const ApprovalButtons = workflowDetailPage;

    console.log('ApprovalButtons==', ApprovalButtons);

    if (ApprovalButtons) {
      return (
        <>
          <Header title={intl.get(`${intlPrefix}.view.message.workflowDetail`).d('审批按钮')} />
          <Content>
            <ApprovalButtons
              instanceId={instanceId}
              position='IN'
            />
          </Content>
        </>
      );
    }
    return <div>Component Not Found</div>;
  }, [workflowDetailPage]);
  return renderContent;
};
export default formatterCollections({
  code: [intlPrefix, 'hwkf.task'], // 需要加上  'hwkf.task' 的多语言模板代码
})(observer(DemoPage));
