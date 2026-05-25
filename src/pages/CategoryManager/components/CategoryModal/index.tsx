import React from 'react';
import {
  DataSet,
  Form,
  Output,
  Select,
  Spin,
  TextArea,
  TextField,
  TreeSelect,
} from 'choerodon-ui/pro';
import { Record as C7nRecord } from 'choerodon-ui/dataset';
import { RenderProps } from 'choerodon-ui/pro/lib/field/FormField';
import { observer } from 'mobx-react';

import intl from 'utils/intl';
import notification from 'utils/notification';

import { openModalHelper } from '@/utils/modalHelper';
import {
  buildCategoryCode,
  CATEGORY_LEVEL,
  CATEGORY_STATUS,
  createCategoryOptionDS,
  detailDSConf,
  getCategoryRows,
  getCodeSuffix,
  getHierarchyByParent,
  getLevelMeaning,
} from '../../stores/listDS';

interface OpenCategoryModalProps {
  record?: C7nRecord | null;
  parentRecord?: C7nRecord | null;
  treeDS: DataSet;
  onSubmit?: () => void;
}

interface CategoryModalProps {
  dataSet: DataSet;
  mode: 'create' | 'edit';
  createSource: 'toolbar' | 'child';
}

function getRecordData(record?: C7nRecord | null) {
  return record?.toJSONData() || {};
}

function buildOptionData(treeDS: DataSet) {
  const rows = getCategoryRows(treeDS);
  const parentRows = rows.filter(item =>
    [CATEGORY_LEVEL.L1, CATEGORY_LEVEL.L2].includes(item.level),
  );
  const parentMap = parentRows.reduce((result, item) => {
    result[item.categoryId] = item;
    return result;
  }, {});

  return {
    parentRows,
    parentMap,
  };
}

function buildChildInitialData(parentRecord: C7nRecord) {
  const parentData = getRecordData(parentRecord);
  const hierarchy = getHierarchyByParent(parentData);

  return {
    ...hierarchy,
    codeSuffix: getCodeSuffix(hierarchy.level),
    status: CATEGORY_STATUS.enabled,
  };
}

function buildToolbarInitialData() {
  return {
    level: CATEGORY_LEVEL.L1,
    codeSuffix: getCodeSuffix(CATEGORY_LEVEL.L1),
    status: CATEGORY_STATUS.enabled,
  };
}

function validateLocalUnique(dataSet: DataSet, treeDS: DataSet) {
  const current = dataSet.current;
  if (!current) {
    return false;
  }

  const categoryId = current.get('categoryId');
  const level = current.get('level');
  const parentId = current.get('parentId');
  const categoryName = current.get('categoryName');
  const categoryCode =
    current.get('categoryCode') ||
    buildCategoryCode(current.get('codePrefix'), level);
  const rows = getCategoryRows(treeDS);

  const hasSameCode = rows.some(
    item =>
      item.categoryCode === categoryCode && item.categoryId !== categoryId,
  );
  if (hasSameCode) {
    notification.warning({
      message: intl
        .get('srm.categoryManager.view.message.validateFailed')
        .d('校验未通过'),
      description: intl
        .get('srm.categoryManager.view.message.codeUnique')
        .d('编码需全局唯一'),
    });
    return false;
  }

  const hasSameName = rows.some(item => {
    if (item.categoryId === categoryId || item.level !== level) {
      return false;
    }
    if (level === CATEGORY_LEVEL.L1) {
      return item.categoryName === categoryName;
    }
    return item.parentId === parentId && item.categoryName === categoryName;
  });

  if (hasSameName) {
    let duplicateNameDescription = intl
      .get('srm.categoryManager.view.message.siblingNameUnique')
      .d('L2/L3 目录名称需在同一上级下唯一');

    if (level === CATEGORY_LEVEL.L1) {
      duplicateNameDescription = intl
        .get('srm.categoryManager.view.message.l1NameUnique')
        .d('L1 目录名称需全局唯一');
    }

    notification.warning({
      message: intl
        .get('srm.categoryManager.view.message.validateFailed')
        .d('校验未通过'),
      description: duplicateNameDescription,
    });
    return false;
  }

  return true;
}

function CategoryModal(props: CategoryModalProps) {
  const { dataSet, mode, createSource } = props;
  console.log('props==', props);
  const current = dataSet.current;
  const level = current?.get('level');
  const isCreate = mode === 'create';
  const isToolbarCreate = isCreate && createSource === 'toolbar';
  const isChildCreate = isCreate && createSource === 'child';
  const codeSuffix = current?.get('codeSuffix') || getCodeSuffix(level);

  const renderParentName = ({ record }: RenderProps) =>
    record?.get('parentName') ||
    record?.getField('parentId')?.getText(record.get('parentId')) ||
    '';

  return (
    <Spin dataSet={dataSet}>
      <Form dataSet={dataSet} columns={2} labelWidth={120}>
        {isToolbarCreate && (
          <TreeSelect
            name="parentId"
            searchable
            clearButton
            treeDefaultExpandAll
          />
        )}
        {isChildCreate && level !== CATEGORY_LEVEL.L1 && (
          <Output name="parentId" renderer={renderParentName} />
        )}
        {!isCreate && level !== CATEGORY_LEVEL.L1 && (
          <Output name="parentId" renderer={renderParentName} />
        )}
        <Output name="level" renderer={({ value }) => getLevelMeaning(value)} />
        {isCreate ? (
          <TextField name="codePrefix" addonAfter={codeSuffix} />
        ) : (
          <Output name="categoryCode" />
        )}
        <TextField name="categoryName" />
        <Select name="status" />
        <TextArea name="description" colSpan={2} rows={4} />
      </Form>
    </Spin>
  );
}

const CategoryModalContent = observer(CategoryModal);

export default function openCategoryModal(options: OpenCategoryModalProps) {
  const { record, parentRecord, treeDS, onSubmit } = options;
  const dataSet = new DataSet(detailDSConf());
  const mode: CategoryModalProps['mode'] = record ? 'edit' : 'create';
  const createSource: CategoryModalProps['createSource'] = parentRecord
    ? 'child'
    : 'toolbar';
  const { parentRows, parentMap } = buildOptionData(treeDS);

  dataSet.setState('mode', mode);
  dataSet.setState('createSource', createSource);
  dataSet.setState('parentMap', parentMap);
  dataSet.getField('parentId')?.setOptions(createCategoryOptionDS(parentRows));

  if (record) {
    const data = getRecordData(record);
    dataSet.loadData([
      {
        ...data,
        codeSuffix: getCodeSuffix(data.level),
      },
    ]);
  } else {
    const initialData = parentRecord
      ? buildChildInitialData(parentRecord)
      : buildToolbarInitialData();
    const current = dataSet.current || dataSet.create({}, 0);
    Object.keys(initialData).forEach(key => {
      current.set(key, initialData[key]);
    });
  }

  async function handleSave() {
    const valid = await dataSet.current?.validate(true);
    if (!valid) {
      return false;
    }

    if (!validateLocalUnique(dataSet, treeDS)) {
      return false;
    }

    const res = await dataSet.submit();
    if (res === false) {
      return false;
    }

    if (onSubmit) {
      onSubmit();
    }

    return true;
  }

  return openModalHelper<CategoryModalProps>({
    title: record
      ? intl.get('hzero.common.button.edit').d('编辑')
      : intl.get('hzero.common.button.create').d('新建'),
    drawer: false,
    content: CategoryModalContent,
    data: {
      dataSet,
      mode,
      createSource,
    },
    modalProps: {
      style: { width: 720 },
    },
    onOk: handleSave,
  });
}
