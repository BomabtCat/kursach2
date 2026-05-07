import { valueLabels } from "../services/resources";

const formatValue = (value) => {
  if (!value) return "-";
  if (typeof value === "object") return value.name || value.title || value.username || value.email || value._id || "-";
  if (/^\d{4}-\d{2}-\d{2}T/.test(String(value))) return new Date(value).toLocaleDateString("ru-RU");
  return valueLabels[value] || value;
};

export default function ResourceTable({ columns, labels = {}, items, sortBy, sortOrder, onSort, onEdit, onDelete }) {
  if (!items.length) return <div className="empty">Данных пока нет</div>;

  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>
                <button className="thButton" onClick={() => onSort(column)}>
                  {labels[column] || column} {sortBy === column ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </button>
              </th>
            ))}
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              {columns.map((column) => <td key={column}>{formatValue(item[column])}</td>)}
              <td>
                <div className="rowActions">
                  <button className="secondary" onClick={() => onEdit(item)}>Изм.</button>
                  <button className="danger" onClick={() => onDelete(item)}>Удал.</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
