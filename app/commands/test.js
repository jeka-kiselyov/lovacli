

exports.handler = function(prog) {
    var handle = async function(args, options, logger) {
        let db = await prog.application.db.init(); // optional here, so we don't initialize db for every command

        let item = await db.Sample.findOne();

        logger.debug(''+item);

        prog.application.exit();
        prog.application.exit(new Error('Somethign is wrong'));
    };

    return prog.command('test', 'Test command')
        .action(prog.application.handleCatcher(handle));
};