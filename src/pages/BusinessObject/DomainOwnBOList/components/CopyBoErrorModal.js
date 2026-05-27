import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Alert from "@hzero-front-ui/c7n-ui/lib/Alert";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _upperFirst from "lodash/upperFirst";
import _camelCase from "lodash/camelCase";
import React, { useEffect, useMemo, useState } from 'react';
import intl from 'utils/intl';
import { getResponse } from 'utils/utils';
import request from 'utils/request';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { isTenantRoleLevel } from 'utils/utils';
import { FieldType, FieldIgnore } from 'choerodon-ui/pro/lib/data-set/enum';
// import ImgIcon from '@hmde/utils/ImgIcon';
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import tableRendererStyles from "hzero-front-hmde/lib/tableRenderer.less?modules";
import { FN } from "../../../../stores/BusinessObject/BusinessObjectCopyDS";
var ComFN = /*#__PURE__*/function (ComFN) {
  ComFN["NAME"] = "businessObjectFieldName";
  ComFN["CODE"] = "usedRepeatCode";
  ComFN["NEWCODE"] = "businessObjectFieldCode";
  ComFN["ERRORCODE"] = "errorcode";
  ComFN["BOCODE"] = "businessObjectCode";
  ComFN["BOCODE_R"] = "businessObjectCodeRepeat";
  ComFN["BOCODE_ERROR"] = "businessObjectCodeErroe";
  ComFN["PMN"] = "physicalModelName";
  ComFN["PMN_R"] = "physicalModelNameRepeat";
  ComFN["PMN_ERROR"] = "physicalModelNameRrror";
  ComFN["ETN"] = "extendsTableName";
  ComFN["ETN_R"] = "extendsTableNameRepeat";
  ComFN["ETN_ERROR"] = "extendsTableNameRrror";
  return ComFN;
}(ComFN || {});
const isTenant = isTenantRoleLevel();
function CommonFieldModal(props) {
  var _middleFieldWaringLis, _data$domain, _data$domain2;
  const midModal = props.modal,
    copyWarningList = props.copyWarningList,
    data = props.data,
    fieldsList = props.fieldsList,
    copySuccess = props.copySuccess,
    extendTableSuffix = props.extendTableSuffix,
    extendTableEnabledFlag = props.extendTableEnabledFlag,
    extendFieldPrefixRule = props.extendFieldPrefixRule;
  const _useState = useState(true),
    _useState2 = _slicedToArray(_useState, 2),
    spinFlag = _useState2[0],
    setSpinFlag = _useState2[1];
  const fieldWaringList = copyWarningList.filter(v => v.propertyType === 'FIELD_CODE');
  const middleFieldWaringList = copyWarningList.filter(v => v.propertyType === 'MIDDLE_MODEL');
  const domainCode = middleFieldWaringList === null || middleFieldWaringList === void 0 ? void 0 : (_middleFieldWaringLis = middleFieldWaringList[0]) === null || _middleFieldWaringLis === void 0 ? void 0 : _middleFieldWaringLis.domainCode;

  // 重复字段-字段
  let list = fieldsList.filter(item => fieldWaringList.find(i => i.businessObjectFieldCode === (item === null || item === void 0 ? void 0 : item.businessObjectFieldCode)));
  // 重复字段-中间对象相关
  let list2 = middleFieldWaringList;

  // 给重复的字段添加属性 usedRepeatCode（一开始重复的字段）
  list = list.map(ele => ({
    ...ele,
    usedRepeatCode: ele.businessObjectFieldCode,
    businessObjectFieldCode: ''
  }));
  list2 = list2.map(ele => ({
    ...ele,
    usedRepeatCode: ele.businessObjectFieldCode,
    businessObjectCodeRepeat: ele.businessObjectCode,
    businessObjectCode: '',
    physicalModelNameRepeat: ele.physicalModelName,
    physicalModelName: '',
    extendsTableNameRepeat: ele.extendsTableName,
    extendsTableName: ''
  }));
  const commonFieldDs = useMemo(() => new _DataSet({
    selection: false,
    forceValidate: true,
    paging: false,
    fields: [{
      name: ComFN.NAME,
      label: intl.get('hmde.bo.businessObject.nameRep').d('重复字段'),
      type: "string",
      required: true
    }, {
      name: ComFN.CODE,
      label: intl.get('hmde.bo.businessObject.codeRep').d('重复编码'),
      type: "string",
      required: true
    }, {
      name: ComFN.NEWCODE,
      label: intl.get('hmde.common.fieldCode').d('字段编码'),
      type: "string",
      required: true,
      maxLength: 60,
      validator: (value, name, midrecord) => {
        if (extendFieldPrefixRule && !/^[A-Z][a-zA-Z0-9]*$/.test(value)) {
          return Promise.resolve(intl.get('hmde.bo.businessObject.fieldCode.validation2').d('需以大写字母开头，中间支持大写字母、小写字母、数字组合，推荐使用小驼峰'));
        }
        if (!extendFieldPrefixRule && !/^[a-z][a-zA-Z0-9]*$/.test(value)) {
          return Promise.resolve(intl.get('hmde.bo.businessObject.fieldCode.validation1').d('需以小写字母开头，中间支持大写字母、小写字母、数字组合，推荐使用小驼峰'));
        }
        const _data = commonFieldDs.toData();
        // 判断跟表格里的字段重复
        const flag = _data.find(item => item[ComFN.CODE] === value || (midrecord === null || midrecord === void 0 ? void 0 : midrecord.get(ComFN.NAME)) !== item[ComFN.NAME] && item[ComFN.NEWCODE] === value);
        // 判断跟原先字段列表里字段重复
        const flagOther = fieldsList.find(item => item.businessObjectFieldCode === value);
        if (flag || flagOther || midrecord.get(ComFN.ERRORCODE) === midrecord.get(ComFN.NEWCODE)) {
          return Promise.resolve(intl.get('hmde.bo.businessObject.code.hump').d('已存在该字段编码') + midrecord.get(ComFN.NEWCODE));
        }
      }
    }, {
      name: ComFN.ERRORCODE,
      type: "string",
      ignore: "always"
    }],
    data: list,
    events: {
      update: ({
        record: _record,
        name,
        value
      }) => {
        if (name === ComFN.NEWCODE) {
          var _record$set;
          _record === null || _record === void 0 ? void 0 : (_record$set = _record.set) === null || _record$set === void 0 ? void 0 : _record$set.call(_record, ComFN.NEWCODE, extendFieldPrefixRule ? _upperFirst(_camelCase(value)) : _camelCase(value));
        }
      }
    }
  }), []);
  const commonFieldMulDs = useMemo(() => new _DataSet({
    selection: false,
    forceValidate: true,
    paging: false,
    fields: [{
      name: ComFN.NAME,
      label: intl.get('hmde.bo.businessObject.linkMuField').d('关联关系多选字段名称'),
      type: "string"
    }, {
      name: ComFN.NEWCODE,
      label: intl.get('hmde.common.fieldCode').d('字段编码'),
      type: "string",
      required: true
    }, {
      name: ComFN.BOCODE_R,
      label: intl.get('hmde.common.repeatBoFieldCode').d('重复对象编码')
    }, {
      name: ComFN.BOCODE,
      label: intl.get('hmde.common.newBoFieldCode').d('新对象编码'),
      computedProps: {
        required: ({
          record
        }) => !!(record !== null && record !== void 0 && record.get(ComFN.BOCODE_R))
      },
      unique: true,
      format: 'uppercase',
      validator: (value, name, midrecord) => {
        if (!(midrecord !== null && midrecord !== void 0 && midrecord.get(ComFN.BOCODE_R))) {
          return true;
        }
        const pattern = /^[A-Z0-9_]*$/;
        if (!pattern.test(value)) {
          return intl.get('hmde.bo.businessObject.patternValidation').d('支持大写字母、数字及下划线组合');
        }
        if (midrecord.get(ComFN.BOCODE) === midrecord.get(ComFN.BOCODE_ERROR)) {
          return Promise.resolve(intl.get('hmde.bo.businessObject.bocCode.hump').d('已存在该对象编码') + midrecord.get(ComFN.BOCODE_ERROR));
        }
      }
    }, {
      name: ComFN.PMN_R,
      label: intl.get('hmde.common.repeatPhysicalModelName').d('重复物理模型名称')
    }, {
      name: ComFN.PMN,
      label: intl.get('hmde.common.newPhysicalModelName').d('新物理模型名称'),
      computedProps: {
        required: ({
          record
        }) => !!(record !== null && record !== void 0 && record.get(ComFN.PMN_R))
      },
      format: 'lowercase',
      validator: (value, name, midrecord) => {
        if (!(midrecord !== null && midrecord !== void 0 && midrecord.get(ComFN.PMN_R))) {
          return true;
        }
        const pattern = /^[a-zA-Z][a-zA-Z0-9_]*$/;
        if (!pattern.test(value)) {
          return intl.get('hmde.bo.businessObject.patternValidationLower').d('需以字母开头，支持字母、数字及下划线组合');
        }
        if (midrecord.get(ComFN.PMN) === midrecord.get(ComFN.PMN_ERROR)) {
          return Promise.resolve(intl.get('hmde.bo.businessObject.bocCode.hump1').d('已存在该物理模型名称') + midrecord.get(ComFN.PMN_ERROR));
        }
      }
    }, extendTableEnabledFlag && !isTenant && {
      name: ComFN.ETN_R,
      label: intl.get('hmde.common.repeatExtendsTableName').d('重复扩展物理模型名称')
    }, extendTableEnabledFlag && !isTenant && {
      name: ComFN.ETN,
      label: intl.get('hmde.common.newExtendsTableName').d('新扩展物理模型名称'),
      computedProps: {
        required: ({
          record
        }) => !!(record !== null && record !== void 0 && record.get(ComFN.ETN_R))
      },
      format: 'lowercase',
      validator: (value, name, midrecord) => {
        if (!(midrecord !== null && midrecord !== void 0 && midrecord.get(ComFN.ETN_R))) {
          return true;
        }
        const pattern = /^[a-zA-Z][a-zA-Z0-9_]*$/;
        if (!pattern.test(value)) {
          return intl.get('hmde.bo.businessObject.patternValidationLower').d('需以字母开头，支持字母、数字及下划线组合');
        }
        if (midrecord.get(ComFN.ETN) === midrecord.get(ComFN.ETN_ERROR)) {
          return Promise.resolve(intl.get('hmde.bo.businessObject.bocCode.hump1').d('已存在该物理模型名称') + midrecord.get(ComFN.ETN_ERROR));
        }
      }
    }],
    data: list2,
    events: {
      update: ({
        record: _record,
        name,
        value
      }) => {
        if (name === ComFN.BOCODE) {
          if (_record !== null && _record !== void 0 && _record.get(ComFN.PMN_R) && !(_record !== null && _record !== void 0 && _record.getState('pmnEdit'))) {
            _record === null || _record === void 0 ? void 0 : _record.set(ComFN.PMN, `${domainCode}_${value}`);
          }
          if (_record !== null && _record !== void 0 && _record.get(ComFN.ETN_R) && !(_record !== null && _record !== void 0 && _record.getState('etnEdit')) && extendTableEnabledFlag && !isTenant) {
            _record === null || _record === void 0 ? void 0 : _record.set(ComFN.ETN, `${domainCode}_${value}_${extendTableSuffix || 'ext'}`);
          }
        }
      }
    }
  }), []);
  useEffect(() => {
    commonFieldDs.ready().then(() => {
      setSpinFlag(false);
    });
  }, []);
  const columns = [{
    name: ComFN.NAME
  }, {
    name: ComFN.CODE
  }, {
    name: ComFN.NEWCODE,
    title: intl.get('hmde.bo.businessObject.newCode').d('新编码'),
    // editor: true,
    className: tableRendererStyles.column,
    renderer: ({
      record
    }) => /*#__PURE__*/React.createElement(_TextField, {
      record: record,
      key: ComFN.NEWCODE,
      name: ComFN.NEWCODE,
      addonBefore: extendFieldPrefixRule && `${extendFieldPrefixRule}`,
      maxLength: 60 - (extendFieldPrefixRule === null || extendFieldPrefixRule === void 0 ? void 0 : extendFieldPrefixRule.length) || 0,
      showLengthInfo: true
    })
  }];
  const columns1 = [{
    name: ComFN.NAME,
    width: 170
  }, {
    name: ComFN.NEWCODE,
    width: 150
  }, {
    name: ComFN.BOCODE_R,
    width: 150
  }, {
    name: ComFN.BOCODE,
    width: 250,
    className: tableRendererStyles.column,
    renderer: ({
      record
    }) => {
      return record !== null && record !== void 0 && record.get(ComFN.BOCODE_R) ? /*#__PURE__*/React.createElement(_TextField, {
        record: record,
        key: ComFN.BOCODE,
        name: ComFN.BOCODE,
        addonBefore: domainCode && `${domainCode}_`,
        maxLength: 55 - (domainCode === null || domainCode === void 0 ? void 0 : domainCode.length) || 0,
        showLengthInfo: true
      }) : '';
    }
  }, {
    name: ComFN.PMN_R,
    width: 150
  }, {
    name: ComFN.PMN,
    width: 150,
    editor: record => {
      return record !== null && record !== void 0 && record.get(ComFN.PMN_R) ? /*#__PURE__*/React.createElement(_TextField, {
        key: ComFN.PMN,
        name: ComFN.PMN,
        maxLength: 56,
        showLengthInfo: true,
        onChange: () => record === null || record === void 0 ? void 0 : record.setState('pmnEdit', true)
      }) : false;
    }
  }, extendTableEnabledFlag && !isTenant && {
    name: ComFN.ETN_R,
    width: 170
  }, extendTableEnabledFlag && !isTenant && {
    name: ComFN.ETN,
    width: 150,
    editor: record => {
      return record !== null && record !== void 0 && record.get(ComFN.ETN_R) ? /*#__PURE__*/React.createElement(_TextField, {
        key: ComFN.ETN,
        name: ComFN.ETN,
        maxLength: 60,
        showLengthInfo: true,
        onChange: () => record === null || record === void 0 ? void 0 : record.setState('etnEdit', true)
      }) : false;
    }
  }];
  midModal.handleOk(async () => {
    var _commonFieldDs$toData;
    const flag = await commonFieldDs.validate();
    const flag1 = await commonFieldMulDs.validate();
    if (!flag || !flag1) {
      return false;
    }
    setSpinFlag(true);
    midModal.update({
      okProps: {
        disabled: true
      },
      cancelProps: {
        disabled: true
      }
    });
    const baseData = (commonFieldDs === null || commonFieldDs === void 0 ? void 0 : (_commonFieldDs$toData = commonFieldDs.toData) === null || _commonFieldDs$toData === void 0 ? void 0 : _commonFieldDs$toData.call(commonFieldDs)) || [];
    if (extendFieldPrefixRule) {
      baseData.forEach(r => {
        Object.assign(r, {
          businessObjectFieldCode: `${extendFieldPrefixRule}${r === null || r === void 0 ? void 0 : r.businessObjectFieldCode}`
        });
      });
    }

    // 多选字段需要特殊处理
    const muiFieldMaringList = [];
    if (commonFieldMulDs !== null && commonFieldMulDs !== void 0 && commonFieldMulDs.length) {
      commonFieldMulDs.forEach(v => {
        const curItem = fieldsList.find(item => item.businessObjectFieldCode === (v === null || v === void 0 ? void 0 : v.get('businessObjectFieldCode')));
        (v === null || v === void 0 ? void 0 : v.get(ComFN.BOCODE)) && curItem.middleBusinessObject && (curItem.middleBusinessObject[ComFN.BOCODE] = `${domainCode}_${v === null || v === void 0 ? void 0 : v.get(ComFN.BOCODE)}`);
        (v === null || v === void 0 ? void 0 : v.get(ComFN.ETN)) && curItem.middleBusinessObject && (curItem.middleBusinessObject[ComFN.ETN] = v === null || v === void 0 ? void 0 : v.get(ComFN.ETN));
        (v === null || v === void 0 ? void 0 : v.get(ComFN.PMN)) && curItem.middleBusinessObject && (curItem.middleBusinessObject[ComFN.PMN] = v === null || v === void 0 ? void 0 : v.get(ComFN.PMN));
        muiFieldMaringList.push(curItem);
      });
    }
    const newdata = {
      ...data,
      businessObjectFields: [...baseData, ...muiFieldMaringList]
    };
    request(`${lowcodeOrganizationURL({
      route: HZERO_HMDE
    })}/business-objects/copy`, {
      data: newdata,
      method: 'POST'
    }).then(res => {
      // 复制成功，弹窗提示
      if (res.failed === true && res.code === 'hmde.business_object.copy.fail') {
        var _res$copyWarningList;
        // 普通字段
        const errorList1 = res === null || res === void 0 ? void 0 : (_res$copyWarningList = res.copyWarningList) === null || _res$copyWarningList === void 0 ? void 0 : _res$copyWarningList.filter(v => v.propertyType === 'FIELD_CODE');
        if (errorList1.length) {
          commonFieldDs.forEach(midRecord => {
            if (errorList1.find(item => item.businessObjectFieldCode === midRecord.get('businessObjectFieldCode'))) {
              midRecord.set(ComFN.ERRORCODE, midRecord.get(ComFN.NEWCODE));
            } else {
              midRecord.set(ComFN.ERRORCODE, '');
            }
          });
          commonFieldDs.validate();
        }

        // 多选字段
        const errorList2 = res === null || res === void 0 ? void 0 : res.copyWarningList.filter(v => v.propertyType === 'MIDDLE_MODEL');
        if (errorList2.length) {
          commonFieldMulDs.forEach(midRecord => {
            const cur = errorList2.find(item => item.businessObjectFieldCode === midRecord.get('businessObjectFieldCode'));
            if (cur.businessObjectCode) {
              midRecord.set(ComFN.BOCODE_ERROR, midRecord === null || midRecord === void 0 ? void 0 : midRecord.get(ComFN.BOCODE));
            }
            if (cur.physicalModelName) {
              midRecord.set(ComFN.PMN_ERROR, midRecord === null || midRecord === void 0 ? void 0 : midRecord.get(ComFN.PMN));
            }
            if (cur.extendsTableName) {
              midRecord.set(ComFN.ETN_ERROR, midRecord === null || midRecord === void 0 ? void 0 : midRecord.get(ComFN.ETN));
            }
          });
          commonFieldMulDs.validate();
        }
        return false;
      } else if (res.businessObjectCode) {
        notification.success({});
        // 关闭所有弹窗
        _Modal.destroyAll();
        // 打开新复制的业务对象
        copySuccess({
          businessObjectCode: res[FN.BUSINESSOBJECT_CODE],
          businessObjectName: res[FN.BUSINESSOBJECT_NAME],
          businessObjectId: res.businessObjectId
        });
      } else {
        getResponse(res);
      }
    }).catch(e => {
      console.error(e);
    }).finally(() => {
      setSpinFlag(false);
      midModal.update({
        okProps: {
          disabled: false
        },
        cancelProps: {
          disabled: false
        }
      });
    });
    return false;
  });
  return /*#__PURE__*/React.createElement(_Spin, {
    spinning: spinFlag
  }, /*#__PURE__*/React.createElement("div", null, !!(commonFieldDs !== null && commonFieldDs !== void 0 && commonFieldDs.length) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Alert, {
    message: `${intl.get('hmde.bo.businessObject.objE1').d('业务对象存在字段编码与领域')}【${data === null || data === void 0 ? void 0 : (_data$domain = data.domain) === null || _data$domain === void 0 ? void 0 : _data$domain.domainName}（${data === null || data === void 0 ? void 0 : (_data$domain2 = data.domain) === null || _data$domain2 === void 0 ? void 0 : _data$domain2.domainCode}）】${intl.get('hmde.bo.businessObject.objE2').d('的模板字段编码重复，请修改字段编码，重复字段将以修改后的字段编码生成')}`,
    type: "warning",
    showIcon: true
  }), /*#__PURE__*/React.createElement(_Table, {
    dataSet: commonFieldDs,
    columns: columns
  })), !!(commonFieldMulDs !== null && commonFieldMulDs !== void 0 && commonFieldMulDs.length) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Alert, {
    message: `${intl.get('hmde.bo.businessObject.copyBoWaringTip').d('由关联关系多选字段自动生成的中间对象编码、物理模型、扩展物理模型名称等与已有数据重复，请修改。')}`,
    type: "warning",
    showIcon: true,
    style: {
      marginTop: commonFieldDs !== null && commonFieldDs !== void 0 && commonFieldDs.length ? '30px' : 0
    }
  }), /*#__PURE__*/React.createElement(_Table, {
    dataSet: commonFieldMulDs,
    columns: columns1
  }))));
}
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(CommonFieldModal));