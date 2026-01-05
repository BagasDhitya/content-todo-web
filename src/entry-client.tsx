import { hydrateRoot } from "react-dom/client";
import TodosSSR from "./pages/todos/server-side";

declare global {
    interface Window {
        __TODOS__: any;
    }
}

hydrateRoot(
    document.getElementById("root")!,
    <TodosSSR todos={window.__TODOS__} />
);
