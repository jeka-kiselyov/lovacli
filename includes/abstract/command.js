
class Command {
    constructor(options = {}) {
        this._program = null;
        if (options.program) {
            this._program = options.program;
        }
    }

    get program() {
        return this._program;
    }

    get db() {
        return this.program.db;
    }

    get logger() {
        return this.program.logger;
    }

    get prog() {
        return this.program.prog;
    }

    setup() {
        return this.prog.command('test', 'Abstract test method, setup() should be implemented in child handler class');
    }

    init() {
        let progCommand = this.setup();
        progCommand.action(this.handleCatcher());
    }

    handle() {

    }

    handleCatcher() {
        let that = this;
        if (that.handle && that.handle.constructor && that.handle.constructor.name == 'AsyncFunction') {
            let newHandler = async function(args, options, logger) {
                try {
                    return await that.handle(args, options, logger);
                } catch(e) {
                    that.program.exit(e);
                }
                return null;
            }

            return newHandler;
        } else {
            let newHandler = function(args, options, logger) {
                try {
                    return that.handle(args, options, logger);
                } catch(e) {
                    that.program.exit(e);
                }
                return null;
            }

            return newHandler;      
        }
    }
}


module.exports = Command;