import { neon } from "@neondatabase/serverless";

const
  sql = neon(process.env.DATABASE_URL);

(async function createTable() {
  await sql`
      CREATE TABLE if not exists todos (
      id INTEGER PRIMARY KEY,
      body TEXT
      )`
})();

export default async function todos(request, response) {
  response.setHeader("Content-Type", "application/json; charset=utf-8;");
  try {
    switch (request.method) {
      case 'GET':
        const rows = await sql`SELECT * FROM todos`;
        response.status(200).json(rows);
        break;

      case 'POST': {
        const body = request.body.body;
        if (!body) {
          response.status(400).send("Missing 'body' in request");
          return;
        }

        const id = await nextId();
        await addTodo({ id, body });
        response.status(201).send("Todo added");
        break;
      }

      case 'DELETE': {
        const id = request.query.id[0];
        if (!id) {
          response.status(400).send("Missing 'id' in request");
          return;
        }

        await sql`DELETE FROM todos WHERE id=${id}`;
        response.status(200).send("Todo deleted");
        break;
      }

    }
  } catch (error) {
    console.error("Error processing request:", error);
    response.status(500).send("Internal Server Error");
  }
}


async function addTodo({ id, body }) {
  return await sql`
    INSERT INTO todos (id, body)
    VALUES (${id}, ${body})
    ON CONFLICT (id) DO NOTHING
    `;
}

async function nextId() {
  const maxIdSt = await sql`SELECT MAX(id) as id FROM todos`;
  return maxIdSt[0].id + 1;
}