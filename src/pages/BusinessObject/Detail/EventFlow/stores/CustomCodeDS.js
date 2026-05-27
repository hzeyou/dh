import intl from 'utils/intl';
export const customCodeDs = () => ({
  fields: [{
    name: 'customCodeName',
    type: 'string',
    required: true
  }, {
    name: 'customCodes',
    type: 'string'
  }],
  data: [{
    customCodeName: intl.get('hmde.bo.flow.customCode.code1').d('编码一'),
    code: `import { Button } from 'antd';

    ReactDOM.render(
      <>
        <Button type="primary">Primary Button</Button>
        <Button>Default Button</Button>
        <Button type="dashed">Dashed Button</Button>
        <br />
        <Button type="text">Text Button</Button>
        <Button type="link">Link Button</Button>
      </>,
      mountNode,
    );`
  }, {
    customCodeName: intl.get('hmde.bo.flow.customCode.code2').d('编码二'),
    code: `import { Button } from 'antd';

    ReactDOM.render(
      <>
        <Button type="primary">Primary Button</Button>
        <Button>Default Button</Button>
        <Button type="dashed">Dashed Button</Button>
        <br />
        <Button type="text">Text Button</Button>
        <Button type="link">Link Button</Button>
      </>,
      mountNode,
    );`
  }]
});