
class LovaClass {
    constructor(options = {}) {
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

}

module.exports = LovaClass;