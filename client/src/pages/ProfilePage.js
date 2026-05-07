import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <div className="panel narrow">
      <h1>Профиль</h1>
      <p><strong>Логин:</strong> {user?.username}</p>
      <p><strong>Роль:</strong> {user?.role}</p>
      <p><strong>Статус:</strong> {user?.status || "active"}</p>
    </div>
  );
}
