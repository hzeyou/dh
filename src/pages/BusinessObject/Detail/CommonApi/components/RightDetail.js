import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Collapse from "@hzero-front-ui/c7n-ui/lib/Collapse";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _DataSet from "choerodon-ui/pro/lib/data-set";
/* eslint-disable no-param-reassign */
import React, { useEffect, useImperativeHandle, useMemo, useState } from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { LabelAlign } from 'choerodon-ui/pro/lib/form/enum';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import intl from 'utils/intl';
import { getCurrentOrganizationId, getResponse, isTenantRoleLevel } from 'utils/utils';
import notification from 'utils/notification';
import { uuid } from "hzero-front-hmde/lib/utils/common";
import LovToBoDetail from "hzero-front-hmde/lib/businessComponents/LovToBoDetail";
import AddAndEditField from "hzero-front-hmde/lib/routes/BusinessObject/Detail/FieldsList/AddAndEditField";
import BOPermissionButton from "hzero-front-hmde/lib/routes/BusinessObject/Detail/components/BOPermissionButton";
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
import { TAB_KEYS } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/TabItemList";
import { detailDataSet, DetailDataSetFN, getApiFieldDataSet, objectFieldListDataSet, paramsAllDataSet, paramsTableDataSet } from "../datasets";
import styles from "../index.less?modules";
import ParamsTable from "./ParamsTable";
const isTenant = isTenantRoleLevel();
const tenantId = getCurrentOrganizationId();
const App = ({
  activeKey,
  baseInfoDS,
  detailRef,
  optionsListDs,
  dirtyRef
}) => {
  var _boStore$getState, _boStore$getState2, _boStore$getState3, _boStore$getState4, _baseInfoDS$current2, _baseInfoDS$current3, _modelDetailDs$curren8, _modelDetailDs$curren9;
  const boStore = useBoStore();
  const hasPermission = (_boStore$getState = boStore === null || boStore === void 0 ? void 0 : (_boStore$getState2 = boStore.getState) === null || _boStore$getState2 === void 0 ? void 0 : _boStore$getState2.call(boStore, 'hasPermission')) !== null && _boStore$getState !== void 0 ? _boStore$getState : true;
  const objVersionKey = boStore === null || boStore === void 0 ? void 0 : (_boStore$getState3 = boStore.getState) === null || _boStore$getState3 === void 0 ? void 0 : _boStore$getState3.call(boStore, 'objVersionKey');
  const boDetailTabActiveKey = boStore === null || boStore === void 0 ? void 0 : (_boStore$getState4 = boStore.getState) === null || _boStore$getState4 === void 0 ? void 0 : _boStore$getState4.call(boStore, 'boDetailTabActiveKey');
  const modelDetailDs = useMemo(() => {
    var _baseInfoDS$current;
    return new _DataSet(detailDataSet(baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('businessObjectId'), objVersionKey));
  }, []);
  const paramsAllDs = useMemo(() => {
    return new _DataSet(paramsAllDataSet());
  }, []);
  const inParamsDs = useMemo(() => {
    return new _DataSet(paramsTableDataSet(activeKey, 'INPUT'));
  }, [activeKey]);
  const outParamsDs = useMemo(() => {
    return new _DataSet(paramsTableDataSet(activeKey, 'OUTPUT'));
  }, [activeKey]);
  const getApiFieldDs = useMemo(() => {
    return new _DataSet(getApiFieldDataSet());
  }, []);
  const isSaveChanged = modelDetailDs.dirty || inParamsDs.dirty || outParamsDs.dirty;
  const isApiTenantType = (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : _baseInfoDS$current2.get('sourceType')) !== 'TENANT' && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current3 = baseInfoDS.current) === null || _baseInfoDS$current3 === void 0 ? void 0 : _baseInfoDS$current3.get('physicalModelType')) === 'API' && isTenant;

  // 业务对象字段ds
  const objectFieldListDs = useMemo(() => {
    var _baseInfoDS$current4;
    return new _DataSet(objectFieldListDataSet(baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current4 = baseInfoDS.current) === null || _baseInfoDS$current4 === void 0 ? void 0 : _baseInfoDS$current4.get('businessObjectId')));
  }, []);
  const initGetFieldList = () => {
    objectFieldListDs === null || objectFieldListDs === void 0 ? void 0 : objectFieldListDs.query(1).then(res => {
      if (getResponse(res)) {
        var _inParamsDs$getField, _outParamsDs$getField;
        res = [{
          businessObjectFieldName: intl.get('hmde.bo.businessObject.CustomAttribute').d('自定义属性'),
          businessObjectFieldId: 'CUSTOM'
        }, ...res];
        (_inParamsDs$getField = inParamsDs.getField('businessObjectFieldId')) === null || _inParamsDs$getField === void 0 ? void 0 : _inParamsDs$getField.set('options', new _DataSet({
          paging: false,
          data: res
        }));
        (_outParamsDs$getField = outParamsDs.getField('businessObjectFieldId')) === null || _outParamsDs$getField === void 0 ? void 0 : _outParamsDs$getField.set('options', new _DataSet({
          paging: false,
          data: res
        }));
      }
    });
  };
  useEffect(() => {
    initGetFieldList();
  }, []);
  const handleInit = () => {
    handleClearData();
    handleCloseDetail();
    modelDetailDs.removeAll();
    modelDetailDs === null || modelDetailDs === void 0 ? void 0 : modelDetailDs.query(1, {
      type: activeKey,
      tenantId
    }).then(res => {
      if (getResponse(res)) {
        var _res$inputApiParamLis, _res$outputApiParamLi;
        if (res !== null && res !== void 0 && (_res$inputApiParamLis = res.inputApiParamList) !== null && _res$inputApiParamLis !== void 0 && _res$inputApiParamLis.length) {
          inParamsDs.loadData(handleParamData(res === null || res === void 0 ? void 0 : res.inputApiParamList));
        }
        if (res !== null && res !== void 0 && (_res$outputApiParamLi = res.outputApiParamList) !== null && _res$outputApiParamLi !== void 0 && _res$outputApiParamLi.length) {
          outParamsDs.loadData(handleParamData(res === null || res === void 0 ? void 0 : res.outputApiParamList));
        }
        res.apiId && getAddFieldList(res.apiId);
      }
    });
  };
  useEffect(() => {
    if (activeKey) {
      handleInit();
    }
  }, [activeKey]);
  useImperativeHandle(dirtyRef, () => ({
    modelDetailDs,
    outParamsDs,
    inParamsDs
  }), [outParamsDs, inParamsDs, modelDetailDs]);

  // 置空数据
  const handleClearData = () => {
    inParamsDs.loadData([]);
    outParamsDs.loadData([]);
    setInParamsList([]);
    setOutParamsList([]);
  };

  // 处理数据, 后端把数据都放入一个对象中, 需要取出来处理
  const handleParamData = data => {
    data = flathandleData(data, 'apiParamList');
    data.forEach(v => {
      if (v.mappingType === 'CUSTOM') {
        v.businessObjectFieldId = 'CUSTOM';
      } else if (v.businessObjectFieldId) {
        v.mappingType = 'FIELD';
      } else {
        v.mappingType = 'UNDEFINED';
      }
    });
    return data;
  };

  // 数据打平
  const flathandleData = (data, key) => {
    let fieldList = [];
    data === null || data === void 0 ? void 0 : data.map(item => {
      var _item$key;
      const _uuid = uuid();
      Object.assign(item, {
        id1: _uuid
      });
      fieldList = [...fieldList, item];
      if (item !== null && item !== void 0 && (_item$key = item[key]) !== null && _item$key !== void 0 && _item$key.length) {
        var _item$key2;
        const arr = item === null || item === void 0 ? void 0 : (_item$key2 = item[key]) === null || _item$key2 === void 0 ? void 0 : _item$key2.map(i => {
          const _uuid2 = uuid();
          return {
            ...i,
            parentId1: _uuid,
            id1: _uuid2
          };
        });
        fieldList = [...fieldList, ...arr];
      }
      return item;
    });
    return [...fieldList];
  };

  // 数据合并
  const toTree = selectData => {
    let _list = [];
    selectData.forEach(i => {
      return Object.assign(i, {
        apiParamList: undefined
      });
    });
    _list = selectData.filter(v => !v.parentId1);

    // 处理子节点
    selectData.forEach(v => {
      if (v.parentId1) {
        _list.forEach(item => {
          if (item.id1 === v.parentId1) {
            // eslint-disable-next-line no-param-reassign
            !item.apiParamList && (item.apiParamList = []);
            item.apiParamList.push(v);
          }
        });
      }
    });
    return _list;
  };

  // 获取新增字段列表的数据
  const _useState = useState(),
    _useState2 = _slicedToArray(_useState, 2),
    inParamsList = _useState2[0],
    setInParamsList = _useState2[1];
  const _useState3 = useState(),
    _useState4 = _slicedToArray(_useState3, 2),
    outParamsList = _useState4[0],
    setOutParamsList = _useState4[1];
  const getAddFieldList = apiId => {
    getApiFieldDs.query(1, {
      apiId
    }).then(res => {
      if (getResponse(res)) {
        setInParamsList(flathandleData(res === null || res === void 0 ? void 0 : res.filter(v => v.paramCategory === 'INPUT'), 'childApiParams'));
        setOutParamsList(flathandleData(res === null || res === void 0 ? void 0 : res.filter(v => v.paramCategory === 'OUTPUT'), 'childApiParams'));
      }
    });
  };
  useDataSetEvents(modelDetailDs, 'update', ({
    name,
    value,
    record
  }) => {
    // 获取出参入参的数据
    if (name === DetailDataSetFN.API_OBJ) {
      if (value) {
        var _baseInfoDS$current5, _modelDetailDs$curren;
        paramsAllDs.query(1, {
          businessObjectId: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current5 = baseInfoDS.current) === null || _baseInfoDS$current5 === void 0 ? void 0 : _baseInfoDS$current5.get('businessObjectId'),
          type: activeKey,
          relatedApiId: modelDetailDs === null || modelDetailDs === void 0 ? void 0 : (_modelDetailDs$curren = modelDetailDs.current) === null || _modelDetailDs$curren === void 0 ? void 0 : _modelDetailDs$curren.get(DetailDataSetFN.API_ID)
        }).then(res => {
          inParamsDs.loadData(handleParamData(res === null || res === void 0 ? void 0 : res.inputApiParamList));
          outParamsDs.loadData(handleParamData(res === null || res === void 0 ? void 0 : res.outputApiParamList));
        });
        getAddFieldList(record === null || record === void 0 ? void 0 : record.get(DetailDataSetFN.API_ID));
      } else {
        handleClearData();
      }
    }
  });
  const handleSave = async () => {
    if (await modelDetailDs.validate()) {
      var _modelDetailDs$curren2, _modelDetailDs$curren3, _baseInfoDS$current6, _modelDetailDs$curren4, _baseInfoDS$current7, _modelDetailDs$curren5, _modelDetailDs$curren6, _detailRef$current, _detailRef$current$li, _detailRef$current$li2;
      // 分页查询, 如果有值列表数据, 必须有值
      if (activeKey === 'PAGE' && !!(optionsListDs !== null && optionsListDs !== void 0 && optionsListDs.length) && !(modelDetailDs !== null && modelDetailDs !== void 0 && (_modelDetailDs$curren2 = modelDetailDs.current) !== null && _modelDetailDs$curren2 !== void 0 && _modelDetailDs$curren2.get(DetailDataSetFN.API_ID))) {
        notification.error({
          message: intl.get('hmde.common.saveError').d('保存失败'),
          description: intl.get('hmde.bo.businessObject.errorMsg1').d('存在值列表，分页查询API不能取消关联API模型，请删除所有值列表后重试'),
          placement: 'bottomRight'
        });
        return;
      }
      const inData = inParamsDs === null || inParamsDs === void 0 ? void 0 : inParamsDs.toData();
      const outData = outParamsDs === null || outParamsDs === void 0 ? void 0 : outParamsDs.toData();
      inData.forEach(v => {
        if (v.businessObjectFieldId === 'CUSTOM') {
          Object.assign(v, {
            businessObjectFieldId: ''
          });
        }
      });
      outData.forEach(v => {
        if (v.businessObjectFieldId === 'CUSTOM') {
          Object.assign(v, {
            businessObjectFieldId: ''
          });
        }
      });
      modelDetailDs === null || modelDetailDs === void 0 ? void 0 : (_modelDetailDs$curren3 = modelDetailDs.current) === null || _modelDetailDs$curren3 === void 0 ? void 0 : _modelDetailDs$curren3.set('tenantId', baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current6 = baseInfoDS.current) === null || _baseInfoDS$current6 === void 0 ? void 0 : _baseInfoDS$current6.get('tenantId'));
      modelDetailDs === null || modelDetailDs === void 0 ? void 0 : (_modelDetailDs$curren4 = modelDetailDs.current) === null || _modelDetailDs$curren4 === void 0 ? void 0 : _modelDetailDs$curren4.set('businessObjectId', baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current7 = baseInfoDS.current) === null || _baseInfoDS$current7 === void 0 ? void 0 : _baseInfoDS$current7.get('businessObjectId'));
      modelDetailDs === null || modelDetailDs === void 0 ? void 0 : (_modelDetailDs$curren5 = modelDetailDs.current) === null || _modelDetailDs$curren5 === void 0 ? void 0 : _modelDetailDs$curren5.set('inputApiParamList', toTree(inData));
      modelDetailDs === null || modelDetailDs === void 0 ? void 0 : (_modelDetailDs$curren6 = modelDetailDs.current) === null || _modelDetailDs$curren6 === void 0 ? void 0 : _modelDetailDs$curren6.set('outputApiParamList', toTree(outData));
      await modelDetailDs.submit();
      detailRef === null || detailRef === void 0 ? void 0 : (_detailRef$current = detailRef.current) === null || _detailRef$current === void 0 ? void 0 : (_detailRef$current$li = _detailRef$current.listDs) === null || _detailRef$current$li === void 0 ? void 0 : (_detailRef$current$li2 = _detailRef$current$li.query) === null || _detailRef$current$li2 === void 0 ? void 0 : _detailRef$current$li2.call(_detailRef$current$li);
      baseInfoDS.query();
      handleInit();
      return true;
    }
  };
  const _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    showFieldDetail = _useState6[0],
    setShowFieldDetail = _useState6[1];
  const _useState7 = useState({}),
    _useState8 = _slicedToArray(_useState7, 2),
    addAndEditFieldProps = _useState8[0],
    setAddAndEditFieldProps = _useState8[1];
  const handleShowDetail = (businessObjectFieldId, record) => {
    var _baseInfoDS$current8, _objectFieldListDs$fi, _baseInfoDS$current9, _baseInfoDS$current10, _modelDetailDs$curren7;
    setShowFieldDetail(true);
    setAddAndEditFieldProps({
      boSourceType: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current8 = baseInfoDS.current) === null || _baseInfoDS$current8 === void 0 ? void 0 : _baseInfoDS$current8.get('sourceType'),
      fieldType: !businessObjectFieldId ? '' : objectFieldListDs === null || objectFieldListDs === void 0 ? void 0 : (_objectFieldListDs$fi = objectFieldListDs.find(v => (v === null || v === void 0 ? void 0 : v.get('businessObjectFieldId')) === businessObjectFieldId)) === null || _objectFieldListDs$fi === void 0 ? void 0 : _objectFieldListDs$fi.get('sourceType'),
      businessObjectId: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current9 = baseInfoDS.current) === null || _baseInfoDS$current9 === void 0 ? void 0 : _baseInfoDS$current9.get('businessObjectId'),
      businessObjectCode: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current10 = baseInfoDS.current) === null || _baseInfoDS$current10 === void 0 ? void 0 : _baseInfoDS$current10.get('businessObjectCode'),
      middleBusinessObjFlag: false,
      domainEnabledFlag: false,
      extendFieldCreatedFlag: false,
      businessObjectFieldId,
      handleCloseDetail,
      isApiModelType: true,
      isApiCustomType: !businessObjectFieldId,
      apiModelRecord: record,
      physicalModelType: 'API',
      apiType: modelDetailDs === null || modelDetailDs === void 0 ? void 0 : (_modelDetailDs$curren7 = modelDetailDs.current) === null || _modelDetailDs$curren7 === void 0 ? void 0 : _modelDetailDs$curren7.get('apiType')
    });
  };
  const handleCloseDetail = () => {
    setShowFieldDetail(false);
    initGetFieldList();
  };

  // 把保存方法设置到 boStore  上
  if (boDetailTabActiveKey === TAB_KEYS.commmonApi) {
    boStore === null || boStore === void 0 ? void 0 : boStore.setState('beforePublicOperate', {
      isSaveChanged,
      handleSave,
      handleUpdate: handleInit
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: styles['right-table']
  }, showFieldDetail ? /*#__PURE__*/React.createElement(AddAndEditField, addAndEditFieldProps) : /*#__PURE__*/React.createElement(_Spin, {
    dataSet: modelDetailDs
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['right-top-button']
  }, /*#__PURE__*/React.createElement(BOPermissionButton, {
    disabled: isApiTenantType || !isSaveChanged,
    color: 'primary',
    onClick: handleSave
  }, intl.get('hmde.common.button.save').d('保存'))), /*#__PURE__*/React.createElement(_Form, {
    disabled: !hasPermission,
    dataSet: modelDetailDs,
    labelAlign: "left",
    labelWidth: 120,
    columns: 2
  }, /*#__PURE__*/React.createElement(_Output, {
    name: DetailDataSetFN.API_TYPE
  }), /*#__PURE__*/React.createElement(LovToBoDetail, {
    record: modelDetailDs === null || modelDetailDs === void 0 ? void 0 : modelDetailDs.current,
    name: DetailDataSetFN.API_OBJ,
    disabled: isApiTenantType,
    tips: intl.get('hmde.bo.businessObject.openApiDetail').d('打开API模型详情'),
    jumpPath: `/hmde/api-model/detail/${modelDetailDs === null || modelDetailDs === void 0 ? void 0 : (_modelDetailDs$curren8 = modelDetailDs.current) === null || _modelDetailDs$curren8 === void 0 ? void 0 : _modelDetailDs$curren8.get(DetailDataSetFN.API_ID)}`,
    jumpKey: "/hmde/api-model",
    hiddenTips: true
  }), (modelDetailDs === null || modelDetailDs === void 0 ? void 0 : (_modelDetailDs$curren9 = modelDetailDs.current) === null || _modelDetailDs$curren9 === void 0 ? void 0 : _modelDetailDs$curren9.get(DetailDataSetFN.API_OBJ)) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Output, {
    name: DetailDataSetFN.API_SERVICE_CODE
  }), /*#__PURE__*/React.createElement(_Output, {
    name: DetailDataSetFN.INTERFACE_NAME
  }), /*#__PURE__*/React.createElement(_Output, {
    name: DetailDataSetFN.INTERFACE_CODE
  }), /*#__PURE__*/React.createElement(_Output, {
    name: DetailDataSetFN.REQUEST_METHOD
  }), /*#__PURE__*/React.createElement(_Output, {
    name: DetailDataSetFN.REMARK
  }))), /*#__PURE__*/React.createElement(_Collapse, {
    defaultActiveKey: ['1'],
    bordered: false,
    style: {
      marginTop: '16px'
    }
  }, /*#__PURE__*/React.createElement(_Collapse.Panel, {
    header: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16,
        minHeight: 24,
        color: '#1e1e1e',
        fontWeight: 600
      }
    }, intl.get('hmde.bo.apiModel.inMessage').d('入参信息')),
    key: "1",
    className: styles['collapse-style-padding']
  }, /*#__PURE__*/React.createElement(ParamsTable, {
    ds: inParamsDs,
    otherDs: outParamsDs,
    type: "INPUT",
    addList: inParamsList,
    otherList: outParamsList,
    handleShowDetail: handleShowDetail,
    activeKey: activeKey,
    objectFieldListDs: objectFieldListDs,
    isApiTenantType: isApiTenantType,
    readonly: !hasPermission
  }))), !['BATCH_DELETE', 'COUNT'].includes(activeKey) && /*#__PURE__*/React.createElement(_Collapse, {
    defaultActiveKey: ['1'],
    bordered: false,
    style: {
      marginTop: '16px'
    }
  }, /*#__PURE__*/React.createElement(_Collapse.Panel, {
    header: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16,
        minHeight: 24,
        color: '#1e1e1e',
        fontWeight: 600
      }
    }, intl.get('hmde.bo.apiModel.outMessage').d('出参信息')),
    key: "1",
    className: styles['collapse-style-padding']
  }, /*#__PURE__*/React.createElement(ParamsTable, {
    ds: outParamsDs,
    otherDs: inParamsDs,
    type: "OUTPUT",
    addList: outParamsList,
    otherList: inParamsList,
    handleShowDetail: handleShowDetail,
    activeKey: activeKey,
    objectFieldListDs: objectFieldListDs,
    isApiTenantType: isApiTenantType,
    readonly: !hasPermission
  })))));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(App));