/* eslint-disable no-param-reassign */
import { uuid } from "hzero-front-hmde/lib/utils/common";
import intl from 'utils/intl';
import notification from 'utils/notification';
import { isTenantRoleLevel } from 'utils/utils';

// 编码重复, 继承行为重复
export const checkError = data => {
  const codeList = [];
  const extendsList = [];
  data.forEach(v => {
    if (codeList.includes(v.templateFieldCode)) {
      // v.checkCode = true;
      data.forEach(item => {
        if (item.templateFieldCode === v.templateFieldCode) {
          item.checkCode = true;
        }
      });
    }
    if (extendsList.includes(v.fieldBehavior) && v.fieldBehavior) {
      // v.checkExtend = true;
      data.forEach(item => {
        if (item.fieldBehavior === v.fieldBehavior) {
          item.checkExtend = true;
        }
      });
    }
    codeList.push(v.templateFieldCode);
    extendsList.push(v.fieldBehavior);
  });
  return data;
};

// 拍平树结构
export const flathandleData = data => {
  let fieldList = [];
  const extendsList = [];
  const originData = data === null || data === void 0 ? void 0 : data.map(item => {
    const _uuid = uuid();
    Object.assign(item, {
      id: _uuid,
      templateFieldName: item.description || item.name,
      templateFieldCode: item.name,
      typeC: intl.get('hmde.bo.businessObject.physicalModel').d('物理模型')
    });
    // 处理字段
    if (item !== null && item !== void 0 && item.domainTemplateFields) {
      var _item$domainTemplateF;
      const arr = item === null || item === void 0 ? void 0 : (_item$domainTemplateF = item.domainTemplateFields) === null || _item$domainTemplateF === void 0 ? void 0 : _item$domainTemplateF.map((i, index) => {
        const checkFlag = !i.fieldBehavior || !extendsList.includes(i.fieldBehavior);
        extendsList.push(i.fieldBehavior);
        return {
          ...i,
          parentId: item.id || _uuid,
          id: uuid(),
          typeC: intl.get('hmde.bo.businessObject.template').d('模版'),
          check: index === 0 && checkFlag
        };
      });
      fieldList = [...fieldList, ...arr];
    }
    return item;
  });
  return [...originData, ...fieldList];
};

// 获取领域建对象的租户自定义对象编码前缀
export const getTenantBusinessObjectPrefixRule = tenantBusinessObjectPrefixRule => {
  if (!tenantBusinessObjectPrefixRule) return '';
  try {
    return JSON.parse(tenantBusinessObjectPrefixRule);
  } catch (err) {
    console.log(err);
    return '';
  }
};

/**
 * 校验对象编码前缀
 */
export const checkObjectCodePrefix = getAddonBefore => {
  const codeErrorFlag = isTenantRoleLevel() && getAddonBefore && (getAddonBefore.length > 55 || !/^[A-Z0-9_]*$/.test(getAddonBefore));
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