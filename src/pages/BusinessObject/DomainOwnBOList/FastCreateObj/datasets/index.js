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
  fields: [{
    name: FN.BUSINESS_OBJECT_NAME,
    type: "intl",
    maxLength: 60,
    required: true
  }, {
    name: FN.BUSINESS_OBJECT_CODE,
    type: "string",
    format: 'uppercase',
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
    type: "boolean"
  }, {
    label: intl.get('hmde.common.label.physicalModelName').d('物理模型名称'),
    name: FN.PHYSICAL_MODEL_NAME,
    pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
    type: "string",
    maxLength: 56,
    defaultValidationMessages: {
      patternMismatch: intl.get('hmde.bo.businessObject.patternValidationLower').d('需以字母开头，支持字母、数字及下划线组合')
    },
    format: 'lowercase',
    dynamicProps: {
      required: ({
        record
      }) => !(record !== null && record !== void 0 && record.get(FN.IS_RELEVANCE_FLAG))
    },
    validator: (value, _, record) => {
      var _record$dataSet2;
      const list = record === null || record === void 0 ? void 0 : (_record$dataSet2 = record.dataSet) === null || _record$dataSet2 === void 0 ? void 0 : _record$dataSet2.toData();
      const repeatFlag = list.some(_rec => value && _rec[FN.PHYSICAL_MODEL_NAME] === value && (_rec === null || _rec === void 0 ? void 0 : _rec.id) !== (record === null || record === void 0 ? void 0 : record.get('id')));
      const responseFlag = record.get('physicalModelNameErrorCodes') && record.get('physicalModelNameErrorCodes') === value;
      if (repeatFlag || responseFlag) {
        return intl.get('hmde.bo.businessObjectphysicalModelName.repeat').d('物理模型名称重复');
      }
    }
  }, {
    label: intl.get('hmde.bo.businessObject.physicalModel').d('物理模型'),
    name: FN.PHYSICAL_MODEL,
    type: "object",
    lovCode: isTenant ? 'HMDE.BUSINESS_OBJECT.REF_TABLE' : 'HMDE.BUSINESS_OBJECT.REF_TABLE.SITE',
    ignore: "always",
    dynamicProps: {
      required: ({
        record
      }) => record === null || record === void 0 ? void 0 : record.get(FN.IS_RELEVANCE_FLAG),
      lovPara: ({
        dataSet
      }) => {
        var _dataSet$toData, _dataSet$toData$map, _dataSet$toData2, _dataSet$toData2$map;
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
    name: FN.PHYSICAL_MODEL_ID,
    type: "string",
    bind: `${FN.PHYSICAL_MODEL}.id`
  }, {
    label: intl.get('hmde.bo.businessObject.extendsTableName').d('扩展物理模型名称'),
    name: FN.EXTEND_STABLE_NAME,
    type: "string",
    pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
    format: 'lowercase',
    maxLength: 60,
    defaultValidationMessages: {
      patternMismatch: intl.get('hmde.bo.businessObject.patternValidationLower').d('需以字母开头，支持字母、数字及下划线组合')
    },
    validator: (value, _, record) => {
      var _record$dataSet3;
      const list = record === null || record === void 0 ? void 0 : (_record$dataSet3 = record.dataSet) === null || _record$dataSet3 === void 0 ? void 0 : _record$dataSet3.toData();
      const repeatFlag = list.some(_rec => value && _rec[FN.PHYSICAL_MODEL_NAME] === value && (_rec === null || _rec === void 0 ? void 0 : _rec.id) !== (record === null || record === void 0 ? void 0 : record.get('id')));
      const responseFlag = record.get('extPhysicalModelNamesErrorCodes') && record.get('extPhysicalModelNamesErrorCodes') === value;
      if (repeatFlag || responseFlag) {
        return intl.get('hmde.bo.businessObject.repeatextendsTableName').d('扩展物理模型名称相同');
      }
    }
  }, {
    label: intl.get('hmde.bo.businessObject.extPhysicalModel').d('扩展物理模型'),
    name: FN.EXT_PHYSICAL_MODEL,
    type: "object",
    ignore: "always",
    lovCode: isTenant ? 'HMDE.BUSINESS_OBJECT.REF_TABLE' : 'HMDE.BUSINESS_OBJECT.REF_TABLE.SITE',
    dynamicProps: {
      lovPara: ({
        dataSet
      }) => {
        var _dataSet$toData3, _dataSet$toData3$map, _dataSet$toData4, _dataSet$toData4$map;
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
    },
    validator: (value, _, record) => {
      var _record$get;
      if (value !== null && value !== void 0 && value.name && (value === null || value === void 0 ? void 0 : value.name) === ((_record$get = record.get(FN.PHYSICAL_MODEL)) === null || _record$get === void 0 ? void 0 : _record$get.name)) {
        return intl.get('hmde.bo.businessObject.physicalModelName.repeat1').d('关联的物理模型与扩展物理模型名不能相同');
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
          [FN.PHYSICAL_MODEL_NAME]: undefined,
          [FN.PHYSICAL_MODEL]: undefined,
          [FN.EXTEND_STABLE_NAME]: undefined,
          [FN.EXT_PHYSICAL_MODEL]: undefined
        });
        record.setState('physicalModelNameEditFlag', undefined);
        extendTableEnabledFlag && record.setState('extendsTableNameEditFlag', undefined);
        if (value === false && record.get(FN.BUSINESS_OBJECT_CODE)) {
          // 物理模型名称、扩展物理模型默认值
          record.set({
            [FN.PHYSICAL_MODEL_NAME]: `${domainCode}_${record.get(FN.BUSINESS_OBJECT_CODE)}`
          });
          extendTableEnabledFlag && record.set({
            [FN.EXTEND_STABLE_NAME]: `${domainCode}_${record.get(FN.BUSINESS_OBJECT_CODE)}_${extendTableSuffix}`
          });
        }
      }
      if (name === FN.PHYSICAL_MODEL) {
        // 物理模型
        record.set({
          [FN.PHYSICAL_MODEL_NAME]: value === null || value === void 0 ? void 0 : value.name
        });
        if (record.getState('businessObjectCodeEditFlag') !== true) {
          var _value$name;
          // 业务对象编码没有维护过，判断前缀是否相同
          const len = domainCode.length;
          const flag = (value === null || value === void 0 ? void 0 : value.name.slice(0, len)) === domainCode.toLowerCase();
          record.set({
            [FN.BUSINESS_OBJECT_CODE]: flag ? deleteUnderline(value === null || value === void 0 ? void 0 : (_value$name = value.name) === null || _value$name === void 0 ? void 0 : _value$name.slice(len)) : value === null || value === void 0 ? void 0 : value.name
          });
        }
      }
      if (name === FN.EXT_PHYSICAL_MODEL) {
        // 扩展物理模型
        record.set({
          [FN.EXTEND_STABLE_NAME]: value === null || value === void 0 ? void 0 : value.name,
          [FN.EXTEND_STABLE_ID]: value === null || value === void 0 ? void 0 : value.id
        });
      }
      if (name === FN.BUSINESS_OBJECT_CODE && record.get(FN.IS_RELEVANCE_FLAG) === false) {
        // 维护业务对象编码自动维护物理模型名称、扩展物理模型
        !record.getState('physicalModelNameEditFlag') && record.set({
          [FN.PHYSICAL_MODEL_NAME]: value ? `${domainCode}_${value}` : ''
        });
        extendTableEnabledFlag && !record.getState('extendsTableNameEditFlag') && record.set({
          [FN.EXTEND_STABLE_NAME]: value ? `${domainCode}_${value}_${extendTableSuffix}` : ''
        });
      }
    }
  }
});
export { formDatasetProps };
/**
 * 去除字符串开头的下划线
 * @param str string
 */
const deleteUnderline = str => {
  if ((str === null || str === void 0 ? void 0 : str.charAt(0)) === '_') {
    return deleteUnderline(str === null || str === void 0 ? void 0 : str.slice(1));
  } else {
    return str;
  }
};