import { useState } from 'react';
import dayjs from 'dayjs';

import { Articles, Form, Header } from 'components';
import { ErrorState, LoadingState } from 'components/fetch-states';
import { useFetchArticles } from 'hooks';
import 'styles/app.css';

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
