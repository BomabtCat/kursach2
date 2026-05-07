const swaggerJsdoc = require("swagger-jsdoc");

module.exports = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IT Infrastructure System API",
      version: "1.0.0"
    },
    servers: [{ url: "http://localhost:5000" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
      }
    },
    security: [{ bearerAuth: [] }],
    paths: {
      "/api/auth/login": {
        post: { summary: "Login", responses: { 200: { description: "OK" } } }
      },
      "/api/assets": {
        get: { summary: "Get assets", responses: { 200: { description: "OK" } } },
        post: { summary: "Create asset", responses: { 201: { description: "Created" } } }
      },
      "/api/incidents": {
        get: { summary: "Get incidents", responses: { 200: { description: "OK" } } }
      }
    }
  },
  apis: []
});
