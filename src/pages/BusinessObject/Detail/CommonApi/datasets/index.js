import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import { FieldType, DataSetSelection } from 'choerodon-ui/pro/lib/data-set/enum';
import intl from 'utils/intl';
import { getCurrentOrganizationId, isTenantRoleLevel, getSession } from 'utils/utils';
const tenantId = getCurrentOrganizationId();
const isTenant = isTenantRoleLevel();
export const leftListDataSet = (businessObjectId, objVersionKey) => {
  return {
    autoCreate: false,
    autoQuery: true,
    selection: false,
    paging: false,
    pageSize: 10,
    transport: {
      read: ({
        params
      }) => ({
        url: `${lowcodeOrganizationURL({
          route: HZERO_HMDE
        })}/business-objects/api/${businessObjectId}/list?version=${getSession(objVersionKey) || ''}`,
        method: 'GET',
        params
      })
    }
  };
};
export let DetailDataSetFN = /*#__PURE__*/function (DetailDataSetFN) {
  DetailDataSetFN["API_TYPE"] = "apiType";
  DetailDataSetFN["API_OBJ"] = "apiObj";
  DetailDataSetFN["API_SERVICE_CODE"] = "apiServiceCode";
  DetailDataSetFN["INTERFACE_NAME"] = "interfaceName";
  DetailDataSetFN["INTERFACE_CODE"] = "interfaceCode";
  DetailDataSetFN["INTERFACE_URL"] = "interfaceUrl";
  DetailDataSetFN["REQUEST_METHOD"] = "requestMethod";
  DetailDataSetFN["REMARK"] = "remark";
  DetailDataSetFN["API_ID"] = "apiId";
  DetailDataSetFN["API_NAME"] = "apiName";
  return DetailDataSetFN;
}({});
export const detailDataSet = (businessObjectId, objVersionKey) => {
  return {
    autoCreate: false,
    autoQuery: false,
    selection: false,
    paging: false,
    forceValidate: true,
    fields: [{
      label: intl.get('hmde.bo.businessObject.bzApiType').d('标准API类型'),
      name: DetailDataSetFN.API_TYPE,
      type: "string",
      lookupCode: 'HMDE.API.TYPE'
    }, {
      label: intl.get('hmde.bo.businessObject.glApiType').d('关联API模型'),
      name: DetailDataSetFN.API_OBJ,
      type: "object",
      lovCode: isTenant ? 'HMDE.API.APIS.TENANT' : 'HMDE.API.APIS',
      ignore: 'always',
      // required: true,
      computedProps: {
        lovPara: ({
          record
        }) => ({
          tenantId,
          apiType: record === null || record === void 0 ? void 0 : record.get(DetailDataSetFN.API_TYPE)
        }),
        disabled: ({
          record
        }) => {
          return !(record !== null && record !== void 0 && record.get(DetailDataSetFN.API_TYPE));
        }
      }
    }, {
      label: intl.get('hmde.common.service').d('服务'),
      name: DetailDataSetFN.API_SERVICE_CODE,
      type: "string",
      bind: 'apiObj.apiServiceCode'
    }, {
      label: intl.get('hmde.bo.apiModel.interface').d('接口'),
      name: DetailDataSetFN.INTERFACE_NAME,
      type: "string",
      bind: 'apiObj.apiInterfaceName'
    }, {
      label: intl.get('hmde.bo.apiModel.interfaceCode').d('接口编码'),
      name: DetailDataSetFN.INTERFACE_CODE,
      type: "string",
      bind: 'apiObj.apiInterfaceCode'
    }, {
      label: intl.get('hmde.common.requestMethd').d('请求方式'),
      name: DetailDataSetFN.REQUEST_METHOD,
      type: "string",
      bind: 'apiObj.apiRequestMethod'
    }, {
      name: DetailDataSetFN.API_ID,
      bind: 'apiObj.apiId'
    }, {
      name: DetailDataSetFN.API_NAME,
      bind: 'apiObj.apiName'
    }, {
      label: intl.get('hmde.bo.apiModel.modelDescribe').d('模型描述'),
      name: DetailDataSetFN.REMARK,
      type: "string",
      bind: 'apiObj.remark'
    }].filter(Boolean),
    transport: {
      read: ({
        params
      }) => ({
        url: `${lowcodeOrganizationURL({
          route: HZERO_HMDE
        })}/business-objects/api/${businessObjectId}/detail?version=${getSession(objVersionKey) || ''}`,
        method: 'GET',
        params
      }),
      destroy: ({
        data = []
      }) => {
        return {
          url: `${lowcodeOrganizationURL({
            route: HZERO_HMDE
          })}/business-objects-export-templates`,
          method: 'DELETE',
          data: data[0]
        };
      },
      submit: ({
        data = []
      }) => {
        return {
          url: `${lowcodeOrganizationURL({
            route: HZERO_HMDE
          })}/business-objects/api`,
          method: 'POST',
          data: data[0],
          params: {
            tenantId
          }
        };
      }
    }
  };
};

// 获取出参入参
export const paramsAllDataSet = () => {
  return {
    autoCreate: false,
    autoQuery: false,
    selection: false,
    paging: false,
    transport: {
      read: ({
        params
      }) => {
        return {
          url: `${lowcodeOrganizationURL({
            route: HZERO_HMDE
          })}/business-objects/api`,
          method: 'GET',
          params: {
            ...params,
            tenantId
          }
        };
      }
    }
  };
};

// 新增api模型字段
export const getApiFieldDataSet = () => {
  return {
    autoCreate: false,
    autoQuery: false,
    selection: false,
    paging: false,
    transport: {
      read: ({
        params
      }) => {
        return {
          url: `${lowcodeOrganizationURL({
            route: HZERO_HMDE
          })}/api/servers/apis/param`,
          method: 'GET',
          params: {
            ...params,
            tenantId
          }
        };
      }
    }
  };
};
export let ParamsTableFN = /*#__PURE__*/function (ParamsTableFN) {
  ParamsTableFN["PARAMS_NAME"] = "paramName";
  ParamsTableFN["PARAMS_REMARK"] = "paramDescription";
  ParamsTableFN["REQUIRE_TYPE"] = "paramType";
  ParamsTableFN["MAN_LENGTH"] = "maxLength";
  ParamsTableFN["DECIMALS"] = "decimalDigits";
  ParamsTableFN["IS_REQUIRED"] = "requiredFlag";
  ParamsTableFN["BEHAVIOR"] = "paramBehavior";
  ParamsTableFN["API_BEHAVIOR"] = "apiBehavior";
  ParamsTableFN["PRIMARY_KEY"] = "primaryFlag";
  ParamsTableFN["PARAMS_MAP"] = "businessObjectFieldId";
  return ParamsTableFN;
}({});
export const paramsTableDataSet = (interfaceType, type) => {
  return {
    autoCreate: false,
    autoQuery: false,
    selection: false,
    paging: false,
    primaryKey: 'id1',
    parentField: 'parentId1',
    idField: 'id1',
    // expandField: 'expand',
    fields: [{
      label: intl.get('hmde.common.paramName').d('参数名称'),
      name: ParamsTableFN.PARAMS_NAME,
      type: "string"
    }, {
      label: intl.get('hmde.bo.apiModel.paramDescription').d('参数描述'),
      name: ParamsTableFN.PARAMS_REMARK,
      type: "string",
      maxLength: 60
    }, {
      label: intl.get('hmde.common.paramType').d('参数类型'),
      name: ParamsTableFN.REQUIRE_TYPE,
      type: "string",
      lookupCode: 'HMDE.API.PARAM.TYPE'
    }, {
      label: intl.get('hmde.common.manLength').d('最大长度'),
      name: ParamsTableFN.MAN_LENGTH,
      type: "number"
    }, {
      label: intl.get('hmde.common.digitalAccuracy').d('小数位数'),
      name: ParamsTableFN.DECIMALS,
      type: "number"
    }, {
      label: intl.get('hmde.common.isRequired').d('是否必输'),
      name: ParamsTableFN.IS_REQUIRED,
      type: "boolean"
    }, {
      label: intl.get('hmde.bo.apiModel.fixedParameters').d('固定参数'),
      name: ParamsTableFN.BEHAVIOR,
      type: "string",
      lookupCode: 'HMDE.API.PARAM.BEHAVIOR'
    }, {
      label: intl.get('hmde.common.primaryKey').d('主键'),
      name: ParamsTableFN.PRIMARY_KEY,
      type: "boolean",
      help: intl.get('hmde.bo.apiModel.primaryKeyTipe1').d('主键即此接口运行返回记录中标识数据唯一性的字段，如ID')
    }, {
      label: intl.get('hmde.bo.businessObject.paramsValue').d('字段映射'),
      name: ParamsTableFN.PARAMS_MAP,
      type: "string",
      textField: 'businessObjectFieldName',
      valueField: 'businessObjectFieldId',
      computedProps: {
        help: () => {
          if (type === 'OUTPUT') {
            return intl.get('hmde.bo.businessObject.primaryKeyTipe1').d('接口执行后，返回结果将回显到映射字段上。');
          }
          if (['PAGE', 'LIST', 'COUNT', 'LANE_LIST', 'LANE_PAGE'].includes(interfaceType)) {
            return intl.get('hmde.bo.businessObject.primaryKeyTipe2').d('维护自定义属性后，在设计器将生成对应属性的虚拟字段；若为空，在设计器将默认生成对应数据类型的虚拟字段。接口执行时，虚拟字段和映射字段的值将赋值给对应参数。若自定义属性、业务对象字段之间存在重复编码，在设计器仅保留对象字段，且接口执行时，对象字段将覆盖同编码的自定义属性给对应参数赋值。');
          } else {
            return intl.get('hmde.bo.businessObject.primaryKeyTipe3').d('接口执行时，映射字段的值将赋值给对应参数。');
          }
        }
      }
    }].filter(Boolean),
    transport: {
      read: ({
        params
      }) => ({
        url: `${lowcodeOrganizationURL({
          route: HZERO_HMDE
        })}/business-objects-export-templates/page`,
        method: 'GET',
        params
      })
    }
  };
};
export const objectFieldListDataSet = businessObjectId => {
  return {
    autoCreate: false,
    autoQuery: false,
    paging: false,
    fields: [{
      name: 'businessObjectFieldName',
      type: "string"
    }, {
      name: 'businessObjectFieldId',
      type: "string"
    }],
    transport: {
      read: ({
        params
      }) => {
        return {
          url: `${lowcodeOrganizationURL({
            route: HZERO_HMDE
          })}/business-object-fields`,
          method: 'GET',
          params: {
            ...params,
            businessObjectId
          }
        };
      }
    }
  };
};

// 添加字段ds
export const addFieldADataSet = () => {
  return {
    autoCreate: false,
    autoQuery: false,
    selection: "multiple",
    primaryKey: 'id1',
    parentField: 'parentId1',
    idField: 'id1',
    expandField: 'expand',
    paging: false,
    fields: [{
      label: intl.get('hmde.common.paramName').d('参数名称'),
      name: ParamsTableFN.PARAMS_NAME,
      type: "string"
    }, {
      label: intl.get('hmde.bo.apiModel.paramDescription').d('参数描述'),
      name: ParamsTableFN.PARAMS_REMARK,
      type: "string",
      maxLength: 60
    }, {
      label: intl.get('hmde.common.paramType').d('参数类型'),
      name: ParamsTableFN.REQUIRE_TYPE,
      type: "string",
      lookupCode: 'HMDE.API.PARAM.TYPE'
    }, {
      label: intl.get('hmde.common.manLength').d('最大长度'),
      name: ParamsTableFN.MAN_LENGTH,
      type: "number"
    }, {
      label: intl.get('hmde.common.digitalAccuracy').d('小数位数'),
      name: ParamsTableFN.DECIMALS,
      type: "number"
    }, {
      label: intl.get('hmde.common.isRequired').d('是否必输'),
      name: ParamsTableFN.IS_REQUIRED,
      type: "boolean"
    }, {
      label: intl.get('hmde.bo.businessObject.behavior').d('行为'),
      name: ParamsTableFN.BEHAVIOR,
      type: "string",
      lookupCode: 'HMDE.API.PARAM.BEHAVIOR'
    }]
  };
};