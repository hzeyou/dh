import intl from 'utils/intl';
import { TagRender } from 'utils/renderer';
import { PublishStatus } from "hzero-front-apaas/lib/constants/businessObject";
const GET_STATUS_LIST = () => [{
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
const PublishStatusTag = ({
  status
}) => {
  const STATUS_LIST = GET_STATUS_LIST();
  return TagRender(status, STATUS_LIST);
};
export default PublishStatusTag;