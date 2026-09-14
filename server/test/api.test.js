const request = require("supertest");

const { createApp } = require("../src/app");
const { createLinkStore } = require("../src/linkStore");

let app;

beforeEach(() => {
  app = createApp({
    store: createLinkStore(),
    baseUrl: "http://short.test"
  });
});

describe("LinkForge API", () => {
  it("reports health", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("creates, fetches, lists, and redirects a short link", async () => {
    const createdResponse = await request(app)
      .post("/api/links")
      .send({
        url: "https://example.com/article",
        slug: "example-link"
      });
    const created = createdResponse.body;

    expect(createdResponse.status).toBe(201);
    expect(created.slug).toBe("example-link");
    expect(created.shortUrl).toBe("http://short.test/example-link");
    expect(created.visits).toBe(0);

    const fetchedResponse = await request(app).get("/api/links/example-link");
    const fetched = fetchedResponse.body;

    expect(fetchedResponse.status).toBe(200);
    expect(fetched.originalUrl).toBe("https://example.com/article");

    const listedResponse = await request(app).get("/api/links");
    const listed = listedResponse.body;

    expect(listedResponse.status).toBe(200);
    expect(listed.links).toHaveLength(1);

    const redirectResponse = await request(app).get("/example-link");

    expect(redirectResponse.status).toBe(302);
    expect(redirectResponse.headers.location).toBe("https://example.com/article");

    const visitedResponse = await request(app).get("/api/links/example-link");
    const visited = visitedResponse.body;

    expect(visited.visits).toBe(1);
  });

  it("rejects invalid URLs and duplicate slugs with useful errors", async () => {
    const invalidResponse = await request(app)
      .post("/api/links")
      .send({ url: "not-a-url" });
    const invalid = invalidResponse.body;

    expect(invalidResponse.status).toBe(400);
    expect(invalid.error.message).toBe("URL must be a valid absolute URL.");

    await request(app)
      .post("/api/links")
      .send({
        url: "https://example.com/first",
        slug: "taken"
      });

    const duplicateResponse = await request(app)
      .post("/api/links")
      .send({
        url: "https://example.com/second",
        slug: "taken"
      });
    const duplicate = duplicateResponse.body;

    expect(duplicateResponse.status).toBe(409);
    expect(duplicate.error.message).toBe("Slug is already in use.");
  });
});
