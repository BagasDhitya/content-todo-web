import { BrowserRouter, Routes, Route } from "react-router-dom"

import TodoCSR from "./pages/todos/client-side"
import TodoSSR from "./pages/todos/server-side"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<TodoCSR />} path="/todos/client-side" />
        <Route element={<TodoSSR />} path="/todos/server-side" />
      </Routes>
    </BrowserRouter>
  )
}
