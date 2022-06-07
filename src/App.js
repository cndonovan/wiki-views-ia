import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

import './App.css';

const NUM_RESULT_OPTIONS = [25, 50, 75, 100, 200];

const WIKIPEDIA_BASE_URL =
  'https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access';

function buildUrl({ date }) {
  const year = dayjs(date).format('YYYY');
  const month = dayjs(date).format('MM');
  const day = dayjs(date).format('DD');

  return `${WIKIPEDIA_BASE_URL}/${year}/${month}/${day}`;
}

function getTodayAsDatePickerString() {
  return dayjs().format('YYYY-MM-DD');
}

function getYesterdayAsDatePickerString() {
  return dayjs().subtract(1, 'day').format('YYYY-MM-DD');
}

function App() {
  // `date` is a string in the format 'YYYY-MM-DD'
  const [date, setDate] = useState(getYesterdayAsDatePickerString());
  const [numResults, setNumResults] = useState(100);
  const [articles, setArticles] = useState([]);

  console.log({ date, numResults, articles });

  useEffect(() => {
    if (!date) return;

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
        <label htmlFor='date'>
          Date:
          <input
            type='date'
            id='date'
            value={date}
            max={getTodayAsDatePickerString()}
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
        </label>
        <label htmlFor='numResults'>
          Number of results:
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
        </label>
      </form>
      <ul>
        {articles.slice(0, numResults).map((a) => (
          <li key={a.article} className='article-list-item'>
            <h2 className='article-title'>{a.article}</h2>
            <p>Views: {a.views}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
