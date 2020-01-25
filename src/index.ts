#!/usr/bin/env node
import FileStore from "./storage/fileStore";
import Todos from "./todos";
import minimist from "minimist";
import { format as formatDate } from "date-fns";
import { dueDateConverter, camelCaser } from "./utils";
import { sprintf } from "sprintf-js";
import TablePrinter from "./printer";
import chalk from "chalk";
import Todo from "./todo";

const todosmgr = new Todos(new FileStore());
const tableTempl = ` %-5s %-3s %-50s %-12s `;
const separator = chalk.strikethrough(sprintf(tableTempl, "", "", "", ""));

const printer = new TablePrinter(tableTempl, ["", "ID", "Task", "Duedate"]);
interface printOptions {
  addHeader?: boolean;
  addBackgroud?: boolean;
  ignoreDone?: boolean;
  formatLine?: Function;
}

const args = minimist(process.argv.slice(2), {
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
  mark: (val: string): boolean => ["done", "d", "do"].includes(val),
  dueDate: dueDateConverter
};

function checkRequired(require: string): boolean {
  return require in args;
}

async function mapData(args: any, data: string[]): Promise<any> {
  try {
    const map: any = {};
    for (const entry of data) {
      if (entry in args) {
        const mapped = camelCaser(entry);
        if (mapped in dataTypes) {
          // @ts-ignore
          map[mapped] = dataTypes[mapped](args[entry]);
        } else {
          map[mapped] = args[entry];
        }
      }
    }
    return map;
  } catch (error) {
    throw error;
  }
}

function help() {
  const helpTempl = "%12s\t%-30s\t%-30s";
  console.log("Todoster - Simon Sinding\n");
  console.log("Usage - todoster <CMD> [args..]\n");

  console.log(
    chalk.bold(sprintf(helpTempl, "Command", "Usage", "Description"))
  );
  for (const command of commands) {
    const str = sprintf(
      helpTempl,
      command.cmd,
      command.usage || "",
      command.help
    );
    console.log(str);
  }
}

async function addTodo(args: any, { required, optional }: any) {
  try {
    const data = await mapData(args, [...optional, ...required]);
    const todo = todosmgr.addTodo(data);
    console.log("Created a todo");
    printer.printTodo(todo);
    setTimeout(() => printer.printBuffer(), 200);
  } catch (error) {
    console.log(`Couldn\'t add the todo: ${error.message}`);
  }
}

async function removeTodo(args: any) {
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
      formatLine: (val: string) => chalk.red.strikethrough(val)
    });
  } catch (error) {
    console.log(error.message);
    help();
  }
}

async function markTodoDone(args: any) {
  try {
    if (isNaN(parseInt(args._[1]))) {
      throw new Error("ID is not valid");
    }

    if (!args._[2]) {
      throw new Error("Missing last argument");
    }

    const id = parseInt(args._[1]);
    const done = dataTypes.mark(args._[2]);
    const todo = await todosmgr.modify(id, { done });
    printer.printTodo(todo, { addHeader: true, ignoreDone: true });
    printer.printBuffer();
  } catch (error) {
    console.log(error.message);
    help();
  }
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
async function modifyTodo(args: any, dataMap: string[]) {
  try {
    if (isNaN(parseInt(args._[1]))) {
      throw new Error("ID is not valid");
    }
    const id = parseInt(args._[1]);
    const data = await mapData(args, dataMap);

    const todo = await todosmgr.modify(id, data);
    printer.printTodo(todo);
  } catch (error) {
    console.log(error.message);
    help();
  }
}

(async () => {
  switch (command) {
    // List
    case commands[0].cmd:
      list();

      break;
    // Add
    case commands[1].cmd:
      let { required, optional } = commands[1];
      if (!required!.every(checkRequired)) {
        console.log(
          `Missing required argument(s): ${required!
            .map((r: any) => r)
            .join(", ")}`
        );
        process.exit(1);
      }
      await addTodo(args, { optional, required });
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
      modifyTodo(args, commands[4].optional!);
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
})();
