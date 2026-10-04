const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");

process.env.CORS_ORIGINS = "https://trusted.example";
const app = require("../src/app");

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});

test("health endpoint responds with hardened headers without database access", async () => {
  const response = await fetch(`${baseUrl}/api/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
});

test("CORS only grants configured browser origins", async () => {
  const allowed = await fetch(`${baseUrl}/api/health`, {
    headers: { Origin: "https://trusted.example" },
  });
  const rejected = await fetch(`${baseUrl}/api/health`, {
    headers: { Origin: "https://untrusted.example" },
  });

  assert.equal(allowed.headers.get("access-control-allow-origin"), "https://trusted.example");
  assert.equal(rejected.headers.get("access-control-allow-origin"), null);
});

test("unknown endpoints return a JSON 404", async () => {
  const response = await fetch(`${baseUrl}/unknown`);

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), {
    success: false,
    msg: "Endpoint not found.",
  });
});

test("engine lookup requires a Bearer token", async () => {
  const response = await fetch(`${baseUrl}/api/v2/engine/PJ1234U123`);

  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), {
    success: false,
    msg: "Authentication required.",
  });
});

test("authentication routes reject empty input and rate-limit repeated attempts", async () => {
  let response;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    response = await fetch(`${baseUrl}/api/v1/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.equal(response.status, 400);
  }

  response = await fetch(`${baseUrl}/api/v1/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  assert.equal(response.status, 429);
});
