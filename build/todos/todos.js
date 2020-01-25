"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const todo_1 = __importDefault(require("../todo/todo"));
const lodash_1 = require("lodash");
class Todos {
    constructor(store) {
        this.store = store;
        this.todos = this.store.loadAll();
        if (this.todos.length - 1 < 0) {
            this.currentId = 0;
        }
        else {
            this.currentId = this.todos[this.todos.length - 1].id + 1;
        }
    }
    addTodo(todo) {
        let temp = Object.assign({ id: todo.id, task: todo.task, done: todo.done || false }, todo);
        if (!temp.id) {
            temp.id = this.currentId++;
        }
        const _todo = new todo_1.default(temp);
        this.todos.push(_todo);
        return _todo;
    }
    removeTodo(id) {
        const index = this.todos.findIndex(t => t.id === id);
        const todo = this.todos[index];
        if (index === -1) {
            throw new Error("ID not found");
        }
        this.todos.splice(index, 1);
        return todo;
    }
    saveTodos() {
        this.store.save(this.todos);
    }
    modify(id, data) {
        const todo = this.getTodo(id);
        if (!todo) {
            throw new Error("ID not found");
        }
        Object.assign(todo, lodash_1.pick(data, [
            "task",
            "done",
            "dueDate",
            "priority",
            "description",
            "doneDate"
        ]));
        return todo;
    }
    getTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) {
            return this.store.load(id);
        }
        else {
            return todo;
        }
    }
    getAllTodos() {
        return this.todos;
    }
}
exports.default = Todos;
//# sourceMappingURL=todos.js.map