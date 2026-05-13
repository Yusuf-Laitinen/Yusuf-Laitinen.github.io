/**
 * Reads the text content of a Google Doc
 * @param {string} docId - The ID of the Google Doc
 * @return {string} - The full text content
 */
function readDoc(docId) {
  var doc = DocumentApp.openById(docId);
  var body = doc.getBody();
  return body.getText();
}

/**
 * Overwrites a Google Doc with new content
 * @param {string} docId - The ID of the Google Doc
 * @param {string} content - The text to write into the document
 * @return {string} - Confirmation message
 */
function writeDoc(docId, content) {
  var doc = DocumentApp.openById(docId);
  var body = doc.getBody();
  body.clear(); // Remove all existing content
  body.setText(content);
  return "Document updated successfully.";
}

/**
 * Main entry point for web requests (GET for reading, POST for writing)
 */
function doGet(e) {
  var docId = e.parameter.docId;
  if (!docId) {
    return ContentService.createTextOutput("Missing docId parameter").setMimeType(ContentService.MimeType.TEXT);
  }
  var text = readDoc(docId);
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  var docId = e.parameter.docId;
  var content = e.parameter.content;
  if (!docId || content === undefined) {
    return ContentService.createTextOutput("Missing docId or content").setMimeType(ContentService.MimeType.TEXT);
  }
  var result = writeDoc(docId, content);
  return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.TEXT);
}
