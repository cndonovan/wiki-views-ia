import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import dayjs from 'dayjs';
import App from 'components/App';

test('can see an initial list of wikipedia articles', async () => {
  render(<App />);

  const dateInput = screen.queryByLabelText('Date:');
  const numResultsInput = screen.queryByLabelText('Number of results:');

  expect(dateInput.value).toBe(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  expect(numResultsInput.value).toBe('100');

  await waitFor(() => {
    const articleList = screen.getByRole('list', {
      name: 'wikipedia-articles',
    });
    const articles = within(articleList).getAllByRole('listitem');
    expect(articles.length).toBe(100);
  });
});

test('can change the date or number of results', async () => {
  render(<App />);

  const dateInput = screen.queryByLabelText('Date:');
  const numResultsInput = screen.queryByLabelText('Number of results:');

  await waitFor(() => {
    const articleList = screen.getByRole('list', {
      name: 'wikipedia-articles',
    });
    const articles = within(articleList).getAllByRole('listitem');
    expect(articles.length).toBe(100);
  });

  fireEvent.change(dateInput, {
    target: { value: dayjs().subtract(2, 'day').format('YYYY-MM-DD') },
  });
  fireEvent.change(numResultsInput, {
    target: { value: 25 },
  });

  await waitFor(() => {
    const articleList = screen.getByRole('list', {
      name: 'wikipedia-articles',
    });
    const articles = within(articleList).getAllByRole('listitem');
    expect(articles.length).toBe(25);
  });
});

test('can expand and collapse an article', async () => {
  render(<App />);

  let firstArticle, firstButton;

  await waitFor(() => {
    const articleList = screen.getByRole('list', {
      name: 'wikipedia-articles',
    });
    expect(articleList).toBeVisible();

    firstArticle = within(articleList).getAllByRole('listitem')[0];
    firstButton = within(articleList).getAllByRole('button')[0];
  });

  expect(firstButton).toBeVisible();
  expect(firstButton).toHaveTextContent('More');
  expect(firstArticle).not.toHaveTextContent('Top Three Days');

  fireEvent.click(firstButton);

  await waitFor(() => {
    expect(firstButton).toBeVisible();
    expect(firstButton).toHaveTextContent('Less');
    expect(firstArticle).toHaveTextContent('Top Three Days');
  });

  fireEvent.click(firstButton);

  expect(firstButton).toBeVisible();
  expect(firstButton).toHaveTextContent('More');
  expect(firstArticle).not.toHaveTextContent('Top Three Days');
});
