import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import intl from 'utils/intl';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import { getCurrentOrganizationId } from 'utils/utils';
import {AxiosRequestConfig} from 'axios';
import {HG_SRM_API_PREFIX} from "@/utils/config";

const organizationId = getCurrentOrganizationId();

const intlPrefix = 'srm.demo.model';

const ListDSConfig = (queryFields?): DataSetProps => {
  return {
    autoQuery: true,
    pageSize: 100,
    transport: {
      read: (): AxiosRequestConfig => {
        return {
          // url: `${HG_SRM_API_PREFIX}/reference-data/head`,
          url: `${HG_SRM_API_PREFIX}/reference-data/head`,
          method: 'GET',
        };
      },
    },
    events: {
      query: ({ dataSet, params, data }) => {

      },
    },
  };
};


export { ListDSConfig };
