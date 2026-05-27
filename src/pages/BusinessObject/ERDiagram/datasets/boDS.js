import _DataSet from "choerodon-ui/pro/lib/data-set";
import _forOwn from "lodash/forOwn";
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import intl from 'utils/intl';
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import { transformIdFields } from "../utils/common";
import { ENCRYPT_FIELD } from "../constants/common";
export let BoFN = /*#__PURE__*/function (BoFN) {
  BoFN["ID"] = "businessObjectId";
  BoFN["NAME"] = "businessObjectName";
  BoFN["CODE"] = "businessObjectCode";
  BoFN["CATEGORY"] = "businessObjectCategory";
  BoFN["PUBLISH_STATUS"] = "publishStatus";
  BoFN["ENABLED_FLAG"] = "enabledFlag";
  BoFN["KEYWORD"] = "keyword";
  return BoFN;
}({});
export default (() => ({
  autoQuery: false,
  paging: false,
  queryFields: [{
    name: BoFN.KEYWORD,
    type: "string"
  }, {
    name: BoFN.PUBLISH_STATUS,
    type: "string",
    label: intl.get('hmde.common.publishStatus').d('发布状态'),
    options: new _DataSet({
      paging: false,
      data: [{
        value: 'ALL',
        meaning: intl.get('hmde.bo.businessObject.all').d('全部')
      }, {
        value: 'PUBLISHED',
        meaning: intl.get('hmde.common.status.published').d('已发布')
      }, {
        value: 'MODIFIED',
        meaning: intl.get('hmde.common.status.modified').d('已修改')
      }, {
        value: 'UNPUBLISHED',
        meaning: intl.get('hmde.common.status.unpublished').d('未发布')
      }]
    }),
    defaultValue: 'ALL'
  }, {
    name: BoFN.ENABLED_FLAG,
    type: "string",
    label: intl.get('hmde.common.status').d('状态'),
    options: new _DataSet({
      paging: false,
      data: [{
        value: 'ALL',
        meaning: intl.get('hmde.bo.businessObject.all').d('全部')
      }, {
        value: 'true',
        meaning: intl.get('hmde.common.button.enable').d('启用')
      }, {
        value: 'false',
        meaning: intl.get('hmde.common.button.disable').d('禁用')
      }]
    }),
    defaultValue: 'ALL'
  }, {
    name: BoFN.CATEGORY,
    type: "string",
    label: intl.get('hmde.common.objectType').d('对象类型'),
    options: new _DataSet({
      paging: false,
      data: [{
        value: 'ALL',
        meaning: intl.get('hmde.bo.businessObject.all').d('全部')
      }, {
        value: 'STANDARD',
        meaning: intl.get('hmde.bo.businessObject.standard').d('基础对象')
      }, {
        value: 'MIDDLE',
        meaning: intl.get('hmde.bo.businessObject.middle').d('中间对象')
      }]
    }),
    defaultValue: 'ALL'
  }],
  fields: [{
    name: BoFN.NAME,
    type: "string"
  }],
  transport: {
    read: ({
      data
    }) => {
      const _data = {
        ...data
      };
      // 如果 value 为 ALL 则不传给后端
      _forOwn(_data, (value, key) => {
        if (value === 'ALL') {
          delete _data[key];
        }
      });
      return {
        url: `${lowcodeOrganizationURL({
          route: HZERO_HMDE
        })}/business-objects/list-by-domain-id`,
        method: 'GET',
        data: _data,
        transformResponse: res => {
          try {
            let resData = JSON.parse(res);
            if (resData) {
              // ⚠️兼容非主键加密的情况
              resData = transformIdFields(resData, ENCRYPT_FIELD);
            }
            return resData;
          } catch (e) {
            console.error(e);
            return res;
          }
        }
      };
    }
  }
}));