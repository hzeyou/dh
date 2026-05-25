import React, { useEffect, useState } from 'react';
import { Button, DataSet, Modal, Table, Tree } from 'choerodon-ui/pro';
import { Record as C7nRecord } from 'choerodon-ui/dataset';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import {
  ColumnAlign,
  ColumnLock,
  TableAutoHeightType,
  TableQueryBarType,
} from 'choerodon-ui/pro/lib/table/enum';
import { NodeRenderer } from 'choerodon-ui/pro/lib/tree/util';
import { observer } from 'mobx-react';

import { Header, ListContent, ListItem } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import request from 'utils/request';
import { getResponse } from 'utils/utils';
import withProps from 'utils/withProps';

import { compose } from '@/utils/util';
import openCategoryModal from './components/CategoryModal';
import {
  CATEGORY_API_PREFIX,
  CATEGORY_LEVEL,
  CATEGORY_STATUS,
  getCategoryRows,
  getChildLevel,
  getLevelMeaning,
  getStatusMeaning,
  listDSConf,
  treeDSConf,
} from './stores/listDS';
import styles from './index.less';

interface CategoryManagerProps {
  listDS: DataSet;
  treeDS: DataSet;
}

function CategoryManager(props: CategoryManagerProps) {
  const { listDS, treeDS } = props;
  const [selectedRecord, setSelectedRecord] = useState<C7nRecord | null>(null);

  useEffect(() => {
    treeDS.query();
    listDS.query();
  }, []);

  function reloadData() {
    treeDS.query();
    listDS.query(listDS.currentPage);
  }

  function queryListByNode(record?: C7nRecord | null) {
    listDS.setState('selectedCategoryId', record?.get('categoryId'));
    listDS.setState('selectedLevel', record?.get('level'));
    listDS.query(1);
  }

  function handleTreeSelect(_selectedKeys, eventObj) {
    const record = eventObj?.selected ? eventObj?.node?.record : null;
    setSelectedRecord(record);
    queryListByNode(record);
  }

  function handleClearTreeSelect() {
    treeDS.unSelectAll();
    setSelectedRecord(null);
    queryListByNode(null);
  }

  function handleCreate(parentRecord?: C7nRecord | null) {
    if (parentRecord && !getChildLevel(parentRecord.get('level'))) {
      notification.warning({
        message: intl
          .get('srm.categoryManager.view.message.cannotCreateChild')
          .d('L3 不允许新增下级目录'),
      });
      return;
    }

    openCategoryModal({
      parentRecord,
      treeDS,
      onSubmit: reloadData,
    });
  }

  function handleEdit(record?: C7nRecord | null) {
    if (!record) {
      return;
    }
    openCategoryModal({
      record,
      treeDS,
      onSubmit: reloadData,
    });
  }

  function getChildren(record: C7nRecord) {
    const categoryId = record.get('categoryId');
    return getCategoryRows(treeDS).filter(item => item.parentId === categoryId);
  }

  function hasChildren(record: C7nRecord) {
    return (
      record.get('childrenCount') > 0 ||
      getChildren(record).length > 0 ||
      ((record as any).children || []).length > 0
    );
  }

  function hasEnabledChildren(record: C7nRecord) {
    return (
      record.get('enabledChildrenCount') > 0 ||
      getChildren(record).some(item => item.status === CATEGORY_STATUS.enabled)
    );
  }

  function checkDeleteConstraint(record: C7nRecord) {
    const level = record.get('level');
    if ([CATEGORY_LEVEL.L1, CATEGORY_LEVEL.L2].includes(level)) {
      if (hasChildren(record)) {
        notification.warning({
          message: intl
            .get('srm.categoryManager.view.message.cannotDelete')
            .d('当前目录不允许删除'),
          description: intl
            .get('srm.categoryManager.view.message.deleteParentConstraint')
            .d('L1/L2 目录需无子节点才允许删除'),
        });
        return false;
      }
    }

    if (level === CATEGORY_LEVEL.L3 && record.get('standardCount') > 0) {
      notification.warning({
        message: intl
          .get('srm.categoryManager.view.message.cannotDelete')
          .d('当前目录不允许删除'),
        description: intl
          .get('srm.categoryManager.view.message.deleteL3Constraint')
          .d('L3 目录需未关联数据标准才允许删除'),
      });
      return false;
    }

    return true;
  }

  function checkStopConstraint(record: C7nRecord) {
    const level = record.get('level');
    if (
      [CATEGORY_LEVEL.L1, CATEGORY_LEVEL.L2].includes(level) &&
      hasEnabledChildren(record)
    ) {
      notification.warning({
        message: intl
          .get('srm.categoryManager.view.message.cannotStop')
          .d('当前目录不允许停用'),
        description: intl
          .get('srm.categoryManager.view.message.stopConstraint')
          .d('停用 L1/L2 时，其下所有子目录需已停用'),
      });
      return false;
    }
    return true;
  }

  async function executeCategoryAction(
    record: C7nRecord,
    action: 'enable' | 'stop' | 'delete',
  ) {
    const categoryId = record.get('categoryId');
    const url =
      action === 'delete'
        ? `${CATEGORY_API_PREFIX}/${categoryId}`
        : `${CATEGORY_API_PREFIX}/${categoryId}/${action}`;
    const res = await request(url, {
      method: action === 'delete' ? 'DELETE' : 'PUT',
    });

    if (res?.failed) {
      getResponse(res);
      return false;
    }

    notification.success({
      message: intl.get('hzero.common.notification.success').d('操作成功'),
    });
    reloadData();
    return true;
  }

  function handleToggleStatus(record: C7nRecord) {
    const enabled = record.get('status') === CATEGORY_STATUS.enabled;
    const action = enabled ? 'stop' : 'enable';

    if (enabled && !checkStopConstraint(record)) {
      return;
    }

    Modal.confirm({
      title: enabled
        ? intl
          .get('srm.categoryManager.view.message.confirmStop')
          .d('是否确认停用该目录？')
        : intl
          .get('srm.categoryManager.view.message.confirmEnable')
          .d('是否确认启用该目录？'),
      onOk: () => executeCategoryAction(record, action),
    });
  }

  function handleDelete(record: C7nRecord) {
    if (!checkDeleteConstraint(record)) {
      return;
    }

    Modal.confirm({
      title: intl
        .get('srm.categoryManager.view.message.confirmDelete')
        .d('是否确认删除该目录？'),
      onOk: () => executeCategoryAction(record, 'delete'),
    });
  }

  const treeNodeRenderer: NodeRenderer = ({ record }) => {
    const status = record?.get('status');
    return (
      <span
        className={[
          styles['category-tree-node'],
          status === CATEGORY_STATUS.stopped
            ? styles['category-tree-node-stopped']
            : '',
        ].join(' ')}
      >
        <span className={styles['category-tree-node-name']}>
          {record?.get('categoryName')}
        </span>
      </span>
    );
  };

  const columns: ColumnProps[] = [
    {
      name: 'level',
      width: 120,
      sortable: true,
      renderer: ({ value }) => getLevelMeaning(value),
    },
    { name: 'categoryCode', width: 180, sortable: true },
    { name: 'categoryName', width: 180, sortable: true },
    { name: 'parentName', width: 160 },
    {
      name: 'status',
      width: 100,
      sortable: true,
      renderer: ({ value }) => (
        <span
          className={
            value === CATEGORY_STATUS.enabled
              ? styles['status-enabled']
              : styles['status-stopped']
          }
        >
          {getStatusMeaning(value)}
        </span>
      ),
    },
    { name: 'description', width: 260 },
    { name: 'createdByName', width: 120 },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 260,
      lock: ColumnLock.right,
      align: ColumnAlign.center,
      renderer: ({ record }) => {
        if (!record) {
          return null;
        }
        const canCreateChild = !!getChildLevel(record.get('level'));
        const enabled = record.get('status') === CATEGORY_STATUS.enabled;
        return (
          <span className={styles['table-actions']}>
            {canCreateChild && (
              <a onClick={() => handleCreate(record as C7nRecord)}>
                {intl
                  .get('srm.categoryManager.view.button.createChild')
                  .d('新增下级')}
              </a>
            )}
            <a onClick={() => handleEdit(record as C7nRecord)}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </a>
            <a onClick={() => handleToggleStatus(record as C7nRecord)}>
              {enabled
                ? intl.get('srm.categoryManager.view.button.stop').d('停用')
                : intl.get('hzero.common.status.enable').d('启用')}
            </a>
            <a onClick={() => handleDelete(record as C7nRecord)}>
              {intl.get('hzero.common.button.delete').d('删除')}
            </a>
          </span>
        );
      },
    },
  ];

  return (
    <>
      <Header
        title={intl.get('srm.categoryManager.view.title').d('数据标准目录管理')}
      >
        <Button
          icon="add"
          color={ButtonColor.primary}
          onClick={() => handleCreate()}
        >
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
      </Header>
      <ListContent className={styles['category-manager-layout']}>
        <ListItem className={styles['category-tree-panel']}>
          <div className={styles['category-tree-header']}>
            <span>
              {intl.get('srm.categoryManager.view.tree.title').d('目录树')}
            </span>
            <div>
              <Button
                icon="refresh"
                funcType={FuncType.flat}
                loading={treeDS.status === 'loading'}
                onClick={() => treeDS.query()}
              />
              <Button funcType={FuncType.flat} onClick={handleClearTreeSelect}>
                {intl.get('hzero.common.button.all').d('全部')}
              </Button>
            </div>
          </div>
          <div className={styles['category-tree-body']}>
            <Tree
              dataSet={treeDS}
              titleField="categoryName"
              renderer={treeNodeRenderer}
              showLine={{ showLeafIcon: false }}
              defaultExpandAll
              onSelect={handleTreeSelect}
            />
          </div>
        </ListItem>
        <ListItem className={styles['category-list-panel']}>
          <div className={styles['category-list-header']}>
            <span>
              {selectedRecord
                ? selectedRecord.get('categoryName')
                : intl
                  .get('srm.categoryManager.view.list.allTitle')
                  .d('全部目录')}
            </span>
          </div>
          <Table
            virtual
            virtualCell
            dataSet={listDS}
            columns={columns}
            searchCode="srm.categoryManager.list.table"
            queryBar={TableQueryBarType.filterBar}
            queryFields={{}}
            queryBarProps={{
              queryFieldsLimit: 4,
            }}
            autoHeight={{ type: TableAutoHeightType.minHeight, diff: 81 }}
          />
        </ListItem>
      </ListContent>
    </>
  );
}

export default compose(
  formatterCollections({
    code: ['srm.categoryManager'],
  }),
  withProps(() => ({
    listDS: new DataSet(listDSConf()),
    treeDS: new DataSet(treeDSConf()),
  })),
  observer,
)(CategoryManager);
