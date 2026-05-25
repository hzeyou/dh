function parseId(value: string | number) {
  return Number.parseInt(`${value}`, 10);
}

import { Request, Response } from 'express';

type CategoryLevel = 'L1' | 'L2' | 'L3';
type CategoryStatus = 'ENABLED' | 'STOPPED';

interface CategoryItem {
  id: number;
  categoryId: number;
  categoryCode: string;
  categoryName: string;
  level: CategoryLevel;
  parentId?: number;
  parentName?: string;
  systemId?: number;
  systemName?: string;
  domainId?: number;
  domainName?: string;
  description?: string;
  status: CategoryStatus;
  createdByName: string;
  standardCount: number;
  childrenCount?: number;
  enabledChildrenCount?: number;
  children?: CategoryItem[];
}

let nextId = 10;

const categories: CategoryItem[] = [
  {
    id: 1,
    categoryId: 1,
    categoryCode: 'QUALITY_SYSTEM',
    categoryName: '质量体系',
    level: 'L1',
    status: 'ENABLED',
    description: '质量域数据标准体系',
    createdByName: 'admin',
    standardCount: 0,
  },
  {
    id: 2,
    categoryId: 2,
    categoryCode: 'SUPPLIER_DOMAIN',
    categoryName: '供应商主题域',
    level: 'L2',
    parentId: 1,
    systemId: 1,
    status: 'ENABLED',
    description: '供应商主数据相关主题域',
    createdByName: 'admin',
    standardCount: 0,
  },
  {
    id: 3,
    categoryId: 3,
    categoryCode: 'SUPPLIER_OBJECT',
    categoryName: '供应商对象',
    level: 'L3',
    parentId: 2,
    systemId: 1,
    domainId: 2,
    status: 'ENABLED',
    description: '供应商基础资料挂载对象',
    createdByName: 'admin',
    standardCount: 2,
  },
  {
    id: 4,
    categoryId: 4,
    categoryCode: 'CERTIFICATE_OBJECT',
    categoryName: '资质证书对象',
    level: 'L3',
    parentId: 2,
    systemId: 1,
    domainId: 2,
    status: 'STOPPED',
    description: '供应商资质证书挂载对象',
    createdByName: 'admin',
    standardCount: 0,
  },
  {
    id: 5,
    categoryId: 5,
    categoryCode: 'PROCUREMENT_SYSTEM',
    categoryName: '采购体系',
    level: 'L1',
    status: 'ENABLED',
    description: '采购域数据标准体系',
    createdByName: 'admin',
    standardCount: 0,
  },
  {
    id: 6,
    categoryId: 6,
    categoryCode: 'ORDER_DOMAIN',
    categoryName: '订单主题域',
    level: 'L2',
    parentId: 5,
    systemId: 5,
    status: 'ENABLED',
    description: '采购订单相关主题域',
    createdByName: 'admin',
    standardCount: 0,
  },
  {
    id: 7,
    categoryId: 7,
    categoryCode: 'PURCHASE_ORDER_OBJECT',
    categoryName: '采购订单对象',
    level: 'L3',
    parentId: 6,
    systemId: 5,
    domainId: 6,
    status: 'ENABLED',
    description: '采购订单挂载对象',
    createdByName: 'admin',
    standardCount: 0,
  },
];


function getParams(req: Request) {
  return {
    ...(req.query || {}),
    ...(req.body || {}),
  };
}

function findCategory(categoryId?: string | number) {
  return categories.find(item => item.categoryId === parseId(categoryId));
}

function getSystem(category: CategoryItem) {
  if (category.level === 'L1') {
    return category;
  }
  return findCategory(category.systemId);
}

function getDomain(category: CategoryItem) {
  if (category.level === 'L2') {
    return category;
  }
  return findCategory(category.domainId);
}

function hydrateCategory(category: CategoryItem): CategoryItem {
  const parent = findCategory(category.parentId);
  const system = getSystem(category);
  const domain = getDomain(category);
  const children = categories.filter(
    item => item.parentId === category.categoryId,
  );

  return {
    ...category,
    id: category.categoryId,
    parentName: parent?.categoryName,
    systemName: category.level === 'L1' ? undefined : system?.categoryName,
    domainName: category.level === 'L3' ? domain?.categoryName : undefined,
    childrenCount: children.length,
    enabledChildrenCount: children.filter(item => item.status === 'ENABLED')
      .length,
  };
}

function getHydratedList() {
  return categories.map(hydrateCategory);
}

function getDescendantCategoryIds(categoryId: number): number[] {
  const children = categories.filter(item => item.parentId === categoryId);
  return children.reduce<number[]>((result, item) => {
    result.push(item.categoryId);
    result.push(...getDescendantCategoryIds(item.categoryId));
    return result;
  }, []);
}

function filterList(params: any) {
  const selectedCategoryId = params.selectedCategoryId
    ? parseId(params.selectedCategoryId)
    : undefined;
  let result = getHydratedList();

  if (selectedCategoryId) {
    const descendantIds = [
      selectedCategoryId,
      ...getDescendantCategoryIds(selectedCategoryId),
    ];
    result = result.filter(item => descendantIds.includes(item.categoryId));
  }
  if (params.level) {
    result = result.filter(item => item.level === params.level);
  }
  if (params.categoryCode) {
    const categoryCode = `${params.categoryCode}`.toUpperCase();
    result = result.filter(item => item.categoryCode.includes(categoryCode));
  }
  if (params.categoryName) {
    result = result.filter(item =>
      item.categoryName.includes(`${params.categoryName}`),
    );
  }
  if (params.status) {
    result = result.filter(item => item.status === params.status);
  }

  return result;
}

function resolveHierarchy(data: Partial<CategoryItem>) {
  const parent = findCategory(data.parentId);

  if (!parent) {
    return {
      level: 'L1' as CategoryLevel,
      parentId: undefined,
      systemId: undefined,
      domainId: undefined,
    };
  }
  if (parent.level === 'L1') {
    return {
      level: 'L2' as CategoryLevel,
      parentId: parent.categoryId,
      systemId: parent.categoryId,
      domainId: undefined,
    };
  }
  return {
    level: 'L3' as CategoryLevel,
    parentId: parent.categoryId,
    systemId: parent.systemId,
    domainId: parent.categoryId,
  };
}

function sendSuccess(res: Response, data?: any) {
  res.status(200);
  res.send({
    success: true,
    content: Array.isArray(data) ? data : data ? [data] : [],
    data,
  });
}

function sendFailed(res: Response, message: string) {
  res.status(200);
  res.send({
    failed: true,
    message,
  });
}

function validateCategory(
  data: Partial<CategoryItem>,
  categoryId?: number,
): string | undefined {
  const hierarchy = resolveHierarchy(data);
  const categoryCode = data.categoryCode;
  const categoryName = data.categoryName;

  if (!categoryCode) {
    return '目录编码不能为空';
  }
  if (!categoryName) {
    return '目录名称不能为空';
  }
  if (!/^[A-Z_]+$/.test(categoryCode)) {
    return '目录编码只能包含大写字母和下划线';
  }
  if (
    categories.some(
      item =>
        item.categoryCode === categoryCode && item.categoryId !== categoryId,
    )
  ) {
    return '目录编码需全局唯一';
  }
  if (
    hierarchy.level === 'L1' &&
    categories.some(
      item =>
        item.level === 'L1' &&
        item.categoryName === categoryName &&
        item.categoryId !== categoryId,
    )
  ) {
    return 'L1 目录名称需全局唯一';
  }
  if (
    hierarchy.level !== 'L1' &&
    categories.some(
      item =>
        item.level === hierarchy.level &&
        item.parentId === hierarchy.parentId &&
        item.categoryName === categoryName &&
        item.categoryId !== categoryId,
    )
  ) {
    return 'L2/L3 目录名称需在同一上级下唯一';
  }
  return undefined;
}


function createCategory(data: Partial<CategoryItem>) {
  const hierarchy = resolveHierarchy(data);
  const categoryId = nextId++;
  const newItem: CategoryItem = {
    id: categoryId,
    categoryId,
    categoryCode: data.categoryCode || '',
    categoryName: data.categoryName || '',
    description: data.description || '',
    status: data.status || 'ENABLED',
    createdByName: 'mock-user',
    standardCount: 0,
    ...hierarchy,
  };

  categories.push(newItem);
  return hydrateCategory(newItem);
}

function updateCategory(categoryId: number, data: Partial<CategoryItem>) {
  const index = categories.findIndex(item => item.categoryId === categoryId);
  if (index === -1) {
    return undefined;
  }

  categories[index] = {
    ...categories[index],
    categoryName: data.categoryName || categories[index].categoryName,
    description: data.description,
    status: data.status || categories[index].status,
  };

  return hydrateCategory(categories[index]);
}

module.exports = {
  name: 'category-manager-mock',
  desc: '数据标准目录管理',
  apis: [
    {
      name: '目录树',
      desc: '数据标准目录树',
      method: 'GET',
      url: '/_api/hsrm/v1/:organizationId/data-standard-categories/tree',
      handle: (_req: Request, res: Response) => {
        sendSuccess(res, getHydratedList());
      },
    },
    {
      name: '目录列表',
      desc: '数据标准目录列表',
      method: 'GET',
      url: '/_api/hsrm/v1/:organizationId/data-standard-categories',
      handle: (req: Request, res: Response) => {
        const list = filterList(getParams(req));
        res.status(200);
        res.send({
          content: list,
          totalElements: list.length,
        });
      },
    },
    {
      name: '新增目录',
      desc: '数据标准目录新增',
      method: 'POST',
      url: '/_api/hsrm/v1/:organizationId/data-standard-categories',
      handle: (req: Request, res: Response) => {
        const error = validateCategory(req.body || {});
        if (error) {
          sendFailed(res, error);
          return;
        }
        sendSuccess(res, createCategory(req.body || {}));
      },
    },
    {
      name: '编辑目录',
      desc: '数据标准目录编辑',
      method: 'PUT',
      url: '/_api/hsrm/v1/:organizationId/data-standard-categories/:categoryId',
      handle: (req: Request, res: Response) => {
        const categoryId = parseId(req.params.categoryId);
        const current = findCategory(categoryId);
        if (!current) {
          sendFailed(res, '数据不存在');
          return;
        }

        const error = validateCategory(
          {
            ...current,
            ...req.body,
          },
          categoryId,
        );
        if (error) {
          sendFailed(res, error);
          return;
        }

        sendSuccess(res, updateCategory(categoryId, req.body || {}));
      },
    },
    {
      name: '启用目录',
      desc: '数据标准目录启用',
      method: 'PUT',
      url:
        '/_api/hsrm/v1/:organizationId/data-standard-categories/:categoryId/enable',
      handle: (req: Request, res: Response) => {
        const updated = updateCategory(parseId(req.params.categoryId), {
          status: 'ENABLED',
        });
        updated ? sendSuccess(res, updated) : sendFailed(res, '数据不存在');
      },
    },
    {
      name: '停用目录',
      desc: '数据标准目录停用',
      method: 'PUT',
      url:
        '/_api/hsrm/v1/:organizationId/data-standard-categories/:categoryId/stop',
      handle: (req: Request, res: Response) => {
        const category = findCategory(req.params.categoryId);
        if (!category) {
          sendFailed(res, '数据不存在');
          return;
        }
        const enabledChildren = categories.filter(
          item =>
            item.parentId === category.categoryId && item.status === 'ENABLED',
        );
        if (category.level !== 'L3' && enabledChildren.length > 0) {
          sendFailed(res, '停用 L1/L2 时，其下所有子目录需已停用');
          return;
        }

        sendSuccess(
          res,
          updateCategory(category.categoryId, {
            status: 'STOPPED',
          }),
        );
      },
    },
    {
      name: '删除目录',
      desc: '数据标准目录删除',
      method: 'DELETE',
      url: '/_api/hsrm/v1/:organizationId/data-standard-categories/:categoryId',
      handle: (req: Request, res: Response) => {
        const categoryId = parseId(req.params.categoryId);
        const index = categories.findIndex(
          item => item.categoryId === categoryId,
        );
        const category = categories[index];

        if (!category) {
          sendFailed(res, '数据不存在');
          return;
        }
        if (
          category.level !== 'L3' &&
          categories.some(item => item.parentId === categoryId)
        ) {
          sendFailed(res, 'L1/L2 目录需无子节点才允许删除');
          return;
        }
        if (category.level === 'L3' && category.standardCount > 0) {
          sendFailed(res, 'L3 目录需未关联数据标准才允许删除');
          return;
        }

        const deleted = categories.splice(index, 1)[0];
        sendSuccess(res, deleted);
      },
    },
  ],
};
