/**
 * Google Apps Script backend for the date app (free, no database).
 *
 * Setup:
 *   1. Create a Google Sheet.
 *   2. Extensions → Apps Script. Delete any code, paste THIS file, Save.
 *   3. Deploy → New deployment → type "Web app".
 *        - Execute as: Me
 *        - Who has access: Anyone
 *      Deploy, authorize, and COPY the Web app URL.
 *   4. In Vercel → project → Settings → Environment Variables, add:
 *        SHEET_WEBAPP_URL = <the Web app URL>
 *      Redeploy. The /admin page now shows responses from all devices, and they
 *      also appear in the "Responses" tab of your sheet.
 */

var SHEET_NAME = "Responses";

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["at", "answer", "day", "time", "activity"]);
  }
  return sheet;
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doPost(e) {
  var sheet = getSheet();
  var action = e && e.parameter && e.parameter.action;

  if (action === "clear") {
    var last = sheet.getLastRow();
    if (last > 1) sheet.deleteRows(2, last - 1);
    return jsonOut({ ok: true, cleared: true });
  }

  var body = {};
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    // ignore malformed body
  }
  sheet.appendRow([
    body.at || new Date().toISOString(),
    body.answer || "yes",
    body.day || "",
    body.time || "",
    body.activity || "",
  ]);
  return jsonOut({ ok: true });
}

function doGet(e) {
  var sheet = getSheet();
  var values = sheet.getDataRange().getValues();
  var rows = values
    .slice(1)
    .map(function (r) {
      return { at: r[0], answer: r[1], day: r[2], time: r[3], activity: r[4] };
    })
    .reverse(); // newest first
  return jsonOut({ responses: rows });
}
