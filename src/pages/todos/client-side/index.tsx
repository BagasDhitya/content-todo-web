import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function TodosCSR() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/todos")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Helmet key="todos-csr" prioritizeSeoTags>
        <title>Todos List (CSR) | My React App</title>
        <meta
          name="description"
          content="Daftar todo sederhana menggunakan Client Side Rendering (CSR) di React."
        />
        <meta
          name="keywords"
          content="React CSR, Todos React, React SEO, Client Side Rendering"
        />

        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Todos List (CSR)" />
        <meta
          property="og:description"
          content="Contoh implementasi SEO pada halaman Todos menggunakan React CSR."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="http://localhost:5173/todos/csr" />
      </Helmet>
      {loading ? (
        <p className="text-center mt-10">Loading...</p>
      ) : (
        <div className="max-w-md mx-auto mt-10">
          <h1 className="text-2xl font-bold mb-4">Todos (CSR)</h1>

          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex justify-between items-center p-3 bg-white rounded shadow"
              >
                <span
                  className={
                    todo.completed ? "line-through text-gray-400" : ""
                  }
                >
                  {todo.title}
                </span>
                <span>{todo.completed ? "✅" : "⏳"}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
