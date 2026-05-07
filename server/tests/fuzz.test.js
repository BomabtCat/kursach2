const request = require("supertest");
const app = require("../src/app");

const FUZZ_RUNS = 40;

let seed = 1337;
const random = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

const randomString = () => {
  const chars = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789[]{}()*+?^$|\\/<>'\"`~!@#%&=;:,.\n\t ";
  const length = Math.floor(random() * 64);
  return Array.from({ length }, () => chars[Math.floor(random() * chars.length)]).join("");
};

const randomValue = (depth = 0) => {
  const values = [
    null,
    undefined,
    true,
    false,
    Math.floor(random() * 1000000) - 500000,
    randomString(),
    depth < 2 ? [randomString(), randomValue(depth + 1)] : [],
    depth < 2 ? { value: randomString(), nested: randomValue(depth + 1) } : {}
  ];
  return values[Math.floor(random() * values.length)];
};

const randomObject = (fields) =>
  fields.reduce((payload, field) => {
    if (random() > 0.25) payload[field] = randomValue();
    return payload;
  }, {});

const expectNoServerCrash = (res) => {
  expect(res.status).not.toBeGreaterThanOrEqual(500);
  expect(res.body).toHaveProperty("success", false);
  expect(res.body).toHaveProperty("error");
};

const auth = async () => {
  const username = `admin_${Math.floor(random() * 100000)}`;
  const res = await request(app)
    .post("/api/auth/register")
    .send({ username, password: "Admin123!", role: "admin" });
  return res.body.data.accessToken;
};

test("fuzz auth register rejects malformed payloads without 500", async () => {
  for (let i = 0; i < FUZZ_RUNS; i += 1) {
    const payload = randomObject(["username", "password", "role"]);
    const res = await request(app).post("/api/auth/register").send(payload);

    if (res.status >= 500) {
      throw new Error(`Register fuzz caused ${res.status}: ${JSON.stringify(payload)}`);
    }
    expect([400, 422]).toContain(res.status);
  }
});

test("fuzz assets create rejects malformed payloads without 500", async () => {
  const token = await auth();

  for (let i = 0; i < FUZZ_RUNS; i += 1) {
    const payload = randomObject(["inventoryNumber", "name", "type", "status", "model", "serialNumber", "location"]);
    payload.type = randomString();
    payload.status = randomString();

    const res = await request(app).post("/api/assets").set("Authorization", `Bearer ${token}`).send(payload);
    expectNoServerCrash(res);
  }
});

test("fuzz incidents create rejects malformed payloads without 500", async () => {
  const token = await auth();

  for (let i = 0; i < FUZZ_RUNS; i += 1) {
    const payload = randomObject(["title", "asset", "priority", "status", "description"]);
    payload.asset = randomString();

    const res = await request(app).post("/api/incidents").set("Authorization", `Bearer ${token}`).send(payload);
    expectNoServerCrash(res);
  }
});

test("fuzz list query handles special search strings without 500", async () => {
  const token = await auth();
  const resources = ["assets", "employees", "departments", "incidents", "maintenance", "vendors"];

  for (let i = 0; i < FUZZ_RUNS; i += 1) {
    const resource = resources[Math.floor(random() * resources.length)];
    const res = await request(app)
      .get(`/api/${resource}`)
      .set("Authorization", `Bearer ${token}`)
      .query({
        search: randomString(),
        page: randomString(),
        limit: randomString(),
        sortBy: randomString(),
        sortOrder: randomString()
      });

    if (res.status >= 500) {
      throw new Error(`Query fuzz caused ${res.status} on ${resource}`);
    }
    expect([200, 400, 422]).toContain(res.status);
  }
});
