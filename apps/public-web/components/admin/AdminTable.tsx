import { AcademicCard } from "@/components/ui/AcademicCard";

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export function AdminTable<T>({
  columns,
  data,
  emptyMessage = "No records found.",
}: AdminTableProps<T>) {
  return (
    <AcademicCard className="overflow-x-auto p-0">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-ivory">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-4 py-3 font-medium text-navy"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={index}
                className="border-b border-border last:border-0"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-gray-700">
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </AcademicCard>
  );
}
