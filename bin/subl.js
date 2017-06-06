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


    // 执行参数
    if (args.length) {
        return conf.commandPath ?
            await util.exec([`"${conf.commandPath}"`, ...args].join(' ')) :
            await util.exec('open "/Applications/Sublime Text.app"');
    }


    // 没有【session】时，启动程序
    if (!conf.sessionPath) {
        return await util.exec('open "/Applications/Sublime Text.app"');
    }

    let session = await util.json(conf.sessionPath),
        workspaces = session.workspaces;


    if (workspaces && workspaces.recent_workspaces) {
        let res = {};

        for (let x of workspaces.recent_workspaces) {
            if (!res[x] && await util.stat(x)) {
                res[x] = true;
            }
        }

        session['workspaces']['recent_workspaces'] = Object.keys(res);
        await util.json(conf.sessionPath, session);
    }


    await util.exec('open "/Applications/Sublime Text.app"');
}



/*
 **************************************
 * 抛出接口
 **************************************
 */
module.exports = start();
