import * as emitter from "events";
import * as fs from "fs";
import * as p from "path";

export class DirWatcher extends emitter.EventEmitter {
    constructor() {
        super();

        this.lastCheck = null;
        this.watchIntervalId = null;
        this.dirContent = [];

        this.watchPath = this.watchPath.bind(this);
        this.getDirContent = this.getDirContent.bind(this);
        this.stopWatch = this.stopWatch.bind(this);

        process.on("exit", this.stopWatch);
        process.on("SIGINT", this.stopWatch);
    }

    /**
     * Watches directory @path for changes at @delay interval and emits onchange event in case of changes of the file system
     * @param {*} path full path to directory in the file system
     * @param {*} delay interval in miliseconds
     */
    watchPath(path, delay) {
        clearInterval(this.watchIntervalId);

        let absolutePath = p.isAbsolute(path) ? p.normalize(path) : p.resolve(__dirname, path);

        if (!fs.existsSync(absolutePath) && __dirname.indexOf("\\src\\") > -1) {
            absolutePath = p.join(__dirname.split("\\src\\")[0], path);
        }

        if (!fs.existsSync(absolutePath)) {
            console.error("Directory does not exist: ", absolutePath);
            this.stopWatch();
            return;
        }

        this.watchIntervalId = setInterval(() => {
            const files = this.getDirContent(absolutePath);

            const changedFiles = files.filter(f => this.dirContent.every(curr => curr.file !== f.file) || (f.changed > this.lastCheck));

            changedFiles.forEach(cf => this.emit("changed", {
                path: cf.file
            }));

            this.dirContent = files;
            this.lastCheck = Date.now();
        }, delay);
    }

    /**
     * Stops directory watching
     */
    stopWatch() {
        clearInterval(this.watchIntervalId);
    }

    /**
     * Returns a list of files and directories located under @path
     * @param {*} path - directory full path
     */
    getDirContent(path) {
        if (!path) {
            console.error("No path specified");
            return;
        }
        const stat = fs.statSync(path);
        if (!stat.isDirectory()) {
            console.error(`Path is not a directory: ${path}`);
            return;
        }
        let allFiles = [];
        const files = fs.readdirSync(path);
        files.forEach(f => {
            const fullPath = p.join(path, f);
            const s = fs.statSync(fullPath);
            if (s.isFile()) {
                allFiles.push({
                    file: fullPath,
                    changed: s.ctime.getTime()
                });
            } else {
                allFiles = allFiles.concat(this.getDirContent(fullPath));
            }
        });
        return allFiles;
    }
}