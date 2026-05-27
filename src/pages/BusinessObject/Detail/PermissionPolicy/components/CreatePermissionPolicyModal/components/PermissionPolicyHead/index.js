import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _extends from "@babel/runtime/helpers/esm/extends";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _IntlField from "@hzero-front-ui/c7n-ui/lib/IntlFieldPro";
import _isBoolean from "lodash/isBoolean";
import _isArray from "lodash/isArray";
import React from 'react';
import intl from 'utils/intl';
import { observer } from 'mobx-react-lite';
import { isTenantRoleLevel } from 'utils/utils';
import { FieldsNameTypes } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionPolicyDS";
import PlatformOrTenantTag from "hzero-front-hmde/lib/routes/BusinessObject/Detail/PermissionPolicy/components/PlatformOrTenantTag";
/**
 * 权限策略头部
 * @param isModify
 * @param dataSet
 * @param formProps
 * @param readOnly
 * @param disabled
 * @constructor
 */
const PermissionPolicyHead = ({
  isModify,
  dataSet,
  formProps,
  readOnly,
  disabled
}) => {
  const renderFormContent = () => {
    var _dataSet$current;
    // form 每一项属性
    const editableFormItems = [{
      render: _IntlField,
      props: {
        name: FieldsNameTypes.NAME,
        key: FieldsNameTypes.NAME,
        showLengthInfo: true
      }
    }, {
      render: _TextField,
      props: {
        addonBefore: (_dataSet$current = dataSet.current) === null || _dataSet$current === void 0 ? void 0 : _dataSet$current.get(FieldsNameTypes.CODE_PREFIX),
        name: FieldsNameTypes.CODE,
        key: FieldsNameTypes.CODE,
        showLengthInfo: true
      }
    }, {
      render: _Output,
      props: {
        name: FieldsNameTypes.TYPE,
        key: FieldsNameTypes.TYPE,
        renderer: () => {
          return /*#__PURE__*/React.createElement(PlatformOrTenantTag, {
            isTenant: !isTenantRoleLevel()
          });
        }
      }
    }, {
      render: _IntlField,
      props: {
        name: FieldsNameTypes.DESCRIPTION,
        key: FieldsNameTypes.DESCRIPTION,
        type: 'multipleLine',
        placeholder: intl.get('hmde.common.pleaseInput').d('请输入')
      }
    }];
    return editableFormItems.map(item => {
      // 如果是默认修改并且非只读,可修改 仅对主对象生效
      let isReadonly = _isBoolean(readOnly) && readOnly || _isArray(readOnly) && readOnly.includes(item.props.name);
      if (item.props.name === FieldsNameTypes.ONLY_MASTER_FLAG && isModify && !isReadonly) {
        return /*#__PURE__*/React.createElement(item.render, item.props);
      }
      isReadonly = isModify || isReadonly;
      if (isReadonly) {
        return /*#__PURE__*/React.createElement(_Output, _extends({
          key: item.props.name
        }, item.props));
      } else {
        return /*#__PURE__*/React.createElement(item.render, item.props);
      }
    });
  };
  return /*#__PURE__*/React.createElement(_Form, _extends({
    labelWidth: "auto",
    dataSet: dataSet,
    disabled: disabled
    // useColon={false}
    ,
    columns: 1
  }, formProps), renderFormContent());
};
export default observer(PermissionPolicyHead);