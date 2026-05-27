import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _extends from "@babel/runtime/helpers/esm/extends";
import _Switch from "@hzero-front-ui/c7n-ui/lib/SwitchPro";
import _useModal from "choerodon-ui/pro/lib/use-modal";
import _SelectBox from "@hzero-front-ui/c7n-ui/lib/SelectBoxPro";
import _sortBy from "lodash/sortBy";
/**
 * ⚠️ 该模块被 apaas plugin 导出
 */
import React, { useCallback, useRef, useMemo, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import intl from 'utils/intl';
import CustomSqlModal from 'hzero-front-apaas/lib/components/CustomSqlModal';
import { useRequest } from 'ahooks';
import { getResponse } from 'utils/utils';
import { getVariableList } from "hzero-front-apaas/lib/components/CustomSqlModal/service";
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import { FieldsNameTypes, FilterFieldsNameType } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionPolicyDS";
import { PERMISSION_POLICY_DATA_RANGE } from "hzero-front-hmde/lib/constants/code";
import { getOnlyMasterFlagHelp, rendererDataRanges } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/PermissionPolicy/utils/form";
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
import BOPermissionButton from "hzero-front-hmde/lib/routes/BusinessObject/Detail/components/BOPermissionButton";
import { SQL_PARAM_CATEGORY } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/SqlMaintenance/datasets/sqlParamsDS";
import DataRangeItem from "./components/DataRangItem";
import styles from "./index.less?modules";
import OrgStructure from "./components/OrgStructure";
import { getCommonDataRangeService } from "hzero-front-hmde/lib/services/permissionPolicy";
const Option = _SelectBox.Option;

/**
 * 数据范围控制
 * @param dataSet
 * @param baseInfoDs
 * @param readOnly
 * @param customRangeContainerClassName
 * @constructor
 */
const DataRangeControl = ({
  dataSet,
  baseInfoDs,
  readOnly,
  customRangeContainerClassName,
  pageEnter = false,
  businessObjectCode,
  sqlQueryFieldsDs,
  otherDrillParams
}) => {
  var _boStore$getState, _dataSet$current, _dataSet$children, _dataSet$children$Fie, _dataSet$current4, _dataSet$current4$get, _dataSet$current4$get2, _dataSet$current5;
  const boStore = useBoStore();
  const hasPermission = (_boStore$getState = boStore === null || boStore === void 0 ? void 0 : boStore.getState('hasPermission')) !== null && _boStore$getState !== void 0 ? _boStore$getState : true;
  const formBodyRef = useRef(null);
  const Modal = _useModal();
  const _useRequest = useRequest(() => getVariableList('SQL'), {
      staleTime: -1
    }),
    predefineList = _useRequest.data;

  // 数据范围控制字段
  const dataRangeControlItem = [{
    render: _SelectBox,
    children: [/*#__PURE__*/React.createElement(Option, {
      value: PERMISSION_POLICY_DATA_RANGE.SELF_CREATED,
      key: PERMISSION_POLICY_DATA_RANGE.SELF_CREATED
    }, intl.get('hmde.common.text.myself').d('本人')), /*#__PURE__*/React.createElement(Option, {
      value: PERMISSION_POLICY_DATA_RANGE.ALL,
      key: PERMISSION_POLICY_DATA_RANGE.ALL
    }, intl.get('hmde.common.all').d('所有')), /*#__PURE__*/React.createElement(Option, {
      value: PERMISSION_POLICY_DATA_RANGE.CUSTOM,
      key: PERMISSION_POLICY_DATA_RANGE.CUSTOM
    }, intl.get('hmde.common.custom').d('自定义'))],
    props: {
      name: FieldsNameTypes.DATA_RANGE,
      key: FieldsNameTypes.DATA_RANGE,
      renderer: rendererDataRanges
    }
  }, {
    render: _Switch,
    props: {
      ...getOnlyMasterFlagHelp(),
      name: FieldsNameTypes.ONLY_MASTER_FLAG,
      key: FieldsNameTypes.ONLY_MASTER_FLAG,
      renderer: ({
        value
      }) => {
        return value ? intl.get('hmde.common.yes').d('是') : intl.get('hmde.common.no').d('否');
      },
      hidden: ((_dataSet$current = dataSet.current) === null || _dataSet$current === void 0 ? void 0 : _dataSet$current.get(FieldsNameTypes.DATA_RANGE)) === PERMISSION_POLICY_DATA_RANGE.ALL
    }
  }];
  const renderFormContent = useCallback(editableFormItems => {
    // form 每一项属性
    return editableFormItems.map(item => {
      if (readOnly) {
        return /*#__PURE__*/React.createElement(_Output, _extends({
          key: item.props.name
        }, item.props));
      } else {
        return /*#__PURE__*/React.createElement(item.render, item.props, item.children);
      }
    });
  }, [readOnly]);
  const _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    commonDataRange = _useState2[0],
    setCommonDataRange = _useState2[1];
  // 获取常用数据范围
  useEffect(() => {
    getCommonDataRangeService().then(res => {
      if (getResponse(res)) {
        setCommonDataRange(res || []);
      }
    });
  }, []);
  const setLogicFormula = (deleteFlag = false) => {
    if (dataSet.current) {
      var _dataSet$current$get, _dataSet$current2, _dataSet$current$get2, _dataSet$current3;
      const optionConditionList = dataSet.children.permissionDataFilterList.toData().filter(i => !(i !== null && i !== void 0 && i[FilterFieldsNameType.USE_TYPE]));
      dataSet.current.set('logicFormula', deleteFlag ? optionConditionList === null || optionConditionList === void 0 ? void 0 : optionConditionList.map((_, i) => i + 1).join(' AND ') : `${(_dataSet$current$get = (_dataSet$current2 = dataSet.current).get) !== null && _dataSet$current$get !== void 0 && _dataSet$current$get.call(_dataSet$current2, 'logicFormula') ? `${(_dataSet$current$get2 = (_dataSet$current3 = dataSet.current).get) === null || _dataSet$current$get2 === void 0 ? void 0 : _dataSet$current$get2.call(_dataSet$current3, 'logicFormula')} AND ` : ''}${optionConditionList.length}`);
    }
  };
  const openSqlModal = (record, sqlReadOnly) => {
    return Modal.open({
      closable: true,
      destroyOnClose: true,
      children: /*#__PURE__*/React.createElement(CustomSqlModal, {
        textField: FilterFieldsNameType.EXPRESSTION_NAME,
        valueField: FilterFieldsNameType.RIGHT_VALUE,
        record: record,
        readOnly: sqlReadOnly
      }),
      style: {
        width: '957px'
      }
    });
  };
  if (sqlQueryFieldsDs !== null && sqlQueryFieldsDs !== void 0 && sqlQueryFieldsDs.records && !(dataSet !== null && dataSet !== void 0 && (_dataSet$children = dataSet.children) !== null && _dataSet$children !== void 0 && (_dataSet$children$Fie = _dataSet$children[FieldsNameTypes.DATA_FILTER_LIST]) !== null && _dataSet$children$Fie !== void 0 && _dataSet$children$Fie.some(childRecord => (childRecord === null || childRecord === void 0 ? void 0 : childRecord.get('useType')) === SQL_PARAM_CATEGORY.QUERY_PARAM)) // 防止重复添加
  ) {
    var _dataSet$children2;
    // 如果有sqlQueryFieldsDs则表示新建态 新建时sql查询参数追加到ds中
    const sqlQueryFieldsRecord = sqlQueryFieldsDs.records || [];
    dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$children2 = dataSet.children) === null || _dataSet$children2 === void 0 ? void 0 : _dataSet$children2[FieldsNameTypes.DATA_FILTER_LIST].appendData(sqlQueryFieldsRecord);
  }
  let rangeData = ((_dataSet$current4 = dataSet.current) === null || _dataSet$current4 === void 0 ? void 0 : (_dataSet$current4$get = _dataSet$current4.getCascadeRecords) === null || _dataSet$current4$get === void 0 ? void 0 : (_dataSet$current4$get2 = _dataSet$current4$get.call(_dataSet$current4, 'permissionDataFilterList')) === null || _dataSet$current4$get2 === void 0 ? void 0 : _dataSet$current4$get2.sort((a, b) => (a === null || a === void 0 ? void 0 : a.get('orderSeq')) - (b === null || b === void 0 ? void 0 : b.get('orderSeq')))) || [];
  // 对 useType 排序
  rangeData = _sortBy(rangeData, r => {
    return (r === null || r === void 0 ? void 0 : r.get(FilterFieldsNameType.USE_TYPE)) === SQL_PARAM_CATEGORY.QUERY_PARAM ? -1 : 1;
  }) || [];
  const customDataRangeRecords = [...rangeData];
  const renderContent = () => {
    return customDataRangeRecords === null || customDataRangeRecords === void 0 ? void 0 : customDataRangeRecords.map((record, index, arr) => {
      var _baseInfoDs$current;
      return /*#__PURE__*/React.createElement("div", {
        className: styles['field-wrapper']
      }, /*#__PURE__*/React.createElement(DataRangeItem, {
        key: record.id,
        openSqlModal: openSqlModal,
        record: record,
        index: index,
        customDataRangeRecords: customDataRangeRecords,
        businessObjectCode: businessObjectCode || (baseInfoDs === null || baseInfoDs === void 0 ? void 0 : (_baseInfoDs$current = baseInfoDs.current) === null || _baseInfoDs$current === void 0 ? void 0 : _baseInfoDs$current.get('businessObjectCode')) || '',
        baseInfoDs: baseInfoDs,
        disabled: readOnly || !hasPermission,
        predefineList: predefineList,
        commonDataRange: commonDataRange,
        handleCreateItem: handleCreateItem,
        deleteIcon: !readOnly && /*#__PURE__*/React.createElement(ImgIcon, {
          name: "delete-B16@1x.svg",
          size: 16,
          style: {
            cursor: 'pointer'
          },
          hidden: arr.length === 1,
          onClick: () => {
            dataSet.children.permissionDataFilterList.delete(record, false).then(() => {
              var _dataSet$children$per, _dataSet$children$per2;
              (_dataSet$children$per = dataSet.children.permissionDataFilterList) === null || _dataSet$children$per === void 0 ? void 0 : (_dataSet$children$per2 = _dataSet$children$per.forEach) === null || _dataSet$children$per2 === void 0 ? void 0 : _dataSet$children$per2.call(_dataSet$children$per, (r, i) => r === null || r === void 0 ? void 0 : r.set('orderSeq', i + 1));
              setLogicFormula(true);
            });
          }
        }),
        otherDrillParams: otherDrillParams
      }));
    });
  };
  const labelList = useMemo(() => {
    return [intl.get('hmde.common.fieldName').d('字段名称'), intl.get('hmde.bo.businessObject.LogicalSymbol').d('逻辑符'), intl.get('hmde.bo.businessObject.valueType').d('取值类型'), intl.get('hmde.bo.businessObject.price').d('值')];
  }, []);
  const handleCreateItem = (createData = {}, id) => {
    if (!id) {
      dataSet.children.permissionDataFilterList.create(createData);
      setLogicFormula === null || setLogicFormula === void 0 ? void 0 : setLogicFormula();
    } else {
      dataSet.children.permissionDataFilterList.forEach(v => {
        if (v.id === id) {
          v === null || v === void 0 ? void 0 : v.set('leftFieldCode', createData === null || createData === void 0 ? void 0 : createData.leftFieldCode);
          v === null || v === void 0 ? void 0 : v.set('leftFieldName', '');
          v === null || v === void 0 ? void 0 : v.set('leftFieldType', createData === null || createData === void 0 ? void 0 : createData.leftFieldType);
          v === null || v === void 0 ? void 0 : v.set('operatorType', createData === null || createData === void 0 ? void 0 : createData.operatorType);
          v === null || v === void 0 ? void 0 : v.set('rightValue', createData === null || createData === void 0 ? void 0 : createData.rightValue);
          v === null || v === void 0 ? void 0 : v.set('templateName', createData === null || createData === void 0 ? void 0 : createData.templateName);
        }
      });
    }
  };
  const openOrgModal = () => {
    return Modal.open({
      title: intl.get('hmde.bo.businessObject.commonDataRange').d('常用数据范围'),
      closable: true,
      destroyOnClose: true,
      children: /*#__PURE__*/React.createElement(OrgStructure, {
        baseInfoDs: baseInfoDs,
        commonDataRange: commonDataRange,
        handleCreateItem: handleCreateItem
      }),
      style: {
        width: '957px'
      }
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, !readOnly && !pageEnter && /*#__PURE__*/React.createElement(_Form, {
    labelWidth: "auto",
    dataSet: dataSet,
    columns: 1,
    disabled: !hasPermission
  }, renderFormContent(dataRangeControlItem)), /*#__PURE__*/React.createElement("div", {
    className: [styles['data-range-control'], customRangeContainerClassName].join(' '),
    hidden: ((_dataSet$current5 = dataSet.current) === null || _dataSet$current5 === void 0 ? void 0 : _dataSet$current5.get(FieldsNameTypes.DATA_RANGE)) !== PERMISSION_POLICY_DATA_RANGE.CUSTOM
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['form-header']
  }, /*#__PURE__*/React.createElement("strong", null, intl.get('hmde.bo.businessObject.CustomDataRange').d('自定义数据范围')), !readOnly && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(BOPermissionButton, {
    componentType: "a",
    onClick: () => openOrgModal(),
    style: {
      marginRight: '8px'
    }
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "yinyongziduan",
    style: {
      margin: '0px 3px 3px 0'
    }
  }), intl.get('hmde.bo.businessObject.commonDataRange').d('常用数据范围')), /*#__PURE__*/React.createElement(BOPermissionButton, {
    componentType: "a",
    onClick: async () => {
      if (!(await dataSet.children.permissionDataFilterList.validate())) return;
      await dataSet.children.permissionDataFilterList.create({});
      setLogicFormula(false);
      formBodyRef.current.scrollTop = formBodyRef.current.scrollHeight;
    }
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "add",
    style: {
      margin: '0px 3px 3px 0'
    }
  }), intl.get('hmde.common.addCondition').d('添加条件')))), /*#__PURE__*/React.createElement("div", {
    className: styles['form-body'],
    ref: formBodyRef
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['form-body-label']
  }, /*#__PURE__*/React.createElement("span", null), labelList.map(i => /*#__PURE__*/React.createElement("span", {
    key: i
  }, i)), /*#__PURE__*/React.createElement("span", null)), renderContent()), /*#__PURE__*/React.createElement("div", {
    className: styles['form-footer']
  }, customDataRangeRecords.filter(i => !(i !== null && i !== void 0 && i.get(FilterFieldsNameType.USE_TYPE))).length > 0 && /*#__PURE__*/React.createElement(_Form, {
    className: styles['logic-formula-form'],
    dataSet: dataSet,
    columns: 1
  }, readOnly || !hasPermission ? /*#__PURE__*/React.createElement(_Output, {
    name: FieldsNameTypes.LOGIC_FORMULA
  }) : /*#__PURE__*/React.createElement(_TextField, {
    name: FieldsNameTypes.LOGIC_FORMULA
  })))));
};
export default observer(DataRangeControl);