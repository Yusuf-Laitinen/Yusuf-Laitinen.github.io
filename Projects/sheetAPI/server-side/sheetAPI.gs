const url = ScriptApp.getService().getUrl(); // This gets the URL of the deployed web app

function doGet(e) {
  var action = e.parameter.action; // Get the action parameter from the query

  if (action === 'getSheetNames') {
    return getSheetNames(); // Call the function to return sheet names
  }

  var user = e.parameter.user; // Get the sheet name from the query parameters
  if (!user) {
    return ContentService.createTextOutput("User parameter is missing").setStatusCode(400);
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(user); // Use 'user' as sheet name
  if (!sheet) {
    return ContentService.createTextOutput("Sheet not found").setStatusCode(404);
  }

  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();

  var headers = values[0]; // Assuming the first row contains headers
  var jsonData = [];

  // Iterate through all rows and cells to create JSON output
  for (var i = 1; i < values.length; i++) { // Start from 1 to skip header row
    var row = {};
    for (var j = 0; j < values[i].length; j++) {
      row[headers[j]] = values[i][j];
    }
    jsonData.push(row);
  }

  return ContentService.createTextOutput(JSON.stringify(jsonData)).setMimeType(ContentService.MimeType.JSON);
}


const doPost = (request = {}) => {
  const { postData: { contents, type } = {} } = request;
  var data = parseFormData(contents);
  if (!data.user) {
    return ContentService.createTextOutput("User not specified").setStatusCode(400);
  }
  if (typeof data.row === 'undefined') {
    appendToGoogleSheet(data, data.user);
  } else {
    writeToRowInGoogleSheet(data, data.user, parseInt(data.row));
  }
  return ContentService.createTextOutput(contents).setMimeType(ContentService.MimeType.JSON);
};

function parseFormData(postData) {
  var data = {};
  var parameters = postData.split('&');
  for (var i = 0; i < parameters.length; i++) {
    var keyValue = parameters[i].split('=');
    data[keyValue[0]] = decodeURIComponent(keyValue[1]);
  }
  return data;
}

function appendToGoogleSheet(data, user) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(user); // Use 'user' as sheet name
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(user); // Create new sheet if it doesn't exist
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] || [];
  var rowData = headers.map(headerFld => data[headerFld] || ''); // Handle cases where data doesn't have all headers

  if (data["Timestamp"]) {
    rowData[headers.indexOf("Timestamp")] = new Date();
  }

  sheet.appendRow(rowData);
}

function writeToRowInGoogleSheet(data, user, rowNum) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(user); // Use 'user' as sheet name
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(user); // Create new sheet if it doesn't exist
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] || [];
  var rowData = headers.map(headerFld => data[headerFld] || ''); // Handle cases where data doesn't have all headers

  if (data["Timestamp"]) {
    rowData[headers.indexOf("Timestamp")] = new Date();
  }

  // Ensure rowNum is within valid range
  if (rowNum < 1) {
    rowNum = 1;
  }

  // Write data to specified row
  var targetRange = sheet.getRange(rowNum, 1, 1, rowData.length);
  targetRange.setValues([rowData]);
}

function getSheetNames() {
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  var sheetNames = sheets.map(sheet => sheet.getName());
  return ContentService.createTextOutput(JSON.stringify(sheetNames)).setMimeType(ContentService.MimeType.JSON);
}


