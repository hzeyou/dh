const { spawn } = require('child_process');
const path = require('path');

// 确保在 hg-srm 目录下运行
const cwd = __dirname;

// 启动 smock，使用 npx
const smock = spawn('npx', ['smock', '-p', '5000'], {
  stdio: 'inherit',
  shell: true,
  cwd: cwd
});

// 等待一下让 smock 启动
setTimeout(() => {
  // 启动 umi dev
  const umi = spawn('cross-env', ['UMI_ENV=dev', 'node', '../../node_modules/umi/bin/umi.js', 'dev'], {
    stdio: 'inherit',
    shell: true,
    cwd: cwd
  });

  umi.on('exit', (code) => {
    smock.kill();
    process.exit(code);
  });
}, 2000);

process.on('SIGINT', () => {
  smock.kill();
  process.exit();
});
