const express = require("express");
const cors = require("cors");

const { createLinkStore } = require("./linkStore");

const DEFAULT_BASE_URL = "http://localhost:5000";
const SLUG_PATTERN = /^[a-zA-Z0-9_-]{3,32}$/;

function createApp(options = {}) {
  const app = express();
  const store = options.store || createLinkStore();
  const baseUrl = normalizeBaseUrl(options.baseUrl || process.env.BASE_URL || DEFAULT_BASE_URL);

  app.use(cors());
  app.use(express.json({ limit: "10kb" }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/links", (req, res) => {
    const { url, slug } = req.body || {};
    const validationError = validateCreateLink(url, slug);

    if (validationError) {
      return sendError(res, 400, validationError);
    }

    try {
      const link = store.createLink({
        originalUrl: url.trim(),
        slug: slug ? slug.trim() : undefined
      });

      return res.status(201).json(formatLink(link, baseUrl));
    } catch (error) {
      if (error.code === "SLUG_EXISTS") {
        return sendError(res, 409, "Slug is already in use.");
      }

      return sendError(res, 500, "Unable to create short link.");
    }
  });

  app.get("/api/links", (req, res) => {
    const limit = parseLimit(req.query.limit);
    const links = store.listRecent(limit).map((link) => formatLink(link, baseUrl));

    res.json({ links });
  });

  app.get("/api/links/:slug", (req, res) => {
    const link = store.getLink(req.params.slug);

    if (!link) {
      return sendError(res, 404, "Short link was not found.");
    }

    return res.json(formatLink(link, baseUrl));
  });

  app.get("/:slug", (req, res) => {
    const link = store.recordVisit(req.params.slug);

    if (!link) {
      return sendError(res, 404, "Short link was not found.");
    }

    return res.redirect(302, link.originalUrl);
  });

  app.use((req, res) => {
    sendError(res, 404, `Route ${req.method} ${req.path} was not found.`);
  });

  app.use((error, _req, res, _next) => {
    if (error instanceof SyntaxError && "body" in error) {
      return sendError(res, 400, "Request body must be valid JSON.");
    }

    return sendError(res, 500, "Unexpected server error.");
  });

  return app;
}

function validateCreateLink(url, slug) {
  if (typeof url !== "string" || url.trim().length === 0) {
    return "A non-empty url is required.";
  }

  try {
    const parsedUrl = new URL(url.trim());
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return "URL must use http or https.";
    }
  } catch (_error) {
    return "URL must be a valid absolute URL.";
  }

  if (slug !== undefined) {
    if (typeof slug !== "string" || slug.trim().length === 0) {
      return "Slug must be a non-empty string.";
    }

    if (!SLUG_PATTERN.test(slug.trim())) {
      return "Slug must be 3-32 characters and contain only letters, numbers, underscores, or hyphens.";
    }
  }

  return null;
}

function parseLimit(rawLimit) {
  const limit = Number.parseInt(rawLimit, 10);

  if (Number.isNaN(limit)) {
    return 20;
  }

  return Math.min(Math.max(limit, 1), 100);
}

function formatLink(link, baseUrl) {
  return {
    id: link.id,
    slug: link.slug,
    originalUrl: link.originalUrl,
    shortUrl: `${baseUrl}/${link.slug}`,
    visits: link.visits,
    createdAt: link.createdAt,
    updatedAt: link.updatedAt
  };
}

function normalizeBaseUrl(baseUrl) {
  return baseUrl.replace(/\/+$/, "");
}

function sendError(res, status, message) {
  return res.status(status).json({
    error: {
      status,
      message
    }
  });
}

module.exports = {
  createApp,
  validateCreateLink
};
