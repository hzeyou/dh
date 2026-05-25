// 在 config.[UMI_ENV].ts 文件中 请不要使用 extendParentConfig
export default {
  devtool: 'eval',
  define: {
    'process.env': {
      // 这里修改成网关服务器后端地址
      SRM_DEV_HOST: 'http://localhost:8000',
      SRM_HOST: 'https://test-hzero-gateway.imiracle.tech',
    },
  },
  // proxy: {
  //   '/hsrm/': {
  //     target: 'http://localhost:5000',
  //     changeOrigin: true,
  //     pathRewrite: {
  //       '^/hsrm': '',
  //     },
  //   },
  // },
};
