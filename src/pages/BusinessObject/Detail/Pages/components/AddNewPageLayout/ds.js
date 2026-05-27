import _get from "lodash/get";
import _pick from "lodash/pick";
import intl from 'utils/intl';
import { HZERO_HLOD, HZERO_HPFM } from "hzero-front-apaas/lib/utils/config";
import { pageNameCheck } from "hzero-front-hmde/lib/services/businessObjectService";
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";

// 处理 pageCode
const codeHandle = code => `${code}_`;
export default ((businessObjectCode, domainId, isEdit) => ({
  autoQuery: false,
  // autoCreate: true,
  autoCreate: false,
  paging: false,
  selection: false,
  fields: [{
    name: 'pageName',
    label: intl.get('hmde.bo.field.layoutName').d('交互视图名称'),
    required: true,
    maxLength: 32,
    validator: async (value, nu, record) => {
      if (!value) return false;
      if (!(record !== null && record !== void 0 && record.get('pageName'))) {
        return intl.get('hmde.bo.businessObject.LayoutNameError').d('交互视图名称不能为空');
      }
      if (isEdit && value === record.getPristineValue('pageName')) {
        return;
      }
      // 校验方法
      const query = {
        businessObjectCode,
        pageName: value,
        sourceType: 'BUSINESS_OBJECT'
      };
      const res = await pageNameCheck(query, {
        'domain-id': domainId
      });
      if (res && res.failed) {
        return (res === null || res === void 0 ? void 0 : res.message) || intl.get('hmde.bo.businessObject.LayoutNameErrorRepeat').d('同一业务对象下交互视图名称/代码不能重复');
      }
    }
  }, {
    name: 'pageCode',
    label: intl.get('hmde.bo.field.layoutCode').d('交互视图代码'),
    required: true,
    maxLength: 60 - codeHandle(businessObjectCode).length,
    validator: async (value, nu, record) => {
      if (!value) return false;
      if (!(record !== null && record !== void 0 && record.get('pageCode'))) {
        return intl.get('hmde.bo.businessObject.LayoutCodeError').d('交互视图代码不能为空');
      }
      if (isEdit && value === record.getPristineValue('pageCode')) {
        return;
      }

      // 校验方法
      const query = {
        businessObjectCode,
        pageCode: codeHandle(businessObjectCode) + value,
        sourceType: 'BUSINESS_OBJECT'
      };
      const res = await pageNameCheck(query, {
        'domain-id': domainId
      });
      if (res && res.failed) {
        return (res === null || res === void 0 ? void 0 : res.message) || intl.get('hmde.bo.businessObject.LayoutNameErrorRepeat').d('同一业务对象下交互视图名称/代码不能重复');
      }
    }
  }, {
    name: 'pageCategory',
    type: 'string',
    label: intl.get('hmde.bo.businessObject.publishLayoutType').d('交互视图类型'),
    lookupCode: 'HLOD.PAGE_CATEGORY',
    required: true,
    defaultValue: 'STANDARD_COMPONENT'
  }, {
    name: 'businessComponentPath',
    type: 'string',
    label: intl.get('hmde.bo.businessObject.businessComponentPath').d('业务组件路径'),
    dynamicProps: {
      required: ({
        record
      }) => {
        if (record && (record === null || record === void 0 ? void 0 : record.get('pageCategory')) === 'BUSINESS_COMPONENT') {
          return true;
        }
        return false;
      }
    },
    help: '需与业务组件打包后输出的路径一致。'
  }, {
    name: 'businessComponentCode',
    type: 'string',
    label: intl.get('hmde.bo.page.businessComponentCode').d('业务组件编码'),
    dynamicProps: {
      required: ({
        record
      }) => {
        if (record && (record === null || record === void 0 ? void 0 : record.get('pageCategory')) === 'BUSINESS_COMPONENT') {
          return true;
        }
        return false;
      }
    },
    help: '需与业务组件打包后的编码一致。'
  }, {
    name: 'businessComponentDomain',
    type: 'string',
    label: intl.get('hmde.bo.page.businessComponentDomain').d('域名'),
    // lookupCode: 'HLOD.BUSINESS_COMPONENT.DOMAIN',
    dynamicProps: {
      required: ({
        record
      }) => {
        if (record && (record === null || record === void 0 ? void 0 : record.get('pageCategory')) === 'BUSINESS_COMPONENT') {
          return true;
        }
        return false;
      }
    },
    // textField: 'meaning',
    // valueField: 'value',
    // FIXME: 直接写 lookupCode 的方式不会触发 select 的 noCache 属性，改成下边接口方式
    lookupAxiosConfig: {
      url: `${lowcodeOrganizationURL({
        route: HZERO_HPFM
      })}/lovs/value/batch`,
      method: 'GET',
      params: {
        'HLOD.BUSINESS_COMPONENT.DOMAIN': 'HLOD.BUSINESS_COMPONENT.DOMAIN'
      },
      transformResponse(res) {
        try {
          const data = JSON.parse(res);
          return (data === null || data === void 0 ? void 0 : data['HLOD.BUSINESS_COMPONENT.DOMAIN']) || [];
        } catch (error) {
          return [];
        }
      }
    },
    help: '请至HZERO "值集配置" 菜单下，预先维护域名值集(HLOD.BUSINESS_COMPONENT.DOMAIN)'
  }, {
    name: 'remark',
    label: intl.get('hmde.common.remark').d('描述'),
    maxLength: 120
  }, {
    name: 'enabledFlag',
    type: 'boolean',
    label: intl.get('hmde.common.status').d('状态'),
    trueValue: true,
    falseValue: false
  }, {
    name: 'publishedDate',
    type: 'string',
    label: intl.get('hmde.bo.page.publishTime').d('发布时间')
  }],
  transport: {
    submit: ({
      data
    }) => {
      if (isEdit) {
        return {
          url: `${lowcodeOrganizationURL({
            route: HZERO_HLOD
          })}/pages/update-page-info`,
          method: 'PUT',
          headers: {
            'domain-id': domainId
          },
          data: data[0]
        };
      }
      const _data$ = data[0],
        pageCategory = _data$.pageCategory,
        businessComponentPath = _data$.businessComponentPath,
        businessComponentCode = _data$.businessComponentCode,
        businessComponentDomain = _data$.businessComponentDomain;
      const customObj = {};
      if (pageCategory === 'BUSINESS_COMPONENT') {
        customObj.businessComponentPath = businessComponentPath;
        customObj.businessComponentCode = businessComponentCode;
        customObj.businessComponentDomain = businessComponentDomain;
      }
      const saveData = {
        domainId,
        orderSeq: 0,
        sourceType: 'BUSINESS_OBJECT',
        businessObjectCode,
        pageCode: codeHandle(businessObjectCode) + _get(data[0], 'pageCode', ''),
        ..._pick(data[0], ['pageName', 'remark', 'pageCategory'], {}),
        ...customObj
      };
      return {
        url: `${lowcodeOrganizationURL({
          route: HZERO_HLOD
        })}/pages`,
        method: 'POST',
        data: saveData,
        params: {
          businessObjectCode
        }
      };
    }
  }
}));