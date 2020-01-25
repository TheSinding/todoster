import Todo from "../todo";
import { format as formatDate } from "date-fns";
import { sprintf } from "sprintf-js";
import chalk from "chalk";

interface printOptions {
  addHeader?: boolean;
  addBackgroud?: boolean;
  ignoreDone?: boolean;
  formatLine?: Function;
}

export default class TablePrinter {
  template: string;
  buffer: string[];
  columns: string[];
  constructor(template: string, columns: string[]) {
    this.template = template;
    this.columns = columns;
    this.buffer = [];
  }
  printHeader(...columns: string[]) {
    const header = sprintf(this.template, ...this.columns);
    this.buffer.push(header);
  }

  printTodo(
    todo: Todo,
    {
      addHeader = true,
      addBackgroud = false,
      formatLine,
      ignoreDone = false
    }: printOptions = {}
  ) {
    const { done } = todo;
    let line = sprintf(this.template, ...todo.toStringColums());

    if (addBackgroud) {
      line = chalk.bgGrey(line);
    }

    if (addHeader) {
      this.printHeader();
    }

    if (typeof formatLine === "function") {
      line = formatLine(line);
    }

    if (done) {
      line = chalk.strikethrough(line);
    } else {
      line = chalk.white(line);
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
