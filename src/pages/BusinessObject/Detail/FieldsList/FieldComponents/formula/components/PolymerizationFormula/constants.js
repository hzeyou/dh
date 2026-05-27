import intl from 'utils/intl';

/**
 * 过长的提示信息写在这里
 */
// 聚合基准帮助信息
export function POLYMERIZATION_STANDARD_HELP() {
  return intl.get('hmde.bo.businessObject.polyStandardHelp').d('选择将以哪个对象作为目标执行聚合计算。例如：在学校的业务对象上创建公式字段，期望得到每所学校的所有学生的总成绩。可选择COL_SUM函数，并将聚合基准设置为学生对象。');
}
// 聚合表达式帮助信息
export function POLYMERIZATION_EXPRESSION_HELP() {
  return intl.get('hmde.bo.businessObject.polyExpressionHelp').d('维护聚合表达式以表明将以何种逻辑执行聚合计算。较简单的例子：在学校的业务对象上创建公式字段，期望得到每所学校的所有学生的总成绩。选择COL_SUM函数，并将聚合基准设为学生对象后，聚合表达式维护为学生的成绩字段即可。较复杂的例子：在采购订单头对象上创建公式字段，期望得到该采购订单头下所有订单行的已发运总金额。选择COL_SUM函数，聚合基准设为发运行对象，聚合表达式设为CASCADE(采购订单头.采购订单行,采购订单行.金额) * CASCADE(采购订单头.采购订单行,采购订单行.发运行,发运行.已发运数量) 。');
}
// 聚合条件帮助信息
export function POLYMERIZATION_CONDITION_HELP() {
  return intl.get('hmde.bo.businessObject.polyConditionHelp').d('可先通过过滤得到符合条件的数据后再进行聚合计算。例如：在学校对象上创建公式字段，期望得到每所学校的女生总数，选择COL_COUNT函数，聚合基准选择学生对象，条件设置为学生性别等于女即可。');
}