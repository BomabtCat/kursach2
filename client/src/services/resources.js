export const resources = [
  {
    path: "assets",
    title: "Оборудование",
    fields: ["inventoryNumber", "name", "type", "model", "serialNumber", "status", "location", "notes"],
    columns: ["inventoryNumber", "name", "type", "status", "location"],
    fieldOptions: {
      type: ["server", "laptop", "router", "printer", "other"],
      status: ["active", "inactive", "repair", "retired"]
    },
    labels: {
      inventoryNumber: "Инвентарный номер",
      name: "Название",
      type: "Тип",
      model: "Модель",
      serialNumber: "Серийный номер",
      status: "Статус",
      location: "Местоположение",
      notes: "Примечания"
    }
  },
  {
    path: "employees",
    title: "Сотрудники",
    fields: ["firstName", "lastName", "email", "phone", "position", "status"],
    columns: ["lastName", "firstName", "email", "position", "status"],
    fieldOptions: {
      status: ["active", "inactive"]
    },
    labels: {
      firstName: "Имя",
      lastName: "Фамилия",
      email: "Email",
      phone: "Телефон",
      position: "Должность",
      status: "Статус"
    }
  },
  {
    path: "departments",
    title: "Отделы",
    fields: ["name", "code", "managerName", "status"],
    columns: ["name", "code", "managerName", "status"],
    fieldOptions: {
      status: ["active", "inactive"]
    },
    labels: {
      name: "Название",
      code: "Код",
      managerName: "Руководитель",
      status: "Статус"
    }
  },
  {
    path: "incidents",
    title: "Инциденты",
    fields: ["title", "description", "asset", "priority", "status"],
    columns: ["title", "priority", "status", "createdAt"],
    fieldOptions: {
      priority: ["low", "medium", "high", "critical"],
      status: ["open", "in_progress", "resolved", "closed"]
    },
    labels: {
      title: "Тема",
      description: "Описание",
      asset: "Оборудование",
      priority: "Приоритет",
      status: "Статус",
      createdAt: "Создано"
    }
  },
  {
    path: "maintenance",
    title: "Обслуживание",
    fields: ["asset", "type", "description", "performedBy", "cost", "date", "nextMaintenanceDate", "status"],
    columns: ["type", "performedBy", "cost", "status", "date"],
    fieldOptions: {
      status: ["planned", "completed", "cancelled"]
    },
    labels: {
      asset: "Оборудование",
      type: "Тип работ",
      description: "Описание",
      performedBy: "Исполнитель",
      cost: "Стоимость",
      date: "Дата",
      nextMaintenanceDate: "Следующее обслуживание",
      status: "Статус"
    }
  },
  {
    path: "vendors",
    title: "Поставщики",
    fields: ["name", "contactPerson", "email", "phone", "website", "status"],
    columns: ["name", "contactPerson", "email", "phone", "status"],
    fieldOptions: {
      status: ["active", "inactive"]
    },
    labels: {
      name: "Название",
      contactPerson: "Контактное лицо",
      email: "Email",
      phone: "Телефон",
      website: "Сайт",
      status: "Статус"
    }
  }
];

export const valueLabels = {
  admin: "Администратор",
  manager: "Менеджер",
  user: "Пользователь",
  active: "Активно",
  inactive: "Неактивно",
  repair: "В работе",
  retired: "Списано",
  open: "Открыта",
  in_progress: "В работе",
  resolved: "Решена",
  closed: "Закрыта",
  planned: "Запланировано",
  completed: "Выполнено",
  cancelled: "Отменено",
  server: "Сервер",
  laptop: "Ноутбук",
  router: "Роутер",
  printer: "Принтер",
  other: "Другое",
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
  critical: "Критический"
};
