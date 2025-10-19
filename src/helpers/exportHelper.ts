/**
 * Export Helper Functions
 * Provides utilities to export data to various formats (CSV, Excel, JSON)
 * Practical Week 8 - Templating Concepts
 */

/**
 * Export data to CSV format
 */
export function exportToCSV(data: any[], fields?: string[]): string {
  if (data.length === 0) {
    return '';
  }

  // Determine fields from first object if not provided
  const headers = fields || Object.keys(data[0]);

  // Create CSV header
  const csvHeader = headers.join(',');

  // Create CSV rows
  const csvRows = data.map((row) => {
    return headers
      .map((field) => {
        const value = row[field];
        // Handle values that contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      })
      .join(',');
  });

  return [csvHeader, ...csvRows].join('\n');
}

/**
 * Export data to Excel format (XLSX)
 * Note: This creates a simplified Excel format. For production, use a library like xlsx
 */
export function exportToExcel(data: any[], _sheetName = 'Sheet1'): Blob {
  // For now, create a CSV that Excel can open
  // In production, you'd use the 'xlsx' library
  const csv = exportToCSV(data);

  // Create a blob with CSV content and Excel MIME type
  const blob = new Blob([csv], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  return blob;
}

/**
 * Export data to JSON format
 */
export function exportToJSON(data: any[]): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Download a file with given content
 */
export function downloadFile(content: string | Blob, filename: string): void {
  const blob
    = content instanceof Blob ? content : new Blob([content], { type: 'text/plain' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data to CSV and download
 */
export function downloadCSV(data: any[], filename = 'export.csv', fields?: string[]): void {
  const csv = exportToCSV(data, fields);
  downloadFile(csv, filename);
}

/**
 * Export data to Excel and download
 */
export function downloadExcel(data: any[], filename = 'export.xlsx', sheetName?: string): void {
  const blob = exportToExcel(data, sheetName);
  downloadFile(blob, filename);
}

/**
 * Export data to JSON and download
 */
export function downloadJSON(data: any[], filename = 'export.json'): void {
  const json = exportToJSON(data);
  downloadFile(json, filename);
}

/**
 * Copy data to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
