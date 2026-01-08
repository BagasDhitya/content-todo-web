import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

type Role = "GUEST" | "VIP";

function getRoleFromToken(): Role | null {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role as Role;
  } catch {
    return null;
  }
}

export default function TodosCSR() {
  const navigate = useNavigate();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [role, setRole] = useState<Role | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= TOKEN ================= */

  async function refreshAccessToken() {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error("Refresh failed");
    }

    const data = await res.json();
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  }

  async function authFetch(
    url: string,
    options: RequestInit = {}
  ) {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/auth/login");
      throw new Error("No token");
    }

    let res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (res.status === 401) {
      accessToken = await refreshAccessToken();

      res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    }

    if (res.status === 403) {
      throw new Error("Forbidden: VIP only");
    }

    return res;
  }

  /* ================= READ ================= */

  async function fetchTodos() {
    try {
      const res = await authFetch(
        `${import.meta.env.VITE_API_URL}/todos`
      );

      const data = await res.json();
      setTodos(data);
    } catch (err) {
      localStorage.removeItem("accessToken");
      navigate("/auth/login");
    } finally {
      setLoading(false);
    }
  }

  /* ================= CREATE ================= */

  async function createTodo() {
    if (!newTodo.trim()) return;

    try {
      const res = await authFetch(
        `${import.meta.env.VITE_API_URL}/todos`,
        {
          method: "POST",
          body: JSON.stringify({ title: newTodo }),
        }
      );

      const created = await res.json();
      setTodos((prev) => [...prev, created]);
      setNewTodo("");
    } catch (err) {
      alert((err as Error).message);
    }
  }

  /* ================= UPDATE ================= */

  async function toggleTodo(todo: Todo) {
    try {
      const res = await authFetch(
        `${import.meta.env.VITE_API_URL}/todos/${todo.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            completed: !todo.completed,
          }),
        }
      );

      const updated = await res.json();

      setTodos((prev) =>
        prev.map((t) =>
          t.id === updated.id ? updated : t
        )
      );
    } catch (err) {
      alert((err as Error).message);
    }
  }

  /* ================= DELETE ================= */

  async function deleteTodo(id: number) {
    if (!confirm("Delete this todo?")) return;

    try {
      await authFetch(
        `${import.meta.env.VITE_API_URL}/todos/${id}`,
        {
          method: "DELETE",
        }
      );

      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  }

  /* ================= EFFECT ================= */

  useEffect(() => {
    setRole(getRoleFromToken());
    fetchTodos();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>Todos List (CSR)</title>
      </Helmet>

      <div className="max-w-md mx-auto mt-10 space-y-4">
        <h1 className="text-2xl font-bold">
          Todos (CSR) — {role}
        </h1>

        {/* CREATE (VIP ONLY) */}
        {role === "VIP" && (
          <div className="flex gap-2">
            <input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="flex-1 border px-3 py-2 rounded"
              placeholder="New todo"
            />
            <button
              onClick={createTodo}
              className="bg-blue-600 text-white px-4 rounded"
            >
              Add
            </button>
          </div>
        )}

        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex justify-between items-center p-3 bg-white rounded shadow"
            >
              <span
                className={`flex-1 ${todo.completed
                    ? "line-through text-gray-400"
                    : ""
                  }`}
              >
                {todo.title}
              </span>

              <div className="flex gap-2">
                {role === "VIP" && (
                  <>
                    <button
                      onClick={() => toggleTodo(todo)}
                    >
                      {todo.completed ? "↩️" : "✅"}
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                    >
                      🗑
                    </button>
                  </>
                )}

                {role === "GUEST" && (
                  <span>
                    {todo.completed ? "✅" : "⏳"}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
