import dayjs from 'dayjs';

import './App.css';

const NUM_RESULT_OPTIONS = [25, 50, 75, 100, 200];

export default function Form({ date, numResults, setDate, setNumResults }) {
  return (
    <form className='form'>
      <label htmlFor='date'>
        Date:{' '}
        <input
          type='date'
          id='date'
          // `date` will be a string in the format 'YYYY-MM-DD'
          value={date}
          max={dayjs().format('YYYY-MM-DD')}
          onChange={(e) => {
            setDate(e.target.value);
          }}
        />
      </label>
      <label htmlFor='numResults'>
        Number of results:{' '}
        <select
          id='numResults'
          value={numResults}
          onChange={(e) => {
            setNumResults(parseInt(e.target.value, 10));
          }}
        >
          {NUM_RESULT_OPTIONS.map((num) => (
            <option key={num} value={num} defaultValue={num === numResults}>
              {num}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}
