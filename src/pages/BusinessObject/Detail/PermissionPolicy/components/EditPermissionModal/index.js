import _useDataSet from "choerodon-ui/pro/lib/use-data-set";
import React, { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import intl from 'hzero-front/lib/utils/intl';
import PermissionDetailDS, { DsStatus, FieldsNameTypes, FilterFieldsNameType } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionPolicyDS";
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
import { DataSetValidateManage, BindType } from "hzero-front-hmde/lib/utils/validate";
import { SQL_PARAM_CATEGORY } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/SqlMaintenance/datasets/sqlParamsDS";
import { getBoFieldList } from "hzero-front-hmde/lib/services/processDefinition";
import { mergeSqlQueryParam, resetDsOrderSql } from "hzero-front-hmde/lib/utils/common";
import { PhysicalModelType } from "hzero-front-hmde/lib/constants/businessObject";
import PermissionPolicyHead from "../CreatePermissionPolicyModal/components/PermissionPolicyHead";
import DataOperatePermission from "../CreatePermissionPolicyModal/components/DataOperatePermission";
import DataRangeControl from "../CreatePermissionPolicyModal/components/DataRangeControl";
import DataDesensitize from "../CreatePermissionPolicyModal/components/DataDesensitize";
import RangeContent from "../DistributePermissionModal/components/RangeContent";
import styles from "./index.less?modules";
const ParentDataSetName = 'editPermissionPolicyDs';

/**
 * 权限策略编辑(⚠️此组件被角色查询页面复用,修改需注意)
 * @param usedPermissionDs
 * @param baseInfoDs
 * @param isModify
 * @param modal
 * @param record
 * @constructor
 */
const EditPermissionModal = ({
  baseInfoDs,
  isModify,
  disabled = false,
  modal,
  record,
  onSubmitSuccess
}) => {
  var _boStore$getState, _boStore$getState2;
  const boStore = useBoStore();
  const hasPermission = (_boStore$getState = boStore === null || boStore === void 0 ? void 0 : (_boStore$getState2 = boStore.getState) === null || _boStore$getState2 === void 0 ? void 0 : _boStore$getState2.call(boStore, 'hasPermission')) !== null && _boStore$getState !== void 0 ? _boStore$getState : true;
  const editPermissionPolicyDs = _useDataSet(() => PermissionDetailDS({
    status: DsStatus.EDIT
  }), []);
  const MyDataSetValidateManage = useMemo(() => new DataSetValidateManage({
    name: ParentDataSetName,
    dataSet: editPermissionPolicyDs,
    bind: BindType.flat
  }), [editPermissionPolicyDs]);
  const getSqlQueryParam = sqlParamQuery => {
    return getBoFieldList(sqlParamQuery).then(_res => {
      const conditions = _res === null || _res === void 0 ? void 0 : _res.map(item => {
        item.fieldPath = `CASCADE(${item.businessObjectCode}.${item.businessObjectFieldCode})`; // eslint-disable-line
        item.useType = SQL_PARAM_CATEGORY.QUERY_PARAM;
        item.fieldType = 'FIELD';
        return item;
      });
      return conditions;
    });
  };

  // 初始化
  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    var _baseInfoDs$current, _baseInfoDs$current2, _baseInfoDs$current3;
    const sqlParamQuery = {
      businessObjectCodeList: (_baseInfoDs$current = baseInfoDs.current) === null || _baseInfoDs$current === void 0 ? void 0 : _baseInfoDs$current.get('businessObjectCode'),
      primaryKeyFlag: true,
      tenantId: (_baseInfoDs$current2 = baseInfoDs.current) === null || _baseInfoDs$current2 === void 0 ? void 0 : _baseInfoDs$current2.get('tenantId'),
      publishFlag: false,
      useType: SQL_PARAM_CATEGORY.QUERY_PARAM
    };
    const p1 = editPermissionPolicyDs.query(undefined, {
      groupId: record === null || record === void 0 ? void 0 : record.get('groupId')
    });
    const p2 = getSqlQueryParam(sqlParamQuery);
    const plist = [p1];
    if (((_baseInfoDs$current3 = baseInfoDs.current) === null || _baseInfoDs$current3 === void 0 ? void 0 : _baseInfoDs$current3.get('physicalModelType')) === PhysicalModelType.SQL) {
      plist.push(p2);
    }
    Promise.all(plist).then(res => {
      if (res.every(Boolean)) {
        var _baseInfoDs$current4;
        if (((_baseInfoDs$current4 = baseInfoDs.current) === null || _baseInfoDs$current4 === void 0 ? void 0 : _baseInfoDs$current4.get('physicalModelType')) === PhysicalModelType.SQL) {
          var _res$, _res$2, _editPermissionPolicy;
          const conditions = (_res$ = res[1]) === null || _res$ === void 0 ? void 0 : _res$.map(item => {
            return {
              [FilterFieldsNameType.LEFT_FIELD_TYPE]: item === null || item === void 0 ? void 0 : item.componentType,
              [FilterFieldsNameType.LEFT_FIELD_CODE]: `CASCADE(${item.businessObjectCode}.${item.businessObjectFieldCode})`,
              [FilterFieldsNameType.USE_TYPE]: SQL_PARAM_CATEGORY.QUERY_PARAM,
              [FilterFieldsNameType.RIGHT_VALUE_TYPE]: null,
              [FilterFieldsNameType.RIGHT_VALUE]: null
            };
          });
          const mergeData = mergeSqlQueryParam(conditions, (_res$2 = res[0]) === null || _res$2 === void 0 ? void 0 : _res$2.permissionDataFilterList, 'leftFieldCode');
          editPermissionPolicyDs === null || editPermissionPolicyDs === void 0 ? void 0 : (_editPermissionPolicy = editPermissionPolicyDs.children) === null || _editPermissionPolicy === void 0 ? void 0 : _editPermissionPolicy.permissionDataFilterList.loadData(mergeData);
        } else {
          var _editPermissionPolicy2, _res$3;
          editPermissionPolicyDs === null || editPermissionPolicyDs === void 0 ? void 0 : (_editPermissionPolicy2 = editPermissionPolicyDs.children) === null || _editPermissionPolicy2 === void 0 ? void 0 : _editPermissionPolicy2.permissionDataFilterList.loadData(((_res$3 = res[0]) === null || _res$3 === void 0 ? void 0 : _res$3.permissionDataFilterList) || []);
        }
      }
    });
  };
  useEffect(() => {
    modal === null || modal === void 0 ? void 0 : modal.handleOk(async () => {
      var _editPermissionPolicy3, _editPermissionPolicy4, _editPermissionPolicy5;
      if (!hasPermission) {
        return true;
      }
      if (!editPermissionPolicyDs.dirty && !(editPermissionPolicyDs !== null && editPermissionPolicyDs !== void 0 && (_editPermissionPolicy3 = editPermissionPolicyDs.children) !== null && _editPermissionPolicy3 !== void 0 && (_editPermissionPolicy4 = _editPermissionPolicy3.permissionDataFilterList) !== null && _editPermissionPolicy4 !== void 0 && _editPermissionPolicy4.dirty)) {
        return true;
      }
      // 如果所有层级的 ds 校验成功则提交数据
      if (!(await MyDataSetValidateManage.validateDataSet())) {
        return false;
      }
      resetDsOrderSql(editPermissionPolicyDs === null || editPermissionPolicyDs === void 0 ? void 0 : (_editPermissionPolicy5 = editPermissionPolicyDs.children) === null || _editPermissionPolicy5 === void 0 ? void 0 : _editPermissionPolicy5.permissionDataFilterList);
      if (await editPermissionPolicyDs.forceSubmit()) {
        onSubmitSuccess === null || onSubmitSuccess === void 0 ? void 0 : onSubmitSuccess();
        return true;
      }
      return false;
    });
  }, [modal, hasPermission, editPermissionPolicyDs, MyDataSetValidateManage]);

  /**
   * 获取钻取额外参数 sql对象时需要多穿一个useType查询sql对象的查询参数
   * @return
   */
  const getOtherDrillParam = () => {
    var _baseInfoDs$current5;
    const physicalModelType = baseInfoDs === null || baseInfoDs === void 0 ? void 0 : (_baseInfoDs$current5 = baseInfoDs.current) === null || _baseInfoDs$current5 === void 0 ? void 0 : _baseInfoDs$current5.get('physicalModelType');
    // 如果是 sql 对象 需要传 useType
    if (physicalModelType === PhysicalModelType.SQL) {
      return {
        useType: SQL_PARAM_CATEGORY.FIELD_PARAM
      };
    }
    return {};
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles.wrapper
  }, /*#__PURE__*/React.createElement(PermissionPolicyHead, {
    dataSet: editPermissionPolicyDs,
    formProps: {
      columns: 2
    },
    isModify: isModify,
    disabled: disabled,
    readOnly: !hasPermission || [FieldsNameTypes.CODE]
  }), /*#__PURE__*/React.createElement("h3", {
    className: styles.title
  }, intl.get('hmde.bo.businessObject.recordLevelPer').d('记录级权限')), /*#__PURE__*/React.createElement(DataOperatePermission, {
    dataSet: editPermissionPolicyDs,
    readOnly: !hasPermission || disabled
  }), /*#__PURE__*/React.createElement(DataRangeControl, {
    dataSet: editPermissionPolicyDs,
    baseInfoDs: baseInfoDs,
    customRangeContainerClassName: styles['custom-range-container'],
    readOnly: disabled,
    otherDrillParams: getOtherDrillParam()
  }), /*#__PURE__*/React.createElement(DataDesensitize, {
    parentDs: editPermissionPolicyDs,
    parentDataSetValidateNode: MyDataSetValidateManage.getDataSet(ParentDataSetName),
    baseInfoDs: baseInfoDs,
    readOnly: disabled
  }), /*#__PURE__*/React.createElement(RangeContent, {
    record: record
  }));
};
export default observer(EditPermissionModal);