import { useEffect, useState } from "react";
import { valueLabels } from "../services/resources";

const options = {
  role: ["admin", "manager", "user"],
  status: ["active", "inactive", "repair", "retired", "open", "in_progress", "resolved", "closed", "planned", "completed", "cancelled"],
  type: ["server", "laptop", "router", "printer", "other"],
  priority: ["low", "medium", "high", "critical"]
};

export default function ResourceForm({ fields, labels = {}, fieldOptions = {}, initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm(initial || {});
  }, [initial]);

  const change = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const optionValues = (field) => fieldOptions[field] || options[field];

  return (
    <form
      className="resourceForm"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      {fields.map((field) => (
        <label key={field}>
          {labels[field] || field}
          {optionValues(field) ? (
            <select value={form[field] || ""} onChange={(e) => change(field, e.target.value)}>
              <option value="">Не выбрано</option>
              {optionValues(field).map((value) => (
                <option key={value} value={value}>{valueLabels[value] || value}</option>
              ))}
            </select>
          ) : (
            <input value={form[field] || ""} onChange={(e) => change(field, e.target.value)} />
          )}
        </label>
      ))}
      <div className="actions right">
        <button type="submit">Сохранить</button>
        <button type="button" className="secondary" onClick={onCancel}>Отмена</button>
      </div>
    </form>
  );
}
