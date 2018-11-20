## LovaCLI

node.js CLI boilerplate:

- On top of [Caporal.js](https://github.com/mattallty/Caporal.js)
- ES 2017 async/await ready
- Optional [Mongoose](https://mongoosejs.com/) or [Sequelize](http://docs.sequelizejs.com/) as MongoDB, MySQL, PostgreSQL ORM/ODM
- [Winston](https://github.com/winstonjs/winston)  as logger
- OOP for commands and modules
- :heart:

### Installation
`npm install lovacli --save`

### Usage

#### Sample application
```javascript
#!/usr/bin/env node

const {Program,Command,LovaClass} = require('lovacli');
const path = require('path');

let program = new Program({
        "name": "Sample CLI Application",
        "debug": true,
        "version": "1.0.0",
        "paths": {
            "commands": path.join(__dirname, "commands")
        }
    });

program.init();
```

#### Sample command class
Save it as test.js in `commands/` path. It will be ready to be executed as `node index.js test`

```javascript
const { Program, Command, LovaClass } = require('lovacli');

class Handler extends Command {
    /**
     * Set up command, description, options, arguments
     * Optional. You can ommit it if you don't need any specific settings
     * Can be async or sync.
     */
    async setup(progCommand) {
        progCommand.argument('[app]', 'App to deploy', /^myapp|their-app$/);
        progCommand.option('--tail <lines>', 'Tail <lines> lines of logs after deploy', this.prog.INT);
        progCommand.description('Command description');
        /// read more about Caporal.js's prog methods 
        /// (options, args, validation) 
        /// here: https://github.com/mattallty/Caporal.js#examples
    }

    /**
     * Handle command
     * Can be async or sync.
     */
    async handle(args, options, logger) {
        // handle() runs on command execution
        // as we probably don't need db for every run, lets initialize it on demand here
        let db = await this.db.init();
        // both logger and this.logger works for accessing Winston's methods
        // logger.info('info');
        // this.logger.info(eventTypes);

        // mongoose models        
        // let eventTypes = await db.EventType.find().exec();
        // this.logger.info(eventTypes);
        // ...

        // sequelize models
        // let rigs = await db.Rig.findAll();
        // this.logger.info(rigs);
        // ...

        logger.info('Done.');

        this.program.exit();
    }
};

module.exports = Handler;
```

### API

#### Program

##### `constructor(options)` : Program

Default options are:

```javascript
{
    "name": "LovaCLISampleApp",
    "debug": true,
    "version": "1.0.0",
    "paths": {
        "models": path.join(__dirname, "../app/models"),
        "commands": path.join(__dirname, "../app/commands"),
        "tests": path.join(__dirname, "../app/tests")
    }
}
```

You can extend them, passing options object, `const program = new Program({name: "Better name", debug: false});`

##### `async loadCommand(filename)` : Command

Loads command class from `filename`, create entity of it and initialize it. Assigns name(extract it from filename, so for testfile.js it will be 'testfile'), assigns description(optional help message, you can specify it with `description` method, getter or property of command class), and calls setup methods.

##### `async init(handleImmediate = true)`

* Loads all commands from options.paths.commands paths and initializes them.
* Executes application, if handleImmediate = true, defaults = true

##### `async handle()`

Executes application. Use it, after you initialize application with `init(false)`

```javascript
program.init(false).then(()=>{
    program.handle();
});
### or
await program.init(false);
await program.handle();
```

##### `async execute(name, args = [], options = {})`

Executes command by name. Use it if you need to call some command from another command's handle.

##### `exit(e = null)`

Exits application. Logs error if it's passed

#### Command

Need to be extended in order to use. Load and initialize extended classes using `program.init()` or `program.loadCommand()`.
Command is also EventEmitter, so feel free to use native EventEmmiter methods: https://nodejs.org/api/events.html#events_class_eventemitter

```javascript

const { Program, Command, LovaClass } = require('lovacli');

class Handler extends Command {
    /**
     * Optional
     */
    async setup(progCommand) {
    }

    /**
     * Required
     */
    async handle(args, options, logger) {
    }
};

module.exports = Handler;

```

##### `async setup(progCommand)`
##### `setup(progCommand)`

Optional to extend. Can be async or sync. Set up command, description, options, arguments.

```javascript
async setup(progCommand) {
    progCommand.argument('[app]', 'App to deploy', /^myapp|their-app$/);
    progCommand.option('--tail <lines>', 'Tail <lines> lines of logs after deploy', this.prog.INT);
    progCommand.description('Command description');
    /// read more about Caporal.js's prog methods 
    /// (options, args, validation) 
    /// here: https://github.com/mattallty/Caporal.js#examples
}
```

##### `async handle(args, options, logger)`
##### `handle(args, options, logger)`

Required. Can be async or sync. Run code executed for this command.

##### `async name()` : String

Returns command name.

##### `.logger` : Winston object

```javascript
    async handle(args, options, logger) {
        this.logger.info('Information');
        this.logger.debug(object);
        this.logger.error(object);
    }
```

##### `.program` : Parent Program instance

```javascript
    async handle(args, options, logger) {
        this.program.execute('othercommand, [1,'2'], {option: 'value'});
        this.program.exit(new Error('Hmmm!'));
    }
```

### How to?

#### Take application name, version and description from package.json?

It may be a good idea to store program's description and version name in one place. It's already in package.json, so why don't to use that values?

```javascript
#!/usr/bin/env node

const {Program,Command,LovaClass} = require('lovacli');
const path = require('path');

const pjson = require(path.join(__dirname, 'package.json'));

let program = new Program({
        "name": pjson.description || pjson.name,
        "version": pjson.version,
        "debug": true,
        "paths": {
            "commands": path.join(__dirname, "commands")
        }
    });

program.init();
```

#### Execute another command from command's handle

There's `program.execute` method:


```javascript
### somecommand.js
const { Program, Command, LovaClass } = require('lovacli');

class Handler extends Command {
    async handle(args, options, logger) {
    }
};

module.exports = Handler;
```

```javascript
### test.js
const { Program, Command, LovaClass } = require('lovacli');

class Handler extends Command {
    async handle(args, options, logger) {
        await this.program.execute('somecommand', ['argument1', 'argument2'], {option: 'value'});
    }
};

module.exports = Handler;
```


