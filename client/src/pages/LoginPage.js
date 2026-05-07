import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ username: "admin", password: "Admin123!" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="authPage">
      <form className="authCard" onSubmit={submit}>
        <h1>IT Infrastructure System</h1>
        <h2>Вход</h2>
        {error && <div className="error">{error}</div>}
        <input placeholder="Логин" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input placeholder="Пароль" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={loading}>{loading ? "Вход..." : "Войти"}</button>
        <Link to="/register">Создать аккаунт</Link>
      </form>
    </main>
  );
}
