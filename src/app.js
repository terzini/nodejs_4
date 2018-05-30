import * as config from "../config/default";
import {DirWatcher} from "./dirwatcher/DirWatcher";
import {Importer} from "./importer/Importer";

var watcher = new DirWatcher();
var importer  = new Importer(watcher);
watcher.watchPath(config.dataFolderPath, 2000);
