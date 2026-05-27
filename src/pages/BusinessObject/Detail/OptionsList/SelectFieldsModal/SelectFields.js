import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Alert from "@hzero-front-ui/c7n-ui/lib/Alert";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _Switch from "@hzero-front-ui/c7n-ui/lib/SwitchPro";
import _NumberField from "@hzero-front-ui/c7n-ui/lib/NumberFieldPro";
import _IntlField from "@hzero-front-ui/c7n-ui/lib/IntlFieldPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _Tree from "@hzero-front-ui/c7n-ui/lib/TreePro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _omit from "lodash/omit";
import _nth from "lodash/nth";
import _maxBy from "lodash/maxBy";
import _isEmpty from "lodash/isEmpty";
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import request from 'utils/request';
import $ from 'jquery';
import { getResponse } from 'utils/utils';
import { observer } from 'mobx-react-lite';
// import { LabelAlign } from 'choerodon-ui/pro/lib/form/enum';
import { useDrop } from 'react-dnd';
import classnames from 'classnames';
import { useUpdateEffect } from 'ahooks';
import { FuncType } from 'choerodon-ui/pro/lib/button/enum';
import DrillComponent from 'hzero-front-apaas/lib/components/DrillComponent';
import { FieldComponentType, RelRelationType } from 'hzero-front-apaas/lib/constants/businessObject';
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { lowcodeOrganizationURL, uuid } from "hzero-front-hmde/lib/utils/common";
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import { treeDs, InquireFN } from "hzero-front-hmde/lib/stores/BusinessObject/OptionListDS";
import { getParentObjList } from "hzero-front-hmde/lib/routes/BusinessObjectComposition/Detail/FieldInformation/utils";
import useDataSetLoadFirst from "hzero-front-hmde/lib/hooks/useDataSetLoadFirst";
import useThemeColor from "hzero-front-apaas/lib/hooks/useThemeColor";
import useBusinessObjectOperator from "hzero-front-apaas/lib/hooks/useBusinessObjectOperator";
import { PhysicalModelType } from "hzero-front-hmde/lib/constants/businessObject";
import { SQL_PARAM_CATEGORY } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/SqlMaintenance/datasets/sqlParamsDS";
import MenuTitle from "./MenuTitle";
import Field from "./Field";
import Card from "./Card";
import styles from "./index.less?modules";

// const { TreeNode } = Tree;

function getDraggingStyle(isActive, canDrop) {
  if (isActive) {
    return {
      backgroundColor: '#E6EBFE',
      border: '1px dashed #9CB3FC'
    };
  }
  if (canDrop) {
    return {
      backgroundColor: 'rgba(230, 235, 254, 0.5)',
      border: '1px dashed #9CB3FC'
    };
  }
  return {};
}
const CONSTANT = 'CONSTANT',
  // 前置条件类型标识
  FIELD // 关联字段类型标识
  = 'FIELD';
const SelectFieldsModal = ({
  inquireDs,
  modal,
  optionFieldDs,
  businessObjectCode,
  baseInfoDS
}) => {
  var _optionFieldDs$curren, _optionFieldDs$curren2, _optionFieldDs$curren3, _baseInfoDS$current, _inquireDs$current, _optionFieldDs$curren11, _optionFieldDs$curren12, _optionFieldDs$curren13, _optionFieldDs$curren14, _optionFieldDs$curren15, _inquireDs$current2, _inquireDs$current2$g, _inquireDs$current4, _inquireDs$current4$g;
  const _useThemeColor = useThemeColor(),
    primary = _useThemeColor.primary;
  const _useBusinessObjectOpe = useBusinessObjectOperator({
      businessObjectCode: (optionFieldDs === null || optionFieldDs === void 0 ? void 0 : (_optionFieldDs$curren = optionFieldDs.current) === null || _optionFieldDs$curren === void 0 ? void 0 : _optionFieldDs$curren.get('businessObjectCode')) || businessObjectCode,
      businessObjectFieldCode: (optionFieldDs === null || optionFieldDs === void 0 ? void 0 : (_optionFieldDs$curren2 = optionFieldDs.current) === null || _optionFieldDs$curren2 === void 0 ? void 0 : _optionFieldDs$curren2.get('originBusinessObjectFieldCode')) || (optionFieldDs === null || optionFieldDs === void 0 ? void 0 : (_optionFieldDs$curren3 = optionFieldDs.current) === null || _optionFieldDs$curren3 === void 0 ? void 0 : _optionFieldDs$curren3.get('businessObjectFieldCode')),
      includeValueCount: 'SINGLE'
    }),
    _useBusinessObjectOpe2 = _slicedToArray(_useBusinessObjectOpe, 3),
    optionalOperators = _useBusinessObjectOpe2[0],
    componentOptionalProps = _useBusinessObjectOpe2[2];
  const treeListDs = useMemo(() => new _DataSet(treeDs(businessObjectCode, baseInfoDS)), [businessObjectCode]);
  const cacheTreeListDsData = useRef([]);
  const _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    treeSearch = _useState2[0],
    setTreeSearch = _useState2[1];
  const _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    isQueryY = _useState4[0],
    setIsQueryY = _useState4[1];
  const physicalModelType = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('physicalModelType');
  useDataSetLoadFirst(treeListDs, () => {
    cacheTreeListDsData.current = treeListDs.toData();
  });
  useEffect(() => {
    var _optionFieldDs$curren4, _optionFieldDs$curren5, _componentOptionalPro, _optionFieldDs$curren6;
    const code = (optionFieldDs === null || optionFieldDs === void 0 ? void 0 : (_optionFieldDs$curren4 = optionFieldDs.current) === null || _optionFieldDs$curren4 === void 0 ? void 0 : _optionFieldDs$curren4.get('originBusinessObjectFieldCode')) || (optionFieldDs === null || optionFieldDs === void 0 ? void 0 : (_optionFieldDs$curren5 = optionFieldDs.current) === null || _optionFieldDs$curren5 === void 0 ? void 0 : _optionFieldDs$curren5.get('businessObjectFieldCode'));
    const isCurrentData = (componentOptionalProps === null || componentOptionalProps === void 0 ? void 0 : (_componentOptionalPro = componentOptionalProps.data) === null || _componentOptionalPro === void 0 ? void 0 : _componentOptionalPro.businessObjectFieldCode) === code;
    if (isCurrentData && !(optionFieldDs !== null && optionFieldDs !== void 0 && (_optionFieldDs$curren6 = optionFieldDs.current) !== null && _optionFieldDs$curren6 !== void 0 && _optionFieldDs$curren6.get('operatorType'))) {
      var _optionFieldDs$curren7, _componentOptionalPro2;
      optionFieldDs === null || optionFieldDs === void 0 ? void 0 : (_optionFieldDs$curren7 = optionFieldDs.current) === null || _optionFieldDs$curren7 === void 0 ? void 0 : _optionFieldDs$curren7.set('operatorType', componentOptionalProps === null || componentOptionalProps === void 0 ? void 0 : (_componentOptionalPro2 = componentOptionalProps.data) === null || _componentOptionalPro2 === void 0 ? void 0 : _componentOptionalPro2.defaultOperator);
    }
  }, [componentOptionalProps]);
  useEffect(() => {
    modal.handleOk(() => {
      if (!optionFieldDs.data.length) {
        setDraggingStyle({
          border: '1px solid #d50000',
          backgroundColor: '#fcebeb'
        });
        return false;
      }
    });
  }, []);

  // 触发搜索
  useUpdateEffect(() => {
    // 搜索包含 businessObjectFieldName 记录,同时保留父级数据
    const recordsData = cacheTreeListDsData.current.filter(data => {
      const name = data.businessObjectFieldName;
      return name === null || name === void 0 ? void 0 : name.includes(treeSearch);
    });
    const dfs = data => {
      const parentId = data === null || data === void 0 ? void 0 : data.parentId;
      if (parentId) {
        const parentRecord = cacheTreeListDsData.current.find(item => item.id === parentId);
        if (parentRecord) {
          recordsData.push(parentRecord);
          dfs(parentRecord);
        }
      }
    };
    recordsData.forEach(record => {
      dfs(record);
    });
    treeListDs.loadData(recordsData);
    // 展开 or 收起
    treeListDs.forEach(record => {
      Object.assign(record, {
        isExpanded: !!treeSearch
      });
    });
  }, [treeSearch]);
  const getFieldsTreeList = (code, record) => {
    const parentId = record === null || record === void 0 ? void 0 : record.get('id');
    record === null || record === void 0 ? void 0 : record.set('errorMessage', '');
    return new Promise(resolve => {
      request(`${lowcodeOrganizationURL({
        route: HZERO_HMDE
      })}/business-object-fields/drill`, {
        method: 'GET',
        query: {
          drillDownFlag: false,
          // 是否向下钻取
          drillMainKeyFlag: true,
          // 区别视图字段接口
          businessObjectCode: code,
          masterBusinessObjectCode: businessObjectCode,
          componentTypeList: 'PRIMARY_KEY,TEXT_FIELD,TEXT_AREA,NUMBER_FIELD,FLOAT,PERCENTAGE,DATE_SELECTION_BOX,DATETIME_SELECTION_BOX,SINGLE_SELECT,MULTIPLE_SELECT,RADIO,CHECKBOX,SWITCH,MONEY,PHONE_NUMBER,EMAIL,APPENDIX,FORMULA,LINK_RELATION,MASTER_RELATION,REFERENCE_FIELD,CODE_RULE,LOCATION'
        }
      }).then(res => {
        if (getResponse(res)) {
          let arr = [...((res === null || res === void 0 ? void 0 : res.businessObjectFields) || []), ...((res === null || res === void 0 ? void 0 : res.businessObjectAssociateList) || [])];
          // 排序 主键放到数组第一位
          const index = arr.findIndex(field => (field === null || field === void 0 ? void 0 : field.componentType) === 'PRIMARY_KEY');
          const primaryField = [...((res === null || res === void 0 ? void 0 : res.businessObjectFields) || [])].find(field => (field === null || field === void 0 ? void 0 : field.componentType) === 'PRIMARY_KEY');
          arr.splice(index, 1);
          arr = [primaryField, ...arr];
          resolve(arr.map(item => ({
            ...item,
            businessObjectCode: item.businessObjectCode || (item === null || item === void 0 ? void 0 : item.masterBusinessObjectCode),
            businessObjectName: item.businessObjectName || (item === null || item === void 0 ? void 0 : item.masterBusinessObjectName),
            drillFlag: !item.drillFlag,
            parentId,
            id: uuid(),
            uuid: uuid(),
            drillFieldTag: true // 前端标识为钻取的字段
          })) || []);
        } else if (res && res !== null && res !== void 0 && res.failed && res !== null && res !== void 0 && res.message) {
          record === null || record === void 0 ? void 0 : record.set('errorMessage', res === null || res === void 0 ? void 0 : res.message);
          resolve(true);
        }
      });
    });
  };

  // 获取钻取表达式
  const getFieldPath = obj => {
    if (!(obj !== null && obj !== void 0 && obj.parentId)) {
      return;
    }
    const parentObjList = getParentObjList(treeListDs.toData(), obj.parentId);
    parentObjList[0].businessObjectCode = businessObjectCode;
    // const textValue = '';
    let realValue = '';
    let masterBusinessObjectFieldCode = ''; // 前置条件左侧字段
    let associateValue = ''; // 前置条件右侧字段值
    let associationStr = '';
    const newList = [...parentObjList, obj];
    const len = newList.length;
    newList.forEach((item, index) => {
      // 高级关系前置条件对象 // CASCADE(MEMBER_ROLE.|${memberType// 前置条件字段}=${USER // 前置条件值}|${memberId // 关联字段左侧code集合}, USER.id)
      if (item !== null && item !== void 0 && item.associateBusinessObjectCode) {
        // 获取前置条件
        const preCondition = item === null || item === void 0 ? void 0 : item.businessObjectAssociateFieldList.find(advanceField => (advanceField === null || advanceField === void 0 ? void 0 : advanceField.associateFieldType) === CONSTANT);
        masterBusinessObjectFieldCode = preCondition === null || preCondition === void 0 ? void 0 : preCondition.masterBusinessObjectFieldCode;
        associateValue = preCondition === null || preCondition === void 0 ? void 0 : preCondition.associateValue;
        // 获取关联字段数组
        let associationRelationCodeList = item === null || item === void 0 ? void 0 : item.businessObjectAssociateFieldList.filter(advanceField => (advanceField === null || advanceField === void 0 ? void 0 : advanceField.associateFieldType) === FIELD).map(associateField => associateField === null || associateField === void 0 ? void 0 : associateField.masterBusinessObjectFieldCode); // 关联关系标识
        associationRelationCodeList = associationRelationCodeList.join('|');
        if (!_isEmpty(associationRelationCodeList)) {
          associationStr = masterBusinessObjectFieldCode ? `|${masterBusinessObjectFieldCode}=${associateValue}|${associationRelationCodeList}` : `|${associationRelationCodeList}`;
        } else if (masterBusinessObjectFieldCode) {
          associationStr = `|${masterBusinessObjectFieldCode}=${associateValue}`;
        }
      }
      // 拼接名称
      // textValue = textValue.concat(
      //   index === len - 1
      //     ? `${item?.businessObjectFieldName}`
      //     : `${item?.businessObjectFieldName}.`
      // );
      // 拼接真实值
      // 主从
      if ((item === null || item === void 0 ? void 0 : item.relateType) === 'MASTER_SLAVE') {
        realValue = realValue.concat(index === len - 1 ? `${item === null || item === void 0 ? void 0 : item.businessObjectCode}.${item !== null && item !== void 0 && item.associateBusinessObjectCode ? associationStr : item === null || item === void 0 ? void 0 : item.businessObjectFieldCode}-${item === null || item === void 0 ? void 0 : item.slaveBusinessObjectFieldCode}` : `${item === null || item === void 0 ? void 0 : item.businessObjectCode}.${item !== null && item !== void 0 && item.associateBusinessObjectCode ? associationStr : item === null || item === void 0 ? void 0 : item.businessObjectFieldCode}-${item === null || item === void 0 ? void 0 : item.slaveBusinessObjectFieldCode},`);
      } else {
        realValue = realValue.concat(index === len - 1 ? `${item === null || item === void 0 ? void 0 : item.businessObjectCode}.${item !== null && item !== void 0 && item.associateBusinessObjectCode ? associationStr : item === null || item === void 0 ? void 0 : item.businessObjectFieldCode}` : `${item === null || item === void 0 ? void 0 : item.businessObjectCode}.${item !== null && item !== void 0 && item.associateBusinessObjectCode ? associationStr : item === null || item === void 0 ? void 0 : item.businessObjectFieldCode},`);
      }
    });
    let str = `CASCADE(${realValue}`;
    str = `${str})`;
    return str;
  };
  const loop = ({
    record
  }) => {
    return {
      title: /*#__PURE__*/React.createElement(MenuTitle, {
        currentNodeData: record.toData(),
        treeSearch: treeSearch,
        dataSet: optionFieldDs,
        errorMessage: record === null || record === void 0 ? void 0 : record.get('errorMessage'),
        getFieldPath: getFieldPath
      }),
      isLeaf: record === null || record === void 0 ? void 0 : record.get('drillFlag'),
      className: classnames({
        [styles.treeNode]: true,
        [styles['treeNode-switch']]: !(record !== null && record !== void 0 && record.get('drillFlag')) || fieldsData.some(({
          businessObjectFieldCode
        }) => {
          var _businessObjectFieldC, _businessObjectFieldC2;
          return (businessObjectFieldCode === null || businessObjectFieldCode === void 0 ? void 0 : (_businessObjectFieldC = businessObjectFieldCode.split(':')) === null || _businessObjectFieldC === void 0 ? void 0 : _businessObjectFieldC[(businessObjectFieldCode === null || businessObjectFieldCode === void 0 ? void 0 : (_businessObjectFieldC2 = businessObjectFieldCode.split(':')) === null || _businessObjectFieldC2 === void 0 ? void 0 : _businessObjectFieldC2.length) - 1]) === `${record === null || record === void 0 ? void 0 : record.get('businessObjectFieldCode')}`;
        } // FIXME: === `$\{${record?.get('businessObjectCode').${record?.get('businessObjectFieldCode')}}`
        )
      })
    };
  };
  const onLoadTreeData = useCallback(async (type, {
    children,
    record
  }) => {
    const code = (record === null || record === void 0 ? void 0 : record.get('associateBusinessObjectCode')) || (record === null || record === void 0 ? void 0 : record.get('masterBusinessObjectCode'));
    if (!children) {
      return getFieldsTreeList(code, record).then(res => {
        var _treeListDs$appendDat;
        // 只有第一层能选到公式字段
        const newRes = res.filter(v => v.componentType !== 'FORMULA');
        newRes.forEach(v => {
          Object.assign(v, {
            _fieldPath: getFieldPath(v)
          });
        });
        treeListDs === null || treeListDs === void 0 ? void 0 : (_treeListDs$appendDat = treeListDs.appendData) === null || _treeListDs$appendDat === void 0 ? void 0 : _treeListDs$appendDat.call(treeListDs, newRes);
        cacheTreeListDsData.current.push(...newRes);
      });
    }
  }, []);

  // 处理重复的编码 重复则+1
  const dealRepeatCode = (fieldCode, num = 0) => {
    let _newFieldCode = fieldCode;
    let _num = num;
    const isRepeat = optionFieldDs.toData().some(item => {
      var _newFieldCode2;
      let code = _newFieldCode;
      if (((_newFieldCode2 = _newFieldCode) === null || _newFieldCode2 === void 0 ? void 0 : _newFieldCode2.indexOf('#')) > 0) {
        var _newFieldCode3;
        code = (_newFieldCode3 = _newFieldCode) === null || _newFieldCode3 === void 0 ? void 0 : _newFieldCode3.replace('#', '');
      }
      if ((item === null || item === void 0 ? void 0 : item.businessObjectFieldCode) === code) {
        return true;
      }
      return false;
    }); // 判断字段编码是否重复 重复则+1
    if (!isRepeat) {
      return _newFieldCode;
    } else {
      _num++;
      if (_newFieldCode.indexOf('#') > 0) {
        var _newFieldCode$split;
        _newFieldCode = (_newFieldCode$split = _newFieldCode.split('#')) === null || _newFieldCode$split === void 0 ? void 0 : _newFieldCode$split[0];
      }
      _newFieldCode = `${_newFieldCode}#${_num}`;
      return dealRepeatCode(_newFieldCode, _num);
    }
  };
  const getDrillFieldDetail = obj => {
    var _dealRepeatCode;
    const code = obj !== null && obj !== void 0 && obj.fieldPath || obj !== null && obj !== void 0 && obj.drillFieldTag ? `_${obj === null || obj === void 0 ? void 0 : obj.businessObjectFieldCode}` : `${obj === null || obj === void 0 ? void 0 : obj.businessObjectFieldCode}`;
    const name = obj === null || obj === void 0 ? void 0 : obj.businessObjectFieldName;
    const noRepeatCode = (_dealRepeatCode = dealRepeatCode(code, 0)) === null || _dealRepeatCode === void 0 ? void 0 : _dealRepeatCode.replace('#', '');
    return {
      name,
      code: noRepeatCode
    };
  };
  const _useDrop = useDrop({
      accept: 'field',
      drop: () => ({
        callback: obj => {
          var _componentOptionalPro3, _componentOptionalPro4;
          const fieldPath = getFieldPath(obj);
          // eslint-disable-next-line no-param-reassign
          delete obj.dataType;
          const _getDrillFieldDetail = getDrillFieldDetail(obj),
            name = _getDrillFieldDetail.name,
            code = _getDrillFieldDetail.code;
          optionFieldDs.create({
            ...obj,
            id: undefined,
            parentId: undefined,
            businessObjectFieldCode: obj.drillFieldTag ? '' : code,
            businessObjectFieldName: name,
            originBusinessObjectFieldCode: obj.businessObjectFieldCode,
            displayName: '',
            tableFieldWidth: 200,
            orderSeq: ((_maxBy(fieldsData, o => o.orderSeq) || {}).orderSeq || 0) + 1,
            fieldPath,
            drillFieldTag: obj === null || obj === void 0 ? void 0 : obj.drillFieldTag,
            // businessObjectFieldPathName: textValue,
            operatorType: obj.businessObjectFieldCode === (componentOptionalProps === null || componentOptionalProps === void 0 ? void 0 : (_componentOptionalPro3 = componentOptionalProps.data) === null || _componentOptionalPro3 === void 0 ? void 0 : _componentOptionalPro3.businessObjectFieldCode) ? componentOptionalProps === null || componentOptionalProps === void 0 ? void 0 : (_componentOptionalPro4 = componentOptionalProps.data) === null || _componentOptionalPro4 === void 0 ? void 0 : _componentOptionalPro4.defaultOperator : undefined
          });
        }
      }),
      collect: monitor => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
    }),
    _useDrop2 = _slicedToArray(_useDrop, 2),
    _useDrop2$ = _useDrop2[0],
    canDrop = _useDrop2$.canDrop,
    isOver = _useDrop2$.isOver,
    drop = _useDrop2[1];
  const isActive = canDrop && isOver; // 在元素上，并且在拖动状态

  const _React$useState = React.useState({}),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    draggingStyle = _React$useState2[0],
    setDraggingStyle = _React$useState2[1];
  React.useEffect(() => {
    setDraggingStyle(getDraggingStyle(isActive, canDrop));
  }, [isActive, canDrop]);
  const _useMemo = useMemo(() => [optionFieldDs.toData().sort((a, b) => (a === null || a === void 0 ? void 0 : a.orderSeq) - (b === null || b === void 0 ? void 0 : b.orderSeq)), optionFieldDs.toData().filter(({
      queryFieldFlag
    }) => queryFieldFlag).sort((a, b) => (a === null || a === void 0 ? void 0 : a.queryOrderSeq) - (b === null || b === void 0 ? void 0 : b.queryOrderSeq))], [optionFieldDs.toData()]),
    _useMemo2 = _slicedToArray(_useMemo, 2),
    fieldsData = _useMemo2[0],
    queryFieldsData = _useMemo2[1];
  const handleChangeQueryX = val => {
    if (optionFieldDs.current) {
      var _optionFieldDs$curren10;
      if (val) {
        var _queryFieldsData$Math, _optionFieldDs$curren8;
        const maxQueryOrderSeq = queryFieldsData === null || queryFieldsData === void 0 ? void 0 : (_queryFieldsData$Math = queryFieldsData[Math.max((queryFieldsData === null || queryFieldsData === void 0 ? void 0 : queryFieldsData.length) - 1, 0)]) === null || _queryFieldsData$Math === void 0 ? void 0 : _queryFieldsData$Math.queryOrderSeq;
        optionFieldDs === null || optionFieldDs === void 0 ? void 0 : (_optionFieldDs$curren8 = optionFieldDs.current) === null || _optionFieldDs$curren8 === void 0 ? void 0 : _optionFieldDs$curren8.set('queryOrderSeq', maxQueryOrderSeq + 1 || 1);
      } else {
        var _optionFieldDs$curren9;
        optionFieldDs === null || optionFieldDs === void 0 ? void 0 : (_optionFieldDs$curren9 = optionFieldDs.current) === null || _optionFieldDs$curren9 === void 0 ? void 0 : _optionFieldDs$curren9.set('queryOrderSeq', null);
      }
      optionFieldDs === null || optionFieldDs === void 0 ? void 0 : (_optionFieldDs$curren10 = optionFieldDs.current) === null || _optionFieldDs$curren10 === void 0 ? void 0 : _optionFieldDs$curren10.set('queryFieldFlag', val);
    }
  };
  const moveField = (fieldType, dragIndex, dropIndex) => {
    const dragField = optionFieldDs.find(record => (record === null || record === void 0 ? void 0 : record.get(fieldType)) === dragIndex);
    const dropField = optionFieldDs.find(record => (record === null || record === void 0 ? void 0 : record.get(fieldType)) === dropIndex);
    dragField === null || dragField === void 0 ? void 0 : dragField.set(fieldType, dropIndex);
    dropField === null || dropField === void 0 ? void 0 : dropField.set(fieldType, dragIndex);
  };
  const handleOnDropField = (dragData, dropData, dir, fieldType) => {
    const dragIndex = dragData === null || dragData === void 0 ? void 0 : dragData[fieldType];
    const dropIndex = dropData === null || dropData === void 0 ? void 0 : dropData[fieldType];
    const diffNum = dragIndex - (dir === 'right' ? dropIndex : dropIndex - 1);
    if (diffNum > 0) {
      for (let i = 0; i < diffNum - 1; i++) {
        moveField(fieldType, dragIndex - i, dragIndex - i - 1);
      }
    } else {
      for (let i = 0; i > diffNum; i--) {
        moveField(fieldType, dragIndex - i, dragIndex - i + 1);
      }
    }
  };
  const getDrillText = value => {
    if (!value) return '';
    const res = value.match(/CASCADE\((.+)\)/);
    return `路径: ${(res === null || res === void 0 ? void 0 : res[1]) || ''}`;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles.container
  }, /*#__PURE__*/React.createElement(Card, {
    title: intl.get('hmde.common.field').d('字段'),
    icon: "option-fields.svg",
    description: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
      className: styles['card-description'],
      style: {
        width: 208,
        marginTop: 8
      }
    }, intl.get('hmde.bo.businessObject.dropTips').d('请把此处字段拖拽至右侧'), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'rgba(0,0,0,0.65)'
      }
    }, "[", intl.get('hmde.bo.businessObject.listArea').d('列表域'), "]")), /*#__PURE__*/React.createElement(_TextField, {
      className: styles['treeList-search'],
      onEnterDown: e => {
        var _e$currentTarget;
        setTreeSearch((e === null || e === void 0 ? void 0 : (_e$currentTarget = e.currentTarget) === null || _e$currentTarget === void 0 ? void 0 : _e$currentTarget.value) || '');
        setTimeout(() => {
          var _$, _$$get;
          (_$ = $('.scroll_treeSearch')) === null || _$ === void 0 ? void 0 : (_$$get = _$.get(0)) === null || _$$get === void 0 ? void 0 : _$$get.scrollIntoView();
        }, 20);
      },
      prefix: /*#__PURE__*/React.createElement(ImgIcon, {
        name: "search@v4.0.svg",
        size: 14
      }),
      placeholder: intl.get('hmde.bo.businessObject.SearchFields').d('搜索字段')
    })),
    style: {
      maxWidth: 208,
      maxHeight: 'calc(100vh - 2.5rem - 55px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.tree
  }, /*#__PURE__*/React.createElement(_Tree, {
    dataSet: treeListDs,
    loadData: onLoadTreeData.bind(null, 'treeListDs'),
    onTreeNode: loop,
    blockNode: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: styles.right
  }, /*#__PURE__*/React.createElement(Card, {
    title: intl.get('hmde.bo.businessObject.setView').d('视图配置'),
    icon: "option-displayFields.svg",
    style: {
      minHeight: '40%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.line
  }), /*#__PURE__*/React.createElement("div", {
    className: styles['displayFields-container']
  }, /*#__PURE__*/React.createElement(Card, {
    icon: /*#__PURE__*/React.createElement(_Icon, {
      type: "filter2",
      style: {
        marginRight: 3,
        marginBottom: 3,
        color: primary,
        fontWeight: 400
      }
    }),
    title: /*#__PURE__*/React.createElement("span", {
      className: styles.title
    }, intl.get('hmde.bo.businessObject.queryArea').d('查询域'), /*#__PURE__*/React.createElement(_Tooltip, {
      title: intl.get('hmde.bo.businessObject.queryArea.help').d('支持任意类型字段，可设置筛选逻辑符，且筛选条件关系为【AND】。')
    }, /*#__PURE__*/React.createElement(ImgIcon, {
      name: "help@v4.0.svg",
      size: 12,
      style: {
        marginLeft: 4
      }
    })), /*#__PURE__*/React.createElement("span", {
      className: styles.desc
    }, intl.get('hmde.bo.businessObject.queryArea.handleHelp').d('可通过字段属性设置筛选字段'))),
    style: {
      paddingTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['fields-list']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.field
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['field-index']
  }, "1"), /*#__PURE__*/React.createElement("div", {
    className: classnames({
      [styles['field-tag-custom']]: true,
      [styles['field-tag-custom-active']]: isQueryY
    }),
    onClick: () => setIsQueryY(true)
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "settings-o",
    style: {
      fontSize: '12px',
      margin: '-1px 2px 0 0'
    }
  }), inquireDs === null || inquireDs === void 0 ? void 0 : (_inquireDs$current = inquireDs.current) === null || _inquireDs$current === void 0 ? void 0 : _inquireDs$current.get(InquireFN.name))), queryFieldsData.map((data, index) => {
    var _data$businessObjectF, _data$businessObjectF2, _data$businessObjectF3, _data$businessObjectF4, _data$businessObjectF5, _data$businessObjectF6;
    const curRecord = optionFieldDs.find(record => (record === null || record === void 0 ? void 0 : record.get('businessObjectFieldCode')) === data.businessObjectFieldCode);
    return /*#__PURE__*/React.createElement(Field, {
      dndType: "queryFields",
      data: data,
      onDrop: (dragData, dropData, dir) => handleOnDropField(dragData, dropData, dir, 'queryOrderSeq')
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.field
    }, /*#__PURE__*/React.createElement("div", {
      className: styles['field-index']
    }, index + 2), /*#__PURE__*/React.createElement("div", {
      className: classnames({
        [styles['field-query']]: true
      })
    }, (data === null || data === void 0 ? void 0 : data.displayName) || ((_data$businessObjectF = data === null || data === void 0 ? void 0 : (_data$businessObjectF2 = data.businessObjectFieldName) === null || _data$businessObjectF2 === void 0 ? void 0 : (_data$businessObjectF3 = _data$businessObjectF2.match(new RegExp('[\\w\\u4e00-\\u9fa5]*', 'gm'))) === null || _data$businessObjectF3 === void 0 ? void 0 : (_data$businessObjectF4 = _data$businessObjectF3.filter(Boolean)) === null || _data$businessObjectF4 === void 0 ? void 0 : (_data$businessObjectF5 = _data$businessObjectF4.reverse) === null || _data$businessObjectF5 === void 0 ? void 0 : (_data$businessObjectF6 = _data$businessObjectF5.call(_data$businessObjectF4)) === null || _data$businessObjectF6 === void 0 ? void 0 : _data$businessObjectF6[0]) !== null && _data$businessObjectF !== void 0 ? _data$businessObjectF : data === null || data === void 0 ? void 0 : data.businessObjectFieldName)), /*#__PURE__*/React.createElement(ImgIcon, {
      className: styles['field-delete'],
      name: "failed@3x.png",
      size: 12,
      alt: "delete",
      onClick: e => {
        if (e.stopPropagation) e.stopPropagation();
        if (curRecord) curRecord === null || curRecord === void 0 ? void 0 : curRecord.set('queryFieldFlag', false);
      }
    })));
  }))), /*#__PURE__*/React.createElement(Card, {
    icon: /*#__PURE__*/React.createElement(_Icon, {
      type: "view_list-o",
      style: {
        marginRight: 3,
        marginBottom: 3,
        color: primary,
        fontWeight: 400
      }
    }),
    title: intl.get('hmde.bo.businessObject.listArea').d('列表域'),
    _ref: drop,
    style: draggingStyle
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['fields-list']
  }, fieldsData.map((data, index) => {
    const curRecord = optionFieldDs.find(record => (record === null || record === void 0 ? void 0 : record.get('uuid')) === data.uuid
    // record?.get('businessObjectFieldCode') === data.businessObjectFieldCode
    );
    return /*#__PURE__*/React.createElement(Field, {
      dndType: "columns",
      data: data,
      onDrop: (dragData, dropData, dir) => handleOnDropField(dragData, dropData, dir, 'orderSeq'),
      style: {
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.field,
      onClick: async () => {
        optionFieldDs.locate((curRecord === null || curRecord === void 0 ? void 0 : curRecord.index) || 0);
        setIsQueryY(false);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: styles['field-index']
    }, index + 1), /*#__PURE__*/React.createElement("div", {
      className: classnames({
        [styles['field-tag']]: true,
        [styles['field-tag-active']]: (curRecord === null || curRecord === void 0 ? void 0 : curRecord.isCurrent) && !isQueryY
      })
    }, (data === null || data === void 0 ? void 0 : data.displayName) || (data === null || data === void 0 ? void 0 : data.businessObjectFieldName)), /*#__PURE__*/React.createElement(ImgIcon, {
      className: styles['field-delete'],
      name: "failed@3x.png",
      size: 12,
      alt: "delete",
      onClick: e => {
        if (e.stopPropagation) e.stopPropagation();
        if (curRecord) {
          optionFieldDs.delete(curRecord, false).then(() => {
            if (optionFieldDs.filter(v => v.isCurrent).length > 1) {
              Object.assign(optionFieldDs === null || optionFieldDs === void 0 ? void 0 : optionFieldDs.get(0), {
                isCurrent: false
              });
            }
          });
        }
      }
    })));
  })), /*#__PURE__*/React.createElement("div", {
    className: styles['content-center']
  }, canDrop ? /*#__PURE__*/React.createElement("a", null, intl.get('hmde.bo.businessObject.fieldList.canDrop').d('可拖拽区域')) : null, !canDrop && fieldsData.length === 0 ? intl.get('hmde.bo.businessObject.fieldList.description').d('暂无内容，请先配置列表字段。') : null)))), !isQueryY && /*#__PURE__*/React.createElement(Card, {
    title: intl.get('hmde.bo.businessObject.field.props').d('字段属性'),
    icon: "option-field-props.svg",
    description: /*#__PURE__*/React.createElement("p", {
      className: styles['card-description'],
      style: {
        display: 'inline-block',
        marginLeft: 12
      }
    }, intl.get('hmde.bo.businessObject.fieldProps.description').d('修改字段显示名称后，列表、查询域均会同步更新。')),
    style: {
      borderTop: '1px solid #DEDEDE',
      minHeight: 153
    }
  }, optionFieldDs !== null && optionFieldDs !== void 0 && optionFieldDs.current ? /*#__PURE__*/React.createElement(_Form, {
    record: optionFieldDs.current,
    columns: 2
    // useColon={false}
    // labelAlign={LabelAlign.left}
    ,
    style: {
      padding: 8
    },
    labelWidth: 90
  }, (_optionFieldDs$curren11 = optionFieldDs.current) !== null && _optionFieldDs$curren11 !== void 0 && _optionFieldDs$curren11.get('fieldPath') || (_optionFieldDs$curren12 = optionFieldDs.current) !== null && _optionFieldDs$curren12 !== void 0 && _optionFieldDs$curren12.get('drillFieldTag') ? /*#__PURE__*/React.createElement(_Output, {
    name: "businessObjectFieldCode",
    style: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      fontSize: 12
    }
  }) :
  /*#__PURE__*/
  // <TextField
  //   name="businessObjectFieldCode"
  //   style={{
  //     textOverflow: 'ellipsis',
  //     overflow: 'hidden',
  //     whiteSpace: 'nowrap',
  //     fontSize: 12,
  //   }}
  // />
  React.createElement(_Output, {
    name: "businessObjectFieldCode",
    style: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      fontSize: 12
    }
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "businessObjectFieldName",
    style: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      fontSize: 12,
      width: '250px'
    }
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "fieldPath",
    style: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      fontSize: 12,
      width: '250px'
    },
    renderer: ({
      value
    }) => {
      // 捕获括号中的内容
      const reg = /CASCADE\((.*?)\)/;
      return _nth(reg.exec(`${value}`), 1);
    }
  }), /*#__PURE__*/React.createElement(_IntlField, {
    name: "displayName"
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "componentType"
  }), /*#__PURE__*/React.createElement(_NumberField, {
    name: "tableFieldWidth"
  }), /*#__PURE__*/React.createElement(_Switch, {
    name: "queryFieldFlag",
    onChange: handleChangeQueryX,
    hidden: ['SINGLE_APPENDIX'].includes(optionFieldDs === null || optionFieldDs === void 0 ? void 0 : (_optionFieldDs$curren13 = optionFieldDs.current) === null || _optionFieldDs$curren13 === void 0 ? void 0 : _optionFieldDs$curren13.get('componentType'))
  }), /*#__PURE__*/React.createElement(_Select, {
    name: "operatorType",
    options: optionalOperators,
    clearButton: false,
    hidden: ['SINGLE_APPENDIX'].includes(optionFieldDs === null || optionFieldDs === void 0 ? void 0 : (_optionFieldDs$curren14 = optionFieldDs.current) === null || _optionFieldDs$curren14 === void 0 ? void 0 : _optionFieldDs$curren14.get('componentType'))
  }), /*#__PURE__*/React.createElement(_Switch, {
    disabled: ((_optionFieldDs$curren15 = optionFieldDs.current) === null || _optionFieldDs$curren15 === void 0 ? void 0 : _optionFieldDs$curren15.get('useType')) === SQL_PARAM_CATEGORY.QUERY_PARAM,
    name: "tableFieldFlag"
  })) : /*#__PURE__*/React.createElement("div", {
    className: styles['content-center']
  }, intl.get('hmde.bo.businessObject.fieldProps.none').d('暂无内容，选中列表中的字段，即可配置 [字段属性]'))), isQueryY && /*#__PURE__*/React.createElement(Card, {
    title: intl.get('hmde.bo.businessObject.field.props').d('字段属性'),
    icon: "option-field-props.svg",
    style: {
      borderTop: '1px solid #DEDEDE'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.customBoxx
  }, /*#__PURE__*/React.createElement(_Alert, {
    style: {
      margin: '16px 16px 4px'
    },
    message: intl.get('hmde.bo.businessObject.fieldProps.customAlert').d('自定义模糊查询字段，支持文本、多行文本、手机号码、电子邮箱、自动编号类型字段，筛选逻辑符均为【全模糊】且筛选条件关系为【OR】'),
    type: "info",
    showIcon: true
  }), /*#__PURE__*/React.createElement(_Form, {
    dataSet: inquireDs,
    columns: 2,
    style: {
      padding: '0 10px',
      marginTop: '16px'
    }
  }, /*#__PURE__*/React.createElement(_Output, {
    name: InquireFN.code,
    showLengthInfo: true
  }), /*#__PURE__*/React.createElement(_IntlField, {
    name: InquireFN.name,
    showLengthInfo: true
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.customBoxTop
  }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.fieldProps.searchMhField').d('模糊查询字段')), /*#__PURE__*/React.createElement(DrillComponent, {
    selectObjectCheckFlag: true,
    initDrillParams: {
      useType: physicalModelType === PhysicalModelType.SQL ? SQL_PARAM_CATEGORY.FIELD_PARAM : undefined
    },
    componentTypeList: [FieldComponentType.TEXT_FIELD, FieldComponentType.TEXT_AREA, FieldComponentType.PHONE_NUMBER, FieldComponentType.EMAIL, FieldComponentType.LOCATION, FieldComponentType.CODE_RULE,
    // FieldComponentType.SINGLE_APPENDIX,
    FieldComponentType.LINK_RELATION, FieldComponentType.MASTER_RELATION, RelRelationType.REL_LINK, RelRelationType.REL_REVERSE_LINK, RelRelationType.REL_MASTER_SLAVE, RelRelationType.REL_SLAVE_MASTER],
    isWriteBack: false,
    renderer: () => /*#__PURE__*/React.createElement(_Button, {
      style: {
        marginLeft: 12,
        marginBottom: 2
      },
      icon: "add",
      funcType: "link"
    }, intl.get('hmde.common.addField1').d('添加字段')),
    businessObjectCode: businessObjectCode,
    excludeFieldList: (_inquireDs$current2 = inquireDs.current) === null || _inquireDs$current2 === void 0 ? void 0 : (_inquireDs$current2$g = _inquireDs$current2.get(InquireFN.fields)) === null || _inquireDs$current2$g === void 0 ? void 0 : _inquireDs$current2$g.map(v => v.businessObjectFieldCode),
    onOk: param => {
      if (param !== null && param !== void 0 && param.result) {
        var _inquireDs$current3;
        (_inquireDs$current3 = inquireDs.current) === null || _inquireDs$current3 === void 0 ? void 0 : _inquireDs$current3.get(InquireFN.fields).push({
          ..._omit(param.result, 'dataType'),
          fieldPath: param.value,
          textPath: param.text
        });
      }
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: styles['fields-list']
  }, (_inquireDs$current4 = inquireDs.current) === null || _inquireDs$current4 === void 0 ? void 0 : (_inquireDs$current4$g = _inquireDs$current4.get(InquireFN.fields)) === null || _inquireDs$current4$g === void 0 ? void 0 : _inquireDs$current4$g.map((data, index) => {
    var _data$businessObjectF7, _data$businessObjectF8, _data$businessObjectF9, _data$businessObjectF10, _data$businessObjectF11, _data$businessObjectF12;
    return /*#__PURE__*/React.createElement(Field, {
      dndType: "inquireFields",
      data: data,
      style: {
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.field
    }, /*#__PURE__*/React.createElement("div", {
      className: styles['field-index']
    }, index + 1), /*#__PURE__*/React.createElement(_Tooltip, {
      title: getDrillText(data.textPath)
    }, /*#__PURE__*/React.createElement("div", {
      className: classnames({
        [styles['field-query']]: true
      })
    }, (data === null || data === void 0 ? void 0 : data.displayName) || ((_data$businessObjectF7 = data === null || data === void 0 ? void 0 : (_data$businessObjectF8 = data.businessObjectFieldName) === null || _data$businessObjectF8 === void 0 ? void 0 : (_data$businessObjectF9 = _data$businessObjectF8.match(new RegExp('[\\w\\u4e00-\\u9fa5]*', 'gm'))) === null || _data$businessObjectF9 === void 0 ? void 0 : (_data$businessObjectF10 = _data$businessObjectF9.filter(Boolean)) === null || _data$businessObjectF10 === void 0 ? void 0 : (_data$businessObjectF11 = _data$businessObjectF10.reverse) === null || _data$businessObjectF11 === void 0 ? void 0 : (_data$businessObjectF12 = _data$businessObjectF11.call(_data$businessObjectF10)) === null || _data$businessObjectF12 === void 0 ? void 0 : _data$businessObjectF12[0]) !== null && _data$businessObjectF7 !== void 0 ? _data$businessObjectF7 : data === null || data === void 0 ? void 0 : data.businessObjectFieldName)), /*#__PURE__*/React.createElement(ImgIcon, {
      className: styles['field-delete'],
      name: "failed@3x.png",
      size: 12,
      alt: "delete",
      onClick: e => {
        var _inquireDs$current5;
        if (e.stopPropagation) e.stopPropagation();
        (_inquireDs$current5 = inquireDs.current) === null || _inquireDs$current5 === void 0 ? void 0 : _inquireDs$current5.get(InquireFN.fields).remove(data);
      }
    }))));
  }))))));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(SelectFieldsModal));