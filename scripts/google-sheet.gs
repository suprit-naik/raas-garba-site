// Paste into your Google Sheet: Extensions > Apps Script. Then Deploy > New deployment > Web app,
// Execute as: Me, Who has access: Anyone. Copy the web app URL into "sheetUrl" in data/event.json.
// Each booking gets the next ID: RG3-0001, RG3-0002, ...
function doPost(e) {
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const d = JSON.parse(e.postData.contents)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
    if (sheet.getLastRow() === 0) sheet.appendRow(["Time", "Booking ID", "Name", "Phone", "Adults", "Kids", "Amount", "Status"])
    const id = "RG3-" + String(sheet.getLastRow()).padStart(4, "0")
    sheet.appendRow([new Date(), id, d.name, "'" + d.phone, d.adults, d.kids, d.total, "Check payment"])
    return ContentService.createTextOutput(JSON.stringify({ id })).setMimeType(ContentService.MimeType.JSON)
  } finally {
    lock.releaseLock()
  }
}
