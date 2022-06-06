import { useState, useEffect } from 'react';
import './App.css';

const WIKIPEDIA_BASE_URL =
  'https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access';

function buildUrl({ year, month, day }) {
  return `${WIKIPEDIA_BASE_URL}/${year}/${month}/${day}`;
}

function App() {
  const [year, setYear] = useState(2015);
  const [month, setMonth] = useState(10);
  const [day, setDay] = useState(10);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch(buildUrl({ year, month, day }));
        const data = await response.json();
        setArticles(data.items[0].articles);
      } catch (err) {
        console.log(err);
      }
    }

    fetchArticles();
  }, []);

  console.log({ articles });

  return (
    <div class='app'>
      <ul>
        {articles.map((a) => (
          <li className='article-list-item'>
            <h2>{a.article}</h2>
            <p>Views: {a.views}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
