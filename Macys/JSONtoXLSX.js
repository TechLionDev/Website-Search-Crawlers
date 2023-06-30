const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const clc = require('cli-color');
const error = clc.red.bold;
const info = clc.cyan.bold;
const success = clc.green.bold;

// Specify the folder paths
const jsonFolderPath = './products';
const excelFolderPath = './Excel';

// Get the current date for the subfolder
const currentDate = new Date();
const dateFolderName = currentDate.toLocaleDateString().replaceAll('/', '_');
const excelSubFolderPath = path.join(excelFolderPath, dateFolderName);

// Create the Excel subfolder if it doesn't exist
fs.mkdirSync(excelSubFolderPath, { recursive: true });

// Read JSON files in the subfolder corresponding to the current date
fs.readdir(path.join(jsonFolderPath, dateFolderName), (err, files) => {
  if (err) {
    console.log(error('(⬣) Error reading folder:', err));
    return;
  }
  

  files.forEach((file) => {
    if (file.endsWith('.json')) {
      console.log(info(`(i) Converting ${file}...\n`));
      const jsonFilePath = path.join(jsonFolderPath, dateFolderName, file);
      const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
      const jsonData = JSON.parse(jsonContent);

      // Convert JSON data to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(jsonData);

      // Create a new workbook and add the worksheet to it
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Raw Data');

      // Save the XLSX file in the subfolder with the same name as the JSON file
      const xlsxFileName = `${path.parse(file).name}.xlsx`;
      const xlsxFilePath = path.join(excelSubFolderPath, xlsxFileName);
      XLSX.writeFile(workbook, xlsxFilePath);

      console.log(success(`(✓) Converted ${file} to ${xlsxFileName}\n______________________________________________________\n`));
    }
  });
});
