import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const WIKIPEDIA_BASE_URL =
  'https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access';

function buildUrl(date) {
  const year = dayjs(date).format('YYYY');
  const month = dayjs(date).format('MM');
  const day = dayjs(date).format('DD');

  return `${WIKIPEDIA_BASE_URL}/${year}/${month}/${day}`;
}

export default function useFetchArticles(date) {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!date) return;

    async function fetchArticles() {
      try {
        const response = await fetch(buildUrl(date));
        const data = await response.json();
        setArticles(data.items[0].articles);
        setError(null);
      } catch (err) {
        console.error(err);
        setArticles([]);
        setError(err);
      }
    }

    fetchArticles();
  }, [date]);

  return { articles, error };
}
