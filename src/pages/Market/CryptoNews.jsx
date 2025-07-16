// Example for CryptoNews.jsx
import React, { useEffect, useState } from 'react';

function timeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 60000);
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
}

const CryptoNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/cryptonews')
      .then(res => res.json())
      .then(data => {
        setNews(data.status_updates || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="news-list">
      {loading && <div>Loading news...</div>}
      {!loading && news.length === 0 && <div>No news found.</div>}
      {!loading && news.map((item, idx) => (
        <div className="news-item-adv" key={idx}>
          {item.project?.image?.small ? (
            <img
              src={item.project.image.small}
              alt={item.project.name}
              className="news-thumb-adv"
            />
          ) : (
            <div className="news-thumb-adv" style={{ background: '#eee' }} />
          )}
          <div>
            <div className="news-title-adv">{item.description}</div>
            <div className="news-meta-adv">
              <span>{item.project?.name}</span>
              <span>• {timeAgo(item.created_at)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CryptoNews;