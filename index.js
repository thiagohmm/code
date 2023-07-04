// Create express app
const express = require("express");
const app = express();
const { connect, selectNames } = require("./db");
const random_name = require('node-random-name');

// Server port
const HTTP_PORT = 3000;
// Start server
app.listen(HTTP_PORT, async () => {
  await connect();
  console.log("Server running on port " + HTTP_PORT);
});

async function addRegistry() {
  const conn = await connect();

  const data = {
    name: random_name(),
  };

  const sql = 'INSERT INTO people (name) VALUES (?)';
  const params = [data.name];
  return await conn.query(sql, params);
}

// Root endpoint
app.get("/", async (req, res, next) => {
  try {
    await addRegistry();
    const rows = await selectNames();
    const page = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Full Cycle Rocks!</title>
      </head>
      <body>
        <h1>Full Cycle Rocks!</h1>
        <ul>
          ${rows.map(row => `<li>${row.name}</li>`).join('')}
        </ul>
      </body>
      </html>`;

    res.send(page);
  } catch (error) {
    console.error('Ocorreu um erro:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Default response for any other request
app.use(function(req, res){
  res.status(404).send('Página não encontrada');
});
