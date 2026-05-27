import intl from 'utils/intl';
const selectStore = [{
  code: 'select-single',
  text: intl.get('hmde.common.singleSelect').d('下拉单选')
}, {
  code: 'select-multiple',
  text: intl.get('hmde.common.multipleSelect').d('下拉多选')
}, {
  code: 'single',
  text: intl.get('hmde.common.radioType').d('单选')
}, {
  code: 'multiple',
  text: intl.get('hmde.common.checkboxType').d('多选')
}, {
  code: 'expression',
  text: intl.get('hmde.common.formula').d('公式')
}, {
  code: 'switch',
  text: intl.get('hmde.common.switch').d('开关')
}, {
  code: 'text',
  text: intl.get('hmde.common.textField').d('文本')
}, {
  code: 'text-multiple',
  text: intl.get('hmde.common.textArea').d('多行文本')
}, {
  code: 'int',
  text: intl.get('hmde.common.numberField').d('整数')
}, {
  code: 'float',
  text: intl.get('hmde.common.floatType').d('浮点')
}, {
  code: 'percentage',
  text: intl.get('hmde.common.percentage').d('百分数')
}, {
  code: 'phone',
  text: intl.get('hmde.common.phoneNumber').d('手机号码')
}, {
  code: 'amount',
  text: intl.get('hmde.common.money').d('金额')
}, {
  code: 'date',
  text: intl.get('hmde.common.date').d('日期')
}, {
  code: 'dateTime',
  text: intl.get('hmde.common.dateTime').d('日期时间')
}, {
  code: 'email',
  text: intl.get('hmde.common.email').d('电子邮件')
}, {
  code: 'accessory',
  text: intl.get('hmde.common.appendix').d('附件')
}, {
  code: 'link',
  text: intl.get('hmde.common.cLink').d('超链接')
}, {
  code: 'master-slave-relation',
  text: intl.get('hmde.common.masterRelation').d('从主关系')
}, {
  code: 'association',
  text: intl.get('hmde.common.linkRelation').d('关联关系')
}, {
  code: 'reference-fields',
  text: intl.get('hmde.common.referenceField').d('引用字段')
}];

// 所有类型都通用
const commonFieldsLv1 = ['bo_field_name', 'bo_field_code'];
// 某些类型通用
const commonFieldsLv2 = ['required_flag', 'readonly'];
const commonFieldsLv3 = ['field_description', 'default_value'];
const fieldMap = new Map([['singleSelect', [...commonFieldsLv1, 'default_value', ...commonFieldsLv2]], ['multipleSelect', [...commonFieldsLv1, 'default_value', ...commonFieldsLv2]], ['radio', [...commonFieldsLv1, ...commonFieldsLv2]], ['checkbox', [...commonFieldsLv1, ...commonFieldsLv2]], ['formula', [...commonFieldsLv1, 'remark']], ['switch', [...commonFieldsLv1, 'remark']], ['textField', [...commonFieldsLv1, ...commonFieldsLv3, 'max_length', ...commonFieldsLv2]], ['textArea', [...commonFieldsLv1, ...commonFieldsLv3, 'max_length', ...commonFieldsLv2]], ['numberField', [...commonFieldsLv1, ...commonFieldsLv3, 'max_length', ...commonFieldsLv2]], ['float', [...commonFieldsLv1, ...commonFieldsLv3, 'integer_maxlength', 'decimal_maxlength', ...commonFieldsLv2]], ['percentage', [...commonFieldsLv1, ...commonFieldsLv3, 'integer_maxlength', 'decimal_maxlength', ...commonFieldsLv2]], ['phone', [...commonFieldsLv1, ...commonFieldsLv3, 'area_code', ...commonFieldsLv2]], ['amount', [...commonFieldsLv1, ...commonFieldsLv3, 'integer_maxlength', 'decimal_maxlength', 'thousands', ...commonFieldsLv2]], ['dateSelectionBox', [...commonFieldsLv1, ...commonFieldsLv3, 'help_text', 'remark', 'display_format', 'default_value']], ['dateTimeSelectionBox', [...commonFieldsLv1, ...commonFieldsLv3, 'help_text', 'remark', 'max_length', 'default_value']], ['email', [...commonFieldsLv1, ...commonFieldsLv3, 'file_type', 'multiple', 'file_limit', 'max_upload']], ['accessory', [...commonFieldsLv1, ...commonFieldsLv3, 'max_length', ...commonFieldsLv2]], ['link', [...commonFieldsLv1, ...commonFieldsLv3, 'max_length', 'default_value']], ['master-slave-relation', [...commonFieldsLv1, ...commonFieldsLv3, 'master_bo_id', 'required_flag']], ['association', [...commonFieldsLv1, ...commonFieldsLv3, 'master_bo_id', 'required_flag']], ['reference-fields', [...commonFieldsLv1, ...commonFieldsLv3, 'master_bo_id', 'ref_bo_field_id', 'required_flag']]]);
export { selectStore, fieldMap };