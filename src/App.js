import { useState, useEffect } from 'react';
import './App.css';

const WIKIPEDIA_BASE_URL =
  'https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access';

function buildUrl({ year, month, day }) {
  return `${WIKIPEDIA_BASE_URL}/${year}/${month}/${day}`;
}

const NUM_RESULT_OPTIONS = [25, 50, 75, 100, 200];

function App() {
  const [year, setYear] = useState(2015);
  const [month, setMonth] = useState(10);
  const [day, setDay] = useState(10);
  const [numResults, setNumResults] = useState(100);
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
    <div className='app'>
      <form className='form'>
        <div>
          <label for='date'>Date:</label>
          <input type='date' id='date' placeholder={new Date()} />
        </div>
        <div>
          <label for='numResults'>Number of results:</label>
          <select id='numResults'>
            {NUM_RESULT_OPTIONS.map((num) => (
              <option value={num} selected={num === numResults}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </form>
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
