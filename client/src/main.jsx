import React from "react";
import ReactDOM from "react-dom/client";
import { Check, Clipboard, ExternalLink, Link2, Loader2, Sparkles } from "lucide-react";
import { API_BASE_URL, createShortLink, getRecentLinks } from "./api";
import "./styles.css";

function normalizeLink(link) {
  const shortUrl = link.shortUrl || link.short_url || link.shortLink || link.short_link;
  const originalUrl = link.originalUrl || link.original_url || link.url || link.destination;

  return {
    id: link.id || link._id || shortUrl || originalUrl,
    shortUrl,
    originalUrl,
    code: link.code || link.slug || link.shortCode,
    clicks: link.visits ?? link.clicks ?? link.visitCount ?? 0,
    createdAt: link.createdAt || link.created_at
  };
}

export function App() {
  const [url, setUrl] = React.useState("");
  const [links, setLinks] = React.useState([]);
  const [isCreating, setIsCreating] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [copiedId, setCopiedId] = React.useState("");

  React.useEffect(() => {
    let active = true;

    getRecentLinks()
      .then((data) => {
        if (!active) return;
        const items = Array.isArray(data) ? data : data?.links || [];
        setLinks(items.map(normalizeLink));
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Enter a URL to shorten.");
      return;
    }

    setIsCreating(true);

    try {
      const created = normalizeLink(await createShortLink(url.trim()));
      setLinks((current) => [created, ...current.filter((item) => item.id !== created.id)].slice(0, 8));
      setUrl("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  }

  async function copyLink(link) {
    const value = link.shortUrl || `${API_BASE_URL}/${link.code}`;
    await navigator.clipboard.writeText(value);
    setCopiedId(link.id);
    window.setTimeout(() => setCopiedId(""), 1800);
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={16} /> LinkForge</span>
          <h1>Short links, forged fast.</h1>
          <p>Paste a long URL, generate a clean short link, and keep your newest links ready to copy.</p>
        </div>

        <form className="shortener-card" onSubmit={handleSubmit}>
          <label htmlFor="url">Destination URL</label>
          <div className="input-row">
            <Link2 size={20} />
            <input
              id="url"
              type="url"
              placeholder="https://example.com/very/long/link"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              disabled={isCreating}
            />
          </div>
          <button type="submit" disabled={isCreating}>
            {isCreating ? <Loader2 className="spin" size={18} /> : <Link2 size={18} />}
            {isCreating ? "Creating..." : "Create short link"}
          </button>
          {error && <p className="error" role="alert">{error}</p>}
        </form>
      </section>

      <section className="links-panel" aria-labelledby="recent-links-heading">
        <div className="panel-heading">
          <div>
            <h2 id="recent-links-heading">Recent links</h2>
            <p>Loaded from {API_BASE_URL}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="empty-state"><Loader2 className="spin" /> Loading recent links...</div>
        ) : links.length === 0 ? (
          <div className="empty-state">No links yet. Create your first short link above.</div>
        ) : (
          <ul className="link-list">
            {links.map((link) => (
              <li key={link.id} className="link-item">
                <div className="link-details">
                  <a href={link.shortUrl} target="_blank" rel="noreferrer" className="short-link">
                    {link.shortUrl || link.code}
                    <ExternalLink size={16} />
                  </a>
                  <p>{link.originalUrl}</p>
                </div>
                <div className="link-actions">
                  <span>{link.clicks} clicks</span>
                  <button type="button" onClick={() => copyLink(link)} aria-label={`Copy ${link.shortUrl || link.code}`}>
                    {copiedId === link.id ? <Check size={18} /> : <Clipboard size={18} />}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
