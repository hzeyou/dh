import _DataSet from "choerodon-ui/pro/lib/data-set";
import intl from 'utils/intl';
const errorTableDS = dataSource => {
  return {
    paging: false,
    autoQuery: true,
    selection: 'multiple',
    data: dataSource,
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
      // 外层
      type: 'string',
      label: intl.get(`hmde.common.busniessObject`).d('业务对象')
    }, {
      name: 'physicalModelType',
      type: 'string',
      label: intl.get(`hmde.common.dataType`).d('数据类型')
    }, {
      name: 'physicsModelName',
      // 外层
      type: 'string',
      label: intl.get(`hmde.bo.businessObject.diffourse`).d('差异来源')
    }, {
      name: 'functionType',
      type: 'string',
      label: intl.get(`hmde.bo.authorityControl.function`).d('功能'),
      options: new _DataSet({
        data: []
      })
    }, {
      name: 'functionName',
      type: 'string',
      label: intl.get(`hmde.bo.businessObject.functionName`).d('功能名称/编码')
    }, {
      name: 'propertyType',
      type: 'string',
      label: intl.get('hmde.bo.businessObject.propertyType').d('属性名称'),
      lookupCode: 'HMDE.BUSINESS_OBJECT.VERIFY_TYPE'
    }, {
      name: 'message',
      type: 'string',
      label: intl.get(`hmde.bo.businessObject.pubMo.message`).d('警告原因')
    }, {
      name: 'physicsValue',
      type: 'string',
      label: intl.get(`hmde.bo.apiModel.paramsValue`).d('参数值')
    }, {
      name: 'businessValue',
      type: 'string',
      label: intl.get(`hmde.bo.businessObject.businessValue`).d('业务对象值')
    }]
  };
};
export default errorTableDS;