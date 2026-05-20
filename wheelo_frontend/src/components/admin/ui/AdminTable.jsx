export default function AdminTable({ columns, data, emptyText = 'No data found.' }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #2A2A2A' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#111111', borderBottom: '1px solid #2A2A2A' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest whitespace-nowrap"
                  style={{ color: '#B0B0B0' }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!data?.length ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-12 text-sm"
                  style={{ color: '#B0B0B0', background: '#1A1A1A' }}
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={row.id ?? i}
                  style={{
                    background: '#1A1A1A',
                    borderBottom: '1px solid #2A2A2A',
                  }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 whitespace-nowrap" style={{ color: '#B0B0B0' }}>
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
