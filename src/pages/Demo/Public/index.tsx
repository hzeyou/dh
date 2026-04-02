import formatterCollections from 'utils/intl/formatterCollections';


const Page = () => {

  return (
    <div>
      <span>不登录的页面</span>
    </div>
  );

};


export default formatterCollections({
  code: [`public`],
})(Page);
