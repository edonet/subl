#!/usr/bin/env node

'use strict';


const
    util = require('edoner'),
    dir = util.usedir(__dirname);


async function start() {
    let conf = await util.json(dir('../config.json'));

    if (!conf || !conf.sessionPath) {
        return false;
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


module.exports = start();
