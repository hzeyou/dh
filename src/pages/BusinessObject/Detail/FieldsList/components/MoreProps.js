import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Tag from "@hzero-front-ui/c7n-ui/lib/Tag";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _extends from "@babel/runtime/helpers/esm/extends";
import _useModal from "choerodon-ui/pro/lib/use-modal";
import React from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';
import AddAndEditField from "hzero-front-hmde/lib/routes/BusinessObject/Detail/FieldsList/AddAndEditField";
import { handleCheckError } from "../utils";
const MorePropsIcon = ({
  record,
  baseInfoDS,
  type,
  addAndEditFieldProps,
  tenantSqlObjectDisabled
}) => {
  var _baseInfoDS$current;
  const Modal = _useModal();
  const errorFlag = handleCheckError({
    records: [record],
    isSql: (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('physicalModelType')) === 'SQL'
  }) && (record === null || record === void 0 ? void 0 : record.getState('showErrorMes'));
  const openFIeldDetail = r => {
    let props = {};
    if (type === 'domain') {
      props = {
        ...addAndEditFieldProps,
        // 快速新建进去的
        templateFieldId: record === null || record === void 0 ? void 0 : record.get('templateFieldId'),
        fastCreateEnter: true,
        fastCreateEnterRecord: r,
        fastCreateEnterIsEidt: true
      };
    } else {
      var _record$dataSet, _record$dataSet$filte, _record$dataSet$filte2, _baseInfoDS$current2, _baseInfoDS$current3, _baseInfoDS$current4, _baseInfoDS$current5, _baseInfoDS$current6, _baseInfoDS$current7, _baseInfoDS$current8;
      // 快速新建 的时候 引用字段 需要选到 未创建成功的 关系字段
      const noSaveRelationFieldList = (record === null || record === void 0 ? void 0 : (_record$dataSet = record.dataSet) === null || _record$dataSet === void 0 ? void 0 : (_record$dataSet$filte = _record$dataSet.filter(v => !(v !== null && v !== void 0 && v.get('businessObjectFieldId')) && [FieldComponentType.LINK_RELATION, FieldComponentType.MASTER_RELATION].includes(v === null || v === void 0 ? void 0 : v.get('componentType')) && (v === null || v === void 0 ? void 0 : v.get('masterBusinessObjectCode')))) === null || _record$dataSet$filte === void 0 ? void 0 : (_record$dataSet$filte2 = _record$dataSet$filte.map) === null || _record$dataSet$filte2 === void 0 ? void 0 : _record$dataSet$filte2.call(_record$dataSet$filte, v => {
        var _v$toData;
        return v === null || v === void 0 ? void 0 : (_v$toData = v.toData) === null || _v$toData === void 0 ? void 0 : _v$toData.call(v);
      })) || [];
      props = {
        boSourceType: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : _baseInfoDS$current2.get('sourceType'),
        fieldType: r === null || r === void 0 ? void 0 : r.get('sourceType'),
        businessObjectId: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current3 = baseInfoDS.current) === null || _baseInfoDS$current3 === void 0 ? void 0 : _baseInfoDS$current3.get('businessObjectId'),
        businessObjectCode: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current4 = baseInfoDS.current) === null || _baseInfoDS$current4 === void 0 ? void 0 : _baseInfoDS$current4.get('businessObjectCode'),
        middleBusinessObjFlag: false,
        domainEnabledFlag: false,
        extendFieldCreatedFlag: false,
        extendFieldPrefixRule: baseInfoDS !== null && baseInfoDS !== void 0 && (_baseInfoDS$current5 = baseInfoDS.current) !== null && _baseInfoDS$current5 !== void 0 && _baseInfoDS$current5.get('extendFieldPrefixRule') ? JSON.parse(baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current6 = baseInfoDS.current) === null || _baseInfoDS$current6 === void 0 ? void 0 : _baseInfoDS$current6.get('extendFieldPrefixRule')) : '',
        businessObjectName: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current7 = baseInfoDS.current) === null || _baseInfoDS$current7 === void 0 ? void 0 : _baseInfoDS$current7.get('businessObjectName'),
        physicalModelType: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current8 = baseInfoDS.current) === null || _baseInfoDS$current8 === void 0 ? void 0 : _baseInfoDS$current8.get('physicalModelType'),
        businessObjectFieldId: r === null || r === void 0 ? void 0 : r.get('businessObjectFieldId'),
        inheritFieldId: r === null || r === void 0 ? void 0 : r.get('inheritFieldId'),
        // 快速新建进去的
        fastCreateEnter: true,
        fastCreateEnterRecord: r,
        fastCreateEnterIsEidt: !!(r !== null && r !== void 0 && r.getState('editing')),
        outComponentType: r === null || r === void 0 ? void 0 : r.get('componentType'),
        noSaveRelationFieldList: (r === null || r === void 0 ? void 0 : r.get('componentType')) === FieldComponentType.REFERENCE_FIELD ? noSaveRelationFieldList : []
      };
    }
    Modal.open({
      title: intl.get('hmde.common.view.moreProp').d('更多属性'),
      style: {
        width: 957
      },
      closable: true,
      autoCenter: true,
      children: /*#__PURE__*/React.createElement(AddAndEditField, _extends({
        tenantSqlObjectDisabled: tenantSqlObjectDisabled
      }, props)),
      footer: (okBtn, cancelBtn) => /*#__PURE__*/React.createElement(React.Fragment, null, cancelBtn, ((r === null || r === void 0 ? void 0 : r.getState('editing')) || tenantSqlObjectDisabled) && okBtn)
    });
  };
  return /*#__PURE__*/React.createElement(_Tooltip, {
    title: errorFlag ? intl.get('hmde.bo.businessObject.fieldPropsCheck').d('存在必输项未配置') : '',
    theme: "dark"
  }, /*#__PURE__*/React.createElement(_Button, {
    funcType: "link",
    icon: "settings-o",
    style: errorFlag ? {
      color: '#f23a50'
    } : {},
    onClick: () => openFIeldDetail(record)
  }), errorFlag && /*#__PURE__*/React.createElement(_Tag, {
    color: "red"
  }, intl.get('hmde.bo.businessObject.isnoset').d('未设置')));
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(MorePropsIcon));