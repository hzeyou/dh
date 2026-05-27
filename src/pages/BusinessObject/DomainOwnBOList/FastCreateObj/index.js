import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Switch from "@hzero-front-ui/c7n-ui/lib/SwitchPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _IntlField from "@hzero-front-ui/c7n-ui/lib/IntlFieldPro";
import _Row from "choerodon-ui/lib/row";
import _Col from "choerodon-ui/lib/col";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Lov from "@hzero-front-ui/c7n-ui/lib/LovPro";
import _Alert from "@hzero-front-ui/c7n-ui/lib/Alert";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _noop from "lodash/noop";
import _isEmpty from "lodash/isEmpty";
import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import uuid from 'uuid/v4';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { LabelLayout } from 'choerodon-ui/pro/lib/form/enum';
import { ViewMode } from 'choerodon-ui/pro/lib/lov/enum';
import formatterCollections from 'utils/intl/formatterCollections';
import request from 'utils/request';
import { lowcodeOrganizationURL } from "hzero-front-apaas/lib/utils/common";
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { getResponse, isTenantRoleLevel } from 'utils/utils';
import notification from 'utils/notification';
import intl from 'utils/intl';
import { FN } from "./type";
import styles from "./index.less?modules";
import { formDatasetProps } from "./datasets";
const isTenant = isTenantRoleLevel();
const Index = ({
  domain,
  modal,
  tableQuery = _noop,
  tenantBusinessObjectPrefixRule = ''
}) => {
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
  const inputWithd = _extendTableEnabledFlag ? 4 : 5;
  const autoInputWith = useMemo(() => {
    if (_extendTableEnabledFlag && isTenant) {
      return [2, 2];
    }
    if (!_extendTableEnabledFlag && isTenant) {
      return [2, 3];
    }
    return [0, 0];
  }, [_extendTableEnabledFlag, isTenant]);

  /**
   * 去除字符串开头的下划线
   * @param str string
   */
  const deleteUnderline = useCallback(str => {
    if ((str === null || str === void 0 ? void 0 : str.charAt(0)) === '_') {
      return deleteUnderline(str === null || str === void 0 ? void 0 : str.slice(1));
    } else {
      return str;
    }
  }, []);
  const commonPro = {
    [FN.BUSINESS_OBJECT_NAME]: '',
    [FN.BUSINESS_OBJECT_CODE]: '',
    [FN.PHYSICAL_MODEL_NAME]: '',
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
              [FN.PHYSICAL_MODEL_NAME]: item.name,
              [FN.BUSINESS_OBJECT_CODE]: flag ? deleteUnderline(item === null || item === void 0 ? void 0 : (_item$name = item.name) === null || _item$name === void 0 ? void 0 : _item$name.slice(len)) : item === null || item === void 0 ? void 0 : item.name,
              [FN.IS_RELEVANCE_FLAG]: true,
              [FN.PHYSICAL_MODEL]: item
            };
          });
          // 过滤掉空数据
          const nullRecords = formDs.filter(_rec => !_rec.get(FN.BUSINESS_OBJECT_NAME) && !_rec.get(FN.BUSINESS_OBJECT_CODE) && !_rec.get(FN.PHYSICAL_MODEL_NAME) && !_rec.get(FN.IS_RELEVANCE_FLAG));
          formDs.delete(nullRecords, false);
          formDs.appendData(addList);
          LovMultipleDs.delete(record, false);
        }
      }
    }
  }), []);

  /**
   * 表单是否检验通过
   * @returns 返回boolean
   */
  const handleFormValidate = async () => {
    const flag = await (formDs === null || formDs === void 0 ? void 0 : formDs.validate());
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
    if (flag !== true) {
      var _formDom$getElementsB, _formDom$getElementsB2, _inputs$, _inputs$2;
      // 获取表单中的所有错误的输入框，聚焦到第一个
      const formDom = formRef.current;
      const inputs = (_formDom$getElementsB = formDom.getElementsByClassName('c7n-pro-input-invalid')) === null || _formDom$getElementsB === void 0 ? void 0 : (_formDom$getElementsB2 = _formDom$getElementsB[0]) === null || _formDom$getElementsB2 === void 0 ? void 0 : _formDom$getElementsB2.getElementsByTagName('input');
      inputs === null || inputs === void 0 ? void 0 : (_inputs$ = inputs[0]) === null || _inputs$ === void 0 ? void 0 : _inputs$.focus();
      inputs === null || inputs === void 0 ? void 0 : (_inputs$2 = inputs[0]) === null || _inputs$2 === void 0 ? void 0 : _inputs$2.select();
      return false;
    }
    return true;
  };
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
      // notification.error({
      //   message: intl
      //     .get('hmde.bo.businessObject.physicalErrorTips')
      //     .d('业务对象编码前缀格式错误，请联系管理员修改业务对象编码前缀规则'),
      // } as any);
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
    const codeErrorFlag = getAddonBefore.length > 60 || !/^[A-Z0-9_]*$/.test(getAddonBefore);
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
      const flag = await handleFormValidate();
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
      if (flag === false) {
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
              physicalModelNameErrorCodes: existPhysicalModelNames.find(item => item === record.get(FN.PHYSICAL_MODEL_NAME))
            });
            // 扩展表名称
            _extendTableEnabledFlag && record.set({
              extPhysicalModelNamesErrorCodes: existExtPhysicalModelNames.find(item => item === record.get(FN.EXTEND_STABLE_NAME))
            });
          });
          handleFormValidate();
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
    if (codeErrorFlag) {
      notification.error({
        message: intl.get('hmde.bo.businessObject.physicalErrorTips').d('业务对象编码前缀格式错误，请联系管理员修改业务对象编码前缀规则')
      });
    }
  }, []);

  /**
   * 新增行
   */
  const handleAddRow = () => {
    formDs.create({
      ...commonPro,
      id: uuid()
    });
    setTimeout(() => {
      const formDom = formRef.current; // 获取表单中的所有输入框
      const inputs = formDom.getElementsByTagName('input');
      let withd = _extendTableEnabledFlag ? 5 : 4;
      if (isTenant) withd -= 1;
      inputs[inputs.length - withd].focus(); // 设置焦点
      inputs[inputs.length - withd].select(); // 选中文字
    }, 0);
    watchWidthChange();
  };

  /**
   * 删除行
   * @param record 行信息
   */
  const handleDeleteRow = record => {
    formDs.delete(record, false);
    watchWidthChange();
  };
  const watchWidthChange = useCallback(() => {
    // 监听form高度，出现滚动条调整表头宽度
    setTimeout(() => {
      var _formRef$current, _formRef$current2;
      const flag = (formRef === null || formRef === void 0 ? void 0 : (_formRef$current = formRef.current) === null || _formRef$current === void 0 ? void 0 : _formRef$current.scrollHeight) > (formRef === null || formRef === void 0 ? void 0 : (_formRef$current2 = formRef.current) === null || _formRef$current2 === void 0 ? void 0 : _formRef$current2.clientHeight);
      if (flag) {
        var _formRef$current3, _formRef$current4;
        const scrollWidth = `${(formRef === null || formRef === void 0 ? void 0 : (_formRef$current3 = formRef.current) === null || _formRef$current3 === void 0 ? void 0 : _formRef$current3.offsetWidth) - (formRef === null || formRef === void 0 ? void 0 : (_formRef$current4 = formRef.current) === null || _formRef$current4 === void 0 ? void 0 : _formRef$current4.clientWidth)}px`;
        formRef.current.parentNode.firstChild.style.width = `calc( 100% - ${scrollWidth})`;
      } else {
        formRef.current.parentNode.firstChild.style.width = 'auto';
      }
    }, 0);
  }, []);
  /**
   * 键盘回调
   * @param e  键盘事件event
   */
  const handleOnkeyDown = e => {
    var _Array$from;
    e.stopPropagation();
    const keyCode = e.keyCode || e.which || e.charCode; // 兼容不同浏览器
    let withd = _extendTableEnabledFlag ? 5 : 4;
    if (isTenant) withd -= 1;
    // 判断所按是否回车键
    const formDom = formRef.current; // 获取表单中的所有输入框
    const inputs = (_Array$from = Array.from(formDom.getElementsByTagName('input'))) === null || _Array$from === void 0 ? void 0 : _Array$from.filter(item => item === null || item === void 0 ? void 0 : item.className);
    // 获取当前焦点输入框所处的位置
    const idx = Array.from(inputs).findIndex(input => input === document.activeElement);
    const rowSum = inputs.length / withd; // 总行数
    const lastHangFlag = inputs.length - withd < idx + 1; // 是否在最后一行
    const lastColumnFlag = rowSum * withd === idx + 1; // 是否在最后一行最后一列

    // 按下 shift + tab 组合键,返回上一单元格(换行)
    if (keyCode === 9 && e.shiftKey) {
      e.preventDefault();
      const minLeftNumber = 0;
      const num = idx % withd === 3 && !isTenant ? idx - 2 : idx - 1; // 跳过开关
      if (num >= minLeftNumber) {
        handleFocus(num);
      }
      return false;
    }
    if (keyCode === 13 || keyCode === 9) {
      if (lastHangFlag && keyCode === 13 || lastColumnFlag && keyCode === 9) {
        // 最后一行回车、最后一行最后一列新增一行
        handleAddRow();
        return;
      }
      if (keyCode === 13) {
        // 回车
        setTimeout(() => {
          handleFocus(idx + withd);
        }, 0);
        return;
      }
      if (keyCode === 9) {
        // tab键
        setTimeout(() => {
          const num = idx % withd === 1 && !isTenant ? idx + 2 : idx + 1; // 跳过开关
          handleFocus(num);
        }, 0);
      }
    }

    // 上下左右键
    if ([37, 38, 39, 40].includes(keyCode)) {
      e.preventDefault();
      switch (keyCode) {
        case 37:
          {
            const minLeftNumber = Math.floor(idx / withd) * withd;
            const num = idx % withd === 3 && !isTenant ? idx - 2 : idx - 1; // 跳过开关
            if (num >= minLeftNumber) {
              handleFocus(num);
            }
            break;
          }
        case 38:
          {
            const minLineNumber = 0;
            const nextLineNumber = idx - withd;
            if (nextLineNumber >= minLineNumber) {
              handleFocus(nextLineNumber);
            }
            break;
          }
        case 39:
          {
            const num = idx % withd === 1 && !isTenant ? idx + 2 : idx + 1; // 跳过开关
            const maxRightNumber = Math.floor(idx / withd + 1) * withd;
            if (num < maxRightNumber) {
              handleFocus(num);
            }
            break;
          }
        case 40:
          {
            const nextLineNumber = idx + withd;
            if (!lastHangFlag) {
              handleFocus(nextLineNumber);
            }
            break;
          }
        default:
          break;
      }
    }
  };
  const handleFocus = index => {
    var _Array$from2;
    const formDom = formRef.current; // 获取表单中的所有输入框
    const inputs = (_Array$from2 = Array.from(formDom.getElementsByTagName('input'))) === null || _Array$from2 === void 0 ? void 0 : _Array$from2.filter(item => item === null || item === void 0 ? void 0 : item.className);
    inputs[index].focus(); // 设置焦点
    inputs[index].select(); // 选中文字
  };
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
    }
    // message={
    //   <div className={styles['modal-content-wrapper-alert-div']}>
    //     {intl.get('hmde.bo.businessObject.support').d('支持')}
    //     <span style={{ marginRight: 0 }}>Tab</span>
    //     <span>Enter</span>
    //     {intl.get('hmde.common.view.message.operatetip1').d('快速换行；定位最后一格时')}，
    //     <span>Tab</span>
    //     {intl.get('hmde.common.view.message.operatetip2').d('新增一行；定位最后一行时')}，
    //     <span>Enter</span>
    //     {intl.get('hmde.common.view.message.addcol').d('新增一行。')}
    //     <div>
    //       {/* {intl.get('hmde.bo.businessObject.support').d('支持')} */}
    //       {/* <span>ctrl+C</span>
    //       {intl
    //         .get('hmde.bo.businessObject.ctrlC')
    //         .d('进行复制数据至 Excel，鼠标选中单元格后进行拖动选择复制范围;')} */}
    //       <span>ctrl+V</span>
    //       {intl
    //         .get('hmde.bo.businessObject.ctrlV')
    //         .d('进行粘贴从Excel复制的数据，选择可编辑单元格后进行粘贴数据。')}
    //     </div>
    //   </div>
    // }
    ,
    message: /*#__PURE__*/React.createElement("div", {
      className: styles['modal-content-wrapper-alert-div']
    }, intl.get('hmde.bo.businessObject.support').d('支持'), /*#__PURE__*/React.createElement("span", {
      style: {
        marginRight: 0
      }
    }, "Tab"), /*#__PURE__*/React.createElement("span", null, "Enter"), intl.get('hmde.bo.businessObject.operatetip1').d('快速换行；定位最后一格时，'), /*#__PURE__*/React.createElement("span", null, "Tab"), intl.get('hmde.bo.businessObject.operatetip2').d('新增一行；定位最后一行时，'), /*#__PURE__*/React.createElement("span", null, "Enter"), intl.get('hmde.bo.businessObject.operatetip3').d('新增一行')),
    type: "info",
    showIcon: true
  }), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'right',
      margin: 4
    }
  }, !isTenant && /*#__PURE__*/React.createElement(_Lov, {
    dataSet: LovMultipleDs,
    name: FN.LOV_MULTIPLE,
    noCache: true,
    mode: "button",
    color: "primary",
    funcType: "flat",
    clearButton: false,
    icon: "content_copy",
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
    color: "primary"
  }, intl.get('hmde.common.button.create').d('新建'))), /*#__PURE__*/React.createElement("div", {
    className: styles['form-content']
  }, /*#__PURE__*/React.createElement(_Row, {
    className: styles['form-content-title']
  }, /*#__PURE__*/React.createElement(_Col, {
    span: inputWithd + ((autoInputWith === null || autoInputWith === void 0 ? void 0 : autoInputWith[0]) || 0),
    className: styles['form-content-title-col']
  }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.busObjectName').d('业务对象名称'))), /*#__PURE__*/React.createElement(_Col, {
    span: inputWithd + 1 + ((autoInputWith === null || autoInputWith === void 0 ? void 0 : autoInputWith[1]) || 0),
    className: styles['form-content-title-col']
  }, /*#__PURE__*/React.createElement("span", null, " ", intl.get('hmde.common.busObjectCode').d('业务对象编码'))), !isTenant && /*#__PURE__*/React.createElement(_Col, {
    span: inputWithd,
    className: styles['form-content-title-col']
  }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.isphysicalModelName').d('是否关联物理模型'), ' ')), /*#__PURE__*/React.createElement(_Col, {
    span: inputWithd,
    className: styles['form-content-title-col']
  }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.label.physicalModelName').d('物理模型名称'))), _extendTableEnabledFlag && /*#__PURE__*/React.createElement(_Col, {
    span: 4,
    className: styles['form-content-title-col']
  }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.extendsTableName').d('扩展物理模型名称'))), /*#__PURE__*/React.createElement(_Col, {
    span: 2,
    className: styles['form-content-title-operator-col']
  }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.table.column.operate').d('操作')))), /*#__PURE__*/React.createElement("div", {
    className: styles['form-content-form'],
    ref: formRef
  }, formDs.map(item => /*#__PURE__*/React.createElement(_Form, {
    record: item,
    key: item.key,
    autoValidationLocate: false,
    labelLayout: "horizontal",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(_Row, {
    className: styles['form-content-form-row'],
    gutter: 16
  }, /*#__PURE__*/React.createElement(_Col, {
    span: inputWithd + ((autoInputWith === null || autoInputWith === void 0 ? void 0 : autoInputWith[0]) || 0)
  }, /*#__PURE__*/React.createElement(_IntlField, {
    style: {
      width: '100%'
    },
    name: FN.BUSINESS_OBJECT_NAME,
    maxLength: 60,
    onKeyDown: handleOnkeyDown
  })), /*#__PURE__*/React.createElement(_Col, {
    span: inputWithd + 1 + ((autoInputWith === null || autoInputWith === void 0 ? void 0 : autoInputWith[1]) || 0)
  }, /*#__PURE__*/React.createElement(_TextField, {
    style: {
      width: '100%'
    },
    name: FN.BUSINESS_OBJECT_CODE,
    addonBefore: getAddonBefore && /*#__PURE__*/React.createElement(_Tooltip, {
      title: getAddonBefore
    }, getAddonBefore),
    maxLength: 56 - getAddonBefore.length,
    showLengthInfo: true,
    onKeyDown: handleOnkeyDown,
    onChange: () => {
      item.setState('businessObjectCodeEditFlag', true);
    }
  })), !isTenant && /*#__PURE__*/React.createElement(_Col, {
    span: inputWithd,
    className: styles['form-content-form-row-operator']
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_Switch, {
    name: FN.IS_RELEVANCE_FLAG
  }))), /*#__PURE__*/React.createElement(_Col, {
    span: inputWithd
  }, item.get(FN.IS_RELEVANCE_FLAG) === true ?
  /*#__PURE__*/
  // LOV有时触发不了onKeyDown的回车，写两个事件监听并阻止冒泡
  React.createElement("div", {
    onKeyDown: handleOnkeyDown
  }, /*#__PURE__*/React.createElement(_Lov, {
    name: FN.PHYSICAL_MODEL,
    onKeyDown: handleOnkeyDown,
    style: {
      width: '100%'
    }
  })) : /*#__PURE__*/React.createElement(_TextField, {
    style: {
      width: '100%'
    },
    name: FN.PHYSICAL_MODEL_NAME,
    onKeyDown: handleOnkeyDown,
    onChange: () => {
      item.setState('physicalModelNameEditFlag', true);
    },
    showLengthInfo: true
  })), _extendTableEnabledFlag && /*#__PURE__*/React.createElement(_Col, {
    span: 4
  }, item.get(FN.IS_RELEVANCE_FLAG) === true ?
  /*#__PURE__*/
  // LOV有时触发不了onKeyDown的回车，写两个事件监听并阻止冒泡
  React.createElement("div", {
    onKeyDown: handleOnkeyDown
  }, /*#__PURE__*/React.createElement(_Lov, {
    name: FN.EXT_PHYSICAL_MODEL,
    onKeyDown: handleOnkeyDown,
    style: {
      width: '100%'
    }
  })) : /*#__PURE__*/React.createElement(_TextField, {
    style: {
      width: '100%'
    },
    name: FN.EXTEND_STABLE_NAME,
    onKeyDown: handleOnkeyDown,
    onChange: () => {
      item.setState('extendsTableNameEditFlag', true);
    },
    showLengthInfo: true
  })), /*#__PURE__*/React.createElement(_Col, {
    span: 2,
    className: styles['form-content-form-row-operator']
  }, /*#__PURE__*/React.createElement("a", {
    hidden: formDs.length === 1
    // funcType={FuncType.flat}
    // color={ButtonColor.primary}
    // icon="delete_black-o"
    ,
    onClick: handleDeleteRow.bind(null, item)
  }, intl.get('hmde.common.button.delete').d('删除'))))))))));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Index));
export * from "./type";