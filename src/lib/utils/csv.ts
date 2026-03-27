export function generateCSV(
  headers: string[],
  rows: string[][]
): string {
  const escapeField = (field: string): string => {
    if (field.includes(",") || field.includes('"') || field.includes("\n")) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  const headerLine = headers.map(escapeField).join(",");
  const dataLines = rows.map((row) => row.map(escapeField).join(","));

  return [headerLine, ...dataLines].join("\n");
}
