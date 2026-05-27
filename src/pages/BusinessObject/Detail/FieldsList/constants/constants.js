import intl from 'utils/intl';

// export enum FieldSourceType {
//   StandardField = 'StandardField', // 标准
//   ElasticDomainField = 'FLEX_FIELD', // 弹性域
//   ExtensionTableField = 'EXTEND_TABLE', // 扩展表字段
//   CustomField = 'CUSTOM', // 自定义字段
// }

export const arithmetic = [{
  meaning: intl.get('hmde.bo.businessObject.relationship').d('关系'),
  value: intl.get('hmde.bo.businessObject.relationship').d('关系'),
  children: [{
    value: '==',
    meaning: `==（${intl.get('hmde.common.equal').d('等于')}）`
  }, {
    value: '<>',
    meaning: `<>${intl.get('hmde.common.and').d('与')}!=（${intl.get('hmde.common.notEqual').d('不等于')}）`
  }, {
    value: '>',
    meaning: `>（${intl.get('hmde.common.greaterThan').d('大于')}）`
  }, {
    value: '<',
    meaning: `<（${intl.get('hmde.common.lessThan').d('小于')}）`
  }, {
    value: '>=',
    meaning: `>=（${intl.get('hmde.common.greaterThanOrEqualTo1').d('大于或等于')}）`
  }, {
    value: '<=',
    meaning: `<=（${intl.get('hmde.common.lessThanOrEqualTo1').d('小于或等于')}）`
  }]
}, {
  meaning: intl.get('hmde.bo.businessObject.logic').d('逻辑'),
  value: intl.get('hmde.bo.businessObject.logic').d('逻辑'),
  children: [{
    value: '&&',
    meaning: `&&（${intl.get('hmde.common.and').d('与')}）`
  }, {
    value: '||',
    meaning: `||（${intl.get('hmde.common.or').d('或')}）`
  }]
}, {
  meaning: intl.get('hmde.bo.businessObject.loarithmeticgic').d('算术'),
  value: intl.get('hmde.bo.businessObject.loarithmeticgic').d('算术'),
  children: [{
    value: '+',
    meaning: `+（${intl.get('hmde.common.puls').d('加')}）`
  }, {
    value: '-',
    meaning: `-（${intl.get('hmde.common.reduce').d('减')}）`
  }, {
    value: '*',
    meaning: `*（${intl.get('hmde.common.ride').d('乘')}）`
  }, {
    value: '/',
    meaning: `/（${intl.get('hmde.common.getridof').d('除')}）`
  }]
}, {
  meaning: intl.get('hmde.bo.businessObject.other').d('其他'),
  value: intl.get('hmde.bo.businessObject.other').d('其他'),
  children: [{
    value: '()',
    meaning: `()（${intl.get('hmde.bo.businessObject.Leftandrightparentheses').d('左括号和右括号')}）`
  }
  // {
  //   value: '&',
  //   meaning: '&（连接多个字符串）',
  // },
  ]
}];
export const componentTypeMap = [
/**
 * 文本框
 */
{
  value: 'TEXT_FIELD',
  meaning: intl.get('hmde.common.textFieldBox').d('文本框')
},
/**
 * 多行文本
 */
{
  value: 'TEXT_AREA',
  meaning: intl.get('hmde.common.textArea').d('多行文本')
},
/**
 * 富文本
 */
{
  value: 'RICH_TEXT',
  meaning: intl.get('hmde.common.view.message.richText').d('富文本')
},
/**
 * 数字
 */
{
  value: 'NUMBER_FIELD',
  meaning: intl.get('hmde.common.number').d('数字')
},
/**
 * 浮点数
 */
{
  value: 'FLOAT',
  meaning: intl.get('hmde.common.float').d('浮点数')
},
/**
 * 百分数
 */
{
  value: 'PERCENTAGE',
  meaning: intl.get('hmde.common.percentage').d('百分数')
},
/**
 * 日期选择框
 */
{
  value: 'DATE_SELECTION_BOX',
  meaning: intl.get('hmde.common.dateselection').d('日期选择框')
},
/**
 * 日期时间选择框
 */
{
  value: 'DATETIME_SELECTION_BOX',
  meaning: intl.get('hmde.common.dateTimeselection').d('日期时间选择框')
},
/**
 * 下拉单选
 */
{
  value: 'SINGLE_SELECT',
  meaning: intl.get('hmde.common.singleSelect').d('下拉单选')
},
/**
 * 下拉多选
 */
{
  value: 'MULTIPLE_SELECT',
  meaning: intl.get('hmde.common.multipleSelect').d('下拉多选')
},
/**
 * 单选框
 */
{
  value: 'RADIO',
  meaning: intl.get('hmde.common.radio').d('单选框')
},
/**
 * 复选框
 */
{
  value: 'CHECKBOX',
  meaning: intl.get('hmde.common.checkbox').d('复选框')
},
/**
 * 开关
 */
{
  value: 'SWITCH',
  meaning: intl.get('hmde.common.switch').d('开关')
},
/**
 * 金额
 */
{
  value: 'MONEY',
  meaning: intl.get('hmde.common.money').d('金额')
},
/**
 * 手机号码
 */
{
  value: 'PHONE_NUMBER',
  meaning: intl.get('hmde.common.phoneNumber').d('手机号码')
},
/**
 * 电子邮箱
 */
{
  value: 'EMAIL',
  meaning: intl.get('hmde.common.email').d('电子邮件')
},
/**
 * 附件
 */
{
  value: 'APPENDIX',
  meaning: intl.get('hmde.common.appendix').d('附件')
},
/**
 * 超链接
 */
{
  value: 'LINK',
  meaning: intl.get('hmde.common.cLink').d('超链接')
},
/**
 * 公式
 */
{
  value: 'FORMULA',
  meaning: intl.get('hmde.common.formula').d('公式')
},
/**
 * 关联字段
 */
{
  value: 'LINK_RELATION',
  meaning: intl.get('hmde.common.linkRelation').d('关联关系')
},
/**
 * 主从关系
 */
{
  value: 'MASTER_RELATION',
  meaning: intl.get('hmde.common.masterRelation').d('从主关系')
},
/**
 * 引用字段
 */
{
  value: 'REFERENCE_FIELD',
  meaning: intl.get('hmde.common.referenceField').d('引用字段')
},
/**
 * 地图
 */
{
  value: 'LOCATION',
  meaning: intl.get(`hmde.common.map`).d('地图')
},
// 关联关系多选
{
  value: 'MULTIPLE_RELATION',
  meaning: intl.get('hmde.common.linkRelationMultiple').d('关联关系多选')
}];