import 'styles/app.css';

export default function ErrorState() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        height: '100vh',
      }}
    >
      <div>
        <h2>Something went wrong!</h2>
        <p>Please try again.</p>{' '}
      </div>
    </div>
  );
}
