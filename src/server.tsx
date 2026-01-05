import React from "react";
import express from "express";
import { renderToString } from "react-dom/server";
import TodosSSR from "./pages/todos/server-side";

const app = express();

app.get("/todos/server-side", async (_req, res) => {
  const response = await fetch("http://localhost:3000/todos");
  const todos = await response.json();

  const html = renderToString(<TodosSSR todos={todos} />);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <script>
          window.__TODOS__ = ${JSON.stringify(todos)}
        </script>
        <script type="module" src="/src/entry-client.tsx"></script>
      </head>
      <body class="bg-gray-100">
        <div id="root">${html}</div>
      </body>
    </html>
  `);
});

app.listen(5174, () => {
  console.log("SSR running at http://localhost:5174");
});
