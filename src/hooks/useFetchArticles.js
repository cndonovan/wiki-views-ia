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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (!date) return;

    async function fetchArticles() {
      setIsLoading(true);
      try {
        const response = await fetch(buildUrl(date));
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail);
        }

        setIsLoading(false);
        setError(null);
        setArticles(data.items[0].articles);
      } catch (err) {
        setIsLoading(false);
        setError(err);
        setArticles([]);
      }
    }

    fetchArticles();
  }, [date]);

  return { isLoading, error, articles };
}
