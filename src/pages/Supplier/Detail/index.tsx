import React, { useMemo } from 'react'
import { Button, DataSet, DatePicker, Form, Lov, Modal, Output, Select, Table, TextArea, TextField } from 'choerodon-ui/pro';
import { observer } from 'mobx-react';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { SelectionMode, TableButtonType } from 'choerodon-ui/pro/lib/table/enum';
import { Buttons } from 'choerodon-ui/pro/lib/table/Table';
import { Record } from 'choerodon-ui/dataset';
import { RecordStatus } from 'choerodon-ui/dataset/data-set/enum';
import { isNil } from 'lodash';

import { getCurrentUserId, intl } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';

import Title from '@/components/Title';
import { compose } from '@/utils/util';
import { RenderProps } from 'choerodon-ui/pro/lib/field/FormField';
import { Tag } from 'choerodon-ui';
import styles from '../index.less';

interface DetailProps {
  history: any;
  match: {
    params: {
      actionHeaderId: string;
    };
  };
}


function Detail(props: DetailProps) {

  const { history, match } = props;
  const { params: { actionHeaderId } } = match;

  // 是否为创建
  const isCreate: boolean = actionHeaderId === 'create';

  // 定义ds
  const [headerDS, lineDS] = useMemo(() => {
    const _headerDS = new DataSet({});
    const _lineDS = new DataSet({ });

    _headerDS.setState('lineDS', _lineDS);
    _lineDS.setState('headerDS', _headerDS);

    if (!isCreate) {
      _headerDS.setState('actionHeaderId', actionHeaderId);
      _lineDS.setState('actionHeaderId', actionHeaderId);
      _headerDS.query();
      _lineDS.query();
    }

    return [_headerDS, _lineDS];
  }, [actionHeaderId]);

  // 头字段-行动状态
  const {
    actionStatus,
    actionHeaderId: syncActionHeaderId, // 查询返回的头id
  } = headerDS.current?.get(['actionStatus', 'actionHeaderId']);

  // 请求DS
  const requestHandlerDS = useMemo(() => new DataSet({}), []);

  // const [editPermissionChecked] = useCheckEditPermissionByUser({
  //   isCreate,
  //   businessId: actionHeaderId as any,
  //   datasource: DATABASE_TABLE_NAME.PTS_ACTION_HEADER,
  // });


  // 已完成的不可编辑，且查询头未返回头id之前不可编辑
  const isReadOnly: boolean = !isCreate && (isNil(syncActionHeaderId) || actionStatus === 'COMPLETED'); // || !editPermissionChecked;
  // 保存
  const handleSave = async () => {
    const validHeader = await headerDS.current?.validate(true);
    const validLine = await lineDS.validate();
    if (!validHeader || !validLine) return;

    // ③【行动类型】=“项目”的行动事项，行上的里程碑明细为必填，否则无法保存//
    // 点击保存时会提醒“当前行动事项未填写里程碑明细，无法保存；当【行动类型】=“例行/其他”时，可以不插入里程碑行
    if (headerDS.current?.get('actionType') === 'PROJECT' && lineDS.length === 0) {
      notification.warning({
        message: intl.get('pts.actionItem.view.message.detail.milestoneRequired')
          .d('项目类型的行动下必须含有里程碑，例行和其他类型的行动下可以不含里程碑，当前为项目类型的行动且未填写里程碑明细，无法保存。'),
      });
      return;
    }

    headerDS.current?.set('__update', !headerDS.current?.get('__update'));
    headerDS.setState('action', 'save');
    await headerDS.submit();
    if (isCreate) {
      headerDS.setState('actionHeaderId', headerDS.current?.get('actionHeaderId'));
      lineDS.setState('actionHeaderId', headerDS.current?.get('actionHeaderId'));
      history.replace(`/pts/action-item/detail/${headerDS.current?.get('actionHeaderId')}`); // 替换路由
    }
    headerDS.query();
    lineDS.query();
  };

  // 完成
  const handleComplete = async () => {
    const validHeader = await headerDS.current?.validate(true);
    const validLine = await lineDS.validate();
    if (!validHeader || !validLine) return;

    // ③【行动类型】=“项目”的行动事项，行上的里程碑明细为必填，否则无法保存//
    // 点击保存时会提醒“当前行动事项未填写里程碑明细，无法保存；当【行动类型】=“例行/其他”时，可以不插入里程碑行
    if (headerDS.current?.get('actionType') === 'PROJECT' && lineDS.length === 0) {
      notification.warning({
        message: intl.get('pts.actionItem.view.message.detail.milestoneRequired')
          .d('项目类型的行动下必须含有里程碑，例行和其他类型的行动下可以不含里程碑，当前为项目类型的行动且未填写里程碑明细，无法保存。'),
      });
      return;
    };

    return Modal.confirm({
      title: intl.get('pts.actionItem.message.confirm.completeDesc').d('行动完成后，将不能创建新的任务，是否确认完成？'),
      onOk: async () => {
        headerDS.current?.set('__update', !headerDS.current?.get('__update'));
        headerDS.setState('action', 'ActionType.COMPLETE');
        await headerDS.submit();
        history.replace(`/pts/action-item/list`); // 替换路由
      },
    });
  };

  // 删除
  const handleDelete = async () => {
    const modelProps = {
      title: intl.get('spt.common.message.confirm.delete').d('是否确认删除？'),
      onOk: async () => {
        headerDS.current?.set('__update', !headerDS.current?.get('__update'));
        headerDS.setState('action', 'ActionType.DELETE');
        await headerDS.forceSubmit();
        history.replace('/pts/action-item/list');
      },
    };

    return Modal.confirm(modelProps);
  };

  // 行完成
  const handleLineComplete = async () => {
    return Modal.confirm({
      title: intl.get('pts.actionItem.message.confirm.lineComplete').d('是否确认完成所选里程碑？'),
      onOk: async () => {
        const data = lineDS.selected.map(record => record.toJSONData());
        requestHandlerDS.setState('action', 'RequestAction.LINE_COMPLETE');
        requestHandlerDS.setState('data', data);
        await requestHandlerDS.submit();
        headerDS.query();
        lineDS.query();
      },
    });
  };

  // 编辑器是否可用
  const lineEditor = (record: Record) => {
    if (record.status === RecordStatus.sync && ['N_COMPLETED', 'D_COMPLETED', 'CANCELLED'].includes(record.get('milestoneStatus'))) {
      // 保存后的已完成状态不可编辑
      return false;
    }
    if (record.get('editFlag') === 0) return false;
    if (isReadOnly || record.get('finishTime')) return false;

    return true;
  };

  // line 表格列
  const lineColumns: Array<ColumnProps> = [
    { name: 'milestoneName', editor: lineEditor },
    { name: 'milestoneStatus', editor: lineEditor },
    { name: 'stageOwnerUserLov', editor: lineEditor },
    { name: 'stageOwnerDeptName' },
    { name: 'stageStartTime', editor: lineEditor },
    { name: 'stageEndTime', editor: lineEditor },
    { name: 'firstPlanFinishTime' },
    { name: 'delayFlag' },
    {
      header: intl.get('pts.indicatorDictionary.view.column.line.action').d('操作'),
      width: 100,
      renderer: ({ record }) => {
        const actionLineId = record?.get('actionLineId');
        return actionLineId && (
          <div>123</div>
        );
      },
    },
  ];

  // 行状态过滤器
  const actionStatusOptionsFilter = (record: Record) => {
    // 不能选择已完成状态，通过完成按钮完成，此时也不会翻译COMPLETED的meaning，后面需要翻译时，再处理
    if (record.get('value') === 'COMPLETED') {
      return false;
    }
    return true;
  };

  // 勾选非新建且完成的，不可删除、不可完成
  const commonLineDisabled: boolean =
    lineDS.selected.length === 0
    || lineDS.selected.some(
      r => r.status === RecordStatus.sync && ['D_COMPLETED', 'N_COMPLETED', 'CANCELLED'].includes(r.get('milestoneStatus'))
    );

  // 行完成
  const lineCompleteDisabled: boolean = lineDS.selected.length === 0 || lineDS.selected.some(record => {
    return record.get('finishTime') || record.status === RecordStatus.add;
  });
  const lineComplete: Buttons = (
    <Button
      icon="checklist"
      disabled={lineDS.selected.length === 0 || lineCompleteDisabled || commonLineDisabled}
      onClick={handleLineComplete}
    >
      {intl.get('pts.actionItem.button.lineComplete').d('完成')}
    </Button>
  );

  const executorDeptNamesRender = ({ record }: RenderProps): React.ReactNode => {
    const executorDeptNames = record?.get('executorDeptNames');
    const text = Array.isArray(executorDeptNames) ? executorDeptNames.join(',') : executorDeptNames;
    if (!text) return text;
    const set = new Set(text.split(','));
    return Array.from(set).map(name => <Tag>{name}</Tag>);
  };

  const executorDeptNames = headerDS.current?.get('executorDeptNames');
  const executorDeptNamesTempSet = new Set(Array.isArray(executorDeptNames) ? executorDeptNames : (executorDeptNames || '').split(','));
  const executorDeptNamesTemp = Array.from(executorDeptNamesTempSet);

  // 行上有可编辑项
  const hasSelfLineEdit = lineDS.some(record => {
    return !(
      record.status === RecordStatus.sync
      && ['N_COMPLETED', 'D_COMPLETED', 'CANCELLED'].includes(record.get('milestoneStatus'))
    )
      && +record.get('editFlag') === 1;
  });

  return (
    <>
      <Header
        title={intl.get('pts.actionItem.view.message.detail.title').d('行动事项详情')}
        backPath="/pts/action-item/list"
        isChange={headerDS.dirty || lineDS.dirty}
      >
        <Button
          icon="save"
          onClick={handleSave}
          hidden={isReadOnly && !hasSelfLineEdit}
          color={ButtonColor.primary}
        >
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
        <Button
          icon="delete"
          onClick={handleDelete}
          hidden={isCreate || isReadOnly}
        >
          {intl.get('hzero.common.button.delete').d('删除')}
        </Button>
        <Button
          icon="check"
          onClick={handleComplete}
          hidden={isReadOnly}
        >
          {intl.get('pts.actionItem.button.complete').d('行动完成')}
        </Button>
      </Header>
      <Content>
        <Title title={intl.get('pts.actionItem.view.message.detail.basicInfo').d('基本信息')} />
        <Form dataSet={headerDS} columns={3}>
          {isReadOnly ? (
            <>
              <Output name="actionDesc" />
              <Output name="pbcLov" />
              <Output name="actionStatus" />
              <Output name="actionType" />
              <Output name="primaryOwnerUserLov" />
              <Output name="actionDutyDeptLov" />
              <Output name="executorUserLov" />
              <Output name="executorDeptNamesTemp" renderer={executorDeptNamesRender} />
              {/* <Output name="actionLevel" /> */}
              <Output name="startTime" />
              {/* <Output name="endTime" /> */}
              <Output name="delayFlag" />
              <TextArea
                name="remark"
                readOnly
                newLine
                colSpan={2}
                autoSize
                className={styles['pts-action-item-read-text-area']}
              />
            </>
          ) : (
            <>
              <TextField name="actionDesc" />
              <Lov name="pbcLov" tableProps={{ queryFieldsLimit: 5 }} />
              <Select name="actionStatus" optionsFilter={actionStatusOptionsFilter} />
              <Select name="actionType" />
              <Lov name="primaryOwnerUserLov" />
              <Lov name="actionDutyDeptLov" />
              <Lov multiple name="executorUserLov" maxTagCount={2} />
              <TextField
                maxTagCount={2}
                multiple
                disabled
                value={executorDeptNamesTemp}
                label={intl.get('pts.actionItem.model.actionItem.executorDeptNames').d('执行人部门名称')}
              />
              {/* <Select name="actionLevel" /> */}
              <DatePicker name="startTime" />
              {/* <DatePicker name="endTime" /> */}
              <Select name="delayFlag" />
              <TextArea name="remark" newLine colSpan={2} />
            </>
          )}
        </Form>
        <Title
          top={16}
          title={intl.get('pts.actionItem.view.message.detail.stageInfo').d('里程碑明细')}
        />
        <Table
          dataSet={lineDS}
          columns={lineColumns}
          buttons={isReadOnly ? [] : [
            [TableButtonType.delete, {
              disabled: commonLineDisabled,
            }],
            TableButtonType.add,
            // lineComplete,
          ]}
          selectionMode={isReadOnly ? SelectionMode.none : SelectionMode.rowbox}
        />
      </Content>
    </>
  );
}

export default compose(
  formatterCollections({
    code: ['pts.actionItem', 'pts.operationHistory', 'pts.common', 'pts.common'],
  }),
  observer,
)(Detail);
