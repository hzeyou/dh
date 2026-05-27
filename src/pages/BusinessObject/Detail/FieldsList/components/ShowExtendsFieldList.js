import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import React, { useMemo } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { TableMode, TableQueryBarType } from 'choerodon-ui/pro/lib/table/enum';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { getResponse } from 'utils/utils';
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { lowcodeOrganizationURL, uuid } from "hzero-front-hmde/lib/utils/common";
import { createTemplateField, extendsCreateTemplateField } from "hzero-front-hmde/lib/services/businessObjectService";
var FN = /*#__PURE__*/function (FN) {
  FN["TEMPLATE_NAME"] = "templateFieldName";
  FN["TEMPLATE_CODE"] = "templateFieldCode";
  FN["TEMPLATE_NAME_SEARCH"] = "templateName";
  FN["TEMPLATE_CODE_SEARCH"] = "templateCode";
  FN["COMPONENT_TYPE_MEADING"] = "componentTypeMeaning";
  FN["COMPONENT_TYPE"] = "componentType";
  FN["COMPONENT_TYPES"] = "componentTypes";
  FN["FIELD_BEHAVIORR_MEANING"] = "fieldBehaviorMeaning";
  FN["FIELD_BEHAVIORR"] = "fieldBehavior";
  FN["TYPE_C"] = "typeC";
  return FN;
}(FN || {});
const ShowExtendsFieldDetail = ({
  baseInfoDS,
  modal,
  listTableDS,
  isExtendTable
}) => {
  // 拍平树结构
  const flathandleData = data => {
    let fieldList = [];
    const originData = data === null || data === void 0 ? void 0 : data.map(item => {
      const _uuid = uuid();
      Object.assign(item, {
        id: _uuid,
        templateFieldName: item.templateName,
        templateFieldCode: item.templateCode,
        typeC: '模版'
      });
      // 处理字段
      if (item !== null && item !== void 0 && item.domainTemplateFields) {
        var _item$domainTemplateF;
        const arr = item === null || item === void 0 ? void 0 : (_item$domainTemplateF = item.domainTemplateFields) === null || _item$domainTemplateF === void 0 ? void 0 : _item$domainTemplateF.map(i => {
          return {
            ...i,
            parentId: item.id || _uuid,
            typeC: '字段',
            id: uuid()
          };
        });
        fieldList = [...fieldList, ...arr];
      }
      return item;
    });
    return [...originData, ...fieldList];
  };

  // 这里面可以控制node结点的判断来实现是否展示为叶结点
  const nodeCover = ({
    record
  }) => {
    const nodeProps = {
      isLeaf: false
    };
    if (!(record !== null && record !== void 0 && record.get('domainTemplateFields'))) {
      nodeProps.isLeaf = true;
    }
    return nodeProps;
  };
  /** 扩展字段字段打开模板字段 */
  const extendsProps = useMemo(() => {
    return isExtendTable ? {
      paging: true,
      queryFields: [{
        label: intl.get('hmde.common.fieldCode').d('字段编码'),
        name: FN.TEMPLATE_CODE,
        type: "string"
      }, {
        label: intl.get('hmde.common.fieldType').d('字段类型'),
        name: FN.COMPONENT_TYPES,
        type: "auto",
        multiple: true,
        lookupCode: 'HMDE.BUSINESS_OBJECT.FIELD_TYPE'
      }],
      transport: {
        read: ({
          params
        }) => {
          var _baseInfoDS$current, _baseInfoDS$current2, _baseInfoDS$current3;
          // 扩展表的
          const domainId = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('domainId');
          const businessObjectId = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : _baseInfoDS$current2.get('businessObjectId');
          const flexFieldEnabledFlag = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current3 = baseInfoDS.current) === null || _baseInfoDS$current3 === void 0 ? void 0 : _baseInfoDS$current3.get('flexFieldEnabledFlag');
          return {
            url: `${lowcodeOrganizationURL({
              route: HZERO_HMDE
            })}/domain-template-fields/page/no-used`,
            method: 'GET',
            params: {
              ...params,
              domainId,
              businessObjectId,
              category: flexFieldEnabledFlag ? 'FLEX_FIELD' : 'EXTEND_TABLE'
            }
          };
        }
      }
    } : {};
  }, []);
  const tableDs = useMemo(() => new _DataSet({
    autoQuery: true,
    primaryKey: 'id',
    parentField: 'parentId',
    idField: 'id',
    paging: false,
    transport: {
      read: ({
        params
      }) => {
        var _baseInfoDS$current4, _baseInfoDS$current5, _baseInfoDS$current6;
        const searchValue = baseInfoDS !== null && baseInfoDS !== void 0 && (_baseInfoDS$current4 = baseInfoDS.current) !== null && _baseInfoDS$current4 !== void 0 && _baseInfoDS$current4.get('updatePhysicalFlag') ? '&positiveEnabledFlag=true' : '&reverseEnabledFlag=true';
        return {
          url: `${lowcodeOrganizationURL({
            route: HZERO_HMDE
          })}/domain-template/relation-no-create-check?repeatFlag=false&businessObjectId=${encodeURIComponent(baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current5 = baseInfoDS.current) === null || _baseInfoDS$current5 === void 0 ? void 0 : _baseInfoDS$current5.get('businessObjectId'))}&domainId=${encodeURIComponent(baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current6 = baseInfoDS.current) === null || _baseInfoDS$current6 === void 0 ? void 0 : _baseInfoDS$current6.get('domainId'))}${searchValue}`,
          method: 'GET',
          params,
          transformResponse: res => {
            try {
              const resData = JSON.parse(res);
              const _data = flathandleData(resData);
              return _data || [];
            } catch (error) {
              return [];
            }
          }
        };
      }
    },
    queryFields: [{
      label: intl.get('hmde.common.fieldName').d('字段名称'),
      name: FN.TEMPLATE_NAME,
      type: "string"
    }, {
      label: intl.get('hmde.common.templateName').d('模板名称'),
      name: FN.TEMPLATE_NAME_SEARCH,
      type: "string"
    }, {
      label: intl.get('hmde.common.fieldCode').d('字段编码'),
      name: FN.TEMPLATE_CODE,
      type: "string"
    }, {
      label: intl.get('hmde.common.templateCode').d('模板编码'),
      name: FN.TEMPLATE_CODE_SEARCH,
      type: "string"
    }, {
      label: intl.get('hmde.common.fieldType').d('字段类型'),
      name: FN.COMPONENT_TYPES,
      type: "auto",
      multiple: true,
      lookupCode: 'HMDE.BUSINESS_OBJECT.FIELD_TYPE'
    }, {
      label: intl.get('hmde.common.extendsWhoField').d('继承行为'),
      name: FN.FIELD_BEHAVIORR,
      type: "auto",
      lookupCode: 'HMDE.FIELD.BEHAVIOR'
    }],
    fields: [{
      label: intl.get('hmde.common.name').d('名称'),
      name: FN.TEMPLATE_NAME,
      type: "string"
    }, {
      label: intl.get('hmde.common.code').d('编码'),
      name: FN.TEMPLATE_CODE,
      type: "string"
    }, {
      label: intl.get('hmde.common.fieldType').d('字段类型'),
      name: FN.COMPONENT_TYPE_MEADING,
      type: "auto",
      multiple: true
    }, {
      label: intl.get('hmde.common.extendsWhoField').d('继承行为'),
      name: FN.FIELD_BEHAVIORR_MEANING,
      type: "auto"
    }, {
      label: intl.get('hmde.bo.authorityControl.function').d('功能'),
      name: FN.TYPE_C,
      type: "string"
    }],
    events: {
      batchSelect: ({
        dataSet,
        record
      }) => {
        var _tableDs$selected;
        modal === null || modal === void 0 ? void 0 : modal.update({
          okProps: {
            disabled: !(tableDs !== null && tableDs !== void 0 && (_tableDs$selected = tableDs.selected) !== null && _tableDs$selected !== void 0 && _tableDs$selected.length)
          }
        });
        // 判断是否编码重复, 继承行为重复
        !isExtendTable && selectFieldCheck(dataSet, record);
      },
      batchUnSelect: () => {
        var _tableDs$selected2;
        modal === null || modal === void 0 ? void 0 : modal.update({
          okProps: {
            disabled: !(tableDs !== null && tableDs !== void 0 && (_tableDs$selected2 = tableDs.selected) !== null && _tableDs$selected2 !== void 0 && _tableDs$selected2.length)
          }
        });
      }
    },
    ...extendsProps
  }), []);
  const selectFieldCheck = (dataSet, record) => {
    if (record !== null && record !== void 0 && record.get('parentId')) {
      dataSet.forEach(v => {
        if ((v === null || v === void 0 ? void 0 : v.get('id')) === (record === null || record === void 0 ? void 0 : record.get('id'))) {
          var _dataSet$selected, _dataSet$selected2;
          let repeatItem;
          // 继承行为重复 需要 提示
          const repeatList = dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$selected = dataSet.selected) === null || _dataSet$selected === void 0 ? void 0 : _dataSet$selected.filter(it => (record === null || record === void 0 ? void 0 : record.get('fieldBehavior')) && (it === null || it === void 0 ? void 0 : it.get('fieldBehavior')) === (record === null || record === void 0 ? void 0 : record.get('fieldBehavior')));
          // 字段编码重复 需要 提示
          const repeatList2 = dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$selected2 = dataSet.selected) === null || _dataSet$selected2 === void 0 ? void 0 : _dataSet$selected2.filter(it => (it === null || it === void 0 ? void 0 : it.get('templateFieldCode')) === (record === null || record === void 0 ? void 0 : record.get('templateFieldCode')));
          if ((repeatList === null || repeatList === void 0 ? void 0 : repeatList.length) > 1) {
            repeatItem = repeatList === null || repeatList === void 0 ? void 0 : repeatList.find(it => (it === null || it === void 0 ? void 0 : it.get('id')) !== (record === null || record === void 0 ? void 0 : record.get('id')));
          } else if ((repeatList2 === null || repeatList2 === void 0 ? void 0 : repeatList2.length) > 1) {
            repeatItem = repeatList2 === null || repeatList2 === void 0 ? void 0 : repeatList2.find(it => (it === null || it === void 0 ? void 0 : it.get('id')) !== (record === null || record === void 0 ? void 0 : record.get('id')));
          }
          if (repeatItem) {
            var _repeatItem, _repeatItem2;
            dataSet === null || dataSet === void 0 ? void 0 : dataSet.unSelect(record);
            _Modal.open({
              key: _Modal.key(),
              title: intl.get('hmde.common.tips').d('提示'),
              children: `${intl.get('hmde.bo.businessObject.Samechecked').d('已勾选相同')}${(repeatList === null || repeatList === void 0 ? void 0 : repeatList.length) > 1 ? intl.get('hmde.common.extendsWhoField').d('继承行为') : intl.get('hmde.common.code').d('编码')}${intl.get('hmde.bo.businessObject.thefields').d('的字段')}【${(_repeatItem = repeatItem) === null || _repeatItem === void 0 ? void 0 : _repeatItem.get(FN.TEMPLATE_NAME)}（${(_repeatItem2 = repeatItem) === null || _repeatItem2 === void 0 ? void 0 : _repeatItem2.get(FN.TEMPLATE_CODE)}）】，${intl.get('hmde.bo.businessObject.thefieldstip2').d('点击确定则会取消勾选，调整为当前字段，是否确定')}？`,
              closable: true,
              onOk: async () => {
                repeatList === null || repeatList === void 0 ? void 0 : repeatList.forEach(it => dataSet === null || dataSet === void 0 ? void 0 : dataSet.unSelect(it));
                repeatList2 === null || repeatList2 === void 0 ? void 0 : repeatList2.forEach(it => dataSet === null || dataSet === void 0 ? void 0 : dataSet.unSelect(it));
                dataSet === null || dataSet === void 0 ? void 0 : dataSet.select(record);
              }
            });
          }
        }
      });
    }
  };
  modal === null || modal === void 0 ? void 0 : modal.handleOk(async () => {
    modal.update({
      okProps: {
        loading: true
      },
      cancelProps: {
        disabled: true
      }
    });
    if (isExtendTable) {
      var _baseInfoDS$current7, _baseInfoDS$current8, _baseInfoDS$current9;
      const businessObjectId = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current7 = baseInfoDS.current) === null || _baseInfoDS$current7 === void 0 ? void 0 : _baseInfoDS$current7.get('businessObjectId');
      const body = tableDs.selected.map(i => ({
        ...i.toData(),
        componentTypeMeaning: undefined
      }));
      const flexFieldEnabledFlag = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current8 = baseInfoDS.current) === null || _baseInfoDS$current8 === void 0 ? void 0 : _baseInfoDS$current8.get('flexFieldEnabledFlag');
      const params = {
        businessObjectId,
        tenantId: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current9 = baseInfoDS.current) === null || _baseInfoDS$current9 === void 0 ? void 0 : _baseInfoDS$current9.get('tenantId'),
        extCategory: flexFieldEnabledFlag ? 'FLEX_FIELD' : 'EXTEND_TABLE'
      };
      extendsCreateTemplateField(body, params).then(res => {
        if (getResponse(res)) {
          var _baseInfoDS$query;
          modal === null || modal === void 0 ? void 0 : modal.close();
          listTableDS === null || listTableDS === void 0 ? void 0 : listTableDS.query();
          baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$query = baseInfoDS.query) === null || _baseInfoDS$query === void 0 ? void 0 : _baseInfoDS$query.call(baseInfoDS);
        }
      }).finally(() => {
        modal.update({
          okProps: {
            loading: false
          },
          cancelProps: {
            disabled: false
          }
        });
      });
    } else {
      var _tableDs$selected3, _baseInfoDS$current10, _baseInfoDS$current11;
      const selectedData = (tableDs === null || tableDs === void 0 ? void 0 : (_tableDs$selected3 = tableDs.selected) === null || _tableDs$selected3 === void 0 ? void 0 : _tableDs$selected3.map(v => ({
        templateFieldCode: v.get('templateFieldCode'),
        templateCode: v.get('templateCode')
      }))) || [];
      createTemplateField({
        body: selectedData,
        query: {
          tenantId: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current10 = baseInfoDS.current) === null || _baseInfoDS$current10 === void 0 ? void 0 : _baseInfoDS$current10.get('tenantId'),
          businessObjectId: baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current11 = baseInfoDS.current) === null || _baseInfoDS$current11 === void 0 ? void 0 : _baseInfoDS$current11.get('businessObjectId')
        }
      }).then(res => {
        if (getResponse(res)) {
          var _baseInfoDS$query2;
          modal === null || modal === void 0 ? void 0 : modal.close();
          listTableDS === null || listTableDS === void 0 ? void 0 : listTableDS.query();
          baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$query2 = baseInfoDS.query) === null || _baseInfoDS$query2 === void 0 ? void 0 : _baseInfoDS$query2.call(baseInfoDS);
        }
      }).finally(() => {
        modal.update({
          okProps: {
            loading: false
          },
          cancelProps: {
            disabled: false
          }
        });
      });
    }
    return false;
  });
  const columns = [{
    name: FN.TEMPLATE_NAME,
    renderer: ({
      record
    }) => {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center'
        }
      }, /*#__PURE__*/React.createElement("span", null, record === null || record === void 0 ? void 0 : record.get(FN.TEMPLATE_NAME)));
    }
  }, {
    name: FN.TEMPLATE_CODE
  }, {
    name: FN.TYPE_C
  }, {
    name: FN.COMPONENT_TYPE_MEADING
  }, {
    name: FN.FIELD_BEHAVIORR_MEANING
  }];
  const extendColumns = [{
    name: FN.TEMPLATE_CODE
  }, {
    name: FN.COMPONENT_TYPE_MEADING
  }];
  return isExtendTable ? /*#__PURE__*/React.createElement(_Table, {
    dataSet: tableDs,
    mode: "list",
    queryBar: "filterBar",
    queryBarProps: {
      fuzzyQuery: false
    },
    columns: extendColumns
  }) : /*#__PURE__*/React.createElement(_Table, {
    dataSet: tableDs,
    defaultRowExpanded: true
    // virtualCell={false}
    ,
    mode: "tree",
    queryBar: "filterBar",
    queryBarProps: {
      fuzzyQueryPlaceholder: intl.get('hmde.bo.businessObject.codeorname').d('请输入字段名称、模板名称')
    },
    selectionBoxRenderer: ({
      record,
      element
    }) => record !== null && record !== void 0 && record.get('parentId') ? element : null,
    columns: columns,
    onRow: nodeCover
  });
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(ShowExtendsFieldDetail));