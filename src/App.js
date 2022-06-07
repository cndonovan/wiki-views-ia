import { useState } from 'react';
import dayjs from 'dayjs';

import Form from './Form';
import Articles from './Articles';
import useFetchArticles from './hooks/useFetchArticles';
import './App.css';

function getYesterday() {
  return dayjs().subtract(1, 'day');
}

export default function App() {
  const [date, setDate] = useState(getYesterday().format('YYYY-MM-DD'));
  const [numResults, setNumResults] = useState(100);
  const { articles } = useFetchArticles(date);

  console.log({ date, numResults, articles });

  return (
    <div className='app'>
      <Form
        date={date}
        numResults={numResults}
        setDate={setDate}
        setNumResults={setNumResults}
      />
      <Articles articles={articles} numResults={numResults} />
    </div>
  );
}
