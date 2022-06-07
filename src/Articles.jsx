import './App.css';

export default function Articles({ articles, numResults }) {
  return (
    <ul>
      {articles.slice(0, numResults).map((a) => (
        <li key={a.article} className='article-list-item'>
          <h2 className='article-title'>{a.article}</h2>
          <p>Views: {a.views}</p>
        </li>
      ))}
    </ul>
  );
}
