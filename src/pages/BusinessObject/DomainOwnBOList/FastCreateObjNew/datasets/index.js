import _DataSet from "choerodon-ui/pro/lib/data-set";
import { FieldType, FieldIgnore } from 'choerodon-ui/pro/lib/data-set/enum';
import intl from 'utils/intl';
import { isTenantRoleLevel } from 'utils/utils';
import { FN } from "../type";
const isTenant = isTenantRoleLevel();
const formDatasetProps = ({
  domainCode,
  extendTableEnabledFlag,
  extendTableSuffix,
  serviceCode
}) => ({
  forceValidate: true,
  paging: false,
  fields: [{
    name: FN.BUSINESS_OBJECT_NAME,
    type: "intl",
    maxLength: 60,
    required: true,
    label: intl.get('hmde.common.busObjectName').d('业务对象名称')
  }, {
    name: FN.BUSINESS_OBJECT_CODE,
    type: "string",
    format: 'uppercase',
    label: intl.get('hmde.common.busObjectCode').d('业务对象编码'),
    required: true,
    pattern: /^[A-Z0-9_]*$/,
    defaultValidationMessages: {
      patternMismatch: intl.get('hmde.bo.businessObject.patternValidation').d('支持大写字母、数字及下划线组合')
    },
    validator: (value, _, record) => {
      var _record$dataSet;
      const list = record === null || record === void 0 ? void 0 : (_record$dataSet = record.dataSet) === null || _record$dataSet === void 0 ? void 0 : _record$dataSet.toData();
      const repeatFlag = list.some(_rec => _rec[FN.BUSINESS_OBJECT_CODE] === value && (_rec === null || _rec === void 0 ? void 0 : _rec.id) !== (record === null || record === void 0 ? void 0 : record.get('id')));
      const responseFlag = record.get('objectErrorCodes') && `${domainCode}_${value}` === record.get('objectErrorCodes');
      if (repeatFlag || responseFlag) {
        return intl.get('hmde.bo.businessObject.rule.code.repeat').d('业务对象编码重复');
      }
    }
  }, {
    name: FN.IS_RELEVANCE_FLAG,
    type: "number",
    defaultValue: false,
    required: true,
    label: intl.get('hmde.bo.businessObject.isphysicalModelName').d('是否关联物理模型'),
    options: new _DataSet({
      paging: false,
      data: [{
        value: 1,
        meaning: intl.get('hmde.common.link').d('关联')
      }, {
        value: 0,
        meaning: intl.get('hmde.common.nolLink').d('不关联')
      }]
    })
  }, {
    label: intl.get('hmde.common.label.physicalModelName').d('物理模型名称'),
    name: FN.PHYSICAL_MODEL_NAME_NEW,
    validator: (value, _, record) => {
      var _record$dataSet2;
      if (record !== null && record !== void 0 && record.get(FN.IS_RELEVANCE_FLAG)) {
        return true;
      }
      const list = record === null || record === void 0 ? void 0 : (_record$dataSet2 = record.dataSet) === null || _record$dataSet2 === void 0 ? void 0 : _record$dataSet2.toData();
      const repeatFlag = list.some(_rec => value && _rec[FN.PHYSICAL_MODEL_NAME_NEW] === value && (_rec === null || _rec === void 0 ? void 0 : _rec.id) !== (record === null || record === void 0 ? void 0 : record.get('id')));
      const responseFlag = record.get('physicalModelNameErrorCodes') && record.get('physicalModelNameErrorCodes') === value;
      if (repeatFlag || responseFlag) {
        return intl.get('hmde.bo.businessObjectphysicalModelName.repeat').d('物理模型名称重复');
      }
    },
    computedProps: {
      required: ({
        record
      }) => !(record !== null && record !== void 0 && record.get(FN.IS_RELEVANCE_FLAG)),
      type: ({
        record
      }) => {
        if (record !== null && record !== void 0 && record.get(FN.IS_RELEVANCE_FLAG)) {
          return "object";
        }
        return "string";
      },
      pattern: ({
        record
      }) => {
        if (!(record !== null && record !== void 0 && record.get(FN.IS_RELEVANCE_FLAG))) {
          return /^[a-zA-Z]\w*$/;
        }
      },
      maxLength: ({
        record
      }) => {
        if (!(record !== null && record !== void 0 && record.get(FN.IS_RELEVANCE_FLAG))) {
          return 56;
        }
      },
      defaultValidationMessages: ({
        record
      }) => {
        if (!(record !== null && record !== void 0 && record.get(FN.IS_RELEVANCE_FLAG))) {
          return {
            patternMismatch: intl.get('hmde.bo.businessObject.patternValidationLower').d('需以字母开头，支持字母、数字及下划线组合')
          };
        }
      },
      format: ({
        record
      }) => {
        if (!(record !== null && record !== void 0 && record.get(FN.IS_RELEVANCE_FLAG))) {
          return 'lowercase';
        }
      },
      lovCode: ({
        record
      }) => {
        if (record !== null && record !== void 0 && record.get(FN.IS_RELEVANCE_FLAG)) {
          return isTenant ? 'HMDE.BUSINESS_OBJECT.REF_TABLE' : 'HMDE.BUSINESS_OBJECT.REF_TABLE.SITE';
        }
      },
      ignore: ({
        record
      }) => {
        if (record !== null && record !== void 0 && record.get(FN.IS_RELEVANCE_FLAG)) {
          return "always";
        }
      },
      lovPara: ({
        dataSet,
        record
      }) => {
        var _dataSet$toData, _dataSet$toData$map, _dataSet$toData2, _dataSet$toData2$map;
        if (!(record !== null && record !== void 0 && record.get(FN.IS_RELEVANCE_FLAG))) {
          return undefined;
        }
        const physicalModelList = dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$toData = dataSet.toData()) === null || _dataSet$toData === void 0 ? void 0 : (_dataSet$toData$map = _dataSet$toData.map(item => {
          var _item$physicalModel;
          return item === null || item === void 0 ? void 0 : (_item$physicalModel = item.physicalModel) === null || _item$physicalModel === void 0 ? void 0 : _item$physicalModel.code;
        })) === null || _dataSet$toData$map === void 0 ? void 0 : _dataSet$toData$map.filter(Boolean);
        const extPhysicalModelList = extendTableEnabledFlag && (dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$toData2 = dataSet.toData()) === null || _dataSet$toData2 === void 0 ? void 0 : (_dataSet$toData2$map = _dataSet$toData2.map(item => {
          var _item$extPhysicalMode;
          return item === null || item === void 0 ? void 0 : (_item$extPhysicalMode = item.extPhysicalModel) === null || _item$extPhysicalMode === void 0 ? void 0 : _item$extPhysicalMode.code;
        })) === null || _dataSet$toData2$map === void 0 ? void 0 : _dataSet$toData2$map.filter(Boolean));
        return {
          excludeTableCodeList: [...physicalModelList, ...(extPhysicalModelList || [])].toString(),
          serviceCode,
          tableCategoryList: 'STANDARD',
          tableTypeList: 'POSITIVE,REVERSE'
        };
      }
    }
  }, {
    label: intl.get('hmde.bo.businessObject.extendsTableName').d('扩展物理模型名称'),
    name: FN.EXTEND_STABLE_NAME_NEW,
    validator: (value, _, record) => {
      var _record$dataSet3;
      if (record !== null && record !== void 0 && record.get(FN.IS_RELEVANCE_FLAG)) {
        return true;
      }
      const list = record === null || record === void 0 ? void 0 : (_record$dataSet3 = record.dataSet) === null || _record$dataSet3 === void 0 ? void 0 : _record$dataSet3.toData();
      const repeatFlag = list.some(_rec => value && _rec[FN.PHYSICAL_MODEL_NAME_NEW] === value && (_rec === null || _rec === void 0 ? void 0 : _rec.id) !== (record === null || record === void 0 ? void 0 : record.get('id')));
      const responseFlag = record.get('extPhysicalModelNamesErrorCodes') && record.get('extPhysicalModelNamesErrorCodes') === value;
      if (repeatFlag || responseFlag) {
        return intl.get('hmde.bo.businessObject.repeatextendsTableName').d('扩展物理模型名称相同');
      }
    },
    computedProps: {
      type: ({
        record
      }) => {
        if (record !== null && record !== void 0 && record.get(FN.IS_RELEVANCE_FLAG)) {
          return "object";
        }
        return "string";
      },
      pattern: ({
        record
      }) => {
        if (!(record !== null && record !== void 0 && record.get(FN.IS_RELEVANCE_FLAG))) {
          return /^[a-zA-Z]\w*$/;
        }
      },
      maxLength: ({
        record
      }) => {
        if (!(record !== null && record !== void 0 && record.get(FN.IS_RELEVANCE_FLAG))) {
          return 60;
        }
      },
      defaultValidationMessages: ({
        record
      }) => {
        if (!(record !== null && record !== void 0 && record.get(FN.IS_RELEVANCE_FLAG))) {
          return {
            patternMismatch: intl.get('hmde.bo.businessObject.patternValidationLower').d('需以字母开头，支持字母、数字及下划线组合')
          };
        }
      },
      format: ({
        record
      }) => {
        if (!(record !== null && record !== void 0 && record.get(FN.IS_RELEVANCE_FLAG))) {
          return 'lowercase';
        }
      },
      lovCode: ({
        record
      }) => {
        if (record !== null && record !== void 0 && record.get(FN.IS_RELEVANCE_FLAG)) {
          return isTenant ? 'HMDE.BUSINESS_OBJECT.REF_TABLE' : 'HMDE.BUSINESS_OBJECT.REF_TABLE.SITE';
        }
      },
      ignore: ({
        record
      }) => {
        if (record !== null && record !== void 0 && record.get(FN.IS_RELEVANCE_FLAG)) {
          return "always";
        }
      },
      lovPara: ({
        dataSet,
        record
      }) => {
        var _dataSet$toData3, _dataSet$toData3$map, _dataSet$toData4, _dataSet$toData4$map;
        if (!(record !== null && record !== void 0 && record.get(FN.IS_RELEVANCE_FLAG))) {
          return undefined;
        }
        const physicalModelList = dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$toData3 = dataSet.toData()) === null || _dataSet$toData3 === void 0 ? void 0 : (_dataSet$toData3$map = _dataSet$toData3.map(item => {
          var _item$physicalModel2;
          return item === null || item === void 0 ? void 0 : (_item$physicalModel2 = item.physicalModel) === null || _item$physicalModel2 === void 0 ? void 0 : _item$physicalModel2.code;
        })) === null || _dataSet$toData3$map === void 0 ? void 0 : _dataSet$toData3$map.filter(Boolean);
        const extPhysicalModelList = extendTableEnabledFlag && (dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$toData4 = dataSet.toData()) === null || _dataSet$toData4 === void 0 ? void 0 : (_dataSet$toData4$map = _dataSet$toData4.map(item => {
          var _item$extPhysicalMode2;
          return item === null || item === void 0 ? void 0 : (_item$extPhysicalMode2 = item.extPhysicalModel) === null || _item$extPhysicalMode2 === void 0 ? void 0 : _item$extPhysicalMode2.code;
        })) === null || _dataSet$toData4$map === void 0 ? void 0 : _dataSet$toData4$map.filter(Boolean));
        return {
          excludeTableCodeList: [...physicalModelList, ...(extPhysicalModelList || [])].toString(),
          serviceCode,
          tableCategoryList: 'REDUNDANT_INHERIT,REDUNDANT_X',
          tableTypeList: 'POSITIVE,REVERSE'
        };
      }
    }
  }],
  events: {
    update: ({
      record,
      name,
      value
    }) => {
      if (name === FN.IS_RELEVANCE_FLAG) {
        // 是否关联
        record.set({
          [FN.PHYSICAL_MODEL_NAME_NEW]: undefined,
          [FN.EXTEND_STABLE_NAME_NEW]: undefined
        });
        record.setState('physicalModelNameEditFlag', undefined);
        extendTableEnabledFlag && record.setState('extendsTableNameEditFlag', undefined);
        if (!value && record.get(FN.BUSINESS_OBJECT_CODE)) {
          // 物理模型名称、扩展物理模型默认值
          record.set({
            [FN.PHYSICAL_MODEL_NAME_NEW]: `${domainCode}_${record.get(FN.BUSINESS_OBJECT_CODE)}`
          });
          extendTableEnabledFlag && record.set({
            [FN.EXTEND_STABLE_NAME_NEW]: `${domainCode}_${record.get(FN.BUSINESS_OBJECT_CODE)}_${extendTableSuffix}`
          });
        }
      }
      if (name === FN.BUSINESS_OBJECT_CODE && !record.get(FN.IS_RELEVANCE_FLAG)) {
        // 维护业务对象编码自动维护物理模型名称、扩展物理模型
        !record.getState('physicalModelNameEditFlag') && record.set({
          [FN.PHYSICAL_MODEL_NAME_NEW]: value ? `${domainCode}_${value}` : ''
        });
        extendTableEnabledFlag && !record.getState('extendsTableNameEditFlag') && record.set({
          [FN.EXTEND_STABLE_NAME_NEW]: value ? `${domainCode}_${value}_${extendTableSuffix}` : ''
        });
      }
    }
  }
});
export { formDatasetProps };