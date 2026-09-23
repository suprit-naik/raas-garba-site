// Paste into your Google Sheet: Extensions > Apps Script. Then Deploy > New deployment > Web app,
// Execute as: Me, Who has access: Anyone. Copy the web app URL into "sheetUrl" in data/event.json.
// Each booking gets the next ID: RG3-0001, RG3-0002, ...

function handleBooking(data) {
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Time", "Booking ID", "Name", "Phone", "Adults", "Kids", "Amount", "Status"])
    }
    const id = "RG3-" + String(sheet.getLastRow()).padStart(4, "0")
    sheet.appendRow([
      new Date(),
      id,
      data.name || "",
      "'" + (data.phone || ""),
      data.adults || 0,
      data.kids || 0,
      data.total || 0,
      "Check payment"
    ])
    return id
  } finally {
    lock.releaseLock()
  }
}

function doPost(e) {
  try {
    let data = {}
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents)
      } catch (err) {
        data = e.parameter || {}
      }
    } else if (e && e.parameter) {
      data = e.parameter
    }
    const id = handleBooking(data)
    return ContentService.createTextOutput(JSON.stringify({ success: true, id }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function doGet(e) {
  try {
    const data = (e && e.parameter) ? e.parameter : {}
    let id = ""
    if (data.name && data.phone) {
      id = handleBooking(data)
    } else {
      id = "RG3-INFO"
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true, id }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}
