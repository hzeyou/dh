import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _useModal from "choerodon-ui/pro/lib/use-modal";
import _isUndefined from "lodash/isUndefined";
import React, { useMemo, useEffect } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { enableRender } from "hzero-front-apaas/lib/utils/render";
import { getResponse, isTenantRoleLevel } from 'hzero-front/lib/utils/utils';
import notification from 'utils/notification';
import { operatorRender } from 'utils/renderer';
import { ColumnLock, TableMode, TableQueryBarType } from 'choerodon-ui/pro/lib/table/enum';
import Popconfirm from "hzero-front-hmde/lib/components/Popconfirm";
// import ImgIcon from '@hmde/utils/ImgIcon';
import { detailDs } from "hzero-front-hmde/lib/stores/BusinessObject/ButtonDS";
import parentStyles from "../index.less?modules";
// import styles from './index.less';

import Drawer from "./Drawer";
var USER_ACTION = /*#__PURE__*/function (USER_ACTION) {
  USER_ACTION["DISABLE"] = "DISABLE";
  USER_ACTION["DELETE"] = "DELETE";
  return USER_ACTION;
}(USER_ACTION || {}); // 删除
// 判断是否是树的根结点
// 根结点没有 parentId
const isRootItem = node => _isUndefined(node.parentId);
const Index = props => {
  const Modal = _useModal();
  const buttonDS = props.buttonDS,
    businessObjectCode = props.businessObjectCode;
  const detailDS = useMemo(() => new _DataSet(detailDs(businessObjectCode)), [businessObjectCode]);
  useEffect(() => {
    if (businessObjectCode) {
      buttonDS.setQueryParameter('businessObjectCode', businessObjectCode);
      fetchButtonTreeList();
    }
  }, [businessObjectCode]);

  // 获取/刷新树形结构的数据
  const fetchButtonTreeList = () => {
    buttonDS.query();
  };
  const columns = useMemo(() => {
    return [{
      name: 'businessObjectButtonName'
    }, {
      name: 'businessObjectButtonCode'
    }, {
      name: 'sourceType',
      renderer: record => record.text
    }, {
      name: 'enabledFlag',
      renderer: ({
        value,
        record
      }) => {
        const itemData = record === null || record === void 0 ? void 0 : record.toData();
        if (isRootItem(itemData)) {
          return null;
        }
        return enableRender(value ? 1 : 0);
      }
    }, {
      name: 'remark'
    }, {
      header: intl.get('hmde.common.table.column.operate').d('操作'),
      width: 150,
      lock: "right",
      renderer: ({
        record
      }) => {
        const itemData = record === null || record === void 0 ? void 0 : record.toData();
        if (isRootItem(itemData)) {
          return null;
        }

        // 租户上的平台继承
        const isSiteExtend = isTenantRoleLevel() && +(record === null || record === void 0 ? void 0 : record.get('tenantId')) === 0;
        const isPrefix = (record === null || record === void 0 ? void 0 : record.get('sourceType')) === 'DEFAULT'; // 预制
        const enabledFlag = record === null || record === void 0 ? void 0 : record.get('enabledFlag');
        const operators = [{
          key: 'edit',
          ele: /*#__PURE__*/React.createElement("a", {
            disabled: isSiteExtend,
            onClick: () => handleEdit(record, true)
          }, intl.get('hmde.common.button.edit').d('编辑')),
          len: 2,
          // ele里面的中文长度是多少就写多少
          title: intl.get('hmde.common.button.edit').d('编辑') // title写国际化
        }, {
          key: 'disable',
          ele: /*#__PURE__*/React.createElement(Popconfirm, {
            title: enabledFlag ? intl.get('hmde.bo.businessObject.disableMsg').d('禁用此按钮将导致交互视图内该按钮消失。确认禁用该按钮？') : intl.get('hmde.bo.businessObject.enableMsg').d('确认重新启用该按钮吗？')
            // @ts-ignore
            ,
            okText: intl.get('hmde.common.button.sure').d('确定'),
            cancelText: intl.get('hmde.common.button.cancel').d('取消'),
            handleOk: () => {
              if (record) {
                // ..
                handleDisableButton(record);
              }
            }
          }, /*#__PURE__*/React.createElement("a", null, enabledFlag ? intl.get('hmde.common.button.disable').d('禁用') : intl.get('hmde.common.button.enable').d('启用'))),
          len: 2,
          title: enabledFlag ? intl.get('hmde.common.button.disable').d('禁用') : intl.get('hmde.common.button.enable').d('启用')
        },
        // {
        //   key: 'disable',
        //   ele: (
        //     <a disabled={isSiteExtend} onClick={() => handleDisableButton(record)}>
        //       {enabledFlag
        //         ? intl.get('hmde.common.button.disable').d('禁用')
        //         : intl.get('hmde.common.button.enable').d('启用')}
        //     </a>
        //   ),
        //   len: 2,
        //   title: enabledFlag
        //     ? intl.get('hmde.common.button.disable').d('禁用')
        //     : intl.get('hmde.common.button.enable').d('启用'),
        // },
        {
          key: 'delete',
          ele: /*#__PURE__*/React.createElement(Popconfirm, {
            title: intl.get('hmde.bo.businessObject.deletetip').d('是否删除'),
            handleOk: () => {
              handleDeleteButton(record);
            },
            content: intl.get('hmde.bo.businessObject.deletecomponent').d('确定删除该组件吗？')
            // onConfirm={}
            // placement='top'
            // title={intl.get('hmde.bo.view.message.buttons.deleteMsg').d('确认删除该按钮吗？')}
          }, /*#__PURE__*/React.createElement("a", {
            disabled: isPrefix || isSiteExtend
          }, intl.get('hmde.common.button.delete').d('删除'))),
          len: 2,
          title: intl.get('hmde.common.button.delete').d('删除')
        }];

        /**
         * FIXME: 详细文档查看： https://open.hand-china.com/document-center/doc/product/10137/10227?doc_id=32661&doc_code=32661#operatorRenderoperatorRenderopen&doc-33
         * operatorRender: 操作列渲染函数
         * operators： 操作列的元素
         * record: renderer中的record属性
         * limit： 超出limit显示更多下拉列表
         */
        return operatorRender(operators, record, {
          limit: 3
        });
      }
    }];
  }, []);
  const handleCreateButton = () => {
    handleEdit({}, false);
  };

  // 编辑按钮
  const handleEdit = (record, isEdit) => {
    var _record$get;
    const idVal = record === null || record === void 0 ? void 0 : (_record$get = record.get) === null || _record$get === void 0 ? void 0 : _record$get.call(record, 'businessObjectButtonId');
    detailDS.setState('businessObjectButtonId', idVal);
    const currentEditData = isEdit ? record === null || record === void 0 ? void 0 : record.toData() : {};
    const title = !isEdit ? intl.get('hmde.common.button.create').d('新建') : intl.get('hmde.common.button.edit').d('编辑');
    Modal.open({
      drawer: isEdit,
      autoCenter: !isEdit,
      style: !isEdit ? {
        width: '66.5%'
      } : {},
      key: 'proxy',
      destroyOnClose: true,
      closable: true,
      title,
      children: /*#__PURE__*/React.createElement(Drawer, {
        currentEditData: currentEditData,
        isEdit: isEdit,
        detailDS: detailDS
      }),
      okText: intl.get('hmde.common.button.save').d('保存'),
      onOk: async () => {
        if (await detailDS.validate()) {
          const res = await detailDS.submit();
          if (getResponse(res)) {
            fetchButtonTreeList();
            return true;
          }
        }
        return false;
      },
      onCancel: () => {
        detailDS.removeAll();
      },
      afterClose: () => {
        detailDS.removeAll();
      }
    });
  };

  // 禁用按钮
  const handleDisableButton = record => {
    buttonDS.setState('__userAction', USER_ACTION.DISABLE);
    buttonDS.delete(record, false).then(res => {
      if (getResponse(res)) {
        fetchButtonTreeList();
      } else if (res) {
        notification.error({
          description: res === null || res === void 0 ? void 0 : res.message
        });
      }
    });
  };

  // 删除按钮
  const handleDeleteButton = record => {
    buttonDS.setState('__userAction', USER_ACTION.DELETE);
    buttonDS.delete(record, false).then(res => {
      if (getResponse(res)) {
        fetchButtonTreeList();
      } else if (res) {
        notification.error({
          description: res === null || res === void 0 ? void 0 : res.message
        });
      }
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", {
    className: parentStyles.title,
    style: {
      marginBottom: '12px'
    }
  }, intl.get('hmde.bo.businessObject.tab.buttons').d('按钮管理')), /*#__PURE__*/React.createElement(_Table, {
    dataSet: buttonDS,
    mode: "tree",
    columns: columns,
    queryBar: "filterBar",
    defaultRowExpanded: true,
    buttons: [!isTenantRoleLevel() && /*#__PURE__*/React.createElement(_Button, {
      icon: "add",
      onClick: () => handleCreateButton()
    }, intl.get('hmde.common.button.create').d('新建')), 'collapseAll', 'expandAll'].filter(Boolean)
  }));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Index));