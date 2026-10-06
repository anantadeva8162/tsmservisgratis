const SHEET_NAME = "Sheet1";

function doGet() {
  return ContentService
    .createTextOutput("TSM CLEAN Web App Aktif")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {

    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error("Sheet '" + SHEET_NAME + "' tidak ditemukan.");
    }

    let data = {};

    // Jika data dikirim sebagai JSON
    if (
      e.postData &&
      e.postData.contents &&
      e.postData.type &&
      e.postData.type.indexOf("application/json") !== -1
    ) {
      data = JSON.parse(e.postData.contents);
    } 
    
    // Jika dikirim sebagai form
    else {
      data = e.parameter;
    }

    const nama = data.nama || "";
    const whatsapp = data.whatsapp || "";
    const merk = data.merk || "";
    const nopol = data.nopol || "";

    if (!nama || !whatsapp || !merk || !nopol) {
      throw new Error("Data belum lengkap.");
    }

    // Header otomatis
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "NO",
        "WAKTU",
        "NAMA",
        "WHATSAPP",
        "MERK SEPEDA MOTOR",
        "NOPOL"
      ]);
    }

    const nomor = Math.max(1, sheet.getLastRow());

    sheet.appendRow([
      nomor,
      new Date(),
      nama,
      whatsapp,
      merk,
      nopol
    ]);

    return ContentService
      .createTextOutput("SUCCESS")
      .setMimeType(ContentService.MimeType.TEXT);

  } catch (error) {

    return ContentService
      .createTextOutput("ERROR: " + error.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
