import { useState, useEffect } from 'react';

const WIKIPEDIA_PAGE_SUMMARY_BASE_URL =
  'https://en.wikipedia.org/api/rest_v1/page/summary';

function buildPageSummaryUrl({ article }) {
  return `${WIKIPEDIA_PAGE_SUMMARY_BASE_URL}/${article}`;
}

export default function useFetchArticleDetail({ article, month }) {
  const [summary, setSummary] = useState('');
  const [pageViews, setPageViews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!article) return;

    async function fetchPageSummary() {
      try {
        const response = await fetch(buildPageSummaryUrl({ article }));
        const data = await response.json();
        console.log({ data });
        setSummary(data.items[0].articles);
        setError(null);
      } catch (err) {
        console.error(err);
        setSummary('');
        setError(err);
      }
    }

    fetchPageSummary();
  }, [article]);

  return { summary, error };
}
