import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Switch from "@hzero-front-ui/c7n-ui/lib/SwitchPro";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _IntlField from "@hzero-front-ui/c7n-ui/lib/IntlFieldPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
/*
 * @Descripttion: 业务对象详情基础信息维护界面
 * @Date: 2021-08-05 10:10:51
 * @Author: ZHIJIAN.XU@HAND-CHINA.COM
 * @version: 0.0.1
 * @copyright: Copyright (c) 2021, Hand
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { getResponse, isTenantRoleLevel } from 'utils/utils';
import intl from 'utils/intl';
// import qs from 'qs';
import formatterCollections from 'utils/intl/formatterCollections';
import { TagRender } from 'utils/renderer';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import { IntlType } from 'choerodon-ui/pro/lib/intl-field/enum';
import { ButtonType } from 'choerodon-ui/pro/lib/button/enum';
import { LabelAlign } from 'choerodon-ui/pro/lib/form/enum';
import { TableQueryBarType } from 'choerodon-ui/pro/lib/table/enum';
import { closeTab, openTab } from 'utils/menuTab';
import LabelTitleRender from "hzero-front-hmde/lib/businessComponents/LabelTitleRender";
import { PublishStatus, SourceType } from "hzero-front-apaas/lib/constants/businessObject";
import SectionTitle from "hzero-front-apaas/lib/components/SectionTitle";
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
import { PhysicalModelType, BusinessObjectCategory } from "hzero-front-hmde/lib/constants/businessObject";
import { TAB_KEYS } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/TabItemList";
import { getTimeFormat } from "hzero-front-hmde/lib/utils/common";
import ExtendsTableDS from "./ExtendsTableDS";
import style from "../index.less?modules";
const enableAutoCreateFlagList = () => [{
  status: false,
  color: 'green',
  text: intl.get('hmde.common.link').d('关联')
}, {
  status: true,
  color: 'red',
  text: intl.get('hmde.common.status.notRelation').d('未关联')
}];
const enableList = () => [{
  status: true,
  color: 'green',
  text: intl.get('hmde.common.button.enable').d('启用')
}, {
  status: false,
  color: 'red',
  text: intl.get('hmde.common.button.disabled').d('禁用')
}];
let lovModal;
const isTenant = isTenantRoleLevel();
const BaseInfo = props => {
  var _boStore$getState, _boStore$getState$cur, _boStore$getState2, _basicFormDs$current3, _basicFormDs$current4, _basicFormDs$current5, _basicFormDs$current14, _basicFormDs$current15, _basicFormDs$current16, _basicFormDs$current17, _basicFormDs$current18, _basicFormDs$current19, _basicFormDs$current20, _basicFormDs$current21, _basicFormDs$current22, _basicFormDs$current23, _basicFormDs$current24, _basicFormDs$current25, _basicFormDs$current26, _basicFormDs$current27, _basicFormDs$current28, _basicFormDs$current29;
  const readOnlyFlag = props.readOnlyFlag;
  const basicFormDs = props === null || props === void 0 ? void 0 : props.dataSet;
  const boStore = useBoStore();
  const middleLinkBusinessObjects = boStore === null || boStore === void 0 ? void 0 : (_boStore$getState = boStore.getState('baseInfoDS')) === null || _boStore$getState === void 0 ? void 0 : (_boStore$getState$cur = _boStore$getState.current) === null || _boStore$getState$cur === void 0 ? void 0 : _boStore$getState$cur.get('middleLinkBusinessObjects');
  const hasPermission = (_boStore$getState2 = boStore === null || boStore === void 0 ? void 0 : boStore.getState('hasPermission')) !== null && _boStore$getState2 !== void 0 ? _boStore$getState2 : true;
  const extendsTableDS = useMemo(() => new _DataSet({
    ...ExtendsTableDS()
  }), []);
  const boDetailTabActiveKey = boStore === null || boStore === void 0 ? void 0 : boStore.getState('boDetailTabActiveKey');
  const handleSaveBaseInfo = async () => {
    var _basicFormDs$current, _basicFormDs$current2;
    if ((await ((_basicFormDs$current = basicFormDs.current) === null || _basicFormDs$current === void 0 ? void 0 : _basicFormDs$current.validate())) && (_basicFormDs$current2 = basicFormDs.current) !== null && _basicFormDs$current2 !== void 0 && _basicFormDs$current2.dirty) {
      const res = await basicFormDs.submit();
      if (getResponse(res)) {
        handleUpdateBaseIn();
        return true;
      }
    }
  };
  const handleUpdateBaseIn = () => {
    basicFormDs.query();
  };
  const sourceType = (_basicFormDs$current3 = basicFormDs.current) === null || _basicFormDs$current3 === void 0 ? void 0 : _basicFormDs$current3.get('sourceType');
  const extendTableEnabledFlag = (_basicFormDs$current4 = basicFormDs.current) === null || _basicFormDs$current4 === void 0 ? void 0 : _basicFormDs$current4.get('extendTableEnabledFlag');
  basicFormDs.setState('extendTableEnabledFlag', extendTableEnabledFlag);
  // 租户看到的平台标准对象禁用
  const tenantDisabled = sourceType === SourceType.PREDEFINE || isTenant && sourceType === SourceType.PLATFORM;
  // 租户层SQL对象不可修改基础信息
  const tenantSqlObjectDisabled = isTenant && ((_basicFormDs$current5 = basicFormDs.current) === null || _basicFormDs$current5 === void 0 ? void 0 : _basicFormDs$current5.get('physicalModelType')) === PhysicalModelType.SQL && sourceType === SourceType.INHERIT;

  // const goCommonApi = () => {
  //   const {
  //     businessObjectId,
  //     domainId,
  //     businessObjectName,
  //     businessObjectCode,
  //   } = basicFormDs.current?.toData();
  //   history.push({
  //     pathname: '/hmde/business-object/base-info/api',
  //     search: qs.stringify({
  //       businessObjectId,
  //       domainId,
  //       businessObjectName,
  //       businessObjectCode,
  //     }),
  //   });
  // };

  const handleExtentsTable = useCallback(() => {
    lovModal = _Modal.open({
      title: intl.get('hmde.bo.businessObject.extendedbusinessmodel').d('请选择扩展业务模型'),
      key: _Modal.key(),
      maskClosable: false,
      keyboardClosable: false,
      closable: false,
      style: {
        width: 800
      },
      children: /*#__PURE__*/React.createElement(_Table, {
        dataSet: extendsTableDS,
        queryBar: "filterBar",
        queryBarProps: {
          fuzzyQueryPlaceholder: intl.get('hmde.bo.businessObject.pleaseentertablename').d('请输入表名')
        }
      }, /*#__PURE__*/React.createElement(_Table.Column, {
        name: "name",
        width: 200
      }), /*#__PURE__*/React.createElement(_Table.Column, {
        name: "serviceCode",
        width: 200
      }), /*#__PURE__*/React.createElement(_Table.Column, {
        name: "schemaName",
        width: 200
      }), /*#__PURE__*/React.createElement(_Table.Column, {
        name: "dataSourceType",
        width: 150
      })),
      onOk: () => {
        if (extendsTableDS.selected.length > 0) {
          _Modal.confirm({
            title: intl.get('hmde.common.tips').d('提示'),
            children: intl.get('hmde.bo.businessObject.ensuretablename').d('是否关联扩展物理模型，已存在扩展字段会被覆盖，确定后不可再更改扩展物理模型！'),
            onOk: async () => {
              var _basicFormDs$current6, _basicFormDs$current7, _basicFormDs$current8, _basicFormDs$current9;
              // eslint-disable-next-line no-unused-expressions
              (_basicFormDs$current6 = basicFormDs.current) === null || _basicFormDs$current6 === void 0 ? void 0 : _basicFormDs$current6.set('extendsTableId', extendsTableDS.selected[0].get('id'));
              // eslint-disable-next-line no-unused-expressions
              (_basicFormDs$current7 = basicFormDs.current) === null || _basicFormDs$current7 === void 0 ? void 0 : _basicFormDs$current7.set('extendsTableName', extendsTableDS.selected[0].get('name'));
              if ((await ((_basicFormDs$current8 = basicFormDs.current) === null || _basicFormDs$current8 === void 0 ? void 0 : _basicFormDs$current8.validate())) && (_basicFormDs$current9 = basicFormDs.current) !== null && _basicFormDs$current9 !== void 0 && _basicFormDs$current9.dirty) {
                const res = await basicFormDs.submit();
                if (getResponse(res)) {
                  lovModal.close();
                  await basicFormDs.query();
                }
              }
            }
          });
        }
        return false;
      },
      onCancel: () => {
        // eslint-disable-next-line no-unused-expressions
        basicFormDs === null || basicFormDs === void 0 ? void 0 : basicFormDs.reset();
      }
    });
    return lovModal;
  }, [lovModal]);
  useEffect(() => {
    var _basicFormDs$current10;
    if (((_basicFormDs$current10 = basicFormDs.current) === null || _basicFormDs$current10 === void 0 ? void 0 : _basicFormDs$current10.get('publishStatus')) === PublishStatus.UNPUBLISHED && !isTenant) {
      var _basicFormDs$current11, _basicFormDs$getField;
      let boFock = basicFormDs.current.get('businessObjectCode');
      let getAddonBefore = '';
      const domainCode = (_basicFormDs$current11 = basicFormDs.current) === null || _basicFormDs$current11 === void 0 ? void 0 : _basicFormDs$current11.get('domainCode');
      if (domainCode) {
        var _boFock, _basicFormDs$current12, _basicFormDs$current13;
        getAddonBefore += `${domainCode}_`;
        boFock = (_boFock = boFock) === null || _boFock === void 0 ? void 0 : _boFock.replace(`${domainCode}_`, '');
        (_basicFormDs$current12 = basicFormDs.current) === null || _basicFormDs$current12 === void 0 ? void 0 : (_basicFormDs$current13 = _basicFormDs$current12.init) === null || _basicFormDs$current13 === void 0 ? void 0 : _basicFormDs$current13.call(_basicFormDs$current12, 'boFock', boFock);
        basicFormDs === null || basicFormDs === void 0 ? void 0 : basicFormDs.setState('getAddonBefore', getAddonBefore);
      }

      // 还需要设置效验规则
      basicFormDs === null || basicFormDs === void 0 ? void 0 : (_basicFormDs$getField = basicFormDs.getField('boFock')) === null || _basicFormDs$getField === void 0 ? void 0 : _basicFormDs$getField.set('validator', recordValue => {
        const pattern = /^[A-Z0-9_]*$/;
        if (!pattern.test(recordValue)) {
          return intl.get('hmde.bo.businessObject.patternValidation').d('支持大写字母、数字及下划线组合');
        }
      });
    }
  }, [basicFormDs.current]);
  const goToDetail = record => {
    closeTab('/hmde/physical-model');
    openTab({
      key: `/hmde/physical-model`,
      path: `/hmde/physical-model`,
      closable: true,
      title: '物理模型',
      state: {
        physicalModelId: record === null || record === void 0 ? void 0 : record.get('physicalModelId'),
        physicalModelName: record === null || record === void 0 ? void 0 : record.get('physicalModelName')
      }
    });
  };
  if (boDetailTabActiveKey === TAB_KEYS.baseInfo) {
    // 把保存方法设置到 boStore  上
    boStore === null || boStore === void 0 ? void 0 : boStore.setState('beforePublicOperate', {
      isSaveChanged: basicFormDs.dirty,
      handleSave: handleSaveBaseInfo,
      handleUpdate: handleUpdateBaseIn
    });
  }
  return /*#__PURE__*/React.createElement(_Spin, {
    dataSet: basicFormDs
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    title: intl.get('hmde.common.baseInfo').d('基础信息'),
    style: {
      fontSize: 16
    }
  }), (!isTenant && [SourceType.PLATFORM, SourceType.TENANT].includes(sourceType) || isTenant && sourceType === SourceType.TENANT) && /*#__PURE__*/React.createElement(_Button, {
    type: "submit",
    disabled: readOnlyFlag || !basicFormDs.dirty || !hasPermission || !!middleLinkBusinessObjects,
    onClick: () => handleSaveBaseInfo(),
    style: {
      marginTop: '-50px'
    }
  }, intl.get('hmde.common.button.save').d('保存'))), /*#__PURE__*/React.createElement(_Form, {
    dataSet: basicFormDs
    // useColon={false}
    ,
    columns: 3,
    disabled: readOnlyFlag || tenantDisabled || !hasPermission || !!middleLinkBusinessObjects || tenantSqlObjectDisabled,
    labelAlign: "left"
  }, sourceType === SourceType.PREDEFINE ? /*#__PURE__*/React.createElement(_Output, {
    name: "businessObjectName"
  }) : /*#__PURE__*/React.createElement(_IntlField, {
    name: "businessObjectName",
    colSpan: 1,
    suffix: /*#__PURE__*/React.createElement(_Icon, {
      type: "language"
    })
  }), ((_basicFormDs$current14 = basicFormDs.current) === null || _basicFormDs$current14 === void 0 ? void 0 : _basicFormDs$current14.get('publishStatus')) === PublishStatus.UNPUBLISHED && !isTenant ? /*#__PURE__*/React.createElement(_TextField, {
    name: "boFock",
    colSpan: 1,
    addonBefore: basicFormDs === null || basicFormDs === void 0 ? void 0 : basicFormDs.getState('getAddonBefore'),
    showLengthInfo: true
  }) : /*#__PURE__*/React.createElement(_Output, {
    name: "businessObjectCode",
    colSpan: 1
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "businessObjectCategory",
    colSpan: 1
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "physicalModelType",
    colSpan: 1
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "sourceType",
    colSpan: 1
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "publishStatus",
    colSpan: 1,
    renderer: ({
      value
    }) => {
      const statusList = [{
        status: PublishStatus.PUBLISHED,
        color: 'green',
        text: intl.get('hmde.common.status.published').d('已发布')
      }, {
        status: PublishStatus.MODIFIED,
        color: 'yellow',
        text: intl.get('hmde.common.status.modified').d('已修改')
      }, {
        status: PublishStatus.UNPUBLISHED,
        text: intl.get('hmde.common.status.unpublished').d('未发布')
      }];
      return TagRender(value, statusList);
    }
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "domainName",
    colSpan: 1
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "domainCode",
    colSpan: 1
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "serviceName",
    colSpan: 1
  }), /*#__PURE__*/React.createElement(_Output, {
    label: intl.get('hmde.common.createBy').d('创建人'),
    renderer: ({
      record
    }) => record === null || record === void 0 ? void 0 : record.get('createName'),
    colSpan: 1
  }), /*#__PURE__*/React.createElement(_Output, {
    label: intl.get('hmde.common.createTime').d('创建时间'),
    renderer: ({
      record
    }) => {
      var _getTimeFormat;
      return moment(record === null || record === void 0 ? void 0 : record.get('creationDate')).format((_getTimeFormat = getTimeFormat()) === null || _getTimeFormat === void 0 ? void 0 : _getTimeFormat.time);
    },
    colSpan: 1
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "enabledFlag",
    colSpan: 1,
    renderer: ({
      value
    }) => TagRender(value, enableList())
  }), /*#__PURE__*/React.createElement(_Output, {
    label: intl.get('hmde.common.updatedBy').d('更新人'),
    renderer: ({
      record
    }) => record === null || record === void 0 ? void 0 : record.get('updateName'),
    colSpan: 1
  }), /*#__PURE__*/React.createElement(_Output, {
    label: intl.get('hmde.common.lastUpdateDate').d('更新时间'),
    renderer: ({
      record
    }) => {
      var _getTimeFormat2;
      return moment(record === null || record === void 0 ? void 0 : record.get('lastUpdateDate')).format((_getTimeFormat2 = getTimeFormat()) === null || _getTimeFormat2 === void 0 ? void 0 : _getTimeFormat2.time);
    },
    colSpan: 1
  })), /*#__PURE__*/React.createElement(_Form, {
    dataSet: basicFormDs,
    columns: 3,
    disabled: readOnlyFlag || tenantDisabled || !hasPermission || !!middleLinkBusinessObjects,
    labelAlign: "left"
  }, sourceType === SourceType.PREDEFINE || tenantSqlObjectDisabled ? /*#__PURE__*/React.createElement(_Output, {
    name: "remark",
    colSpan: 3
  }) : /*#__PURE__*/React.createElement(_IntlField, {
    name: "remark",
    colSpan: 3,
    rows: 2,
    type: "multipleLine",
    suffix: /*#__PURE__*/React.createElement(_Icon, {
      type: "language"
    })
  })), /*#__PURE__*/React.createElement(SectionTitle, {
    title: intl.get('hmde.common.advancedConfig').d('高级配置'),
    style: {
      fontSize: 16
    }
  }), /*#__PURE__*/React.createElement(_Form, {
    dataSet: basicFormDs
    // useColon={false}
    ,
    columns: 3,
    disabled: readOnlyFlag || tenantDisabled || !hasPermission || !!middleLinkBusinessObjects,
    labelAlign: "left"
  }, ((_basicFormDs$current15 = basicFormDs.current) === null || _basicFormDs$current15 === void 0 ? void 0 : _basicFormDs$current15.get('physicalModelType')) === PhysicalModelType.TABLE && /*#__PURE__*/React.createElement(React.Fragment, null, (!isTenant || isTenant && sourceType === SourceType.TENANT && (((_basicFormDs$current16 = basicFormDs.current) === null || _basicFormDs$current16 === void 0 ? void 0 : _basicFormDs$current16.get('physicalModelType')) === PhysicalModelType.TABLE && ((_basicFormDs$current17 = basicFormDs.current) === null || _basicFormDs$current17 === void 0 ? void 0 : _basicFormDs$current17.get('businessObjectCategory')) === BusinessObjectCategory.STANDARD || ((_basicFormDs$current18 = basicFormDs.current) === null || _basicFormDs$current18 === void 0 ? void 0 : _basicFormDs$current18.get('businessObjectCategory')) === BusinessObjectCategory.MIDDLE)) && /*#__PURE__*/React.createElement(_Output, {
    disabled: true,
    colSpan: 1,
    name: "autoCreateFlag",
    renderer: ({
      value
    }) => TagRender(value, enableAutoCreateFlagList())
  }), ((_basicFormDs$current19 = basicFormDs.current) === null || _basicFormDs$current19 === void 0 ? void 0 : _basicFormDs$current19.get('publishStatus')) === PublishStatus.UNPUBLISHED && (_basicFormDs$current20 = basicFormDs.current) !== null && _basicFormDs$current20 !== void 0 && _basicFormDs$current20.get('autoCreateFlag') ? /*#__PURE__*/React.createElement(_TextField, {
    name: "physicalModelName",
    colSpan: 1,
    maxLength: 56,
    showLengthInfo: true,
    labelWidth: 120
  }) : /*#__PURE__*/React.createElement(_Output, {
    name: "physicalModelName",
    colSpan: 1,
    labelWidth: 120,
    renderer: ({
      value,
      record
    }) => isTenant ? value : /*#__PURE__*/React.createElement("a", {
      onClick: () => goToDetail(record)
    }, value)
    // <a onClick={() => goToDetail(record)}>{value}</a>
  }), sourceType !== SourceType.TENANT && ((_basicFormDs$current21 = basicFormDs.current) !== null && _basicFormDs$current21 !== void 0 && _basicFormDs$current21.get('autoCreateFlag') && (((_basicFormDs$current22 = basicFormDs.current) === null || _basicFormDs$current22 === void 0 ? void 0 : _basicFormDs$current22.get('publishStatus')) === PublishStatus.UNPUBLISHED || !((_basicFormDs$current23 = basicFormDs.current) !== null && _basicFormDs$current23 !== void 0 && _basicFormDs$current23.get('extendsTableId'))) || !((_basicFormDs$current24 = basicFormDs.current) !== null && _basicFormDs$current24 !== void 0 && _basicFormDs$current24.get('autoCreateFlag')) && !((_basicFormDs$current25 = basicFormDs.current) !== null && _basicFormDs$current25 !== void 0 && _basicFormDs$current25.get('extendsTableId')) ? !(!extendTableEnabledFlag || [SourceType.PREDEFINE].includes(sourceType)) &&
  /*#__PURE__*/
  // eslint-disable-next-line react/jsx-indent
  React.createElement(_TextField, {
    name: "extendsTableName",
    colSpan: 1,
    maxLength: 60,
    showLengthInfo: true,
    labelWidth: 140,
    addonAfter: !((_basicFormDs$current26 = basicFormDs.current) !== null && _basicFormDs$current26 !== void 0 && _basicFormDs$current26.get('autoCreateFlag')) && !((_basicFormDs$current27 = basicFormDs.current) !== null && _basicFormDs$current27 !== void 0 && _basicFormDs$current27.get('extendsTableId')) && !(!extendTableEnabledFlag || [SourceType.PREDEFINE].includes(sourceType)) && /*#__PURE__*/React.createElement("div", {
      className: style['lov-button'],
      onClick: handleExtentsTable
    }, /*#__PURE__*/React.createElement(ImgIcon, {
      name: "link.png",
      size: 15
    }))
  }) : !(!extendTableEnabledFlag || [SourceType.PREDEFINE].includes(sourceType)) &&
  /*#__PURE__*/
  // eslint-disable-next-line react/jsx-indent
  React.createElement(_Output, {
    name: "extendsTableName",
    colSpan: 1,
    labelWidth: 140
  })), ((_basicFormDs$current28 = basicFormDs.current) === null || _basicFormDs$current28 === void 0 ? void 0 : _basicFormDs$current28.get('publishStatus')) !== PublishStatus.UNPUBLISHED || !((_basicFormDs$current29 = basicFormDs.current) !== null && _basicFormDs$current29 !== void 0 && _basicFormDs$current29.get('autoCreateFlag')) ? /*#__PURE__*/React.createElement(_Output, {
    name: "customPrimaryKeyCode"
    // newLine={boSourceType !== 'TENANT'}
  }) : /*#__PURE__*/React.createElement(_TextField, {
    name: "customPrimaryKeyCode"
    // newLine={boSourceType !== 'TENANT'}
    ,
    colSpan: 1,
    labelWidth: 110,
    label: /*#__PURE__*/React.createElement(LabelTitleRender, {
      value: intl.get('hmde.bo.businessObject.primaryKeyCode').d('主键编码'),
      help: intl.get('hmde.bo.businessObject.customPrimaryKeyCode.help').d('仅支持小驼峰')
    }),
    maxLength: 60,
    showLengthInfo: true
  })), /*#__PURE__*/React.createElement(_Switch, {
    // newLine
    name: "sharedFlag",
    colSpan: 1,
    disabled: tenantSqlObjectDisabled
  })));
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(BaseInfo));