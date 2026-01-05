import { BrowserRouter, Routes, Route } from "react-router-dom"

import TodoCSR from "./pages/todos/client-side"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<TodoCSR />} path="/todos/client-side" />
      </Routes>
    </BrowserRouter>
  )
}
