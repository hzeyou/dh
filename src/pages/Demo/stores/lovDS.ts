import {FieldType} from 'choerodon-ui/dataset/data-set/enum';
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
      name: 'code',
      type: 'object',
      lovCode: 'SCM.SUPPLIER',
      multiple: true,
      lovDefineUrl: `http://localhost:8088/demo/lov`,
      lovQueryUrl: `http://localhost:8088/demo/lov-data`,
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
      type: 'string',
      bind: 'code.code',
      multiple: ',',
    },
    {
      name: 'code_description',
      type: 'string',
      bind: 'code.description',
      multiple: ',',
    },
  ],
  selection: 'multiple',
};

export default lovDS;




