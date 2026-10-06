// =====================================================
// KONFIGURASI
// =====================================================

// ID GOOGLE SPREADSHEET KAMU
const SPREADSHEET_ID = '1wKk0eJ-iB3i1OB5c97ccatff7UkNheQwGJDLQIqxLE4';

// Nama sheet tempat data disimpan
const SHEET_NAME = 'DATA PENDAFTAR';

// URL WEB APP KAMU
const WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbwrhhS7VFrOi__IJ9B7ADVOjv2_1me8pzOuMWoCM7xzF70d2YyseNo0hHiMiO6tn-me/exec';


// =====================================================
// MEMBUKA WEBSITE
// =====================================================

function doGet() {

  return HtmlService
    .createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Pendaftaran Kendaraan')
    .setXFrameOptionsMode(
      HtmlService.XFrameOptionsMode.ALLOWALL
    );

}


// =====================================================
// MEMANGGIL FILE HTML
// =====================================================

function include(filename) {

  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent();

}


// =====================================================
// MENDAPATKAN URL WEB APP
// =====================================================

function getWebAppUrl() {

  return WEB_APP_URL;

}


// =====================================================
// MENYIMPAN DATA
// =====================================================

function simpanData(data) {

  try {

    // -----------------------------------------------
    // VALIDASI DATA
    // -----------------------------------------------

    if (!data) {

      throw new Error(
        'Data tidak ditemukan.'
      );

    }


    if (
      !data.whatsapp ||
      !data.nama ||
      !data.motor ||
      !data.polisi
    ) {

      throw new Error(
        'Semua data wajib diisi.'
      );

    }


    // -----------------------------------------------
    // BUKA GOOGLE SHEET
    // -----------------------------------------------

    const spreadsheet =
      SpreadsheetApp.openById(
        SPREADSHEET_ID
      );


    let sheet =
      spreadsheet.getSheetByName(
        SHEET_NAME
      );


    // -----------------------------------------------
    // BUAT SHEET JIKA BELUM ADA
    // -----------------------------------------------

    if (!sheet) {

      sheet =
        spreadsheet.insertSheet(
          SHEET_NAME
        );

      sheet.appendRow([

        'NO',

        'WAKTU DAFTAR',

        'NOMOR WHATSAPP',

        'NAMA',

        'MERK / TIPE SEPEDA MOTOR',

        'NOMOR POLISI'

      ]);


      // Header
      const header =
        sheet.getRange(
          1,
          1,
          1,
          6
        );


      header
        .setFontWeight('bold')
        .setBackground('#111111')
        .setFontColor('#D4AF37');


      sheet.setFrozenRows(1);

    }


    // -----------------------------------------------
    // LOCK
    // Mencegah data bentrok ketika banyak orang
    // mendaftar secara bersamaan
    // -----------------------------------------------

    const lock =
      LockService.getScriptLock();


    lock.waitLock(10000);


    try {

      const lastRow =
        sheet.getLastRow();


      const nomor =
        lastRow < 2
          ? 1
          : lastRow;


      const waktu =
        new Date();


      // ---------------------------------------------
      // SIMPAN DATA
      // ---------------------------------------------

      sheet.appendRow([

        nomor,

        waktu,

        String(data.whatsapp),

        String(data.nama),

        String(data.motor),

        String(data.polisi).toUpperCase()

      ]);


    } finally {

      lock.releaseLock();

    }


    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return {

      success: true,

      message:
        'Pendaftaran berhasil disimpan!'

    };


  } catch (error) {

    return {

      success: false,

      message:
        error.message

    };

  }

}


// =====================================================
// MEMBUAT SHEET
// Jalankan satu kali jika spreadsheet masih kosong
// =====================================================

function buatSheet() {

  const spreadsheet =
    SpreadsheetApp.openById(
      SPREADSHEET_ID
    );


  let sheet =
    spreadsheet.getSheetByName(
      SHEET_NAME
    );


  if (!sheet) {

    sheet =
      spreadsheet.insertSheet(
        SHEET_NAME
      );

  }


  if (sheet.getLastRow() === 0) {

    sheet.appendRow([

      'NO',

      'WAKTU DAFTAR',

      'NOMOR WHATSAPP',

      'NAMA',

      'MERK / TIPE SEPEDA MOTOR',

      'NOMOR POLISI'

    ]);

  }


  const header =
    sheet.getRange(
      1,
      1,
      1,
      6
    );


  header
    .setFontWeight('bold')
    .setBackground('#111111')
    .setFontColor('#D4AF37');


  sheet.setFrozenRows(1);

}
