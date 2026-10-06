const SHEET_NAME = "PENDAFTARAN";
const MAX_QUOTA = 50;

function doGet(e) {
  const action = e && e.parameter ? e.parameter.action : "";
  if (action === "count") return json_(getCount_());
  return json_({ ok: true, service: "SERVICE GRATIS SMKN 1 DOKO", quota: MAX_QUOTA, count: getCount_().count });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    const data = JSON.parse((e.postData && e.postData.contents) || "{}");
    const email = clean_(data.email);
    const nama = clean_(data.nama);
    const merk = clean_(data.merk);
    const nopol = clean_(data.nopol).toUpperCase();
    const stnk = clean_(data.stnk);

    if (!email || !nama || !merk || !nopol || !stnk) {
      return json_({ ok: false, message: "Semua data wajib diisi." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json_({ ok: false, message: "Format email tidak valid." });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getSheet_(ss);
    const lastRow = sheet.getLastRow();
    const count = Math.max(0, lastRow - 1);
    if (count >= MAX_QUOTA) return json_({ ok: false, full: true, count: MAX_QUOTA, message: "Kuota sudah penuh." });

    // Cegah email yang sama mendaftar dua kali.
    if (lastRow > 1) {
      const emails = sheet.getRange(2, 2, lastRow - 1, 1).getValues().flat().map(String);
      if (emails.some(v => v.toLowerCase() === email.toLowerCase())) {
        return json_({ ok: false, message: "Email tersebut sudah terdaftar." });
      }
    }

    const queue = count + 1;
    sheet.appendRow([new Date(), email, nama, merk, nopol, stnk, queue]);
    return json_({ ok: true, queue: queue, count: queue, quota: MAX_QUOTA });
  } catch (err) {
    return json_({ ok: false, message: "Terjadi kesalahan server: " + err.message });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function getSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["WAKTU", "EMAIL", "NAMA", "MERK / TYPE", "NOPOL", "ATAS NAMA STNK", "NO. PESERTA"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getCount_() {
  const sheet = getSheet_(SpreadsheetApp.getActiveSpreadsheet());
  return { ok: true, count: Math.min(Math.max(sheet.getLastRow() - 1, 0), MAX_QUOTA), quota: MAX_QUOTA };
}

function clean_(value) {
  return String(value == null ? "" : value).trim();
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
