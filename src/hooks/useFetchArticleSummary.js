import { useState, useEffect } from 'react';

const WIKIPEDIA_PAGE_SUMMARY_BASE_URL =
  'https://en.wikipedia.org/api/rest_v1/page/summary';

function buildPageSummaryUrl(article) {
  return `${WIKIPEDIA_PAGE_SUMMARY_BASE_URL}/${article}`;
}

export default function useFetchArticleDetails(mostRecentlyClickedArticle) {
  const [articleToSummary, setArticleToSummary] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mostRecentlyClickedArticle) return;
    if (articleToSummary[mostRecentlyClickedArticle]) return;

    async function fetchArticleSummary() {
      try {
        const response = await fetch(
          buildPageSummaryUrl(mostRecentlyClickedArticle)
        );
        const json = await response.json();
        const article = json.titles.canonical;
        const summary = json.extract;

        setError(null);
        setArticleToSummary({
          ...articleToSummary,
          [article]: summary,
        });
      } catch (err) {
        console.error(err);
        setError(err);
      }
    }

    fetchArticleSummary();
  }, [mostRecentlyClickedArticle]);

  return { articleToSummary, error };
}
