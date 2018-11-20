const EventEmitter = require('events');

class LovaClass extends EventEmitter {
    constructor(options = {}) {
        super();

        this._program = null;
        this._db = options.db || null;
        this._logger = options.logger || null;

        if (options.program) {
            this._program = options.program;
            this._db = options.program.db;
            this._logger = options.program.logger;
        }
    }

    get program() {
        return this._program;
    }

    get db() {
        return this._db;
    }

    get logger() {
        return this._logger;
    }

    async callMethod(methodName, ...args) {
        if (this[methodName] && this[methodName].constructor) {
            if (this[methodName].constructor.name == 'AsyncFunction') {
                return await (this[methodName].apply(this, args));
            } 
            if (this[methodName].constructor.name == 'Function') {
                return this[methodName].apply(this, args);                
            }
        }

        return this[methodName];
    }

}

module.exports = LovaClass;