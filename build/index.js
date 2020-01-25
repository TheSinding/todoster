#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileStore_1 = __importDefault(require("./storage/fileStore"));
const todos_1 = __importDefault(require("./todos"));
const minimist_1 = __importDefault(require("minimist"));
const utils_1 = require("./utils");
const sprintf_js_1 = require("sprintf-js");
const printer_1 = __importDefault(require("./printer"));
const chalk_1 = __importDefault(require("chalk"));
const todosmgr = new todos_1.default(new fileStore_1.default());
const tableTempl = ` %-5s %-3s %-50s %-12s `;
const separator = chalk_1.default.strikethrough(sprintf_js_1.sprintf(tableTempl, "", "", "", ""));
const printer = new printer_1.default(tableTempl, ["", "ID", "Task", "Duedate"]);
const args = minimist_1.default(process.argv.slice(2), {
    alias: {
        d: "due-date",
        t: "task",
        p: "priority",
        m: "mark",
        D: "done",
        N: "not-done",
        a: "list-done"
    }
});
const command = args._[0];
const commands = [
    { cmd: "list", help: `List todos`, usage: "list [args]" },
    {
        cmd: "add",
        required: ["task"],
        optional: ["description", "due-date", "priority", "done"],
        help: `Adds a new todo.`,
        usage: "add [args]"
    },
    { cmd: "remove", help: `Removes a todo`, usage: "remove {ID}" },
    {
        cmd: "mark",
        optional: ["done", "not-done"],
        help: `Mark a todo done or not done.`,
        usage: "mark {ID} [done|not done]"
    },
    {
        cmd: "modify",
        optional: ["task", "description", "due-date", "priority"],
        help: `Modify a todo.`,
        usage: "modify {ID} [args]"
    },
    { cmd: "help", help: `Show this help` }
];
const dataTypes = {
    mark: (val) => ["done", "d", "do"].includes(val),
    dueDate: utils_1.dueDateConverter
};
function checkRequired(require) {
    return require in args;
}
function mapData(args, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const map = {};
            for (const entry of data) {
                if (entry in args) {
                    const mapped = utils_1.camelCaser(entry);
                    if (mapped in dataTypes) {
                        // @ts-ignore
                        map[mapped] = dataTypes[mapped](args[entry]);
                    }
                    else {
                        map[mapped] = args[entry];
                    }
                }
            }
            return map;
        }
        catch (error) {
            throw error;
        }
    });
}
function help() {
    const helpTempl = "%12s\t%-30s\t%-30s";
    console.log("Todoster - Simon Sinding\n");
    console.log("Usage - todoster <CMD> [args..]\n");
    console.log(chalk_1.default.bold(sprintf_js_1.sprintf(helpTempl, "Command", "Usage", "Description")));
    for (const command of commands) {
        const str = sprintf_js_1.sprintf(helpTempl, command.cmd, command.usage || "", command.help);
        console.log(str);
    }
}
function addTodo(args, { required, optional }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield mapData(args, [...optional, ...required]);
            const todo = todosmgr.addTodo(data);
            console.log("Created a todo");
            printer.printTodo(todo);
            setTimeout(() => printer.printBuffer(), 200);
        }
        catch (error) {
            console.log(`Couldn\'t add the todo: ${error.message}`);
        }
    });
}
function removeTodo(args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (isNaN(parseInt(args._[1]))) {
                throw new Error("ID is not valid");
            }
            const id = parseInt(args._[1]);
            const todo = todosmgr.removeTodo(id);
            console.log(`Todo '${todo.task}' has been removed`);
            printer.printTodo(todo, {
                addHeader: true,
                ignoreDone: true,
                formatLine: (val) => chalk_1.default.red.strikethrough(val)
            });
        }
        catch (error) {
            console.log(error.message);
            help();
        }
    });
}
function markTodoDone(args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (isNaN(parseInt(args._[1]))) {
                throw new Error("ID is not valid");
            }
            if (!args._[2]) {
                throw new Error("Missing last argument");
            }
            const id = parseInt(args._[1]);
            const done = dataTypes.mark(args._[2]);
            const todo = yield todosmgr.modify(id, { done });
            printer.printTodo(todo, { addHeader: true, ignoreDone: true });
            printer.printBuffer();
        }
        catch (error) {
            console.log(error.message);
            help();
        }
    });
}
function list() {
    printer.printHeader();
    let alternate = true;
    for (const todo of todosmgr.getAllTodos()) {
        if (todo.done && !args["list-done"]) {
            continue;
        }
        alternate = !alternate;
        printer.printTodo(todo, { addBackgroud: alternate, addHeader: false });
        //   console.log(todo);
    }
    // console.log("------------------");
}
function modifyTodo(args, dataMap) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (isNaN(parseInt(args._[1]))) {
                throw new Error("ID is not valid");
            }
            const id = parseInt(args._[1]);
            const data = yield mapData(args, dataMap);
            const todo = yield todosmgr.modify(id, data);
            printer.printTodo(todo);
        }
        catch (error) {
            console.log(error.message);
            help();
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    switch (command) {
        // List
        case commands[0].cmd:
            list();
            break;
        // Add
        case commands[1].cmd:
            let { required, optional } = commands[1];
            if (!required.every(checkRequired)) {
                console.log(`Missing required argument(s): ${required
                    .map((r) => r)
                    .join(", ")}`);
                process.exit(1);
            }
            yield addTodo(args, { optional, required });
            break;
        // Remove
        case commands[2].cmd:
            removeTodo(args);
            break;
        // Mark
        case commands[3].cmd:
            markTodoDone(args);
            break;
        // Modify
        case commands[4].cmd:
            modifyTodo(args, commands[4].optional);
            break;
        case commands[5].cmd:
            help();
            break;
        default:
            console.log(`Uknown command: ${command}`);
            help();
            process.exit(1);
            break;
    }
    todosmgr.saveTodos();
}))();
//# sourceMappingURL=index.js.map