import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Alert from "@hzero-front-ui/c7n-ui/lib/Alert";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
/*
 * @Descripttion: 业务对象详情基础信息维护界面
 * @Date: 2021-08-05 10:10:51
 * @Author: ZHIJIAN.XU@HAND-CHINA.COM
 * @version: 0.0.1
 * @copyright: Copyright (c) 2021, Hand
 */
import React, { useEffect } from 'react';
import intl from 'utils/intl';
import { observer } from 'mobx-react-lite';
import { isTenantRoleLevel } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { ButtonType, ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { SourceType } from "hzero-front-apaas/lib/constants/businessObject";
import LovToBoDetail from "hzero-front-hmde/lib/businessComponents/LovToBoDetail";
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
import { renderModalConfirm } from "hzero-front-apaas/lib/utils/render";
import notification from 'utils/notification';
import styles from "./index.less?modules";
const RelationDetail = ({
  relationDetailDS,
  tableDS,
  extendTableDS,
  sourceType,
  readOnlyFlag
}) => {
  var _boStore$getState, _boStore$getState$cur, _middleLinkBusinessOb, _middleLinkBusinessOb2, _middleLinkBusinessOb3, _middleLinkBusinessOb4, _middleLinkBusinessOb5, _middleLinkBusinessOb6, _middleLinkBusinessOb7, _middleLinkBusinessOb8, _middleLinkBusinessOb9, _middleLinkBusinessOb10, _middleLinkBusinessOb11, _middleLinkBusinessOb12, _middleLinkBusinessOb13, _middleLinkBusinessOb14, _middleLinkBusinessOb15, _middleLinkBusinessOb16, _middleLinkBusinessOb17, _middleLinkBusinessOb18, _middleLinkBusinessOb19, _middleLinkBusinessOb20;
  const boStore = useBoStore();
  const middleLinkBusinessObjects = boStore === null || boStore === void 0 ? void 0 : (_boStore$getState = boStore.getState('baseInfoDS')) === null || _boStore$getState === void 0 ? void 0 : (_boStore$getState$cur = _boStore$getState.current) === null || _boStore$getState$cur === void 0 ? void 0 : _boStore$getState$cur.get('middleLinkBusinessObjects');
  useEffect(() => {
    relationDetailDS.query();
  }, []);
  relationDetailDS.addEventListener('update', ({
    record,
    name,
    value
  }) => {
    if (name === 'first') {
      const temp = (record === null || record === void 0 ? void 0 : record.get('second')) || {};
      if (temp.businessObjectCode === (value === null || value === void 0 ? void 0 : value.businessObjectCode)) {
        // 不能选择相同的目标对象
        record === null || record === void 0 ? void 0 : record.set(name, null);
      }
    }
    if (name === 'second') {
      const temp = record === null || record === void 0 ? void 0 : record.get('first');
      if (temp.businessObjectCode === (value === null || value === void 0 ? void 0 : value.businessObjectCode)) {
        // 不能选择相同的目标对象
        record === null || record === void 0 ? void 0 : record.set(name, null);
      }
    }
  });

  // 保存
  const handleSave = () => {
    relationDetailDS.submit(false).then(() => {
      // 成功
      relationDetailDS.query();
      tableDS.query();
      if (!isTenantRoleLevel()) {
        extendTableDS.query();
      }
    }).catch(errMessage => {
      notification.error({
        message: errMessage === null || errMessage === void 0 ? void 0 : errMessage.message
      });
      relationDetailDS.reset();
    });
  };

  // 如果【目标对象】没有改动，那就不允许随便编辑【名称】和【编码】
  const editCodeNameAble = name => {
    var _relationDetailDS$cur, _relationDetailDS$cur2, _relationDetailDS$cur3, _relationDetailDS$cur4;
    // 判断现有值和原始值
    return (relationDetailDS === null || relationDetailDS === void 0 ? void 0 : (_relationDetailDS$cur = relationDetailDS.current) === null || _relationDetailDS$cur === void 0 ? void 0 : (_relationDetailDS$cur2 = _relationDetailDS$cur.getPristineValue(name)) === null || _relationDetailDS$cur2 === void 0 ? void 0 : _relationDetailDS$cur2.businessObjectCode) === (relationDetailDS === null || relationDetailDS === void 0 ? void 0 : (_relationDetailDS$cur3 = relationDetailDS.current) === null || _relationDetailDS$cur3 === void 0 ? void 0 : (_relationDetailDS$cur4 = _relationDetailDS$cur3.get(name)) === null || _relationDetailDS$cur4 === void 0 ? void 0 : _relationDetailDS$cur4.businessObjectCode);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: styles['header-text-wrap']
  }, /*#__PURE__*/React.createElement("h3", {
    className: styles.title
  }, intl.get('hmde.bo.businessObject.relationConfig').d('对象关系配置')), !middleLinkBusinessObjects && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Button, {
    disabled: !relationDetailDS.dirty,
    onClick: () => relationDetailDS.reset()
  }, intl.get('hmde.common.reset').d('重置')), /*#__PURE__*/React.createElement(_Button, {
    color: "primary",
    type: "submit",
    disabled: !relationDetailDS.dirty || readOnlyFlag,
    onClick: async () => {
      const res = await relationDetailDS.validate();
      if (!res) return;
      renderModalConfirm(intl.get('hmde.bo.businessObject.middleConfirm').d('修改对象关系配置后，可能会对已有数据记录造成影响，是否确定修改？'), {
        title: intl.get('hmde.common.isSave').d('是否保存'),
        onOk: () => handleSave()
      });
    }
  }, intl.get('hmde.common.button.save').d('保存')))), middleLinkBusinessObjects && /*#__PURE__*/React.createElement(_Alert, {
    message: /*#__PURE__*/React.createElement(React.Fragment, null, intl.get('hmde.bo.businessObject.middleDisabledTips1').d('该中间对象由对象'), "\u3010", middleLinkBusinessObjects === null || middleLinkBusinessObjects === void 0 ? void 0 : (_middleLinkBusinessOb = middleLinkBusinessObjects[0]) === null || _middleLinkBusinessOb === void 0 ? void 0 : (_middleLinkBusinessOb2 = _middleLinkBusinessOb.first) === null || _middleLinkBusinessOb2 === void 0 ? void 0 : _middleLinkBusinessOb2.businessObjectName, "\uFF08", middleLinkBusinessObjects === null || middleLinkBusinessObjects === void 0 ? void 0 : (_middleLinkBusinessOb3 = middleLinkBusinessObjects[0]) === null || _middleLinkBusinessOb3 === void 0 ? void 0 : (_middleLinkBusinessOb4 = _middleLinkBusinessOb3.first) === null || _middleLinkBusinessOb4 === void 0 ? void 0 : _middleLinkBusinessOb4.businessObjectCode, "\uFF09\u3011", intl.get('hmde.bo.businessObject.middleDisabledTips2').d('的关联关系（多）字段'), "\u3010", middleLinkBusinessObjects === null || middleLinkBusinessObjects === void 0 ? void 0 : (_middleLinkBusinessOb5 = middleLinkBusinessObjects[0]) === null || _middleLinkBusinessOb5 === void 0 ? void 0 : (_middleLinkBusinessOb6 = _middleLinkBusinessOb5.firstFieldList) === null || _middleLinkBusinessOb6 === void 0 ? void 0 : (_middleLinkBusinessOb7 = _middleLinkBusinessOb6[0]) === null || _middleLinkBusinessOb7 === void 0 ? void 0 : _middleLinkBusinessOb7.fieldName, "\uFF08", middleLinkBusinessObjects === null || middleLinkBusinessObjects === void 0 ? void 0 : (_middleLinkBusinessOb8 = middleLinkBusinessObjects[0]) === null || _middleLinkBusinessOb8 === void 0 ? void 0 : (_middleLinkBusinessOb9 = _middleLinkBusinessOb8.firstFieldList) === null || _middleLinkBusinessOb9 === void 0 ? void 0 : (_middleLinkBusinessOb10 = _middleLinkBusinessOb9[0]) === null || _middleLinkBusinessOb10 === void 0 ? void 0 : _middleLinkBusinessOb10.fieldCode, "\uFF09\u3011", intl.get('hmde.bo.businessObject.middleDisabledTips3').d('所创建，若需修改关联对象，请至对象'), "\u3010", middleLinkBusinessObjects === null || middleLinkBusinessObjects === void 0 ? void 0 : (_middleLinkBusinessOb11 = middleLinkBusinessObjects[0]) === null || _middleLinkBusinessOb11 === void 0 ? void 0 : (_middleLinkBusinessOb12 = _middleLinkBusinessOb11.first) === null || _middleLinkBusinessOb12 === void 0 ? void 0 : _middleLinkBusinessOb12.businessObjectName, "\uFF08", middleLinkBusinessObjects === null || middleLinkBusinessObjects === void 0 ? void 0 : (_middleLinkBusinessOb13 = middleLinkBusinessObjects[0]) === null || _middleLinkBusinessOb13 === void 0 ? void 0 : (_middleLinkBusinessOb14 = _middleLinkBusinessOb13.first) === null || _middleLinkBusinessOb14 === void 0 ? void 0 : _middleLinkBusinessOb14.businessObjectCode, "\uFF09\u3011", intl.get('hmde.bo.businessObject.middleDisabledTips2').d('的关联关系（多）字段'), "\u3010", middleLinkBusinessObjects === null || middleLinkBusinessObjects === void 0 ? void 0 : (_middleLinkBusinessOb15 = middleLinkBusinessObjects[0]) === null || _middleLinkBusinessOb15 === void 0 ? void 0 : (_middleLinkBusinessOb16 = _middleLinkBusinessOb15.firstFieldList) === null || _middleLinkBusinessOb16 === void 0 ? void 0 : (_middleLinkBusinessOb17 = _middleLinkBusinessOb16[0]) === null || _middleLinkBusinessOb17 === void 0 ? void 0 : _middleLinkBusinessOb17.fieldName, "\uFF08", middleLinkBusinessObjects === null || middleLinkBusinessObjects === void 0 ? void 0 : (_middleLinkBusinessOb18 = middleLinkBusinessObjects[0]) === null || _middleLinkBusinessOb18 === void 0 ? void 0 : (_middleLinkBusinessOb19 = _middleLinkBusinessOb18.firstFieldList) === null || _middleLinkBusinessOb19 === void 0 ? void 0 : (_middleLinkBusinessOb20 = _middleLinkBusinessOb19[0]) === null || _middleLinkBusinessOb20 === void 0 ? void 0 : _middleLinkBusinessOb20.fieldCode, "\uFF09\u3011", intl.get('hmde.common.edit').d('修改')),
    type: "info",
    showIcon: true,
    style: {
      marginBottom: '12px'
    }
  }), /*#__PURE__*/React.createElement(_Form, {
    dataSet: relationDetailDS,
    columns: 3,
    disabled: isTenantRoleLevel() && sourceType === SourceType.PLATFORM || readOnlyFlag
  }, /*#__PURE__*/React.createElement(LovToBoDetail, {
    name: "first",
    record: relationDetailDS === null || relationDetailDS === void 0 ? void 0 : relationDetailDS.current,
    tooltip: 'none',
    style: {
      width: '100%'
    },
    clearButton: false,
    disabled: !!middleLinkBusinessObjects
  }), /*#__PURE__*/React.createElement(LovToBoDetail, {
    name: "second",
    record: relationDetailDS === null || relationDetailDS === void 0 ? void 0 : relationDetailDS.current,
    style: {
      width: '100%'
    },
    tooltip: 'none',
    clearButton: false,
    disabled: !!middleLinkBusinessObjects
  }), /*#__PURE__*/React.createElement(_TextField, {
    newLine: true,
    name: "name1",
    disabled: editCodeNameAble('first'),
    placeholder: intl.get('hmde.common.fieldName').d('字段名称')
  }), /*#__PURE__*/React.createElement(_TextField, {
    name: "name2",
    disabled: editCodeNameAble('second'),
    placeholder: intl.get('hmde.common.fieldName').d('字段名称')
  }), /*#__PURE__*/React.createElement(_TextField, {
    newLine: true,
    name: "value1",
    showLengthInfo: true,
    disabled: editCodeNameAble('first'),
    placeholder: intl.get('hmde.common.fieldCode').d('字段编码')
  }), /*#__PURE__*/React.createElement(_TextField, {
    name: "value2",
    showLengthInfo: true,
    disabled: editCodeNameAble('second'),
    placeholder: intl.get('hmde.common.fieldCode').d('字段编码')
  })));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(RelationDetail));