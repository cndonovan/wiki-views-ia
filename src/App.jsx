import { useState } from 'react';
import dayjs from 'dayjs';

import Header from './Header';
import Form from './Form';
import Articles from './Articles';
import ErrorState from './fetch-states/ErrorState';
import LoadingState from './fetch-states/LoadingState';

import useFetchArticles from './hooks/useFetchArticles';
import './App.css';

function getYesterday() {
  return dayjs().subtract(1, 'day');
}

export default function App() {
  const [date, setDate] = useState(getYesterday().format('YYYY-MM-DD'));
  const [numResults, setNumResults] = useState(100);
  const { isLoading, error, articles } = useFetchArticles(date);

  return (
    <div className='app'>
      <Header />
      <Form
        date={date}
        numResults={numResults}
        setDate={setDate}
        setNumResults={setNumResults}
      />
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState />
      ) : (
        <Articles articles={articles} numResults={numResults} />
      )}
    </div>
  );
}
