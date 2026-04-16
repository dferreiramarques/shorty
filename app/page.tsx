'use client';

import { useState, useEffect } from 'react';

interface UrlEntry {
  slug: string;
  original_url: string;
  created_at: number;
}

export default function Home() {
  const [urls, setUrls] = useState<UrlEntry[]>([]);
  const [slug, setSlug] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const res = await fetch('/api/urls');
      const data = await res.json();
      setUrls(data.urls || []);
    } catch (e) {
      console.error('Erro ao carregar URLs');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, url }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: `URL criada: monco.io/${data.slug}` });
        setSlug('');
        setUrl('');
        fetchUrls();
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Erro ao criar URL' });
    }

    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: 'success', text: 'Copiado!' });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="container">
      <header>
        <h1>🔗 monco.io</h1>
        <p>URL Shortener</p>
      </header>

      <main>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Slug (nome curto)</label>
            <div className="slug-input">
              <span className="prefix">monco.io/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="instagram"
                pattern="[a-z0-9-]*"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>URL de destino</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://instagram.com/..."
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'A criar...' : 'Criar Link'}
          </button>

          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
        </form>

        {urls.length > 0 && (
          <div className="url-list">
            <h2>Links Criados</h2>
            <table>
              <thead>
                <tr>
                  <th>Slug</th>
                  <th>URL Original</th>
                  <th>Criado</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((u) => (
                  <tr key={u.slug}>
                    <td><code>{u.slug}</code></td>
                    <td className="original-url">{u.original_url}</td>
                    <td>{formatDate(u.created_at)}</td>
                    <td>
                      <button onClick={() => copyToClipboard(`monco.io/${u.slug}`)}>
                        Copy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f5f5f5;
          min-height: 100vh;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
        }
        header {
          text-align: center;
          margin-bottom: 2rem;
        }
        header h1 {
          font-size: 2.5rem;
          color: #333;
        }
        header p {
          color: #666;
        }
        .form {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }
        .slug-input {
          display: flex;
          align-items: center;
        }
        .slug-input .prefix {
          background: #eee;
          padding: 0.75rem;
          border-radius: 4px 0 0 4px;
          color: #666;
          border: 1px solid #ddd;
          border-right: none;
        }
        .slug-input input {
          flex: 1;
          border-radius: 0 4px 4px 0;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        button {
          width: 100%;
          padding: 0.75rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 1rem;
        }
        button:hover {
          background: #1d4ed8;
        }
        button:disabled {
          background: #93c5fd;
        }
        .message {
          margin-top: 1rem;
          padding: 0.75rem;
          border-radius: 4px;
          text-align: center;
        }
        .message.success {
          background: #dcfce7;
          color: #166534;
        }
        .message.error {
          background: #fee2e2;
          color: #991b1b;
        }
        .url-list {
          margin-top: 2rem;
        }
        .url-list h2 {
          margin-bottom: 1rem;
          color: #333;
        }
        table {
          width: 100%;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        th, td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        th {
          background: #f9fafb;
          font-weight: 600;
        }
        code {
          background: #eee;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        .original-url {
          max-width: 250px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .url-list button {
          width: auto;
          padding: 0.25rem 0.75rem;
          font-size: 0.85rem;
          margin: 0;
        }
      `}</style>
    </div>
  );
}