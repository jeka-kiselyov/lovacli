const { Program, Command } = require('lovacli');

class Handler extends Command {
    setup() {
        return this.prog.command('test', 'Test command');
    }

    async handle(args, options, logger) {
        let db = await this.db.init();
        // logger.info('#'+users[k].id, users[k].un, stats);

        // mongoose models        
        // let eventTypes = await db.EventType.find().exec();
        // this.logger.info(eventTypes);
        // ...

        // sequelize models
        // let rigs = await db.Rig.findAll();
        // this.logger.info(rigs);
        // ...


        logger.info('Done.');
        // cli.exit();
    }
};

module.exports = Handler;