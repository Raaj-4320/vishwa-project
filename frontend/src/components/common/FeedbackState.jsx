const StateBox = ({ tone, text }) => (
  <div className={`state-box ${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
    <p>{text}</p>
  </div>
);

export const LoadingState = ({ text = 'Loading your workspace…' }) => <StateBox tone="loading" text={text} />;
export const EmptyState = ({ text = 'No records found.' }) => <StateBox tone="empty" text={text} />;
export const ErrorState = ({ text = 'Something went wrong.' }) => <StateBox tone="error" text={text} />;
