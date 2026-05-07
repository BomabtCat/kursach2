import { useState } from "react";
import useResource from "../hooks/useResource";
import ResourceForm from "../components/ResourceForm";
import ResourceTable from "../components/ResourceTable";
import ConfirmModal from "../components/ConfirmModal";
import { useAuth } from "../context/AuthContext";
import { valueLabels } from "../services/resources";

export default function ResourcePage({ config }) {
  const { setToast } = useAuth();
  const { service, query, setQuery, data, loading, error, reload } = useResource(config.path);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const statusOptions = config.fieldOptions?.status || [];

  const save = async (form) => {
    try {
      if (editing?._id) await service.update(editing._id, form);
      else await service.create(form);
      setToast({ type: "success", text: "Сохранено" });
      setShowForm(false);
      setEditing(null);
      reload();
    } catch (err) {
      setToast({ type: "error", text: err.response?.data?.error?.message || "Ошибка сохранения" });
    }
  };

  const remove = async () => {
    await service.remove(deleting._id);
    setToast({ type: "success", text: "Удалено" });
    setDeleting(null);
    reload();
  };

  const sort = (column) => {
    setQuery((current) => ({
      ...current,
      sortBy: column,
      sortOrder: current.sortBy === column && current.sortOrder === "asc" ? "desc" : "asc"
    }));
  };

  return (
    <>
      <div className="pageHeader">
        <h1>{config.title}</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }}>Создать</button>
      </div>
      <div className="toolbar">
        <input placeholder="Поиск" value={query.search || ""} onChange={(e) => setQuery({ ...query, search: e.target.value, page: 1 })} />
        {statusOptions.length > 0 && (
          <select value={query.status || ""} onChange={(e) => setQuery({ ...query, status: e.target.value, page: 1 })}>
            <option value="">Все статусы</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{valueLabels[status] || status}</option>
            ))}
          </select>
        )}
      </div>
      {loading && <div className="loading">Загрузка...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && (
        <ResourceTable
          columns={config.columns}
          labels={config.labels}
          items={data.items}
          sortBy={query.sortBy}
          sortOrder={query.sortOrder}
          onSort={sort}
          onEdit={(item) => { setEditing(item); setShowForm(true); }}
          onDelete={setDeleting}
        />
      )}
      <div className="pagination">
        <button className="secondary" disabled={query.page <= 1} onClick={() => setQuery({ ...query, page: query.page - 1 })}>Назад</button>
        <span>{data.page} / {data.pages}</span>
        <button className="secondary" disabled={query.page >= data.pages} onClick={() => setQuery({ ...query, page: query.page + 1 })}>Вперед</button>
      </div>
      {showForm && (
        <div className="modalBackdrop">
          <div className="modal wide">
            <h3>{editing ? "Редактирование" : "Создание"}</h3>
            <ResourceForm
              fields={config.fields}
              labels={config.labels}
              fieldOptions={config.fieldOptions}
              initial={editing}
              onSubmit={save}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
      {deleting && <ConfirmModal title={`Удалить ${deleting.name || deleting.title || "запись"}?`} onConfirm={remove} onCancel={() => setDeleting(null)} />}
    </>
  );
}
