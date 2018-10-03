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
const {Program,Command,LovaClass} = require('lovacli');
const path = require('path');

let program = new Program({
		"name": "Sample CLI Love Tool",
		"debug": true,
		"version": "1.0.0",
		"paths": {
			"models": path.join(__dirname, "app/models"),
			"commands": path.join(__dirname, "app/commands"),
			"tests": path.join(__dirname, "app/tests")
		},
		"database": {
			"dialect": "sqlite",
			"storage": path.join(__dirname, "app/data.dat"),
			"sync": true
		}
	});

program.init();
```

#### Sample command class
Save it as test.js in `app/commands` path. 

```javascript
const { Program, Command } = require('lovacli');

class Handler extends Command {
    setup() {
	    /// setup() runs on command initialization
	    /// run as `node index.js test`
        return this.prog.command('test', 'Test command');
        /// read more about Caporal.js's prog methods 
        /// (options, args, validation) 
        /// here: https://github.com/mattallty/Caporal.js#examples
    }

	/// can be both async or sync one
    async handle(args, options, logger) {
	    // handle() runs on command execution
	    // as we probably don't need db for every run
        let db = await this.db.init();
        // both logger and this.logger works for accessing Winston
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
        // cli.exit();
    }
};

module.exports = Handler;
```

