import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { DataToJSON } from 'choerodon-ui/dataset/data-set/enum';
import { HG_MDMF_API_PREFIX } from '@/utils/config';
import {
  buildCategoryCode,
  categoryFields,
  getCodeSuffix,
  getHierarchyByParent,
} from './commonDS';

function getCategoryCodePrefix(code?: string, level?: string | number) {
  const value = `${code || ''}`.trim();
  const suffix = getCodeSuffix(level);

  if (suffix && value.endsWith(suffix)) {
    return value.slice(0, -suffix.length);
  }
  return value;
}

function syncCategoryCode(record) {
  record.set(
    'code',
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
    'tenantId',
    'level',
    'levelMeaning',
    'statusMeaning',
    'parentName',
    'l1Id',
    'l1Name',
    'l2Id',
    'l2Name',
    'statusName',
    'sort',
    'children',
    'childrenCount',
    'enabledChildrenCount',
    'standardCount',
  ].forEach(key => delete result[key]);
  return result;
}

export const detailDSConf = (): DataSetProps => ({
  autoCreate: true,
  autoQueryAfterSubmit: false,
  primaryKey: 'id',
  idField: 'id',
  dataToJSON: DataToJSON.all,
  fields: categoryFields(),
  transport: {
    submit: ({ data, dataSet }): AxiosRequestConfig => {
      const mode = dataSet?.getState('mode');
      const current = dataSet?.current;
      const id = current?.get('id') || data?.[0]?.id;
      const currentCode = current?.get('code') || data?.[0]?.code;
      const currentLevel = current?.get('level') || data?.[0]?.level;
      const submittedCode =
        mode === 'create'
          ? current?.get('codePrefix') || data?.[0]?.codePrefix
          : getCategoryCodePrefix(currentCode, currentLevel);
      const payload = cleanSubmitPayload({
        ...(current?.toJSONData() || data?.[0] || {}),
        id,
        code: submittedCode,
      });
      if (!id) {
        delete payload.id;
      }
      if (payload.parentId === undefined || payload.parentId === null) {
        payload.parentId = 0;
      }

      return {
        url: `${HG_MDMF_API_PREFIX}/directories/save`,
        method: 'post',
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
