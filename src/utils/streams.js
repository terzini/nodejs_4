const fs = require("fs");
const path = require("path");
const through2 = require("through2");
const Papa = require("papaparse");
const { Writable, Readable } = require("stream");
const https = require("follow-redirects").https;

const { getCsvParserOptions } = require("../utils/getCsvParserOptions");
const cli = require("./cli");

const externalCssUrl = "https://epa.ms/nodejs18-hw3-css";

/**
 * Reverse string data from process.stdin to process.stdout
 */
function reverse(str) {
    const readable = new Readable();
    readable.push(str);
    readable.push(null);

    readable
        .pipe(through2(function (chunk, enc, cb) {
            this.push(chunk.reverse());
            cb();
        }))
        .pipe(process.stdout);
}

/**
 * Convert data from process.stdin to upper-cased data on process.stdout
 */
function transform(str) {
    const readable = new Readable();
    readable.push(str);
    readable.push(null);

    readable
        .pipe(through2(function (chunk, enc, cb) {
            this.push(chunk.toString().toUpperCase());
            cb();
        }))
        .pipe(process.stdout);
}

/**
 * Pipes the given file defined by filePath to process.stdout
 * @param {*} filePath
 */
function outputFile(filePath) {
    fs.createReadStream(filePath).pipe(process.stdout);
}

/**
 * Convert file provided by filePath from csv to json and output data to process.stdout
 * @param {*} filePath 
 */
function convertFromFile(filePath) {
    if (!fs.existsSync(filePath)) {
        process.stdout.write(`File ${filePath} does not exist!`);
        return;
    }

    _streamCsvContent(filePath, process.stdout);
}

/**
 * Converts file provided by filePath from csv to json and saves data to json file
 * @param {*} filePath 
 */
function convertToFile(filePath) {
    if (!fs.existsSync(filePath)) {
        process.stdout.write(`File ${filePath} does not exist!`);
        return;
    }

    const newFilePath = path.join(
        path.parse(filePath).dir,
        path.parse(filePath).name + ".json");

    const writeStream = fs.createWriteStream(newFilePath);

    _streamCsvContent(filePath, writeStream);
}

function _streamCsvContent(readStream, writeStream) {
    let start = true;

    fs.createReadStream(readStream)
        .pipe(through2(function (chunk, enc, callback) {
            const options = getCsvParserOptions();
            options.step = (a) => {
                this.push(start ? "[" : ",");
                start = false;
                this.push(JSON.stringify(a.data[0], null, '\t'));
            };
            const result = Papa.parse(chunk.toString(), options);
            callback();
        }))
        .on("finish", () => { writeStream.write("]") })
        .pipe(writeStream);
}


async function cssBundler(dir) {
    if (!dir || !fs.existsSync(dir)) {
        console.error("Invalid path specified: ", dir);
        return;
    }

    const stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
        console.error(`Path is not a directory: ${dir}`);
        return;
    }

    // Delete bundle.css if already exists
    const bundleFile = path.join(dir, "bundle.css");
    if (fs.existsSync(bundleFile)) {
        fs.unlinkSync(bundleFile);
    }

    const promises = [];
    const files = fs.readdirSync(dir);
    files
        .filter(f => (/\.(css)$/i).test(f))
        .forEach(f => promises.push(readCssFileAsync(f, dir)));

    const writeStream = fs.createWriteStream(bundleFile);

    Promise.all(promises)
        .then((results) => {
            results.map(r => {
                writeStream.write(r.join(""));
            })
        })
        .then(() => {
            writeStream.write(`
            .ngmp18 {
                background-color: #fff;
                overflow: hidden;
                width: 100%;
                height: 100%;
                position: relative;
              }
              
              .ngmp18__hw3 {
                color: #333;
              }
              
              .ngmp18__hw3--t7 {
                font-weight: bold;
              }`.trim());
            writeStream.close();
        })
        // .then(getExternalCss)
        // .then(data => {
        //     writeStream.write("\n");
        //     writeStream.write(data);
        //     writeStream.close();
        // })
        .catch(err => console.error(err));
}

async function readCssFileAsync(f, dir) {
    return new Promise((resolve, reject) => {
        const fullPath = path.join(dir, f);
        const s = fs.statSync(fullPath);
        const fileData = [];
        if (s.isFile()) {
            fs.createReadStream(fullPath)
                .on("open", function () {
                    fileData.push(`\n/***** start of '${f}' *****/\n`);
                })
                .on("data", function (chunk) {
                    fileData.push(chunk.toString());
                })
                .on("close", function () {
                    fileData.push(`\n/***** end of '${f}' *****/\n`);
                    resolve(fileData);
                })
                .on("error", function (err) {
                    reject(err);
                })
        }
    });
}

/**
 * Returns promise resolving to the page content of the external URL 
 */
async function getExternalCss() {
    return new Promise((resolve, reject) => {
        https.get(externalCssUrl, function (resp) {
            let data = "";
            resp
                .on("data", function (chunk) {
                    data += chunk;
                })
                .on("end", function () {
                    resolve(data);
                })
                .on("error", function (err) {
                    reject(`Can not read data from ${externalCssUrl}! Error: ${err.message}`);
                });
        })
    });
}

function main() {
    const args = cli.flags;
    const input = cli.input;
   
    if (args.action) {
        switch (args.action) {
            case "reverse":
            case "transform": {
                if (!input || input.length === 0) {
                    console.error("Missing text to manipulate");
                    break;
                }
                
                args.action === "reverse" && reverse(input[0]);
                args.action === "transform" && transform(input[0]);
                break;
            }
            case "outputFile":
            case "convertFromFile":
            case "convertToFile": {
                if (!args.file) {
                    console.error("Missing file argument");
                    break;
                }

                args.action === "outputFile" && outputFile(args.file);
                args.action === "convertFromFile" && convertFromFile(args.file);
                args.action === "convertToFile" && convertToFile(args.file);
                break;
            }
            default: {
                console.error("Invalid action: ", args.action);
            };
        }
    }

    if (args.path) {
        cssBundler(args.path);
    }
};

main();
