const SHEET_NAME = "Sheet1";
const MAX_PENDAFTAR = 60;


// ==========================================
// TEST WEB APP
// ==========================================

function doGet() {

  return ContentService
    .createTextOutput(
      "TSM CLEAN Web App Aktif"
    )
    .setMimeType(
      ContentService.MimeType.TEXT
    );

}


// ==========================================
// MENERIMA PENDAFTARAN DARI WEBSITE
// ==========================================

function doPost(e) {

  try {

    const sheet =
      SpreadsheetApp
        .getActiveSpreadsheet()
        .getSheetByName(SHEET_NAME);


    // CEK SHEET

    if (!sheet) {

      throw new Error(
        "Sheet '" + SHEET_NAME + "' tidak ditemukan."
      );

    }


    // ==========================================
    // AMBIL DATA DARI WEBSITE
    // ==========================================

    const data = e.parameter;

    const nama =
      data.nama || "";

    const whatsapp =
      data.whatsapp || "";

    const merk =
      data.merk || "";

    const nopol =
      data.nopol || "";


    // ==========================================
    // VALIDASI DATA
    // ==========================================

    if (!nama) {
      throw new Error("Nama belum diisi.");
    }

    if (!whatsapp) {
      throw new Error("Nomor WhatsApp belum diisi.");
    }

    if (!merk) {
      throw new Error("Merk sepeda motor belum diisi.");
    }

    if (!nopol) {
      throw new Error("Nomor polisi belum diisi.");
    }


    // ==========================================
    // BUAT HEADER JIKA SHEET MASIH KOSONG
    // ==========================================

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


    // ==========================================
    // HITUNG PENDAFTAR
    // ==========================================

    const jumlahPendaftar =
      Math.max(
        0,
        sheet.getLastRow() - 1
      );


    // ==========================================
    // CEK KUOTA 60
    // ==========================================

    if (jumlahPendaftar >= MAX_PENDAFTAR) {

      return ContentService
        .createTextOutput(
          "KUOTA_PENUH"
        )
        .setMimeType(
          ContentService.MimeType.TEXT
        );

    }


    // ==========================================
    // NOMOR PENDAFTARAN
    // ==========================================

    const nomor =
      jumlahPendaftar + 1;


    // ==========================================
    // SIMPAN KE GOOGLE SHEETS
    // ==========================================

    sheet.appendRow([

      nomor,

      new Date(),

      nama,

      whatsapp,

      merk,

      nopol

    ]);


    // ==========================================
    // BERHASIL
    // ==========================================

    return ContentService
      .createTextOutput(
        "SUCCESS|" + nomor
      )
      .setMimeType(
        ContentService.MimeType.TEXT
      );


  } catch (error) {


    // ==========================================
    // ERROR
    // ==========================================

    return ContentService
      .createTextOutput(
        "ERROR|" + error.message
      )
      .setMimeType(
        ContentService.MimeType.TEXT
      );

  }

}
