'use strict';


/*
 **************************************
 * 加载依赖
 **************************************
 */
const
    argv = process.argv[2],
    util = require('edoner');


/*
 **************************************
 * 定义启动函数
 **************************************
 */
async function start() {
    let src = util.usedir(__dirname, '../'),
        dist = util.usedir(argv),
        configDir = src('./config.json'),
        config = await util.json(configDir);


    // 添加包文件
    if (config.packages && config.packages.length) {
        await Promise.all(config.packages.map(pkg => {
            let srcDir = src(pkg),
                distDir = dist(pkg);

            return util
                .symlink(srcDir, distDir)
                .then(() => console.log('Symlink:', srcDir, '->', distDir));
        }));
    }


    // 添加配置项
    config.packageFolder = argv;
    config.sessionPath = util.cwd(argv, '../Local', 'Session.sublime_session');
    config.commandPath = '/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl';

    // 写入配置
    await util.json(configDir, config);
    console.log('Oo, command has finished!');
}


/*
 **************************************
 * 执行启动函数
 **************************************
 */
argv && start().catch(err => console.error(err));
