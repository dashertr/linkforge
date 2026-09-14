const crypto = require("crypto");

function createLinkStore() {
  const linksBySlug = new Map();
  const linksById = new Map();

  function createLink({ originalUrl, slug }) {
    const resolvedSlug = slug || generateUniqueSlug(linksBySlug);

    if (linksBySlug.has(resolvedSlug)) {
      const error = new Error("Slug already exists.");
      error.code = "SLUG_EXISTS";
      throw error;
    }

    const now = new Date().toISOString();
    const link = {
      id: crypto.randomUUID(),
      slug: resolvedSlug,
      originalUrl,
      visits: 0,
      createdAt: now,
      updatedAt: now
    };

    linksBySlug.set(link.slug, link);
    linksById.set(link.id, link);

    return link;
  }

  function listRecent(limit = 20) {
    return Array.from(linksBySlug.values())
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .slice(0, limit);
  }

  function getLink(slug) {
    return linksBySlug.get(slug);
  }

  function recordVisit(slug) {
    const link = linksBySlug.get(slug);

    if (!link) {
      return null;
    }

    link.visits += 1;
    link.updatedAt = new Date().toISOString();

    return link;
  }

  return {
    createLink,
    listRecent,
    getLink,
    recordVisit
  };
}

function generateUniqueSlug(linksBySlug) {
  let slug = createSlug();

  while (linksBySlug.has(slug)) {
    slug = createSlug();
  }

  return slug;
}

function createSlug() {
  return crypto.randomBytes(4).toString("base64url").slice(0, 6);
}

module.exports = {
  createLinkStore
};
