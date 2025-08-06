function doGet(e) {
  const action = e.parameter.action;
  if (action === "getRecipients") {
    return ContentService.createTextOutput(JSON.stringify(getRecipients()))
      .setMimeType(ContentService.MimeType.JSON);
  } else if (action === "getIDs") {
    const recipientLabel = e.parameter.recipient;
    return ContentService.createTextOutput(JSON.stringify(getIDsByRecipient(recipientLabel)))
      .setMimeType(ContentService.MimeType.JSON);
  } else if (action === "getUser") {
    const idNumber = e.parameter.id;
    return ContentService.createTextOutput(JSON.stringify(getUserByID(idNumber)))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(
    JSON.stringify({ error: "Invalid action" })
  ).setMimeType(ContentService.MimeType.JSON);
}

function getRecipients() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const listSheet = ss.getSheetByName("list");
  const values = listSheet.getRange("A2:A").getValues().flat().filter(String);
  return values;
}

function getIDsByRecipient(recipientLabel) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("requestData");
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const recipientIndex = headers.indexOf("recipientLabel");
  const idIndex = headers.indexOf("idNumber");

  if (recipientIndex === -1 || idIndex === -1) return [];

  return data
    .filter(row => row[recipientIndex] === recipientLabel)
    .map(row => row[idIndex]);
}

function getUserByID(idNumber) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("requestData");
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();

  const indexMap = {};
  headers.forEach((h, i) => (indexMap[h] = i));

  const user = data.find(row => row[indexMap["idNumber"]] === idNumber);
  if (!user) return null;

  return {
    firstName: user[indexMap["firstName"]],
    lastName: user[indexMap["lastName"]],
    phone: user[indexMap["phone"]],
    email: user[indexMap["email"]],
    idNumber: user[indexMap["idNumber"]],
    recipientLabel: user[indexMap["recipientLabel"]],
  };
}
//https://script.google.com/macros/s/AKfycbzD1onR9Qg1p5ZhFjh01eMcuKPMeVe0xbSS8-YSPuD_8Hyaxdd-1f2ZIEKNAHKan6e3/exec
