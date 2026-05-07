# Деплой в Yandex Cloud

Ниже самый понятный вариант для курсовой: одна VM в Yandex Cloud, на ней Docker Compose поднимает MongoDB, backend и frontend.

## 1. Что понадобится

- Аккаунт Yandex Cloud.
- Установленный `yc` CLI на локальном компьютере.
- GitHub-репозиторий с проектом или архив проекта.
- Открытые порты на VM: `22`, `80`, `5000`.

## 2. Создать VM

В Yandex Cloud Console:

1. Compute Cloud -> Virtual machines -> Create VM.
2. Образ: Ubuntu 22.04/24.04 LTS.
3. Ресурсы для учебного проекта: 2 vCPU, 2-4 GB RAM.
4. Disk: 20-30 GB.
5. Public IP: включить.
6. Security group: открыть входящие TCP-порты:
   - `22` для SSH
   - `80` для frontend
   - `5000` для backend API

## 3. Подключиться к VM

```bash
ssh yc-user@PUBLIC_VM_IP
```

Если пользователь другой, используй его имя из настроек VM.

## 4. Установить Docker и Compose plugin

```bash
sudo apt update
sudo apt install -y ca-certificates curl git
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

Перезайди по SSH, чтобы группа `docker` применилась.

## 5. Загрузить проект на VM

Через GitHub:

```bash
git clone https://github.com/YOUR_LOGIN/YOUR_REPO.git
cd YOUR_REPO/it-infra-system
```

Если репозиторий начинается сразу с `it-infra-system`, зайди в него:

```bash
cd YOUR_REPO
```

## 6. Настроить переменные окружения

```bash
cp deploy/yandex/.env.example deploy/yandex/.env
nano deploy/yandex/.env
```

Минимально замени:

```env
PUBLIC_HOST=PUBLIC_VM_IP
JWT_ACCESS_SECRET=очень_длинная_строка
JWT_REFRESH_SECRET=другая_очень_длинная_строка
```

Если есть домен, укажи домен вместо IP:

```env
PUBLIC_HOST=it-infra.example.ru
```

## 7. Запустить проект

```bash
docker compose --env-file deploy/yandex/.env -f deploy/yandex/docker-compose.vm.yml up --build -d
```

Проверить контейнеры:

```bash
docker compose --env-file deploy/yandex/.env -f deploy/yandex/docker-compose.vm.yml ps
```

Логи backend:

```bash
docker compose --env-file deploy/yandex/.env -f deploy/yandex/docker-compose.vm.yml logs -f server
```

## 8. Заполнить базу тестовыми данными

```bash
docker compose --env-file deploy/yandex/.env -f deploy/yandex/docker-compose.vm.yml exec server npm run seed
```

Пользователи после seed:

```text
admin / Admin123!
manager / Admin123!
support / Admin123!
```

## 9. Открыть приложение

Frontend:

```text
http://PUBLIC_VM_IP
```

Backend API:

```text
http://PUBLIC_VM_IP:5000/api
```

Swagger:

```text
http://PUBLIC_VM_IP:5000/api/docs
```

## 10. Обновление после изменений

```bash
git pull
docker compose --env-file deploy/yandex/.env -f deploy/yandex/docker-compose.vm.yml up --build -d
```

## 11. Остановка

```bash
docker compose --env-file deploy/yandex/.env -f deploy/yandex/docker-compose.vm.yml down
```

Чтобы удалить базу данных вместе с volume:

```bash
docker compose --env-file deploy/yandex/.env -f deploy/yandex/docker-compose.vm.yml down -v
```

## Вариант через Container Registry

Для более production-подхода можно собрать образы локально или в CI, загрузить их в Yandex Container Registry, а на VM запускать уже готовые images. Для курсовой обычно достаточно варианта с VM + Docker Compose выше.
