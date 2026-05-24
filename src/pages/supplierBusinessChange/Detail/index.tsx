import React, { useEffect, useMemo, useRef } from 'react';
import { Button, DataSet } from 'choerodon-ui/pro';
import { observer } from 'mobx-react';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';

import { getCurrentUserId, intl } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';

import {
  Header,
  Content,
  ListContent,
  ListItem,
  ContentCard,
} from 'components/Page';

import { compose } from '@/utils/util';

import { detailDSConf } from '@/pages/SupplierBusinessChange/stores/detailDS';
import { supplyCategoryDSConf } from '@/pages/SupplierBusinessChange/stores/supplyCategoryDS';
import BusinessChange from '@/pages/SupplierBusinessChange/components/BusinessChange';
import SupplyCategoryList from '@/pages/SupplierBusinessChange/components/SupplyCategoryList';

interface DetailProps {
  history: any;
  match: {
    params: {
      id: string;
    };
  };
}

function Detail(props: DetailProps) {
  const { history, match } = props;
  const {
    params: { id },
  } = match;

  // 是否为创建
  const isCreate: boolean = id === 'create';

  // 定义ds
  const [detailDS, supplyCategoryDS] = useMemo(() => {
    const _detailDS = new DataSet(detailDSConf());
    const _supplyCategoryDS = new DataSet(supplyCategoryDSConf());

    if (!isCreate) {
      _detailDS.setQueryParameter('id', id);
      _detailDS.query();
    }

    return [_detailDS, _supplyCategoryDS];
  }, [id]);

  const save = async () => {
    const base = await detailDS.validate();
    const supplyScope = await supplyCategoryDS.validate();
    console.log('toData==', detailDS.toData());
    console.log('base==', base, supplyScope);
    if (base && supplyScope) {
      detailDS.current?.set('certificateInfo', JSON.stringify(supplyCategoryDS.toData()));
      const res = await detailDS.submit();
      console.log('res==', res);
    }
  };

  return (
    <>
      <Header
        title={intl.get('srm.supplier.detail.title').d('供应商')}
        backPath="/pts/action-item/list"
        isChange={detailDS.dirty}
      >
        <Button icon="save" onClick={save} color={ButtonColor.primary}>
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
      </Header>
      <ListContent>
        <ListItem>

          <BusinessChange
            ds={detailDS}
            isCreate={isCreate}
          />

          <ContentCard title="供货品类清单">
            <SupplyCategoryList
              ds={supplyCategoryDS}
              detailDS={detailDS}
              isCreate={isCreate}
            />
          </ContentCard>

        </ListItem>
      </ListContent>
    </>
  );
}

export default compose(
  formatterCollections({
    code: [
      'pts.actionItem',
      'pts.operationHistory',
      'pts.common',
      'pts.common',
    ],
  }),
  observer,
)(Detail);
