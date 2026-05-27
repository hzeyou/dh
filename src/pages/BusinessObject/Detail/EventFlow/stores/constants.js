import intl from 'utils/intl';
export const arithmetic = [{
  meaning: intl.get('hmde.bo.businessObject.relationship').d('关系'),
  value: '关系',
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
  value: '逻辑',
  children: [{
    value: '&&',
    meaning: `&&（${intl.get('hmde.common.and').d('与')}）`
  }, {
    value: '||',
    meaning: `||（${intl.get('hmde.common.or').d('或')}）`
  }]
}, {
  meaning: intl.get('hmde.bo.businessObject.loarithmeticgic').d('算术'),
  value: '算术',
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
  value: '其他',
  children: [{
    value: '()',
    meaning: `()（${intl.get('hmde.bo.view.Leftandrightparentheses').d('左括号和右括号')}）`
  }]
}];
export const fun = [{
  meaning: 'ISEMPTY()',
  value: '_isEmpty(x)'
}, {
  meaning: 'ISNOTEMPTY()',
  value: '_isNotEmpty(x)'
}, {
  meaning: 'ABS()',
  value: '#abs(x)'
}, {
  meaning: 'MAX()',
  value: '#max(x, y)'
}, {
  meaning: 'MIN()',
  value: '#min(x, y)'
}, {
  meaning: 'RANDOM()',
  value: '#random()'
}, {
  meaning: 'ROUND()',
  value: '#round(x)'
}];
const functionFormatDescription = intl.get('hmde.bo.view.FunctionFormatDescription').d('函数格式说明');
export const funDescMap = new Map([['_isEmpty(x)', `${functionFormatDescription}：_isEmpty(x)
    ${intl.get('hmde.bo.view.FormatDescription1').d('返回一个判断一个值是否为空的判断结果，返回结果为true或false')}`], ['_isNotEmpty(x)', `${functionFormatDescription}：_isNotEmpty(x)
    ${intl.get('hmde.bo.view.FormatDescription2').d('返回一个判断一个值是否非空的判断结果，返回结果为true或false')}`], ['#abs(x)', `${functionFormatDescription}：#abs(x)
    ${intl.get('hmde.bo.view.FormatDescription3').d('返回一个数的绝对值')}`], ['#max(x, y)', `${functionFormatDescription}：#max(x, y)
     ${intl.get('hmde.bo.view.FormatDescription4').d('返回多个数的最大值')}`], ['#min(x, y)', `${functionFormatDescription}：#min(x, y)
     ${intl.get('hmde.bo.view.FormatDescription5').d('返回多个数的最小值')}`], ['#random()', `${functionFormatDescription}：#random()
     ${intl.get('hmde.bo.view.FormatDescription6').d('返回一个0到1之间到一个伪随机数')}`], ['#round(x)', `${functionFormatDescription}：#round(x)
    ${intl.get('hmde.bo.view.FormatDescription7').d('返回四舍五入后到整数')}`]]);

/**
 * 同类型字段类型分类：匹配条件表达式操作类型
 */
export const classifyComponentType = [{
  componentType: ['NUMBER_FIELD', 'FLOAT', 'PERCENTAGE', 'MONEY'],
  // 1.整数、浮点、百分数、金额
  operatorType: ['EQUAL',
  // 等于
  'NOT_EQUAL',
  // 不等于
  'LESS_THAN',
  // 小于
  'LESS_THAN_OR_EQUAL_TO',
  // 小于等于
  'GREATER_THAN',
  // 大于
  'GREATER_THAN_OR_EQUAL_TO',
  // 大于等于
  'IS_NULL',
  // 为空
  'IS_NOT_NULL' // 非空
  ]
}, {
  componentType: ['TEXT_FIELD',
  // 文本
  'TEXT_AREA',
  // 长文本
  'RICH_TEXT',
  // 富文本
  'LOCATION', 'PHONE_NUMBER',
  // 手机号码
  'EMAIL',
  // 电子邮箱
  'CODE_RULE',
  // 编码规则
  'APPENDIX',
  // 附件
  'LINK',
  // 超链接
  'FORMULA',
  // 公式
  'REFERENCE_FIELD'],
  operatorType: ['EQUAL', 'NOT_EQUAL', 'IS_NULL', 'IS_NOT_NULL']
}, {
  componentType: ['SWITCH'],
  // 3.开关
  operatorType: ['EQUAL',
  // 等于
  'NOT_EQUAL',
  // 不等于
  'IS_NULL',
  // 为空
  'IS_NOT_NULL' // 非空
  ]
}, {
  componentType: ['DATE_SELECTION_BOX', 'DATETIME_SELECTION_BOX'],
  // 4.日期/日期时间
  operatorType: ['EQUAL',
  // 等于
  'NOT_EQUAL',
  // 不等于
  'LESS_THAN',
  // 小于
  'LESS_THAN_OR_EQUAL_TO',
  // 小于等于
  'GREATER_THAN',
  // 大于
  'GREATER_THAN_OR_EQUAL_TO',
  // 大于等于
  'IS_NULL',
  // 为空
  'IS_NOT_NULL' // 非空
  ]
}, {
  componentType: ['RADIO', 'SINGLE_SELECT', 'CHECKBOX', 'MULTIPLE_SELECT'],
  // 5、下拉单选、下拉多选、单选、复选
  operatorType: ['EQUAL',
  // 等于
  'NOT_EQUAL',
  // 不等于
  'IS_NULL',
  // 为空
  'IS_NOT_NULL' // 非空
  ]
}, {
  componentType: ['MASTER_RELATION', 'LINK_RELATION'],
  // 从主/关联
  operatorType: ['EQUAL',
  // 等于
  'NOT_EQUAL',
  // 不等于
  'IS_NULL',
  // 为空
  'IS_NOT_NULL' // 非空
  ]
}];