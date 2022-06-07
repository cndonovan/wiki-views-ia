import { useState } from 'react';
import dayjs from 'dayjs';

import { useFetchArticleSummary, useFetchArticleTopThreeDays } from 'hooks';
import 'styles/app.css';

const TITLES_TO_SKIP = ['Special:', 'Wikipedia:', 'Portal:', 'Main_Page'];

export default function Articles({ articles, numResults }) {
  const [expandedArticles, setExpandedArticles] = useState([]);
  const [mostRecentlyClickedArticle, setMostRecentlyClickedArticle] =
    useState('');

  const { articleToSummary } = useFetchArticleSummary(
    mostRecentlyClickedArticle
  );
  const { articleToTopThreeDays } = useFetchArticleTopThreeDays(
    mostRecentlyClickedArticle
  );

  function handleClickMore(article) {
    setMostRecentlyClickedArticle(article);
    setExpandedArticles(expandedArticles.concat(article));
  }

  function handleClickLess(article) {
    setExpandedArticles(expandedArticles.filter((a) => a !== article));
  }

  return (
    <ul className='pageWidth' aria-label='wikipedia-articles'>
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
                  <ul className='article-top-days'>
                    {articleToTopThreeDays[a.article].map((day) => (
                      <li className='article-top-day' key={day.timestamp}>
                        <div>{dayjs(day.timestamp).format('MMM D, YYYY')}</div>
                        <div>{day.views} views</div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <div className='article-content'>
                <button
                  className='article-button'
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
