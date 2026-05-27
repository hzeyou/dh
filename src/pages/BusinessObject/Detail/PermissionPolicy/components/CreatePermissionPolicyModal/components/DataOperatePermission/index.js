import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _extends from "@babel/runtime/helpers/esm/extends";
import _SelectBox from "@hzero-front-ui/c7n-ui/lib/SelectBoxPro";
import React, { useMemo } from 'react';
import intl from 'utils/intl';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
import { FieldsNameTypes } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionPolicyDS";
import { rendererDataPermissions } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/PermissionPolicy/utils/form";
import { PhysicalModelType } from "hzero-front-hmde/lib/constants/businessObject";
const Option = _SelectBox.Option;
const DataOperatePermission = ({
  dataSet,
  readOnly
}) => {
  const boStore = useBoStore();
  const baseInfoDs = boStore === null || boStore === void 0 ? void 0 : boStore.getState('baseInfoDS');
  useDataSetEvents(dataSet, 'update', ({
    dataSet: ds
  }) => {
    var _ds$current;
    const dataSelected = toJS((_ds$current = ds.current) === null || _ds$current === void 0 ? void 0 : _ds$current.get(FieldsNameTypes.DATA_PERMISSION));
    // 如果勾选了编辑或删除,强制勾选查询
    if (dataSelected.includes(FieldsNameTypes.DATA_DELETE) || dataSelected.includes(FieldsNameTypes.DATA_EDIT)) {
      var _ds$current2;
      if (!dataSelected.includes(FieldsNameTypes.DATA_GET)) {
        dataSelected.push(FieldsNameTypes.DATA_GET);
      }
      (_ds$current2 = ds.current) === null || _ds$current2 === void 0 ? void 0 : _ds$current2.set(FieldsNameTypes.DATA_PERMISSION, dataSelected);
    }
  });
  const renderFormContent = useMemo(() => {
    var _baseInfoDs$current;
    const optionMap = {
      [FieldsNameTypes.DATA_ADD]: /*#__PURE__*/React.createElement(Option, {
        value: FieldsNameTypes.DATA_ADD,
        key: FieldsNameTypes.DATA_ADD,
        disabled: true
      }, intl.get('hmde.common.button.create').d('新建')),
      [FieldsNameTypes.DATA_GET]: /*#__PURE__*/React.createElement(Option, {
        value: FieldsNameTypes.DATA_GET,
        key: FieldsNameTypes.DATA_GET
      }, intl.get('hmde.common.button.query').d('查询')),
      [FieldsNameTypes.DATA_EDIT]: /*#__PURE__*/React.createElement(Option, {
        value: FieldsNameTypes.DATA_EDIT,
        key: FieldsNameTypes.DATA_EDIT
      }, intl.get('hmde.common.button.edit').d('编辑')),
      [FieldsNameTypes.DATA_DELETE]: /*#__PURE__*/React.createElement(Option, {
        value: FieldsNameTypes.DATA_DELETE,
        key: FieldsNameTypes.DATA_DELETE
      }, intl.get('hmde.common.button.delete').d('删除'))
    };
    const physicalModelType = baseInfoDs === null || baseInfoDs === void 0 ? void 0 : (_baseInfoDs$current = baseInfoDs.current) === null || _baseInfoDs$current === void 0 ? void 0 : _baseInfoDs$current.get('physicalModelType');
    const physicalModelTypeMap = {
      [PhysicalModelType.SQL]: [FieldsNameTypes.DATA_GET]
    };
    const editableFormItemsChildren = (physicalModelTypeMap[physicalModelType] || [FieldsNameTypes.DATA_ADD, FieldsNameTypes.DATA_GET, FieldsNameTypes.DATA_EDIT, FieldsNameTypes.DATA_DELETE]).map(key => optionMap[key]);

    // form 每一项属性
    const editableFormItems = [{
      render: _SelectBox,
      children: editableFormItemsChildren,
      props: {
        name: FieldsNameTypes.DATA_PERMISSION,
        showHelp: 'label',
        key: FieldsNameTypes.DATA_PERMISSION,
        renderer: readOnly ? rendererDataPermissions : undefined
      }
    }];
    return editableFormItems.map(item => {
      if (readOnly) {
        return /*#__PURE__*/React.createElement(_Output, _extends({
          key: item.props.name
        }, item.props));
      } else {
        return /*#__PURE__*/React.createElement(item.render, item.props, item.children);
      }
    });
  }, []);
  return /*#__PURE__*/React.createElement(_Form, {
    labelWidth: 110,
    dataSet: dataSet
    // useColon={false}
    ,
    columns: 1
  }, renderFormContent);
};
export default observer(DataOperatePermission);