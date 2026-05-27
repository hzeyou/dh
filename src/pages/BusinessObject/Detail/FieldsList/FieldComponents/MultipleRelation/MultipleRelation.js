import _Switch from "@hzero-front-ui/c7n-ui/lib/SwitchPro";
import _Collapse from "@hzero-front-ui/c7n-ui/lib/Collapse";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _SelectBox from "@hzero-front-ui/c7n-ui/lib/SelectBoxPro";
import _Tag from "@hzero-front-ui/c7n-ui/lib/Tag";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _IntlField from "@hzero-front-ui/c7n-ui/lib/IntlFieldPro";
import _Alert from "@hzero-front-ui/c7n-ui/lib/Alert";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Lov from "@hzero-front-ui/c7n-ui/lib/LovPro";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import intl from 'utils/intl';
import { LabelLayout, LabelAlign } from 'choerodon-ui/pro/lib/form/enum';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import { isTenantRoleLevel, getCurrentOrganizationId, getResponse } from 'utils/utils';
import { useRequest } from 'ahooks';
import { IntlType } from 'choerodon-ui/pro/lib/intl-field/enum';
import { ResizeType } from 'choerodon-ui/pro/lib/text-area/enum';
import { getBoDetail, getReverseTableField, queryDefaultOption } from "hzero-front-hmde/lib/services/businessObjectService";
import { CustomTemplateDS } from "hzero-front-hmde/lib/stores/Domain/DomainDS";
import Empty from "hzero-front-hmde/lib/routes/BusinessObject/Detail/PermissionPolicy/components/Empty";
import ShowExtendsFieldDetail from "hzero-front-hmde/lib/routes/BusinessObject/DomainOwnBOList/ShowExtendsFieldDetail";
import ShowExtendsFieldList from "hzero-front-hmde/lib/routes/BusinessObject/DomainOwnBOList/ShowExtendsFieldList";
import { extendsMapDs } from "hzero-front-hmde/lib/stores/BusinessObject/BusinessObjectDS";
import { FieldType } from "hzero-front-apaas/lib/constants/businessObject";
import { FormDS, FN } from "./dataset";
import styles from "./index.less?modules";
import { handleCode } from "./utils";
const isTenant = isTenantRoleLevel();
const tenantId = getCurrentOrganizationId();
const App = ({
  baseInfoDS,
  childrenComRef,
  extendTableEnabledFlag,
  flexFieldEnabledFlag,
  isEditMode,
  detailData,
  fieldType
}) => {
  var _baseInfoDS$current2, _baseInfoDS$current2$, _MultipleRelationDs$c, _MultipleRelationDs$c10, _baseInfoDS$current11, _MultipleRelationDs$c26, _MultipleRelationDs$c27, _MultipleRelationDs$c28, _MultipleRelationDs$c29, _MultipleRelationDs$c30, _MultipleRelationDs$c31, _MultipleRelationDs$c32, _MultipleRelationDs$c33, _MultipleRelationDs$c34, _MultipleRelationDs$c35, _MultipleRelationDs$c36, _MultipleRelationDs$c37, _MultipleRelationDs$c38, _MultipleRelationDs$c39, _MultipleRelationDs$c40, _MultipleRelationDs$c42, _MultipleRelationDs$c44, _MultipleRelationDs$c45, _MultipleRelationDs$c46;
  const extendFlag = extendTableEnabledFlag && !isTenant;
  const extendFieldPrefixRule = useMemo(() => {
    try {
      var _baseInfoDS$current;
      return JSON.parse(baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('extendFieldPrefixRule'));
    } catch (error) {
      return '';
    }
  }, []);
  const _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    linkFieldExtendFieldPrefixRule = _useState2[0],
    setLinkFieldExtendFieldPrefixRule = _useState2[1];
  const domainCode = `${baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : (_baseInfoDS$current2$ = _baseInfoDS$current2.get) === null || _baseInfoDS$current2$ === void 0 ? void 0 : _baseInfoDS$current2$.call(_baseInfoDS$current2, 'domainCode')}_`;
  const MultipleRelationDs = useMemo(() => new _DataSet(FormDS({
    baseInfoDS,
    extendFieldPrefixRule,
    isEditMode,
    domainCode
  })), []);
  const disabledFlag = !(MultipleRelationDs !== null && MultipleRelationDs !== void 0 && (_MultipleRelationDs$c = MultipleRelationDs.current) !== null && _MultipleRelationDs$c !== void 0 && _MultipleRelationDs$c.get(FN.masterBusinessObjectId)) ||
  // 没有选择关联对象 下面都禁用
  fieldType === FieldType.STANDARD && isTenant; // 租户继承平台的标准字段不能如何操作;

  const getFieldsValue = async () => {
    var _MultipleRelationDs$v, _MultipleRelationDs$t, _data$_tls, _data$_tls3, _data$_tls5, _data$_tls7, _data$_tls9;
    if (!(await (MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$v = MultipleRelationDs.validate) === null || _MultipleRelationDs$v === void 0 ? void 0 : _MultipleRelationDs$v.call(MultipleRelationDs)))) {
      return false;
    }
    const data = MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$t = MultipleRelationDs.toData()) === null || _MultipleRelationDs$t === void 0 ? void 0 : _MultipleRelationDs$t[0];
    data === null || data === void 0 ? true : delete data.masterBusinessObject;
    data === null || data === void 0 ? true : delete data.middleBusinessObject_businessObjectName;
    data === null || data === void 0 ? true : delete data.firstField_businessObjectFieldName;
    data === null || data === void 0 ? true : delete data.secondField_businessObjectFieldName;
    data === null || data === void 0 ? true : delete data.firstField_masterFieldName;
    data === null || data === void 0 ? true : delete data.secondField_masterFieldName;
    if (data !== null && data !== void 0 && (_data$_tls = data._tls) !== null && _data$_tls !== void 0 && _data$_tls.middleBusinessObject_businessObjectName) {
      var _data$middleBusinessO, _data$_tls2;
      data.middleBusinessObject._tls = {
        ...(data === null || data === void 0 ? void 0 : (_data$middleBusinessO = data.middleBusinessObject) === null || _data$middleBusinessO === void 0 ? void 0 : _data$middleBusinessO._tls),
        businessObjectName: data === null || data === void 0 ? void 0 : (_data$_tls2 = data._tls) === null || _data$_tls2 === void 0 ? void 0 : _data$_tls2.middleBusinessObject_businessObjectName
      };
    }
    if (data !== null && data !== void 0 && (_data$_tls3 = data._tls) !== null && _data$_tls3 !== void 0 && _data$_tls3.firstField_businessObjectFieldName) {
      var _data$firstField, _data$_tls4;
      data.firstField._tls = {
        ...(data === null || data === void 0 ? void 0 : (_data$firstField = data.firstField) === null || _data$firstField === void 0 ? void 0 : _data$firstField._tls),
        businessObjectFieldName: data === null || data === void 0 ? void 0 : (_data$_tls4 = data._tls) === null || _data$_tls4 === void 0 ? void 0 : _data$_tls4.firstField_businessObjectFieldName
      };
    }
    if (data !== null && data !== void 0 && (_data$_tls5 = data._tls) !== null && _data$_tls5 !== void 0 && _data$_tls5.firstField_masterFieldName) {
      var _data$firstField2, _data$_tls6;
      data.firstField._tls = {
        ...(data === null || data === void 0 ? void 0 : (_data$firstField2 = data.firstField) === null || _data$firstField2 === void 0 ? void 0 : _data$firstField2._tls),
        masterFieldName: data === null || data === void 0 ? void 0 : (_data$_tls6 = data._tls) === null || _data$_tls6 === void 0 ? void 0 : _data$_tls6.firstField_masterFieldName
      };
    }
    if (data !== null && data !== void 0 && (_data$_tls7 = data._tls) !== null && _data$_tls7 !== void 0 && _data$_tls7.secondField_businessObjectFieldName) {
      var _data$secondField, _data$_tls8;
      data.secondField._tls = {
        ...(data === null || data === void 0 ? void 0 : (_data$secondField = data.secondField) === null || _data$secondField === void 0 ? void 0 : _data$secondField._tls),
        businessObjectFieldName: data === null || data === void 0 ? void 0 : (_data$_tls8 = data._tls) === null || _data$_tls8 === void 0 ? void 0 : _data$_tls8.secondField_businessObjectFieldName
      };
    }
    if (data !== null && data !== void 0 && (_data$_tls9 = data._tls) !== null && _data$_tls9 !== void 0 && _data$_tls9.secondField_masterFieldName) {
      var _data$secondField2, _data$_tls10;
      data.secondField._tls = {
        ...(data === null || data === void 0 ? void 0 : (_data$secondField2 = data.secondField) === null || _data$secondField2 === void 0 ? void 0 : _data$secondField2._tls),
        masterFieldName: data === null || data === void 0 ? void 0 : (_data$_tls10 = data._tls) === null || _data$_tls10 === void 0 ? void 0 : _data$_tls10.secondField_masterFieldName
      };
    }
    return data;
  };
  const _useRequest = useRequest(queryDefaultOption, {
      manual: true,
      staleTime: -1
    }),
    runAsync = _useRequest.runAsync;
  // 当前对象的默认值列表
  useEffect(() => {
    if (!isEditMode) {
      var _baseInfoDS$current3;
      runAsync({
        businessObjectCode: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current3 = baseInfoDS.current) === null || _baseInfoDS$current3 === void 0 ? void 0 : _baseInfoDS$current3.get('businessObjectCode'),
        tenantId
      }).then(res => {
        if (getResponse(res)) {
          var _res$content;
          if (res !== null && res !== void 0 && (_res$content = res.content) !== null && _res$content !== void 0 && _res$content.length) {
            var _MultipleRelationDs$c2, _MultipleRelationDs$c3;
            MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c2 = MultipleRelationDs.current) === null || _MultipleRelationDs$c2 === void 0 ? void 0 : _MultipleRelationDs$c2.set(FN.firstFieldLov1, res.content[0]);
            MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c3 = MultipleRelationDs.current) === null || _MultipleRelationDs$c3 === void 0 ? void 0 : _MultipleRelationDs$c3.set(FN.secondField_1_Lov1, res.content[0]);
          }
        }
      });
    }
  }, []);
  useEffect(() => {
    if (!isEditMode) {
      var _MultipleRelationDs$c4, _ref, _ref$slice, _baseInfoDS$current4, _MultipleRelationDs$c5, _ref2, _ref2$slice, _baseInfoDS$current5, _MultipleRelationDs$c6, _baseInfoDS$current6, _baseInfoDS$current6$, _baseInfoDS$current7, _baseInfoDS$current7$, _MultipleRelationDs$c7;
      // 新建的时候 需要赋一些默认值
      MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c4 = MultipleRelationDs.current) === null || _MultipleRelationDs$c4 === void 0 ? void 0 : _MultipleRelationDs$c4.set(FN.firstFieldNameLanguage, (_ref = (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current4 = baseInfoDS.current) === null || _baseInfoDS$current4 === void 0 ? void 0 : _baseInfoDS$current4.get('businessObjectName')) + 'ID') === null || _ref === void 0 ? void 0 : (_ref$slice = _ref.slice) === null || _ref$slice === void 0 ? void 0 : _ref$slice.call(_ref, 0, 30));
      MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c5 = MultipleRelationDs.current) === null || _MultipleRelationDs$c5 === void 0 ? void 0 : _MultipleRelationDs$c5.set(FN.secondField_1_NameLanguage, (_ref2 = intl.get('hmde.common.checkboxType').d('多选') + (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current5 = baseInfoDS.current) === null || _baseInfoDS$current5 === void 0 ? void 0 : _baseInfoDS$current5.get('businessObjectName'))) === null || _ref2 === void 0 ? void 0 : (_ref2$slice = _ref2.slice) === null || _ref2$slice === void 0 ? void 0 : _ref2$slice.call(_ref2, 0, 30));
      MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c6 = MultipleRelationDs.current) === null || _MultipleRelationDs$c6 === void 0 ? void 0 : _MultipleRelationDs$c6.set(FN.secondField_1_Code, handleCode('multi_' + (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current6 = baseInfoDS.current) === null || _baseInfoDS$current6 === void 0 ? void 0 : (_baseInfoDS$current6$ = _baseInfoDS$current6.get('businessObjectCode')) === null || _baseInfoDS$current6$ === void 0 ? void 0 : _baseInfoDS$current6$.substring((baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current7 = baseInfoDS.current) === null || _baseInfoDS$current7 === void 0 ? void 0 : (_baseInfoDS$current7$ = _baseInfoDS$current7.get('domainCode')) === null || _baseInfoDS$current7$ === void 0 ? void 0 : _baseInfoDS$current7$.length) + 1)), extendFieldPrefixRule));

      // 未关联是下拉框
      if (MultipleRelationDs !== null && MultipleRelationDs !== void 0 && (_MultipleRelationDs$c7 = MultipleRelationDs.current) !== null && _MultipleRelationDs$c7 !== void 0 && _MultipleRelationDs$c7.get(FN.autoCreateFlag)) {
        var _MultipleRelationDs$c8, _baseInfoDS$current8;
        MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c8 = MultipleRelationDs.current) === null || _MultipleRelationDs$c8 === void 0 ? void 0 : _MultipleRelationDs$c8.set(FN.firstFieldCode, handleCode((baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current8 = baseInfoDS.current) === null || _baseInfoDS$current8 === void 0 ? void 0 : _baseInfoDS$current8.get('businessObjectCode')) + 'Id', extendFieldPrefixRule));
      }
    } else {
      getLinkFieldExtendFieldPrefixRule(detailData.masterBusinessObjectId);
      if (extendFieldPrefixRule && detailData.secondField) {
        var _detailData$secondFie, _detailData$secondFie2;
        detailData.secondField.masterFieldCode = detailData === null || detailData === void 0 ? void 0 : (_detailData$secondFie = detailData.secondField) === null || _detailData$secondFie === void 0 ? void 0 : (_detailData$secondFie2 = _detailData$secondFie.masterFieldCode) === null || _detailData$secondFie2 === void 0 ? void 0 : _detailData$secondFie2.slice(extendFieldPrefixRule.length);
      }
      MultipleRelationDs.loadData([detailData]);
    }
  }, [detailData]);

  // 租户下关联对象的字段前缀处理
  useEffect(() => {
    if (!isEditMode) {
      var _MultipleRelationDs$c9;
      getLinkFieldExtendFieldPrefixRule(MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c9 = MultipleRelationDs.current) === null || _MultipleRelationDs$c9 === void 0 ? void 0 : _MultipleRelationDs$c9.get(FN.masterBusinessObjectId));
    }
  }, [MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c10 = MultipleRelationDs.current) === null || _MultipleRelationDs$c10 === void 0 ? void 0 : _MultipleRelationDs$c10.get(FN.masterBusinessObjectId)]);
  const getLinkFieldExtendFieldPrefixRule = id => {
    if (isTenant && id) {
      getBoDetail(id).then(res => {
        if (getResponse(res)) {
          try {
            var _MultipleRelationDs$c11;
            const v = JSON.parse(res === null || res === void 0 ? void 0 : res.extendFieldPrefixRule) || '';
            MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c11 = MultipleRelationDs.current) === null || _MultipleRelationDs$c11 === void 0 ? void 0 : _MultipleRelationDs$c11.setState('linkFieldExtendFieldPrefixRule', v);
            setLinkFieldExtendFieldPrefixRule(v);
            if (isEditMode && v) {
              var _MultipleRelationDs$c12, _MultipleRelationDs$c13;
              MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c12 = MultipleRelationDs.current) === null || _MultipleRelationDs$c12 === void 0 ? void 0 : _MultipleRelationDs$c12.set(FN.firstField_1_Code, MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c13 = MultipleRelationDs.current) === null || _MultipleRelationDs$c13 === void 0 ? void 0 : _MultipleRelationDs$c13.get(FN.firstField_1_Code).slice(v.length));
            }
          } catch (error) {
            console.log(error);
          }
        }
      });
    }
  };

  // 拿关联的物理模型的整数类字段
  const handleReverseTableField = id => {
    getReverseTableField({
      tableId: id
    }).then(res => {
      if (getResponse(res)) {
        var _MultipleRelationDs$g, _MultipleRelationDs$g2;
        const newList = (res === null || res === void 0 ? void 0 : res.map(v => ({
          value: v.camelCaseName,
          meaning: v.description || v.camelCaseName
        }))) || [];
        const listDs = new _DataSet({
          paging: false,
          data: newList
        });
        MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$g = MultipleRelationDs.getField(FN.firstFieldCode)) === null || _MultipleRelationDs$g === void 0 ? void 0 : _MultipleRelationDs$g.set('options', listDs);
        MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$g2 = MultipleRelationDs.getField(FN.secondFieldCode)) === null || _MultipleRelationDs$g2 === void 0 ? void 0 : _MultipleRelationDs$g2.set('options', listDs);
      }
    });
  };
  useImperativeHandle(childrenComRef, () => ({
    MultipleRelationDs,
    // 务必维护和组件名称一致后缀加Ds 方便父组件调用
    getFieldsValue
  }));

  // 引用预置模板 ds 数据
  const customTemplateDS = useMemo(() => {
    var _baseInfoDS$current9;
    return new _DataSet(CustomTemplateDS({
      domainId: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current9 = baseInfoDS.current) === null || _baseInfoDS$current9 === void 0 ? void 0 : _baseInfoDS$current9.get('domainId')
    }));
  }, []);
  useEffect(() => {
    var _baseInfoDS$current10;
    customTemplateDS.setQueryParameter('positiveEnabledFlag', true);
    customTemplateDS.setQueryParameter('domainId', baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current10 = baseInfoDS.current) === null || _baseInfoDS$current10 === void 0 ? void 0 : _baseInfoDS$current10.get('domainId'));
    customTemplateDS.query().then(res => {
      var _MultipleRelationDs$c14;
      const arr = [];
      res === null || res === void 0 ? void 0 : res.forEach(v => {
        v.defaultFlag && arr.push(v === null || v === void 0 ? void 0 : v.templateCode);
      });
      MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c14 = MultipleRelationDs.current) === null || _MultipleRelationDs$c14 === void 0 ? void 0 : _MultipleRelationDs$c14.set(FN.templateCodes, arr);
    });
  }, []);

  // 关联关系多选字段,  如果对象未发布 禁用 继续新建 和 保存按钮
  const saveDisabled = (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current11 = baseInfoDS.current) === null || _baseInfoDS$current11 === void 0 ? void 0 : _baseInfoDS$current11.get('publishStatus')) === 'UNPUBLISHED';
  useDataSetEvents(MultipleRelationDs, 'update', async ({
    name,
    value,
    record
  }) => {
    var _baseInfoDS$current12;
    const curDomainCode = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current12 = baseInfoDS.current) === null || _baseInfoDS$current12 === void 0 ? void 0 : _baseInfoDS$current12.get('domainCode');
    if (name === FN.masterBusinessObject && value) {
      var _baseInfoDS$current13, _baseInfoDS$current14, _ref3, _ref3$slice, _value$businessObject, _value$businessObject2, _value$businessObject3, _value$domainCode, _ref4, _ref4$slice, _ref5, _ref5$slice, _MultipleRelationDs$c15, _ref6, _ref6$slice, _value$businessObject4, _value$domainCode2;
      await new Promise(resolve => setTimeout(resolve, 700));
      // 赋默认值
      const curBusinessObjectName = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current13 = baseInfoDS.current) === null || _baseInfoDS$current13 === void 0 ? void 0 : _baseInfoDS$current13.get('businessObjectName');
      const curBusinessObjectCode = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current14 = baseInfoDS.current) === null || _baseInfoDS$current14 === void 0 ? void 0 : _baseInfoDS$current14.get('businessObjectCode');
      // 中间对象默认编码
      const defaultMidCode = (_ref3 = `${curBusinessObjectCode === null || curBusinessObjectCode === void 0 ? void 0 : curBusinessObjectCode.substr(-((curBusinessObjectCode === null || curBusinessObjectCode === void 0 ? void 0 : curBusinessObjectCode.length) - (curDomainCode === null || curDomainCode === void 0 ? void 0 : curDomainCode.length) - 1))}_${value === null || value === void 0 ? void 0 : (_value$businessObject = value.businessObjectCode) === null || _value$businessObject === void 0 ? void 0 : (_value$businessObject2 = _value$businessObject.substr) === null || _value$businessObject2 === void 0 ? void 0 : _value$businessObject2.call(_value$businessObject, -(((_value$businessObject3 = value.businessObjectCode) === null || _value$businessObject3 === void 0 ? void 0 : _value$businessObject3.length) - ((_value$domainCode = value.domainCode) === null || _value$domainCode === void 0 ? void 0 : _value$domainCode.length) - 1))}`) === null || _ref3 === void 0 ? void 0 : (_ref3$slice = _ref3.slice) === null || _ref3$slice === void 0 ? void 0 : _ref3$slice.call(_ref3, 0, 56 - domainCode.length);
      // 中间对象名称
      record === null || record === void 0 ? void 0 : record.set(FN.midNameLanguage, (_ref4 = `${intl.get('hmde.common.link').d('关联')}${curBusinessObjectName}${intl.get('hmde.common.and').d('与')}${value === null || value === void 0 ? void 0 : value.businessObjectName}`) === null || _ref4 === void 0 ? void 0 : (_ref4$slice = _ref4.slice) === null || _ref4$slice === void 0 ? void 0 : _ref4$slice.call(_ref4, 0, 60));
      // 中间对象编码
      record === null || record === void 0 ? void 0 : record.set(FN.midCode, defaultMidCode);

      // 关联业务对象 【xx】 的从主字段信息添加默认值
      record === null || record === void 0 ? void 0 : record.set(FN.secondFieldNameLanguage, (_ref5 = (value === null || value === void 0 ? void 0 : value.businessObjectName) + 'ID') === null || _ref5 === void 0 ? void 0 : (_ref5$slice = _ref5.slice) === null || _ref5$slice === void 0 ? void 0 : _ref5$slice.call(_ref5, 0, 30));
      if (MultipleRelationDs !== null && MultipleRelationDs !== void 0 && (_MultipleRelationDs$c15 = MultipleRelationDs.current) !== null && _MultipleRelationDs$c15 !== void 0 && _MultipleRelationDs$c15.get(FN.autoCreateFlag)) {
        var _MultipleRelationDs$c16;
        MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c16 = MultipleRelationDs.current) === null || _MultipleRelationDs$c16 === void 0 ? void 0 : _MultipleRelationDs$c16.set(FN.secondFieldCode, handleCode((value === null || value === void 0 ? void 0 : value.businessObjectCode) + 'Id', extendFieldPrefixRule));
      }

      // 当前对象的关联多选字段信息加默认值
      record === null || record === void 0 ? void 0 : record.set(FN.firstField_1_NameLanguage, (_ref6 = intl.get('hmde.common.checkboxType').d('多选') + (value === null || value === void 0 ? void 0 : value.businessObjectName)) === null || _ref6 === void 0 ? void 0 : (_ref6$slice = _ref6.slice) === null || _ref6$slice === void 0 ? void 0 : _ref6$slice.call(_ref6, 0, 30));
      record === null || record === void 0 ? void 0 : record.set(FN.firstField_1_Code, 'multi_' + (value === null || value === void 0 ? void 0 : (_value$businessObject4 = value.businessObjectCode) === null || _value$businessObject4 === void 0 ? void 0 : _value$businessObject4.substring((value === null || value === void 0 ? void 0 : (_value$domainCode2 = value.domainCode) === null || _value$domainCode2 === void 0 ? void 0 : _value$domainCode2.length) + 1)));

      // 关联对象的默认值列表 添加默认值
      runAsync({
        businessObjectCode: value.businessObjectCode,
        tenantId
      }).then(res => {
        if (getResponse(res)) {
          var _res$content2;
          if (res !== null && res !== void 0 && (_res$content2 = res.content) !== null && _res$content2 !== void 0 && _res$content2.length) {
            var _MultipleRelationDs$c17, _MultipleRelationDs$c18, _MultipleRelationDs$c19, _MultipleRelationDs$c20;
            (MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c17 = MultipleRelationDs.current) === null || _MultipleRelationDs$c17 === void 0 ? void 0 : _MultipleRelationDs$c17.get(FN.secondFieldOptionType)) === 'BUSINESS_OBJECT_OPTION' && (MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c18 = MultipleRelationDs.current) === null || _MultipleRelationDs$c18 === void 0 ? void 0 : _MultipleRelationDs$c18.set(FN.secondFieldLov1, res.content[0]));
            (MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c19 = MultipleRelationDs.current) === null || _MultipleRelationDs$c19 === void 0 ? void 0 : _MultipleRelationDs$c19.get(FN.firstField_1_OptionType)) === 'BUSINESS_OBJECT_OPTION' && (MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c20 = MultipleRelationDs.current) === null || _MultipleRelationDs$c20 === void 0 ? void 0 : _MultipleRelationDs$c20.set(FN.firstField_1_Lov1, res.content[0]));
          }
        }
      });
    }

    // 中间对象编码change
    if (name === FN.midCode) {
      // 物理模型名称
      if (!(MultipleRelationDs !== null && MultipleRelationDs !== void 0 && MultipleRelationDs.getState('physicalModelNameEdit')) && !isEditMode && record !== null && record !== void 0 && record.get(FN.autoCreateFlag)) {
        var _MultipleRelationDs$c21;
        record === null || record === void 0 ? void 0 : record.init(FN.physicalModelName, `${curDomainCode}_${MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c21 = MultipleRelationDs.current) === null || _MultipleRelationDs$c21 === void 0 ? void 0 : _MultipleRelationDs$c21.get(FN.midCode)}`);
      }
      // 扩展物理模型名称
      if (!(MultipleRelationDs !== null && MultipleRelationDs !== void 0 && MultipleRelationDs.getState('extendsTableNameEdit')) && !isEditMode && extendFlag && record !== null && record !== void 0 && record.get(FN.autoCreateFlag)) {
        var _MultipleRelationDs$c22, _baseInfoDS$current15;
        record === null || record === void 0 ? void 0 : record.init(FN.extendsTableName, `${curDomainCode}_${MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c22 = MultipleRelationDs.current) === null || _MultipleRelationDs$c22 === void 0 ? void 0 : _MultipleRelationDs$c22.get(FN.midCode)}_${(baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current15 = baseInfoDS.current) === null || _baseInfoDS$current15 === void 0 ? void 0 : _baseInfoDS$current15.get('extendTableSuffix')) || 'ext'}`);
      }
    }
    if (name === FN.physicalModelName) {
      MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : MultipleRelationDs.setState('physicalModelNameEdit', true);
    }
    if (name === FN.extendsTableName) {
      MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : MultipleRelationDs.setState('extendsTableNameEdit', true);
    }

    // 关联不关联物理模型
    if (name === FN.autoCreateFlag) {
      record === null || record === void 0 ? void 0 : record.set(FN.firstFieldCode, '');
      record === null || record === void 0 ? void 0 : record.set(FN.secondFieldCode, '');
      record === null || record === void 0 ? void 0 : record.set(FN.customPrimaryKeyCode, '');
      record === null || record === void 0 ? void 0 : record.set(FN.physicalModel, null);
      record === null || record === void 0 ? void 0 : record.set(FN.extPhysicalModel, null);
    }

    // 字段编码 驼峰处理
    if ([FN.firstFieldCode, FN.secondFieldCode, FN.firstField_1_Code, FN.secondField_1_Code].includes(name) && value) {
      record === null || record === void 0 ? void 0 : record.set(name, handleCode(value, extendFieldPrefixRule));
    }

    // 物理模型lov change
    if (name === FN.physicalModel && value) {
      handleReverseTableField(value.id);
      record === null || record === void 0 ? void 0 : record.set(FN.firstFieldCode, '');
      record === null || record === void 0 ? void 0 : record.set(FN.secondFieldCode, '');
    }

    // 关联当前对象的从主字段信息 的 视图来源/引用值列表/值集视图/显示字段 联动 业务对象 【xx】 的关联多选字段信息的数据
    if (!isEditMode && !(MultipleRelationDs !== null && MultipleRelationDs !== void 0 && MultipleRelationDs.getState('firstFieldEditFlag'))) {
      if (name === FN.firstFieldOptionType && value) {
        record === null || record === void 0 ? void 0 : record.init(FN.secondField_1_OptionType, value);
      }
      if (name === FN.firstFieldLov1 && value) {
        record === null || record === void 0 ? void 0 : record.init(FN.secondField_1_Lov1, value);
      }
      if (name === FN.firstFieldShowField && value) {
        record === null || record === void 0 ? void 0 : record.init(FN.secondField_1_ShowField, value);
      }
    }
    if (!isEditMode && !(MultipleRelationDs !== null && MultipleRelationDs !== void 0 && MultipleRelationDs.getState('secondFieldEditFlag'))) {
      if (name === FN.secondFieldOptionType && value) {
        record === null || record === void 0 ? void 0 : record.init(FN.firstField_1_OptionType, value);
      }
      if (name === FN.secondFieldLov1 && value) {
        record === null || record === void 0 ? void 0 : record.init(FN.firstField_1_Lov1, value);
      }
      if (name === FN.secondFieldShowField && value) {
        record === null || record === void 0 ? void 0 : record.init(FN.firstField_1_ShowField, value);
      }
    }
    if ([FN.secondField_1_OptionType, FN.secondField_1_Lov1, FN.secondField_1_ShowField].includes(name)) {
      MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : MultipleRelationDs.setState('firstFieldEditFlag', true);
    }
    if ([FN.firstField_1_OptionType, FN.firstField_1_Lov1, FN.firstField_1_ShowField].includes(name)) {
      MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : MultipleRelationDs.setState('secondFieldEditFlag', true);
    }

    // 视图来源变化
    if (name === FN.firstFieldOptionType) {
      record === null || record === void 0 ? void 0 : record.set(FN.firstFieldLov1, null);
      record === null || record === void 0 ? void 0 : record.set(FN.firstFieldShowField, null);
      if (!(MultipleRelationDs !== null && MultipleRelationDs !== void 0 && MultipleRelationDs.getState('firstFieldEditFlag'))) {
        record === null || record === void 0 ? void 0 : record.init(FN.secondField_1_Lov1, null);
        record === null || record === void 0 ? void 0 : record.init(FN.secondField_1_ShowField, null);
      }
    }
    if (name === FN.secondFieldOptionType) {
      record === null || record === void 0 ? void 0 : record.set(FN.secondFieldLov1, null);
      record === null || record === void 0 ? void 0 : record.set(FN.secondFieldShowField, null);
      if (!(MultipleRelationDs !== null && MultipleRelationDs !== void 0 && MultipleRelationDs.getState('secondFieldEditFlag'))) {
        record === null || record === void 0 ? void 0 : record.init(FN.firstField_1_Lov1, null);
        record === null || record === void 0 ? void 0 : record.init(FN.firstField_1_ShowField, null);
      }
    }
    if (name === FN.firstField_1_OptionType) {
      record === null || record === void 0 ? void 0 : record.set(FN.firstField_1_Lov1, null);
      record === null || record === void 0 ? void 0 : record.set(FN.firstField_1_ShowField, null);
    }
    if (name === FN.secondField_1_OptionType) {
      record === null || record === void 0 ? void 0 : record.set(FN.secondField_1_Lov1, null);
      record === null || record === void 0 ? void 0 : record.set(FN.secondField_1_ShowField, null);
    }
  });

  // 引用预置模板 阅览
  const handleExtendsDetail = () => {
    var _baseInfoDS$current16, _MultipleRelationDs$c23;
    _Modal.open({
      title: intl.get('hmde.bo.businessObject.tempView').d('模板字段预览'),
      style: {
        width: 702
      },
      key: _Modal.key(),
      closable: true,
      autoCenter: true,
      children: /*#__PURE__*/React.createElement(ShowExtendsFieldDetail, {
        domainId: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current16 = baseInfoDS.current) === null || _baseInfoDS$current16 === void 0 ? void 0 : _baseInfoDS$current16.get('domainId'),
        templateCodes: MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c23 = MultipleRelationDs.current) === null || _MultipleRelationDs$c23 === void 0 ? void 0 : _MultipleRelationDs$c23.get(FN.templateCodes)
      }),
      footer: (okBtn, cancelBtn) => /*#__PURE__*/React.createElement("div", null, cancelBtn)
    });
  };

  // 映射模板字段
  const extendsMappingDs = useMemo(() => new _DataSet(extendsMapDs(MultipleRelationDs, FN.checkedRelation)), []);
  useEffect(() => {
    var _MultipleRelationDs$c24;
    if (MultipleRelationDs !== null && MultipleRelationDs !== void 0 && (_MultipleRelationDs$c24 = MultipleRelationDs.current) !== null && _MultipleRelationDs$c24 !== void 0 && _MultipleRelationDs$c24.get(FN.physicalModelId)) {
      var _baseInfoDS$current17, _MultipleRelationDs$c25;
      extendsMappingDs.query(1, {
        domainId: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current17 = baseInfoDS.current) === null || _baseInfoDS$current17 === void 0 ? void 0 : _baseInfoDS$current17.get('domainId'),
        physicalModelId: MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c25 = MultipleRelationDs.current) === null || _MultipleRelationDs$c25 === void 0 ? void 0 : _MultipleRelationDs$c25.get(FN.physicalModelId),
        repeatFlag: false
      });
    }
  }, [MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c26 = MultipleRelationDs.current) === null || _MultipleRelationDs$c26 === void 0 ? void 0 : _MultipleRelationDs$c26.get(FN.physicalModelId)]);
  const handleExtendsList = () => {
    _Modal.open({
      title: intl.get('hmde.bo.businessObject.ysTempField').d('映射模板字段'),
      style: {
        width: 957
      },
      key: _Modal.key(),
      closable: true,
      autoCenter: true,
      children: /*#__PURE__*/React.createElement(ShowExtendsFieldList, {
        boFormDs: MultipleRelationDs,
        extendsMappingDs: extendsMappingDs,
        fieldName: FN.checkedRelation
      })
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, !saveDisabled ? /*#__PURE__*/React.createElement("div", {
    className: styles.multipleRelationBox
  }, /*#__PURE__*/React.createElement(_Form, {
    dataSet: MultipleRelationDs,
    columns: 2,
    labelLayout: "horizontal",
    labelAlign: "left",
    disabled: isEditMode
  }, /*#__PURE__*/React.createElement(_Lov, {
    name: FN.masterBusinessObject
  })), !!(MultipleRelationDs !== null && MultipleRelationDs !== void 0 && (_MultipleRelationDs$c27 = MultipleRelationDs.current) !== null && _MultipleRelationDs$c27 !== void 0 && _MultipleRelationDs$c27.get(FN.masterBusinessObjectId)) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Alert, {
    message: intl.get('hmde.bo.businessObject.multipleRelation.tips').d('维护关联当前对象与多选对象的中间对象信息及相关字段信息，即可创建两个对象的关联多选字段'),
    type: "info",
    showIcon: true,
    style: {
      marginTop: '12px'
    }
  }), /*#__PURE__*/React.createElement(_Collapse, {
    defaultActiveKey: ['1', '2'],
    bordered: false
  }, /*#__PURE__*/React.createElement(_Collapse.Panel, {
    header: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16,
        color: '#1e1e1e',
        fontWeight: 700
      }
    }, intl.get('hmde.bo.businessObject.midBoMes').d('中间对象信息')),
    key: "1",
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.title
  }, intl.get('hmde.bo.businessObject.boMes').d('对象信息')), /*#__PURE__*/React.createElement(_Form, {
    dataSet: MultipleRelationDs,
    columns: 2,
    labelLayout: "horizontal",
    labelAlign: "left",
    disabled: disabledFlag
  }, /*#__PURE__*/React.createElement(_IntlField, {
    type: "multipleLine",
    name: FN.midNameLanguage,
    maxLength: 60,
    showLengthInfo: true,
    resize: "none",
    autoSize: {
      minRows: 1,
      maxRows: 3
    }
  }), isEditMode ? /*#__PURE__*/React.createElement(_Output, {
    name: FN.midCode
  }) : /*#__PURE__*/React.createElement(_TextField, {
    name: FN.midCode,
    addonBefore: domainCode && /*#__PURE__*/React.createElement(_Tooltip, {
      title: domainCode
    }, domainCode),
    maxLength: 56 - domainCode.length,
    showLengthInfo: true
  }), /*#__PURE__*/React.createElement(_Output, {
    name: FN.publishStatus,
    colSpan: 2,
    renderer: ({
      record
    }) => {
      let str = intl.get('hmde.common.status.unpublished').d('未发布');
      switch (record === null || record === void 0 ? void 0 : record.get(FN.publishStatus)) {
        case 'MODIFIED':
          str = intl.get('hmde.common.status.modified').d('已修改');
          break;
        case 'PUBLISHED':
          str = intl.get('hmde.common.status.published').d('已发布');
          break;
        default:
          break;
      }
      return /*#__PURE__*/React.createElement(_Tag, null, str);
    }
  }), !isEditMode && /*#__PURE__*/React.createElement(_SelectBox, {
    name: FN.autoCreateFlag,
    disabled: isEditMode
  }, /*#__PURE__*/React.createElement(_SelectBox.Option, {
    value: false
  }, intl.get('hmde.common.link').d('关联')), /*#__PURE__*/React.createElement(_SelectBox.Option, {
    value: true
  }, intl.get('hmde.common.status.notRelation').d('未关联'))), (MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c28 = MultipleRelationDs.current) === null || _MultipleRelationDs$c28 === void 0 ? void 0 : (_MultipleRelationDs$c29 = _MultipleRelationDs$c28.get) === null || _MultipleRelationDs$c29 === void 0 ? void 0 : _MultipleRelationDs$c29.call(_MultipleRelationDs$c28, FN.autoCreateFlag)) && (extendFlag || flexFieldEnabledFlag) && !isEditMode && /*#__PURE__*/React.createElement(_SelectBox, {
    name: FN.refExtFieldFlag
  }, /*#__PURE__*/React.createElement(_SelectBox.Option, {
    value: true
  }, intl.get('hmde.common.yes').d('是')), /*#__PURE__*/React.createElement(_SelectBox.Option, {
    value: false
  }, intl.get('hmde.common.no').d('否'))), (MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c30 = MultipleRelationDs.current) === null || _MultipleRelationDs$c30 === void 0 ? void 0 : (_MultipleRelationDs$c31 = _MultipleRelationDs$c30.get) === null || _MultipleRelationDs$c31 === void 0 ? void 0 : _MultipleRelationDs$c31.call(_MultipleRelationDs$c30, FN.autoCreateFlag)) && !isEditMode && /*#__PURE__*/React.createElement(_Select, {
    name: FN.templateCodes,
    colSpan: 1,
    addonAfter: /*#__PURE__*/React.createElement(_Icon, {
      type: "visibility-o",
      style: {
        cursor: 'pointer'
      },
      onClick: handleExtendsDetail
    }),
    clearButton: false
  }, customTemplateDS === null || customTemplateDS === void 0 ? void 0 : customTemplateDS.map(v => /*#__PURE__*/React.createElement(_Select.Option, {
    key: v.get('templateName'),
    value: v.get('templateCode'),
    disabled: v.get('defaultFlag')
  }, v.get('templateName')))), !((_MultipleRelationDs$c32 = MultipleRelationDs.current) !== null && _MultipleRelationDs$c32 !== void 0 && (_MultipleRelationDs$c33 = _MultipleRelationDs$c32.get) !== null && _MultipleRelationDs$c33 !== void 0 && _MultipleRelationDs$c33.call(_MultipleRelationDs$c32, FN.autoCreateFlag)) && !isEditMode ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Lov, {
    name: FN.physicalModel,
    colSpan: 1
  }), extendFlag && /*#__PURE__*/React.createElement(_Lov, {
    name: FN.extPhysicalModel,
    colSpan: 1
  }), /*#__PURE__*/React.createElement(_Button, {
    name: FN.checkedRelation,
    disabled: !(MultipleRelationDs !== null && MultipleRelationDs !== void 0 && (_MultipleRelationDs$c34 = MultipleRelationDs.current) !== null && _MultipleRelationDs$c34 !== void 0 && _MultipleRelationDs$c34.get(FN.physicalModelId)),
    icon: "edit-o",
    onClick: handleExtendsList,
    style: {
      width: 'auto'
    },
    className: `${styles['error-button']}`
  }, intl.get('hmde.bo.businessObject.setMapping').d('设置映射'))) : /*#__PURE__*/React.createElement(React.Fragment, null, isEditMode ? /*#__PURE__*/React.createElement(_Output, {
    name: FN.physicalModelName
  }) : /*#__PURE__*/React.createElement(_TextField, {
    name: FN.physicalModelName,
    colSpan: 1,
    maxLength: 56,
    showLengthInfo: true,
    disabled: isEditMode
  }), extendFlag && (isEditMode ? /*#__PURE__*/React.createElement(_Output, {
    name: FN.extendsTableName
  }) : /*#__PURE__*/React.createElement(_TextField, {
    name: FN.extendsTableName,
    colSpan: 1,
    maxLength: 60,
    showLengthInfo: true,
    disabled: isEditMode
  }))), isEditMode ? /*#__PURE__*/React.createElement(_Output, {
    name: FN.customPrimaryKeyCode
  }) : /*#__PURE__*/React.createElement(_TextField, {
    name: FN.customPrimaryKeyCode,
    colSpan: 1,
    maxLength: 60,
    showLengthInfo: true,
    disabled: !((_MultipleRelationDs$c35 = MultipleRelationDs.current) !== null && _MultipleRelationDs$c35 !== void 0 && (_MultipleRelationDs$c36 = _MultipleRelationDs$c35.get) !== null && _MultipleRelationDs$c36 !== void 0 && _MultipleRelationDs$c36.call(_MultipleRelationDs$c35, FN.autoCreateFlag))
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.title
  }, intl.get('hmde.bo.businessObject.fieldMes1').d('关联当前对象的从主字段信息')), /*#__PURE__*/React.createElement(_Form, {
    dataSet: MultipleRelationDs,
    columns: 2,
    labelLayout: "horizontal",
    labelAlign: "left",
    disabled: disabledFlag
  }, /*#__PURE__*/React.createElement(_IntlField, {
    name: FN.firstFieldNameLanguage
  }), isEditMode ? /*#__PURE__*/React.createElement(_Output, {
    name: FN.firstFieldCode
  }) : MultipleRelationDs !== null && MultipleRelationDs !== void 0 && (_MultipleRelationDs$c37 = MultipleRelationDs.current) !== null && _MultipleRelationDs$c37 !== void 0 && _MultipleRelationDs$c37.get(FN.autoCreateFlag) ? /*#__PURE__*/React.createElement(_TextField, {
    name: FN.firstFieldCode,
    addonBefore: extendFieldPrefixRule && /*#__PURE__*/React.createElement(_Tooltip, {
      title: extendFieldPrefixRule
    }, extendFieldPrefixRule)
  }) : /*#__PURE__*/React.createElement(_Select, {
    name: FN.firstFieldCode
  }), /*#__PURE__*/React.createElement(_Output, {
    label: intl.get('hmde.common.relevanceObject').d('关联对象'),
    renderer: () => {
      var _baseInfoDS$current18;
      return baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current18 = baseInfoDS.current) === null || _baseInfoDS$current18 === void 0 ? void 0 : _baseInfoDS$current18.get('businessObjectName');
    }
  }), /*#__PURE__*/React.createElement(_Select, {
    name: FN.firstFieldOptionType
  }), /*#__PURE__*/React.createElement(_Lov, {
    name: FN.firstFieldLov1
  }), (MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c38 = MultipleRelationDs.current) === null || _MultipleRelationDs$c38 === void 0 ? void 0 : _MultipleRelationDs$c38.get(FN.firstFieldOptionType)) !== 'BUSINESS_OBJECT_OPTION' && /*#__PURE__*/React.createElement(_Lov, {
    name: FN.firstFieldShowField
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.title
  }, `${intl.get('hmde.bo.businessObject.fieldMesStart').d('关联业务对象')}
                        【${(MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c39 = MultipleRelationDs.current) === null || _MultipleRelationDs$c39 === void 0 ? void 0 : _MultipleRelationDs$c39.get(FN.masterBusinessObjectName)) || ''}】
                        ${intl.get('hmde.bo.businessObject.fieldMesEnd').d('的从主字段信息')}`), /*#__PURE__*/React.createElement(_Form, {
    dataSet: MultipleRelationDs,
    columns: 2,
    labelLayout: "horizontal",
    labelAlign: "left",
    disabled: disabledFlag
  }, /*#__PURE__*/React.createElement(_IntlField, {
    name: FN.secondFieldNameLanguage
  }), isEditMode ? /*#__PURE__*/React.createElement(_Output, {
    name: FN.secondFieldCode
  }) : MultipleRelationDs !== null && MultipleRelationDs !== void 0 && (_MultipleRelationDs$c40 = MultipleRelationDs.current) !== null && _MultipleRelationDs$c40 !== void 0 && _MultipleRelationDs$c40.get(FN.autoCreateFlag) ? /*#__PURE__*/React.createElement(_TextField, {
    name: FN.secondFieldCode,
    addonBefore: linkFieldExtendFieldPrefixRule && /*#__PURE__*/React.createElement(_Tooltip, {
      title: linkFieldExtendFieldPrefixRule
    }, linkFieldExtendFieldPrefixRule)
  }) : /*#__PURE__*/React.createElement(_Select, {
    name: FN.secondFieldCode
  }), /*#__PURE__*/React.createElement(_Output, {
    label: intl.get('hmde.common.relevanceObject').d('关联对象'),
    renderer: () => {
      var _MultipleRelationDs$c41;
      return MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c41 = MultipleRelationDs.current) === null || _MultipleRelationDs$c41 === void 0 ? void 0 : _MultipleRelationDs$c41.get(FN.masterBusinessObjectName);
    }
  }), /*#__PURE__*/React.createElement(_Select, {
    name: FN.secondFieldOptionType
  }), /*#__PURE__*/React.createElement(_Lov, {
    name: FN.secondFieldLov1
  }), (MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c42 = MultipleRelationDs.current) === null || _MultipleRelationDs$c42 === void 0 ? void 0 : _MultipleRelationDs$c42.get(FN.secondFieldOptionType)) !== 'BUSINESS_OBJECT_OPTION' && /*#__PURE__*/React.createElement(_Lov, {
    name: FN.secondFieldShowField
  }))), /*#__PURE__*/React.createElement(_Collapse.Panel, {
    header: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16,
        color: '#1e1e1e',
        fontWeight: 700
      }
    }, intl.get('hmde.bo.businessObject.mulFieldMes').d('关联多选字段信息')),
    key: "2",
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.title
  }, intl.get('hmde.bo.businessObject.curMulFieldMes').d('当前对象的关联多选字段信息')), /*#__PURE__*/React.createElement(_Form, {
    dataSet: MultipleRelationDs,
    columns: 2,
    labelLayout: "horizontal",
    labelAlign: "left",
    disabled: disabledFlag
  }, /*#__PURE__*/React.createElement(_IntlField, {
    name: FN.firstField_1_NameLanguage
  }), /*#__PURE__*/React.createElement(_TextField, {
    name: FN.firstField_1_Code,
    addonBefore: linkFieldExtendFieldPrefixRule && /*#__PURE__*/React.createElement(_Tooltip, {
      title: linkFieldExtendFieldPrefixRule
    }, linkFieldExtendFieldPrefixRule)
  }), /*#__PURE__*/React.createElement(_Output, {
    label: intl.get('hmde.common.relevanceObject').d('关联对象'),
    renderer: () => {
      var _MultipleRelationDs$c43;
      return MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c43 = MultipleRelationDs.current) === null || _MultipleRelationDs$c43 === void 0 ? void 0 : _MultipleRelationDs$c43.get(FN.masterBusinessObjectName);
    }
  }), /*#__PURE__*/React.createElement(_Select, {
    name: FN.firstField_1_OptionType
  }), /*#__PURE__*/React.createElement(_Lov, {
    name: FN.firstField_1_Lov1
  }), (MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c44 = MultipleRelationDs.current) === null || _MultipleRelationDs$c44 === void 0 ? void 0 : _MultipleRelationDs$c44.get(FN.firstField_1_OptionType)) !== 'BUSINESS_OBJECT_OPTION' && /*#__PURE__*/React.createElement(_Lov, {
    name: FN.firstField_1_ShowField
  }), /*#__PURE__*/React.createElement(_Switch, {
    name: FN.firstField_1_MasterRequiredFlag
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.title
  }, `${intl.get('hmde.common.busniessObject').d('业务对象')}
                        【${(MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c45 = MultipleRelationDs.current) === null || _MultipleRelationDs$c45 === void 0 ? void 0 : _MultipleRelationDs$c45.get(FN.masterBusinessObjectName)) || ''}】
                        ${intl.get('hmde.bo.businessObject.fieldMesNewEnd').d('的关联多选字段信息')}`), /*#__PURE__*/React.createElement(_Form, {
    dataSet: MultipleRelationDs,
    columns: 2,
    labelLayout: "horizontal",
    labelAlign: "left",
    disabled: disabledFlag
  }, /*#__PURE__*/React.createElement(_IntlField, {
    name: FN.secondField_1_NameLanguage
  }), /*#__PURE__*/React.createElement(_TextField, {
    name: FN.secondField_1_Code,
    addonBefore: extendFieldPrefixRule && /*#__PURE__*/React.createElement(_Tooltip, {
      title: extendFieldPrefixRule
    }, extendFieldPrefixRule)
  }), /*#__PURE__*/React.createElement(_Output, {
    label: intl.get('hmde.common.relevanceObject').d('关联对象'),
    renderer: () => {
      var _baseInfoDS$current19;
      return baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current19 = baseInfoDS.current) === null || _baseInfoDS$current19 === void 0 ? void 0 : _baseInfoDS$current19.get('businessObjectName');
    }
  }), /*#__PURE__*/React.createElement(_Select, {
    name: FN.secondField_1_OptionType
  }), /*#__PURE__*/React.createElement(_Lov, {
    name: FN.secondField_1_Lov1
  }), (MultipleRelationDs === null || MultipleRelationDs === void 0 ? void 0 : (_MultipleRelationDs$c46 = MultipleRelationDs.current) === null || _MultipleRelationDs$c46 === void 0 ? void 0 : _MultipleRelationDs$c46.get(FN.secondField_1_OptionType)) !== 'BUSINESS_OBJECT_OPTION' && /*#__PURE__*/React.createElement(_Lov, {
    name: FN.secondField_1_ShowField
  }), /*#__PURE__*/React.createElement(_Switch, {
    name: FN.secondField_1_MasterRequiredFlag
  })))))) : /*#__PURE__*/React.createElement(Empty, {
    title: intl.get('hmde.bo.businessObject.saveDisabledTips').d('需先发布当前对象，才可维护关联关系多选字段')
  }));
};
export default observer(App);