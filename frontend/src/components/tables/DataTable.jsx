export const DataTable = ({ columns, rows, emptyText = 'No data available.' }) => {
  if (!rows.length) return <div className="empty">{emptyText}</div>;
  return (
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
  );
};
