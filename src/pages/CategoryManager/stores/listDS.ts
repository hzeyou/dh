import { AxiosRequestConfig } from 'axios';
import DataSet, { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import {
  DataSetSelection,
  DataToJSON,
  FieldIgnore,
  FieldTrim,
  FieldType,
} from 'choerodon-ui/dataset/data-set/enum';

import intl from 'utils/intl';

import { HG_SRM_API_PREFIX } from '@/utils/config';

export type CategoryLevel = 'L1' | 'L2' | 'L3';
export type CategoryStatus = 'ENABLED' | 'STOPPED';

export const CATEGORY_LEVEL: { [key: string]: CategoryLevel } = {
  L1: 'L1',
  L2: 'L2',
  L3: 'L3',
};

export const CATEGORY_STATUS: { [key: string]: CategoryStatus } = {
  enabled: 'ENABLED',
  stopped: 'STOPPED',
};

export const CATEGORY_API_PREFIX = `/_api${HG_SRM_API_PREFIX}/data-standard-categories`;

const intlPrefix = 'srm.categoryManager.model.category';

const levelMeaningMap = {
  [CATEGORY_LEVEL.L1]: intl.get(`${intlPrefix}.level.l1`).d('L1 体系'),
  [CATEGORY_LEVEL.L2]: intl.get(`${intlPrefix}.level.l2`).d('L2 主题域'),
  [CATEGORY_LEVEL.L3]: intl.get(`${intlPrefix}.level.l3`).d('L3 对象'),
};

const statusMeaningMap = {
  [CATEGORY_STATUS.enabled]: intl.get(`${intlPrefix}.status.enabled`).d('启用'),
  [CATEGORY_STATUS.stopped]: intl.get(`${intlPrefix}.status.stopped`).d('停用'),
};

const codeSuffixMap = {
  [CATEGORY_LEVEL.L1]: '_SYSTEM',
  [CATEGORY_LEVEL.L2]: '_DOMAIN',
  [CATEGORY_LEVEL.L3]: '_OBJECT',
};

function createOptions(data: Array<{ value: string; meaning: string }>) {
  return new DataSet({
    selection: false,
    data,
  });
}

export function getLevelMeaning(level?: string) {
  if (!level) {
    return '';
  }
  return levelMeaningMap[level] || level;
}

export function getStatusMeaning(status?: string) {
  if (!status) {
    return '';
  }
  return statusMeaningMap[status] || status;
}

export function getCodeSuffix(level?: string) {
  if (!level) {
    return '';
  }
  return codeSuffixMap[level] || '';
}

export function getChildLevel(level?: string): CategoryLevel | undefined {
  if (level === CATEGORY_LEVEL.L1) {
    return CATEGORY_LEVEL.L2;
  }
  if (level === CATEGORY_LEVEL.L2) {
    return CATEGORY_LEVEL.L3;
  }
  return undefined;
}

export function buildCategoryCode(prefix?: string, level?: string) {
  const value = `${prefix || ''}`.trim().replace(/_+$/, '');
  const suffix = getCodeSuffix(level);
  return value && suffix ? `${value}${suffix}` : undefined;
}

export function getHierarchyByParent(parent?: any) {
  if (!parent) {
    return {
      level: CATEGORY_LEVEL.L1,
      parentId: undefined,
      parentName: undefined,
      systemId: undefined,
      systemName: undefined,
      domainId: undefined,
      domainName: undefined,
    };
  }

  if (parent.level === CATEGORY_LEVEL.L1) {
    return {
      level: CATEGORY_LEVEL.L2,
      parentId: parent.categoryId,
      parentName: parent.categoryName,
      systemId: parent.categoryId,
      systemName: parent.categoryName,
      domainId: undefined,
      domainName: undefined,
    };
  }

  if (parent.level === CATEGORY_LEVEL.L2) {
    return {
      level: CATEGORY_LEVEL.L3,
      parentId: parent.categoryId,
      parentName: parent.categoryName,
      systemId: parent.systemId || parent.parentId,
      systemName: parent.systemName,
      domainId: parent.categoryId,
      domainName: parent.categoryName,
    };
  }

  return {
    level: CATEGORY_LEVEL.L1,
    parentId: undefined,
    parentName: undefined,
    systemId: undefined,
    systemName: undefined,
    domainId: undefined,
    domainName: undefined,
  };
}

function syncCategoryCode(record) {
  record.set(
    'categoryCode',
    buildCategoryCode(record.get('codePrefix'), record.get('level')),
  );
}

function syncHierarchyByParent(record, parent?: any) {
  const hierarchy = getHierarchyByParent(parent);

  Object.keys(hierarchy).forEach(key => {
    record.set(key, hierarchy[key]);
  });
  syncCategoryCode(record);
}

function cleanSubmitPayload(payload: any) {
  const result = { ...payload };
  [
    'codePrefix',
    'codeSuffix',
    'levelMeaning',
    'statusMeaning',
    'parentName',
    'systemName',
    'domainName',
    'children',
  ].forEach(key => delete result[key]);
  return result;
}

const levelOptions = () =>
  createOptions([
    { value: CATEGORY_LEVEL.L1, meaning: getLevelMeaning(CATEGORY_LEVEL.L1) },
    { value: CATEGORY_LEVEL.L2, meaning: getLevelMeaning(CATEGORY_LEVEL.L2) },
    { value: CATEGORY_LEVEL.L3, meaning: getLevelMeaning(CATEGORY_LEVEL.L3) },
  ]);

const statusOptions = () =>
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

export const queryFields = () => [
  {
    name: 'level',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.level`).d('目录层级'),
    options: levelOptions(),
  },
  {
    name: 'categoryCode',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.categoryCode`).d('编码'),
    trim: FieldTrim.both,
  },
  {
    name: 'categoryName',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.categoryName`).d('目录名称'),
    trim: FieldTrim.both,
  },
  {
    name: 'status',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.status`).d('状态'),
    options: statusOptions(),
  },
];

export const categoryFields = () => [
  { name: 'categoryId', type: FieldType.number },
  {
    name: 'categoryCode',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.categoryCode`).d('编码'),
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
    name: 'categoryName',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.categoryName`).d('目录名称'),
    required: true,
    maxLength: 240,
    trim: FieldTrim.both,
  },
  {
    name: 'level',
    type: FieldType.string,
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
    name: 'systemId',
    type: FieldType.number,
    label: intl.get(`${intlPrefix}.systemId`).d('所属体系'),
    textField: 'meaning',
    valueField: 'value',
  },
  {
    name: 'systemName',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.systemName`).d('所属体系'),
  },
  {
    name: 'domainId',
    type: FieldType.number,
    label: intl.get(`${intlPrefix}.domainId`).d('所属主题域'),
    textField: 'meaning',
    valueField: 'value',
  },
  {
    name: 'domainName',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.domainName`).d('所属主题域'),
  },
  {
    name: 'description',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.description`).d('业务释义'),
    maxLength: 1000,
  },
  {
    name: 'status',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.status`).d('状态'),
    required: true,
    defaultValue: CATEGORY_STATUS.enabled,
    options: statusOptions(),
  },
  {
    name: 'createdByName',
    type: FieldType.string,
    label: intl.get(`${intlPrefix}.createdByName`).d('创建者'),
  },
  { name: 'childrenCount', type: FieldType.number },
  { name: 'enabledChildrenCount', type: FieldType.number },
  { name: 'standardCount', type: FieldType.number },
];

export const treeDSConf = (): DataSetProps => ({
  paging: false,
  selection: DataSetSelection.single,
  primaryKey: 'categoryId',
  idField: 'categoryId',
  parentField: 'parentId',
  fields: categoryFields(),
  transport: {
    read: (): AxiosRequestConfig => ({
      url: `${CATEGORY_API_PREFIX}/tree`,
      method: 'get',
    }),
  },
});

export const listDSConf = (): DataSetProps => ({
  selection: false,
  autoQuery: false,
  primaryKey: 'categoryId',
  idField: 'categoryId',
  pageSize: 20,
  queryFields: queryFields(),
  fields: categoryFields(),
  transport: {
    read: ({ data, dataSet }): AxiosRequestConfig => ({
      url: CATEGORY_API_PREFIX,
      method: 'get',
      data: {
        ...data,
        selectedCategoryId: dataSet?.getState('selectedCategoryId'),
        selectedLevel: dataSet?.getState('selectedLevel'),
      },
    }),
  },
});

export const detailDSConf = (): DataSetProps => ({
  autoCreate: true,
  autoQueryAfterSubmit: false,
  primaryKey: 'categoryId',
  idField: 'categoryId',
  dataToJSON: DataToJSON.all,
  fields: categoryFields(),
  transport: {
    submit: ({ data, dataSet }): AxiosRequestConfig => {
      const mode = dataSet?.getState('mode');
      const current = dataSet?.current;
      const categoryId = current?.get('categoryId') || data?.[0]?.categoryId;
      const submittedCategoryCode =
        mode === 'create'
          ? buildCategoryCode(current?.get('codePrefix'), current?.get('level'))
          : current?.get('categoryCode') || data?.[0]?.categoryCode;
      const payload = cleanSubmitPayload({
        ...(current?.toJSONData() || data?.[0] || {}),
        categoryCode: submittedCategoryCode,
      });

      return {
        url:
          mode === 'create'
            ? CATEGORY_API_PREFIX
            : `${CATEGORY_API_PREFIX}/${categoryId}`,
        method: mode === 'create' ? 'post' : 'put',
        data: payload,
      };
    },
  },
  events: {
    update: ({ record, name, value }) => {
      if (!record) {
        return;
      }

      const dataSet = record.dataSet;
      const mode = dataSet?.getState('mode');
      const createSource = dataSet?.getState('createSource');

      if (name === 'codePrefix' || name === 'level') {
        record.set('codeSuffix', getCodeSuffix(record.get('level')));
        syncCategoryCode(record);
      }

      if (
        mode === 'create' &&
        createSource === 'toolbar' &&
        name === 'parentId'
      ) {
        const parentMap = dataSet?.getState('parentMap') || {};
        syncHierarchyByParent(record, parentMap[value]);
      }
    },
  },
});

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
      value: item.categoryId,
      parentValue: item.parentId,
      meaning: item.categoryName,
    })),
  });
}
