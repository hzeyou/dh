// import '../../../src/typings/global.d.ts';
// eslint-disable-next-line
/// <reference path="../../../src/typings.d.ts" />

import { DataSet } from 'choerodon-ui/pro';

interface ListProps {

  location: Location;
  history: any;
  listDS: DataSet;
}

interface DetailProps {
  history: any;

  match: {
    path: string;
    url: string;
    params: Record<string, any>
  };
  detailDS: DataSet;
}
