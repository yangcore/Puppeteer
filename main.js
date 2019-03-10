const {spawn} = require('child_process');

function cmdWork(cmd) {
    return new Promise(resolve => {
        const cmdFn = spawn(cmd, {// 仅在当前运行环境为 Windows 时，才使用 shell
            shell: process.platform === 'win32'
        });
        cmdFn.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        cmdFn.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });
        cmdFn.on('close', function (code) {
            console.log('child exists with code: ' + code, '执行完成');
            resolve()
        });
    })
}

const project = process.argv[2].split('+');
let cmdArr = [];
project.forEach(item => {
    cmdArr.push(cmdWork(`node ./index.js ${item}`))
});
Promise.all(cmdArr).then(() => {
    console.log('全部下载完成')
});

