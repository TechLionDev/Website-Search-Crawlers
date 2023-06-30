const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Specify the folder paths
const jsonFolderPath = './products';
const excelFolderPath = './Excel';

// Create the Excel folder if it doesn't exist
if (!fs.existsSync(excelFolderPath)) {
  fs.mkdirSync(excelFolderPath);
}

// Read all JSON files in the products folder
fs.readdir(jsonFolderPath, (err, files) => {
  if (err) {
    console.error('Error reading folder:', err);
    return;
  }

  files.forEach((file) => {
    if (file.endsWith('.json')) {
      const jsonFilePath = path.join(jsonFolderPath, file);
      const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
      const jsonData = JSON.parse(jsonContent);

      // Convert JSON data to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(jsonData);

      // Create a new workbook and add the worksheet to it
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // Save the XLSX file in the Excel folder with the same name as the JSON file
      const xlsxFileName = `${path.parse(file).name}.xlsx`;
      const xlsxFilePath = path.join(excelFolderPath, xlsxFileName);
      XLSX.writeFile(workbook, xlsxFilePath);

      console.log(`Converted ${file} to ${xlsxFileName}`);
    }
  });
});
