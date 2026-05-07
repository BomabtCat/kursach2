import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const nav = [
  ["Главная", "/"],
  ["Оборудование", "/assets"],
  ["Сотрудники", "/employees"],
  ["Отделы", "/departments"],
  ["Инциденты", "/incidents"],
  ["Обслуживание", "/maintenance"],
  ["Поставщики", "/vendors"],
  ["Профиль", "/profile"]
];

export default function Layout({ children }) {
  const { user, logout, toast, setToast } = useAuth();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">IT Infra</div>
        <nav>
          {nav.map(([label, to]) => (
            <NavLink key={to} to={to} end={to === "/"}>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div>
            <strong>{user?.username}</strong>
            <span>{user?.role}</span>
          </div>
          <button className="secondary" onClick={logout}>Выйти</button>
        </header>
        <section className="content">{children}</section>
      </div>
      {toast && (
        <button className={`toast ${toast.type}`} onClick={() => setToast(null)}>
          {toast.text}
        </button>
      )}
    </div>
  );
}
