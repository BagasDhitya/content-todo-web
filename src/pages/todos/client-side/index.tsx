import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function TodosCSR() {
  const navigate = useNavigate();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTodos() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/todos`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }

        setTodos(data);
      } catch {
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }

    fetchTodos();
  }, [navigate]);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        {error}
      </p>
    );
  }

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
        <link
          rel="canonical"
          href="http://localhost:5173/todos/client-side"
        />
      </Helmet>

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
    </>
  );
}
