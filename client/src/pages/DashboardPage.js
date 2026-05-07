import { useEffect, useState } from "react";
import api from "../services/api";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard")
      .then((res) => setData(res.data.data))
      .catch(() => setError("Не удалось загрузить dashboard"));
  }, []);

  if (error) return <div className="error">{error}</div>;
  if (!data) return <div className="loading">Загрузка...</div>;

  return (
    <>
      <div className="pageHeader">
        <h1>Dashboard</h1>
      </div>
      <div className="stats">
        <article><span>{data.assetTotal}</span><p>Всего оборудования</p></article>
        <article><span>{data.activeIncidents}</span><p>Активные инциденты</p></article>
        <article><span>{data.repairAssets}</span><p>На обслуживании</p></article>
      </div>
      <div className="dashboardGrid">
        <section className="panel">
          <h2>Оборудование по отделам</h2>
          {data.assetsByDepartment.map((item) => (
            <div className="bar" key={item.name}>
              <span>{item.name}</span>
              <strong style={{ width: `${Math.max(item.count * 16, 24)}px` }}>{item.count}</strong>
            </div>
          ))}
        </section>
        <section className="panel">
          <h2>Последние заявки</h2>
          {data.latestIncidents.map((item) => <p key={item._id}>{item.title} · {item.status}</p>)}
        </section>
        <section className="panel">
          <h2>Последние действия</h2>
          {data.latestActions.map((item) => <p key={item._id}>{item.type} · {item.performedBy}</p>)}
        </section>
      </div>
    </>
  );
}
