"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sprintf_js_1 = require("sprintf-js");
const chalk_1 = __importDefault(require("chalk"));
class TablePrinter {
    constructor(template, columns) {
        this.template = template;
        this.columns = columns;
        this.buffer = [];
    }
    printHeader(...columns) {
        const header = sprintf_js_1.sprintf(this.template, ...this.columns);
        this.buffer.push(header);
    }
    printTodo(todo, { addHeader = true, addBackgroud = false, formatLine, ignoreDone = false } = {}) {
        const { done } = todo;
        let line = sprintf_js_1.sprintf(this.template, ...todo.toStringColums());
        if (addBackgroud) {
            line = chalk_1.default.bgGrey(line);
        }
        if (addHeader) {
            this.printHeader();
        }
        if (typeof formatLine === "function") {
            line = formatLine(line);
        }
        if (done) {
            line = chalk_1.default.strikethrough(line);
        }
        else {
            line = chalk_1.default.white(line);
        }
        this.buffer.push(line);
    }
    printBuffer() {
        for (const line of this.buffer) {
            console.log(line);
        }
        this.buffer = [];
    }
}
exports.default = TablePrinter;
//# sourceMappingURL=index.js.map