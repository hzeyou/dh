import intl from 'utils/intl';
const tableDS = () => ({
  autoQuery: true,
  pageSize: 10,
  selection: false,
  fields: [{
    name: 'codeNumber',
    type: 'number',
    label: intl.get(`hmde.bo.businessObject.codeNumber`).d('编号'),
    ignore: 'always',
    transformRequest: (_, record) => {
      return record.index + 1;
    }
  }, {
    name: 'businessObjectName',
    type: 'string',
    label: intl.get(`hmde.common.busniessObject`).d('业务对象')
  }, {
    name: 'message',
    type: 'string',
    label: intl.get(`hmde.bo.modeler.failedMessage`).d('失败原因')
  }]
});
const domainDS = () => ({
  autoQuery: true,
  pageSize: 10,
  selection: false,
  fields: [{
    name: 'codeNumber',
    type: 'number',
    label: intl.get(`hmde.bo.businessObject.codeNumber`).d('编号'),
    ignore: 'always',
    transformRequest: (_, record) => {
      return record.index + 1;
    }
  }, {
    name: 'businessObjectName',
    type: 'string',
    label: intl.get(`hmde.common.busniessObject`).d('业务对象')
  }, {
    name: 'domainName',
    type: 'string',
    label: intl.get(`hmde.common.domain`).d('领域')
  }, {
    name: 'domainCode',
    type: 'string',
    label: intl.get(`hmde.bo.businessObject.domainCode`).d('领域编码')
  }]
});
export { tableDS, domainDS };