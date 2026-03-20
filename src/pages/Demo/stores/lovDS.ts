import {FieldIgnore, FieldType} from 'choerodon-ui/dataset/data-set/enum';
import {DataSet} from 'choerodon-ui/pro';




const lovDS = {
  primaryKey: 'code',
  // data: [
  //   // { 'code_code': 'HR.EMPLOYEE_GENDER, HR.EMPLOYEE_STATUS, SYS.USER_STATUS11' , 'code_description': '性别,员工状态,SYS.USER_STATUS11' },
  //   {
  //     code_code: 'HR.EMPLOYEE_GENDER,HR.EMPLOYEE_STATUS',
  //     code_description: '性别,员工状态',
  //   },
  // ],
  fields: [
    {
      label: '标题',
      name: 'code',
      type: FieldType.object,
      lovCode: 'SCM.SUPPLIER',
      multiple: true,
      // lovDefineUrl: () => `http://localhost:8088/demo/lov`,
      // lovQueryUrl: `http://localhost:8088/demo/lov-data`,
      // lovQueryUrl: `https://beta-hzero-gateway.imiracle.tech/hscm/v1/6/suppliers?page=0&size=10`,
      noCache: true,
      ignore: FieldIgnore.always,
      textField: 'supplierShortName',  // 显示在输入框的字段
      // lovDefineAxiosConfig: (code, field) => {
      //   return {
      //     // url: `http://localhost:8088/demo/lov?viewCode=${code}`,
      //     url: `https://beta-hzero-gateway.imiracle.tech/hpfm/v1/6/lov-view/info?viewCode=SCM.SUPPLIER`,
      //     method: 'get',
      //   };
      // },
      // lovQueryAxiosConfig: (code, lovConfig, props, lovQueryUrl) => {
      //   console.log('lovQueryAxiosConfig', props);
      //   const { params, lovQueryDetail } = props || {};
      //   let defaultUrl = `/common/lov/dataset/${code}${
      //     code === 'LOV_CODE' && params
      //       ? `/${params.pagesize}/${params.page}`
      //       : ''
      //   }`;
      //   defaultUrl = lovQueryDetail
      //     ? lovConfig
      //       ? lovConfig.detailUrl
      //       : `/common/lov/dataset/detail/${code}`
      //     : defaultUrl;
      //   return {
      //     url: 'http://localhost:8088/demo/lov-data',
      //     method: 'get',
      //   };
      // },
    },
    {
      name: 'code_code',
      type: FieldType.string,
      bind: 'code.code',
    },
    {
      name: 'code_description',
      type: FieldType.string,
      bind: 'code.description',
    },
  ],
};

export default lovDS;




