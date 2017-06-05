'use strict';


const
    argv = process.argv[2],
    util = require('edoner');


async function start() {
    let src = util.usedir(__dirname, '../'),
        dist = util.usedir(argv),
        configDir = src('./config.json'),
        config = await util.json(configDir);


    if (config.packages && config.packages.length) {
        await Promise.all(config.packages.map(pkg => {
            let srcDir = src(pkg),
                distDir = dist(pkg);

            return util
                .symlink(srcDir, distDir)
                .then(() => console.log('Symlink:', srcDir, '->', distDir));
        }));
    }


    config.packageFolder = argv;
    config.sessionPath = util.cwd(argv, '../Local', 'Session.sublime_session');
    await util.json(configDir, config);

    console.log('Oo, command has finished!');
}


argv && start().catch(err => console.error(err));
