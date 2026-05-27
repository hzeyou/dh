import _DataSet from "choerodon-ui/pro/lib/data-set";
import _pick from "lodash/pick";
import intl from 'utils/intl';
import { HZERO_HLOD, HZERO_HPFM } from "hzero-front-apaas/lib/utils/config";
import { pageNameCheck } from "hzero-front-hmde/lib/services/businessObjectService";
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import { API_HOST } from 'utils/config';
import { lowcodeRequest as request } from "hzero-front-hmde/lib/utils/lowcodeRequest";
import { PublishStatus } from "hzero-front-apaas/lib/constants/businessObject";
import { isTenantRoleLevel } from 'utils/utils';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import { platformType } from "../../commonCode";

// 处理 pageCode
export const codeHandle = code => `${code}_`;
export const PlatformDS = () => ({
  autoCreate: true,
  fields: [{
    name: 'platform',
    type: "string",
    label: intl.get('hmde.bo.field.compTemplatePlatform').d('类别'),
    multiple: ',',
    defaultValue: 'PC, MOBILE',
    required: true
  }]
});
export const PublishPageDS = (businessObjectCode, domainId) => ({
  // autoCreate: true,
  transport: {
    read: ({
      params
    }) => {
      const queryObj = {
        ...params,
        page: 0,
        size: 0,
        businessObjectCode,
        enabledFlag: true,
        publishStatus: `${PublishStatus.MODIFIED}, ${PublishStatus.UNPUBLISHED}`,
        sourceType: 'COMPONENT_TEMPLATE'
      };
      if (isTenantRoleLevel()) {
        queryObj.pageType = 'CUSTOM';
      }
      return {
        url: `${lowcodeOrganizationURL({
          route: HZERO_HLOD
        })}/pages/bo-page/page`,
        method: 'GET',
        // FIXME: method必须全大写 GET POST DELETE PUT
        headers: {
          'domain-id': domainId
        },
        params: queryObj
      };
    }
  },
  fields: [{
    name: 'pageName',
    label: intl.get('hmde.bo.field.compTemplateName').d('名称'),
    type: 'intl'
  }, {
    name: 'pageCode',
    label: intl.get('hmde.bo.field.compTemplateCode').d('编码'),
    type: 'string'
  }, {
    name: 'platform',
    type: 'string',
    label: intl.get('hmde.bo.field.compTemplatePlatform').d('类别')
  }, {
    name: 'publishStatus',
    type: 'string',
    label: intl.get('hmde.common.publishStatus').d('发布状态')
  }],
  queryFields: [{
    name: 'pageName',
    label: intl.get('hmde.bo.field.compTemplateName').d('名称'),
    type: 'string'
  }, {
    name: 'pageCode',
    label: intl.get('hmde.bo.field.compTemplateCode').d('编码'),
    type: 'string'
  }, {
    name: 'platform',
    type: 'string',
    label: intl.get('hmde.bo.field.compTemplatePlatform').d('类别'),
    options: new _DataSet({
      paging: false,
      data: [{
        value: platformType.PC,
        meaning: intl.get('hmde.common.platformPc').d('PC端')
      }, {
        value: platformType.MOBILE,
        meaning: intl.get('hmde.common.platformMobile').d('移动端')
      }]
    })
  }, {
    name: 'publishStatus',
    type: 'string',
    label: intl.get('hmde.common.publishStatus').d('发布状态'),
    options: new _DataSet({
      paging: false,
      data: [
      // {
      //   value: PublishStatus.PUBLISHED,
      //   meaning: intl.get('hmde.common.status.published').d('已发布'),
      // },
      {
        value: PublishStatus.UNPUBLISHED,
        meaning: intl.get('hmde.common.status.unpublished').d('未发布')
      }, {
        value: PublishStatus.MODIFIED,
        meaning: intl.get('hmde.common.status.modified').d('已修改')
      }]
    })
  }]
});
export const TemplatePageDS = (businessObjectCode, domainId) => ({
  autoCreate: true,
  fields: [{
    name: 'pageName',
    label: intl.get('hmde.bo.field.compTemplateName').d('名称'),
    type: 'intl',
    required: true,
    maxLength: 60
    // validator: async (value, nu, record) => {
    //   if (!value) return false;
    //   if (!record?.get('pageName')) {
    //     return intl.get('hmde.bo.businessObject.compTemplateNameError').d('预设页面名称不能为空');
    //   }
    //   if (value === record.getPristineValue('pageName')) {
    //     return;
    //   }
    //   // 校验方法
    //   const query = {
    //     businessObjectCode,
    //     pageName: value,
    //     sourceType: 'COMPONENT_TEMPLATE',
    //   };
    //   const res = await pageNameCheck(query, { 'domain-id': domainId });
    //   if (res && res.failed) {
    //     return (
    //       res?.message ||
    //       intl
    //         .get('hmde.bo.businessObject.compTemplateNameNameErrorRepeat')
    //         .d('同一业务对象下预设页面名称/代码不能重复')
    //     );
    //   }
    // },
  }, {
    name: 'pageCode',
    label: intl.get('hmde.bo.field.compTemplateCode').d('编码'),
    required: true,
    maxLength: 60 - codeHandle(businessObjectCode).length,
    format: 'uppercase',
    validator: async (value, nu, record) => {
      if (!value) return false;
      if (!(record !== null && record !== void 0 && record.get('pageCode'))) {
        return intl.get('hmde.bo.businessObject.compTemplateCodeError').d('预设页面代码不能为空');
      }
      if (value === record.getPristineValue('pageCode')) {
        return;
      }

      // 校验方法
      const query = {
        businessObjectCode,
        pageCode: codeHandle(businessObjectCode) + value,
        sourceType: 'COMPONENT_TEMPLATE'
      };
      const res = await pageNameCheck(query, {
        'domain-id': domainId
      });
      if (res && res.failed) {
        return (res === null || res === void 0 ? void 0 : res.message) || intl.get('hmde.bo.businessObject.compTemplateNameErrorRepeat').d('已存在相同编码的预设页面');
      }
    }
  }, {
    name: 'remark',
    label: intl.get('hmde.common.remark').d('描述'),
    maxLength: 240
  }]
});
export default ((businessObjectCode, domainId, isEdit) => ({
  autoQuery: false,
  // autoCreate: true,
  autoCreate: false,
  paging: false,
  selection: false,
  fields: [{
    name: 'platform',
    type: 'string',
    label: intl.get('hmde.bo.field.compTemplatePlatform').d('类别')
  }, {
    name: 'pageName',
    label: intl.get('hmde.bo.field.compTemplateName').d('名称'),
    type: 'intl',
    required: true,
    maxLength: 60
    // validator: async (value, nu, record) => {
    //   if (!value) return false;
    //   if (!record?.get('pageName')) {
    //     return intl.get('hmde.bo.businessObject.compTemplateNameError').d('预设页面名称不能为空');
    //   }
    //   if (isEdit && value === record.getPristineValue('pageName')) {
    //     return;
    //   }
    //   // 校验方法
    //   const query = {
    //     businessObjectCode,
    //     pageName: value,
    //     sourceType: 'COMPONENT_TEMPLATE',
    //   };
    //   const res = await pageNameCheck(query, { 'domain-id': domainId });
    //   if (res && res.failed) {
    //     return (
    //       res?.message ||
    //       intl
    //         .get('hmde.bo.businessObject.compTemplateNameNameErrorRepeat')
    //         .d('同一业务对象下预设页面名称/代码不能重复')
    //     );
    //   }
    // },
  }, {
    name: 'pageCode',
    label: intl.get('hmde.bo.field.compTemplateCode').d('编码'),
    required: true,
    maxLength: 60 - codeHandle(businessObjectCode).length
    // validator: async (value, nu, record) => {
    //   if (!value) return false;
    //   if (!record?.get('pageCode')) {
    //     return intl.get('hmde.bo.businessObject.compTemplateCodeError').d('预设页面代码不能为空');
    //   }
    //
    //   if (isEdit && value === record.getPristineValue('pageCode')) {
    //     return;
    //   }
    //
    //   // 校验方法
    //   const query = {
    //     businessObjectCode,
    //     pageCode: codeHandle(businessObjectCode) + value,
    //     sourceType: 'COMPONENT_TEMPLATE',
    //   };
    //   const res = await pageNameCheck(query, { 'domain-id': domainId });
    //   if (res && res.failed) {
    //     return (
    //       res?.message ||
    //       intl
    //         .get('hmde.bo.businessObject.compTemplateNameErrorRepeat')
    //         .d('同一业务对象下预设页面名称/代码不能重复')
    //     );
    //   }
    // },
  }, {
    name: 'pageCategory',
    type: 'string',
    label: intl.get('hmde.bo.businessObject.publishCompTemplateType').d('预设页面类型'),
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
    help: '请至"值集配置" 菜单下，预先维护域名值集(HLOD.BUSINESS_COMPONENT.DOMAIN)'
  }, {
    name: 'remark',
    label: intl.get('hmde.common.remark').d('描述'),
    maxLength: 240
  }, {
    name: 'enabledFlag',
    type: 'boolean',
    label: intl.get('hmde.common.status').d('状态'),
    trueValue: true,
    falseValue: false
  }, {
    name: 'pageType',
    type: 'string',
    label: intl.get('hmde.bo.businessObject.templateSource').d('来源'),
    // lookupCode: 'HLOD.BUSINESS_OBJECT_PAGE.SOURCE_TYPE',
    options: new _DataSet({
      paging: false,
      data: [{
        value: 'STANDARD',
        meaning: intl.get(`hmde.common.predefined`).d('预定义')
      }, {
        value: 'CUSTOM',
        meaning: intl.get(`hmde.common.custom`).d('自定义')
      }]
    })
  }, {
    name: 'publishStatus',
    type: 'string',
    label: intl.get('hmde.common.publishStatus').d('发布状态')
  }, {
    name: 'creator',
    type: 'string',
    label: intl.get('hmde.common.createBy').d('创建人')
  }, {
    name: 'creationDate',
    type: 'string',
    label: intl.get('hmde.common.createTime').d('创建时间')
  }, {
    name: 'updater',
    type: 'string',
    label: intl.get('hmde.common.updatedBy').d('更新人')
  }, {
    name: 'lastUpdateDate',
    type: 'string',
    label: intl.get('hmde.common.lastUpdateDate').d('更新时间')
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

      // const {
      //   pageCategory,
      //   businessComponentPath,
      //   businessComponentCode,
      //   businessComponentDomain,
      // } = data[0];
      // const customObj = {};
      // if (pageCategory === 'BUSINESS_COMPONENT') {
      //   customObj.businessComponentPath = businessComponentPath;
      //   customObj.businessComponentCode = businessComponentCode;
      //   customObj.businessComponentDomain = businessComponentDomain;
      // }
      // const saveData = {
      //   domainId,
      //   orderSeq: 0,
      //   sourceType: 'COMPONENT_TEMPLATE',
      //   businessObjectCode,
      //   ...pick(data[0], ['pageCategory', '_tls'], {}),
      //   ...customObj,
      //   pages: params.pages,
      //   pageTemplate: params.pageTemplate,
      // };
      // return {
      //   url: `${lowcodeOrganizationURL({ route: HZERO_HLOD })}/pages/component-template`,
      //   method: 'POST',
      //   data: saveData,
      //   params: { businessObjectCode },
      // };
    }
  }
}));

// 保存页面
export async function savePage(data) {
  const _data$ = data[0],
    pageCategory = _data$.pageCategory,
    businessComponentPath = _data$.businessComponentPath,
    businessComponentCode = _data$.businessComponentCode,
    businessComponentDomain = _data$.businessComponentDomain,
    params = _data$.params;
  const customObj = {};
  if (pageCategory === 'BUSINESS_COMPONENT') {
    customObj.businessComponentPath = businessComponentPath;
    customObj.businessComponentCode = businessComponentCode;
    customObj.businessComponentDomain = businessComponentDomain;
  }
  const saveData = {
    domainId: params.domainId,
    orderSeq: 0,
    sourceType: 'COMPONENT_TEMPLATE',
    businessObjectCode: params.businessObjectCode,
    ..._pick(data[0], ['pageCategory', '_tls'], {}),
    ...customObj,
    pages: params.pages,
    pageTemplate: params.pageTemplate
  };
  return request(`${API_HOST}${lowcodeOrganizationURL({
    route: HZERO_HLOD
  })}/pages/component-template`, {
    method: 'POST',
    body: saveData,
    params: {
      businessObjectCode: params.businessObjectCode
    }
  });
}