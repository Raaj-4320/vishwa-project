import { EmptyState, LoadingState } from '../common/FeedbackState.jsx';

export const DataTable = ({ columns, rows, emptyText = 'No data available.', loading = false }) => {
  if (loading) return <LoadingState text="Loading data..." />;
  if (!rows.length) return <EmptyState text={emptyText} />;

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>{columns.map((col) => <th key={col.key}>{col.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => <td key={col.key}>{row[col.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
