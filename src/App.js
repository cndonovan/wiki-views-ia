import { useState, useEffect } from 'react';
import './App.css';

const WIKIPEDIA_BASE_URL =
  'https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access';

function buildUrl({ date }) {
  const year = date.getFullYear();
  const month = date.getMonth().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${WIKIPEDIA_BASE_URL}/${year}/${month}/${day}`;
}

const NUM_RESULT_OPTIONS = [25, 50, 75, 100, 200];

function getYesterday() {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  return yesterday;
}

function App() {
  const [date, setDate] = useState(getYesterday());
  const [numResults, setNumResults] = useState(100);
  const [articles, setArticles] = useState([]);

  console.log({ date, numResults, articles });

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch(buildUrl({ date }));
        const data = await response.json();
        setArticles(data.items[0].articles);
      } catch (err) {
        console.log(err);
      }
    }

    fetchArticles();
  }, [date]);

  return (
    <div className='app'>
      <form className='form'>
        <div>
          <label htmlFor='date'>Date:</label>
          <input
            type='date'
            id='date'
            value={date.toISOString()}
            onChange={(e) => {
              setDate(new Date(e.target.value));
            }}
          />
        </div>
        <div>
          <label htmlFor='numResults'>Number of results:</label>
          <select
            id='numResults'
            value={numResults}
            onChange={(e) => {
              setNumResults(parseInt(e.target.value, 10));
            }}
          >
            {NUM_RESULT_OPTIONS.map((num) => (
              <option key={num} value={num} defaultValue={num === numResults}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </form>
      <ul>
        {articles.slice(0, numResults).map((a) => (
          <li key={a.article} className='article-list-item'>
            <h2>{a.article}</h2>
            <p>Views: {a.views}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
