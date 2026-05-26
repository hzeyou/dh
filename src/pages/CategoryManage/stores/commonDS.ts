import DataSet from 'choerodon-ui/dataset/data-set/DataSet';
import {
  DataSetSelection,
  FieldIgnore,
  FieldTrim,
  FieldType,
} from 'choerodon-ui/dataset/data-set/enum';

import intl from 'utils/intl';

export type CategoryLevel = 1 | 2 | 3;
export type CategoryStatus = 1 | 2;

export const CATEGORY_LEVEL: { [key: string]: CategoryLevel } = {
  L1: 1,
  L2: 2,
  L3: 3,
};

export const CATEGORY_STATUS: { [key: string]: CategoryStatus } = {
  enabled: 1,
  stopped: 2,
};

export const CATEGORY_API_PREFIX = `${process.env.SRM_DEV_HOST}/v1/0/directories`;

const intlPrefix = 'srm.categoryManager.model.category';

const levelMeaningMap: { [key: number]: string } = {
  [CATEGORY_LEVEL.L1]: intl.get(`${intlPrefix}.level.l1`).d('L1 体系'),
  [CATEGORY_LEVEL.L2]: intl.get(`${intlPrefix}.level.l2`).d('L2 主题域'),
  [CATEGORY_LEVEL.L3]: intl.get(`${intlPrefix}.level.l3`).d('L3 对象'),
};

const statusMeaningMap: { [key: number]: string } = {
  [CATEGORY_STATUS.enabled]: intl.get(`${intlPrefix}.status.enabled`).d('启用'),
  [CATEGORY_STATUS.stopped]: intl.get(`${intlPrefix}.status.stopped`).d('停用'),
};

const codeSuffixMap: { [key: number]: string } = {
  [CATEGORY_LEVEL.L1]: '_SYSTEM',
  [CATEGORY_LEVEL.L2]: '_DOMAIN',
  [CATEGORY_LEVEL.L3]: '_OBJECT',
};

function createOptions(data: Array<{ value: number; meaning: string }>) {
  return new DataSet({
    selection: false,
    data,
  });
}

function normalizeNumber(value?: string | number): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  return Number(value);
}

export function getLevelMeaning(level?: string | number) {
  const value = normalizeNumber(level);
  if (!value) {
    return '';
  }
  return levelMeaningMap[value] || `${level}`;
}

export function getStatusMeaning(status?: string | number) {
  const value = normalizeNumber(status);
  if (!value) {
    return '';
  }
  return statusMeaningMap[value] || `${status}`;
}

export function getCodeSuffix(level?: string | number) {
  const value = normalizeNumber(level);
  if (!value) {
    return '';
  }
  return codeSuffixMap[value] || '';
}

export function getChildLevel(
  level?: string | number,
): CategoryLevel | undefined {
  const value = normalizeNumber(level);
  if (value === CATEGORY_LEVEL.L1) {
    return CATEGORY_LEVEL.L2;
  }
  if (value === CATEGORY_LEVEL.L2) {
    return CATEGORY_LEVEL.L3;
  }
  return undefined;
}

export function buildCategoryCode(prefix?: string, level?: string | number) {
  const value = `${prefix || ''}`.trim().replace(/_+$/, '');
  const suffix = getCodeSuffix(level);
  return value && suffix ? `${value}${suffix}` : undefined;
}

export function getHierarchyByParent(parent?: any) {
  if (!parent) {
    return {
      level: CATEGORY_LEVEL.L1,
      parentId: 0,
      parentName: undefined,
      l1Id: 0,
      l1Name: undefined,
      l2Id: 0,
      l2Name: undefined,
    };
  }

  if (parent.level === CATEGORY_LEVEL.L1) {
    return {
      level: CATEGORY_LEVEL.L2,
      parentId: parent.id,
      parentName: parent.name,
      l1Id: parent.id,
      l1Name: parent.name,
      l2Id: 0,
      l2Name: undefined,
    };
  }

  if (parent.level === CATEGORY_LEVEL.L2) {
    return {
      level: CATEGORY_LEVEL.L3,
      parentId: parent.id,
      parentName: parent.name,
      l1Id: parent.l1Id || parent.parentId,
      l1Name: parent.l1Name,
      l2Id: parent.id,
      l2Name: parent.name,
    };
  }

  return {
    level: CATEGORY_LEVEL.L1,
    parentId: 0,
    parentName: undefined,
    l1Id: 0,
    l1Name: undefined,
    l2Id: 0,
    l2Name: undefined,
  };
}

export const levelOptions = () =>
  createOptions([
    { value: CATEGORY_LEVEL.L1, meaning: getLevelMeaning(CATEGORY_LEVEL.L1) },
    { value: CATEGORY_LEVEL.L2, meaning: getLevelMeaning(CATEGORY_LEVEL.L2) },
    { value: CATEGORY_LEVEL.L3, meaning: getLevelMeaning(CATEGORY_LEVEL.L3) },
  ]);

export const statusOptions = () =>
  createOptions([
    {
      value: CATEGORY_STATUS.enabled,
      meaning: getStatusMeaning(CATEGORY_STATUS.enabled),
    },
    {
      value: CATEGORY_STATUS.stopped,
      meaning: getStatusMeaning(CATEGORY_STATUS.stopped),
    },
  ]);

export const categoryFields = () => [
  { name: 'id', type: FieldType.number },
  { name: 'tenantId', type: FieldType.number },
  {
    name: 'code',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.code`).d('编码'),
    maxLength: 255,
  },
  {
    name: 'codePrefix',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.codePrefix`).d('编码'),
    required: true,
    maxLength: 200,
    ignore: FieldIgnore.always,
    processValue: value =>
      typeof value === 'string' ? value.toUpperCase() : value,
    validator: value => {
      if (!value) {
        return true;
      }
      if (!/^[A-Z][A-Z_]*$/.test(value)) {
        return intl
          .get(`${intlPrefix}.validation.codePrefix`)
          .d('编码只能输入大写字母和下划线，且需以大写字母开头');
      }
      if (/_$/.test(value)) {
        return intl
          .get(`${intlPrefix}.validation.codePrefixEnd`)
          .d('编码末尾不需要输入下划线，系统会自动拼接后缀');
      }
      if (/_SYSTEM$|_DOMAIN$|_OBJECT$/.test(value)) {
        return intl
          .get(`${intlPrefix}.validation.codePrefixSuffix`)
          .d('无需输入_SYSTEM/_DOMAIN/_OBJECT后缀，系统会自动拼接');
      }
      return true;
    },
  },
  {
    name: 'codeSuffix',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.codeSuffix`).d('编码'),
    ignore: FieldIgnore.always,
  },
  {
    name: 'name',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.name`).d('目录名称'),
    required: true,
    maxLength: 255,
    trim: FieldTrim.both,
  },
  {
    name: 'sort',
    type: FieldType.number,
    label: intl.get(`${intlPrefix}.sort`).d('排序'),
    defaultValue: 0,
    validator: value => {
      if (value === undefined || value === null || value === '') {
        return true;
      }
      return Number(value) >= 0
        ? true
        : intl.get(`${intlPrefix}.validation.sort`).d('排序不能为负数');
    },
  },
  {
    name: 'level',
    type: FieldType.number,
    label: intl.get(`${intlPrefix}.level`).d('目录层级'),
    required: true,
    options: levelOptions(),
  },
  {
    name: 'parentId',
    type: FieldType.number,
    label: intl.get(`${intlPrefix}.parentId`).d('上级目录'),
    textField: 'meaning',
    valueField: 'value',
    idField: 'value',
    parentField: 'parentValue',
  },
  {
    name: 'parentName',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.parentName`).d('上级目录'),
  },
  {
    name: 'l1Id',
    type: FieldType.number,
    label: intl.get(`${intlPrefix}.l1Id`).d('所属体系'),
  },
  {
    name: 'l1Name',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.l1Name`).d('所属体系'),
  },
  {
    name: 'l2Id',
    type: FieldType.number,
    label: intl.get(`${intlPrefix}.l2Id`).d('所属主题域'),
  },
  {
    name: 'l2Name',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.l2Name`).d('所属主题域'),
  },
  {
    name: 'bizDesc',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.bizDesc`).d('业务释义'),
    maxLength: 255,
  },
  {
    name: 'status',
    type: FieldType.number,
    label: intl.get(`${intlPrefix}.status`).d('状态'),
    required: true,
    defaultValue: CATEGORY_STATUS.enabled,
    trueValue: CATEGORY_STATUS.enabled,
    falseValue: CATEGORY_STATUS.stopped,
    options: statusOptions(),
  },
  {
    name: 'statusName',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.statusName`).d('状态'),
  },
  { name: 'childrenCount', type: FieldType.number },
  { name: 'enabledChildrenCount', type: FieldType.number },
  { name: 'standardCount', type: FieldType.number },
];

export function flattenCategoryRows(rows: any[] = []): any[] {
  return rows.reduce((result, item) => {
    result.push(item);
    if (Array.isArray(item.children) && item.children.length > 0) {
      result.push(...flattenCategoryRows(item.children));
    }
    return result;
  }, []);
}

export function getCategoryRows(dataSet?: DataSet) {
  return flattenCategoryRows((dataSet?.toData() || []) as any[]);
}

export function createCategoryOptionDS(rows: any[]) {
  return new DataSet({
    selection: DataSetSelection.single,
    idField: 'value',
    parentField: 'parentValue',
    data: rows.map(item => ({
      ...item,
      value: item.id,
      parentValue: item.parentId || undefined,
      meaning: item.name,
    })),
  });
}
