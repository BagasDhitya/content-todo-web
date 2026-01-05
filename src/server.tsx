// src/server.tsx
import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import TodosSSRModule from "./pages/todos/server-side";

const TodosSSR = TodosSSRModule.default || TodosSSRModule;

const app = express();

app.get("/todos/server-side", async (_req, res) => {
  try {
    // 1️⃣ Fetch todos dari API
    const response = await fetch("http://localhost:3000/todos");
    const todos = await response.json();

    // 2️⃣ Dynamic import HelmetAsync (Node ESM safe)
    const HelmetAsyncModule = await import("react-helmet-async");
    const HelmetProvider = HelmetAsyncModule.HelmetProvider;
    const Helmet = HelmetAsyncModule.Helmet;

    // 3️⃣ Setup helmet context
    const helmetContext: any = {};

    // 4️⃣ Render React component ke string
    const html = renderToString(
      <HelmetProvider context={helmetContext}>
        <>
          {/* Helmet metadata */}
          <Helmet>
            <title>Todos List (SSR)</title>
            <meta
              name="description"
              content="Daftar todo menggunakan Server Side Rendering (SSR) dengan React dan Express."
            />
            <meta name="robots" content="index, follow" />
            <meta property="og:title" content="Todos List (SSR)" />
            <meta
              property="og:description"
              content="Contoh SEO SSR React dengan Express."
            />
          </Helmet>

          {/* Component utama */}
          <TodosSSR todos={todos} />
        </>
      </HelmetProvider>
    );

    const { helmet } = helmetContext;

    // 5️⃣ Kirim HTML ke client
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          ${helmet.title.toString()}
          ${helmet.meta.toString()}
        </head>
        <body>
          <div id="root">${html}</div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(5174, () => console.log("SSR server running at http://localhost:5174"));
