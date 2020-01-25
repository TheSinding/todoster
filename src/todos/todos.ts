import AbstractStore from "../storage/store";
import Todo from "../todo/todo";
import { pick } from "lodash";

export default class Todos {
  store: AbstractStore;
  todos: Todo[];
  currentId: number;

  constructor(store: AbstractStore) {
    this.store = store;
    this.todos = this.store.loadAll();
    if (this.todos.length - 1 < 0) {
      this.currentId = 0;
    } else {
      this.currentId = this.todos[this.todos.length - 1].id + 1;
    }
  }

  addTodo(todo: Partial<Todo>): Todo {
    let temp = {
      id: todo.id!,
      task: todo.task!,
      done: todo.done! || false,
      ...todo
    };
    if (!temp.id) {
      temp.id = this.currentId++;
    }

    const _todo = new Todo(temp);
    this.todos.push(_todo);

    return _todo;
  }

  removeTodo(id: number): Todo {
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

  modify(id: number, data: Partial<Todo>): Todo {
    const todo = this.getTodo(id);

    if (!todo) {
      throw new Error("ID not found");
    }

    Object.assign(
      todo,
      pick(data, [
        "task",
        "done",
        "dueDate",
        "priority",
        "description",
        "doneDate"
      ])
    );

    return todo;
  }

  getTodo(id: number): Todo | undefined {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) {
      return this.store.load(id);
    } else {
      return todo;
    }
  }
  getAllTodos(): Todo[] {
    return this.todos;
  }
}
