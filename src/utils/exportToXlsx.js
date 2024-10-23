import { utils, writeFile } from "xlsx";

export function exportToXlsx(data, reportName) {
  // Create a new workbook
  const workbook = utils.book_new();

  // Convert the object data to a worksheet
  const worksheet = utils.json_to_sheet(data);

  // Set the header styles
  const headerStyle = {
    font: { bold: true, sz: 14 }
  };

  // Apply styles to the header row
  Object.keys(worksheet).forEach(cell => {
    if (cell.startsWith("A1:")) {
      worksheet[cell].s = headerStyle;
    }
  });

  // Add the worksheet to the workbook
  utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Generate the Excel file
  const today = new Date();
  const dateString = today
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "_"); // Replace dashes with underscores

   const fileName = `reporte_${reportName}_${dateString}.xlsx`;
//   writeFile(workbook, `reporte_${dateString}.xlsx`, {
//     bookType: "xlsx",
//     type: "buffer"
//   });
    return [workbook,  fileName]
}
