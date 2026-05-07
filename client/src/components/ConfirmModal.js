export default function ConfirmModal({ title, onConfirm, onCancel }) {
  return (
    <div className="modalBackdrop">
      <div className="modal">
        <h3>{title}</h3>
        <p>Действие нельзя отменить из интерфейса.</p>
        <div className="actions right">
          <button className="danger" onClick={onConfirm}>Удалить</button>
          <button className="secondary" onClick={onCancel}>Отмена</button>
        </div>
      </div>
    </div>
  );
}
