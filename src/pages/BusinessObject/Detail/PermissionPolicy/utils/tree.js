import uuid from 'uuid/v4';
import { treeToArr } from "hzero-front-hmde/lib/utils/treeUtils";

/**
 * 格式化角色数据
 * @param array
 */
import { FieldsNameTypes } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionDistributeDS";
export const formatRoles = array => {
  return array.map(role => {
    return {
      ...role,
      id: role.id || role.roleId,
      [FieldsNameTypes.NAME]: role.name || role.roleName,
      [FieldsNameTypes.CODE]: role.code || role.roleCode
    };
  });
};

/**
 * 格式化分配的租户数据
 * @param data
 */
export const organizationTreeToArray = data => {
  const _data = data.map(item => {
    var _item$id, _item$id2, _item$name, _item$code;
    const _item = {
      ...item
    };
    _item.id = String((_item$id = _item.id) !== null && _item$id !== void 0 ? _item$id : _item.tenantId);
    _item.myId = String((_item$id2 = _item.id) !== null && _item$id2 !== void 0 ? _item$id2 : _item.tenantId);
    _item[FieldsNameTypes.NAME] = (_item$name = _item.name) !== null && _item$name !== void 0 ? _item$name : _item.tenantName;
    _item[FieldsNameTypes.CODE] = (_item$code = _item.code) !== null && _item$code !== void 0 ? _item$code : _item.tenantNum;
    delete _item.tenantId;
    delete _item.tenantName;
    _item.groupRoleList = _item.groupRoleList.map(roleItem => {
      var _roleItem$id, _roleItem$name, _roleItem$code;
      const _roleItem = {
        ...roleItem
      };
      _roleItem.id = (_roleItem$id = _roleItem.id) !== null && _roleItem$id !== void 0 ? _roleItem$id : _roleItem.roleId;
      _roleItem.myId = uuid();
      _roleItem[FieldsNameTypes.NAME] = (_roleItem$name = _roleItem.name) !== null && _roleItem$name !== void 0 ? _roleItem$name : _roleItem.roleName;
      _roleItem[FieldsNameTypes.CODE] = (_roleItem$code = _roleItem.code) !== null && _roleItem$code !== void 0 ? _roleItem$code : _roleItem.roleCode;
      _roleItem.tenantId = String(_item.id);
      _roleItem.myTenantId = String(_item.myId);
      delete _roleItem.roleId;
      delete _roleItem.roleName;
      return _roleItem;
    });
    return _item;
  });
  return treeToArr(_data, 'groupRoleList');
};