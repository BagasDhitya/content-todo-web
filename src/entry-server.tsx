import { renderToString } from "react-dom/server";
import TodosSSR from "./pages/todos/server-side";

export async function render() {
    const res = await fetch("http://localhost:3000/todos");
    const todos = await res.json();

    const html = renderToString(<TodosSSR todos={todos} />);
    return { html, todos };
}
