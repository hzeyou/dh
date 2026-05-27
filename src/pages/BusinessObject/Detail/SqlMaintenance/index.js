import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _Alert from "@hzero-front-ui/c7n-ui/lib/Alert";
import _useDataSet from "choerodon-ui/pro/lib/use-data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _useModal from "choerodon-ui/pro/lib/use-modal";
import _pick from "lodash/pick";
import _isString from "lodash/isString";
import _isEqual from "lodash/isEqual";
import React, { useEffect, useRef } from 'react';
import notification from 'utils/notification';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import intl from 'utils/intl';
import { isResponse } from 'hzero-front-apaas/lib/utils/request';
import { useSafeState } from 'ahooks';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import { observer } from 'mobx-react-lite';
import { isTenantRoleLevel } from 'utils/utils';
import { SourceType } from "hzero-front-apaas/lib/constants/businessObject";
import { quickInsertDataToTable } from "hzero-front-hmde/lib/utils/common";
import { getSqlBusinessObjectMaintain, saveSqlBusinessObjectMaintain, sqlBusinessObjectAnalytic } from "hzero-front-hmde/lib/services/businessObjectService";
import { PhysicalModelType } from "hzero-front-hmde/lib/constants/businessObject";
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
import { TAB_KEYS } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/TabItemList";
import BOPermissionButton from "hzero-front-hmde/lib/routes/BusinessObject/Detail/components/BOPermissionButton";
import ParamsTable from "./components/ParamsTable";
import SqlEditor from "./components/SqlEditor";
import QueryParamsTable from "./components/QueryParamsTable";
import sqlParamsDS, { SQL_PARAM_CATEGORY, SQL_PARAMS_FN, SQL_SOURCE_TYPE } from "./datasets/sqlParamsDS";
import RunModal from "./components/RunModal";
import { SQL_RUN_PARAMS_FN } from "./datasets/sqlRunParamsDS";
import styles from "./index.less?modules";

// 前端校验

const isTenant = isTenantRoleLevel();
const SqlMaintenance = ({
  showVersion
}) => {
  var _baseInfoDS$current, _baseInfoDS$current2, _baseInfoDS$current3;
  const Modal = _useModal();
  const _useSafeState = useSafeState({}),
    _useSafeState2 = _slicedToArray(_useSafeState, 2),
    sqlMaintainDetail = _useSafeState2[0],
    setSqlMaintainDetail = _useSafeState2[1];
  const _useSafeState3 = useSafeState(false),
    _useSafeState4 = _slicedToArray(_useSafeState3, 2),
    loading = _useSafeState4[0],
    setLoading = _useSafeState4[1];
  const _useSafeState5 = useSafeState(false),
    _useSafeState6 = _slicedToArray(_useSafeState5, 2),
    isSqlDetailDataChanged = _useSafeState6[0],
    setIsSqlDetailDataChanged = _useSafeState6[1];
  const boStore = useBoStore();
  const baseInfoDS = boStore === null || boStore === void 0 ? void 0 : boStore.getState('baseInfoDS');
  const businessObjectId = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('businessObjectId');
  const boDetailTabActiveKey = boStore === null || boStore === void 0 ? void 0 : boStore.getState('boDetailTabActiveKey');
  const sqlDsRef = useRef(null);
  const sqlParamsDs = _useDataSet(() => sqlParamsDS(sqlDsRef), []);
  const sqlQueryParamsDs = _useDataSet(() => {
    const dsProps = sqlParamsDS(sqlDsRef);
    // 去除主键字段
    dsProps.fields = dsProps.fields.filter(field => {
      return field.name !== SQL_PARAMS_FN.PRIMARY_FLAG;
    });
    return dsProps;
  }, []);
  const sqlEditorRef = useRef(null);
  const sqlRunParamsDsRef = useRef(null); // sql 执行里面参数数据

  // 组户级 sql对象 标准-个性化则只读
  const tenantSqlObjectDisabled = isTenant && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : _baseInfoDS$current2.get('physicalModelType')) === PhysicalModelType.SQL && [SourceType.INHERIT, SourceType.PLATFORM].includes(baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current3 = baseInfoDS.current) === null || _baseInfoDS$current3 === void 0 ? void 0 : _baseInfoDS$current3.get('sourceType'));
  const buttonDisabled = tenantSqlObjectDisabled || !!showVersion;

  // 缓存列和查询ds
  useEffect(() => {
    sqlDsRef.current = {
      sqlParamsDs,
      sqlQueryParamsDs
    };
  }, [sqlParamsDs, sqlQueryParamsDs]);
  useEffect(() => {
    // 初始化请求
    if (businessObjectId && boDetailTabActiveKey === TAB_KEYS.sql) {
      init();
    }
  }, [boDetailTabActiveKey, businessObjectId]);

  // 判断sql 维护数据是否发生变更的监听
  useEffect(() => {
    var _sqlEditorRef$current, _sqlEditorRef$current2;
    const changeListener = (_sqlEditorRef$current = sqlEditorRef.current) === null || _sqlEditorRef$current === void 0 ? void 0 : (_sqlEditorRef$current2 = _sqlEditorRef$current.editorInstance) === null || _sqlEditorRef$current2 === void 0 ? void 0 : _sqlEditorRef$current2.onDidChangeModelContent(() => {
      handleSqlDetailDataChange();
    });
    return () => {
      changeListener === null || changeListener === void 0 ? void 0 : changeListener.dispose();
    };
  }, [sqlMaintainDetail]);
  const init = () => {
    setLoading(true);
    setIsSqlDetailDataChanged(false);
    return getSqlBusinessObjectMaintain(businessObjectId, showVersion).then(res => {
      if (isResponse(res)) {
        var _sqlEditorRef$current3, _sqlEditorRef$current4, _res$businessObjectSq, _res$businessObjectSq2;
        setSqlMaintainDetail(res);
        (_sqlEditorRef$current3 = sqlEditorRef.current) === null || _sqlEditorRef$current3 === void 0 ? void 0 : (_sqlEditorRef$current4 = _sqlEditorRef$current3.editorInstance) === null || _sqlEditorRef$current4 === void 0 ? void 0 : _sqlEditorRef$current4.setValue(res.sqlContent || '');
        sqlParamsDs.loadData((_res$businessObjectSq = res.businessObjectSqlFieldParams) !== null && _res$businessObjectSq !== void 0 ? _res$businessObjectSq : []);
        sqlQueryParamsDs.loadData((_res$businessObjectSq2 = res.businessObjectSqlQueryParams) !== null && _res$businessObjectSq2 !== void 0 ? _res$businessObjectSq2 : []);
      }
    }).finally(() => {
      setLoading(false);
    });
  };
  const showErrorNotification = errorCodes => {
    const fieldErrorCodes = errorCodes.filter(v => !v.flag && v.type === SQL_PARAM_CATEGORY.FIELD_PARAM);
    const queryErrorCodes = errorCodes.filter(v => !v.flag && v.type === SQL_PARAM_CATEGORY.QUERY_PARAM);
    // 为了适配多语言这里设置3种情况 1. 仅返回列报错 2. 仅查询参数报错 3. 返回列和查询参数均报错
    if (fieldErrorCodes.length && queryErrorCodes.length) {
      notification.error({
        message: intl.get('hmde.bo.sqlBo.fieldAndQueryError', {
          fieldErrorCodes: fieldErrorCodes.map(v => v.code).join('、'),
          queryErrorCodes: queryErrorCodes.map(v => v.code).join('、')
        }).d('解析参数返回列【{fieldErrorCodes}】、查询参数【{queryErrorCodes}】存在问题，请检查并修改SQL')
      });
    } else if (fieldErrorCodes.length) {
      notification.error({
        message: intl.get('hmde.bo.sqlBo.fieldError', {
          fieldErrorCodes: fieldErrorCodes.map(v => v.code).join('、')
        }).d('解析参数返回列【{fieldErrorCodes}】存在问题，请检查并修改SQL')
      });
    } else if (queryErrorCodes.length) {
      notification.error({
        message: intl.get('hmde.bo.sqlBo.queryError', {
          queryErrorCodes: queryErrorCodes.map(v => v.code).join('、')
        }).d('解析参数查询参数【{queryErrorCodes}】存在问题，请检查并修改SQL')
      });
    }
  };

  // 前端校验返回列和查询参数
  const checkSqlParams = () => {
    const sqlColumnErrorCodes = sqlParamsDs.map(record => {
      return new Promise(resolve => {
        var _sqlParamsDs$getField;
        (_sqlParamsDs$getField = sqlParamsDs.getField(SQL_PARAMS_FN.CODE)) === null || _sqlParamsDs$getField === void 0 ? void 0 : _sqlParamsDs$getField.checkValidity(record).then(flag => {
          resolve({
            flag,
            type: SQL_PARAM_CATEGORY.FIELD_PARAM,
            code: record.get(SQL_PARAMS_FN.CODE)
          });
        });
      });
    });
    const sqlQueryErrorCodes = sqlQueryParamsDs.map(record => {
      return new Promise(resolve => {
        var _sqlQueryParamsDs$get;
        (_sqlQueryParamsDs$get = sqlQueryParamsDs.getField(SQL_PARAMS_FN.CODE)) === null || _sqlQueryParamsDs$get === void 0 ? void 0 : _sqlQueryParamsDs$get.checkValidity(record).then(flag => {
          resolve({
            flag,
            type: SQL_PARAM_CATEGORY.QUERY_PARAM,
            code: record.get(SQL_PARAMS_FN.CODE)
          });
        });
      });
    });
    return Promise.all(sqlColumnErrorCodes.concat(sqlQueryErrorCodes)).then(validates => {
      showErrorNotification(validates);
      return !validates.some(v => !v.flag);
    });
  };
  const getSqlParams = async () => {
    var _sqlEditorRef$current5, _sqlEditorRef$current6;
    // 参数解析前先保存
    const saveFlag = await handleSave();
    if (!saveFlag) return false;
    const sqlContent = (_sqlEditorRef$current5 = sqlEditorRef.current) === null || _sqlEditorRef$current5 === void 0 ? void 0 : (_sqlEditorRef$current6 = _sqlEditorRef$current5.editorInstance) === null || _sqlEditorRef$current6 === void 0 ? void 0 : _sqlEditorRef$current6.getValue();
    if (_isString(sqlContent) && sqlContent.trim()) {
      var _sqlEditorRef$current7, _sqlEditorRef$current8;
      const res = await sqlBusinessObjectAnalytic({
        sqlContent: (_sqlEditorRef$current7 = sqlEditorRef.current) === null || _sqlEditorRef$current7 === void 0 ? void 0 : (_sqlEditorRef$current8 = _sqlEditorRef$current7.editorInstance) === null || _sqlEditorRef$current8 === void 0 ? void 0 : _sqlEditorRef$current8.getValue(),
        businessObjectId,
        boSqlId: sqlMaintainDetail.boSqlId
      });
      if (isResponse(res)) {
        var _res$businessObjectSq3, _res$businessObjectSq4;
        const newBusinessObjectSqlFieldParams = (_res$businessObjectSq3 = res === null || res === void 0 ? void 0 : res.businessObjectSqlFieldParams) !== null && _res$businessObjectSq3 !== void 0 ? _res$businessObjectSq3 : [];
        const newBusinessObjectSqlQueryParams = (_res$businessObjectSq4 = res === null || res === void 0 ? void 0 : res.businessObjectSqlQueryParams) !== null && _res$businessObjectSq4 !== void 0 ? _res$businessObjectSq4 : [];
        const mergeSqlParams = (dataSet, oldData, newData) => {
          const targetParams = [];
          // 遍历新数据，判断能否复用
          newData.forEach(item => {
            // code 一致 类型一致 sourceType 一致则复用
            const targetData = oldData.find(r => r[SQL_PARAMS_FN.CODE] === item[SQL_PARAMS_FN.CODE] && r[SQL_PARAMS_FN.TYPE] === item[SQL_PARAMS_FN.TYPE] && r[SQL_PARAMS_FN.SOURCE_TYPE] === item[SQL_PARAMS_FN.SOURCE_TYPE]);
            if (targetData) {
              targetParams.push(targetData);
            } else {
              targetParams.push(item);
            }
          });
          // 遍历老数据，如果是自定义且待插入中没有则保存
          oldData.forEach(item => {
            if (item[SQL_PARAMS_FN.SOURCE_TYPE] === SQL_SOURCE_TYPE.CUSTOM && !targetParams.find(r => r[SQL_PARAMS_FN.CODE] === item[SQL_PARAMS_FN.CODE])) {
              targetParams.push(item);
            }
          });
          dataSet.loadData([]);
          quickInsertDataToTable(dataSet, targetParams, {
            isValidate: true
          });
        };
        mergeSqlParams(sqlParamsDs, sqlParamsDs.toData(), newBusinessObjectSqlFieldParams);
        mergeSqlParams(sqlQueryParamsDs, sqlQueryParamsDs.toData(), newBusinessObjectSqlQueryParams);
        return checkSqlParams();
      } else {
        return false;
      }
    } else {
      notification.error({
        message: intl.get('hmde.bo.sqlBo.noSqlNotification').d('需维护SQL脚本')
      });
      return false;
    }
  };

  // 刷新初始化数据
  const handleUpdateInitInfo = async () => {
    await init();
    await (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : baseInfoDS.query());
  };
  const handleSave = async () => {
    var _sqlEditorRef$current9, _sqlEditorRef$current10, _sqlEditorRef$current11, _sqlEditorRef$current12, _sqlEditorRef$current13;
    const sqlValue = (_sqlEditorRef$current9 = (_sqlEditorRef$current10 = sqlEditorRef.current) === null || _sqlEditorRef$current10 === void 0 ? void 0 : (_sqlEditorRef$current11 = _sqlEditorRef$current10.editorInstance) === null || _sqlEditorRef$current11 === void 0 ? void 0 : _sqlEditorRef$current11.getValue()) !== null && _sqlEditorRef$current9 !== void 0 ? _sqlEditorRef$current9 : '';
    // 判断是否编写了 sql
    if (!sqlValue.trim()) {
      notification.error({
        message: intl.get('hmde.bo.sqlBo.noSqlNotification').d('需维护SQL脚本')
      });
      return false;
    }

    // 检查勾选一个主键
    if (sqlParamsDs.totalCount > 0) {
      const primaryFlag = sqlParamsDs.some(record => record.get(SQL_PARAMS_FN.PRIMARY_FLAG));
      if (!primaryFlag) {
        notification.error({
          message: intl.get('hmde.common.errorInfo.primaryKey').d('请勾选一个主键')
        });
        return false;
      }
    }

    // 校验
    const sqlParamsValidateFlag = await sqlParamsDs.validate();
    const sqlQueryParamsDsFlag = await sqlQueryParamsDs.validate();
    if (!sqlParamsValidateFlag || !sqlQueryParamsDsFlag) {
      // 获取校验信息
      const sqlParamsErrorCodes = sqlParamsDs.getValidationErrors().map(v => ({
        flag: false,
        code: v.record.get(SQL_PARAMS_FN.CODE),
        type: SQL_PARAM_CATEGORY.FIELD_PARAM
      }));
      const sqlQueryParamsErrorCodes = sqlQueryParamsDs.getValidationErrors().map(v => ({
        flag: false,
        code: v.record.get(SQL_PARAMS_FN.CODE),
        type: SQL_PARAM_CATEGORY.QUERY_PARAM
      }));
      showErrorNotification(sqlParamsErrorCodes.concat(sqlQueryParamsErrorCodes));
      return false;
    }
    // 保存
    return saveSqlBusinessObjectMaintain({
      ...sqlMaintainDetail,
      businessObjectId,
      sqlContent: ((_sqlEditorRef$current12 = sqlEditorRef.current) === null || _sqlEditorRef$current12 === void 0 ? void 0 : (_sqlEditorRef$current13 = _sqlEditorRef$current12.editorInstance) === null || _sqlEditorRef$current13 === void 0 ? void 0 : _sqlEditorRef$current13.getValue()) || '',
      businessObjectSqlFieldParams: sqlParamsDs.toData(),
      businessObjectSqlQueryParams: sqlQueryParamsDs.toData()
    }).then(async res => {
      if (isResponse(res)) {
        notification.success({
          message: intl.get('hzero.common.notification.success.save').d('保存成功')
        });
        // 刷新详情
        await handleUpdateInitInfo();
        return true;
      }
    });
  };

  // 把保存方法设置到 boStore  上
  if (boDetailTabActiveKey === TAB_KEYS.sql) {
    boStore === null || boStore === void 0 ? void 0 : boStore.setState('beforePublicOperate', {
      isSaveChanged: isSqlDetailDataChanged,
      handleSave,
      handleUpdate: handleUpdateInitInfo
    });
  }
  const handleQueryParamsCreate = () => {
    var _sqlQueryParamsDs$cur;
    sqlQueryParamsDs.create(undefined, 0);
    (_sqlQueryParamsDs$cur = sqlQueryParamsDs.current) === null || _sqlQueryParamsDs$cur === void 0 ? void 0 : _sqlQueryParamsDs$cur.set({
      [SQL_PARAMS_FN.SOURCE_TYPE]: SQL_SOURCE_TYPE.CUSTOM,
      [SQL_PARAMS_FN.PARAM_CATEGORY]: SQL_PARAM_CATEGORY.QUERY_PARAM
    });
  };
  const handleParamsCreate = () => {
    sqlParamsDs.create({
      [SQL_PARAMS_FN.SOURCE_TYPE]: SQL_SOURCE_TYPE.CUSTOM,
      [SQL_PARAMS_FN.PARAM_CATEGORY]: SQL_PARAM_CATEGORY.FIELD_PARAM
    }, 0);
  };

  // sql 维护数据是否被修改
  const handleSqlDetailDataChange = () => {
    var _sqlEditorRef$current14, _sqlEditorRef$current15, _sqlParamsDs$toData, _sqlQueryParamsDs$toD, _sqlMaintainDetail$bu, _sqlMaintainDetail$bu2;
    // 比较 sql 内容
    const curDetailData = {
      sqlContent: (_sqlEditorRef$current14 = sqlEditorRef.current) === null || _sqlEditorRef$current14 === void 0 ? void 0 : (_sqlEditorRef$current15 = _sqlEditorRef$current14.editorInstance) === null || _sqlEditorRef$current15 === void 0 ? void 0 : _sqlEditorRef$current15.getValue(),
      businessObjectSqlFieldParams: (_sqlParamsDs$toData = sqlParamsDs.toData()) !== null && _sqlParamsDs$toData !== void 0 ? _sqlParamsDs$toData : [],
      businessObjectSqlQueryParams: (_sqlQueryParamsDs$toD = sqlQueryParamsDs.toData()) !== null && _sqlQueryParamsDs$toD !== void 0 ? _sqlQueryParamsDs$toD : []
    };
    setIsSqlDetailDataChanged(!_isEqual(curDetailData, _pick({
      ...sqlMaintainDetail,
      businessObjectSqlFieldParams: (_sqlMaintainDetail$bu = sqlMaintainDetail === null || sqlMaintainDetail === void 0 ? void 0 : sqlMaintainDetail.businessObjectSqlFieldParams) !== null && _sqlMaintainDetail$bu !== void 0 ? _sqlMaintainDetail$bu : [],
      businessObjectSqlQueryParams: (_sqlMaintainDetail$bu2 = sqlMaintainDetail === null || sqlMaintainDetail === void 0 ? void 0 : sqlMaintainDetail.businessObjectSqlQueryParams) !== null && _sqlMaintainDetail$bu2 !== void 0 ? _sqlMaintainDetail$bu2 : []
    }, ['sqlContent', 'businessObjectSqlFieldParams', 'businessObjectSqlQueryParams'])));
  };
  useDataSetEvents(sqlParamsDs, ['create', 'update', 'load', 'remove'], () => {
    handleSqlDetailDataChange();
  });
  useDataSetEvents(sqlQueryParamsDs, ['create', 'update', 'load', 'remove'], () => {
    handleSqlDetailDataChange();
  });
  const handleRun = async () => {
    var _sqlEditorRef$current16, _sqlEditorRef$current17, _baseInfoDS$current4;
    // 解析成功则打开弹框
    Modal.open({
      title: intl.get('hmde.common.testRun').d('测试执行'),
      closable: true,
      destroyOnClose: true,
      children: /*#__PURE__*/React.createElement(RunModal, {
        sqlQueryParamsDs: sqlQueryParamsDs,
        sql: ((_sqlEditorRef$current16 = sqlEditorRef.current) === null || _sqlEditorRef$current16 === void 0 ? void 0 : (_sqlEditorRef$current17 = _sqlEditorRef$current16.editorInstance) === null || _sqlEditorRef$current17 === void 0 ? void 0 : _sqlEditorRef$current17.getValue()) || '',
        serviceCode: (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current4 = baseInfoDS.current) === null || _baseInfoDS$current4 === void 0 ? void 0 : _baseInfoDS$current4.get('serviceCode')) || '',
        sqlRunParamsDsRef: sqlRunParamsDsRef
      }),
      style: {
        width: 1200
      },
      okButton: false,
      cancelText: intl.get('hzero.common.button.close').d('关闭'),
      onClose: () => {
        var _sqlRunParamsDsRef$cu;
        // 将弹窗内的参数同步到外面对应列表上
        (_sqlRunParamsDsRef$cu = sqlRunParamsDsRef.current) === null || _sqlRunParamsDsRef$cu === void 0 ? void 0 : _sqlRunParamsDsRef$cu.forEach(record => {
          // 与外面【返回列】重名的参数，就忽略
          const isExitParams = sqlParamsDs.find(r => r.get(SQL_PARAMS_FN.CODE) === record.get(SQL_RUN_PARAMS_FN.CODE));
          if (!isExitParams) {
            // 与【查询参数】同名的参数更新数据类型
            const targetRecord = sqlQueryParamsDs.find(r => r.get(SQL_PARAMS_FN.CODE) === record.get(SQL_RUN_PARAMS_FN.CODE));
            if (targetRecord) {
              targetRecord.set(SQL_PARAMS_FN.TYPE, record.get(SQL_RUN_PARAMS_FN.TYPE));
            } else {
              // 多的参数做新增，少的参数不处理
              const code = record.get(SQL_RUN_PARAMS_FN.CODE);
              const type = record.get(SQL_RUN_PARAMS_FN.TYPE);
              if (code) {
                var _sqlQueryParamsDs$cur2;
                sqlQueryParamsDs.create();
                (_sqlQueryParamsDs$cur2 = sqlQueryParamsDs.current) === null || _sqlQueryParamsDs$cur2 === void 0 ? void 0 : _sqlQueryParamsDs$cur2.set({
                  [SQL_PARAMS_FN.CODE]: code,
                  [SQL_PARAMS_FN.TYPE]: type,
                  [SQL_PARAMS_FN.SOURCE_TYPE]: SQL_SOURCE_TYPE.CUSTOM,
                  [SQL_PARAMS_FN.PARAM_CATEGORY]: SQL_PARAM_CATEGORY.QUERY_PARAM
                });
              }
            }
          }
        });
      }
    });
  };
  return /*#__PURE__*/React.createElement(_Spin, {
    spinning: loading
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.wrapper
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.title
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['title-content']
  }, /*#__PURE__*/React.createElement("h3", null, intl.get('hmde.bo.sqlBo.maintain').d('SQL 维护'))), /*#__PURE__*/React.createElement("div", {
    className: styles.operate
  }, /*#__PURE__*/React.createElement(BOPermissionButton, {
    color: "primary",
    onClick: () => handleSave(),
    disabled: !isSqlDetailDataChanged || buttonDisabled
  }, intl.get('hmde.common.button.save').d('保存')))), /*#__PURE__*/React.createElement("div", {
    className: styles.content
  }, /*#__PURE__*/React.createElement(_Alert, {
    message: intl.get('hmde.bo.sqlBo.maintainTips').d('维护SQL脚本并进行参数解析，将获得返回列、查询参数，保存后所有参数将映射生成字段'),
    type: "info",
    showIcon: true
  }), /*#__PURE__*/React.createElement("div", {
    className: styles['sql-wrapper']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.title
  }, intl.get('hmde.bo.sqlBo.script').d('SQL 脚本')), /*#__PURE__*/React.createElement("div", {
    className: styles.editor
  }, /*#__PURE__*/React.createElement(SqlEditor, {
    ref: sqlEditorRef,
    disabled: buttonDisabled
  }), /*#__PURE__*/React.createElement("div", {
    className: styles.parse
  }, /*#__PURE__*/React.createElement(BOPermissionButton, {
    icon: "fenpei-o",
    onClick: getSqlParams,
    disabled: buttonDisabled
  }, intl.get('hmde.se.scriptEvent.parameterParsing').d('参数解析'), /*#__PURE__*/React.createElement(_Tooltip, {
    title: intl.get('hmde.bo.sqlBo.analysisTips').d('自动解析合规SQL片段。格式异常语句无法解析，需修改SQL或手动补全返回参数。')
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "help",
    style: {
      marginLeft: 3,
      marginBottom: 2
    }
  }))), /*#__PURE__*/React.createElement(BOPermissionButton, {
    icon: "fasong-o",
    disabled: buttonDisabled,
    onClick: () => handleRun()
  }, intl.get('hmde.common.testRun').d('测试执行'))))), /*#__PURE__*/React.createElement("h3", {
    className: styles['sub-title']
  }, intl.get('hmde.bo.sqlBo.column').d('返回列'), /*#__PURE__*/React.createElement("div", {
    className: styles.action
  }, /*#__PURE__*/React.createElement(BOPermissionButton, {
    icon: "add",
    funcType: "link",
    onClick: handleParamsCreate
  }, intl.get(`hzero.common.create`).d('新建')))), /*#__PURE__*/React.createElement(_Alert, {
    style: {
      marginTop: '14px'
    },
    message: intl.get('hmde.bo.sqlBo.fieldTips').d('返回列既可作为SQL查询结果进行返回，也可作为查询参数'),
    type: "info",
    showIcon: true
  }), /*#__PURE__*/React.createElement(ParamsTable, {
    sqlParamsDs: sqlParamsDs,
    disabled: buttonDisabled
  }), /*#__PURE__*/React.createElement("h3", {
    className: styles['sub-title']
  }, intl.get('hmde.bo.sqlBo.queryParams').d('查询参数'), /*#__PURE__*/React.createElement("div", {
    className: styles.action
  }, /*#__PURE__*/React.createElement(BOPermissionButton, {
    icon: "add",
    funcType: "link",
    onClick: handleQueryParamsCreate,
    disabled: buttonDisabled
  }, intl.get(`hzero.common.create`).d('新建')))), /*#__PURE__*/React.createElement(_Alert, {
    style: {
      marginTop: '14px'
    },
    message: intl.get('hmde.bo.sqlBo.queryTips').d('返回列参数默认会作为查询参数；自定义的查询参数会给SQL中对应的变量赋值'),
    type: "info",
    showIcon: true
  }), /*#__PURE__*/React.createElement(QueryParamsTable, {
    sqlQueryParamsDs: sqlQueryParamsDs,
    disabled: buttonDisabled
  }))));
};
export default observer(SqlMaintenance);