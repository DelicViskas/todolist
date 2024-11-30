import { DatabaseSync } from 'node:sqlite';

const
  startTodos = [
    {
      id: 1,
      body: "Реализовать ToDo-list с использованием json-server"
    },
    {
      id: 2,
      body: "Реализовать ToDo-list с использованием собственного 'сервера'"
    }
  ],
  database = new DatabaseSync('./db.sqlite');

database.exec(`
  CREATE TABLE if not exists todos (
  id INTEGER PRIMARY KEY,
  body TEXT
  )`);

const
  addTodoSt = database.prepare(`INSERT OR IGNORE INTO todos (id, body) values (?, ?)`),
  deleteTodoSt = database.prepare(`DELETE FROM todos WHERE id=?`);  

export function addTodo({id, body}) {
  return addTodoSt.run(id, body);
}

export function deleteTodo(id) {
  return deleteTodoSt.run(id);
}

export function getAllTodos() {
  const 
    getAllTodosSt = database.prepare(`SELECT * from todos`);
  return getAllTodosSt.all();
}

export function nextId() {
  const maxIdSt = database.prepare(`SELECT id from todos ORDER BY id DESC 
    LIMIT 1;`).all();
  return maxIdSt[0].id + 1;
}

startTodos.forEach(todo => addTodo(todo))





