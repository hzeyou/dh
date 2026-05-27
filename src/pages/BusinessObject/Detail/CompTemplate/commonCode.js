export const TemplateType = {
  EMPTY: 'EMPTY',
  TABLE: 'TABLE',
  FORM: 'FORM'
};
export const platformType = {
  PC: 'PC',
  MOBILE: 'MOBILE'
};
export const allPlatform = [platformType.PC, platformType.MOBILE];
export const TemplateList = [{
  name: '列表页',
  value: TemplateType.TABLE,
  type: allPlatform
}, {
  name: '表单页',
  value: TemplateType.FORM,
  type: allPlatform
}, {
  name: '空页面',
  value: TemplateType.EMPTY,
  type: allPlatform
}];
export const platformList = [{
  name: 'PC端',
  value: platformType.PC
}, {
  name: '移动端',
  value: platformType.MOBILE
}];