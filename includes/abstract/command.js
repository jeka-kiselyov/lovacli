const path = require('path');
const LovaClass = require(path.join(__dirname, 'lovaclass.js'));

class Command extends LovaClass {
    constructor(options = {}) {
        super(options);

        if (options.name) {
            this._name = ''+options.name;
        } else {
            this._name = null;
        }
    }

    get prog() {
        return this.program.prog;
    }

    async name() {
        if (this._name) {
            return this._name;
        }
    }

    async description() {
        if (this._description) {
            return this._description;
        }
    }

    async setup(progCommand) {
        // progCommand.argument('<app>', 'App to deploy', /^myapp|their-app$/);
    }

    async init() {
        let name = await this.callMethod('name');
        let description = await this.callMethod('description');
        
        /// create Caporal.js command https://github.com/mattallty/Caporal.js/blob/master/lib/command.js
        this._progCommand = this.prog.command(name, description);
        /// assign action to it. This does not execute it. 
        this._progCommand.action(this.handleCatcher());

        await this.callMethod('setup', this._progCommand);
    }

    async execute(args = [], options = {}) {
        let name = await this.callMethod('name');
        args.unshift(name);

        await this.program.prog.exec(args, options);
    }

    handle(args, options, logger) {

    }

    handleCatcher() {
        let that = this;
        if (that.handle && that.handle.constructor && that.handle.constructor.name == 'AsyncFunction') {
            let newHandler = async function(args, options, logger) {
                try {
                    return await that.handle(args, options, logger);
                } catch(e) {
                    that.emit('error', e);
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
                    that.emit('error', e);
                    that.program.exit(e);
                }
                return null;
            }

            return newHandler;      
        }
    }
}


module.exports = Command;