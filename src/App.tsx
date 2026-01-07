import { BrowserRouter, Routes, Route } from "react-router-dom"

import TodoCSR from "./pages/todos/client-side"
import Login from "./pages/auth/login"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<TodoCSR />} path="/todos/client-side" />
        <Route element={<Login />} path="/auth/login" />
      </Routes>
    </BrowserRouter>
  )
}
