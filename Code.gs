// ======================================================
// SISTEM PENDAFTARAN KENDARAAN
// GOOGLE APPS SCRIPT
// ======================================================


// ======================================================
// KONFIGURASI
// ======================================================

// ID Google Spreadsheet kamu
const SPREADSHEET_ID =
  '1wKk0eJ-iB3i1OB5c97ccatff7UkNheQwGJDLQIqxLE4';

// Nama sheet untuk menyimpan data
const SHEET_NAME =
  'DATA PENDAFTAR';

// URL Web App kamu
const WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbwrhhS7VFrOi__IJ9B7ADVOjv2_1me8pzOuMWoCM7xzF70d2YyseNo0hHiMiO6tn-me/exec';


// ======================================================
// MEMBUKA HALAMAN WEB
// ======================================================

function doGet() {

  return HtmlService
    .createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Pendaftaran Kendaraan')
    .setXFrameOptionsMode(
      HtmlService.XFrameOptionsMode.ALLOWALL
    );

}


// ======================================================
// MEMANGGIL FILE HTML
// Digunakan untuk CSS.html dan JS.html
// ======================================================

function include(filename) {

  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent();

}


// ======================================================
// MENGAMBIL URL WEB APP
// ======================================================

function getWebAppUrl() {

  return WEB_APP_URL;

}


// ======================================================
// MENYIMPAN DATA PENDAFTAR
// ======================================================

function simpanData(data) {

  try {

    // ----------------------------------------------
    // CEK DATA
    // ----------------------------------------------

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
        'Semua kolom wajib diisi.'
      );

    }


    // ----------------------------------------------
    // BUKA SPREADSHEET
    // ----------------------------------------------

    const spreadsheet =
      SpreadsheetApp.openById(
        SPREADSHEET_ID
      );


    // ----------------------------------------------
    // CARI SHEET
    // ----------------------------------------------

    let sheet =
      spreadsheet.getSheetByName(
        SHEET_NAME
      );


    // ----------------------------------------------
    // JIKA SHEET BELUM ADA
    // BUAT OTOMATIS
    // ----------------------------------------------

    if (!sheet) {

      sheet =
        spreadsheet.insertSheet(
          SHEET_NAME
        );

    }


    // ----------------------------------------------
    // BUAT HEADER JIKA BELUM ADA
    // ----------------------------------------------

    if (sheet.getLastRow() === 0) {

      sheet.appendRow([

        'NO',

        'WAKTU DAFTAR',

        'NOMOR WHATSAPP',

        'NAMA',

        'MERK / TIPE SEPEDA MOTOR',

        'NOMOR POLISI'

      ]);


      // Format header

      const header =
        sheet.getRange(
          1,
          1,
          1,
          6
        );


      header.setFontWeight('bold');

      header.setBackground(
        '#111111'
      );

      header.setFontColor(
        '#D4AF37'
      );


      sheet.setFrozenRows(1);

    }


    // ----------------------------------------------
    // LOCK
    // Supaya data tidak bentrok
    // ketika banyak orang daftar
    // ----------------------------------------------

    const lock =
      LockService.getScriptLock();


    lock.waitLock(10000);


    try {

      // --------------------------------------------
      // NOMOR PENDAFTARAN
      // --------------------------------------------

      const lastRow =
        sheet.getLastRow();


      const nomor =
        lastRow < 2
          ? 1
          : lastRow;



      // --------------------------------------------
      // WAKTU
      // --------------------------------------------

      const waktu =
        new Date();



      // --------------------------------------------
      // DATA YANG DISIMPAN
      // --------------------------------------------

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


    // ----------------------------------------------
    // BERHASIL
    // ----------------------------------------------

    return {

      success: true,

      message:
        'Pendaftaran berhasil disimpan!'

    };


  } catch (error) {


    // ----------------------------------------------
    // ERROR
    // ----------------------------------------------

    return {

      success: false,

      message:
        error.message

    };

  }

}


// ======================================================
// MEMBUAT SHEET SECARA OTOMATIS
// Jalankan fungsi ini SATU KALI
// ======================================================

function buatSheet() {

  const spreadsheet =
    SpreadsheetApp.openById(
      SPREADSHEET_ID
    );


  let sheet =
    spreadsheet.getSheetByName(
      SHEET_NAME
    );


  // ----------------------------------------------
  // BUAT SHEET JIKA BELUM ADA
  // ----------------------------------------------

  if (!sheet) {

    sheet =
      spreadsheet.insertSheet(
        SHEET_NAME
      );

  }


  // ----------------------------------------------
  // BUAT HEADER
  // ----------------------------------------------

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


  // ----------------------------------------------
  // FORMAT HEADER
  // ----------------------------------------------

  const header =
    sheet.getRange(
      1,
      1,
      1,
      6
    );


  header.setFontWeight('bold');

  header.setBackground(
    '#111111'
  );

  header.setFontColor(
    '#D4AF37'
  );


  sheet.setFrozenRows(1);


  // ----------------------------------------------
  // FORMAT KOLOM WAKTU
  // ----------------------------------------------

  if (sheet.getMaxRows() > 1) {

    sheet
      .getRange(
        2,
        2,
        sheet.getMaxRows() - 1,
        1
      )
      .setNumberFormat(
        'dd/MM/yyyy HH:mm:ss'
      );

  }


  // ----------------------------------------------
  // ATUR LEBAR KOLOM
  // ----------------------------------------------

  sheet.setColumnWidth(
    1,
    60
  );

  sheet.setColumnWidth(
    2,
    160
  );

  sheet.setColumnWidth(
    3,
    160
  );

  sheet.setColumnWidth(
    4,
    180
  );

  sheet.setColumnWidth(
    5,
    220
  );

  sheet.setColumnWidth(
    6,
    160
  );


  Logger.log(
    'Sheet berhasil dibuat.'
  );

}


// ======================================================
// TEST KONEKSI
// Gunakan untuk memastikan Spreadsheet terhubung
// ======================================================

function testKoneksi() {

  const spreadsheet =
    SpreadsheetApp.openById(
      SPREADSHEET_ID
    );


  Logger.log(
    'Nama Spreadsheet: ' +
    spreadsheet.getName()
  );


  Logger.log(
    'URL Web App: ' +
    WEB_APP_URL
  );


  return {

    success: true,

    spreadsheet:
      spreadsheet.getName(),

    webApp:
      WEB_APP_URL

  };

}
