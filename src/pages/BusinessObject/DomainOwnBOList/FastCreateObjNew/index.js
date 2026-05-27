import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Alert from "@hzero-front-ui/c7n-ui/lib/Alert";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _IntlField from "@hzero-front-ui/c7n-ui/lib/IntlFieldPro";
import _Lov from "@hzero-front-ui/c7n-ui/lib/LovPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _noop from "lodash/noop";
import _isEmpty from "lodash/isEmpty";
import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import uuid from 'uuid/v4';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { ViewMode } from 'choerodon-ui/pro/lib/lov/enum';
import formatterCollections from 'utils/intl/formatterCollections';
import request from 'utils/request';
import { lowcodeOrganizationURL } from "hzero-front-apaas/lib/utils/common";
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { getResponse, isTenantRoleLevel } from 'utils/utils';
import notification from 'utils/notification';
import { DragColumnAlign, ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import intl from 'utils/intl';
import { operatorRender } from 'utils/renderer';
import { FN } from "./type";
import styles from "./index.less?modules";
import { formDatasetProps } from "./datasets";
import { onKeyDown } from "./utils";
const isTenant = isTenantRoleLevel();
const Index = ({
  domain,
  modal,
  tableQuery = _noop,
  tenantBusinessObjectPrefixRule = ''
}) => {
  var _formDs$selected;
  const formRef = useRef();
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    spinning = _useState2[0],
    setSpinning = _useState2[1];
  const _ref = domain || {},
    domainCode = _ref.domainCode,
    _ref$extendTableEnabl = _ref.extendTableEnabledFlag,
    extendTableEnabledFlag = _ref$extendTableEnabl === void 0 ? false : _ref$extendTableEnabl,
    serviceCode = _ref.serviceCode,
    domainId = _ref.domainId,
    _ref$extendTableSuffi = _ref.extendTableSuffix,
    extendTableSuffix = _ref$extendTableSuffi === void 0 ? 'ext' : _ref$extendTableSuffi;
  const _extendTableEnabledFlag = extendTableEnabledFlag && !isTenant;
  const colNum = useMemo(() => {
    if (isTenant) {
      return 3;
    } else if (!extendTableEnabledFlag) {
      return 4;
    } else {
      return 5;
    }
  }, [isTenant, extendTableEnabledFlag]);

  /**
   * 去除字符串开头的下划线
   * @param str string
   */
  const deleteUnderline = useCallback(str => {
    if (str !== null && str !== void 0 && str.startsWith('_')) {
      return deleteUnderline(str === null || str === void 0 ? void 0 : str.slice(1));
    } else {
      return str;
    }
  }, []);
  const commonPro = {
    [FN.BUSINESS_OBJECT_NAME]: '',
    [FN.BUSINESS_OBJECT_CODE]: '',
    [FN.IS_RELEVANCE_FLAG]: false,
    objectErrorCodes: '',
    physicalModelNameErrorCodes: '',
    extPhysicalModelNamesErrorCodes: ''
  };
  const formDs = useMemo(() => new _DataSet(formDatasetProps({
    domainCode,
    extendTableEnabledFlag: _extendTableEnabledFlag,
    extendTableSuffix,
    serviceCode
  })), [domainCode]);
  const LovMultipleDs = useMemo(() => new _DataSet({
    autoCreate: true,
    pageSize: 100,
    fields: [{
      name: FN.LOV_MULTIPLE,
      type: "object",
      multiple: true,
      lovCode: isTenant ? 'HMDE.BUSINESS_OBJECT.REF_TABLE' : 'HMDE.BUSINESS_OBJECT.REF_TABLE.SITE',
      dynamicProps: {
        lovPara: () => {
          var _formDs$toData, _formDs$toData$map, _formDs$toData2, _formDs$toData2$map;
          const physicalModelList = formDs === null || formDs === void 0 ? void 0 : (_formDs$toData = formDs.toData()) === null || _formDs$toData === void 0 ? void 0 : (_formDs$toData$map = _formDs$toData.map(item => {
            var _item$physicalModel;
            return item === null || item === void 0 ? void 0 : (_item$physicalModel = item.physicalModel) === null || _item$physicalModel === void 0 ? void 0 : _item$physicalModel.code;
          })) === null || _formDs$toData$map === void 0 ? void 0 : _formDs$toData$map.filter(Boolean);
          const extPhysicalModelList = _extendTableEnabledFlag && (formDs === null || formDs === void 0 ? void 0 : (_formDs$toData2 = formDs.toData()) === null || _formDs$toData2 === void 0 ? void 0 : (_formDs$toData2$map = _formDs$toData2.map(item => {
            var _item$extPhysicalMode;
            return item === null || item === void 0 ? void 0 : (_item$extPhysicalMode = item.extPhysicalModel) === null || _item$extPhysicalMode === void 0 ? void 0 : _item$extPhysicalMode.code;
          })) === null || _formDs$toData2$map === void 0 ? void 0 : _formDs$toData2$map.filter(Boolean));
          return {
            serviceCode,
            excludeTableCodeList: [...physicalModelList, ...(extPhysicalModelList || [])].toString()
          };
        }
      }
    }],
    events: {
      update: ({
        record,
        name
      }) => {
        if (name === FN.LOV_MULTIPLE) {
          // 关联物理模型批量新增
          const _record$toData = record.toData(),
            LovMultiple = _record$toData.LovMultiple;
          const len = domainCode.length;
          const addList = LovMultiple === null || LovMultiple === void 0 ? void 0 : LovMultiple.map(item => {
            var _item$name;
            const flag = (item === null || item === void 0 ? void 0 : item.name.slice(0, len)) === domainCode.toLowerCase(); // 前缀相同
            return {
              ...commonPro,
              id: uuid(),
              [FN.BUSINESS_OBJECT_CODE]: flag ? deleteUnderline(item === null || item === void 0 ? void 0 : (_item$name = item.name) === null || _item$name === void 0 ? void 0 : _item$name.slice(len)) : item === null || item === void 0 ? void 0 : item.name,
              [FN.IS_RELEVANCE_FLAG]: true,
              [FN.PHYSICAL_MODEL_NAME_NEW]: item
            };
          });
          // 过滤掉空数据
          const nullRecords = formDs.filter(_rec => !_rec.get(FN.BUSINESS_OBJECT_NAME) && !_rec.get(FN.BUSINESS_OBJECT_CODE) && !_rec.get(FN.IS_RELEVANCE_FLAG));
          formDs.delete(nullRecords, false);
          formDs.appendData(addList);
          LovMultipleDs.delete(record, false);
        }
      }
    }
  }), []);
  const getAddonBefore = useMemo(() => {
    if (tenantBusinessObjectPrefixRule) {
      return `${domainCode}_${tenantBusinessObjectPrefixRule}_`;
    }
    return `${domainCode}_`;
  }, [domainCode, tenantBusinessObjectPrefixRule]);

  /**
   * 校验对象编码前缀
   */
  const checkObjectCodePrefix = () => {
    const codeErrorFlag = isTenant && getAddonBefore && (getAddonBefore.length > 55 || !/^[A-Z0-9_]*$/.test(getAddonBefore));
    if (codeErrorFlag) {
      notification.error({
        message: intl.get('hmde.bo.businessObject.codeTypeErrorTitle').d('编码前缀格式错误'),
        description: intl.get('hmde.bo.businessObject.boCodeTypeErrorDetail').d('业务对象编码前缀格式错误，请至HZERO租户-领域控制处修改业务对象编码前缀')
      });
      return false;
    }
    return true;
  };
  useEffect(() => {
    checkObjectCodePrefix();
  }, [getAddonBefore]);
  useEffect(() => {
    // 初始化两条数据
    const initData = [{
      ...commonPro,
      id: uuid()
    }, {
      ...commonPro,
      id: uuid()
    }];
    formDs.loadData(initData);
    // 提交数据
    modal === null || modal === void 0 ? void 0 : modal.handleOk(async () => {
      if (!checkObjectCodePrefix()) return;
      if (!(await (formDs === null || formDs === void 0 ? void 0 : formDs.validate()))) {
        return false;
      }
      const ignoreProps = {
        enabledFlag: true,
        sharedFlag: false,
        refExtFieldFlag: true,
        businessObjectCategory: 'STANDARD',
        publishStatus: 'UNPUBLISHED',
        linkCreateType: 'FIELD',
        extPhysicalModel: undefined,
        physicalModel: undefined,
        isRelevanceFlag: undefined,
        objectErrorCodes: undefined,
        physicalModelNameErrorCodes: undefined,
        extPhysicalModelNamesErrorCodes: undefined
      };
      const data = formDs.toData().map(item => {
        if (item[FN.IS_RELEVANCE_FLAG]) {
          var _item$physicalModelNa, _item$physicalModelNa2, _item$extendsTableNam;
          item.physicalModelId = item === null || item === void 0 ? void 0 : (_item$physicalModelNa = item.physicalModelName) === null || _item$physicalModelNa === void 0 ? void 0 : _item$physicalModelNa.id;
          item.physicalModelName = item === null || item === void 0 ? void 0 : (_item$physicalModelNa2 = item.physicalModelName) === null || _item$physicalModelNa2 === void 0 ? void 0 : _item$physicalModelNa2.name;
          item.extendsTableName && (item.extendsTableName = item === null || item === void 0 ? void 0 : (_item$extendsTableNam = item.extendsTableName) === null || _item$extendsTableNam === void 0 ? void 0 : _item$extendsTableNam.name);
        }
        return {
          ...item,
          ...ignoreProps,
          autoCreateFlag: !item[FN.IS_RELEVANCE_FLAG],
          sourceType: isTenant ? 'TENANT' : 'PLATFORM',
          [FN.BUSINESS_OBJECT_CODE]: `${getAddonBefore}${item[FN.BUSINESS_OBJECT_CODE]}`,
          physicalModelType: 'TABLE'
        };
      });
      setSpinning(true);
      modal.update({
        okProps: {
          loading: true
        },
        cancelProps: {
          loading: true
        }
      });
      request(`${lowcodeOrganizationURL({
        route: HZERO_HMDE
      })}/business-objects/batch-create`, {
        method: 'POST',
        data,
        params: {
          domainId
        }
      }).then(res => {
        const _res$existBusinessObj = res.existBusinessObjectCodes,
          existBusinessObjectCodes = _res$existBusinessObj === void 0 ? [] : _res$existBusinessObj,
          _res$existExtPhysical = res.existExtPhysicalModelNames,
          existExtPhysicalModelNames = _res$existExtPhysical === void 0 ? [] : _res$existExtPhysical,
          _res$existPhysicalMod = res.existPhysicalModelNames,
          existPhysicalModelNames = _res$existPhysicalMod === void 0 ? [] : _res$existPhysicalMod;
        // 编码重复的情况,在表格中标红
        if (!_isEmpty(existBusinessObjectCodes) || !_isEmpty(existExtPhysicalModelNames) || !_isEmpty(existPhysicalModelNames)) {
          formDs.forEach(record => {
            // 业务对象编码
            record.set({
              objectErrorCodes: existBusinessObjectCodes.find(item => item === `${getAddonBefore}${record.get(FN.BUSINESS_OBJECT_CODE)}`)
            });
            // 物理模型名称
            !record.get(FN.IS_RELEVANCE_FLAG) && record.set({
              physicalModelNameErrorCodes: existPhysicalModelNames.find(item => item === record.get(FN.PHYSICAL_MODEL_NAME_NEW))
            });
            // 扩展表名称
            _extendTableEnabledFlag && record.set({
              extPhysicalModelNamesErrorCodes: existExtPhysicalModelNames.find(item => item === record.get(FN.EXTEND_STABLE_NAME_NEW))
            });
          });
          formDs === null || formDs === void 0 ? void 0 : formDs.validate();
        } else {
          getResponse(res);
          if (_isEmpty(res)) {
            notification.success({
              message: intl.get('hmde.common.createSuccess1').d('新建成功'),
              placement: 'bottomRight'
            });
            modal.close();
            tableQuery();
          }
        }
      }).catch(e => {
        console.error(e);
      }).finally(() => {
        setSpinning(false);
        modal.update({
          okProps: {
            loading: false
          },
          cancelProps: {
            loading: false
          }
        });
      });
      return false;
    });
  }, []);
  const handleAddRow = () => {
    formDs.create({
      ...commonPro,
      id: uuid()
    });
  };
  const handleKeyDown = (e, record, name) => {
    onKeyDown(e, {
      colNum,
      formRef,
      handleAdd: handleAddRow,
      record,
      tableDs: formDs,
      columns,
      name
    });
  };
  const handleBatchDel = () => {
    formDs.delete(formDs.selected, false);
  };
  const buttons = [/*#__PURE__*/React.createElement(_Button, {
    key: "delete",
    icon: "delete_black-o",
    color: "primary",
    onClick: handleBatchDel,
    disabled: !(formDs !== null && formDs !== void 0 && (_formDs$selected = formDs.selected) !== null && _formDs$selected !== void 0 && _formDs$selected.length)
  }, intl.get('hmde.common.button.batchDelete').d('批量删除')), !isTenant && /*#__PURE__*/React.createElement(_Lov, {
    dataSet: LovMultipleDs,
    name: FN.LOV_MULTIPLE,
    noCache: true,
    mode: "button",
    color: "primary",
    funcType: "flat",
    clearButton: false,
    icon: "content_copy",
    key: "content_copy",
    modalProps: {
      title: /*#__PURE__*/React.createElement("h3", null, intl.get('hmde.bo.businessObject.batchphysicalModel').d('批量关联物理模型')),
      header: (title, closebtn) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between'
        }
      }, title, " ", closebtn), /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.businessObject.batchHtlp').d('批量选择物理模型，将在业务对象列表中新增对应数量的关联物理模型的业务对象')))
    }
  }, intl.get('hmde.bo.businessObject.batchphysicalModel').d('批量关联物理模型')), /*#__PURE__*/React.createElement(_Button, {
    icon: "add",
    onClick: () => handleAddRow(),
    funcType: "flat",
    color: "primary",
    key: "add"
  }, intl.get('hmde.common.button.create').d('新建'))];
  const columns = useMemo(() => {
    return [{
      name: FN.BUSINESS_OBJECT_NAME,
      className: 'checkItemPar',
      align: "left",
      editor: record => {
        return /*#__PURE__*/React.createElement(_IntlField, {
          name: FN.BUSINESS_OBJECT_NAME,
          record: record,
          className: "checkItem",
          "data-cNumber": record.index,
          onKeyDown: e => handleKeyDown(e, record, FN.BUSINESS_OBJECT_NAME)
        });
      }
    }, {
      name: FN.BUSINESS_OBJECT_CODE,
      className: 'checkItemPar',
      align: "left",
      editor: record => {
        return /*#__PURE__*/React.createElement(_TextField, {
          name: FN.BUSINESS_OBJECT_CODE,
          record: record,
          className: "checkItem",
          "data-cNumber": record.index,
          addonBefore: getAddonBefore && /*#__PURE__*/React.createElement(_Tooltip, {
            title: getAddonBefore
          }, getAddonBefore),
          maxLength: 56 - getAddonBefore.length,
          showLengthInfo: true,
          onKeyDown: e => handleKeyDown(e, record, FN.BUSINESS_OBJECT_CODE)
        });
      },
      renderer: ({
        record
      }) => record !== null && record !== void 0 && record.get(FN.BUSINESS_OBJECT_CODE) ? `${getAddonBefore}${record === null || record === void 0 ? void 0 : record.get(FN.BUSINESS_OBJECT_CODE)}` : ''
    }, !isTenant && {
      name: FN.IS_RELEVANCE_FLAG,
      className: 'checkItemPar',
      align: "left",
      editor: record => {
        return /*#__PURE__*/React.createElement(_Select, {
          name: FN.IS_RELEVANCE_FLAG,
          record: record,
          className: "checkItem",
          "data-cNumber": record.index
        });
      }
    }, {
      name: FN.PHYSICAL_MODEL_NAME_NEW,
      className: 'checkItemPar',
      align: "left",
      editor: record => {
        return record.get(FN.IS_RELEVANCE_FLAG) ? /*#__PURE__*/React.createElement(_Lov, {
          name: FN.PHYSICAL_MODEL_NAME_NEW,
          record: record,
          onKeyDown: e => handleKeyDown(e, record, FN.PHYSICAL_MODEL_NAME_NEW)
        }) : /*#__PURE__*/React.createElement(_TextField, {
          name: FN.PHYSICAL_MODEL_NAME_NEW,
          record: record,
          showLengthInfo: true,
          onKeyDown: e => handleKeyDown(e, record, FN.PHYSICAL_MODEL_NAME_NEW)
        });
      }
    }, _extendTableEnabledFlag && {
      name: FN.EXTEND_STABLE_NAME_NEW,
      className: 'checkItemPar',
      align: "left",
      editor: record => {
        return record.get(FN.IS_RELEVANCE_FLAG) ? /*#__PURE__*/React.createElement(_Lov, {
          name: FN.EXTEND_STABLE_NAME_NEW,
          record: record,
          onKeyDown: e => handleKeyDown(e, record, FN.EXTEND_STABLE_NAME_NEW)
        }) : /*#__PURE__*/React.createElement(_TextField, {
          name: FN.EXTEND_STABLE_NAME_NEW,
          record: record,
          showLengthInfo: true,
          onKeyDown: e => handleKeyDown(e, record, FN.EXTEND_STABLE_NAME_NEW)
        });
      }
    }, {
      title: intl.get('hmde.common.table.column.operate').d('操作'),
      width: 80,
      renderer: ({
        record
      }) => {
        const operators = [{
          key: 'delete',
          ele: /*#__PURE__*/React.createElement("a", {
            onClick: () => formDs.delete(record, false)
          }, intl.get('hmde.common.button.delete').d('删除')),
          len: 2,
          title: intl.get('hmde.common.button.delete').d('删除')
        }];
        return operatorRender(operators, record);
      }
    }].filter(Boolean);
  }, []);
  return /*#__PURE__*/React.createElement(_Spin, {
    spinning: spinning
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['modal-content-wrapper']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['modal-content-wrapper-tip']
  }, /*#__PURE__*/React.createElement("p", {
    className: styles['modal-content-wrapper-tip-p']
  }, intl.get('hmde.bo.businessObject.physicalModelTipsNew').d('批量维护业务对象名称、编码、物理模型名称等，将在对象列表中批量新增对应的业务对象。'))), /*#__PURE__*/React.createElement(_Alert, {
    className: styles['modal-content-wrapper-alert'],
    style: {
      margin: '4px 4px 12px 0px'
    },
    message: /*#__PURE__*/React.createElement("div", {
      className: styles['modal-content-wrapper-alert-div']
    }, intl.get('hmde.bo.businessObject.support').d('支持'), /*#__PURE__*/React.createElement("span", {
      style: {
        marginRight: 0
      }
    }, "Tab"), /*#__PURE__*/React.createElement("span", null, "Enter"), intl.get('hmde.common.view.message.operatetip1').d('快速换行；定位最后一格时'), "\uFF0C", /*#__PURE__*/React.createElement("span", null, "Tab"), intl.get('hmde.common.view.message.operatetip2').d('新增一行；定位最后一行时'), "\uFF0C", /*#__PURE__*/React.createElement("span", null, "Enter"), intl.get('hmde.common.view.message.addcol').d('新增一行。'), /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.businessObject.support').d('支持'), /*#__PURE__*/React.createElement("span", null, "ctrl+C"), intl.get('hmde.bo.businessObject.ctrlC').d('进行复制数据至 Excel，鼠标选中单元格后进行拖动选择复制范围;'), /*#__PURE__*/React.createElement("span", null, "ctrl+V"), intl.get('hmde.bo.businessObject.ctrlV').d('进行粘贴从Excel复制的数据，选择可编辑单元格后进行粘贴数据。'))),
    type: "info",
    showIcon: true
  }), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", {
    ref: formRef,
    style: {
      marginTop: '8px'
    }
  }, /*#__PURE__*/React.createElement(_Table, {
    virtual: true
    // autoHeight={{ type: TableAutoHeightType.maxHeight, diff: 0 }}
    ,
    style: {
      maxHeight: '350px'
    },
    dataSet: formDs,
    columns: columns,
    buttons: buttons,
    dragColumnAlign: "left",
    rowDraggable: true,
    clipboard: {
      copy: true,
      hiddenTip: true,
      paste: true
    }
  }))));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Index));
export * from "./type";