import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ username: "", password: "", role: "user" });
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Ошибка регистрации");
    }
  };

  return (
    <main className="authPage">
      <form className="authCard" onSubmit={submit}>
        <h1>Регистрация</h1>
        {error && <div className="error">{error}</div>}
        <input placeholder="Логин" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input placeholder="Пароль" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="user">user</option>
          <option value="manager">manager</option>
          <option value="admin">admin</option>
        </select>
        <button>Зарегистрироваться</button>
        <Link to="/login">Уже есть аккаунт</Link>
      </form>
    </main>
  );
}
