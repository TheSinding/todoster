"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
class Todo {
    constructor({ id, task, dueDate, done }) {
        this.done = false;
        this.id = id;
        this.task = task;
        this.done = done;
        if (dueDate)
            this.dueDate = dueDate;
    }
    dateString() {
        if (!this.dueDate)
            return null;
        return date_fns_1.format(this.dueDate, "dd-MM-yyyy");
    }
    doneToString() {
        return this.done ? "[ X ]" : "[   ]";
    }
    toStringColums() {
        return [this.doneToString(), this.id, this.task, this.dateString()];
    }
}
exports.default = Todo;
//# sourceMappingURL=todo.js.map