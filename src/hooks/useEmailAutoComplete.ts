import { DataSet } from 'choerodon-ui/pro';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import { useCallback, useMemo } from 'react';

/**
 * 邮箱自动补全 Hook
 * @returns {Object} 返回 emailOptionDS 和 handleValueChange
 */
export const useEmailAutoComplete = () => {
  const emailOptionDS = useMemo(() => {
    return new DataSet({
      fields: [
        {
          name: 'value',
          type: FieldType.string,
        },
        {
          name: 'meaning',
          type: FieldType.string,
        },
      ],
    });
  }, []);

  const handleValueChange = useCallback((v) => {
    const { value } = v.target;
    const suffixList = ['@qq.com', '@163.com', '@hand-china.com'];
    if (value.indexOf('@') !== -1) {
      emailOptionDS.loadData([]);
    } else {
      emailOptionDS.loadData(suffixList.map(suffix => ({
        value: `${value}${suffix}`,
        meaning: `${value}${suffix}`,
      })));
    }
  }, [emailOptionDS]);

  return {
    emailOptionDS,
    handleValueChange,
  };
};
