import Todo, { ITodo } from "../todo/todo";

export default abstract class AbstractStore {
  constructor() {}
  abstract save(todos: Todo[]): void;
  abstract load(todoId: number): Todo | undefined;
  abstract loadAll(): Todo[];
}
