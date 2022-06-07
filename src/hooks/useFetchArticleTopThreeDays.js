import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const WIKIPEDIA_PAGE_VIEWS_BASE_URL =
  'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user';

function buildPageViewsUrl(article) {
  const startOfMonth = dayjs().startOf('month');
  const endOfMonth = dayjs().endOf('months');

  return `${WIKIPEDIA_PAGE_VIEWS_BASE_URL}/${article}/daily/${startOfMonth.format(
    'YYYYMMDD'
  )}/${endOfMonth.format('YYYYMMDD')}`;
}

export default function useFetchArticleDetails(mostRecentlyClickedArticle) {
  const [articleToTopThreeDays, setArticleToTopThreeDays] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mostRecentlyClickedArticle) return;
    if (articleToTopThreeDays[mostRecentlyClickedArticle]) return;

    async function fetchArticleTopThreeDays() {
      try {
        const response = await fetch(
          buildPageViewsUrl(mostRecentlyClickedArticle)
        );
        const json = await response.json();
        const article = json.items[0].article;
        const days = json.items;
        const topThreeDays = days
          .sort((a, b) => b.views - a.views)
          .slice(0, 3)
          .map(({ timestamp, views }) => ({
            timestamp,
            views,
          }));

        setError(null);
        setArticleToTopThreeDays({
          ...articleToTopThreeDays,
          [article]: topThreeDays,
        });
      } catch (err) {
        console.error(err);
        setError(err);
      }
    }

    fetchArticleTopThreeDays();
  }, [mostRecentlyClickedArticle]);

  return { articleToTopThreeDays, error };
}
