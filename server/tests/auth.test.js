const request = require("supertest");
const app = require("../src/app");

test("register and login user", async () => {
  const register = await request(app)
    .post("/api/auth/register")
    .send({ username: "admin", password: "Admin123!", role: "admin" });

  expect(register.status).toBe(201);
  expect(register.body.data.accessToken).toBeTruthy();

  const login = await request(app).post("/api/auth/login").send({ username: "admin", password: "Admin123!" });
  expect(login.status).toBe(200);
  expect(login.body.data.user.role).toBe("admin");
});
