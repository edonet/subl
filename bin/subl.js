#!/usr/bin/env node

'use strict';


/*
 **************************************
 * 加载依赖
 **************************************
 */
const
    util = require('edoner'),
    dir = util.usedir(__dirname),
    args = process.argv.slice(2);


/*
 **************************************
 * 定义启动函数
 **************************************
 */
async function start() {
    let conf = await util.json(dir('../config.json'));


    // 直接启动程序
    if (!conf) {
        return await util.exec('open "/Applications/Sublime Text.app"');
    }


    // 执行参数命令
    if (args.length) {
        return conf.commandPath ?
            await util.exec([`"${conf.commandPath}"`, ...args].join(' ')) :
            await util.exec('open "/Applications/Sublime Text.app"');
    }


    // 没有【session】时，启动程序
    if (!conf.sessionPath) {
        return await util.exec('open "/Applications/Sublime Text.app"');
    }

    // 获取【session】
    let session = await util.json(conf.sessionPath),
        workspaces = session.workspaces;


    // 获取最近项目
    if (workspaces && workspaces.recent_workspaces) {
        let res = {};

        // 过滤最近项目
        for (let x of workspaces.recent_workspaces) {
            if (!res[x] && await util.stat(x)) {
                res[x] = true;
            }
        }

        // 写入最近项目
        session['workspaces']['recent_workspaces'] = Object.keys(res);
        await util.json(conf.sessionPath, session);
    }

    // 启动程序
    await util.exec('open "/Applications/Sublime Text.app"');
}



/*
 **************************************
 * 抛出接口
 **************************************
 */
module.exports = start().catch(err => console.error(err));
