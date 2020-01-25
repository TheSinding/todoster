import { format } from "date-fns";

export interface ITodo {
  readonly id: number;
  task: string;
  dueDate?: number | null;
  done: boolean;
}

export default class Todo implements ITodo {
  readonly id: number;
  task: string;
  dueDate?: number | null;
  done: boolean = false;

  constructor({ id, task, dueDate, done }: ITodo) {
    this.id = id;
    this.task = task;
    this.done = done;

    if (dueDate) this.dueDate = dueDate;
  }
  dateString(): string | null {
    if (!this.dueDate) return null;
    return format(this.dueDate, "dd-MM-yyyy");
  }
  doneToString() {
    return this.done ? "[ X ]" : "[   ]";
  }
  toStringColums() {
    return [this.doneToString(), this.id, this.task, this.dateString()];
  }
}
