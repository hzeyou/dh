import _extends from "@babel/runtime/helpers/esm/extends";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Breadcrumb from "@hzero-front-ui/c7n-ui/lib/Breadcrumb";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import qs from 'qs';
import intl from 'utils/intl';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { Header, Content } from 'components/Page';
import { SourceType, FieldType } from "hzero-front-apaas/lib/constants/businessObject";
import { tableDs } from "hzero-front-hmde/lib/stores/BusinessObject/FieldListDS";
import { isTenantRoleLevel, setSession } from 'utils/utils';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import FeiDaList from "hzero-front-hmde/lib/businessComponents/FeiDaList";
import { FieldsIconKeyValue } from "hzero-front-hmde/lib/businessComponents/IconPicker/enums";
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
// import { FieldSourceType } from '../constants/constants';
import AddAndEditField from "../AddAndEditField";
import styles from "./index.less?modules";
const isTenant = isTenantRoleLevel();

// enum FieldType {
//   STANDARD = 'STANDARD', // 标准
//   EXTEND = 'EXTEND', // 扩展
// }

function Index(props) {
  var _props$location$searc;
  const history = props.history;
  let _search = (_props$location$searc = props.location.search.split('?')) === null || _props$location$searc === void 0 ? void 0 : _props$location$searc[1];
  _search = qs.parse(_search);
  const _ref = _search || {},
    published = _ref.published,
    businessObjectId = _ref.businessObjectId,
    businessObjectCode = _ref.businessObjectCode,
    boSourceType = _ref.boSourceType,
    businessObjectName = _ref.businessObjectName,
    customPrimaryKeyCode = _ref.customPrimaryKeyCode,
    inheritFieldId = _ref.inheritFieldId,
    fieldType = _ref.fieldType,
    businessObjectFieldId = _ref.businessObjectFieldId,
    middleBusinessObjFlag = _ref.middleBusinessObjFlag,
    tenantCustomObject = _ref.tenantCustomObject,
    domainEnabledFlag = _ref.domainEnabledFlag,
    predefineDisabled = _ref.predefineDisabled,
    readOnlyFlag = _ref.readOnlyFlag,
    showVersion = _ref.showVersion,
    deleteFlag = _ref.deleteFlag,
    type = _ref.type,
    physicalModelType = _ref.physicalModelType,
    businessObjectCategory = _ref.businessObjectCategory,
    _ref$queryParams = _ref.queryParams,
    queryParams = _ref$queryParams === void 0 ? '{}' : _ref$queryParams,
    useType = _ref.useType,
    outComponentType = _ref.outComponentType;
  const boStore = useBoStore();
  const _queryParams = JSON.parse(queryParams);
  const _useState = useState(),
    _useState2 = _slicedToArray(_useState, 2),
    activeKey = _useState2[0],
    setActiveKey = _useState2[1];
  const _useState3 = useState(outComponentType),
    _useState4 = _slicedToArray(_useState3, 2),
    componentType = _useState4[0],
    setComponentType = _useState4[1];
  const _useState5 = useState(new _DataSet()),
    _useState6 = _slicedToArray(_useState5, 2),
    fieldListDs = _useState6[0],
    setFieldListDs = _useState6[1];
  const _useState7 = useState(fieldType),
    _useState8 = _slicedToArray(_useState7, 2),
    fieldSource = _useState8[0],
    setFieldSource = _useState8[1];
  const _useState9 = useState(false),
    _useState10 = _slicedToArray(_useState9, 2),
    fieldFlag = _useState10[0],
    setFieldFlag = _useState10[1];
  const listRef = useRef();

  // const [sourceType, setSourceType] = useState<string>(initSourceType);

  const deleteButtonShowFlag = () => {
    if (activeKey) {
      const _record = fieldListDs.find(record => {
        const id = record.get('inheritFieldId') || record.get('businessObjectFieldId') || record.get('extendFieldId');
        return id === activeKey;
      });
      const exitTemplateField = _record === null || _record === void 0 ? void 0 : _record.get('exitTemplateField');
      // templateCode模板字段编码、exitTemplateField模板编码是否害存在
      const templatefieldFlag = (_record === null || _record === void 0 ? void 0 : _record.get('templateCode')) && !exitTemplateField || !(_record !== null && _record !== void 0 && _record.get('templateCode'));
      const flag = boSourceType !== SourceType.PREDEFINE && !isTenant && templatefieldFlag;

      // 租户下
      const flag2 = isTenant && ![FieldType.STANDARD, FieldType.PREDEFINED].includes((_record === null || _record === void 0 ? void 0 : _record.get('sourceType')) || fieldType);
      return flag || flag2;
    } else {
      return deleteFlag && JSON.parse(deleteFlag);
    }
  };
  const editFieldProps = {
    useType,
    businessObjectId,
    history,
    published,
    // sourceType,
    businessObjectCode,
    boSourceType,
    fieldType: fieldSource,
    // fieldType,
    businessObjectName,
    customPrimaryKeyCode,
    middleBusinessObjFlag: String(middleBusinessObjFlag) === 'true',
    tenantCustomObject: tenantCustomObject && JSON.parse(tenantCustomObject),
    domainEnabledFlag: domainEnabledFlag && JSON.parse(domainEnabledFlag),
    predefineDisabled: predefineDisabled && JSON.parse(predefineDisabled),
    readOnlyFlag: readOnlyFlag && JSON.parse(readOnlyFlag),
    // 可编辑或只读
    showVersion,
    deleteFlag: deleteButtonShowFlag(),
    type,
    // 标准字段还是扩展字段
    physicalModelType,
    businessObjectCategory,
    outComponentType: componentType
  };
  const getType = () => {
    if (isTenant && boSourceType !== 'TENANT') {
      return null;
    } else {
      return FieldType.STANDARD;
    }
  };
  const tableDS = useMemo(() => {
    return new _DataSet({
      ...tableDs({
        type: getType(),
        pagingFlag: false,
        showVersion,
        physicalModelType
      }),
      autoCreate: true
      // pageSize: 20,
    });
  }, [businessObjectId]);
  const extendTableDS = useMemo(() => {
    return new _DataSet({
      ...tableDs({
        type: FieldType.EXTEND,
        pagingFlag: false,
        showVersion
      })
      // pageSize: 20,
    });
  }, [businessObjectId]);
  const getTitle = () => {
    return /*#__PURE__*/React.createElement(_Breadcrumb, {
      style: {
        marginLeft: '10px'
      }
    }, /*#__PURE__*/React.createElement(_Breadcrumb.Item, {
      onClick: () => {
        setSession(boStore === null || boStore === void 0 ? void 0 : boStore.getState('objVersionKey'), showVersion);
        history.push({
          pathname: `/hmde/business-object/detail/${businessObjectId}`,
          state: {
            originKey: 'fieldList',
            fieldActiveKey: isTenant && boSourceType !== 'TENANT' ? null : 'STANDARD'
          }
        });
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        cursor: 'pointer'
      }
    }, businessObjectName, "-", intl.get('hmde.common.fieldList').d('字段列表'))), /*#__PURE__*/React.createElement(_Breadcrumb.Item, null, /*#__PURE__*/React.createElement("span", null, " ", intl.get('hmde.common.fieldEdit').d('字段编辑'))));
  };
  useEffect(() => {
    if (fieldType === FieldType.EXTEND_TABLE || fieldType === FieldType.FLEX_FIELD) {
      extendTableDS.setQueryParameter('businessObjectId', businessObjectId);
      // extendTableDS.query();
      setFieldListDs(extendTableDS);
    } else {
      tableDS.setQueryParameter('businessObjectId', businessObjectId);
      // tableDS.query();
      setFieldListDs(tableDS);
    }
  }, [businessObjectId, fieldType]);
  const updataFieldList = () => {
    tableDS.setQueryParameter('businessObjectId', businessObjectId);
    tableDS.query();
    setFieldListDs(tableDS);
  };
  const onceFlag = useRef(true);
  useEffect(() => {
    setActiveKey(businessObjectFieldId || inheritFieldId);
    if (inheritFieldId) {
      setFieldFlag(true);
    }
    if (onceFlag.current) {
      // 从外面跳转进来的时候，这里有可能会赋值又问题，专门针对这种情况修复
      if (inheritFieldId) {
        setActiveKey(inheritFieldId);
      }
      onceFlag.current = false;
    }
  }, [businessObjectFieldId, inheritFieldId]);
  useEffect(() => {
    /** 根据表类型，初始化查询dataset，并进行dataset查询 */
    const chooseDataset = [FieldType.EXTEND_TABLE, FieldType.FLEX_FIELD].includes(fieldType) ? extendTableDS : tableDS;
    chooseDataset.ready().then(() => {
      var _chooseDataset$queryD, _Object$keys;
      (_chooseDataset$queryD = chooseDataset.queryDataSet) === null || _chooseDataset$queryD === void 0 ? void 0 : _chooseDataset$queryD.create({});
      (_Object$keys = Object.keys(_queryParams)) === null || _Object$keys === void 0 ? void 0 : _Object$keys.forEach(key => {
        if (['__dirty', 'searchText'].includes(key)) {
          return;
        }
        if (_queryParams[key] === false || _queryParams[key]) {
          var _chooseDataset$queryD2, _chooseDataset$queryD3;
          (_chooseDataset$queryD2 = chooseDataset.queryDataSet) === null || _chooseDataset$queryD2 === void 0 ? void 0 : (_chooseDataset$queryD3 = _chooseDataset$queryD2.current) === null || _chooseDataset$queryD3 === void 0 ? void 0 : _chooseDataset$queryD3.set({
            [key]: _queryParams[key]
          });
        }
      });
      chooseDataset.query();
    });
  }, []);

  /** 根据表类型渲染查询表单 */
  const renderSearchForm = () => {
    if (fieldType === FieldType.EXTEND_TABLE || fieldType === FieldType.FLEX_FIELD) {
      return /*#__PURE__*/React.createElement(_Form, {
        dataSet: extendTableDS.queryDataSet
      }, /*#__PURE__*/React.createElement(_TextField, {
        name: "extendFieldCode",
        placeholder: intl.get('hmde.bo.businessObject.enterthefieldcode').d('请输入字段编码'),
        clearButton: true
      }), /*#__PURE__*/React.createElement(_Select, {
        name: "componentTypes",
        placeholder: intl.get('hmde.bo.businessObject.enterthefieldtype').d('请选择字段类型'),
        clearButton: true
      }), /*#__PURE__*/React.createElement(_TextField, {
        name: "remark",
        placeholder: intl.get('hmde.common.remark.placeholder').d('请输入描述'),
        clearButton: true
      }));
    } else {
      return /*#__PURE__*/React.createElement(_Form, {
        dataSet: tableDS.queryDataSet
      }, /*#__PURE__*/React.createElement(_TextField, {
        name: "businessObjectFieldName",
        placeholder: intl.get('hmde.bo.businessObject.enterthefieldname').d('请输入字段名称'),
        clearButton: true
      }), /*#__PURE__*/React.createElement(_TextField, {
        name: "businessObjectFieldCode",
        placeholder: intl.get('hmde.bo.businessObject.enterthefieldcode').d('请输入字段编码'),
        clearButton: true
      }), /*#__PURE__*/React.createElement(_Select, {
        name: "componentTypes",
        placeholder: intl.get('hmde.bo.businessObject.enterthefieldtype').d('请选择字段类型'),
        clearButton: true
      }), /*#__PURE__*/React.createElement(_Select, {
        name: "requiredFlag",
        placeholder: intl.get('hmde.bo.businessObject.enterthefieldisrequire').d('请选择是否必输'),
        clearButton: true
      }), /*#__PURE__*/React.createElement(_Select, {
        name: "sourceTypes",
        placeholder: intl.get('hmde.bo.businessObject.enterthefieldsourceTypes').d('请选择字段来源'),
        clearButton: true
      }), /*#__PURE__*/React.createElement(_TextField, {
        name: "remark",
        placeholder: intl.get('hmde.common.remark.placeholder').d('请输入描述'),
        clearButton: true
      }));
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Header, {
    title: getTitle()
  }), /*#__PURE__*/React.createElement(Content, null, activeKey ? /*#__PURE__*/React.createElement("div", {
    className: styles['wrapper-contain']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['left-list-contain'],
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.quickIndex').d('字段快速索引'))), fieldType !== FieldType.EXTEND_TABLE && fieldType !== FieldType.FLEX_FIELD ? /*#__PURE__*/React.createElement(FeiDaList, {
    autoLoadMore: true,
    dataSet: fieldListDs,
    autoLocateFirst: false,
    initSelectedId: activeKey,
    className: styles['left-sider-list'],
    idField: inheritFieldId && fieldFlag ? 'inheritFieldId' : 'businessObjectFieldId',
    title: "businessObjectFieldName",
    placeholder: intl.get('hmde.bo.businessObject.fieldquery').d('字段名称、编码'),
    searchForm: renderSearchForm,
    initKeyword: _queryParams.searchText,
    titleRender: (value, record) => {
      return (
        /*#__PURE__*/
        // <Tooltip placement="right" title={value}>
        React.createElement("span", null, /*#__PURE__*/React.createElement(ImgIcon, {
          name: FieldsIconKeyValue[record.componentType],
          size: 14,
          style: {
            marginRight: '5px'
          }
        }), value)
        // </Tooltip>
      );
    },
    onClickItem: data => {
      var _listRef$current, _listRef$current$chil, _listRef$current$chil2, _listRef$current$chil3, _listRef$current2, _listRef$current2$chi, _listRef$current2$chi2, _listRef$current2$chi3, _listRef$current3, _listRef$current3$chi, _listRef$current3$chi2, _listRef$current3$chi3, _listRef$current4, _listRef$current4$chi, _listRef$current4$chi2, _listRef$current4$chi3;
      if (activeKey === data.businessObjectFieldId) return;
      const handleOnClickItem = () => {
        setFieldSource(data.sourceType);
        // componentType
        setComponentType(data.componentType);
        if (data.inheritFieldId) {
          if (activeKey === data.inheritFieldId) return;
          setActiveKey(data.inheritFieldId);
          setFieldFlag(true);
          // if (data.inheritSourceType === FieldType.STANDARD) {
          //   setFieldSource(FieldType.STANDARD);
          // } else {
          //   setFieldSource(FieldType.EXTEND);
          // }
        } else {
          if (activeKey === data.businessObjectFieldId) return;
          setActiveKey(data.businessObjectFieldId);
          setFieldFlag(false);
        }
      };
      if (listRef !== null && listRef !== void 0 && (_listRef$current = listRef.current) !== null && _listRef$current !== void 0 && (_listRef$current$chil = _listRef$current.childrenComRef) !== null && _listRef$current$chil !== void 0 && (_listRef$current$chil2 = _listRef$current$chil.current) !== null && _listRef$current$chil2 !== void 0 && (_listRef$current$chil3 = _listRef$current$chil2.CommonFieldDs) !== null && _listRef$current$chil3 !== void 0 && _listRef$current$chil3.getState('_dirty') || listRef !== null && listRef !== void 0 && (_listRef$current2 = listRef.current) !== null && _listRef$current2 !== void 0 && (_listRef$current2$chi = _listRef$current2.childrenComRef) !== null && _listRef$current2$chi !== void 0 && (_listRef$current2$chi2 = _listRef$current2$chi.current) !== null && _listRef$current2$chi2 !== void 0 && (_listRef$current2$chi3 = _listRef$current2$chi2.selectDs) !== null && _listRef$current2$chi3 !== void 0 && _listRef$current2$chi3.dirty || listRef !== null && listRef !== void 0 && (_listRef$current3 = listRef.current) !== null && _listRef$current3 !== void 0 && (_listRef$current3$chi = _listRef$current3.childrenComRef) !== null && _listRef$current3$chi !== void 0 && (_listRef$current3$chi2 = _listRef$current3$chi.current) !== null && _listRef$current3$chi2 !== void 0 && (_listRef$current3$chi3 = _listRef$current3$chi2.CodingRulesDs) !== null && _listRef$current3$chi3 !== void 0 && _listRef$current3$chi3.dirty || listRef !== null && listRef !== void 0 && (_listRef$current4 = listRef.current) !== null && _listRef$current4 !== void 0 && (_listRef$current4$chi = _listRef$current4.childrenComRef) !== null && _listRef$current4$chi !== void 0 && (_listRef$current4$chi2 = _listRef$current4$chi.current) !== null && _listRef$current4$chi2 !== void 0 && (_listRef$current4$chi3 = _listRef$current4$chi2.formulaDs) !== null && _listRef$current4$chi3 !== void 0 && _listRef$current4$chi3.dirty) {
        return _Modal.warning({
          key: _Modal.key(),
          title: intl.get('hmde.common.tips').d('提示'),
          children: /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.fieldChangeprompt').d('当前字段的更新内容未保存，切换会清空，请确认是否切换？')),
          okText: intl.get('hmde.common.button.sure').d('确定'),
          cancelText: intl.get('hmde.common.button.close').d('关闭'),
          onOk: () => {
            handleOnClickItem();
          },
          onCancel: () => {},
          footer: (okBtn, cancelBtn) => /*#__PURE__*/React.createElement(React.Fragment, null, cancelBtn, okBtn)
        });
      }
      handleOnClickItem();
    }
  }) : /*#__PURE__*/React.createElement(FeiDaList, {
    autoLoadMore: true,
    dataSet: fieldListDs,
    autoLocateFirst: false,
    initSelectedId: activeKey,
    className: styles['left-sider-list'],
    initKeyword: _queryParams.searchText,
    idField: inheritFieldId || fieldFlag ? 'inheritFieldId' : 'extendFieldId',
    title: inheritFieldId || fieldFlag ? 'businessObjectFieldName' : 'extendFieldCode',
    placeholder: intl.get('hmde.bo.businessObject.fieldquery').d('字段名称、编码'),
    searchForm: renderSearchForm,
    titleRender: (value, record) => {
      return (
        /*#__PURE__*/
        // <Tooltip placement="right" title={value}>
        React.createElement("span", null, /*#__PURE__*/React.createElement(ImgIcon, {
          name: FieldsIconKeyValue[record.componentType],
          size: 14,
          style: {
            marginRight: '5px'
          }
        }), value)
        // </Tooltip>
      );
    },
    onClickItem: data => {
      setFieldSource(data.sourceType || data.extendCategory);
      if (data.inheritFieldId) {
        if (activeKey === data.inheritFieldId) return;
        setActiveKey(data.inheritFieldId);
        setFieldFlag(true);
        // if (data.inheritSourceType === FieldType.STANDARD) {
        //   setFieldSource(FieldType.STANDARD);
        // } else {
        //   setFieldSource(FieldType.EXTEND);
        // }
      } else if (data.businessObjectFieldId) {
        if (activeKey === data.businessObjectFieldId) return;
        setActiveKey(data.businessObjectFieldId);
        setFieldFlag(false);
        // setFieldSource(FieldType.STANDARD);
      } else {
        if (activeKey === (data === null || data === void 0 ? void 0 : data.extendFieldId)) return;
        setActiveKey(data === null || data === void 0 ? void 0 : data.extendFieldId);
        setFieldFlag(false);
      }
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: styles['right-content']
  }, /*#__PURE__*/React.createElement(AddAndEditField, _extends({}, editFieldProps, {
    businessObjectFieldId: fieldFlag ? undefined : activeKey,
    inheritFieldId: fieldFlag ? activeKey : undefined,
    updataFieldList: updataFieldList,
    listRef: listRef
  })))) : null));
}
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Index));