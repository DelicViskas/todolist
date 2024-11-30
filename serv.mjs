import { createServer } from 'node:http';
import { addTodo, deleteTodo, getAllTodos, nextId } from './db_sqlite.mjs';


const
  port = 8080;

createServer(async (request, response) => {
  console.log((new Date()).toLocaleTimeString(), request.method, request.url);

  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (!request.url.startsWith('/todos')) {
    response.statusCode = 404;
    response.end("NOT Found 404")
    return;
  }

  switch (request.method) {
    case 'OPTIONS':
      response.writeHead(204);
      response.end();
      return;
    case 'GET':
      response.setHeader("Content-Type", "application/json; charset=utf-8;");
      response.write(JSON.stringify(getAllTodos()));
      break;
    case 'POST':
      const body = (await postData(request)).body;
      if (body.trim()) {
        addTodo({ id: nextId(), body });
        response.statusCode = 201;
      } else {
        response.statusCode = 400;
        response.end("empty request");
        return;
      }
      break;
    case 'DELETE':
      const
        urlParts = request.url.split('/'),
        todoId = urlParts[2];

      if (todoId) {
        deleteTodo(todoId);
        response.statusCode = 204;
      } else {
        response.statusCode = 400;
        response.end("bad request");
        return;
      }
      break;
  }
  response.end();
}).listen(port, () => console.log('server start at http://localhost:' + port))

async function postData(request) {
  const buffers = [];
  for await (const chunk of request)
    buffers.push(chunk);
  return JSON.parse(buffers)
}

