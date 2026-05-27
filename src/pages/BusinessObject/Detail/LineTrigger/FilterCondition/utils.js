import intl from 'utils/intl';
export const componentTypeMap = new Map([['TEXT_FIELD', intl.get('hmde.common.string').d('字符串')], ['NUMBER_FIELD', intl.get('hmde.common.number').d('数字')], ['DATE_SELECTION_BOX', intl.get('hmde.common.date').d('日期')], ['DATETIME_SELECTION_BOX', intl.get('hmde.common.dateTime').d('日期时间')], ['SWITCH', intl.get('hmde.common.switch').d('开关')], ['PRIMARY_KEY', intl.get('hmde.common.primaryForeignKey').d('主外键')]]);

// 字段类型过滤
export const handleOptionsFilter = (option, type) => {
  const filterArr = ['INPUT_PARAM', 'EXPRESSION', 'SYSTEM_VARIABLE'];
  if (!type) {
    filterArr.push('CONSTANT');
  }
  if (!filterArr.includes(option === null || option === void 0 ? void 0 : option.get('value'))) {
    return false;
  }
  return option;
};