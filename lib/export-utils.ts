/**
 * Client-side export utilities for CSV, PDF (via print), and printing
 */

/** Convert an array of objects to CSV string and trigger download */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  columns: { key: keyof T; header: string }[],
  filename: string
) {
  if (data.length === 0) return

  const headers = columns.map(c => `"${c.header}"`).join(",")
  const rows = data.map(row =>
    columns.map(c => {
      const val = row[c.key]
      const str = val === null || val === undefined ? "" : String(val)
      return `"${str.replace(/"/g, '""')}"`
    }).join(",")
  )

  const csv = [headers, ...rows].join("\n")
  downloadBlob(csv, `${filename}.csv`, "text/csv;charset=utf-8;")
}

/** Generate a printable HTML table and trigger browser print dialog */
export function exportToPrintableHTML<T extends Record<string, unknown>>(
  data: T[],
  columns: { key: keyof T; header: string }[],
  title: string,
  subtitle?: string
) {
  const headerRow = columns.map(c => `<th style="border:1px solid #ccc;padding:8px;text-align:left;background:#f5f5f5;">${c.header}</th>`).join("")
  const bodyRows = data.map(row =>
    `<tr>${columns.map(c => {
      const val = row[c.key]
      const str = val === null || val === undefined ? "" : String(val)
      return `<td style="border:1px solid #ccc;padding:8px;">${str}</td>`
    }).join("")}</tr>`
  ).join("")

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { margin-bottom: 4px; }
        h3 { color: #666; margin-top: 0; font-weight: normal; }
        table { border-collapse: collapse; width: 100%; margin-top: 16px; }
        .meta { color: #666; font-size: 12px; margin-bottom: 10px; }
        @media print { button { display: none; } }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      ${subtitle ? `<h3>${subtitle}</h3>` : ""}
      <div class="meta">Generated: ${new Date().toLocaleString()} | Philippine General Hospital</div>
      <table>
        <thead><tr>${headerRow}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </body>
    </html>
  `

  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }
}

/** Print a single document/record as a formatted page */
export function printDocument(content: {
  title: string
  hospitalName?: string
  fields: { label: string; value: string }[]
  footer?: string
}) {
  const fieldsHtml = content.fields
    .map(f => `<tr><td style="padding:6px 12px;font-weight:bold;width:200px;border-bottom:1px solid #eee;">${f.label}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;">${f.value}</td></tr>`)
    .join("")

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${content.title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 16px; margin-bottom: 20px; }
        .header h2 { margin: 0; }
        .header p { margin: 4px 0; color: #666; }
        table { width: 100%; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
        .signature { margin-top: 60px; display: flex; justify-content: space-between; }
        .sig-line { border-top: 1px solid #333; width: 200px; text-align: center; padding-top: 4px; font-size: 12px; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>${content.hospitalName ?? "Philippine General Hospital"}</h2>
        <p>Taft Avenue, Ermita, Manila 1000</p>
        <p style="font-size:14px;margin-top:12px;font-weight:bold;">${content.title}</p>
      </div>
      <table>${fieldsHtml}</table>
      <div class="signature">
        <div class="sig-line">Prepared By</div>
        <div class="sig-line">Authorized Signature</div>
      </div>
      ${content.footer ? `<div class="footer">${content.footer}</div>` : ""}
    </body>
    </html>
  `

  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob(["\uFEFF" + content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
