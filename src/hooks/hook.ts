import { useCallback, useEffect, useState } from 'react';
import { getCurrentUser, getCurrentUserId, getResponse } from 'utils/utils';
import { queryUnifyIdpValue } from 'services/api';

// 用户部门岗位信息接口
export interface UserDeptPostInfo {
  positionName: string;
  deptName: string;
  employeeName: string;
  positionId: number;
  deptId: number;
  positionCode: string;
  employeeId: number;
  userName: string;
  userId: number;
  deptCode: string;
  employeeCode: string;
}

/**
 * @description 检查角色标签hook
 * @return boolean
 */
export function useCheckRoleTag(roleTag: string): boolean {
  const [hasRoleTag, setHasRoleTag] = useState<boolean>(false);

  const checkRoleTag = useCallback((tag) => {
    setHasRoleTag(!!getCurrentUser().currentRoleLabels?.includes(tag));
  }, []);

  useEffect(() => {
    checkRoleTag(roleTag);
  }, [roleTag]);

  return hasRoleTag;
}

/**
 * @description 查询用户部门岗位信息hook
 * @returns [UserDeptPostInfo, boolean]
 */
export function useGetUserDeptPostInfo(): [UserDeptPostInfo, boolean] {
  const [userDeptPostInfo, setUserDeptPostInfo] = useState<UserDeptPostInfo>({} as UserDeptPostInfo);
  const [loading, setLoading] = useState<boolean>(true);

  const useGetDepartmentInfo = useCallback(async () => {
    try {
      const res = getResponse(await queryUnifyIdpValue('PTS.COMMON.USER_INFO', { userId: getCurrentUserId() }));
      if (Array.isArray(res) && res[0]) {
        setUserDeptPostInfo(res[0]);
      }
    } finally {
      setLoading(false);
    }

  }, []);

  useEffect(() => {
    useGetDepartmentInfo();
  }, []);

  return [userDeptPostInfo, loading];
};
