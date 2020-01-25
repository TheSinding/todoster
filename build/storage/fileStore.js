"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const homedir = require("os").homedir();
const store_1 = __importDefault(require("./store"));
const todo_1 = __importDefault(require("../todo/todo"));
const js_yaml_1 = __importDefault(require("js-yaml"));
class FileStore extends store_1.default {
    constructor(filePath = `${homedir}/.config/todoster/todos.yaml"`) {
        super();
        this.filePath = filePath;
        const exists = fs_1.default.existsSync(this.filePath);
        if (!exists) {
            fs_1.default.mkdirSync(path_1.default.dirname(filePath), { recursive: true });
            fs_1.default.writeFileSync(this.filePath, "todos:\n");
        }
    }
    save(todos) {
        const yaml = js_yaml_1.default.dump({ todos });
        fs_1.default.writeFileSync(this.filePath, yaml);
    }
    readFile() {
        const data = fs_1.default.readFileSync(this.filePath, "utf8");
        return js_yaml_1.default.load(data);
    }
    load(todoId) {
        const data = this.readFile();
        if (!("todos" in data))
            throw new Error("Corrupt file");
        const todo = data.todos.find((t) => t.id === todoId);
        return todo ? new todo_1.default(todo) : todo;
    }
    loadAll() {
        const data = this.readFile();
        if (!("todos" in data))
            throw new Error("Corrupt file");
        return (data.todos && data.todos.map((t) => new todo_1.default(t))) || [];
    }
}
exports.default = FileStore;
//# sourceMappingURL=fileStore.js.map