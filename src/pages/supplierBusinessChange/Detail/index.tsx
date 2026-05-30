import React, { useMemo } from 'react';
import { Button, DataSet } from 'choerodon-ui/pro';
import { observer } from 'mobx-react';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';

import { intl } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';

import { Header, ListContent, ListItem, ContentCard } from 'components/Page';

import { compose } from '@/utils/util';

import { detailDSConf } from '@/pages/SupplierBusinessChange/stores/detailDS';
import { supplyCategoryDSConf } from '@/pages/SupplierBusinessChange/stores/supplyCategoryDS';
import BusinessChange from '@/pages/SupplierBusinessChange/components/BusinessChange';
import SupplyCategoryList from '@/pages/SupplierBusinessChange/components/SupplyCategoryList';

interface HistoryLike {
  push(path: string): void;
}

interface DetailProps {
  history: HistoryLike;
  match: {
    params: {
      type: string;
      id?: string;
    };
  };
}

function Detail(props: DetailProps) {
  const { match } = props;
  const {
    params: { type, id },
  } = match;

  // 是否为创建/编辑/查看
  const isCreate: boolean = type === 'create';
  const isUpdate: boolean = type === 'update';
  const isView: boolean = type === 'view';

  // 定义ds
  const [detailDS, supplyCategoryDS] = useMemo(() => {
    const _detailDS = new DataSet(detailDSConf());
    const _supplyCategoryDS = new DataSet(supplyCategoryDSConf());

    _detailDS.setState('supplyCategoryDS', _supplyCategoryDS);

    if ((isUpdate || isView) && id) {
      _detailDS.setState('changeId', id);
      _detailDS.query();
    }

    return [_detailDS, _supplyCategoryDS];
  }, [id, isUpdate, isView]);

  const save = async () => {
    const base = await detailDS.validate();
    const supplyScope = await supplyCategoryDS.validate();

    if (base && supplyScope) {
      detailDS.current?.set(
        'certificateInfo',
        JSON.stringify(supplyCategoryDS.toData()),
      );
      await detailDS.submit();
    }
  };

  return (
    <>
      <Header
        title={intl.get('srm.supplier.detail.title').d('供应商业务变更')}
        backPath="/srm/supplier-business-change/list"
        isChange={!isView && detailDS.dirty}
      >
        {!isView ? (
          <Button icon="save" onClick={save} color={ButtonColor.primary}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        ) : null}
      </Header>
      <ListContent>
        <ListItem>
          <BusinessChange
            ds={detailDS}
            isCreate={isCreate}
            isUpdate={isUpdate}
            isView={isView}
          />

          <ContentCard title="供货品类清单">
            <SupplyCategoryList
              ds={supplyCategoryDS}
              detailDS={detailDS}
              isCreate={isCreate}
              isUpdate={isUpdate}
              isView={isView}
            />
          </ContentCard>
        </ListItem>
      </ListContent>
    </>
  );
}

export default compose(
  formatterCollections({
    code: ['srm.supplier'],
  }),
  observer,
)(Detail);
