import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import './App.css';

const TITLES_TO_SKIP = ['Special:', 'Wikipedia:', 'Portal:', 'Main_Page'];

const WIKIPEDIA_PAGE_SUMMARY_BASE_URL =
  'https://en.wikipedia.org/api/rest_v1/page/summary';

function buildPageSummaryUrl({ article }) {
  return `${WIKIPEDIA_PAGE_SUMMARY_BASE_URL}/${article}`;
}

const WIKIPEDIA_DAILY_VIEWS_BASE_URL =
  'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user';

function buildDailyViewsUrl({ article }) {
  const startOfMonth = dayjs().startOf('month');
  const endOfMonth = dayjs().endOf('months');

  return `${WIKIPEDIA_DAILY_VIEWS_BASE_URL}/${article}/daily/${startOfMonth.format(
    'YYYYMMDD'
  )}00/${endOfMonth.format('YYYYMMDD')}00`;
}

export default function Articles({ articles, numResults }) {
  const [expandedArticles, setExpandedArticles] = useState([]);
  const [articleToSummary, setArticleToSummary] = useState({});
  const [articleToTopThreeDays, setArticleToTopThreeDays] = useState({});

  console.log({ expandedArticles, articleToSummary, articleToTopThreeDays });

  useEffect(() => {
    const newArticles = expandedArticles.filter(
      (a) => !Object.keys(articleToSummary).includes(a)
    );

    if (newArticles.length === 0) return;

    Promise.all([
      ...newArticles.map((article) => fetch(buildPageSummaryUrl({ article }))),
      ...newArticles.map((article) => fetch(buildDailyViewsUrl({ article }))),
    ])
      .then((responses) => {
        return Promise.all(responses.map((r) => r.json()));
      })
      .then((jsons) => {
        jsons.forEach((json) => {
          if (json.extract) {
            const article = json.titles.canonical;
            const summary = json.extract;

            setArticleToSummary({
              ...articleToSummary,
              [article]: summary,
            });
          } else {
            const article = json.items[0].article;
            const dailyViews = json.items;
            const topThreeDays = dailyViews
              .sort((a, b) => b.views - a.views)
              .slice(0, 3)
              .map(({ timestamp, views }) => ({
                timestamp,
                views,
              }));

            setArticleToTopThreeDays({
              ...articleToTopThreeDays,
              [article]: topThreeDays,
            });
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [expandedArticles]);

  function handleClickMore(article) {
    setExpandedArticles(expandedArticles.concat(article));
  }

  function handleClickLess(article) {
    setExpandedArticles(expandedArticles.filter((a) => a !== article));
  }

  return (
    <ul>
      {articles
        .filter((a) =>
          TITLES_TO_SKIP.every((title) => !a.article.includes(title))
        )
        .slice(0, numResults)
        .map((a) => {
          const isExpanded = expandedArticles.includes(a.article);
          return (
            <li key={a.article} className='article'>
              <div className='article-header'>
                <h2 className='article-title'>{a.article}</h2>
                <p>Views: {a.views}</p>
              </div>
              {isExpanded && articleToSummary[a.article] && (
                <p>{articleToSummary[a.article]}</p>
              )}
              {isExpanded && articleToTopThreeDays[a.article] && (
                <>
                  <h3>Top Three Days</h3>
                  <ul className='article-top-three-days'>
                    {articleToTopThreeDays[a.article].map((day) => (
                      <li className='article-top-day'>
                        <div>{dayjs(day.timestamp).format('MMM D, YYYY')}</div>
                        <div>{day.views} views</div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <div className='article-content'>
                <button
                  className='article-more-button'
                  onClick={() =>
                    isExpanded
                      ? handleClickLess(a.article)
                      : handleClickMore(a.article)
                  }
                >
                  {isExpanded ? 'Less' : 'More'}
                </button>
              </div>
            </li>
          );
        })}
    </ul>
  );
}
