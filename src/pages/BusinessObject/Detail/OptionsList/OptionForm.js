import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Switch from "@hzero-front-ui/c7n-ui/lib/SwitchPro";
import _NumberField from "@hzero-front-ui/c7n-ui/lib/NumberFieldPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _IntlField from "@hzero-front-ui/c7n-ui/lib/IntlFieldPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _Alert from "@hzero-front-ui/c7n-ui/lib/Alert";
import _useDataSet from "choerodon-ui/pro/lib/use-data-set";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _useModal from "choerodon-ui/pro/lib/use-modal";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _isEmpty from "lodash/isEmpty";
/*
 * @Descripttion: 值列表项——编辑、新建组件
 * @Date: 2021-08-10 22:49:20
 * @Author: ZHIJIAN.XU@HAND-CHINA.COM
 * @version: 0.0.1
 * @copyright: Copyright (c) 2021, Hand
 */
import React, { useEffect, useMemo, useState, useRef } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { isTenantRoleLevel, getResponse } from 'utils/utils';
import notification from 'utils/notification';
import { observer } from 'mobx-react-lite';
import { useCreation } from 'ahooks';
import { DataSetStatus, RecordStatus } from 'choerodon-ui/dataset/data-set/enum';
import { formDs, optionFieldDs, FN, inquireDS, InquireFN } from "hzero-front-hmde/lib/stores/BusinessObject/OptionListDS";
import LabelTitleRender from "hzero-front-hmde/lib/businessComponents/LabelTitleRender";
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import { mergeSqlQueryParam } from "hzero-front-hmde/lib/utils/common";
import { getDisplayFields } from "hzero-front-hmde/lib/services/businessObjectService";
import NewFilterCondition from "hzero-front-hmde/lib/businessComponents/NewFilterCondition";
import { objectFieldSearchMatcher } from "hzero-front-hmde/lib/utils/bo";
import { getApiObjectParams, EEnvironmentCode } from "hzero-front-hmde/lib/utils/queryApiObjectFields";
import { drillFieldDS } from "hzero-front-hmde/lib/stores/ProcessDifinition/commonDS";
import { PhysicalModelType } from "hzero-front-hmde/lib/constants/businessObject";
import { SQL_PARAM_CATEGORY } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/SqlMaintenance/datasets/sqlParamsDS";
import { getBoFieldList } from "hzero-front-hmde/lib/services/processDefinition";
import SelectFieldsModal from "./SelectFieldsModal";
import Collation from "./Collation";
import { getFieldPath } from "./utils";
import styles from "../index.less?modules";
function getOptionFieldsStyle(length) {
  return length ? {} : {
    borderColor: '#d50000',
    borderStyle: 'solid',
    backgroundColor: '#fcebeb',
    color: '#d50000'
  };
}
const isTenant = isTenantRoleLevel();
const Option = ({
  modal,
  domainId,
  businessObjectId,
  businessObjectCode,
  title,
  optionId,
  optionsListDs,
  businessObjectTenantId,
  copy = false,
  editFlag,
  readOnlyFlag = false,
  baseInfoDS,
  pageOpen
}) => {
  var _baseInfoDS$current, _optionItemDs$current5, _optionItemDs$current9, _baseInfoDS$current6, _filterCacheRef$curre8, _filterCacheRef$curre11, _optionItemDs$current10, _optionItemDs$current11, _inquireDs$current4, _inquireDs$current4$g, _inquireDs$current5, _inquireDs$current6, _optionItemDs$current12;
  // 过滤条件 数据
  const _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    filterConditionList = _useState2[0],
    setFilterConditionList = _useState2[1];
  const filterCacheRef = useRef(null);
  const setLogicFormulaRef = useRef(null);
  const deleteFieldsList = useRef([]); // 规则排序勾选删除项

  const businessObjectName = (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('businessObjectName')) || '';
  const Modal = _useModal();
  const optionItemDs = useCreation(() => new _DataSet({
    ...formDs({
      domainId,
      boId: businessObjectId,
      businessObjectCode,
      optionId,
      businessObjectTenantId,
      copy,
      // optionListTotalCount: optionsListDs.length,
      optionsListDs,
      filterCacheRef,
      pageOpen
    }),
    events: {
      update: ({
        name,
        value,
        record
      }) => {
        if (name === 'pageSize' && !value) {
          record === null || record === void 0 ? void 0 : record.set('pageSize', 10);
        }
        if (name === 'title' && !value) {
          record === null || record === void 0 ? void 0 : record.set('title', title);
        }
      }
    }
  }), [optionsListDs.length]);
  const collationDs = optionItemDs.children.businessObjectOptionOrderList;
  const drillFieldDs = _useDataSet(() => drillFieldDS(businessObjectCode), [businessObjectCode]);
  const _useState3 = useState({}),
    _useState4 = _slicedToArray(_useState3, 2),
    optionFieldsStyle = _useState4[0],
    setOptionFieldStyle = _useState4[1];
  const optionFieldListDs = useMemo(() => new _DataSet({
    ...optionFieldDs(),
    strictPageSize: false,
    events: {
      update: ({
        name,
        value,
        record
      }) => {
        if (name === 'tableFieldWidth' && !value) {
          record === null || record === void 0 ? void 0 : record.set(name, 200);
        }
      }
    }
  }), []);
  const inquireDs = _useDataSet(inquireDS, []);
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
  const init = async () => {
    var _baseInfoDS$current2;
    setLogicFormulaRef.current = null;
    const physicalModelType = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : _baseInfoDS$current2.get('physicalModelType');
    const query = physicalModelType === PhysicalModelType.API ? getApiObjectParams(EEnvironmentCode.OPTION_LIST_DISPLAY_FIELD) : {};
    // 如果是 sql 对象 需要传 useType
    if (physicalModelType === PhysicalModelType.SQL) {
      query.useType = SQL_PARAM_CATEGORY.FIELD_PARAM;
    }
    getDisplayFields({
      businessObjectCode,
      ...query
    }).then(res => {
      if (getResponse(res)) {
        if (!optionId) {
          const defaultShowFieldItem = res.find(v => v.defaultDisplayFieldFlag);
          if (defaultShowFieldItem) {
            var _optionItemDs$current, _optionItemDs$current2;
            optionItemDs === null || optionItemDs === void 0 ? void 0 : (_optionItemDs$current = optionItemDs.current) === null || _optionItemDs$current === void 0 ? void 0 : (_optionItemDs$current2 = _optionItemDs$current.set) === null || _optionItemDs$current2 === void 0 ? void 0 : _optionItemDs$current2.call(_optionItemDs$current, 'displayFieldCode', defaultShowFieldItem === null || defaultShowFieldItem === void 0 ? void 0 : defaultShowFieldItem.businessObjectFieldCode);
          }
        }
        optionItemDs.setState('displayFieldList', res);
      }
    });
    if (!optionId) {
      var _baseInfoDS$current3, _baseInfoDS$current4;
      // 调API对象查询接口的功能，需要默认带出必输参数
      if ((baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current3 = baseInfoDS.current) === null || _baseInfoDS$current3 === void 0 ? void 0 : _baseInfoDS$current3.get('physicalModelType')) === PhysicalModelType.API) {
        var _filterCacheRef$curre;
        const _query = getApiObjectParams(EEnvironmentCode.OPTION_LIST_FILTER_CONDITION_LEFT_FRILL);
        Object.keys(_query).forEach(key => {
          drillFieldDs.setQueryParameter(key, _query[key]);
        });
        const res = await drillFieldDs.query();
        const requiredFields = (res === null || res === void 0 ? void 0 : res.filter(i => i === null || i === void 0 ? void 0 : i.requiredFlag)) || [];
        const objectInfoList = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : baseInfoDS.toData();
        let cascadeStr;
        const filterData = requiredFields.map((field, index) => {
          cascadeStr = getFieldPath(field, res, objectInfoList);
          return {
            componentType: field.componentType,
            fieldPath: cascadeStr,
            fieldType: 'FIELD',
            orderSeq: index + 1
          };
        }) || [];
        await ((_filterCacheRef$curre = filterCacheRef.current) === null || _filterCacheRef$curre === void 0 ? void 0 : _filterCacheRef$curre.initData(filterData));
        const formula = filterData === null || filterData === void 0 ? void 0 : filterData.map((_, i) => i + 1).join(' AND ');
        optionItemDs.create({
          // 默认值
          title,
          pageSize: 10,
          enabledFlag: true,
          businessObjectOptionCondList: [],
          [FN.LOGIC_FORMULA]: formula
        });
        // 赋值过滤条件
      } else if ((baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current4 = baseInfoDS.current) === null || _baseInfoDS$current4 === void 0 ? void 0 : _baseInfoDS$current4.get('physicalModelType')) === PhysicalModelType.SQL) {
        const sqlParamQuery = {
          businessObjectCodeList: businessObjectCode,
          primaryKeyFlag: true,
          tenantId: businessObjectTenantId,
          useType: SQL_PARAM_CATEGORY.QUERY_PARAM
        };
        getSqlQueryParam(sqlParamQuery).then(conditions => {
          var _filterCacheRef$curre2;
          (_filterCacheRef$curre2 = filterCacheRef.current) === null || _filterCacheRef$curre2 === void 0 ? void 0 : _filterCacheRef$curre2.initData(conditions);
        });
        optionItemDs.create({
          // 默认值
          title,
          pageSize: 10,
          enabledFlag: true,
          businessObjectOptionCondList: []
        });
        // 赋值过滤条件
      } else {
        optionItemDs.create({
          // 默认值
          title,
          pageSize: 10,
          enabledFlag: true,
          businessObjectOptionCondList: []
        });
      }
    } else if (copy && optionId) {
      optionItemDs.query().then(res => {
        if (getResponse(res)) {
          var _optionItemDs$current3, _res$fuzzyBoOptionFie, _res$fuzzyBoOptionFie2, _res$fuzzyBoOptionFie3;
          const reg = new RegExp(`^${businessObjectCode}_`);
          // 复制先用load 这样状态status是sync，确保多语言能够查询，提交时状态改为add，同时删除各种id
          optionItemDs.loadData([{
            ...res,
            businessObjectOptionName: res.businessObjectOptionName + '_' + intl.get('hmde.bo.view.copyItem').d('副本'),
            defaultFlag: false
          }]);
          optionItemDs === null || optionItemDs === void 0 ? void 0 : (_optionItemDs$current3 = optionItemDs.current) === null || _optionItemDs$current3 === void 0 ? void 0 : _optionItemDs$current3.set({
            businessObjectOptionCode: res.businessObjectOptionCode === businessObjectCode ? '' : res.businessObjectOptionCode.replace(reg, '')
          });
          inquireDs.loadData([{
            [InquireFN.name]: (res === null || res === void 0 ? void 0 : (_res$fuzzyBoOptionFie = res.fuzzyBoOptionField) === null || _res$fuzzyBoOptionFie === void 0 ? void 0 : _res$fuzzyBoOptionFie[InquireFN.name]) || intl.get('hmde.bo.businessObject.customFilter').d('自定义筛选'),
            [InquireFN.code]: (res === null || res === void 0 ? void 0 : (_res$fuzzyBoOptionFie2 = res.fuzzyBoOptionField) === null || _res$fuzzyBoOptionFie2 === void 0 ? void 0 : _res$fuzzyBoOptionFie2[InquireFN.code]) || '__keyword',
            [InquireFN.fields]: res[InquireFN.fields] || [],
            _token: res === null || res === void 0 ? void 0 : (_res$fuzzyBoOptionFie3 = res.fuzzyBoOptionField) === null || _res$fuzzyBoOptionFie3 === void 0 ? void 0 : _res$fuzzyBoOptionFie3._token
          }]);

          // 赋值过滤条件
          setFilterConditionList((res === null || res === void 0 ? void 0 : res.businessObjectOptionCondList) || []);
        }
      });
    } else {
      optionItemDs.query().then(res => {
        if (getResponse(res)) {
          var _baseInfoDS$current5, _res$fuzzyBoOptionFie4, _res$fuzzyBoOptionFie5, _res$fuzzyBoOptionFie6;
          if ((baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current5 = baseInfoDS.current) === null || _baseInfoDS$current5 === void 0 ? void 0 : _baseInfoDS$current5.get('physicalModelType')) === PhysicalModelType.SQL) {
            const sqlParamQuery = {
              businessObjectCodeList: businessObjectCode,
              primaryKeyFlag: true,
              tenantId: businessObjectTenantId,
              useType: SQL_PARAM_CATEGORY.QUERY_PARAM
            };
            getSqlQueryParam(sqlParamQuery).then(conditions => {
              var _filterCacheRef$curre3, _filterCacheRef$curre4;
              res === null || res === void 0 ? void 0 : res.businessObjectOptionCondList.filter(i => (i === null || i === void 0 ? void 0 : i.useType) === SQL_PARAM_CATEGORY.QUERY_PARAM);
              const mergeData = mergeSqlQueryParam(conditions, res === null || res === void 0 ? void 0 : res.businessObjectOptionCondList, 'fieldPath');
              (_filterCacheRef$curre3 = filterCacheRef.current) === null || _filterCacheRef$curre3 === void 0 ? void 0 : (_filterCacheRef$curre4 = _filterCacheRef$curre3.ds) === null || _filterCacheRef$curre4 === void 0 ? void 0 : _filterCacheRef$curre4.loadData(mergeData);
            });
          }
          inquireDs.loadData([{
            [InquireFN.name]: (res === null || res === void 0 ? void 0 : (_res$fuzzyBoOptionFie4 = res.fuzzyBoOptionField) === null || _res$fuzzyBoOptionFie4 === void 0 ? void 0 : _res$fuzzyBoOptionFie4[InquireFN.name]) || intl.get('hmde.common.fuzzySearch').d('模糊搜索'),
            [InquireFN.code]: (res === null || res === void 0 ? void 0 : (_res$fuzzyBoOptionFie5 = res.fuzzyBoOptionField) === null || _res$fuzzyBoOptionFie5 === void 0 ? void 0 : _res$fuzzyBoOptionFie5[InquireFN.code]) || '__keyword',
            [InquireFN.fields]: res[InquireFN.fields] || [],
            _token: res === null || res === void 0 ? void 0 : (_res$fuzzyBoOptionFie6 = res.fuzzyBoOptionField) === null || _res$fuzzyBoOptionFie6 === void 0 ? void 0 : _res$fuzzyBoOptionFie6._token
          }]);
          // 赋值过滤条件
          setFilterConditionList((res === null || res === void 0 ? void 0 : res.businessObjectOptionCondList) || []);
        }
      });
    }
  };
  useEffect(() => {
    init();
  }, [optionId, businessObjectTenantId]);
  const _useState5 = useState([]),
    _useState6 = _slicedToArray(_useState5, 2),
    fieldsData = _useState6[0],
    setFieldsData = _useState6[1];
  const _useState7 = useState([]),
    _useState8 = _slicedToArray(_useState7, 2),
    queryFieldsData = _useState8[0],
    setQueryFieldsData = _useState8[1];
  useEffect(() => {
    var _optionItemDs$current4, _businessObjectOption;
    const businessObjectOptionFieldList = ((_optionItemDs$current4 = optionItemDs.current) === null || _optionItemDs$current4 === void 0 ? void 0 : _optionItemDs$current4.get(FN.BUSINESS_OBJECT_OPTION_FIELDLIST)) || [];
    let _fieldsData = businessObjectOptionFieldList.sort((a, b) => (a === null || a === void 0 ? void 0 : a.orderSeq) - (b === null || b === void 0 ? void 0 : b.orderSeq));
    _fieldsData = _fieldsData.map(item => ({
      ...item,
      tenantId: item === null || item === void 0 ? void 0 : item.tenantId,
      fieldCode: item === null || item === void 0 ? void 0 : item.businessObjectFieldCode,
      fieldName: (item === null || item === void 0 ? void 0 : item.displayName) || (item === null || item === void 0 ? void 0 : item.businessObjectFieldName)
    }));
    setFieldsData(_fieldsData);
    collationDs.setState('fieldsData', _fieldsData);
    setQueryFieldsData((_businessObjectOption = businessObjectOptionFieldList.filter(({
      queryFieldFlag
    }) => queryFieldFlag)) === null || _businessObjectOption === void 0 ? void 0 : _businessObjectOption.sort((a, b) => (a === null || a === void 0 ? void 0 : a.queryOrderSeq) - (b === null || b === void 0 ? void 0 : b.queryOrderSeq)));

    // 视图字段 删除了非自己的字段, 下面table如果引用了需要删除
    collationDs.forEach(record => {
      var _collationDs$getState, _collationDs$getState2;
      const code = record === null || record === void 0 ? void 0 : record.get('fieldCode');
      const fieldsDataFlag = _fieldsData.some(v => v.fieldCode === code);
      const fieldListFlag = collationDs === null || collationDs === void 0 ? void 0 : (_collationDs$getState = collationDs.getState('fieldList')) === null || _collationDs$getState === void 0 ? void 0 : (_collationDs$getState2 = _collationDs$getState.toJS()) === null || _collationDs$getState2 === void 0 ? void 0 : _collationDs$getState2.some(v => v.fieldCode === code);
      if (!fieldsDataFlag && !fieldListFlag && collationDs !== null && collationDs !== void 0 && collationDs.getState('fieldList')) {
        collationDs.delete(record, false);
      }
    });
  }, [(_optionItemDs$current5 = optionItemDs.current) === null || _optionItemDs$current5 === void 0 ? void 0 : _optionItemDs$current5.get(FN.BUSINESS_OBJECT_OPTION_FIELDLIST)]);
  const validateOptionFieldList = data => {
    setOptionFieldStyle(getOptionFieldsStyle(data.length));
    return data.length !== 0;
  };
  useEffect(() => {
    modal === null || modal === void 0 ? void 0 : modal.handleOk(async () => {
      var _filterCacheRef$curre5;
      if (readOnlyFlag) return true;
      const validateOptionFields = validateOptionFieldList(fieldsData);
      const filterConValidate = await (filterCacheRef === null || filterCacheRef === void 0 ? void 0 : (_filterCacheRef$curre5 = filterCacheRef.current) === null || _filterCacheRef$curre5 === void 0 ? void 0 : _filterCacheRef$curre5.checkValidate());
      if ((await (optionItemDs === null || optionItemDs === void 0 ? void 0 : optionItemDs.validate())) && validateOptionFields && filterConValidate) {
        var _optionItemDs$current6, _filterCacheRef$curre6, _filterData, _optionItemDs$current7, _inquireDs$current;
        // eslint-disable-next-line no-unused-expressions
        optionItemDs === null || optionItemDs === void 0 ? void 0 : (_optionItemDs$current6 = optionItemDs.current) === null || _optionItemDs$current6 === void 0 ? void 0 : _optionItemDs$current6.set('dirty', true);
        // 如果是复制 提交时改变记录状态为新建 走新建接口
        if (copy && optionItemDs.current) {
          optionItemDs.current.status = "add";
        }

        // 赋值筛选条件
        // filterCacheRef?.current?.handleSetData();
        let filterData = filterCacheRef === null || filterCacheRef === void 0 ? void 0 : (_filterCacheRef$curre6 = filterCacheRef.current) === null || _filterCacheRef$curre6 === void 0 ? void 0 : _filterCacheRef$curre6.getData();
        // sql查询参数 没有填完整的 直接过滤掉
        filterData = (_filterData = filterData) === null || _filterData === void 0 ? void 0 : _filterData.filter(i => !(i !== null && i !== void 0 && i.useType) || (i === null || i === void 0 ? void 0 : i.useType) && (i === null || i === void 0 ? void 0 : i.operatorType) && (i === null || i === void 0 ? void 0 : i.valueType) && (i === null || i === void 0 ? void 0 : i.value));
        optionItemDs === null || optionItemDs === void 0 ? void 0 : (_optionItemDs$current7 = optionItemDs.current) === null || _optionItemDs$current7 === void 0 ? void 0 : _optionItemDs$current7.set(FN.BUSINESS_OBJECT_OPTION_CONDLIST, filterData);
        optionItemDs === null || optionItemDs === void 0 ? void 0 : optionItemDs.setState('deleteData', deleteFieldsList.current);
        // 保存查询域数据
        optionItemDs === null || optionItemDs === void 0 ? void 0 : optionItemDs.setState('fuzzyField', inquireDs === null || inquireDs === void 0 ? void 0 : (_inquireDs$current = inquireDs.current) === null || _inquireDs$current === void 0 ? void 0 : _inquireDs$current.toData());
        await optionItemDs.submit();
        await optionsListDs.query();
      } else {
        return false;
      }
    });
  }, [readOnlyFlag, copy, fieldsData, filterCacheRef === null || filterCacheRef === void 0 ? void 0 : filterCacheRef.current, optionItemDs, inquireDs === null || inquireDs === void 0 ? void 0 : inquireDs.current]);

  /**
   * 一个生成序号基数的算法
   * 解决的问题：
   * 比如原来的数据顺序：1，2，3
   * 但是后端不支持：1，2，3（顺序没变，但是这个顺序对应的记录变了）；2，3，4；3，4，5 这种类型的顺序
   * 必须生成一个全新的序号，跟原来的数字不能有一样的
   * 解决这个问题的关键在一个基数：只要能解决这个基数问题，就能解决所有问题
   * @param arr
   */
  const getBaseNumber = arr => {
    const len = arr.length;
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    if (min > len) {
      return 0;
    } else {
      return max + 1;
    }
  };
  const handleSelectFields = () => {
    optionFieldListDs.loadData(fieldsData);
    const cacheInquireData = inquireDs === null || inquireDs === void 0 ? void 0 : inquireDs.toData();
    Modal.open({
      title: intl.get('hmde.bo.businessObject.configField').d('配置字段'),
      style: {
        width: 957
      },
      bodyStyle: {
        paddingTop: 10
      },
      closable: true,
      border: false,
      autoCenter: true,
      children: /*#__PURE__*/React.createElement(SelectFieldsModal, {
        optionFieldDs: optionFieldListDs,
        businessObjectCode: businessObjectCode,
        baseInfoDS: baseInfoDS,
        inquireDs: inquireDs
      }),
      okFirst: false,
      onCancel: () => {
        inquireDs.loadData(cacheInquireData);
      },
      onOk: async () => {
        var _inquireDs$current2, _inquireDs$current2$g, _optionItemDs$current8;
        // 校验必输项
        const inquireFlag = await (inquireDs === null || inquireDs === void 0 ? void 0 : inquireDs.validate());
        if (!inquireFlag) return false;
        // 如果查询域存在字段,则查询域编码不能和筛选域重复
        if ((_inquireDs$current2 = inquireDs.current) !== null && _inquireDs$current2 !== void 0 && (_inquireDs$current2$g = _inquireDs$current2.get(InquireFN.fields)) !== null && _inquireDs$current2$g !== void 0 && _inquireDs$current2$g.length) {
          var _optionFieldListDs$to, _inquireDs$current3;
          const _queryFieldsData = (_optionFieldListDs$to = optionFieldListDs.toData()) === null || _optionFieldListDs$to === void 0 ? void 0 : _optionFieldListDs$to.filter(({
            queryFieldFlag
          }) => queryFieldFlag);
          const fuzzyFieldCode = (_inquireDs$current3 = inquireDs.current) === null || _inquireDs$current3 === void 0 ? void 0 : _inquireDs$current3.get(InquireFN.code);
          const fuzzyFieldFlag = _queryFieldsData === null || _queryFieldsData === void 0 ? void 0 : _queryFieldsData.some(({
            businessObjectFieldCode
          }) => businessObjectFieldCode === fuzzyFieldCode);
          if (fuzzyFieldFlag) {
            notification.error({
              message: intl.get('hmde.bo.businessObject.queryError').d('查询域字段名不能和筛选域重复')
            });
            return false;
          }
        }
        const businessObjectOptionFieldList = optionFieldListDs.toData() || [];
        const sortedList = businessObjectOptionFieldList.sort((a, b) => a.orderSeq - b.orderSeq);
        const baseNumber = getBaseNumber(sortedList.map(o => o.orderSeq));
        const data = sortedList.map((item, index) => {
          return {
            ...item,
            orderSeq: baseNumber + 1 + index
          };
        });
        // eslint-disable-next-line no-unused-expressions
        optionItemDs === null || optionItemDs === void 0 ? void 0 : (_optionItemDs$current8 = optionItemDs.current) === null || _optionItemDs$current8 === void 0 ? void 0 : _optionItemDs$current8.set(FN.BUSINESS_OBJECT_OPTION_FIELDLIST, data);
        if (optionItemDs.current) {
          if (!data.length) return false;
          validateOptionFieldList(data);
        }
      }
    });
  };
  const collationProps = {
    collationDs,
    readOnlyFlag,
    deleteFieldsList,
    businessObjectId,
    businessObjectOptionId: (_optionItemDs$current9 = optionItemDs.current) === null || _optionItemDs$current9 === void 0 ? void 0 : _optionItemDs$current9.get('businessObjectOptionId'),
    businessObjectCode,
    physicalModelType: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current6 = baseInfoDS.current) === null || _baseInfoDS$current6 === void 0 ? void 0 : _baseInfoDS$current6.get('physicalModelType')
  };

  /**
   * 获取钻取额外参数 sql对象时需要多穿一个useType查询sql对象的查询参数
   * @return
   */
  const getOtherDrillParam = () => {
    var _baseInfoDS$current7;
    const physicalModelType = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current7 = baseInfoDS.current) === null || _baseInfoDS$current7 === void 0 ? void 0 : _baseInfoDS$current7.get('physicalModelType');
    // 如果是 sql 对象 需要传 useType
    if (physicalModelType === PhysicalModelType.SQL) {
      return {
        useType: SQL_PARAM_CATEGORY.FIELD_PARAM
      };
    }
    return {};
  };
  useEffect(() => {
    var _filterCacheRef$curre7;
    optionItemDs.setState('filterConditionList', (_filterCacheRef$curre7 = filterCacheRef.current) === null || _filterCacheRef$curre7 === void 0 ? void 0 : _filterCacheRef$curre7.ds.toData());
  }, [optionItemDs, (_filterCacheRef$curre8 = filterCacheRef.current) === null || _filterCacheRef$curre8 === void 0 ? void 0 : _filterCacheRef$curre8.ds.length]);
  const noUseTypeFieldsLen = useMemo(() => {
    var _filterCacheRef$curre9, _filterCacheRef$curre10;
    return ((_filterCacheRef$curre9 = filterCacheRef.current) === null || _filterCacheRef$curre9 === void 0 ? void 0 : (_filterCacheRef$curre10 = _filterCacheRef$curre9.ds) === null || _filterCacheRef$curre10 === void 0 ? void 0 : _filterCacheRef$curre10.filter(r => (r === null || r === void 0 ? void 0 : r.get(FN.USE_TYPE)) !== SQL_PARAM_CATEGORY.QUERY_PARAM).length) || 0;
  }, [(_filterCacheRef$curre11 = filterCacheRef.current) === null || _filterCacheRef$curre11 === void 0 ? void 0 : _filterCacheRef$curre11.ds.length]);
  return /*#__PURE__*/React.createElement(_Spin, {
    spinning: optionItemDs.status === "loading"
  }, isTenant && ((_optionItemDs$current10 = optionItemDs.current) === null || _optionItemDs$current10 === void 0 ? void 0 : _optionItemDs$current10.get('tenantId')) === 0 && /*#__PURE__*/React.createElement(_Alert, {
    message: intl.get('hmde.bo.businessObject.optionListCopyTip').d('支持创建与标准值列表同编码的自定义值列表，优先使用自定义值列表'),
    type: "info",
    style: {
      marginBottom: 6
    },
    showIcon: true
  }), /*#__PURE__*/React.createElement(_Form, {
    dataSet: optionItemDs,
    columns: 2
    // useColon={false}
    // labelAlign={LabelAlign.left}
    ,
    disabled: readOnlyFlag,
    labelWidth: 125
  }, /*#__PURE__*/React.createElement(_IntlField, {
    name: FN.BUSINESS_OBJECT_OPTION_NAME,
    suffix: /*#__PURE__*/React.createElement(_Icon, {
      type: "language"
    })
  }), !optionId || copy ? /*#__PURE__*/React.createElement(_TextField, {
    name: FN.BUSINESS_OBJECT_OPTION_CODE,
    addonBefore: `${businessObjectCode}_`,
    maxLength: Number(90 - businessObjectCode.length - 1),
    showLengthInfo: true,
    clearButton: true
  }) : /*#__PURE__*/React.createElement(_Output, {
    name: FN.BUSINESS_OBJECT_OPTION_CODE
  }), /*#__PURE__*/React.createElement(_Select, {
    name: FN.DISPLAY_FIELD_CODE,
    noCache: true,
    label: /*#__PURE__*/React.createElement(LabelTitleRender, {
      value: intl.get('hmde.bo.businessObject.displayField').d('显示字段'),
      help: editFlag ? intl.get('hmde.bo.businessObject.displayField.help').d('修改「显示字段」后需重新发布业务对象生效') : undefined
    }),
    searchable: true,
    searchMatcher: params => objectFieldSearchMatcher(params)
  }), /*#__PURE__*/React.createElement(_IntlField, {
    name: "title",
    suffix: /*#__PURE__*/React.createElement(_Icon, {
      type: "language"
    })
  }), /*#__PURE__*/React.createElement(_NumberField, {
    name: "pageSize"
  }), /*#__PURE__*/React.createElement(_Switch, {
    name: FN.ENABLED_FLAG,
    onChange: (val, oldVal) => {
      var _optionsListDs$toData, _optionsListDs$toData2;
      if ((optionsListDs === null || optionsListDs === void 0 ? void 0 : (_optionsListDs$toData = optionsListDs.toData()) === null || _optionsListDs$toData === void 0 ? void 0 : (_optionsListDs$toData2 = _optionsListDs$toData.filter(item => item === null || item === void 0 ? void 0 : item.enabledFlag)) === null || _optionsListDs$toData2 === void 0 ? void 0 : _optionsListDs$toData2.length) === 1) {
        var _optionsListDs$toData3, _optionsListDs$toData4;
        if ((optionsListDs === null || optionsListDs === void 0 ? void 0 : (_optionsListDs$toData3 = optionsListDs.toData()) === null || _optionsListDs$toData3 === void 0 ? void 0 : (_optionsListDs$toData4 = _optionsListDs$toData3.find(item => item === null || item === void 0 ? void 0 : item.enabledFlag)) === null || _optionsListDs$toData4 === void 0 ? void 0 : _optionsListDs$toData4.businessObjectOptionId) === optionId && !val) {
          if (optionItemDs.current) optionItemDs.current.set('enabledFlag', oldVal);
          return notification.warning({
            message: intl.get('hmde.bo.businessObject.validation.disable').d('请至少启用一条值列表')
          });
        }
      }
      if (optionItemDs.current) optionItemDs.current.set('enabledFlag', val);
    }
  }), /*#__PURE__*/React.createElement(_Switch, {
    name: FN.DEFAULT_FLAG
  }), /*#__PURE__*/React.createElement(_Switch, {
    name: FN.MUST_PAGE_FLAG
  }), /*#__PURE__*/React.createElement(_IntlField, {
    name: FN.REMARK,
    newLine: true,
    colSpan: 2,
    suffix: /*#__PURE__*/React.createElement(_Icon, {
      type: "language"
    })
  }), /*#__PURE__*/React.createElement(_Output, {
    label: /*#__PURE__*/React.createElement(React.Fragment, null, intl.get('hmde.bo.businessObject.viewField').d('视图字段'), /*#__PURE__*/React.createElement("span", {
      className: styles['view-field']
    })),
    required: true,
    newLine: true,
    colSpan: 2,
    value: (_optionItemDs$current11 = optionItemDs.current) === null || _optionItemDs$current11 === void 0 ? void 0 : _optionItemDs$current11.get(FN.BUSINESS_OBJECT_OPTION_FIELDLIST),
    renderer: () => /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'right'
      }
    }, /*#__PURE__*/React.createElement(_Button, {
      style: {
        borderStyle: 'dashed',
        display: 'flex',
        alignItems: 'center',
        ...optionFieldsStyle
      },
      onClick: () => handleSelectFields()
    }, /*#__PURE__*/React.createElement(ImgIcon, {
      name: "settings.svg",
      size: 14,
      style: {
        marginRight: 8
      }
    }), /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.configField').d('配置字段'))))
  })), !!fieldsData.length && /*#__PURE__*/React.createElement("div", {
    className: styles['config-detail']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['option-columns-header']
  }, intl.get('hmde.bo.businessObject.viewPreview').d('视图预览')), (!!(queryFieldsData !== null && queryFieldsData !== void 0 && queryFieldsData.length) || !!((_inquireDs$current4 = inquireDs.current) !== null && _inquireDs$current4 !== void 0 && (_inquireDs$current4$g = _inquireDs$current4.get(InquireFN.fields)) !== null && _inquireDs$current4$g !== void 0 && _inquireDs$current4$g.length)) && /*#__PURE__*/React.createElement("div", {
    className: styles['option-query-fields']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['option-columns-query-title']
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "filter2 ",
    style: {
      marginRight: 4
    }
  }), intl.get('hmde.bo.businessObject.filterArea').d('筛选域')), ((_inquireDs$current5 = inquireDs.current) === null || _inquireDs$current5 === void 0 ? void 0 : _inquireDs$current5.get(InquireFN.fields).length) > 0 && /*#__PURE__*/React.createElement("span", {
    className: styles['query-option-field']
  }, (_inquireDs$current6 = inquireDs.current) === null || _inquireDs$current6 === void 0 ? void 0 : _inquireDs$current6.get(InquireFN.name)), queryFieldsData.map(({
    displayName,
    businessObjectFieldName,
    uuid
  }) => {
    var _businessObjectFieldN;
    return /*#__PURE__*/React.createElement("span", {
      className: styles['query-option-field'],
      key: uuid
    }, displayName || (businessObjectFieldName === null || businessObjectFieldName === void 0 ? void 0 : businessObjectFieldName.slice((businessObjectFieldName === null || businessObjectFieldName === void 0 ? void 0 : (_businessObjectFieldN = businessObjectFieldName.lastIndexOf) === null || _businessObjectFieldN === void 0 ? void 0 : _businessObjectFieldN.call(businessObjectFieldName, '.')) + 1)));
  })), /*#__PURE__*/React.createElement("div", {
    className: styles['option-columns-list']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['option-columns-list-title']
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "view_list-o",
    style: {
      marginRight: 4
    }
  }), intl.get('hmde.bo.businessObject.listArea').d('列表域')), /*#__PURE__*/React.createElement("div", {
    className: styles['option-columns']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['option-columns-fields']
  }, fieldsData.map(({
    displayName,
    businessObjectFieldName
  }) => {
    var _businessObjectFieldN2;
    return /*#__PURE__*/React.createElement("span", {
      className: styles['list-option-field'],
      key: businessObjectFieldName
    }, displayName || (businessObjectFieldName === null || businessObjectFieldName === void 0 ? void 0 : businessObjectFieldName.slice((businessObjectFieldName === null || businessObjectFieldName === void 0 ? void 0 : (_businessObjectFieldN2 = businessObjectFieldName.lastIndexOf) === null || _businessObjectFieldN2 === void 0 ? void 0 : _businessObjectFieldN2.call(businessObjectFieldName, '.')) + 1)));
  }))))), !_isEmpty((_optionItemDs$current12 = optionItemDs.current) === null || _optionItemDs$current12 === void 0 ? void 0 : _optionItemDs$current12.get(FN.BUSINESS_OBJECT_OPTION_FIELDLIST)) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Collation, collationProps)), /*#__PURE__*/React.createElement(NewFilterCondition, {
    filterCacheRef: filterCacheRef,
    data: filterConditionList,
    busObjectCode: businessObjectCode,
    logicFormulaName: FN.LOGIC_FORMULA,
    detailDsV: optionItemDs,
    lookupCode: "HMDE.OPTION.FILTER_CONDTION_VALUE_TYPE",
    name: FN.BUSINESS_OBJECT_OPTION_CONDLIST,
    leftExpressionName: "leftExpressionName",
    rightExpressionName: "rightExpressionName",
    addDisabled: readOnlyFlag,
    showTopLable: true,
    businessObjectName: businessObjectName,
    otherDrillParams: getOtherDrillParam()
  }), optionItemDs.getState('showLogicFormula') && noUseTypeFieldsLen > 0 && /*#__PURE__*/React.createElement(_Form, {
    dataSet: optionItemDs,
    columns: 2,
    style: {
      backgroundColor: '#F9F9F9',
      padding: '0 16px 12px 16px'
    },
    disabled: readOnlyFlag
  }, /*#__PURE__*/React.createElement(_TextField, {
    name: FN.LOGIC_FORMULA,
    colSpan: 2
  })));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Option));