import intl from 'utils/intl';
const inputParamsMappingDs = () => ({
  selection: false,
  paging: false,
  fields: [{
    label: intl.get('hmde.bo.flow.model.queryParameter').d('请求参数'),
    name: 'queryParameter',
    type: 'string'
  }, {
    label: intl.get('hmde.bo.flow.model.method').d('参数类型'),
    name: 'method',
    type: 'string'
  }, {
    label: intl.get('hmde.bo.flow.model.mapParameter').d('映射参数'),
    name: 'mapParameter',
    type: 'string'
  }],
  data: [{
    queryParameter: 'demo.salahhsjf',
    method: 'body'
  }, {
    queryParameter: 'demo.salahhsjf',
    method: 'path'
  }, {
    queryParameter: 'demo.salahhsjf',
    method: 'query'
  }, {
    queryParameter: 'demo.salahhsjf',
    method: 'body'
  }]
});
const outParamsMappingDs = () => ({
  selection: false,
  paging: false,
  fields: [{
    label: intl.get('hmde.bo.flow.model.queryParameter').d('请求参数'),
    name: 'queryParameter',
    type: 'string'
  }, {
    label: intl.get('hmde.bo.flow.model.method').d('参数类型'),
    name: 'method',
    type: 'string'
  }, {
    label: intl.get('hmde.bo.flow.model.mapParameter').d('映射参数'),
    name: 'mapParameter',
    type: 'string'
  }]
});
export { inputParamsMappingDs, outParamsMappingDs };