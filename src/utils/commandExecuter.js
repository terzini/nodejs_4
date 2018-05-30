
const minArgsLength = 3;
const MSG_INVALID = "Wrong input: Invalid adguments";
const MSG_MISSING = "Wrong input: Missing adguments";
const operations = [];

// TODO : this one is experimental and not completed. 
// I will use ready module for parsing arguments at this stage
function commandExecuter(args) {
    if (args.length < minArgsLength) {
        console.error(MSG_MISSING);
        return;
    }

    for (let i = 2; i < args.length; i++) {
        if (args[i].slice(0, 2) === "--") {
            operations.push({
                action: args[i].indexOf("=") > 0 && args[i].split("=")[0].slice(2) || args[i].slice(2),
                param: args[i].indexOf("=") > 0 && args[i].split("=")[1] || undefined
            })
        } else {
            if (args[i].slice(0, 1) === "-") {
                operations.push({
                    action: args[i].slice(1),
                    param: i + 1 < args.length && args[++i] || undefined
                })
            }
        }
    }

    switch (operations[0].action) {
        case "h":
        case "help":
            {
                console.log("help");
                break;
            }
        case "a":
        case "action":
            {
                switch (operations[0].param) {
                    case "io":
                    case "transform-file":
                        break;
                    case "transform":
                        break;
                    default:
                        console.error(operations[0].param);
                }
                break;
            }
        default:
            console.error("Invalid first argument: " + operations[0]);
    }
};
