const request = require("supertest");
const app = require("../src/app");

const auth = async () => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ username: "admin", password: "Admin123!", role: "admin" });
  return res.body.data.accessToken;
};

test("create incident for asset", async () => {
  const token = await auth();
  const asset = await request(app)
    .post("/api/assets")
    .set("Authorization", `Bearer ${token}`)
    .send({ inventoryNumber: "A-2", name: "Router", type: "router", status: "repair" });

  const incident = await request(app)
    .post("/api/incidents")
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "Network outage", asset: asset.body.data._id, priority: "critical" });

  expect(incident.status).toBe(201);
  expect(incident.body.data.status).toBe("open");
});
