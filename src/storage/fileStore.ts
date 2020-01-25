import fs from "fs";
import path from "path";
import debug from "debug";
const homedir = require("os").homedir();
import AbstractStore from "./store";
import Todo, { ITodo } from "../todo/todo";
import jsyaml from "js-yaml";

interface IDataStore {
  todos: Todo[];
}

export default class FileStore extends AbstractStore {
  filePath: string;
  constructor(filePath: string = `${homedir}/.config/todoster/todos.yaml"`) {
    super();
    this.filePath = filePath;
    const exists = fs.existsSync(this.filePath);
    if (!exists) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(this.filePath, "todos:\n");
    }
  }

  save(todos: Todo[]) {
    const yaml = jsyaml.dump({ todos });
    fs.writeFileSync(this.filePath, yaml);
  }
  readFile() {
    const data = fs.readFileSync(this.filePath, "utf8");
    return jsyaml.load(data);
  }

  load(todoId: number): Todo | undefined {
    const data: IDataStore = this.readFile();
    if (!("todos" in data)) throw new Error("Corrupt file");
    const todo = data.todos.find((t: ITodo) => t.id === todoId);
    return todo ? new Todo(todo) : todo;
  }

  loadAll(): Todo[] {
    const data = this.readFile();
    if (!("todos" in data)) throw new Error("Corrupt file");
    return (data.todos && data.todos.map((t: ITodo) => new Todo(t))) || [];
  }
}
