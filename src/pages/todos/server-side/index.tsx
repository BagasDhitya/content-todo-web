import React from "react";

interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

interface Props {
    todos: Todo[];
}

export default function TodosSSR({ todos }: Props) {
    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Todos (SSR)</h1>

            <ul className="space-y-2">
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        className="flex justify-between items-center p-3 bg-white rounded shadow"
                    >
                        <span
                            className={todo.completed ? "line-through text-gray-400" : ""}
                        >
                            {todo.title}
                        </span>
                        <span>{todo.completed ? "✅" : "⏳"}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
