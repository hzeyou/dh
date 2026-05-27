import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _useDataSet from "choerodon-ui/pro/lib/use-data-set";
import _Steps from "@hzero-front-ui/c7n-ui/lib/Steps";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { observer } from 'mobx-react-lite';
import intl from 'utils/intl';
import { getResponse } from 'utils/utils';
import CreatePermissionDS, { DsStatus, FieldsNameTypes, FilterFieldsNameType, sqlQueryFieldsDS } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionPolicyDS";
import { PERMISSION_POLICY_CREATE_STEPS, PERMISSION_POLICY_DATA_RANGE } from "hzero-front-hmde/lib/constants/code";
import { BindType, DataSetValidateManage } from "hzero-front-hmde/lib/utils/validate";
import { PhysicalModelType } from "hzero-front-hmde/lib/constants/businessObject";
import { getBoFieldList } from "hzero-front-hmde/lib/services/processDefinition";
import { SQL_PARAM_CATEGORY } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/SqlMaintenance/datasets/sqlParamsDS";
import PermissionPolicyHead from "./components/PermissionPolicyHead";
import DataOperationPermission from "./components/DataOperatePermission";
import DataRangeControl from "./components/DataRangeControl";
import DataDesensitize from "./components/DataDesensitize";
import styles from "./index.less?modules";
const Step = _Steps.Step;
const ParentDataSetName = 'createPermissionDs';
const CreatePermissionPolicyModal = ({
  dataSet,
  baseInfoDs,
  modal
}) => {
  var _baseInfoDs$current2;
  const sqlQueryFieldsDs = _useDataSet(() => sqlQueryFieldsDS(), []);
  const createPermissionDs = _useDataSet(() => {
    var _baseInfoDs$current;
    return CreatePermissionDS({
      status: DsStatus.CREATE,
      physicalModelType: (_baseInfoDs$current = baseInfoDs.current) === null || _baseInfoDs$current === void 0 ? void 0 : _baseInfoDs$current.get('physicalModelType')
    });
  }, [(_baseInfoDs$current2 = baseInfoDs.current) === null || _baseInfoDs$current2 === void 0 ? void 0 : _baseInfoDs$current2.get('physicalModelType')]);
  const _useState = useState(PERMISSION_POLICY_CREATE_STEPS.HEADER),
    _useState2 = _slicedToArray(_useState, 2),
    currentStep = _useState2[0],
    setCurrentStep = _useState2[1];
  const _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    confirmLoading = _useState4[0],
    setConfirmLoading = _useState4[1];
  const MyDataSetValidateManage = useMemo(() => new DataSetValidateManage({
    name: ParentDataSetName,
    dataSet: createPermissionDs,
    bind: BindType.flat
  }), [createPermissionDs]);
  useEffect(() => {
    var _baseInfoDs$current3, _baseInfoDs$current4, _baseInfoDs$current5;
    // 设置权限策略编码信息
    const objectCode = (baseInfoDs === null || baseInfoDs === void 0 ? void 0 : (_baseInfoDs$current3 = baseInfoDs.current) === null || _baseInfoDs$current3 === void 0 ? void 0 : _baseInfoDs$current3.get('businessObjectCode')) || '';
    const domainCode = (baseInfoDs === null || baseInfoDs === void 0 ? void 0 : (_baseInfoDs$current4 = baseInfoDs.current) === null || _baseInfoDs$current4 === void 0 ? void 0 : _baseInfoDs$current4.get('domainCode')) || '';
    const physicalModelType = baseInfoDs === null || baseInfoDs === void 0 ? void 0 : (_baseInfoDs$current5 = baseInfoDs.current) === null || _baseInfoDs$current5 === void 0 ? void 0 : _baseInfoDs$current5.get('physicalModelType');
    const code = objectCode.slice(domainCode.length + 1);
    createPermissionDs.create({
      [FieldsNameTypes.BUSINESS_OBJECT_CODE]: objectCode,
      [FieldsNameTypes.CODE]: `${code}_`,
      [FieldsNameTypes.CODE_PREFIX]: `${domainCode}_`,
      [FieldsNameTypes.DATA_ADD]: physicalModelType !== PhysicalModelType.SQL,
      [FieldsNameTypes.DATA_RANGE]: PERMISSION_POLICY_DATA_RANGE.SELF_CREATED,
      [FieldsNameTypes.SENSITIVE_LIST]: []
    });
  }, []);
  useEffect(() => {
    createPermissionDs.setState('step', currentStep);
    if (currentStep === 2) {
      var _baseInfoDs$current6;
      const physicalModelType = baseInfoDs === null || baseInfoDs === void 0 ? void 0 : (_baseInfoDs$current6 = baseInfoDs.current) === null || _baseInfoDs$current6 === void 0 ? void 0 : _baseInfoDs$current6.get('physicalModelType');
      if (physicalModelType === PhysicalModelType.SQL) {
        var _baseInfoDs$current7, _baseInfoDs$current8;
        const query = {
          businessObjectCodeList: (_baseInfoDs$current7 = baseInfoDs.current) === null || _baseInfoDs$current7 === void 0 ? void 0 : _baseInfoDs$current7.get('businessObjectCode'),
          primaryKeyFlag: true,
          tenantId: (_baseInfoDs$current8 = baseInfoDs.current) === null || _baseInfoDs$current8 === void 0 ? void 0 : _baseInfoDs$current8.get('tenantId')
        };
        Object.assign(query, {
          useType: SQL_PARAM_CATEGORY.QUERY_PARAM,
          publishFlag: false
        }); // 权限策略这块查询拟定态数据
        getBoFieldList(query).then(res => {
          if (getResponse(res)) {
            const sqlQueryData = res.map(item => {
              return {
                [FilterFieldsNameType.LEFT_FIELD_TYPE]: item === null || item === void 0 ? void 0 : item.componentType,
                [FilterFieldsNameType.LEFT_FIELD_CODE]: `CASCADE(${item.businessObjectCode}.${item.businessObjectFieldCode})`,
                [FilterFieldsNameType.USE_TYPE]: SQL_PARAM_CATEGORY.QUERY_PARAM,
                [FilterFieldsNameType.RIGHT_VALUE_TYPE]: null,
                [FilterFieldsNameType.RIGHT_VALUE]: null
              };
            });
            sqlQueryFieldsDs.loadData(sqlQueryData);
          }
        });
      }
    }
  }, [currentStep]);

  /**
   * 获取钻取额外参数 sql对象时需要多穿一个useType查询sql对象的查询参数
   * @return
   */
  const getOtherDrillParam = () => {
    var _baseInfoDs$current9;
    const physicalModelType = baseInfoDs === null || baseInfoDs === void 0 ? void 0 : (_baseInfoDs$current9 = baseInfoDs.current) === null || _baseInfoDs$current9 === void 0 ? void 0 : _baseInfoDs$current9.get('physicalModelType');
    // 如果是 sql 对象 需要传 useType
    if (physicalModelType === PhysicalModelType.SQL) {
      return {
        useType: SQL_PARAM_CATEGORY.FIELD_PARAM
      };
    }
    return {};
  };

  // 渲染步骤条内容
  const renderStepContent = useMemo(() => {
    // 每一步对应的视图
    const renderMap = [/*#__PURE__*/React.createElement(PermissionPolicyHead, {
      dataSet: createPermissionDs
    }), /*#__PURE__*/React.createElement(DataOperationPermission, {
      dataSet: createPermissionDs
    }), [/*#__PURE__*/React.createElement(DataRangeControl, {
      dataSet: createPermissionDs,
      baseInfoDs: baseInfoDs,
      sqlQueryFieldsDs: sqlQueryFieldsDs,
      key: "control",
      otherDrillParams: getOtherDrillParam()
    }), /*#__PURE__*/React.createElement(DataDesensitize, {
      key: "desensitize",
      baseInfoDs: baseInfoDs,
      parentDataSetValidateNode: MyDataSetValidateManage.getDataSet(ParentDataSetName),
      parentDs: createPermissionDs
    })]];
    return renderMap[currentStep];
  }, [currentStep, createPermissionDs]);
  const handleCloseModal = useCallback(() => {
    modal === null || modal === void 0 ? void 0 : modal.close();
  }, [modal]);

  // 进行提交
  const handleSubmit = useCallback(async () => {
    setConfirmLoading(true);
    // 如果所有层级的 ds 校验成功则提交数据
    if (!(await MyDataSetValidateManage.validateDataSet())) {
      return false;
    }
    const flag = await createPermissionDs.forceSubmit();
    setConfirmLoading(false);
    if (flag) {
      handleCloseModal();
      dataSet.query();
      baseInfoDs.query();
    }
  }, [handleCloseModal]);

  // 上一步
  const handlePreviousStep = useCallback(() => {
    setCurrentStep(step => {
      const _step = step - 1;
      createPermissionDs.setState('step', _step);
      return _step;
    });
  }, []);

  // 下一步
  const handleNextStep = useCallback(() => {
    createPermissionDs.validate().then(() => {
      var _createPermissionDs$g, _createPermissionDs$g2;
      // ds进行数据校验，检查第一步中的名称、编码是否校验报错
      const flag = [(_createPermissionDs$g = createPermissionDs.getField(FieldsNameTypes.NAME)) === null || _createPermissionDs$g === void 0 ? void 0 : _createPermissionDs$g.isValid(createPermissionDs.current), (_createPermissionDs$g2 = createPermissionDs.getField(FieldsNameTypes.CODE)) === null || _createPermissionDs$g2 === void 0 ? void 0 : _createPermissionDs$g2.isValid(createPermissionDs.current)].every(i => i === true);
      if (flag) {
        setCurrentStep(currentStep + 1);
      }
    });
  }, [currentStep]);
  return /*#__PURE__*/React.createElement("div", {
    className: styles.wrapper
  }, /*#__PURE__*/React.createElement(_Steps, {
    current: currentStep,
    style: {
      marginBottom: '25px'
    }
  }, /*#__PURE__*/React.createElement(Step, {
    title: intl.get('hmde.bo.businessObject.perPolicyStatus1').d('策略基础')
  }), /*#__PURE__*/React.createElement(Step, {
    title: intl.get('hmde.bo.businessObject.perPolicyStatus2').d('数据操作权限')
  }), /*#__PURE__*/React.createElement(Step, {
    title: intl.get('hmde.bo.businessObject.perPolicyStatus3').d('数据范围控制')
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.content
  }, renderStepContent), /*#__PURE__*/React.createElement("div", {
    className: styles.footer
  }, /*#__PURE__*/React.createElement(_Button, {
    onClick: handleCloseModal
  }, intl.get('hmde.common.button.cancel').d('取消')), currentStep > 0 && /*#__PURE__*/React.createElement(_Button, {
    onClick: handlePreviousStep
  }, intl.get('hmde.common.prev').d('上一步')), currentStep < PERMISSION_POLICY_CREATE_STEPS.DATA_RANGE && /*#__PURE__*/React.createElement(_Button, {
    color: "primary",
    onClick: handleNextStep
  }, intl.get('hmde.common.next').d('下一步')), currentStep === PERMISSION_POLICY_CREATE_STEPS.DATA_RANGE && /*#__PURE__*/React.createElement(_Button, {
    color: "primary",
    loading: confirmLoading,
    onClick: handleSubmit
  }, intl.get('hmde.common.button.sure').d('确定'))));
};
export default observer(CreatePermissionPolicyModal);