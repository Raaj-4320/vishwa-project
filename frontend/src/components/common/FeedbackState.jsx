export const LoadingState = ({ text = 'Loading...' }) => <div className="state-box loading">{text}</div>;
export const EmptyState = ({ text = 'No records found.' }) => <div className="state-box empty">{text}</div>;
export const ErrorState = ({ text = 'Something went wrong.' }) => <div className="state-box error">{text}</div>;
