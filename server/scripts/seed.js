require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const config = require("../src/config/env");
const User = require("../src/models/User");
const Department = require("../src/models/Department");
const Employee = require("../src/models/Employee");
const Vendor = require("../src/models/Vendor");
const Asset = require("../src/models/Asset");
const Incident = require("../src/models/Incident");
const MaintenanceLog = require("../src/models/MaintenanceLog");

const withAudit = (data, userId) => ({ ...data, createdBy: userId, updatedBy: userId });

const seed = async () => {
  await mongoose.connect(config.mongoUri);

  await Promise.all([
    User.deleteMany({}),
    Department.deleteMany({}),
    Employee.deleteMany({}),
    Vendor.deleteMany({}),
    Asset.deleteMany({}),
    Incident.deleteMany({}),
    MaintenanceLog.deleteMany({})
  ]);

  const password = await bcrypt.hash("Admin123!", config.bcryptSaltRounds);
  const admin = await User.create({ username: "admin", password, role: "admin" });
  const manager = await User.create({ username: "manager", password, role: "manager" });
  const support = await User.create({ username: "support", password, role: "user" });

  const departments = await Department.insertMany(
    [
      { name: "Отдел информационных технологий", code: "IT", managerName: "Иван Петров" },
      { name: "Бухгалтерия", code: "FIN", managerName: "Ольга Смирнова" },
      { name: "Отдел продаж", code: "SALE", managerName: "Анна Волкова" },
      { name: "Маркетинг", code: "MKT", managerName: "Марина Белова" },
      { name: "Склад и логистика", code: "LOG", managerName: "Сергей Егоров" },
      { name: "Отдел кадров", code: "HR", managerName: "Наталья Козлова" },
      { name: "Юридический отдел", code: "LAW", managerName: "Павел Орлов" },
      { name: "Служба поддержки клиентов", code: "SUP", managerName: "Кирилл Сафонов" }
    ].map((item) => withAudit(item, admin._id))
  );

  const dept = Object.fromEntries(departments.map((item) => [item.code, item]));

  const vendors = await Vendor.insertMany(
    [
      { name: "ТехноПоставка", contactPerson: "Дмитрий Лебедев", email: "sales@technopostavka.local", phone: "+7 495 100-10-10", website: "https://technopostavka.local" },
      { name: "Сетевые Решения", contactPerson: "Мария Ким", email: "support@net-solutions.local", phone: "+7 495 200-20-20", website: "https://net-solutions.local" },
      { name: "ОфисПринт Сервис", contactPerson: "Александр Фролов", email: "service@officeprint.local", phone: "+7 495 300-30-30", website: "https://officeprint.local" },
      { name: "СерверГрад", contactPerson: "Екатерина Панина", email: "order@servergrad.local", phone: "+7 495 400-40-40", website: "https://servergrad.local" },
      { name: "Ноутбук Центр", contactPerson: "Виктор Мельников", email: "b2b@notebook-center.local", phone: "+7 495 500-50-50", website: "https://notebook-center.local" },
      { name: "Безопасные Системы", contactPerson: "Игорь Синицын", email: "info@safe-systems.local", phone: "+7 495 600-60-60", website: "https://safe-systems.local" }
    ].map((item) => withAudit(item, admin._id))
  );

  const vendor = Object.fromEntries(vendors.map((item) => [item.name, item]));

  const employees = await Employee.insertMany(
    [
      ["Алексей", "Соколов", "a.sokolov@company.local", "DevOps-инженер", "IT"],
      ["Елена", "Морозова", "e.morozova@company.local", "Главный бухгалтер", "FIN"],
      ["Дмитрий", "Крылов", "d.krylov@company.local", "Менеджер по продажам", "SALE"],
      ["Ирина", "Лукина", "i.lukina@company.local", "Маркетолог", "MKT"],
      ["Сергей", "Кузнецов", "s.kuznetsov@company.local", "Кладовщик", "LOG"],
      ["Наталья", "Козлова", "n.kozlova@company.local", "HR-специалист", "HR"],
      ["Павел", "Орлов", "p.orlov@company.local", "Юрист", "LAW"],
      ["Кирилл", "Сафонов", "k.safonov@company.local", "Оператор поддержки", "SUP"],
      ["Вера", "Павлова", "v.pavlova@company.local", "Системный администратор", "IT"],
      ["Максим", "Громов", "m.gromov@company.local", "Инженер Service Desk", "IT"],
      ["Оксана", "Романова", "o.romanova@company.local", "Финансовый аналитик", "FIN"],
      ["Артем", "Васильев", "a.vasiliev@company.local", "Руководитель продаж", "SALE"],
      ["Юлия", "Захарова", "y.zakharova@company.local", "Контент-менеджер", "MKT"],
      ["Роман", "Федоров", "r.fedorov@company.local", "Логист", "LOG"],
      ["Татьяна", "Медведева", "t.medvedeva@company.local", "Рекрутер", "HR"],
      ["Георгий", "Никитин", "g.nikitin@company.local", "Специалист поддержки", "SUP"],
      ["Лариса", "Попова", "l.popova@company.local", "Бухгалтер", "FIN"],
      ["Илья", "Тарасов", "i.tarasov@company.local", "Сетевой инженер", "IT"],
      ["Светлана", "Комарова", "s.komarova@company.local", "Менеджер проектов", "SALE"],
      ["Михаил", "Беляев", "m.belyaev@company.local", "Юрисконсульт", "LAW"]
    ].map(([firstName, lastName, email, position, departmentCode], index) =>
      withAudit(
        {
          firstName,
          lastName,
          email,
          phone: `+7 900 ${String(100 + index).slice(0, 3)}-${String(10 + index).padStart(2, "0")}-${String(20 + index).padStart(2, "0")}`,
          position,
          department: dept[departmentCode]._id
        },
        admin._id
      )
    )
  );

  const emp = Object.fromEntries(employees.map((item) => [`${item.firstName} ${item.lastName}`, item]));

  const assetRows = [
    ["SRV-001", "Основной сервер приложений", "server", "Dell PowerEdge R650", "SRV650-001", "active", "Серверная A1", "Алексей Соколов", "IT", "СерверГрад"],
    ["SRV-002", "Сервер базы данных", "server", "HPE ProLiant DL380", "DB380-002", "active", "Серверная A1", "Вера Павлова", "IT", "СерверГрад"],
    ["SRV-003", "Резервный сервер", "server", "Lenovo ThinkSystem SR650", "BK650-003", "inactive", "Серверная A2", "Илья Тарасов", "IT", "СерверГрад"],
    ["RTR-001", "Основной маршрутизатор", "router", "MikroTik CCR2004", "RTR2004-001", "active", "Серверная A1", "Илья Тарасов", "IT", "Сетевые Решения"],
    ["RTR-002", "Резервный маршрутизатор", "router", "Cisco ISR 4331", "RTR4331-002", "repair", "Серверная A2", "Илья Тарасов", "IT", "Сетевые Решения"],
    ["RTR-003", "Маршрутизатор склада", "router", "Keenetic Giant", "RTR-KN-003", "active", "Склад, стойка связи", "Роман Федоров", "LOG", "Сетевые Решения"],
    ["LTP-001", "Ноутбук DevOps", "laptop", "Lenovo ThinkPad T14", "TP14-001", "active", "Кабинет 204", "Алексей Соколов", "IT", "Ноутбук Центр"],
    ["LTP-002", "Ноутбук администратора", "laptop", "Dell Latitude 5440", "DL5440-002", "active", "Кабинет 205", "Вера Павлова", "IT", "Ноутбук Центр"],
    ["LTP-003", "Ноутбук сетевого инженера", "laptop", "HP ProBook 450", "HP450-003", "active", "Кабинет 205", "Илья Тарасов", "IT", "Ноутбук Центр"],
    ["LTP-004", "Ноутбук главного бухгалтера", "laptop", "Lenovo ThinkBook 15", "TB15-004", "active", "Кабинет 301", "Елена Морозова", "FIN", "Ноутбук Центр"],
    ["LTP-005", "Ноутбук финансового аналитика", "laptop", "Acer TravelMate P2", "TMP2-005", "active", "Кабинет 302", "Оксана Романова", "FIN", "Ноутбук Центр"],
    ["LTP-006", "Ноутбук бухгалтера", "laptop", "ASUS ExpertBook", "EXB-006", "repair", "Сервисная зона", "Лариса Попова", "FIN", "Ноутбук Центр"],
    ["LTP-007", "Ноутбук руководителя продаж", "laptop", "MacBook Air M2", "MBA-007", "active", "Кабинет 401", "Артем Васильев", "SALE", "ТехноПоставка"],
    ["LTP-008", "Ноутбук менеджера продаж", "laptop", "Dell Inspiron 15", "DI15-008", "active", "Кабинет 402", "Дмитрий Крылов", "SALE", "Ноутбук Центр"],
    ["LTP-009", "Ноутбук менеджера проектов", "laptop", "Lenovo IdeaPad 5", "IP5-009", "active", "Кабинет 403", "Светлана Комарова", "SALE", "Ноутбук Центр"],
    ["LTP-010", "Ноутбук маркетолога", "laptop", "HP EliteBook 840", "EB840-010", "active", "Кабинет 501", "Ирина Лукина", "MKT", "Ноутбук Центр"],
    ["LTP-011", "Ноутбук контент-менеджера", "laptop", "Acer Swift 3", "SW3-011", "inactive", "Кабинет 502", "Юлия Захарова", "MKT", "Ноутбук Центр"],
    ["LTP-012", "Ноутбук HR", "laptop", "Lenovo ThinkPad E14", "E14-012", "active", "Кабинет 601", "Наталья Козлова", "HR", "Ноутбук Центр"],
    ["LTP-013", "Ноутбук рекрутера", "laptop", "Dell Vostro 3520", "DV3520-013", "active", "Кабинет 602", "Татьяна Медведева", "HR", "Ноутбук Центр"],
    ["LTP-014", "Ноутбук юриста", "laptop", "HP ProBook 440", "PB440-014", "active", "Кабинет 701", "Павел Орлов", "LAW", "Ноутбук Центр"],
    ["LTP-015", "Ноутбук юрисконсульта", "laptop", "Lenovo V15", "V15-015", "active", "Кабинет 702", "Михаил Беляев", "LAW", "Ноутбук Центр"],
    ["LTP-016", "Ноутбук поддержки", "laptop", "Acer Aspire 5", "AS5-016", "active", "Зал поддержки", "Кирилл Сафонов", "SUP", "Ноутбук Центр"],
    ["LTP-017", "Ноутбук специалиста поддержки", "laptop", "HP 250 G9", "HP250-017", "active", "Зал поддержки", "Георгий Никитин", "SUP", "Ноутбук Центр"],
    ["PRN-001", "Принтер бухгалтерии", "printer", "HP LaserJet Pro M404", "PRN404-001", "active", "Кабинет 301", "Елена Морозова", "FIN", "ОфисПринт Сервис"],
    ["PRN-002", "Принтер отдела продаж", "printer", "Canon i-SENSYS LBP223", "PRN223-002", "active", "Кабинет 402", "Дмитрий Крылов", "SALE", "ОфисПринт Сервис"],
    ["PRN-003", "МФУ отдела кадров", "printer", "Brother DCP-L2550DN", "PRN2550-003", "repair", "Кабинет 601", "Наталья Козлова", "HR", "ОфисПринт Сервис"],
    ["PRN-004", "Принтер юридического отдела", "printer", "Xerox B230", "PRN230-004", "active", "Кабинет 701", "Павел Орлов", "LAW", "ОфисПринт Сервис"],
    ["OTH-001", "Сетевое хранилище архива", "other", "Synology DS923+", "NAS923-001", "active", "Серверная A2", "Вера Павлова", "IT", "ТехноПоставка"],
    ["OTH-002", "ИБП серверной", "other", "APC Smart-UPS 3000", "UPS3000-002", "active", "Серверная A1", "Алексей Соколов", "IT", "Безопасные Системы"],
    ["OTH-003", "Система видеонаблюдения склада", "other", "Hikvision NVR", "NVR-003", "active", "Склад", "Сергей Кузнецов", "LOG", "Безопасные Системы"]
  ];

  const assets = await Asset.insertMany(
    assetRows.map(([inventoryNumber, name, type, model, serialNumber, status, location, employeeName, departmentCode, vendorName], index) =>
      withAudit(
        {
          inventoryNumber,
          name,
          type,
          model,
          serialNumber,
          status,
          location,
          purchaseDate: new Date(2022 + (index % 4), index % 12, 5 + (index % 20)),
          warrantyUntil: new Date(2026 + (index % 3), index % 12, 5 + (index % 20)),
          assignedTo: emp[employeeName]?._id,
          department: dept[departmentCode]._id,
          vendor: vendor[vendorName]._id,
          notes: `Инвентарная карточка заполнена. Ответственный: ${employeeName}.`
        },
        admin._id
      )
    )
  );

  const asset = Object.fromEntries(assets.map((item) => [item.inventoryNumber, item]));

  await Incident.insertMany(
    [
      ["Потери пакетов на резервном маршрутизаторе", "RTR-002", "critical", "in_progress", "Наблюдаются потери пакетов до 18%, требуется диагностика канала и блока питания.", manager._id],
      ["Быстро разряжается ноутбук бухгалтера", "LTP-006", "medium", "open", "Аккумулятор держит заряд меньше одного часа.", support._id],
      ["Застревание бумаги в МФУ отдела кадров", "PRN-003", "high", "in_progress", "Печать документов сотрудников периодически останавливается.", support._id],
      ["Проверить место на сервере базы данных", "SRV-002", "high", "open", "Свободное место на разделе журналов ниже 15%.", admin._id],
      ["Нестабильная работа Wi-Fi на складе", "RTR-003", "medium", "open", "Сотрудники склада жалуются на обрывы связи в зоне приемки.", manager._id],
      ["Не открывается корпоративная CRM", "LTP-008", "medium", "resolved", "Проблема решена очисткой DNS-кэша и обновлением сертификатов.", support._id],
      ["Заменить тонер в принтере продаж", "PRN-002", "low", "closed", "Тонер заменен, тестовая печать успешна.", support._id],
      ["Проверка состояния ИБП", "OTH-002", "medium", "open", "ИБП сообщил о необходимости замены батарейного блока.", admin._id],
      ["Медленная работа ноутбука маркетолога", "LTP-010", "low", "open", "Высокая загрузка диска после запуска графических редакторов.", support._id],
      ["Ошибки резервного копирования архива", "OTH-001", "critical", "in_progress", "Ночная задача резервного копирования завершилась с ошибкой.", admin._id],
      ["Не печатает принтер юридического отдела", "PRN-004", "medium", "resolved", "Переустановлен драйвер и очищена очередь печати.", support._id],
      ["Обновить прошивку основного маршрутизатора", "RTR-001", "high", "open", "Доступна критическая прошивка с исправлениями безопасности.", manager._id],
      ["Проверить перегрев сервера приложений", "SRV-001", "critical", "in_progress", "Температура CPU выше обычной после дневной нагрузки.", admin._id],
      ["Нет доступа к сетевой папке HR", "LTP-012", "medium", "closed", "Права доступа восстановлены через группу домена.", support._id],
      ["Настроить новый профиль VPN", "LTP-015", "low", "resolved", "Профиль VPN создан и проверен.", support._id]
    ].map(([title, inventoryNumber, priority, status, description, assignedTo], index) =>
      withAudit(
        {
          title,
          description,
          asset: asset[inventoryNumber]._id,
          priority,
          status,
          assignedTo,
          closedAt: ["resolved", "closed"].includes(status) ? new Date(2026, 3, 10 + index) : null,
          comments: [
            { text: "Заявка принята в работу.", author: support._id },
            { text: status === "open" ? "Ожидает диагностики специалистом." : "Добавлены результаты первичной проверки.", author: assignedTo }
          ]
        },
        admin._id
      )
    )
  );

  await MaintenanceLog.insertMany(
    [
      ["SRV-001", "Профилактика сервера", "Очистка журналов, проверка RAID, обновление BIOS.", "Алексей Соколов", 8500, "completed"],
      ["SRV-002", "Проверка базы данных", "Оптимизация индексов и проверка резервных копий.", "Вера Павлова", 12000, "completed"],
      ["RTR-001", "Обновление прошивки", "Установлена стабильная версия прошивки маршрутизатора.", "Илья Тарасов", 3000, "completed"],
      ["RTR-002", "Диагностика маршрутизатора", "Проверка питания и состояния портов.", "Илья Тарасов", 4500, "planned"],
      ["LTP-006", "Замена аккумулятора", "Заказана новая батарея, ожидается поставка.", "Максим Громов", 7000, "planned"],
      ["PRN-003", "Ремонт узла подачи бумаги", "Проверены ролики подачи и датчик лотка.", "ОфисПринт Сервис", 5200, "planned"],
      ["OTH-001", "Проверка NAS", "Проверка SMART дисков и расписания репликации.", "Вера Павлова", 6500, "completed"],
      ["OTH-002", "Тестирование ИБП", "Проведен тест батарей и калибровка нагрузки.", "Безопасные Системы", 4000, "completed"],
      ["PRN-001", "Замена картриджа", "Установлен новый оригинальный картридж.", "ОфисПринт Сервис", 2100, "completed"],
      ["PRN-002", "Профилактика принтера", "Очистка тракта печати и проверка ресурса барабана.", "ОфисПринт Сервис", 2600, "completed"],
      ["LTP-010", "Очистка системы", "Удалены временные файлы, обновлены драйверы.", "Максим Громов", 1800, "completed"],
      ["LTP-014", "Настройка VPN", "Настроен защищенный доступ к внутренним системам.", "Максим Громов", 1500, "completed"],
      ["RTR-003", "Проверка покрытия склада", "Замер уровня сигнала и изменение канала Wi-Fi.", "Илья Тарасов", 3500, "completed"],
      ["LTP-001", "Плановое обновление ПО", "Обновлены системные компоненты и антивирус.", "Максим Громов", 1200, "completed"],
      ["SRV-003", "Подготовка к вводу в резерв", "Проверка железа и установка обновлений.", "Алексей Соколов", 9000, "planned"],
      ["PRN-004", "Переустановка драйвера", "Переустановлен драйвер печати на рабочих местах.", "ОфисПринт Сервис", 1700, "completed"],
      ["LTP-017", "Замена SSD", "Плановая замена накопителя на более емкий.", "Максим Громов", 6200, "planned"],
      ["OTH-003", "Проверка видеозаписи", "Проверена глубина архива и доступность камер.", "Безопасные Системы", 4800, "completed"]
    ].map(([inventoryNumber, type, description, performedBy, cost, status], index) =>
      withAudit(
        {
          asset: asset[inventoryNumber]._id,
          type,
          description,
          performedBy,
          cost,
          status,
          date: new Date(2026, index % 12, 3 + (index % 20)),
          nextMaintenanceDate: new Date(2026, (index + 3) % 12, 5 + (index % 20))
        },
        admin._id
      )
    )
  );

  console.log("Seed completed.");
  console.log("Пользователи: admin / manager / support");
  console.log("Пароль для всех: Admin123!");
  console.log(`Создано: ${departments.length} отделов, ${employees.length} сотрудников, ${vendors.length} поставщиков, ${assets.length} единиц оборудования.`);
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
