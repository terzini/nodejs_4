const meow = require("meow");

const cli = meow(`
    Usage
      $ ./streams --action=<actionName> --file=<filePath>
      $ ./streams --action=<actionName> <input>
      $ ./streams --path=<dirPath> 
      $ ./streams --help
 
    Options
      --action, -a  
      --file, -f
      --help, -h
      --path, -p
 
    Examples
    $ ./streams.js --action=outputFile --file=users.csv 
    $ ./streams.js --action=convertToFile --file=users.csv
    $ ./streams.js --action=transform textToTransform
    $ ./streams.js -a outputFile -f users.csv
    $ ./streams.js --help
    $ ./streams.js -h
    ˆ
`, {
        booleanDefault: undefined,
        flags: {
            file: {
                type: "string",
                alias: "f"
            },
            action: {
                type: "string",
                alias: "a"
            },
            path: {
                type: "string",
                alias: "p"
            },
            help: {
                type: "string",
                alias: "h"
            }
        }
    });

module.exports = cli;