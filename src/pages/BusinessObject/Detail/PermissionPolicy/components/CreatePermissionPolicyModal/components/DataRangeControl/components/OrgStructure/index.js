import _Row from "choerodon-ui/pro/lib/row";
import _Radio from "@hzero-front-ui/c7n-ui/lib/RadioPro";
import _Alert from "@hzero-front-ui/c7n-ui/lib/Alert";
import _Col from "choerodon-ui/pro/lib/col";
import _Collapse from "@hzero-front-ui/c7n-ui/lib/Collapse";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _CheckBox from "@hzero-front-ui/c7n-ui/lib/CheckBoxPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useEffect, useState, useMemo, useRef } from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import intl from 'utils/intl';
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import DrillComponent, { EDrillMainKeyType } from 'hzero-front-apaas/lib/components/DrillComponent';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import notification from 'utils/notification';
import { useRequest, useUpdateEffect } from 'ahooks';
import { getDrillFIeldType } from "hzero-front-hmde/lib/utils/common";
import { lowcodeRequest } from "hzero-front-apaas/lib/utils/lowcodeRequest";
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { DEFAULT_STALE_TIME } from "hzero-front-apaas/lib/constants/request";
import styles from "./index.less?modules";
var FN = /*#__PURE__*/function (FN) {
  FN["base"] = "rightValue";
  FN["field"] = "field";
  FN["field_drill"] = "field_drill";
  FN["componentType"] = "leftFieldType";
  FN["operatorType"] = "operatorType";
  FN["templateName"] = "templateName";
  return FN;
}(FN || {});
const App = prop => {
  var _linkFieldList$map, _baseInfoDs$current4, _ds$current23;
  const modal = prop.modal,
    baseInfoDs = prop.baseInfoDs,
    _prop$commonDataRange = prop.commonDataRange,
    commonDataRange = _prop$commonDataRange === void 0 ? [] : _prop$commonDataRange,
    handleCreateItem = prop.handleCreateItem,
    record = prop.record;
  const _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    FieldCode = _useState2[0],
    setFieldCode = _useState2[1];
  const _useState3 = useState(''),
    _useState4 = _slicedToArray(_useState3, 2),
    baseFieldId = _useState4[0],
    setBaseFieldId = _useState4[1];
  const _useState5 = useState(''),
    _useState6 = _slicedToArray(_useState5, 2),
    drillBusinessObjectCode = _useState6[0],
    setDrillBusinessObjectCode = _useState6[1];
  const firstRef = useRef(false);
  const ds = useMemo(() => new _DataSet({
    autoCreate: true,
    autoQuery: false,
    fields: [{
      name: FN.base,
      type: "string",
      required: true,
      multiple: false
    }, {
      name: FN.field_drill,
      type: "string"
    }, {
      name: FN.field,
      type: "string"
    }, {
      name: FN.componentType,
      type: "string"
    }, {
      name: FN.operatorType,
      type: "string"
    }].filter(Boolean)
  }), []);
  const _useRequest = useRequest(() => {
      var _baseInfoDs$current, _baseInfoDs$current2;
      return lowcodeRequest(`${lowcodeOrganizationURL({
        route: HZERO_HMDE
      })}/explain/business-object/operator/list`, {
        method: 'GET',
        query: {
          businessObjectCode: drillBusinessObjectCode || (baseInfoDs === null || baseInfoDs === void 0 ? void 0 : (_baseInfoDs$current = baseInfoDs.current) === null || _baseInfoDs$current === void 0 ? void 0 : _baseInfoDs$current.get('businessObjectCode')),
          businessObjectFieldCode: FieldCode,
          draftFieldFlag: true,
          tenantId: baseInfoDs === null || baseInfoDs === void 0 ? void 0 : (_baseInfoDs$current2 = baseInfoDs.current) === null || _baseInfoDs$current2 === void 0 ? void 0 : _baseInfoDs$current2.get('tenantId')
        }
      });
    }, {
      manual: true,
      cacheKey: FieldCode,
      staleTime: DEFAULT_STALE_TIME * 12
    }),
    data = _useRequest.data,
    run = _useRequest.run;
  const _useRequest2 = useRequest(() => {
      var _baseInfoDs$current3;
      return lowcodeRequest(`${lowcodeOrganizationURL({
        route: HZERO_HMDE
      })}/business-object-fields/permission-field/list`, {
        method: 'GET',
        query: {
          businessObjectId: baseInfoDs === null || baseInfoDs === void 0 ? void 0 : (_baseInfoDs$current3 = baseInfoDs.current) === null || _baseInfoDs$current3 === void 0 ? void 0 : _baseInfoDs$current3.get('businessObjectId'),
          masterBusinessObjectId: baseFieldId
        }
      });
    }, {
      manual: true,
      cacheKey: baseFieldId,
      staleTime: DEFAULT_STALE_TIME * 12
    }),
    _useRequest2$data = _useRequest2.data,
    linkFieldList = _useRequest2$data === void 0 ? [] : _useRequest2$data,
    linkFieldRun = _useRequest2.run;
  useEffect(() => {
    record && (ds === null || ds === void 0 ? void 0 : ds.loadData([record]));
  }, []);
  useEffect(() => {
    if (record && !firstRef.current) {
      const currentItem = linkFieldList === null || linkFieldList === void 0 ? void 0 : linkFieldList.find(v => v.fieldPath === (record === null || record === void 0 ? void 0 : record.get('leftFieldCode')));
      if (currentItem) {
        var _ds$current, _ds$current2;
        ds === null || ds === void 0 ? void 0 : (_ds$current = ds.current) === null || _ds$current === void 0 ? void 0 : _ds$current.set(FN.field, record === null || record === void 0 ? void 0 : record.get('leftFieldCode'));
        ds === null || ds === void 0 ? void 0 : (_ds$current2 = ds.current) === null || _ds$current2 === void 0 ? void 0 : _ds$current2.set(FN.field_drill, undefined);
        firstRef.current = true;
      } else {
        var _ds$current3, _ds$current4;
        ds === null || ds === void 0 ? void 0 : (_ds$current3 = ds.current) === null || _ds$current3 === void 0 ? void 0 : _ds$current3.set(FN.field_drill, record === null || record === void 0 ? void 0 : record.get('leftFieldCode'));
        ds === null || ds === void 0 ? void 0 : (_ds$current4 = ds.current) === null || _ds$current4 === void 0 ? void 0 : _ds$current4.set(FN.field, undefined);
      }
    }
  }, [linkFieldList]);
  useEffect(() => {
    if (FieldCode) {
      run();
    }
  }, [FieldCode]);
  useUpdateEffect(() => {
    if (baseFieldId) {
      linkFieldRun();
    } else {
      var _ds$current5;
      ds === null || ds === void 0 ? void 0 : (_ds$current5 = ds.current) === null || _ds$current5 === void 0 ? void 0 : _ds$current5.set(FN.field, undefined);
    }
  }, [baseFieldId]);
  useEffect(() => {
    const _ref = data || {},
      operationExplainList = _ref.operationExplainList;
    if (operationExplainList !== null && operationExplainList !== void 0 && operationExplainList.length) {
      var _ds$current6;
      ds === null || ds === void 0 ? void 0 : (_ds$current6 = ds.current) === null || _ds$current6 === void 0 ? void 0 : _ds$current6.set(FN.operatorType, operationExplainList.find(v => v.operatorType === 'IN') ? 'IN' : 'EQUAL');
    }
  }, [data]);
  const _useState7 = useState([]),
    _useState8 = _slicedToArray(_useState7, 2),
    panelActive = _useState8[0],
    setPanelActive = _useState8[1];
  const _useState9 = useState(''),
    _useState10 = _slicedToArray(_useState9, 2),
    searchValue = _useState10[0],
    setSearchValue = _useState10[1];
  const _useState11 = useState([]),
    _useState12 = _slicedToArray(_useState11, 2),
    showData = _useState12[0],
    setShowData = _useState12[1];
  useEffect(() => {
    var _record$get;
    let gCode = commonDataRange[0].groupCode;
    if (record !== null && record !== void 0 && (_record$get = record.get) !== null && _record$get !== void 0 && _record$get.call(record, FN.base)) {
      commonDataRange === null || commonDataRange === void 0 ? void 0 : commonDataRange.some(v => {
        var _v$templateList;
        return v === null || v === void 0 ? void 0 : (_v$templateList = v.templateList) === null || _v$templateList === void 0 ? void 0 : _v$templateList.some(item => {
          if (item.templateCode === (record === null || record === void 0 ? void 0 : record.get(FN.base))) {
            gCode = v.groupCode;
            setBaseFieldId(item.businessObjectId);
            return true;
          }
        });
      });
    }
    if (!record) {
      var _ds$current7, _commonDataRange$, _commonDataRange$$tem, _commonDataRange$$tem2, _commonDataRange$2, _commonDataRange$2$te, _commonDataRange$2$te2;
      ds === null || ds === void 0 ? void 0 : (_ds$current7 = ds.current) === null || _ds$current7 === void 0 ? void 0 : _ds$current7.set(FN.base, commonDataRange === null || commonDataRange === void 0 ? void 0 : (_commonDataRange$ = commonDataRange[0]) === null || _commonDataRange$ === void 0 ? void 0 : (_commonDataRange$$tem = _commonDataRange$.templateList) === null || _commonDataRange$$tem === void 0 ? void 0 : (_commonDataRange$$tem2 = _commonDataRange$$tem[0]) === null || _commonDataRange$$tem2 === void 0 ? void 0 : _commonDataRange$$tem2.templateCode);
      setBaseFieldId(commonDataRange === null || commonDataRange === void 0 ? void 0 : (_commonDataRange$2 = commonDataRange[0]) === null || _commonDataRange$2 === void 0 ? void 0 : (_commonDataRange$2$te = _commonDataRange$2.templateList) === null || _commonDataRange$2$te === void 0 ? void 0 : (_commonDataRange$2$te2 = _commonDataRange$2$te[0]) === null || _commonDataRange$2$te2 === void 0 ? void 0 : _commonDataRange$2$te2.businessObjectId);
    }
    setPanelActive([gCode]);
    setShowData(commonDataRange);
  }, [commonDataRange]);
  const seatchList = () => {
    if (searchValue) {
      const filterData = commonDataRange.map(v => ({
        ...v,
        templateList: v.templateList.filter(item => item.templateName.includes(searchValue))
      }));
      setShowData(filterData);
    } else {
      setShowData(commonDataRange);
    }
  };
  modal === null || modal === void 0 ? void 0 : modal.handleOk(async () => {
    var _ds$current8, _ds$current9, _ds$current10, _ds$current11, _ds$current12, _ds$current13, _ds$current14, _ds$current15, _ds$current16, _ds$current17;
    if (!(ds !== null && ds !== void 0 && (_ds$current8 = ds.current) !== null && _ds$current8 !== void 0 && _ds$current8.get(FN.base)) || (ds === null || ds === void 0 ? void 0 : (_ds$current9 = ds.current) === null || _ds$current9 === void 0 ? void 0 : _ds$current9.get(FN.base)) === 'false') {
      notification.error({
        message: intl.get('hmde.bo.businessObject.ChooseDataRange').d('请选择常用数据范围')
      });
      return false;
    }
    if (!(ds !== null && ds !== void 0 && (_ds$current10 = ds.current) !== null && _ds$current10 !== void 0 && _ds$current10.get(FN.field)) && !(ds !== null && ds !== void 0 && (_ds$current11 = ds.current) !== null && _ds$current11 !== void 0 && _ds$current11.get(FN.field_drill))) {
      notification.error({
        message: intl.get('hmde.bo.businessObject.ChooseLimitationField').d('请选择限制字段')
      });
      return false;
    }
    handleCreateItem === null || handleCreateItem === void 0 ? void 0 : handleCreateItem({
      leftFieldCode: (ds === null || ds === void 0 ? void 0 : (_ds$current12 = ds.current) === null || _ds$current12 === void 0 ? void 0 : _ds$current12.get(FN.field)) || (ds === null || ds === void 0 ? void 0 : (_ds$current13 = ds.current) === null || _ds$current13 === void 0 ? void 0 : _ds$current13.get(FN.field_drill)),
      leftFieldType: ds === null || ds === void 0 ? void 0 : (_ds$current14 = ds.current) === null || _ds$current14 === void 0 ? void 0 : _ds$current14.get(FN.componentType),
      operatorType: ds === null || ds === void 0 ? void 0 : (_ds$current15 = ds.current) === null || _ds$current15 === void 0 ? void 0 : _ds$current15.get(FN.operatorType),
      rightValue: ds === null || ds === void 0 ? void 0 : (_ds$current16 = ds.current) === null || _ds$current16 === void 0 ? void 0 : _ds$current16.get(FN.base),
      // leftFieldName: ds?.current?.get(FN.leftFieldName),
      templateName: ds === null || ds === void 0 ? void 0 : (_ds$current17 = ds.current) === null || _ds$current17 === void 0 ? void 0 : _ds$current17.get(FN.templateName),
      rightValueType: 'template'
    }, record === null || record === void 0 ? void 0 : record.id);
  });
  useDataSetEvents(ds, 'update', ({
    name,
    value
  }) => {
    if (name === FN.base) {
      var _ds$current18;
      let templateName = '';
      commonDataRange === null || commonDataRange === void 0 ? void 0 : commonDataRange.some(v => {
        var _v$templateList2;
        return v === null || v === void 0 ? void 0 : (_v$templateList2 = v.templateList) === null || _v$templateList2 === void 0 ? void 0 : _v$templateList2.some(item => {
          if (item.templateCode === value) {
            templateName = item.templateName;
            setBaseFieldId(item.businessObjectId);
            return true;
          }
        });
      });
      ds === null || ds === void 0 ? void 0 : (_ds$current18 = ds.current) === null || _ds$current18 === void 0 ? void 0 : _ds$current18.set(FN.templateName, templateName);
    }
    if (name === FN.field_drill && value) {
      var _ds$current19;
      ds === null || ds === void 0 ? void 0 : (_ds$current19 = ds.current) === null || _ds$current19 === void 0 ? void 0 : _ds$current19.set(FN.field, null);
    }
    if (name === FN.field && value) {
      var _ds$current20, _ds$current21, _ds$current22;
      ds === null || ds === void 0 ? void 0 : (_ds$current20 = ds.current) === null || _ds$current20 === void 0 ? void 0 : _ds$current20.set(FN.field_drill, undefined);
      const curItem = linkFieldList === null || linkFieldList === void 0 ? void 0 : linkFieldList.find(v => v.fieldPath === value);
      ds === null || ds === void 0 ? void 0 : (_ds$current21 = ds.current) === null || _ds$current21 === void 0 ? void 0 : _ds$current21.set(FN.componentType, curItem === null || curItem === void 0 ? void 0 : curItem.componentType);
      // ds?.current?.set(FN.leftFieldName, curItem?.relationName);
      ds === null || ds === void 0 ? void 0 : (_ds$current22 = ds.current) === null || _ds$current22 === void 0 ? void 0 : _ds$current22.set(FN.operatorType, 'IN');
    }
  });
  return /*#__PURE__*/React.createElement(_Row, {
    gutter: 16
  }, /*#__PURE__*/React.createElement(_Col, {
    span: 16
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.colBox
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.orgStructureTitle,
    style: {
      paddingLeft: '8px'
    }
  }, intl.get('hmde.bo.businessObject.selectionRangeData').d('选择数据范围')), /*#__PURE__*/React.createElement(_TextField, {
    className: styles.searchBox,
    placeholder: intl.get('hmde.bo.businessObject.searchDataRange').d('请搜索常用范围'),
    onInput: v => {
      var _v$target;
      return setSearchValue(v === null || v === void 0 ? void 0 : (_v$target = v.target) === null || _v$target === void 0 ? void 0 : _v$target.value);
    },
    onChange: seatchList,
    prefix: /*#__PURE__*/React.createElement(_Icon, {
      type: "search",
      style: {
        cursor: 'pointer'
      },
      onClick: seatchList
    })
  }), /*#__PURE__*/React.createElement(_Collapse, {
    style: {
      marginTop: '16px'
    },
    activeKey: panelActive,
    onChange: key => {
      setPanelActive(key);
    }
  }, showData.map(v => {
    var _v$templateList3;
    return /*#__PURE__*/React.createElement(_Collapse.Panel, {
      header: /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: '14px',
          fontWeight: 700
        }
      }, v.groupName),
      key: v.groupCode,
      collapsible: "icon"
    }, /*#__PURE__*/React.createElement(_Form, {
      dataSet: ds,
      columns: 2,
      className: styles.orgStructure
    }, v === null || v === void 0 ? void 0 : (_v$templateList3 = v.templateList) === null || _v$templateList3 === void 0 ? void 0 : _v$templateList3.map(item => /*#__PURE__*/React.createElement(_CheckBox, {
      mode: 'button',
      name: FN.base,
      value: item.templateCode,
      key: item.templateCode
    }, /*#__PURE__*/React.createElement(_Tooltip, {
      title: item.templateName,
      theme: "dark",
      mouseEnterDelay: 300
    }, item.templateName)))));
  })))), /*#__PURE__*/React.createElement(_Col, {
    span: 8
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.colBox
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.orgStructureTitle
  }, intl.get('hmde.bo.businessObject.limitationField').d('限制字段')), /*#__PURE__*/React.createElement(_Alert, {
    message: intl.get('hmde.bo.businessObject.limitationField.help').d('查询满足特定条件（即【限制字段】的值）的【数据范围】内的数据。'),
    type: "info",
    showIcon: true,
    style: {
      marginBottom: '8px'
    }
  }), /*#__PURE__*/React.createElement(_Form, {
    dataSet: ds,
    columns: 1,
    className: styles.orgStructure
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '8px'
    }
  }, baseFieldId && (linkFieldList === null || linkFieldList === void 0 ? void 0 : (_linkFieldList$map = linkFieldList.map) === null || _linkFieldList$map === void 0 ? void 0 : _linkFieldList$map.call(linkFieldList, v => /*#__PURE__*/React.createElement("div", {
    key: v.fieldPath
  }, /*#__PURE__*/React.createElement(_Radio, {
    name: FN.field,
    value: v.fieldPath
  }, `${v.relationName}(${v.relationCode})`))))), /*#__PURE__*/React.createElement("div", {
    className: styles.drillBox
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.drillTitle
  }, intl.get('hmde.bo.businessObject.chooseOtherField').d('选择其它字段')), /*#__PURE__*/React.createElement(DrillComponent, {
    name: FN.field_drill,
    businessObjectCode: baseInfoDs === null || baseInfoDs === void 0 ? void 0 : (_baseInfoDs$current4 = baseInfoDs.current) === null || _baseInfoDs$current4 === void 0 ? void 0 : _baseInfoDs$current4.get('businessObjectCode'),
    drillMainKeyType: EDrillMainKeyType.ALL,
    initValue: (ds === null || ds === void 0 ? void 0 : (_ds$current23 = ds.current) === null || _ds$current23 === void 0 ? void 0 : _ds$current23.get(FN.field_drill)) || '',
    selectObjectCheckFlag: true,
    onOk: res => {
      var _ds$current24, _ds$current25, _res$result, _res$result2, _res$result3;
      ds === null || ds === void 0 ? void 0 : (_ds$current24 = ds.current) === null || _ds$current24 === void 0 ? void 0 : _ds$current24.set(FN.field_drill, res === null || res === void 0 ? void 0 : res.value);
      ds === null || ds === void 0 ? void 0 : (_ds$current25 = ds.current) === null || _ds$current25 === void 0 ? void 0 : _ds$current25.set(FN.componentType, res === null || res === void 0 ? void 0 : (_res$result = res.result) === null || _res$result === void 0 ? void 0 : _res$result.componentType);
      setDrillBusinessObjectCode((res === null || res === void 0 ? void 0 : (_res$result2 = res.result) === null || _res$result2 === void 0 ? void 0 : _res$result2.businessObjectCode) || '');
      setFieldCode((res === null || res === void 0 ? void 0 : (_res$result3 = res.result) === null || _res$result3 === void 0 ? void 0 : _res$result3.businessObjectFieldCode) || '');
      // ds?.current?.set(FN.leftFieldName, res?.result?.businessObjectFieldName);
      firstRef.current = true;
    },
    onClear: () => {
      var _ds$current26, _ds$current27;
      ds === null || ds === void 0 ? void 0 : (_ds$current26 = ds.current) === null || _ds$current26 === void 0 ? void 0 : _ds$current26.set(FN.field_drill, undefined);
      ds === null || ds === void 0 ? void 0 : (_ds$current27 = ds.current) === null || _ds$current27 === void 0 ? void 0 : _ds$current27.set(FN.componentType, undefined);
      setFieldCode('');
      firstRef.current = true;
    },
    componentTypeList: getDrillFIeldType === null || getDrillFIeldType === void 0 ? void 0 : getDrillFIeldType(['FORMULA', 'REFERENCE_FIELD', 'CHECKBOX', 'MULTIPLE_SELECT'])
  }))))));
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(App));