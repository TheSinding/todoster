"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const ms_1 = __importDefault(require("ms"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const fs_1 = __importDefault(require("fs"));
const locale_1 = require("date-fns/locale");
function getEnvLocale() {
    let env = process.env;
    console.log();
    const rawdata = fs_1.default.readFileSync(__dirname + "/dateformats.yaml", "utf8");
    const formats = js_yaml_1.default.load(rawdata);
    console.log(formats);
    return env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE;
}
exports.default = (val) => {
    console.log(getEnvLocale());
    console.log(val, ms_1.default(val));
    //@ts-ignore
    console.log(date_fns_1.parseISO(val), locale_1.da.formatDistance());
    if (ms_1.default(val))
        return date_fns_1.addMilliseconds(new Date(), ms_1.default(val)).valueOf();
    return date_fns_1.parseISO(val).valueOf();
};
//# sourceMappingURL=dueDate.js.map