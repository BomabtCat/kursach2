const request = require("supertest");
const app = require("../src/app");

const auth = async () => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ username: "admin", password: "Admin123!", role: "admin" });
  return res.body.data.accessToken;
};

test("create and list assets", async () => {
  const token = await auth();
  const created = await request(app)
    .post("/api/assets")
    .set("Authorization", `Bearer ${token}`)
    .send({ inventoryNumber: "A-1", name: "Server", type: "server", status: "active" });

  expect(created.status).toBe(201);

  const list = await request(app).get("/api/assets").set("Authorization", `Bearer ${token}`);
  expect(list.body.data.total).toBe(1);
});

test("returns conflict for duplicate inventory number", async () => {
  const token = await auth();
  const payload = { inventoryNumber: "A-1", name: "Server", type: "server", status: "active" };

  await request(app).post("/api/assets").set("Authorization", `Bearer ${token}`).send(payload);
  const duplicate = await request(app).post("/api/assets").set("Authorization", `Bearer ${token}`).send(payload);

  expect(duplicate.status).toBe(409);
  expect(duplicate.body.error.message).toBe("Инвентарный номер уже используется");
});
