import * as emitter from "events";
import * as Papa from "papaparse";
import * as fs from "fs";

import { getCsvParserOptions } from "../utils/getCsvParserOptions";

export class Importer {
    constructor(evtEmitter) {
        this.importedFiles = [];

        this.import = this.import.bind(this);
        this.importSync = this.importSync.bind(this);
        this.getParserParams = this.getParserParams.bind(this);

        this.evtEmitter = evtEmitter;
        this.evtEmitter.on("changed", (file) => {
            this.import(file)
                .then(res => console.log(`${file.path}: ${JSON.stringify(res)}`))
                .catch(err => console.error(`ERROR in ${file.path}: ${err}`))
        });
    }

    /**
     * Extracts CSV file content asynchroniously and returns promise with the result or error
     * @param {*} file - file to import 
     */
    import (file) {
        return new Promise((resolve, reject) => {
            if (!file || !file.path) {
                return reject("Missing file");
            }
            if (!this.validatePath(file.path)) {
                return reject("File is not .csv or .txt");
            }

            if (this.importedFiles.filter(f => f === file.path).length > 0) {
                return reject("File already imported");
            }

            var content = fs.readFile(file.path, { encoding: 'UTF8' }, (err, data) => {
                this.importedFiles.push(file.path);

                if (err) {
                    return reject(err);
                }

                const result = Papa.parse(data, getCsvParserOptions());

                if (result.errors.length > 0) {
                    return reject(result.errors.map(err => err.message).join("\n"));
                } else {
                    return resolve(result.data);
                }
            });
        });
    }

        /**
     * Extracts CSV file content synchroniously and returns logs the parsed CSV data or error message to the console
     * @param {*} file - file to import 
     */
    importSync(file) {
        if (!file || !file.path) {
            console.error("ERROR: Missing file path");
            return;
        }
        if (!this.validatePath(file.path)) {
            console.error(`ERROR: File is not .csv or .txt: ${file.path}`);
            return;
        }

        this.importedFiles.push(file.path);

        var content = fs.readFileSync(file.path, { encoding: 'UTF8' });
        const result = Papa.parse(content, this.getParserParams());

        if (result.errors.length > 0) {
            console.error(`ERROR: ${result.errors.map(err => err.message).join("\n")}`);
        } else {
            console.log(`${file.path}: ${JSON.stringify(result.data)}`);
        }
    }

    /**
     * Validates file if it is .csv or .txt file
     * @param {*} path 
     */
    validatePath(path) {
        return (/\.(csv|txt)$/i).test(path);
    }
}